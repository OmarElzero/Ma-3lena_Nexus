"""
Storage module for handling file uploads to Cloudflare R2 or alternative services.

This module provides a unified interface for storing and retrieving 3D model files
and other assets required by the Ma-3lena Nexus platform.

Cloudflare R2 is an S3-compatible storage service with a generous free tier:
- 10GB of storage
- 10 million Class A operations per month
- 1 million Class B operations per month
- Free egress (no bandwidth charges)
"""
import os
import logging
import uuid
import boto3
import json
import tempfile
import mimetypes
from urllib.parse import urlparse
from botocore.exceptions import ClientError, NoCredentialsError
from django.conf import settings
from django.utils import timezone

# Configure logging
logger = logging.getLogger(__name__)

class StorageManager:
    """
    Storage manager for handling file uploads to cloud storage services.
    
    Currently supports:
    - Cloudflare R2 (using S3-compatible API)
    - Local filesystem (for development)
    """
    
    def __init__(self, service_type='r2'):
        """
        Initialize the storage manager.
        
        Args:
            service_type: The type of storage service to use ('r2', 'local', etc.)
        """
        self.service_type = service_type
        self.client = None
        self.initialized = False
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the appropriate storage client based on service type."""
        try:
            if self.service_type == 'r2':
                # Get configuration from settings (which loads from environment)
                self.endpoint_url = getattr(settings, 'CLOUDFLARE_R2_ENDPOINT', '')
                self.access_key = getattr(settings, 'CLOUDFLARE_R2_ACCESS_KEY', '')
                self.secret_key = getattr(settings, 'CLOUDFLARE_R2_SECRET_KEY', '')
                self.bucket_name = getattr(settings, 'CLOUDFLARE_R2_BUCKET', 'nexus-models')
                
                # For development, use mock if credentials are not available
                if not all([self.endpoint_url, self.access_key, self.secret_key]):
                    logger.warning("R2 credentials not found, using mock storage implementation")
                    self.initialized = False
                    return
                
                # Initialize boto3 client for S3-compatible API
                try:
                    self.client = boto3.client(
                        's3',
                        endpoint_url=self.endpoint_url,
                        aws_access_key_id=self.access_key,
                        aws_secret_access_key=self.secret_key,
                        region_name='auto'  # Cloudflare R2 uses 'auto' region
                    )
                    
                    # Create bucket if it doesn't exist
                    self._ensure_bucket_exists()
                    
                    # Set the base URL for CDN access
                    self.cdn_base_url = getattr(settings, 'CLOUDFLARE_R2_CDN_URL', '')
                    if not self.cdn_base_url and self.endpoint_url:
                        # If no CDN URL is specified, use direct R2 URL
                        self.cdn_base_url = f"{self.endpoint_url}/{self.bucket_name}"
                    
                    logger.info(f"Successfully connected to Cloudflare R2 bucket: {self.bucket_name}")
                    self.initialized = True
                    
                except NoCredentialsError:
                    logger.error("Invalid Cloudflare R2 credentials")
                    self.initialized = False
                except ClientError as e:
                    logger.error(f"Cloudflare R2 client error: {e}")
                    self.initialized = False
                
            elif self.service_type == 'local':
                # For local filesystem storage
                self.storage_path = os.path.join(settings.BASE_DIR, 'media', 'models')
                os.makedirs(self.storage_path, exist_ok=True)
                
                # Base URL for accessing files
                self.cdn_base_url = getattr(settings, 'MEDIA_URL', '/media/')
                logger.info(f"Using local filesystem storage at: {self.storage_path}")
                self.initialized = True
                
            else:
                raise ValueError(f"Unsupported storage service type: {self.service_type}")
                
        except Exception as e:
            logger.error(f"Failed to initialize storage client: {str(e)}")
            self.initialized = False
    
    def _ensure_bucket_exists(self):
        """Ensure the storage bucket exists, creating it if necessary."""
        if not self.client:
            return
            
        try:
            self.client.head_bucket(Bucket=self.bucket_name)
            logger.debug(f"Bucket {self.bucket_name} exists")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            # If the bucket doesn't exist, create it
            if error_code == '404':
                logger.info(f"Creating bucket: {self.bucket_name}")
                
                try:
                    # Create the bucket with public-read ACL (if supported)
                    self.client.create_bucket(
                        Bucket=self.bucket_name,
                        CreateBucketConfiguration={'LocationConstraint': 'auto'}
                    )
                    logger.info(f"Bucket {self.bucket_name} created successfully")
                except ClientError as create_error:
                    logger.error(f"Failed to create bucket: {create_error}")
                    raise
            else:
                logger.error(f"Error checking bucket: {error_code}")
                raise
                
    def is_ready(self):
        """Check if the storage manager is properly initialized."""
        return self.initialized
    
    def upload_file(self, file_data, file_name=None, content_type=None, folder='models', metadata=None):
        """
        Upload a file to storage.
        
        Args:
            file_data: The file data to upload (bytes or file-like object)
            file_name: Optional name for the file (if not provided, a UUID will be used)
            content_type: MIME type of the file
            folder: Folder to store the file in
            metadata: Optional metadata to attach to the file
            
        Returns:
            Dict with:
                - url: Public URL to access the file
                - key: Storage key/path of the file
                - success: Boolean indicating success
        """
        # Generate a unique filename if none provided
        if not file_name:
            file_name = f"{uuid.uuid4()}.glb"
            
        # Add timestamp to ensure uniqueness
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        path_key = f"{folder}/{timestamp}_{file_name}"
        
        # Set default content type based on file extension
        if not content_type:
            content_type, _ = mimetypes.guess_type(file_name)
            if not content_type and file_name.lower().endswith('.glb'):
                content_type = 'model/gltf-binary'
        
        result = {
            'success': False,
            'key': path_key,
            'url': None,
            'error': None
        }
            
        # Handle based on storage type
        try:
            if not self.initialized:
                # Use mock implementation for development
                mock_url = self._mock_upload_file(file_name, folder)
                result['url'] = mock_url
                result['success'] = True
                return result
            
            if self.service_type == 'r2':
                # Upload to Cloudflare R2
                extra_args = {}
                if content_type:
                    extra_args['ContentType'] = content_type
                
                # Add metadata if provided
                if metadata:
                    extra_args['Metadata'] = {
                        k: str(v) for k, v in metadata.items()
                    }
                
                # Set cache control for CDN
                extra_args['CacheControl'] = 'max-age=31536000'  # 1 year
                
                self.client.upload_fileobj(
                    file_data,
                    self.bucket_name,
                    path_key,
                    ExtraArgs=extra_args
                )
                
                # Generate public URL
                if self.cdn_base_url:
                    url = f"{self.cdn_base_url}/{path_key}"
                else:
                    url = f"https://{self.bucket_name}.r2.cloudflarestorage.com/{path_key}"
                
                result['url'] = url
                result['success'] = True
                return result
                
            elif self.service_type == 'local':
                # Save to local filesystem
                file_path = os.path.join(self.storage_path, path_key)
                
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                # Write the file
                with open(file_path, 'wb') as f:
                    if hasattr(file_data, 'read'):
                        # If file_data is a file-like object
                        f.write(file_data.read())
                    else:
                        # If file_data is bytes
                        f.write(file_data)
                
                # Save metadata if provided
                if metadata:
                    meta_path = f"{file_path}.meta"
                    with open(meta_path, 'w') as f:
                        json.dump(metadata, f)
                
                # Generate URL
                url = f"{self.cdn_base_url}/{path_key}"
                result['url'] = url
                result['success'] = True
                return result
                
        except Exception as e:
            logger.error(f"Failed to upload file: {str(e)}")
            result['error'] = str(e)
            return result
    
    def _mock_upload_file(self, file_name=None, folder='models'):
        """Mock file upload for development."""
        if not file_name:
            file_name = f"{uuid.uuid4()}.glb"
            
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        path_key = f"{folder}/{timestamp}_{file_name}"
        
        return f"https://example-cdn.com/{path_key}"
    
    def download_file(self, file_key):
        """
        Download a file from storage.
        
        Args:
            file_key: The key of the file in storage
            
        Returns:
            Tuple of (file data as bytes, content type) or (None, None) on failure
        """
        if not self.initialized:
            # Return mock data for development
            return b'mock data', 'application/octet-stream'
        
        try:
            if self.service_type == 'r2':
                response = self.client.get_object(
                    Bucket=self.bucket_name,
                    Key=file_key
                )
                
                content = response['Body'].read()
                content_type = response.get('ContentType', 'application/octet-stream')
                return content, content_type
                
            elif self.service_type == 'local':
                file_path = os.path.join(self.storage_path, file_key)
                
                if not os.path.exists(file_path):
                    logger.error(f"File not found: {file_path}")
                    return None, None
                
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                content_type, _ = mimetypes.guess_type(file_path)
                return content, content_type or 'application/octet-stream'
                
        except Exception as e:
            logger.error(f"Failed to download file {file_key}: {str(e)}")
            return None, None
    
    def get_file_url(self, file_key):
        """
        Get the URL for a file.
        
        Args:
            file_key: The key of the file in storage
            
        Returns:
            Public URL to the file
        """
        if not self.initialized:
            return f"https://example-cdn.com/{file_key}"
        
        if self.service_type == 'r2':
            if self.cdn_base_url:
                return f"{self.cdn_base_url}/{file_key}"
            else:
                return f"https://{self.bucket_name}.r2.cloudflarestorage.com/{file_key}"
                
        elif self.service_type == 'local':
            return f"{self.cdn_base_url}/{file_key}"
    
    def get_signed_url(self, file_key, expires_in=3600):
        """
        Generate a signed URL for temporary access to a file.
        
        Args:
            file_key: The key of the file in storage
            expires_in: Expiration time in seconds (default: 1 hour)
            
        Returns:
            Signed URL with temporary access, or None on failure
        """
        if not self.initialized or self.service_type != 'r2':
            # Just return the regular URL for non-R2 storage
            return self.get_file_url(file_key)
            
        try:
            signed_url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=expires_in
            )
            return signed_url
        except Exception as e:
            logger.error(f"Failed to generate signed URL: {str(e)}")
            return None
    
    def delete_file(self, file_key):
        """
        Delete a file from storage.
        
        Args:
            file_key: The key of the file to delete
            
        Returns:
            True if successful, False otherwise
        """
        if not self.initialized:
            return True  # Mock successful deletion
        
        try:
            if self.service_type == 'r2':
                self.client.delete_object(
                    Bucket=self.bucket_name,
                    Key=file_key
                )
                return True
                
            elif self.service_type == 'local':
                file_path = os.path.join(self.storage_path, file_key)
                
                if os.path.exists(file_path):
                    os.remove(file_path)
                    
                    # Also remove metadata file if it exists
                    meta_path = f"{file_path}.meta"
                    if os.path.exists(meta_path):
                        os.remove(meta_path)
                        
                return True
                
        except Exception as e:
            logger.error(f"Failed to delete file {file_key}: {str(e)}")
            return False
            
    def list_files(self, prefix=''):
        """
        List files in storage with an optional prefix.
        
        Args:
            prefix: Optional prefix to filter files (e.g., folder path)
            
        Returns:
            List of file keys, or empty list on failure
        """
        if not self.initialized:
            return []  # Mock empty list for development
            
        try:
            if self.service_type == 'r2':
                response = self.client.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=prefix
                )
                
                if 'Contents' in response:
                    return [item['Key'] for item in response['Contents']]
                return []
                
            elif self.service_type == 'local':
                base_path = os.path.join(self.storage_path, prefix)
                
                if not os.path.exists(base_path):
                    return []
                    
                if os.path.isfile(base_path):
                    # If it's a file, return just this file path
                    rel_path = os.path.relpath(base_path, self.storage_path)
                    return [rel_path]
                
                # Walk directory and get all files
                results = []
                for root, _, files in os.walk(base_path):
                    for file in files:
                        # Skip metadata files
                        if file.endswith('.meta'):
                            continue
                            
                        full_path = os.path.join(root, file)
                        rel_path = os.path.relpath(full_path, self.storage_path)
                        results.append(rel_path)
                        
                return results
                
        except Exception as e:
            logger.error(f"Failed to list files with prefix '{prefix}': {str(e)}")
            return []


# Helper functions
def get_file_key_from_url(url):
    """Extract file key from URL."""
    if not url:
        return None
    
    try:
        parsed = urlparse(url)
        path = parsed.path.lstrip('/')
        
        # Remove bucket name if present in path
        parts = path.split('/', 1)
        if len(parts) > 1:
            return parts[1]
        return path
    except Exception as e:
        logger.error(f"Failed to parse URL {url}: {str(e)}")
        return None

def download_from_url(url, timeout=30):
    """
    Download content from a URL.
    
    Args:
        url: The URL to download from
        timeout: Timeout in seconds
        
    Returns:
        Tuple of (file data as bytes, content type) or (None, None) on failure
    """
    import requests
    
    try:
        response = requests.get(url, timeout=timeout, stream=True)
        response.raise_for_status()
        
        content_type = response.headers.get('Content-Type', 'application/octet-stream')
        content = response.content
        
        return content, content_type
    except Exception as e:
        logger.error(f"Failed to download from URL {url}: {str(e)}")
        return None, None

# Initialize the global storage manager
# First try R2, fallback to local if no credentials
storage_manager = StorageManager(service_type='r2')
if not storage_manager.is_ready():
    logger.info("Falling back to local storage")
    storage_manager = StorageManager(service_type='local')

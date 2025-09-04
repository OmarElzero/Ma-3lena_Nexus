"""
AI Manager for interfacing with AI models in Ma-3lena Nexus.

This module provides a high-level interface to AI capabilities including:
- Content generation
- Scene extraction from lessons
- 3D model generation
"""

import os
import json
import logging
import time
from enum import Enum
from typing import List, Dict, Any, Optional, Tuple
from django.conf import settings
import requests
from mcp.mcp_manager import MCPManager
from .models import ApiUsage
from django.utils import timezone

# Define ToolCallResponse class for MCP interface
class ToolCallResponse:
    """Response from an MCP tool call."""
    
    def __init__(self, success: bool, result: Optional[Dict] = None, error: Optional[str] = None):
        """Initialize the tool call response."""
        self.success = success
        self.result = result or {}
        self.error = error

logger = logging.getLogger(__name__)

class AIModelType(Enum):
    """Types of AI models available."""
    CHAT = "chat"
    VISION = "vision"
    EMBEDDING = "embedding"
    IMAGE = "image"
    AUDIO = "audio"

class AIManager:
    """
    Manager class for AI operations including:
    - Text generation
    - Scene extraction
    - 3D model generation
    - API usage tracking
    """
    
    def __init__(self):
        """Initialize the AI manager with available services."""
        self.openai_api_key = os.environ.get('OPENAI_API_KEY', '')
        config_path = os.path.join(settings.BASE_DIR, 'mcp', 'config.json')
        try:
            self.mcp_manager = MCPManager(config_path)
        except Exception as e:
            logger.error(f"Failed to initialize MCP Manager: {e}")
            self.mcp_manager = None
        self.available_models = self._get_available_models()
        
    def _get_available_models(self) -> Dict[AIModelType, str]:
        """
        Get available AI models based on environment configuration.
        
        Returns:
            Dict mapping model types to model identifiers
        """
        models = {
            AIModelType.CHAT: os.environ.get('AI_CHAT_MODEL', 'gpt-4o-2024-05-13'),
            AIModelType.VISION: os.environ.get('AI_VISION_MODEL', 'gpt-4-vision-preview'),
            AIModelType.EMBEDDING: os.environ.get('AI_EMBEDDING_MODEL', 'text-embedding-3-small'),
            AIModelType.IMAGE: os.environ.get('AI_IMAGE_MODEL', 'dall-e-3'),
            AIModelType.AUDIO: os.environ.get('AI_AUDIO_MODEL', 'whisper-1'),
        }
        return models
        
    def is_ready(self) -> bool:
        """Check if AI services are properly configured."""
        return bool(self.openai_api_key)
        
    def extract_scenes(self, lesson_content: str, user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Extract scenes from lesson content using the MCP manager.
        
        Args:
            lesson_content: The lesson content to extract scenes from
            user_id: Optional user ID for tracking API usage
            
        Returns:
            List of scene dictionaries with name, description
        """
        try:
            if not self.mcp_manager or True:  # Force using OpenAI instead of MCP
                # Use OpenAI directly if available
                if self.openai_api_key:
                    logger.info("Using OpenAI for scene extraction")
                    
                    system_prompt = """You are an expert educational content analyzer. 
Your task is to extract key scenes from educational content that can be visualized as 3D models.
Identify 2-4 concepts from the text that would be interesting and educational to visualize in 3D.
For each scene, provide a name and a detailed description of what the 3D model should show.
Your output should be in valid JSON format containing an array of scenes, each with 'name' and 'description' fields."""
                    
                    user_prompt = f"""Extract 3D visualizable scenes from this educational text:

{lesson_content}

Remember to focus on concepts that can be effectively illustrated in 3D. Return your response as valid JSON."""
                    
                    messages = [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ]
                    
                    response = self._openai_chat_completion(messages, 0.7)
                    if response:
                        try:
                            # Try to extract JSON from the response
                            import re
                            json_match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
                            if json_match:
                                json_str = json_match.group(1)
                            else:
                                json_str = response
                                
                            # Clean up the string to handle potential formatting issues
                            json_str = json_str.strip()
                            if not json_str.startswith('[') and not json_str.startswith('{'):
                                # Try to find the start of JSON
                                json_start = json_str.find('[')
                                if json_start >= 0:
                                    json_str = json_str[json_start:]
                                else:
                                    json_start = json_str.find('{')
                                    if json_start >= 0:
                                        json_str = json_str[json_start:]
                            
                            # Parse the JSON
                            data = json.loads(json_str)
                            
                            # Handle different JSON formats
                            if isinstance(data, dict) and 'scenes' in data:
                                return data['scenes']
                            elif isinstance(data, list):
                                return data
                            else:
                                logger.warning(f"Unexpected JSON structure: {data}")
                                return []
                                
                        except Exception as e:
                            logger.error(f"Error parsing OpenAI response: {str(e)}")
                            logger.error(f"Response was: {response}")
                    
                # Fallback to mock data if OpenAI fails or isn't configured
                logger.warning("Using mock scene extraction")
                return [
                    {
                        "name": "Educational Concept Visualization",
                        "description": "A 3D model illustrating key concepts from the text. The visualization includes interactive elements that highlight important features."
                    }
                ]
            
            # Use MCP to extract scenes
            result = self.mcp_manager.extract_scenes(
                text=lesson_content,
                domain="education",
                audience="general"
            )
            
            # Track API usage
            if user_id:
                # Track API usage
                ApiUsage.objects.create(
                    user_id=user_id,
                    api_name="gemini",
                    endpoint="extract_scenes",
                    tokens_used=len(lesson_content) // 4,  # Rough estimate
                    successful=True
                )
                
            return result
            
        except Exception as e:
            logger.error(f"Error extracting scenes: {str(e)}")
            return []
            
    def refine_prompt(self, scene_description: str, user_id: Optional[int] = None) -> str:
        """
        Refine a scene description into a prompt suitable for 3D generation.
        
        Args:
            scene_description: Raw scene description
            user_id: Optional user ID for tracking API usage
            
        Returns:
            A refined prompt optimized for 3D generation
        """
        try:
            if not self.mcp_manager:
                # Return slightly enhanced description for testing
                logger.warning("Using mock prompt refinement")
                return f"Create a detailed 3D model showing {scene_description} with realistic textures and proper lighting"
            
            # Use MCP to refine prompt
            refined = self.mcp_manager.refine_prompt(
                name="Scene",
                description=scene_description,
                domain="education",
                audience="general"
            )
            
            # Track API usage
            if user_id:
                ApiUsage.objects.create(
                    user_id=user_id,
                    api_name="gemini",
                    endpoint="refine_prompt",
                    tokens_used=len(scene_description) // 4,  # Rough estimate
                    successful=True
                )
                
            return refined or scene_description
            
        except Exception as e:
            logger.error(f"Error refining prompt: {str(e)}")
            return scene_description
            
    def generate_3d_model(self, prompt: str, user_id: Optional[int] = None) -> Tuple[Optional[str], Optional[Dict]]:
        """
        Generate a 3D model based on a text prompt.
        
        Args:
            prompt: Text description of the 3D model to generate
            user_id: Optional user ID for tracking API usage
            
        Returns:
            Tuple of (model URL, metadata) or (None, None) on failure
        """
        try:
            if not self.mcp_manager:
                # Return mock URL for testing
                logger.warning("Using mock 3D model generation")
                return (
                    "https://example.com/mock-3d-model.glb", 
                    {"generation_time": "3.5s", "vertices": 10000, "faces": 5000}
                )
            
            # Use MCP to generate 3D model
            model_url = self.mcp_manager.generate_3d(prompt)
            
            # Track API usage
            if user_id:
                ApiUsage.objects.create(
                    user_id=user_id,
                    api_name="modelslab",
                    endpoint="generate_3d",
                    tokens_used=len(prompt) // 2,  # Higher cost for 3D generation
                    successful=True
                )
                
            if not model_url:
                logger.error("3D model generation failed: No URL returned")
                return None, None
                
            metadata = {
                "generation_time": "5s",
                "polygons": 25000,
                "format": "glb"
            }
            
            return model_url, metadata
            
        except Exception as e:
            logger.error(f"Error generating 3D model: {str(e)}")
            return None, None
            
    def _openai_chat_completion(self, messages: List[Dict[str, str]], temperature: float = 0.7) -> Optional[str]:
        """
        Internal method to get a chat completion response from OpenAI.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Temperature parameter for response randomness
            
        Returns:
            The assistant's response or None on failure
        """
        if not self.openai_api_key:
            logger.error("OpenAI API key not configured")
            return None
            
        try:
            # Use OpenAI API directly for chat completions
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.openai_api_key}"
                },
                json={
                    "model": self.available_models[AIModelType.CHAT],
                    "messages": messages,
                    "temperature": temperature
                },
                timeout=30
            )
            
            response.raise_for_status()
            result = response.json()
            
            return result.get("choices", [{}])[0].get("message", {}).get("content")
            
        except Exception as e:
            logger.error(f"Error in OpenAI chat completion: {str(e)}")
            return None
    
    def chat_completion(self, messages: List[Dict[str, str]], user_id: Optional[int] = None) -> Optional[str]:
        """
        Get a chat completion response from the AI model.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            user_id: Optional user ID for tracking API usage
            
        Returns:
            The assistant's response or None on failure
        """
        if not self.openai_api_key:
            logger.error("OpenAI API key not configured")
            return None
            
        try:
            # Use OpenAI API directly for chat completions
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.openai_api_key}"
                },
                json={
                    "model": self.available_models[AIModelType.CHAT],
                    "messages": messages,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Track API usage
            if user_id:
                # Calculate total prompt tokens
                prompt_text = "\n".join([m["content"] for m in messages])
                
                ApiUsage.objects.create(
                    user_id=user_id,
                    api_name="gemini",  # Assuming gemini is used
                    endpoint="chat_completion",
                    tokens_used=result.get("usage", {}).get("total_tokens", len(prompt_text) // 4),
                    successful=True
                )
                
            return result.get("choices", [{}])[0].get("message", {}).get("content")
            
        except Exception as e:
            logger.error(f"Error in chat completion: {str(e)}")
            return None

# Initialize global AI manager
ai_manager = AIManager()

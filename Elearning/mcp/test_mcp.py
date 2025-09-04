"""
Test script for the MCP integration.
"""
import os
import sys
import json
from pathlib import Path

# Add parent directory to Python path for imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from mcp.mcp_manager import MCPManager

def main():
    """Main test function for MCP integration."""
    config_path = os.path.join(project_root, 'mcp', 'config.json')
    
    try:
        # Initialize the MCP Manager
        mcp_manager = MCPManager(config_path)
        print("MCP Manager initialized successfully!")
        
        # Test the extract_scenes function
        print("\nTesting extract_scenes...")
        sample_text = """
        Mitosis is the process by which a cell duplicates its genetic material before dividing into 
        two daughter cells. The process includes prophase, metaphase, anaphase, and telophase.
        During prophase, chromatin condenses into chromosomes and the nuclear membrane breaks down.
        In metaphase, chromosomes align at the metaphase plate. Anaphase follows with sister chromatids
        separating and moving to opposite poles. Finally, in telophase, nuclear membranes form around
        the separated chromosomes and cytokinesis begins.
        """
        scenes = mcp_manager.extract_scenes(sample_text, "biology", "college")
        print(json.dumps(scenes, indent=2))
        
        # Test the refine_prompt function
        print("\nTesting refine_prompt...")
        if scenes:
            scene = scenes[0]
            refined_prompt = mcp_manager.refine_prompt(
                scene["name"], scene["description"], "biology", "college"
            )
            print(refined_prompt)
        
        # Test the generate_3d function
        print("\nTesting generate_3d...")
        if 'refined_prompt' in locals():
            model_url = mcp_manager.generate_3d(refined_prompt)
            print(f"Generated model URL: {model_url}")
        
        print("\nAll tests completed successfully!")
        
    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

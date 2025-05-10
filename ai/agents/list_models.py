import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API key
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")
genai.configure(api_key=api_key)

# List available models
print("Available Models:")
for model in genai.list_models():
    print(f"Name: {model.name}")
    print(f"Display Name: {model.display_name}")
    print(f"Description: {model.description}")
    print(f"Generation Methods: {model.supported_generation_methods}")
    print("-" * 80)

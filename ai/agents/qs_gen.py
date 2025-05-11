import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Explicitly load .env from the agents directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Look for credentials file - try multiple common locations
def load_credentials():
    """Load credentials from a JSON file if GOOGLE_API_KEY is not set"""
    if GOOGLE_API_KEY:
        return GOOGLE_API_KEY
    
    # List of possible credential file locations
    possible_locations = [
        os.path.join(os.path.dirname(__file__), 'credentials.json'),
        os.path.join(os.path.dirname(__file__), '..', 'credentials.json'),
        os.path.join(os.path.dirname(__file__), '..', 'config', 'credentials.json'),
        os.path.join(Path.home(), '.config', 'google', 'credentials.json'),
        os.path.join(os.getcwd(), 'credentials.json')
    ]
    
    for location in possible_locations:
        if os.path.exists(location):
            try:
                with open(location, 'r') as f:
                    creds = json.load(f)
                    if 'api_key' in creds:
                        print(f"Loaded API key from {location}")
                        return creds['api_key']
            except Exception as e:
                print(f"Error loading credentials from {location}: {e}")
    
    return None

# Try to get API key from environment or credentials file
api_key = GOOGLE_API_KEY or load_credentials()

if not api_key:
    print("WARNING: No Google API key found in .env file or credentials.json")
    print("Please add GOOGLE_API_KEY to your .env file or create a credentials.json file")
else:
    # Configure Gemini API with the found API key
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('models/gemini-2.0-flash')

def setup_agents_and_crew():
    """Setup the agents and crew for test generation"""
    print("Setting up test generation agents...")
    return True

def generate_question_paper(subject, grade_level=10, difficulty="medium", num_questions=10):
    """Generate a question paper for the given subject"""
    print(f"Generating question paper for {subject}...")
    
    if not api_key:
        return {
            "subject": subject,
            "content": "Error: No Google API key found. Please configure your credentials.",
            "num_questions": 0
        }
        
    # Create a prompt for the model
    prompt = f"""Generate a comprehensive question paper for {subject} 
                with {num_questions} questions of {difficulty} difficulty.
                
                Include a variety of question types like short answer, essay, and 
                problem-solving questions appropriate for grade {grade_level}.
                
                For each question, include:
                1. Clear instructions
                2. Appropriate marks allocation
                3. Expected answer points or rubric
                """
    
    try:
        response = model.generate_content(prompt)
        content = response.text
        
        # Format the result
        result = {
            "subject": subject,
            "grade_level": grade_level,
            "difficulty": difficulty,
            "content": content,
            "num_questions": num_questions
        }
        
        return result
    except Exception as e:
        print(f"Error generating question paper: {e}")
        return {
            "subject": subject,
            "content": f"Error generating content: {str(e)}",
            "num_questions": 0
        }
    
if __name__ == "__main__":
    # Test the module
    result = generate_question_paper("Mathematics")
    print(json.dumps(result, indent=2))

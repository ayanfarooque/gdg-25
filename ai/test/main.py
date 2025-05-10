import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini API
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash')

def generate_test(subject, grade_level, topic, question_types, difficulty, number_of_questions, time_limit):
    prompt = f"""Generate a {subject} test for Grade {grade_level} with the following specifications:
    Topic: {topic}
    Question Types: {', '.join(question_types)}
    Difficulty: {difficulty}
    Number of Questions: {number_of_questions}
    Time Limit: {time_limit} minutes

    Please format the output as a JSON object with the following structure:
    {{
        "title": "Test title",
        "questions": [
            {{
                "type": "question type",
                "question": "question text",
                "options": ["option1", "option2", "option3", "option4"] (for MCQs),
                "answer": "correct answer",
                "difficulty": "question difficulty"
            }}
        ],
        "answer_key": "formatted answer key",
        "estimated_time": "time in minutes",
        "total_marks": "total marks",
        "instructions": "test instructions"
    }}
    """

    try:
        response = model.generate_content(prompt)
        
        if not response or not response.text.strip():
            raise Exception("The API returned an empty or invalid response.")
        
        return response.text
    except Exception as e:
        raise Exception(f"Error generating test: {str(e)}")

def save_test_to_json(test_data, subject, filename=None):
    if filename is None:
        filename = f"{subject.lower()}_test.json"
    
    output_dir = "generated_tests"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    filepath = os.path.join(output_dir, filename)
    
    try:
        # Debugging: Log the raw test data
        print(f"Raw test data for {subject}: {test_data}")

        # Clean the test_data string by removing backticks and extra formatting
        cleaned_data = test_data.strip().strip('```json').strip()

        # Debugging: Log the cleaned test data
        print(f"Cleaned test data for {subject}: {cleaned_data}")

        # Parse the cleaned string as JSON to validate it
        json_data = json.loads(cleaned_data)
        
        # Debugging: Log the parsed JSON data
        print(f"Parsed JSON data for {subject}: {json_data}")

        # Write with proper encoding and formatting
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        
        # Debugging: Confirm file save
        print(f"Test saved successfully to {filepath}")
        return filepath
    except json.JSONDecodeError as e:
        raise Exception(f"Invalid JSON data received from API: {str(e)}\nData: {test_data}")
    except Exception as e:
        raise Exception(f"Error saving JSON file: {str(e)}")

def main():
    print("Welcome to the Gemini Test Generator!")
    
    # Test configuration 1 - Mathematics
    test_config_math = {
        "subject": "Mathematics",
        "grade_level": 10,
        "topic": "Quadratic Equations",
        "question_types": ["multiple_choice", "short_answer"],
        "difficulty": "medium",
        "number_of_questions": 5,
        "time_limit": 30
    }

    # Test configuration 2 - Science
    test_config_science = {
        "subject": "Science",
        "grade_level": 9,
        "topic": "Kinematics",
        "question_types": ["multiple_choice", "essay"],
        "difficulty": "hard",
        "number_of_questions": 3,
        "time_limit": 20
    }

    try:
        # Generate Mathematics test
        print("\nGenerating Mathematics Test...")
        math_test = generate_test(**test_config_math)
        print("\nMathematics Test:")
        print(math_test)
        math_file = save_test_to_json(math_test, "Mathematics")
        print(f"Mathematics test saved to: {math_file}")

        # Generate Science test
        print("\nGenerating Science Test...")
        science_test = generate_test(**test_config_science)
        print("\nScience Test:")
        print(science_test)
        science_file = save_test_to_json(science_test, "Science")
        print(f"Science test saved to: {science_file}")

    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()
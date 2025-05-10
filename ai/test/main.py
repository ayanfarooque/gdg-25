import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini API
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/generate-test', methods=['POST'])
def generate_test_route():
    data = request.json
    print(f"Received request from AITestCreator: {data}")
    
    try:
        # Extract all fields from request body
        subject = data.get('subject')
        grade_level = data.get('grade_level')
        topic = data.get('topic')
        question_types = data.get('question_types', [])
        difficulty = data.get('difficulty')
        number_of_questions = data.get('number_of_questions')
        time_limit = data.get('time_limit')
        
        # Validate required fields
        if not all([subject, grade_level, difficulty, number_of_questions, time_limit]):
            missing = []
            if not subject: missing.append("subject")
            if not grade_level: missing.append("grade_level")
            if not difficulty: missing.append("difficulty") 
            if not number_of_questions: missing.append("number_of_questions")
            if not time_limit: missing.append("time_limit")
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
            
        # If question_types is empty, default to multiple_choice
        if not question_types:
            question_types = ["multiple_choice"]
            print("No question types provided, defaulting to multiple_choice")
        
        print(f"Generating {subject} test on {topic} with {question_types} questions")
        
        # Generate the test content
        test_content = generate_test(subject, grade_level, topic, question_types, difficulty, number_of_questions, time_limit)
        
        # Process the content for frontend compatibility
        processed_content = process_test_content(test_content)
        
        # Return the content to be rendered on AITestCreator
        return jsonify({
            "test_content": processed_content, 
            "status": "success",
            "message": f"Successfully generated {subject} test"
        })
    
    except Exception as e:
        print(f"Error in generate_test_route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "status": "error"}), 500

def process_test_content(test_content):
    """Process the raw test content to ensure it's valid JSON and formatted correctly for the frontend"""
    try:
        # Handle markdown code blocks if present
        if "```json" in test_content:
            import re
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```', test_content)
            if json_match:
                test_content = json_match.group(1).strip()
            else:
                test_content = test_content.replace("```json", "").replace("```", "").strip()
        
        # Try parsing the JSON to validate it and identify any issues
        try:
            parsed_json = json.loads(test_content)
            
            # Ensure all required fields are present
            required_fields = ["title", "questions", "answer_key"]
            for field in required_fields:
                if field not in parsed_json:
                    parsed_json[field] = f"Missing {field}" if field != "questions" else []
            
            # Ensure questions have all required fields and correct format
            for i, question in enumerate(parsed_json.get("questions", [])):
                # Add an id if missing
                if "id" not in question:
                    question["id"] = f"q{i+1}"
                
                # Convert type from snake_case to camelCase for frontend compatibility
                if "type" in question:
                    if question["type"] == "multiple_choice":
                        question["type"] = "multipleChoice"
                    elif question["type"] == "short_answer":
                        question["type"] = "shortAnswer"
                    elif question["type"] == "final_answer":
                        question["type"] = "finalanswer"
                
                # Ensure options array exists for multiple choice questions
                if question.get("type") == "multipleChoice" and "options" not in question:
                    question["options"] = ["Option A", "Option B", "Option C", "Option D"]
            
            # Convert back to string for frontend
            return json.dumps(parsed_json)
            
        except json.JSONDecodeError:
            # If parsing fails, try to fix common formatting issues
            test_content = test_content.replace("'", '"')  # Replace single quotes with double quotes
            test_content = test_content.replace('None', 'null')  # Replace Python None with JSON null
            test_content = test_content.replace('True', 'true').replace('False', 'false')  # Fix boolean values
            
            # Try again with fixes
            try:
                json.loads(test_content)  # Just to validate
                return test_content
            except:
                print("Still invalid JSON after attempted fixes")
                return test_content  # Return as is and let frontend handle it
    except Exception as e:
        print(f"Error processing test content: {e}")
    
    return test_content  # Return original content if all processing attempts fail

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


@app.route('/api/download-test', methods=['POST'])
def download_test_route():
    data = request.json
    try:
        test_data = data.get('test_data')
        subject = data.get('subject')
        filename = data.get('filename')
        
        if not test_data:
            return jsonify({"error": "Missing test data", "status": "error"}), 400
        
        # Generate a unique filename if none provided
        if not filename:
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"{subject.lower().replace(' ', '_')}_{timestamp}_test.json"
        
        file_path = save_test_to_json(test_data, subject, filename)
        
        # Return the file with proper headers
        return send_file(
            file_path, 
            as_attachment=True,
            download_name=filename,
            mimetype='application/json'
        )
    except Exception as e:
        print(f"Error in download_test_route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "status": "error"}), 500

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
    """Main function that runs the Flask server to accept inputs from AITestCreator.jsx frontend"""
    print("Starting the Gemini Test Generator API server...")
    print("Waiting for requests from AITestCreator frontend...")
    
    # No default configurations - only process requests from frontend
    try:
        app.run(debug=True, port=5000)
    except Exception as e:
        print(f"Error starting server: {str(e)}")

if __name__ == "__main__":
    main()  # Always run in server mode to receive frontend requests
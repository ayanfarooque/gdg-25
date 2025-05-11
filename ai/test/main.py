import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys

# Add path to qs-gen.py - improve error handling for missing module
try:
    sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'agents'))
    from qs_gen import generate_question_paper, setup_agents_and_crew
    qs_gen_available = True
    print("Successfully imported qs_gen module")
except ImportError:
    qs_gen_available = False
    print("WARNING: qs_gen module not found. Final answer question generation will use fallback method.")

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
    # Convert finalanswer to final_answer for qs-gen compatibility
    question_types = ['final_answer' if qt == 'finalanswer' else qt for qt in question_types]
    
    if "final_answer" in question_types and qs_gen_available:
        try:
            # Get result from qs-gen
            result = generate_question_paper(subject)
            
            # Extract content and format for frontend
            content = result.get('content', '')
            
            # Create a structured response matching frontend expectations
            test_json = {
                "title": f"{subject.title()} Final Answer Test - Grade {grade_level}",
                "questions": [
                    {
                        "id": f"q{i+1}",
                        "type": "finalanswer",  # Changed to match frontend
                        "question": q.strip(),
                        "marks": 0  # Default marks
                    } for i, q in enumerate(content.split('\n')) if q.strip()
                ],
                "answer_key": "See individual sections for marks allocation",
                "estimated_time": time_limit,
                "total_marks": number_of_questions * 10,  # Default marks calculation
                "instructions": "Answer questions according to the given instructions"
            }
            
            return json.dumps(test_json)
        except Exception as e:
            print(f"Error in qs_gen module: {str(e)}. Using fallback method.")
            # Fall through to use the Gemini model as fallback
    
    # Adjust prompt for final answer questions if that type is requested but qs_gen isn't available
    final_answer_prompt = ""
    if "final_answer" in question_types:
        final_answer_prompt = """
        For final answer questions, please create typical exam-style questions that require detailed answers.
        Each question should have clear marking criteria and expected answer points.
        """
    
    # Original Gemini prompt for other question types
    prompt = f"""Generate a {subject} test for Grade {grade_level} with the following specifications:
    Topic: {topic}
    Question Types: {', '.join(question_types)}
    Difficulty: {difficulty}
    Number of Questions: {number_of_questions}
    Time Limit: {time_limit} minutes
    {final_answer_prompt}

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

def parse_final_answer_content(content):
    """Parse the crew-generated content into structured JSON sections"""
    sections = []
    current_section = None
    
    # Split content into lines and process
    lines = content.split('\n')
    for line in lines:
        if line.startswith('Section') or 'Answer any' in line:
            if current_section:
                sections.append(current_section)
            current_section = {
                "type": "final_answer",
                "heading": line.strip(),
                "questions": [],
                "instructions": "",
                "total_marks": 0
            }
        elif current_section and line.strip():
            if '(' in line and 'marks' in line.lower():
                # Extract marks from the line
                marks = int(''.join(filter(str.isdigit, line)))
                current_section["total_marks"] += marks
            
            current_section["questions"].append({
                "type": "final_answer",
                "question": line.strip(),
                "marks": marks if 'marks' in locals() else 0
            })
    
    if current_section:
        sections.append(current_section)
    
    return sections

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
    
    # Check if critical components are available
    if not GOOGLE_API_KEY:
        print("WARNING: GOOGLE_API_KEY environment variable not set. Make sure you have a .env file with this key.")
    
    if not qs_gen_available:
        print("NOTE: Running with limited functionality - 'final answer' questions will use Gemini model fallback.")
    
    # No default configurations - only process requests from frontend
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Error starting server: {str(e)}")

if __name__ == "__main__":
    main()  # Always run in server mode to receive frontend requests
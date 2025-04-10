import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as gen_ai
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Configure Google Gemini-Pro AI model
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
gen_ai.configure(api_key=GOOGLE_API_KEY)
model = gen_ai.GenerativeModel('models/gemini-2.0-flash-lite')

# Directory to save uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/assignments/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        return jsonify({"message": "File uploaded successfully", "filename": filename}), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route("/api/assignments/evaluate", methods=["POST"])
def evaluate_assignment():
    data = request.json
    student_answer = data.get("student_answer", "").strip()
    model_answer = data.get("model_answer", "").strip()
    rubric = data.get("rubric", "").strip()
    total_marks = data.get("total_marks", "").strip()

    if not total_marks.isdigit():
        return jsonify({"error": "Invalid total marks"}), 400

    total_marks = int(total_marks)
    prompt = generate_prompt(student_answer, model_answer, rubric, total_marks)

    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(prompt)
    
    response_text = response.text
    return jsonify({"evaluation": response_text})

def generate_prompt(student_answer, model_answer, rubric, total_marks):
    prompt = (
        f"Evaluate the student's answer based on the provided rubric.\n"
        f"Total Marks: {total_marks}\n"
        f"Student Answer: {student_answer}\n"
    )
    if model_answer:
        prompt += f"Model Answer: {model_answer}\n"
    if rubric:
        prompt += f"Rubric: {rubric}\n"

    return prompt

@app.route("/api/assignments/plagiarism", methods=["POST"])
def check_plagiarism():
    data = request.json
    student_answer = data.get("student_answer", "").strip()
    model_answer = data.get("model_answer", "").strip()

    if not student_answer or not model_answer:
        return jsonify({"error": "Student answer and model answer are required"}), 400

    prompt = (
        f"Check for plagiarism in the student's answer compared to the model answer.\n"
        f"Student Answer: {student_answer}\n"
        f"Model Answer: {model_answer}\n"
        f"Provide a similarity percentage and a brief explanation."
    )

    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(prompt)
    
    response_text = response.text
    return jsonify({"plagiarism_check": response_text})

if __name__ == "__main__":
    app.run(debug=True)
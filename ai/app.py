import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as gen_ai
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import requests
import json
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "f591331d90774632bd62007d40c997ab")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Google Gemini-Pro AI model
if GOOGLE_API_KEY:
    gen_ai.configure(api_key=GOOGLE_API_KEY)
    model = gen_ai.GenerativeModel('models/gemini-2.0-flash-lite')

# News categories mapping
CATEGORY_MAP = {
    'technology': 'technology',
    'ai': 'Artificial Intelligence',
    'education': 'Education',
    'neet-jee': 'NEET OR JEE',
    'physics': 'Physics'
}

class MessageModerator:
    def __init__(self, config_path='config/moderation_config.json'):
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.config_path = config_path
       ## self.load_config()

    def load_config(self):
        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
        except FileNotFoundError:
            self.config = {
                'offensive_terms': [
                    "idiot", "clown", "stupid", "bang", "dogshit", "dumb", 
                    "moron", "boob", "ass", "dick", "nigga", "whore", 
                    "slut", "trash", "sucks", "make love", 
                    "हरामी", "गंवार", "बेवकूफ", "चोर"
                ],
                'user_sentiment_warnings': {}
            }
            self.save_config()

    def save_config(self):
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=4)

    def detect_language(self, text):
        try:
            return detect(text)
        except LangDetectException:
            return "en"

    def translate_to_english(self, text, source_lang=None):
        if source_lang is None:
            source_lang = self.detect_language(text)
        
        if source_lang == "en":
            return text

        try:
            return GoogleTranslator(source=source_lang, target='en').translate(text)
        except Exception as e:
            print(f"Translation error: {e}")
            return text

    def check_offensive_content(self, text):
        lower_text = text.lower()
        offensive_terms = self.config.get('offensive_terms', [])
        return any(term in lower_text for term in offensive_terms)

    def analyze_sentiment(self, text):
        sentiment_scores = self.sentiment_analyzer.polarity_scores(text)
        compound_score = sentiment_scores['compound']

        if compound_score <= -0.6:
            return "Very Negative", False, compound_score
        elif -0.6 < compound_score <= -0.3:
            return "Negative", False, compound_score
        elif -0.3 < compound_score < 0.0:
            return "Slightly Negative", "warning", compound_score
        elif compound_score == 0.0:
            return "Neutral", True, compound_score
        else:
            return "Positive", True, compound_score

    def increment_user_warning(self, username):
        if 'user_sentiment_warnings' not in self.config:
            self.config['user_sentiment_warnings'] = {}
        
        current_warnings = self.config['user_sentiment_warnings'].get(username, 0)
        current_warnings += 1
        self.config['user_sentiment_warnings'][username] = current_warnings
        self.save_config()
        return current_warnings >= 3

    def reset_user_warnings(self, username):
        if 'user_sentiment_warnings' in self.config:
            self.config['user_sentiment_warnings'][username] = 0
            self.save_config()

    def moderate_message(self, text, username):
        translated_text = self.translate_to_english(text)

        if self.check_offensive_content(translated_text):
            return False, "Offensive content detected", None

        sentiment, allow_post, sentiment_score = self.analyze_sentiment(translated_text)

        if not allow_post:
            should_block = self.increment_user_warning(username)
            if should_block:
                return False, f"Blocked due to repeatedly sending {sentiment} messages", sentiment_score
            return False, f"{sentiment} message not allowed", sentiment_score

        if allow_post == "warning":
            return "warning", "Slightly negative message", sentiment_score

        return True, "Message allowed", sentiment_score

# Initialize message moderator
moderator = MessageModerator()

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

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

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        category = request.args.get('category', 'technology')
        query = CATEGORY_MAP.get(category.lower(), 'technology')
        
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if not data.get('articles'):
            return jsonify({'error': 'No articles found'}), 404

        articles = []
        for article in data['articles'][:10]:
            articles.append({
                'id': article.get('url', '').split('/')[-1] or str(datetime.now().timestamp()),
                'newsHeading': article.get('title', 'No title available'),
                'newsDate': article.get('publishedAt', ''),
                'newsImage': article.get('urlToImage', ''),
                'detailedContent': article.get('description', 'No content available'),
                'sourceUrl': article.get('url', '#')
            })

        return jsonify(articles)

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'News API request failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/news/<news_id>', methods=['GET'])
def get_news_detail(news_id):
    try:
        return jsonify({
            'id': news_id,
            'newsHeading': 'Sample News Article',
            'newsDate': '2023-01-01T00:00:00Z',
            'newsImage': 'https://via.placeholder.com/800x400?text=News+Image',
            'detailedContent': 'This is a detailed description of the news article.',
            'sourceUrl': '#'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/moderate-message', methods=['POST'])
def moderate_message():
    data = request.json
    
    if not data or 'text' not in data or 'username' not in data:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires text and username.',
            'allow_post': False
        }), 400

    text = data['text']
    username = data['username']

    is_allowed, reason, sentiment_score = moderator.moderate_message(text, username)

    response = {
        'success': is_allowed is True,
        'message': reason,
        'allow_post': is_allowed,
        'sentiment_score': sentiment_score
    }

    status_code = 200 if is_allowed is True else 403

    return jsonify(response), status_code

@app.route('/reset-warnings', methods=['POST'])
def reset_user_warnings():
    data = request.json
    
    if not data or 'username' not in data:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires username.'
        }), 400

    username = data['username']
    moderator.reset_user_warnings(username)

    return jsonify({
        'success': True,
        'message': f'Warnings reset for user {username}'
    }), 200

@app.route('/get-user-warnings', methods=['GET'])
def get_user_warnings():
    username = request.args.get('username')
    
    if not username:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires username.'
        }), 400

    warnings = moderator.config.get('user_sentiment_warnings', {}).get(username, 0)

    return jsonify({
        'success': True,
        'username': username,
        'warning_count': warnings
    }), 200

if __name__ == '__main__':
    if not os.path.exists('config'):
        os.makedirs('config')
    
    config_path = 'config/moderation_config.json'
    if not os.path.exists(config_path):
        with open(config_path, 'w') as f:
            json.dump({'offensive_terms': [], 'user_sentiment_warnings': {}}, f)
    
    app.run(debug=True, port=5000, host='0.0.0.0')
from flask import Flask, request, jsonify
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class MessageModerator:
    def __init__(self, config_path='moderation_config.json'):
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.config_path = config_path
        self.load_config()

    def load_config(self):
        """Load moderation configuration from JSON file."""
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
        """Save moderation configuration to JSON file."""
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=4)

    def detect_language(self, text):
        """Detect the language of the input text."""
        try:
            return detect(text)
        except LangDetectException:
            return "en"

    def translate_to_english(self, text, source_lang=None):
        """Translate text to English."""
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
        """Check if text contains offensive terms."""
        lower_text = text.lower()
        offensive_terms = self.config.get('offensive_terms', [])
        return any(term in lower_text for term in offensive_terms)

    def analyze_sentiment(self, text):
        """
        Analyze sentiment of the text.
        Returns:
        - sentiment: description of sentiment
        - allow_post: whether the message can be posted 
          (True, False, or 'warning')
        - severity: numeric representation of sentiment severity
        """
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
        """
        Increment warning count for a user and check if they should be blocked.
        Returns True if user should be blocked, False otherwise.
        """
        # Ensure user exists in config
        if 'user_sentiment_warnings' not in self.config:
            self.config['user_sentiment_warnings'] = {}
        
        # Get current warning count or default to 0
        current_warnings = self.config['user_sentiment_warnings'].get(username, 0)
        
        # Increment warnings
        current_warnings += 1
        self.config['user_sentiment_warnings'][username] = current_warnings
        
        # Save updated config
        self.save_config()
        
        # Block if warnings exceed 3
        return current_warnings >= 3

    def reset_user_warnings(self, username):
        """Reset warning count for a specific user."""
        if 'user_sentiment_warnings' in self.config:
            self.config['user_sentiment_warnings'][username] = 0
            self.save_config()

    def moderate_message(self, text, username):
        """
        Comprehensive message moderation.
        Returns:
        - is_allowed: whether message can be posted
        - reason: explanation if message is not allowed
        - sentiment_info: details about sentiment
        """
        # Translate to English for consistent analysis
        translated_text = self.translate_to_english(text)

        # Check for offensive content first
        if self.check_offensive_content(translated_text):
            return False, "Offensive content detected", None

        # Analyze sentiment
        sentiment, allow_post, sentiment_score = self.analyze_sentiment(translated_text)

        # If message is negative or offensive
        if not allow_post:
            # Increment user warnings
            should_block = self.increment_user_warning(username)
            
            if should_block:
                return False, f"Blocked due to repeatedly sending {sentiment} messages", sentiment_score
            
            return False, f"{sentiment} message not allowed", sentiment_score

        # If slightly negative with warning
        if allow_post == "warning":
            return "warning", "Slightly negative message", sentiment_score

        # Positive or neutral message
        return True, "Message allowed", sentiment_score

# Initialize message moderator
moderator = MessageModerator()

@app.route('/moderate-message', methods=['POST'])
def moderate_message():
    """
    Endpoint for message moderation.
    Expects JSON with 'text' and 'username' fields.
    Returns moderation result.
    """
    data = request.json
    
    # Validate input
    if not data or 'text' not in data or 'username' not in data:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires text and username.',
            'allow_post': False
        }), 400

    text = data['text']
    username = data['username']

    # Moderate the message
    is_allowed, reason, sentiment_score = moderator.moderate_message(text, username)

    # Prepare response
    response = {
        'success': is_allowed is True,
        'message': reason,
        'allow_post': is_allowed,
        'sentiment_score': sentiment_score
    }

    # Determine appropriate HTTP status
    status_code = 200 if is_allowed is True else 403

    return jsonify(response), status_code

@app.route('/reset-warnings', methods=['POST'])
def reset_user_warnings():
    """
    Endpoint to reset a user's warning count.
    Expects JSON with 'username' field.
    """
    data = request.json
    
    # Validate input
    if not data or 'username' not in data:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires username.'
        }), 400

    username = data['username']

    # Reset warnings
    moderator.reset_user_warnings(username)

    return jsonify({
        'success': True,
        'message': f'Warnings reset for user {username}'
    }), 200

@app.route('/get-user-warnings', methods=['GET'])
def get_user_warnings():
    """
    Endpoint to get a user's current warning count.
    Expects username as a query parameter.
    """
    username = request.args.get('username')
    
    # Validate input
    if not username:
        return jsonify({
            'success': False,
            'message': 'Invalid input. Requires username.'
        }), 400

    # Get current warnings
    warnings = moderator.config.get('user_sentiment_warnings', {}).get(username, 0)

    return jsonify({
        'success': True,
        'username': username,
        'warning_count': warnings
    }), 200

if __name__ == '__main__':
    # Ensure config file exists
    if not os.path.exists('moderation_config.json'):
        with open('moderation_config.json', 'w') as f:
            f.write('{"offensive_terms": [], "user_sentiment_warnings": {}}')
    
    # Run the Flask app
    app.run(debug=True, port=5000)
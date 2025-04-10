from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
NEWS_API_KEY = "f591331d90774632bd62007d40c997ab"
if not NEWS_API_KEY:
    raise ValueError("Missing NEWS_API_KEY environment variable")

# Create config directory if it doesn't exist
if not os.path.exists('config'):
    os.makedirs('config')

# News categories mapping
CATEGORY_MAP = {
    'technology': 'technology',
    'ai': 'Artificial Intelligence',
    'education': 'Education',
    'neet-jee': 'NEET OR JEE',
    'physics': 'Physics'
}

@app.route('/api/news', methods=['GET'])
def get_news():
    """Endpoint to fetch news articles by category"""
    try:
        category = request.args.get('category', 'technology')
        query = CATEGORY_MAP.get(category.lower(), 'technology')
        
        # Fetch from NewsAPI
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if not data.get('articles'):
            return jsonify({'error': 'No articles found'}), 404

        # Format articles for frontend
        articles = []
        for article in data['articles'][:10]:  # Limit to 10 articles
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
    """Endpoint to get details of a specific news article"""
    try:
        # In a real application, you would fetch this from your database
        # For demo purposes, we'll return mock data
        return jsonify({
            'id': news_id,
            'newsHeading': 'Sample News Article',
            'newsDate': '2023-01-01T00:00:00Z',
            'newsImage': 'https://via.placeholder.com/800x400?text=News+Image',
            'detailedContent': 'This is a detailed description of the news article. It contains all the important information about the event or topic being covered. In a real application, this would be fetched from your database or the original news source.',
            'sourceUrl': '#'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create default config file if it doesn't exist
    config_path = 'config/moderation_config.json'
    if not os.path.exists(config_path):
        with open(config_path, 'w') as f:
            json.dump({'offensive_terms': [], 'user_sentiment_warnings': {}}, f)
    
    # Run the Flask app
    app.run(debug=True, port=5000, host='0.0.0.0')
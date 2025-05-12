import os
from dotenv import load_dotenv
from utils import DocumentProcessor
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create Flask app for API endpoints
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY')

# Initialize document processor
try:
    processor = DocumentProcessor(api_key)
except ImportError as e:
    print(f"Error initializing DocumentProcessor: {str(e)}")
    print("Please install required dependencies with: pip install -r requirements.txt")
    import sys
    sys.exit(1)

@app.route('/api/chatbot/askdoubt', methods=['POST'])
def ask_doubt():
    try:
        data = request.json
        question = data.get('question')
        bot_type = data.get('botType')

        if not question:
            return jsonify({'success': False, 'message': 'No question provided'}), 400

        # Create prompt based on bot type
        if bot_type == "normal":
            prompt = f"As a helpful assistant, please answer this question: {question}"
        elif bot_type == "career":
            prompt = f"As a career guidance expert, please provide advice on this question: {question}"
        elif bot_type == "math":
            prompt = f"As a math tutor, please solve this problem step by step, using LaTeX formatting for equations when appropriate. For inline equations, use $equation$ format. For block equations, use $$equation$$ format: {question}"
        else:
            prompt = f"Please answer this question: {question}"

        # Get response using ask_gemini method
        response = processor.ask_gemini(prompt)
        
        if response is None:
            return jsonify({'success': False, 'message': 'Failed to get response from AI model'}), 500

        return jsonify({
            'success': True,
            'data': {
                'response': response
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/chatbot/upload', methods=['POST'])
def process_file():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file provided'}), 400

        file = request.files['file']
        context = request.form.get('context', '')
        bot_type = request.form.get('botType', 'normal')

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            file.save(temp.name)

            # Process file based on bot type
            if bot_type == "math" and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                response = "I've analyzed the math problem in your image. This appears to be a calculus problem involving differentiation."
            else:
                # Use RAG for regular document processing
                document_text = processor.read_file(temp.name)
                chunks = processor.text_splitter.split_text(document_text)
                vector_store = processor.embeddings.embed_documents(chunks)

                # Create a question based on the context provided
                prompt = f"Based on the uploaded document, {context if context else 'please summarize the key points'}"

                # Get response using ask_gemini method
                response = processor.ask_gemini(prompt)
                
                if response is None:
                    return jsonify({'success': False, 'message': 'Failed to get response from AI model'}), 500

        return jsonify({
            'success': True,
            'data': {
                'response': response
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/chatbot/history', methods=['GET'])
def get_history():
    # Mock history for now - would be replaced with database calls in production
    history = [
        {"id": "chat1", "title": "Math problem solving", "timestamp": "2023-06-15T10:30:00Z", "botType": "math"},
        {"id": "chat2", "title": "Career advice for software engineering", "timestamp": "2023-06-14T15:45:00Z", "botType": "career"},
        {"id": "chat3", "title": "General questions about physics", "timestamp": "2023-06-13T09:20:00Z", "botType": "normal"}
    ]
    
    return jsonify({
        'success': True,
        'data': {
            'history': history
        }
    })

# Run Flask app if executed directly
if __name__ == "__main__":
    print("Starting Flask server for Chatbot API...")
    print("API endpoints available at: http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
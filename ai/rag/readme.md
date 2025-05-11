# Document Chat with Gemini

This application allows you to upload multiple documents and chat with them using Google's Gemini AI.

## Features

- Process multiple document types (PDF, DOCX, TXT, CSV, JSON, XML, YAML, Excel, PowerPoint, HTML)
- Chat with your documents using Google's Gemini AI
- Multiple bot personalities (General Assistant, Career Guide, Math Tutor)

## Setup Instructions

### Prerequisites

- Python 3.9+ installed
- Groq API key (for LLM access)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gdg-25.git
   cd gdg-25/ai/rag
   ```

2. Create a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

To start the Flask API server:
```bash
python app.py
```

This will start a server at http://127.0.0.1:5000, which the frontend application can communicate with.

To use the Streamlit interface (separate from the API server):
```bash
streamlit run streamlit_app.py
```

## API Endpoints

The server exposes the following endpoints:

- `POST /api/chatbot/askdoubt` - Ask a question to the selected bot type
- `POST /api/chatbot/upload` - Upload and process a document
- `GET /api/chatbot/history` - Get chat history

## Frontend Integration

The React frontend connects to this backend at `http://127.0.0.1:5000`.
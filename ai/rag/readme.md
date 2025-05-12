# Document Chat with Gemini

This application allows you to upload multiple documents and chat with them using Google's Gemini 2.0 Flash AI.

## Features

- Process multiple document types (PDF, DOCX, TXT, CSV, JSON, XML, YAML, Excel, PowerPoint, HTML)
- Chat with your documents using Google's Gemini 2.0 Flash AI
- Multiple bot personalities (General Assistant, Career Guide, Math Tutor)

## Setup Instructions

### Prerequisites

- Python 3.10 installed
- Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

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
   also follow the conda instructions in requirements.txt

4. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

### Running the Application

To start the Flask API server:
```bash
python app.py
```

This will start a server at http://127.0.0.1:5000, which the frontend application can communicate with.

## API Endpoints

The server exposes the following endpoints:

- `POST /api/chatbot/askdoubt` - Ask a question to the selected bot type
- `POST /api/chatbot/upload` - Upload and process a document
- `GET /api/chatbot/history` - Get chat history

## Example Usage
   {
  "question": "Can you delve into what is the meaning of life?",
  "botType": "normal"
   }

## Frontend Integration

The React frontend connects to this backend at `http://127.0.0.1:5000`.

## Notes

- The backend uses the Gemini 2.0 Flash model (`models/gemini-2.0-flash-lite`) for all LLM responses.
- Make sure your `.env` file is present and contains a valid API key.
- If you encounter authentication errors, verify your API key and its permissions in [Google AI Studio](https://aistudio.google.com/app/apikey).
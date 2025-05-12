import os
from crewai import Agent, Task, Crew, Process, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as gen_ai
from langchain.tools import BaseTool
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import json
import datetime
import base64
import time
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool
from typing import Dict, Any, Optional, ClassVar
from pydantic import Field
import textwrap  # Add this import
# Add Flask imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})  # Enable CORS for all routes

# Load environment variables
load_dotenv()

# Use environment variables for credentials
creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if os.path.exists(creds_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
    print(f"Using credentials from: {creds_path}")
else:
    raise FileNotFoundError(f"Credentials file not found at: {creds_path}")

# Use environment variable for API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY is not set in .env file")

gen_ai.configure(api_key=GOOGLE_API_KEY)

# Configure Cloudinary with environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"), 
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def get_question_paper_from_cloudinary(paper_id):
    """Retrieve a specific question paper from Cloudinary by its ID."""
    try:
        print("\nSearching for question papers...")
        
        # Try both image and raw resource types
        for resource_type in ["image", "raw"]:
            try:
                search_results = cloudinary.api.resources_by_tag(
                    "qs_paper",
                    resource_type=resource_type,
                    max_results=500,
                    tags=True,
                    context=True,
                    metadata=True
                )
                
                print(f"Found {len(search_results.get('resources', []))} papers with qs_paper tag in {resource_type}")
                
                matching_resources = [
                    r for r in search_results.get('resources', [])
                    if paper_id in r['public_id'] and
                    r['format'].lower() in ['pdf', 'png', 'jpg', 'jpeg']  # Check file format
                ]
                
                if matching_resources:
                    resource = matching_resources[0]
                    pdf_url = resource['secure_url']
                    print(f"Found question paper URL: {pdf_url}")
                    print(f"Resource type: {resource_type}")
                    print(f"Format: {resource.get('format', 'unknown')}")
                    
                    # Verify the resource is accessible
                    response = requests.head(pdf_url)
                    if response.status_code != 200:
                        print(f"Warning: Resource not accessible (status {response.status_code})")
                        continue
                    
                    # Extract text from the PDF
                    paper_text = extract_text_from_pdf_url(pdf_url)
                    if paper_text and "Error processing document" not in paper_text:
                        return {
                            'text': paper_text,
                            'url': pdf_url,
                            'metadata': resource.get('metadata', {}),
                            'public_id': resource['public_id'],
                            'resource_type': resource_type,
                            'format': resource.get('format', 'unknown')
                        }
            
            except Exception as e:
                print(f"Error searching {resource_type} resources: {e}")
                continue
        
        # If we get here, no valid resource was found
        print(f"No valid question paper found with ID: {paper_id}")
        available_papers = []
        for resource_type in ["image", "raw"]:
            try:
                results = cloudinary.api.resources_by_tag("qs_paper", resource_type=resource_type)
                available_papers.extend([
                    f"{r['public_id']} ({resource_type}, {r.get('format', 'unknown')})"
                    for r in results.get('resources', [])
                ])
            except:
                continue
        
        print("Available papers:")
        for paper in available_papers:
            print(f"- {paper}")
        raise ValueError(f"No accessible question paper found with ID: {paper_id}")
        
    except Exception as e:
        print(f"Error retrieving question paper: {e}")
        return None

def extract_text_from_pdf_url(pdf_url):
    """Extract text from PDF URL using Gemini's OCR capabilities."""
    try:
        # Download the PDF content with error checking
        response = requests.get(pdf_url)
        response.raise_for_status()  # Raise error for bad status codes
        pdf_content = response.content
        
        if len(pdf_content) < 100:  # Basic check for minimum file size
            raise ValueError("Downloaded content too small to be valid PDF")
            
        print(f"Successfully downloaded content: {len(pdf_content)} bytes")
        
        if not GOOGLE_API_KEY or GOOGLE_API_KEY.startswith("<") or "invalid" in GOOGLE_API_KEY.lower():
            print("Warning: Using placeholder text due to invalid API key")
            return "Sample extracted text for testing. Please configure a valid Google API key."
        
        # Convert PDF content to base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Use Gemini model for OCR
        ocr_model = gen_ai.GenerativeModel('models/gemini-1.5-pro-latest')
        
        # Process the PDF with Gemini using the correct format
        response = ocr_model.generate_content(
            [
                "Extract and organize all text content from this PDF document. Make sure to not miss any important detail even if that is not in text.",
                {
                    "mime_type": "application/pdf",
                    "data": pdf_base64
                }
            ]
        )
        
        # Handle potential generation errors
        if response.text:
            return response.text
        else:
            print(f"Warning: No text extracted from {pdf_url}")
            return "No text could be extracted from this document."
            
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return f"Error processing document: {str(e)}"

def create_solution_pdf(content, output_path, paper_id):
    """Create a PDF file with the generated solutions with proper text wrapping."""
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # Add header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, f"Solutions for Question Paper {paper_id}")
    
    # Setup text object
    text_object = c.beginText(72, height - 100)
    text_object.setFont("Helvetica", 12)
    
    # Configure wrapping
    max_width = int((width - 144) / 7)  # Approximate characters per line
    current_y = height - 100
    
    # Process content
    sections = content.split('\n\n')
    for section in sections:
        if not section.strip():
            continue
            
        # Check if it's a question (starts with "Question")
        if section.lower().startswith("question"):
            # Add extra space before questions except the first one
            if current_y < height - 100:
                text_object.textLine('')
            text_object.setFont("Helvetica-Bold", 12)
            wrapped_lines = textwrap.wrap(section, width=max_width)
            for line in wrapped_lines:
                text_object.textLine(line)
            text_object.setFont("Helvetica", 12)
        else:
            # Regular solution text
            wrapped_lines = textwrap.wrap(section, width=max_width)
            for line in wrapped_lines:
                text_object.textLine(line)
        
        text_object.textLine('')  # Add space between sections
        
        # Check if we need a new page
        if text_object.getY() < 72:  # Bottom margin
            c.drawText(text_object)
            c.showPage()
            text_object = c.beginText(72, height - 72)
            text_object.setFont("Helvetica", 12)
    
    c.drawText(text_object)
    c.save()
    return output_path

def upload_solution_to_cloudinary(pdf_path, paper_id):
    """Upload the solution PDF to Cloudinary."""
    public_id = f"solutions/{paper_id}_solution"
    
    # Using context instead of metadata for key-value pairs
    upload_result = cloudinary.uploader.upload(
        pdf_path,
        public_id=public_id,
        resource_type="raw",
        tags=["solution", paper_id],
        context=f"original_paper={paper_id}|type=solution"  # Using context for metadata-like info
    )
    
    return upload_result['secure_url']

class WebSearchTool(BaseTool):
    name: str = "DuckDuckGo Search Tool"
    description: str = "Search the web for current and accurate information."

    def _run(self, query: str) -> str:
        duckduckgo_tool = DuckDuckGoSearchRun()
        response = duckduckgo_tool.invoke(query)
        return response

def setup_solution_agents_and_crew(paper_data):
    # Initialize the search tool directly
    search_tool = WebSearchTool()
    
    llm = LLM(
        api_key=GOOGLE_API_KEY,
        model="gemini/gemini-1.5-flash",
        verbose=True,
        temperature=0.5
    )

    # Research Agent with improved behavior
    researcher = Agent(
        role="Research Expert",
        goal="Search for accurate answers to the provided questions using DuckDuckGo.",
        backstory="You are an expert researcher tasked with finding accurate and relevant answers to the provided questions. Avoid irrelevant searches and focus on specific queries.",
        verbose=True,
        memory=True,
        llm=llm,
        tools=[search_tool],
        allow_delegation=True  # Allow delegation to handle large workloads
    )
    
    # Solution Generator Agent
    solution_writer = Agent(
        role="Solution Writer",
        goal="Generate detailed answers for the provided questions using the research results.",
        backstory="You are an expert in generating detailed and accurate answers for the provided questions based on research results. Ensure the output is well-structured and complete.",
        verbose=True,
        memory=True,
        llm=llm,
        allow_delegation=False
    )

    # Define tasks with improved context passing
    research_task = Task(
        description=f"""
        Search for accurate solutions for each question:
        
        {paper_data['text']}
        
        Format output as:
        QUESTION_START
        <question number and text>
        SOLUTION_START
        <detailed solution>
        SOLUTION_END
        QUESTION_END
        """,
        agent=researcher,
        expected_output="Solutions for each question"
    )
    
    time.sleep(30)
    
    solution_task = Task(
        description="""
        Using the research results, create the final solution document.
        The research results will be marked with QUESTION_START and SOLUTION_START tags.
        Include all solutions exactly as provided by the research.
        Maintain all code examples and explanations.
        """,
        agent=solution_writer,
        expected_output="Final formatted solution document",
        context=research_task.output  # Pass research output directly
    )

    # Create crew with just the essential tasks
    crew = Crew(
        agents=[researcher, solution_writer],
        tasks=[research_task, solution_task],
        verbose=True,
        process=Process.sequential
    )
    
    return crew, solution_task

def generate_solutions(paper_id, output_path):
    """Main function to generate solutions for a question paper."""
    # Get question paper
    paper_data = get_question_paper_from_cloudinary(paper_id)
    if not paper_data:
        raise ValueError("Failed to retrieve question paper")
    
    # Setup and run the crew
    crew, final_task = setup_solution_agents_and_crew(paper_data)
    
    print("Starting solution generation with rate limiting...")
    result = crew.kickoff()
    
    # Add delay before PDF creation
    time.sleep(30)
    
    # Debug: Print the final task output
    print("Final Task Output:", final_task.output)
    
    # Format the content for PDF - use research results if solution writer fails
    solutions = str(final_task.output)
    if "Please provide" in solutions or not solutions:
        print("Warning: Using research results directly as solution writer failed")
        solutions = str(final_task.context)  # Use the research results directly
    
    final_solution_content = str(solutions)
    
    # Create PDF with properly formatted content
    pdf_path = create_solution_pdf(final_solution_content, output_path, paper_id)
    
    # Add delay before Cloudinary upload
    time.sleep(30)
    
    cloudinary_url = upload_solution_to_cloudinary(pdf_path, paper_id)
    
    return {
        "local_path": pdf_path,
        "cloudinary_url": cloudinary_url
    }

# Function to solve test from text input
def solve_test_content(content):
    """Generate solutions for test questions from text content."""
    try:
        # Initialize the LLM
        llm = LLM(
            api_key=GOOGLE_API_KEY,
            model="gemini/gemini-1.5-flash",
            verbose=True,
            temperature=0.3
        )

        # Create solution agent
        solution_agent = Agent(
            role="Education Expert",
            goal="Generate accurate and detailed solutions for test questions",
            backstory="You are an advanced AI tutor with expertise in solving test questions across various subjects.",
            verbose=True,
            llm=llm
        )

        # Create the task
        solution_task = Task(
            description=f"""
            Analyze the following test questions and provide detailed solutions:
            
            {content}
            
            For each question:
            1. Identify the question clearly
            2. Provide a direct and accurate solution
            3. Include step-by-step explanations where necessary
            
            Format your response as a JSON array where each element has the structure:
            {{
                "question": "The full question text",
                "solution": "The direct answer to the question",
                "explanation": "Step-by-step explanation of how to reach the answer"
            }}
            
            Do not include any text outside of the JSON structure.
            """,
            agent=solution_agent,
            expected_output="JSON array with questions, solutions, and explanations"
        )

        # Create crew with just this task
        crew = Crew(
            agents=[solution_agent],
            tasks=[solution_task],
            verbose=True,
            process=Process.sequential
        )

        print("Starting solution generation...")
        result = crew.kickoff()
        
        # Extract JSON from the result
        result_text = solution_task.output
        # Try to extract JSON if it's wrapped in backticks or other text
        if '```json' in result_text:
            result_text = result_text.split('```json')[1].split('```')[0].strip()
        elif '```' in result_text:
            result_text = result_text.split('```')[1].split('```')[0].strip()
            
        # Parse the JSON
        solutions = json.loads(result_text)
        
        return solutions
        
    except Exception as e:
        print(f"Error generating solutions: {e}")
        raise

# Function to extract text from uploaded file
def extract_text_from_file(file_path):
    """Extract text content from uploaded file."""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    if file_extension == '.txt':
        with open(file_path, 'r') as file:
            return file.read()
    
    elif file_extension in ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']:
        # Use Gemini model for document understanding
        with open(file_path, 'rb') as file:
            file_content = file.read()
        
        # Convert file content to base64
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        
        # Determine MIME type
        mime_type = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        }.get(file_extension, 'application/octet-stream')
        
        # Use Gemini model for text extraction
        ocr_model = gen_ai.GenerativeModel('models/gemini-1.5-pro-latest')
        
        # Process the document with Gemini
        response = ocr_model.generate_content(
            [
                "Extract all text content from this document, especially focusing on questions and problems to solve. Preserve all questions exactly as they appear.",
                {
                    "mime_type": mime_type,
                    "data": file_base64
                }
            ]
        )
        
        return response.text
    
    elif file_extension == '.json':
        with open(file_path, 'r') as file:
            content = json.load(file)
            # If it's an array of questions, concatenate them
            if isinstance(content, list):
                questions = []
                for item in content:
                    if isinstance(item, dict) and 'question' in item:
                        questions.append(item['question'])
                    elif isinstance(item, str):
                        questions.append(item)
                return "\n\n".join(questions)
            # If it's a string or has a text/content field
            elif isinstance(content, dict):
                if 'text' in content:
                    return content['text']
                elif 'content' in content:
                    return content['content']
                elif 'questions' in content:
                    return "\n\n".join(content['questions'])
            # Return the raw json as text
            return json.dumps(content)
    
    else:
        return "Unsupported file format"

# Flask routes for API endpoints
@app.route('/api/solve-test', methods=['POST'])
def api_solve_test():
    try:
        data = request.json
        if not data or 'test_content' not in data:
            return jsonify({"error": "Missing test_content parameter"}), 400
            
        content = data['test_content']
        if not content.strip():
            return jsonify({"error": "Empty test content"}), 400
            
        solutions = solve_test_content(content)
        return jsonify({"solutions": solutions})
        
    except Exception as e:
        print(f"Error in /api/solve-test: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/solve-test-file', methods=['POST'])
def api_solve_test_file():
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({"error": "Empty file name"}), 400
            
        # Save the file to a temporary location
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)
        
        # Extract text from file
        content = extract_text_from_file(file_path)
        
        # Delete the temporary file
        os.remove(file_path)
        
        # If we couldn't extract any content
        if not content or content == "Unsupported file format":
            return jsonify({"error": "Failed to extract content from file or unsupported format"}), 400
            
        # Generate solutions from content
        solutions = solve_test_content(content)
        return jsonify({"solutions": solutions})
        
    except Exception as e:
        print(f"Error in /api/solve-test-file: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run the Flask app when executed directly
if __name__ == "__main__":
    # Check if running in API mode
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--api':
        print("Starting API server on port 5000...")
        app.run(debug=True, port=5000)
    else:
        # Original CLI mode
        try:
            search_results = cloudinary.api.resources_by_tag(
                "qs_paper",
                resource_type="image",
                max_results=500
            )
            print("\nAvailable question papers:")
            for resource in search_results.get('resources', []):
                print(f"ID: {resource['public_id']}")
        except Exception as e:
            print(f"Error listing papers: {e}")
        
        # Get input from user or use default
        paper_id = input("Enter paper ID (or press Enter for first available paper): ").strip()
        if not paper_id and search_results.get('resources'):
            paper_id = search_results['resources'][0]['public_id']
            print(f"Using first available paper: {paper_id}")
        
        output_path = f"./solution_{paper_id.split('/')[-1]}_{datetime.datetime.now().strftime('%Y%m%d')}.pdf"
        
        result = generate_solutions(paper_id, output_path)
        print(f"Generated solutions saved locally at: {result['local_path']}")
        print(f"Solutions uploaded to: {result['cloudinary_url']}")

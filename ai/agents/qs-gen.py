import os
from crewai import Agent, Task, Crew, Process, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as gen_ai
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
from langchain.tools import tool
import base64
import time

# Replace environment loading with hardcoded path
creds_path = "D:\\gdgsc\\agent\\application_default_credentials.json"
if os.path.exists(creds_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
    print(f"Using credentials from: {creds_path}")
else:
    raise FileNotFoundError(f"Credentials file not found at: {creds_path}")

# Hardcode the API key
GOOGLE_API_KEY = "<actual key value redacted>"  # Replace with your actual API key
if not GOOGLE_API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY is not set")

gen_ai.configure(api_key=GOOGLE_API_KEY)

# Ensure GEMINI_API_KEY is set
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY environment variable is not set")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"), 
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Function to extract text from PDF using Gemini OCR capabilities
def extract_text_from_pdf_url(pdf_url):
    """Extract text from PDF URL using Gemini's OCR capabilities."""
    try:
        # Download the PDF content
        response = requests.get(pdf_url)
        pdf_content = response.content
        
        if not GOOGLE_API_KEY or GOOGLE_API_KEY.startswith("<") or "invalid" in GOOGLE_API_KEY.lower():
            print("Warning: Using placeholder text due to invalid API key")
            return "Sample extracted text for testing. Please configure a valid Google API key."
        
        # Convert PDF content to base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Use Gemini model for OCR - update model name
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

# Function to retrieve previous papers from Cloudinary
def get_previous_papers_from_cloudinary(subject, years=3):
    """Retrieve previous years' question papers for a subject from Cloudinary."""
    try:
        current_year = datetime.datetime.now().year
        
        print(f"\nSearching Cloudinary with parameters:")
        print(f"Subject: {subject}")
        print(f"Tags: question_paper")
        
        # Search for resources in Media Library (image type)
        try:
            search_results = cloudinary.api.resources(
                type="upload",
                prefix="",  # Search all folders
                resource_type="image",  # PDFs are stored as image type in Media Library
                max_results=500,
                tags=True  # Include tags in response
            )
            
            print(f"\nFound {len(search_results.get('resources', []))} total resources")
            
            # Filter resources by tag manually since resource_by_tag doesn't work with image type
            all_resources = [
                r for r in search_results.get('resources', [])
                if 'tags' in r and 'question_paper' in r.get('tags', [])
            ]
            
            print(f"Found {len(all_resources)} resources with question_paper tag")
            
        except Exception as e:
            print(f"Error searching resources: {e}")
            return []
        
        extracted_papers = []
        for resource in all_resources:
            try:
                resource_public_id = resource['public_id']
                print(f"\nChecking resource: {resource_public_id}")
                
                # More flexible subject matching
                if subject.lower() not in resource_public_id.lower():
                    print(f"Skipping: Subject {subject} not found in {resource_public_id}")
                    continue
                
                # Get year from public_id or filename
                year = None
                for text in [resource_public_id, resource.get('original_filename', '')]:
                    # Look for both year patterns: YYYY or single digit
                    for word in text.replace('-', '_').split('_'):
                        if word.isdigit():
                            if len(word) == 4:  # Full year
                                year = int(word)
                                break
                            elif len(word) == 1:  # Single digit
                                year = current_year  # Assume it's current year
                                break
                    if year:
                        break
                
                if not year:
                    print("No year found, using current year")
                    year = current_year
                
                # Get the secure URL for the PDF
                pdf_url = resource['secure_url']
                print(f"Processing paper URL: {pdf_url}")
                
                # Extract text from the PDF
                paper_text = extract_text_from_pdf_url(pdf_url)
                
                extracted_papers.append({
                    'year': year,
                    'subject': subject,
                    'text': paper_text,
                    'url': pdf_url
                })
                print(f"Successfully processed paper from {year}")
                
            except Exception as e:
                print(f"Error processing resource: {e}")
                continue
        
        print(f"\nTotal papers extracted: {len(extracted_papers)}")
        return extracted_papers
        
    except Exception as e:
        print(f"Error in Cloudinary search: {e}")
        import traceback
        print(traceback.format_exc())
        return []

# Function to create a vector store from the paper texts
def create_vector_store(papers):
    """Create a vector store from the paper texts for semantic search."""
    texts = []
    metadatas = []
    
    for paper in papers:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_text(paper['text'])
        
        for chunk in chunks:
            texts.append(chunk)
            metadatas.append({
                'year': paper['year'],
                'subject': paper['subject'],
                'url': paper.get('url', '')
            })
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = Chroma.from_texts(texts=texts, embedding=embeddings, metadatas=metadatas)
    
    return vectorstore

# Function to create a new PDF from generated content
def create_pdf(content, output_path, subject, year):
    """Create a PDF file with the generated question paper."""
    # Convert TaskOutput to string if needed
    content_str = str(content) if content else ""
    
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # Add header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, f"{subject} Question Paper {year}")
    c.setFont("Helvetica", 12)
    
    # Add content
    text_object = c.beginText(72, height - 100)
    for line in content_str.split('\n'):
        text_object.textLine(line)
    
    c.drawText(text_object)
    c.save()
    
    return output_path

# Function to upload generated PDF to Cloudinary
def upload_to_cloudinary(pdf_path, subject, year):
    """Upload the generated PDF to Cloudinary."""
    public_id = f"question_papers/{subject}/generated_{year}"
    
    upload_result = cloudinary.uploader.upload(
        pdf_path,
        public_id=public_id,
        resource_type="raw",
        tags=["question_paper", subject, "generated", str(year)],
        metadata={
            "year": str(year),
            "subject": subject,
            "generated": "true"
        }
    )
    
    return upload_result['secure_url']

# Define the CrewAI agents
def setup_agents_and_crew(subject):
    # Configure the base LLM
    llm = LLM(
        api_key=GEMINI_API_KEY,
        model="gemini/gemini-1.5-flash",
        verbose=True,
        temperature=0.5
    )

    # Create the analyzer agent with subject-specific focus
    analyzer_agent = Agent(
        role=f"{subject} Question Paper Analyzer",
        goal=f"Analyze previous {subject} question papers to identify patterns specific to {subject} curriculum",
        backstory=f"You are an expert in {subject} education and assessment patterns, specializing in analyzing question papers.",
        verbose=True,
        memory=True,
        llm=llm,
        allow_delegation=True
    )
    
    # Create the generator agent with subject focus
    generator_agent = Agent(
        role=f"{subject} Question Paper Generator",
        goal=f"Generate a new {subject} question paper following the exact pattern and topics from analyzed papers",
        backstory=f"You are an expert in creating {subject} question papers, with deep knowledge of the curriculum.",
        verbose=True,
        memory=True,
        llm=llm,
        allow_delegation=False
    )
    
    # Create the validator agent
    validator_agent = Agent(
        role="Educational Standards Validator",
        goal="Ensure the generated question paper meets educational standards and covers the required curriculum",
        backstory="You are an experienced educator who ensures assessment materials meet curriculum requirements and educational standards.",
        verbose=True,
        memory=True,
        llm=llm,
        allow_delegation=False
    )

    # Retrieve previous papers
    papers = get_previous_papers_from_cloudinary(subject)
    
    if not papers:
        raise ValueError(f"No previous question papers found for subject: {subject}")
    
    vectorstore = create_vector_store(papers)
    
    # Update task definitions to be more specific
    analysis_task = Task(
        description=f"""
        Analyze the previous {subject} question papers to identify:
        1. Subject-specific topics covered
        2. Question patterns unique to {subject}
        3. Distribution of questions across different topics
        4. Question formats commonly used in {subject}
        
        Use ONLY the content from provided previous papers as reference.
        Do not introduce topics or patterns not present in the sample papers.
        """,
        agent=analyzer_agent,
        expected_output=f"Detailed analysis report of {subject} question paper patterns",
        context=[
            {
                "description": "Previous papers analysis data",
                "expected_output": "Analysis of paper patterns",
                "papers": [{
                    "year": p["year"],
                    "subject": p["subject"],
                    "text": p["text"],  # Use full text instead of truncating
                    "format": "Follow this exact format and structure"
                } for p in papers]
            }
        ]
    )
    
    generation_task = Task(
        description=f"""
        Generate a new {subject} question paper that:
        1. Exactly matches the format of provided sample papers
        2. Covers only topics found in the analyzed papers
        3. Uses similar question types and patterns
        4. Maintains the same difficulty level
        
        Create questions in batches of 2 to stay within rate limits.
        STRICTLY follow the format from sample papers.
        """,
        agent=generator_agent,
        expected_output=f"New {subject} question paper following exact format of samples",
        context=[
            {
                "description": "Analysis results and paper format",
                "expected_output": "Question paper matching sample format",
                "analysis_report": "{analysis_task.output}",
                "subject": subject
            }
        ]
    )
    
    validation_task = Task(
        description="Review and validate the generated question paper.",
        agent=validator_agent,
        expected_output="Validation feedback",
        context=[
            {
                "description": "Paper review",
                "expected_output": "Validation report",
                "generated_paper": "{generation_task.output}"
            }
        ]
    )
    
    final_revision_task = Task(
        description="Finalize the question paper incorporating all feedback.",
        agent=generator_agent,
        expected_output="Final question paper",
        context=[
            {
                "description": "Paper revision",
                "expected_output": "Final revised paper",
                "original_paper": "{generation_task.output}",
                "validation_feedback": "{validation_task.output}"
            }
        ]
    )
    
    # Create the crew
    crew = Crew(
        agents=[analyzer_agent, generator_agent, validator_agent],
        tasks=[analysis_task, generation_task, validation_task, final_revision_task],
        verbose=True,  # Changed from 2 to True
        process=Process.sequential
    )
    
    return crew, final_revision_task

# Main function to run the question paper generation
def generate_question_paper(subject, output_path=None):
    """Generate a new question paper with rate limiting."""
    # Setup agents and crew
    crew, final_task = setup_agents_and_crew(subject)
    
    print("Starting paper generation with rate limiting...")
    
    # Run the crew with delay between tasks
    result = crew.kickoff()
    
    # Add delay between major task transitions
    time.sleep(60)  # 1-minute delay between major operations
    
    # Get the final output and convert to string
    final_paper_content = str(final_task.output) if final_task.output else "No content generated"
    
    # If output_path is provided, create PDF and upload to Cloudinary
    if output_path:
        # Create PDF
        current_year = datetime.datetime.now().year
        pdf_path = create_pdf(
            final_paper_content, 
            output_path, 
            subject, 
            current_year
        )
        
        # Add delay before Cloudinary upload
        time.sleep(30)  # 30-second delay before upload
        
        # Upload to Cloudinary
        cloudinary_url = upload_to_cloudinary(pdf_path, subject, current_year)
        
        return {
            "local_path": pdf_path,
            "cloudinary_url": cloudinary_url,
            "content": final_paper_content
        }
    
    # If no output_path, just return the content
    return {
        "content": final_paper_content
    }

# Example usage
if __name__ == "__main__":
    subject = "ds"
    output_path = f"./generated_{subject}_paper_{datetime.datetime.now().year}.pdf"
    
    result = generate_question_paper(subject, output_path)
    print(f"Generated question paper saved locally at: {result['local_path']}")
    print(f"Generated question paper uploaded to: {result['cloudinary_url']}")
import os
import json
import uuid
import PyPDF2
import requests
from io import BytesIO
from groq import Groq
from dotenv import load_dotenv

# Load env variables (for Groq API Key)
# We assume the user has a .env in the backend or parent directory
load_dotenv('../whatsapp-bot/.env')
load_dotenv('.env')

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("[-] GROQ_API_KEY not found in environment variables. Please set it.")
    exit(1)

client = Groq(api_key=GROQ_API_KEY)

DB_PATH = r"src\main\resources\schemes_real.json"

def extract_text_from_pdf(pdf_source):
    """Downloads PDF from URL or reads from local file and extracts text."""
    try:
        if pdf_source.startswith("http://") or pdf_source.startswith("https://"):
            print(f"[*] Downloading PDF from {pdf_source}...")
            response = requests.get(pdf_source, timeout=15)
            response.raise_for_status()
            pdf_file = BytesIO(response.content)
        else:
            print(f"[*] Reading local PDF: {pdf_source}...")
            pdf_file = open(pdf_source, "rb")

        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        
        if not pdf_source.startswith("http"):
            pdf_file.close()
            
        return text.strip()
    except Exception as e:
        print(f"[-] Error extracting text from PDF: {e}")
        return None

def parse_scheme_with_ai(pdf_text, source_url=""):
    """Uses Llama 3 to structure the raw PDF text into our JSON schema."""
    print("[*] Sending extracted text to Groq AI for structuring...")
    
    # Truncate text if it's insanely long (Llama 3 8k context window is generous though)
    max_chars = 25000
    if len(pdf_text) > max_chars:
        print(f"[*] Document is very long. Truncating from {len(pdf_text)} to {max_chars} chars.")
        pdf_text = pdf_text[:max_chars]

    system_prompt = """You are a highly precise Government Scheme Data Extraction AI.
Your job is to read the provided raw text from a government PDF document and extract the scheme details into a STRICT JSON object.

The output MUST be a valid JSON object with the following keys exactly:
{
  "title": "Exact name of the scheme",
  "description": "A 2-3 sentence overview of the scheme",
  "eligibilityCriteria": "Detailed bullet points of who is eligible",
  "benefits": "Detailed bullet points of the financial/social benefits",
  "state": "The state this applies to (e.g., 'Maharashtra'), or 'All States' if central government",
  "ministry": "The department or ministry running it",
  "category": "A short 1-2 sentence category description",
  "documentsRequired": "Bullet points of required documents",
  "applicationProcess": "Step-by-step application process"
}

RULES:
1. ONLY return the raw JSON object. Do not wrap in ```json ``` blocks. No introductory text. No concluding text.
2. Ensure the JSON is perfectly valid (escape quotes properly).
3. If a field is missing in the text, put 'Not specified in document.'
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the raw text from the government document:\n\n{pdf_text}"}
            ],
            temperature=0.1, # Low temp for deterministic extraction
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Clean up in case the LLM returned markdown blocks despite instructions
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        parsed_data = json.loads(response_text)
        
        # Add the fields the AI shouldn't generate
        parsed_data["id"] = str(uuid.uuid4())
        parsed_data["amount"] = 0.0
        parsed_data["isActive"] = True
        parsed_data["applicationUrl"] = source_url if source_url.startswith("http") else "Uploaded locally"
        
        return parsed_data
        
    except json.JSONDecodeError as e:
        print("[-] AI returned invalid JSON. Could not parse.")
        print(f"Raw Output: {response_text}")
        return None
    except Exception as e:
        print(f"[-] Groq API Error: {e}")
        return None

def save_to_database(scheme_data):
    """Loads schemes_real.json, appends the new scheme, and saves it."""
    try:
        print("[*] Loading database...")
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            db = json.load(f)
            
        # Check for duplicates by title (fuzzy check could be better, but exact match for now)
        for existing in db:
            if existing['title'].lower() == scheme_data['title'].lower():
                print(f"[-] Scheme '{scheme_data['title']}' already exists in the database. Skipping.")
                return False
                
        db.append(scheme_data)
        
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(db, f, indent=2, ensure_ascii=False)
            
        print(f"[+] SUCCESS! Added '{scheme_data['title']}' to the database. Total schemes: {len(db)}")
        return True
    except Exception as e:
        print(f"[-] Error saving to database: {e}")
        return False

def ingest_pdf(pdf_source):
    print("\n==============================================")
    print("       AI SCHEME PDF INGESTOR STARTING        ")
    print("==============================================\n")
    
    text = extract_text_from_pdf(pdf_source)
    if not text:
        return
        
    print(f"[+] Extracted {len(text)} characters from PDF.")
    
    scheme_json = parse_scheme_with_ai(text, pdf_source)
    if not scheme_json:
        return
        
    print(f"[+] AI successfully structured the scheme: {scheme_json['title']}")
    
    save_to_database(scheme_json)


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        target = sys.argv[1]
        ingest_pdf(target)
    else:
        print("Usage: python ai_pdf_ingestor.py <URL_OR_LOCAL_FILE_PATH>")
        print("Example: python ai_pdf_ingestor.py https://example.gov.in/scheme.pdf")
        
        # Interactive mode
        target = input("\nEnter PDF URL or local file path to ingest: ").strip()
        if target:
            ingest_pdf(target)

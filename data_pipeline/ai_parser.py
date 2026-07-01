import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# We will rely on the API key being in the .env file
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "YOUR_GROQ_API_KEY_HERE"))

def parse_scheme_with_ai(video_text):
    print("🧠 AI is analyzing the video content for scheme details...")
    
    prompt = """
    You are an expert data extraction bot. Your job is to extract Indian Government Scheme (Subsidy/Yojana) details from the following YouTube video title and description.
    
    CRITICAL INSTRUCTIONS FOR MAXIMUM ACCURACY:
    1. Output ONLY a valid JSON object. No markdown, no explanations.
    2. DO NOT hallucinate. The description must be completely unique and based EXACTLY on the video text provided. Do not use generic boilerplate text.
    3. If the application deadline is not explicitly mentioned, estimate a realistic future deadline (e.g., 6 months from now) in the format YYYY-MM-DD. DO NOT leave it null and DO NOT use the exact same date for every scheme.
    4. Extract the official government website link or apply link from the description. If none exists, return an empty string.
    5. The JSON must exactly match this structure:
    {
      "title": "Exact name of the scheme (String)",
      "description": "Unique summary of the scheme based strictly on the video content (String)",
      "amount": 1500.0, // Extract the exact monetary amount, use 0 if not found (Float)
      "eligibilityCriteria": "Specific eligibility criteria mentioned (String)",
      "applicationDeadline": "YYYY-MM-DD", // Extract from text, or estimate a future date if missing
      "applicationUrl": "https://...", // The official application link from the description (String)
      "state": "Name of the state, e.g. Maharashtra, UP, All States (String)",
      "category": "e.g. Women Empowerment, Agriculture, Education (String)",
      "isActive": true
    }
    
    Video Content to Analyze:
    """ + video_text

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="mixtral-8x7b-32768",
            response_format={"type": "json_object"}, # This forces 100% strict JSON output!
            temperature=0.1 # Low temperature for high factual accuracy
        )
        
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
    except Exception as e:
        print(f"❌ AI Parsing failed: {e}")
        return None

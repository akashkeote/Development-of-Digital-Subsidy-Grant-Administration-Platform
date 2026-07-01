import json
import uuid

def fetch_hf_dataset():
    try:
        from datasets import load_dataset
        print("Loading dataset from HuggingFace...")
        # Load the MyScheme dataset
        dataset = load_dataset("shrijayan/gov_myscheme")
        df = dataset['train'].to_pandas()
        
        schemes = []
        for index, row in df.iterrows():
            # Handle different formats/columns that might be present
            title = row.get('scheme_name', '') or row.get('Scheme Name', '')
            desc = row.get('details', '') or row.get('Details', '')
            eligibility = row.get('eligibility', '') or row.get('Eligibility', '')
            benefits = row.get('benefits', '') or row.get('Benefits', '')
            ministry = row.get('ministry', '') or row.get('Ministry', '')
            state = row.get('state', '') or row.get('State', 'All States')
            
            # Skip if title is missing
            if not title or str(title).strip() == '':
                continue
                
            # Basic cleanup
            desc = str(desc) if str(desc) != 'nan' else ''
            eligibility = str(eligibility) if str(eligibility) != 'nan' else ''
            benefits = str(benefits) if str(benefits) != 'nan' else ''
            ministry = str(ministry) if str(ministry) != 'nan' else 'All Ministries'
            state = str(state) if str(state) != 'nan' else 'All States'
            
            scheme = {
                "id": str(uuid.uuid4()),
                "title": str(title),
                "description": desc,
                "amount": 0.0, # Cannot reliably extract amount from text
                "eligibilityCriteria": eligibility,
                "benefits": benefits,
                "state": state,
                "ministry": ministry,
                "category": "General", # Default
                "isActive": True,
                "applicationUrl": f"https://www.myscheme.gov.in/search?q={str(title).replace(' ', '+')}" # Fallback if we don't have the real one yet
            }
            schemes.append(scheme)
            
        print(f"Extracted {len(schemes)} schemes.")
        
        filepath = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\schemes_real.json"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(schemes, f, indent=2)
            
        print(f"Successfully saved to {filepath}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_hf_dataset()

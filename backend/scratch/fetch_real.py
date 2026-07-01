import requests
import json
import uuid

def fetch_myscheme_data():
    # Attempting to query the myscheme API if it's open
    # Most national portals use an API under the hood
    url = "https://www.myscheme.gov.in/api/schemes"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("API Success. Parsing data...")
            data = response.json()
            print(f"Fetched {len(data)} schemes.")
            return True
        else:
            print(f"API Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

fetch_myscheme_data()

import requests
from bs4 import BeautifulSoup
import json
import re

def inspect_myscheme():
    url = "https://www.myscheme.gov.in/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    print("Fetching page...")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            next_data = soup.find('script', id='__NEXT_DATA__')
            if next_data:
                print("Found __NEXT_DATA__. Extracting JSON...")
                data = json.loads(next_data.string)
                # Save it to a file so we can inspect it
                with open("myscheme_dump.json", "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                print("Saved to myscheme_dump.json")
            else:
                print("No __NEXT_DATA__ found.")
        else:
            print(f"Failed with status: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_myscheme()

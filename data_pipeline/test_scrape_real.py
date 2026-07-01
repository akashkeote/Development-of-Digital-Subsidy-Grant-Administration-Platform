import requests
import json
import re

url = "https://www.myscheme.gov.in/schemes/sui"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
response = requests.get(url, headers=headers)

if response.status_code == 200:
    html = response.text
    # Search for the __NEXT_DATA__ script tag
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
    if match:
        next_data = json.loads(match.group(1))
        # Save it to inspect
        with open("test_next_data.json", "w", encoding="utf-8") as f:
            json.dump(next_data, f, indent=2)
        print("Successfully extracted __NEXT_DATA__")
    else:
        print("Could not find __NEXT_DATA__")
else:
    print("Failed to fetch:", response.status_code)

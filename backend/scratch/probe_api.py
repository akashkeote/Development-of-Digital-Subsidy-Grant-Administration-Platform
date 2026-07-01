import requests
import json

def test_api():
    url = "https://api.myscheme.gov.in/search/v4/schemes"
    payload = {
        "query": "",
        "filters": {},
        "page": 1,
        "limit": 10
    }
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(json.dumps(response.json(), indent=2)[:500])
    except Exception as e:
        print(e)

test_api()

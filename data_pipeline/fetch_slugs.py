"""
STEP 1: Collect all slugs from the search API and save to slugs.json
Run this first, then run fetch_details.py
"""
import requests
import json
import time
import sys
import ssl
import urllib3
import requests.adapters

sys.stdout.reconfigure(encoding='utf-8')
urllib3.disable_warnings()

SLUGS_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\data_pipeline\slugs.json"

API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"
HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9",
    "origin": "https://www.myscheme.gov.in",
    "referer": "https://www.myscheme.gov.in/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "x-api-key": API_KEY,
    "x-client": "myscheme-ui",
}

class TLSAdapter(requests.adapters.HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        ctx = ssl.create_default_context()
        ctx.set_ciphers("DEFAULT@SECLEVEL=1")
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        kwargs["ssl_context"] = ctx
        return super().init_poolmanager(*args, **kwargs)

session = requests.Session()
session.mount("https://", TLSAdapter())

def main():
    all_slugs = []
    seen = set()
    offset = 0
    size = 50
    total = 99999

    print("Fetching all scheme slugs...")
    while offset < total:
        url = f"https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%5D&keyword=&sort=&from={offset}&size={size}"
        try:
            r = session.get(url, headers=HEADERS, timeout=15, verify=False)
            if r.status_code != 200:
                print(f"  Got {r.status_code} at offset={offset}. Stopping.")
                break

            data = r.json()
            hits = data.get("data", {}).get("hits", {})
            items = hits.get("items", [])
            total = hits.get("page", {}).get("total", 0)

            if not items:
                break

            for item in items:
                f = item.get("fields", {})
                slug = f.get("slug", "")
                if slug and slug not in seen:
                    seen.add(slug)

                    ministry_raw = f.get("nodalMinistryName", "")
                    ministry = ministry_raw.get("label", "") if isinstance(ministry_raw, dict) else str(ministry_raw)

                    cats = f.get("schemeCategory", [])
                    cat = cats[0].get("label", str(cats[0])) if cats and isinstance(cats[0], dict) else (str(cats[0]) if cats else "General")

                    states = f.get("beneficiaryState", [])
                    state = states[0].get("label", str(states[0])) if states and isinstance(states[0], dict) else (str(states[0]) if states else "All States")

                    all_slugs.append({
                        "slug": slug,
                        "schemeName": f.get("schemeName", "Unknown"),
                        "briefDescription": f.get("briefDescription", ""),
                        "ministry": ministry,
                        "category": cat,
                        "state": state,
                        "schemeCloseDate": f.get("schemeCloseDate", ""),
                        "schemeOpenDate": f.get("schemeOpenDate", ""),
                    })

            print(f"  Offset {offset}: {len(all_slugs)}/{total} slugs")
            offset += size
            time.sleep(0.2)

        except Exception as e:
            print(f"  Error at offset {offset}: {e}")
            time.sleep(2)

    with open(SLUGS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_slugs, f, indent=2, ensure_ascii=False)

    print(f"\nSaved {len(all_slugs)} slugs to slugs.json")

if __name__ == "__main__":
    main()

"""Debug: dump the full structure of the scheme detail API."""
from playwright.sync_api import sync_playwright
import json
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    result = {}

    def on_response(response):
        if "slug=sui" in response.url and "/public/schemes" in response.url and response.status == 200:
            try:
                result["data"] = response.json()
            except:
                pass

    page.on("response", on_response)
    page.goto("https://www.myscheme.gov.in/schemes/sui", wait_until="networkidle", timeout=20000)
    time.sleep(1)
    browser.close()

    scheme_data = result.get("data")

    if scheme_data:
        with open("debug_sui_full.json", "w", encoding="utf-8") as f:
            json.dump(scheme_data, f, indent=2, ensure_ascii=False)
        
        data = scheme_data.get("data", {})
        en = data.get("en", {})
        print("TOP data keys:", list(data.keys()))
        print("EN keys:", list(en.keys()) if isinstance(en, dict) else type(en))
        
        if isinstance(en, dict):
            sc = en.get("schemeContent", {})
            print("schemeContent keys:", list(sc.keys()) if isinstance(sc, dict) else type(sc))
            
            elig = sc.get("eligibilityCriteria", {})
            print("\nEligibility md:", elig.get("eligibilityDescription_md", "NOT FOUND")[:200])
    else:
        print("Failed to capture scheme data")

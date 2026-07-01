from playwright.sync_api import sync_playwright
import json, sys, time
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    docs_body = {}
    
    def on_response(response):
        if "/documents" in response.url and "api.myscheme" in response.url and response.status == 200:
            try:
                docs_body["raw"] = response.json()
            except:
                pass

    page.on("response", on_response)
    page.goto("https://www.myscheme.gov.in/schemes/sui", wait_until="networkidle", timeout=20000)
    time.sleep(1)
    browser.close()

    if "raw" in docs_body:
        with open("debug_docs_full.json", "w", encoding="utf-8") as f:
            json.dump(docs_body["raw"], f, indent=2, ensure_ascii=False)
        
        en = docs_body["raw"].get("data", {}).get("en", {})
        
        # documents_required
        dr = en.get("documents_required", [])
        print(f"documents_required: type={type(dr)}, len={len(dr) if isinstance(dr, list) else 'N/A'}")
        if dr:
            print("First item:", dr[0] if isinstance(dr, list) else dr)
            
        # documentsRequired_md
        md = en.get("documentsRequired_md", "")
        print(f"\ndocumentsRequired_md: {md[:500]}")
    else:
        print("No documents captured")

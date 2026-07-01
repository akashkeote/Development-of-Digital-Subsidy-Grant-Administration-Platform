from playwright.sync_api import sync_playwright
import json
import time

input_file = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes.json"
output_file = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"

def fetch_search_slugs(limit=20):
    print(f"Reading first {limit} slugs from {input_file}...")
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            existing = json.load(f)
            return existing[:limit]
    except Exception as e:
        print("Error reading existing schemes:", e)
    return []

def main():
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # 1. Fetch the 20 slugs using the public Search UI
        # By navigating to the search page, the browser will make the API request. We can intercept it!
        search_items = []
        
        def handle_search_response(response):
            nonlocal search_items
            if "/search/v6/schemes" in response.url and response.status == 200:
                try:
                    data = response.json()
                    search_items = data.get("data", {}).get("hits", {}).get("items", [])
                except:
                    pass

        page.on("response", handle_search_response)
        print("Fetching slugs from MyScheme Search UI...")
        try:
            page.goto("https://www.myscheme.gov.in/search", wait_until="networkidle", timeout=20000)
            time.sleep(2) # Give it a bit more time to parse
        except Exception as e:
            print("Navigation to search failed:", e)
            
        page.remove_listener("response", handle_search_response)
        
        if not search_items:
            print("Failed to intercept search API. Exiting.")
            browser.close()
            return
            
        print(f"Intercepted {len(search_items)} schemes from search!")
        
        # 2. Fetch details for each slug
        for i, item in enumerate(search_items[:20]):
            basic = item.get("fields", {})
            slug = basic.get("slug", "")
            if not slug:
                continue
                
            print(f"Fetching details for [{i+1}/20] {slug}...")
            
            detail_data = None
            def handle_detail_response(response):
                nonlocal detail_data
                if f"/schemes/v6/public/schemes" in response.url and f"slug={slug}" in response.url and response.status == 200:
                    try:
                        detail_data = response.json()
                    except:
                        pass
                        
            page.on("response", handle_detail_response)
            try:
                page.goto(f"https://www.myscheme.gov.in/schemes/{slug}", wait_until="networkidle", timeout=15000)
                time.sleep(1)
            except Exception as e:
                print(f"Timeout for {slug}")
                
            page.remove_listener("response", handle_detail_response)
            
            # Combine basic and detail
            scheme_obj = {
                "id": slug,
                "title": basic.get("schemeName", "Unknown"),
                "description": basic.get("briefDescription", ""),
                "ministry": basic.get("nodalMinistryName", ""),
                "category": basic.get("schemeCategory", ["General"])[0] if basic.get("schemeCategory") else "General",
                "state": basic.get("beneficiaryState", ["All States"])[0] if basic.get("beneficiaryState") else "All States",
                "amount": 0.0,
                "eligibilityCriteria": "Eligibility requirements apply.",
                "benefits": "",
                "applicationProcess": "",
                "documentsRequired": [],
                "applicationDeadline": basic.get("schemeCloseDate", "2027-12-31") or "2027-12-31",
                "isActive": True,
                "isExpired": False
            }
            
            if detail_data:
                try:
                    content = detail_data.get("data", {}).get("schemeContent", {})
                    elig = content.get("eligibilityCriteria", {})
                    if "eligibilityDescription_md" in elig:
                        scheme_obj["eligibilityCriteria"] = elig["eligibilityDescription_md"]
                        
                    ben = content.get("benefits", {})
                    if "benefits_md" in ben:
                        scheme_obj["benefits"] = ben["benefits_md"]
                        
                    if "process_md" in content:
                        scheme_obj["applicationProcess"] = content["process_md"]
                except Exception as e:
                    pass
            
            results.append(scheme_obj)
            
        browser.close()
        
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)
    print(f"Successfully saved {len(results)} real schemes to {output_file}")

if __name__ == "__main__":
    main()

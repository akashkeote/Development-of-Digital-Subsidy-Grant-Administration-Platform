import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def enrich_schemes():
    filepath = r"src\main\resources\schemes_real.json"
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            schemes = json.load(f)
    except FileNotFoundError:
        print("Error: schemes_real.json not found.")
        return

    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', { get: () => undefined })"
    })
    
    updated_count = 0
    # STARTING EXPLICITLY FROM SCHEME 569 AS REQUESTED
    for i in range(568, len(schemes)):
        scheme = schemes[i]
        
        # If the scheme already has long detailed benefits, we can skip it
        if scheme.get('benefits') and len(scheme['benefits']) > 50:
            continue
            
        url = scheme.get('applicationUrl')
        if not url or not url.startswith('http'):
            continue
            
        # If the url is not myscheme.gov.in but we haven't extracted details yet, 
        # we can't extract details from a random external site. We need the myscheme URL.
        # But scraper_production always sets myscheme URL initially, so this is fine.
            
        safe_title = scheme['title'].encode('ascii', 'ignore').decode('ascii')
        print(f"[{i+1}/{len(schemes)}] Deep Scraping: {safe_title}...")
        try:
            detail_url = url
            if "myscheme.gov.in" not in detail_url:
                print(f"  -> Manual URL detected. Searching myscheme for true detail page...")
                try:
                    import urllib.parse
                    search_url = f"https://www.myscheme.gov.in/search?q={urllib.parse.quote(scheme['title'])}"
                    driver.get(search_url)
                    
                    # Wait for search results to load
                    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.XPATH, "//div[@role='article']//h2/a")))
                    
                    # Get the href of the first result
                    first_result = driver.find_element(By.XPATH, "//div[@role='article']//h2/a")
                    href = first_result.get_attribute('href')
                    if href:
                        detail_url = f"https://www.myscheme.gov.in{href}" if href.startswith('/') else href
                    else:
                        raise Exception("No href found in search result")
                except Exception as e:
                    print(f"  -> Could not find myscheme detail page for this scheme via search: {e}")
                    continue # Skip this scheme if we can't find its myscheme page
                    
            driver.get(detail_url)
            
            # Check for Rate Limit (HTTP 429)
            if "HTTP ERROR 429" in driver.page_source or "This page isn't working" in driver.page_source:
                print("🚨 Rate Limited (HTTP 429)! Government firewall blocked us temporarily.")
                print("Pausing for 3 minutes before exiting. You can restart this script later to resume from where it left off.")
                time.sleep(180)
                break # Exit the script to let the ban lift. It will resume next time.

            # Wait for either #sources or standard content to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'container')]"))
            )
            time.sleep(1.5) # Allow full render
            
            # Extract Detailed Rich Text
            try:
                benefits_text = driver.find_element(By.XPATH, '//*[@id="benefits"]//div[contains(@class, "markdown-options")]').text
                if benefits_text: schemes[i]['benefits'] = benefits_text
            except Exception:
                pass
                
            try:
                eligibility_text = driver.find_element(By.XPATH, '//*[@id="eligibility"]//div[contains(@class, "markdown-options")]').text
                schemes[i]['eligibilityCriteria'] = eligibility_text
            except Exception:
                pass

            try:
                docs_text = driver.find_element(By.XPATH, '//*[@id="documents-required"]//div[contains(@class, "markdown-options")]').text
                schemes[i]['documentsRequired'] = docs_text
            except Exception:
                pass

            try:
                app_process_text = driver.find_element(By.XPATH, '//*[@id="application-process"]//div[contains(@class, "markdown-options")]').text
                schemes[i]['applicationProcess'] = app_process_text
            except Exception:
                pass
            
            # Find the official external link
            official_link = None
            try:
                sources_links = driver.find_elements(By.CSS_SELECTOR, "#sources a")
                if sources_links:
                    official_link = sources_links[0].get_attribute('href')
            except Exception:
                pass
                
            # Strategy 2: Look for any external link that is not myscheme, digitalindia, etc.
            if not official_link:
                all_links = driver.find_elements(By.TAG_NAME, "a")
                for link in all_links:
                    href = link.get_attribute('href')
                    if href and href.startswith('http') and 'myscheme.gov.in' not in href and 'twitter.com' not in href and 'facebook.com' not in href and 'digitalindia' not in href and 'mygov.in' not in href:
                        if 'nic.in' in href or 'gov.in' in href or 'org.in' in href:
                            official_link = href
                            break
                            
            if official_link:
                print(f"  -> Found Official Link: {official_link}")
                schemes[i]['applicationUrl'] = official_link
                updated_count += 1
            else:
                print("  -> Could not find official link. Searching google fallback...")
                search_query = scheme['title'].replace(' ', '+')
                schemes[i]['applicationUrl'] = f"https://www.google.com/search?q={search_query}+official+website"
                
        except Exception as e:
            print(f"  -> Error deep scraping: {e}")
            
        # Random delay to prevent getting blocked again
        import random
        delay = random.uniform(3, 7)
        time.sleep(delay)
            
        # Save incrementally
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(schemes, f, indent=2)
            
    driver.quit()
    print(f"\n[SUCCESS] Successfully enriched {updated_count} schemes with Direct Official URLs!")

if __name__ == "__main__":
    enrich_schemes()

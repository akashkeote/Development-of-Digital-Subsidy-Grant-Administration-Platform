import json
import uuid
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

def setup_driver():
    chrome_options = Options()
    # We will run non-headless first to bypass simple bot checks and allow the user to see the process.
    # chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    print("[INIT] Starting ChromeDriver...")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Execute CDP command to remove webdriver property
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        """
    })
    return driver

def scrape_schemes(max_pages=2):
    driver = setup_driver()
    base_url = "https://www.myscheme.gov.in/search"
    all_schemes = []
    
    print(f"[SCRAPER] Navigating to {base_url}")
    driver.get(base_url)
    
    try:
        # Wait for either the search results container or any scheme link
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/schemes/']"))
        )
        print("[SCRAPER] Page loaded successfully. Starting extraction...")
    except Exception as e:
        print(f"[ERROR] Timeout waiting for schemes to load. Anti-bot might be blocking rendering. {e}")
        driver.quit()
        return []
        
    current_page = 1
    
    while current_page <= max_pages:
        print(f"\n--- Scraping Page {current_page} ---")
        time.sleep(3) # Let images and dynamic text settle
        
        soup = BeautifulSoup(driver.page_source, "html.parser")
        # Find all scheme cards using the role="article" attribute
        cards = soup.find_all("div", attrs={"role": "article"})
        
        if not cards:
            print("[SCRAPER] No scheme cards found on this page. Stopping.")
            break
            
        initial_count = len(all_schemes)
            
        for card in cards:
            try:
                # Extract Title & URL
                title_elem = card.find("h2", id=lambda x: x and x.startswith("scheme-name-"))
                anchor = title_elem.find("a") if title_elem else None
                title = title_elem.text.strip() if title_elem else "Unknown Scheme"
                
                # Extract URL
                href = anchor['href'] if anchor and anchor.has_attr('href') else ""
                detail_url = f"https://www.myscheme.gov.in{href}" if href else ""
                
                # Extract Ministry
                ministry_elem = card.find("h2", attrs={"aria-label": lambda x: x and x.startswith("Filter by")})
                ministry = ministry_elem.text.strip() if ministry_elem else "Unknown Ministry"
                
                # Extract Description
                desc_elem = card.find("span", attrs={"aria-label": lambda x: x and x.startswith("Brief description:")})
                description = desc_elem.text.strip() if desc_elem else ""
                
                # Extract Tags (Category/State)
                tags = []
                # Fallback to finding all small spans if specific tag containers aren't obvious
                small_spans = card.find_all("span", class_=lambda c: c and "text-xs" in c)
                tags = [t.text.strip() for t in small_spans if t.text.strip()]
                category = tags[0] if tags else "General"
                state = "All States"
                
                scheme_id = str(uuid.uuid4())
                
                scheme = {
                    "id": scheme_id,
                    "title": title,
                    "description": description,
                    "amount": 0.0,
                    "eligibilityCriteria": "See official guidelines for full eligibility.",
                    "benefits": "Financial/Social Assistance.",
                    "state": state,
                    "ministry": ministry,
                    "category": category,
                    "isActive": True,
                    "applicationUrl": detail_url 
                }
                
                if title != "Unknown Scheme" and not any(s['title'] == scheme['title'] for s in all_schemes):
                    all_schemes.append(scheme)
                    print(f"Scraped: {title}")
                    
            except Exception as e:
                print(f"Error parsing a card: {e}")
                
        if len(all_schemes) == initial_count:
            print("No new schemes found on this page. Reached the end.")
            break
        
        # Move to next page
        if current_page < max_pages:
            try:
                # React 17+ Synthetic Events require a bubbling mouse event, not just a raw DOM click.
                next_buttons = driver.find_elements(By.XPATH, "//ul[contains(@class, 'justify-center')]/*[last()]")
                if next_buttons:
                    driver.execute_script("arguments[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));", next_buttons[0])
                    current_page += 1
                    print("Navigating to next page...")
                    time.sleep(4)
                else:
                    print("Next button disabled or not found. Reached the end.")
                    break
            except Exception as e:
                print(f"Could not click Next button: {e}")
                break
        else:
            break
            
    driver.quit()
    return all_schemes

def main():
    schemes = scrape_schemes(max_pages=100)
    if schemes:
        filepath = r"src\main\resources\schemes_real.json"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(schemes, f, indent=2)
        existing_schemes = schemes
        new_additions = schemes
            
        print(f"\n[SUCCESS] Added {len(new_additions)} NEW schemes. Total schemes in DB: {len(existing_schemes)}")
    else:
        print("\n[FAILED] No schemes were scraped.")

if __name__ == "__main__":
    main()

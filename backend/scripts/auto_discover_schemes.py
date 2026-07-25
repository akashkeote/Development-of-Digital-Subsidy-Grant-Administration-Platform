import time
import urllib.parse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Import our AI Ingestor logic
from ai_pdf_ingestor import ingest_pdf

def discover_pdfs_from_google(query, num_pages=2):
    """Uses Selenium to search Google and extract PDF URLs."""
    print(f"[*] Starting Selenium Spider for query: '{query}'")
    
    options = Options()
    # options.add_argument('--headless') # Removed to bypass Google bot detection
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    # Keep browser open after script finishes
    options.add_experimental_option("detach", True)
    # Spoof user agent to avoid Google blocks
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = webdriver.Chrome(options=options)
    pdf_links = set()
    
    try:
        for page in range(num_pages):
            start = page * 10
            url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&start={start}"
            print(f"[*] Scraping Google Page {page + 1}...")
            
            driver.get(url)
            time.sleep(3) # Be polite to Google
            
            # Find all <a> tags and extract their hrefs
            search_results = driver.find_elements(By.TAG_NAME, "a")
            
            for result in search_results:
                link = result.get_attribute("href")
                if not link:
                    continue
                
                # If Google wraps it in a redirect (e.g. /url?q=https://...)
                if "google.com/url?" in link:
                    from urllib.parse import urlparse, parse_qs
                    parsed_url = urlparse(link)
                    query_params = parse_qs(parsed_url.query)
                    if 'q' in query_params:
                        link = query_params['q'][0]
                    elif 'url' in query_params:
                        link = query_params['url'][0]
                
                if ".pdf" in link.lower() and (".gov.in" in link or ".nic.in" in link):
                    pdf_links.add(link)
                    print(f"    [+] Found PDF: {link}")
                    
    except Exception as e:
        print(f"[-] Selenium Error during Google search: {e}")
        
    return list(pdf_links)


def main():
    print("\n==================================================")
    print("      AUTOMATED SELENIUM SCHEME DISCOVERER        ")
    print("==================================================\n")
    
    # Advanced Google Dork to find newly uploaded government scheme PDFs
    search_query = 'filetype:pdf "scheme" OR "yojana" site:.gov.in OR site:.nic.in'
    
    discovered_pdfs = discover_pdfs_from_google(search_query, num_pages=1)
    
    if not discovered_pdfs:
        print("[-] No valid government PDFs found in this run.")
        return
        
    print(f"\n[+] Selenium Spider found {len(discovered_pdfs)} unique PDF(s).")
    print("[*] Handing over to AI PDF Ingestor...\n")
    
    success_count = 0
    for idx, pdf_url in enumerate(discovered_pdfs):
        print(f"\n--- Processing Document {idx + 1}/{len(discovered_pdfs)} ---")
        try:
            # Call the ingest_pdf function from our ai_pdf_ingestor.py script!
            ingest_pdf(pdf_url)
            success_count += 1
        except Exception as e:
            print(f"[-] Failed to auto-ingest {pdf_url}: {e}")
            
    print(f"\n==================================================")
    print(f" 🎉 AUTOMATION COMPLETE: {success_count}/{len(discovered_pdfs)} documents processed!")
    print("==================================================\n")

if __name__ == "__main__":
    main()

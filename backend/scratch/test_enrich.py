import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

print("Starting test enrich...")
filepath = r"src/main/resources/schemes_real.json"
with open(filepath, 'r', encoding='utf-8') as f:
    schemes = json.load(f)

print(f"Loaded {len(schemes)} schemes")

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
print("Driver started")

for i, scheme in enumerate(schemes[:10]): # check first 10
    print(f"Checking {scheme['title']}...")
    url = scheme.get('applicationUrl')
    print("URL is", url)
    if not url or not url.startswith('http'):
        continue
    
    print(f"Navigating to {url}")
    driver.get(url)
    try:
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        print("Page loaded")
    except Exception as e:
        print("Error waiting:", e)
        
    try:
        benefits = driver.find_element(By.XPATH, '//*[@id="benefits"]//div[contains(@class, "markdown-options")]').text
        print("BENEFITS LEN:", len(benefits))
    except Exception as e:
        print("Benefits not found")
        
driver.quit()

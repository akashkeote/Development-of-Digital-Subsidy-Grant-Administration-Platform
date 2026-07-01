import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
driver = webdriver.Chrome(options=chrome_options)

url = "https://www.myscheme.gov.in/schemes/pmkisan"
driver.get(url)
time.sleep(5)

print("--- PAGE LOADED ---")
try:
    details = driver.find_element(By.ID, "details").text
    print(f"DETAILS FOUND (Length: {len(details)})")
    print(details[:100] + "...")
except:
    print("No details found")

try:
    benefits = driver.find_element(By.ID, "benefits").text
    print(f"BENEFITS FOUND (Length: {len(benefits)})")
except:
    print("No benefits found")
    
try:
    eligibility = driver.find_element(By.ID, "eligibility").text
    print(f"ELIGIBILITY FOUND (Length: {len(eligibility)})")
except:
    print("No eligibility found")

try:
    documents = driver.find_element(By.ID, "documents-required").text
    print(f"DOCUMENTS FOUND (Length: {len(documents)})")
except:
    print("No documents found")

driver.quit()

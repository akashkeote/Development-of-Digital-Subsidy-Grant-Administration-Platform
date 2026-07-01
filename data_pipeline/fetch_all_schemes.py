"""
Fetch ALL 4730 schemes from MyScheme.gov.in API and upload to Firebase
"""
import requests, json, uuid, time, ssl, urllib3
urllib3.disable_warnings()
import requests.adapters

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
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\Subsidy_Project\backend\src\main\resources\serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"
HEADERS = {
    "x-api-key": API_KEY,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Origin": "https://www.myscheme.gov.in",
    "Referer": "https://www.myscheme.gov.in/",
}

def fetch_all():
    schemes = []
    offset = 0
    size = 50
    total = 99999
    
    while offset < total:
        url = f"https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%5D&keyword=&sort=&from={offset}&size={size}"
        r = session.get(url, headers=HEADERS, timeout=15, verify=False)
        if r.status_code != 200:
            print(f"  HTTP {r.status_code} at offset {offset}")
            break
        
        data = r.json()
        hits = data.get("data", {}).get("hits", {})
        items = hits.get("items", [])
        page_info = hits.get("page", {})
        total = page_info.get("total", 0)
        
        if not items:
            break
        
        for item in items:
            f = item.get("fields", {})
            title = f.get("schemeName", "")
            slug = f.get("slug", "")
            cats = f.get("schemeCategory", ["Social Welfare"])
            states = f.get("beneficiaryState", ["All States"])
            state = states[0] if states else "All States"
            cat = cats[0] if cats else "Social Welfare"
            
            # --- FIX: Extract REAL unique description ---
            desc = f.get("briefDescription", "")
            if not desc or len(desc.strip()) < 10:
                # Try longer description fields
                desc = f.get("schemeDescription", "") or f.get("detailedDescription", "")
            if not desc or len(desc.strip()) < 10:
                desc = f"Government scheme: {title}. For full details and eligibility, visit myscheme.gov.in/schemes/{slug}"
            
            # --- FIX: Extract REAL dates instead of hardcoding ---
            open_date = f.get("schemeOpenDate", "") or f.get("openDate", "") or ""
            close_date = f.get("schemeCloseDate", "") or f.get("closeDate", "") or ""
            
            # Validate date format (YYYY-MM-DD)
            import re
            date_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}')
            
            if not open_date or not date_pattern.match(str(open_date)):
                open_date = None  # Will be null in DB — frontend handles fallback
            else:
                open_date = str(open_date)[:10]  # Trim to YYYY-MM-DD
                
            if not close_date or not date_pattern.match(str(close_date)):
                close_date = None  # Will be null — frontend shows "Open-ended"
            else:
                close_date = str(close_date)[:10]
            
            if title:
                schemes.append({
                    "title": title,
                    "description": desc.strip(),
                    "eligibilityCriteria": f.get("eligibilityCriteria", "") or f"Check eligibility at myscheme.gov.in/schemes/{slug}",
                    "state": state,
                    "category": cat,
                    "amount": 0,
                    "startDate": open_date,
                    "applicationDeadline": close_date,
                    "applicationUrl": f"https://www.myscheme.gov.in/schemes/{slug}",
                    "active": True
                })
        
        offset += size
        print(f"  Fetched {offset}/{total} schemes...")
        time.sleep(0.2)
    
    return schemes

def upload(schemes):
    existing = set()
    for doc in db.collection("subsidies").stream():
        existing.add(doc.to_dict().get("title", "").lower().strip())
    added = 0
    batch = db.batch()
    for s in schemes:
        key = s["title"].lower().strip()
        if key in existing or not s["title"]:
            continue
        s["id"] = str(uuid.uuid4())
        ref = db.collection("subsidies").document(s["id"])
        batch.set(ref, s)
        existing.add(key)
        added += 1
        if added % 450 == 0:
            batch.commit()
            batch = db.batch()
            print(f"  Committed {added}...")
    batch.commit()
    return added

if __name__ == "__main__":
    print("=" * 50)
    print("MYSCHEME FETCHER - ALL 4730 SCHEMES")
    print("=" * 50)
    schemes = fetch_all()
    print(f"\nFetched: {len(schemes)}")
    print("Uploading to Firestore...")
    added = upload(schemes)
    total = len(list(db.collection("subsidies").stream()))
    print(f"\nDONE! Added: {added} | Total in DB: {total}")

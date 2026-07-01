"""
MULTI-SOURCE GOVERNMENT SCHEME FETCHER
========================================
Fetches schemes from MULTIPLE independent sources to avoid single-point-of-failure.

Sources:
  1. MyScheme.gov.in API  (Primary — 4700+ schemes)
  2. Data.gov.in OGD API  (Secondary — Open Government Data)
  3. India.gov.in Scraper  (Tertiary — National Portal)
  4. YouTube AI Pipeline   (Supplementary — Video-based extraction)
"""

import requests, json, uuid, time, ssl, urllib3, re, os
urllib3.disable_warnings()
import requests.adapters
from dotenv import load_dotenv
load_dotenv()

# ═══════════════════════════════════════════════════════
# TLS Adapter for government sites with old certificates
# ═══════════════════════════════════════════════════════
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

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html",
}

DATE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}')

def clean_date(raw_date):
    """Validate and return a clean YYYY-MM-DD date, or None."""
    if not raw_date:
        return None
    raw_date = str(raw_date).strip()
    if DATE_PATTERN.match(raw_date):
        return raw_date[:10]
    return None


# ═══════════════════════════════════════════════════════
# SOURCE 1: MyScheme.gov.in API (Primary)
#   Split into: 680+ Central + 4040+ State/UT schemes
# ═══════════════════════════════════════════════════════

MYSCHEME_API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"
MYSCHEME_HEADERS = {
    **HEADERS,
    "x-api-key": MYSCHEME_API_KEY,
    "Origin": "https://www.myscheme.gov.in",
    "Referer": "https://www.myscheme.gov.in/",
}

# All 36 States & UTs on MyScheme
ALL_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]

# All 15 Categories on MyScheme (scraped from website DOM)
ALL_CATEGORIES = [
    ("Agriculture,Rural & Environment", 852),
    ("Banking,Financial Services and Insurance", 327),
    ("Business & Entrepreneurship", 763),
    ("Education & Learning", 1106),
    ("Health & Wellness", 286),
    ("Housing & Shelter", 136),
    ("Public Safety,Law & Justice", 34),
    ("Science, IT & Communications", 117),
    ("Skills & Employment", 400),
    ("Social welfare & Empowerment", 1445),
    ("Sports & Culture", 264),
    ("Transport & Infrastructure", 104),
    ("Travel & Tourism", 96),
    ("Utility & Sanitation", 58),
    ("Women and Child", 470),
]

def _parse_myscheme_item(item, scheme_type="central"):
    """Parse a single scheme item from the MyScheme API response."""
    f = item.get("fields", {})
    title = f.get("schemeName", "")
    slug = f.get("slug", "")
    cats = f.get("schemeCategory", ["Social Welfare"])
    states = f.get("beneficiaryState", ["All States"])
    state = states[0] if states else "All States"
    cat = cats[0] if cats else "Social Welfare"
    ministry = f.get("nodalMinistryName", {})
    ministry_name = ""
    if isinstance(ministry, dict):
        ministry_name = ministry.get("value", "")
    elif isinstance(ministry, str):
        ministry_name = ministry

    desc = f.get("briefDescription", "")
    if not desc or len(desc.strip()) < 10:
        desc = f.get("schemeDescription", "") or f.get("detailedDescription", "")
    if not desc or len(desc.strip()) < 10:
        desc = f"Government scheme: {title}. Visit myscheme.gov.in/schemes/{slug} for details."

    if not title:
        return None

    return {
        "title": title,
        "description": desc.strip(),
        "eligibilityCriteria": f.get("eligibilityCriteria", "") or f"Check eligibility at myscheme.gov.in/schemes/{slug}",
        "state": state,
        "category": cat,
        "amount": 0,
        "startDate": clean_date(f.get("schemeOpenDate") or f.get("openDate")),
        "applicationDeadline": clean_date(f.get("schemeCloseDate") or f.get("closeDate")),
        "applicationUrl": f"https://www.myscheme.gov.in/schemes/{slug}",
        "isActive": True,
        "schemeType": scheme_type,  # "central" or "state"
        "ministry": ministry_name,
        "source": "myscheme.gov.in"
    }

def _fetch_myscheme_paginated(filter_query, label, max_items=5000):
    """Generic paginated fetcher for MyScheme API with a given filter."""
    schemes = []
    offset = 0
    size = 50
    total = 99999
    
    # URL-encode the filter query
    import urllib.parse
    encoded_q = urllib.parse.quote(json.dumps(filter_query))

    while offset < total and len(schemes) < max_items:
        try:
            url = f"https://api.myscheme.gov.in/search/v6/schemes?lang=en&q={encoded_q}&keyword=&sort=&from={offset}&size={size}"
            r = session.get(url, headers=MYSCHEME_HEADERS, timeout=15, verify=False)
            if r.status_code != 200:
                print(f"    ❌ HTTP {r.status_code} at offset {offset}")
                break

            data = r.json()
            hits = data.get("data", {}).get("hits", {})
            items = hits.get("items", [])
            page_info = hits.get("page", {})
            total = page_info.get("total", 0)

            if not items:
                break

            scheme_type = "central" if "Central" in label else "state"
            for item in items:
                parsed = _parse_myscheme_item(item, scheme_type)
                if parsed:
                    schemes.append(parsed)

            offset += size
            if offset % 200 == 0 or offset >= total:
                print(f"    ✅ {label}: {min(offset, total)}/{total}")
            time.sleep(0.3)
        except Exception as e:
            print(f"    ❌ {label} error at offset {offset}: {e}")
            break

    return schemes

def fetch_from_myscheme():
    """
    Fetch schemes from MyScheme.gov.in split into:
      - 680+ Central Schemes (by Central Ministries)
      - 4040+ State/UT Schemes (by each State separately)
    """
    print("\n" + "=" * 60)
    print("📡 SOURCE 1: MyScheme.gov.in API")
    print("   → 680+ Central Schemes + 4040+ State/UT Schemes")
    print("=" * 60)

    all_schemes = []

    # ──────────────────────────────────────────
    # PHASE 1: Fetch ALL Central Schemes (680+)
    # ──────────────────────────────────────────
    print("\n  🏛️  [PHASE 1] Fetching CENTRAL Schemes...")
    # Empty filter first to get all, then we tag them
    central_filter = []  # Empty = all schemes
    central_schemes = _fetch_myscheme_paginated(central_filter, "Central Schemes", max_items=5000)
    
    # Tag Central vs State based on beneficiaryState field
    central_tagged = []
    state_tagged = []
    for s in central_schemes:
        state_val = s.get("state", "").strip()
        if state_val in ("All", "All States", "All India", "NA", ""):
            s["schemeType"] = "central"
            s["state"] = "All States"
            central_tagged.append(s)
        else:
            s["schemeType"] = "state"
            state_tagged.append(s)
    
    print(f"  🏛️  Central Schemes tagged: {len(central_tagged)}")
    print(f"  🗺️  State Schemes tagged:   {len(state_tagged)}")
    all_schemes.extend(central_tagged)
    all_schemes.extend(state_tagged)

    # ──────────────────────────────────────────
    # PHASE 2: Fetch State-wise Schemes (4040+)
    #   Individual state filters to catch schemes
    #   that may have been missed in the bulk fetch
    # ──────────────────────────────────────────
    print("\n  🗺️  [PHASE 2] Fetching STATE-WISE Schemes...")
    existing_titles = {s["title"].lower().strip() for s in all_schemes}
    state_new_count = 0

    for state_name in ALL_STATES:
        try:
            # MyScheme API filter format for state
            state_filter = [{"identifier": "beneficiaryState", "value": state_name}]
            state_schemes = _fetch_myscheme_paginated(state_filter, f"  {state_name}", max_items=500)
            
            new_in_state = 0
            for s in state_schemes:
                key = s["title"].lower().strip()
                if key not in existing_titles:
                    s["schemeType"] = "state"
                    s["state"] = state_name
                    all_schemes.append(s)
                    existing_titles.add(key)
                    new_in_state += 1
                    state_new_count += 1
            
            if new_in_state > 0:
                print(f"    🆕 {state_name}: +{new_in_state} new schemes")
            
            time.sleep(0.2)
        except Exception as e:
            print(f"    ⚠️ {state_name}: {e}")

    print(f"\n  📦 Total from MyScheme: {len(all_schemes)}")
    print(f"     Central: {len(central_tagged)} | State: {len(state_tagged) + state_new_count}")
    return all_schemes


# ═══════════════════════════════════════════════════════
# SOURCE 2: Data.gov.in Open Government Data (OGD) API
# ═══════════════════════════════════════════════════════
def fetch_from_datagov():
    """Fetch scheme data from data.gov.in Open Government Data platform."""
    print("\n" + "=" * 60)
    print("📡 SOURCE 2: Data.gov.in (Open Government Data)")
    print("=" * 60)
    
    schemes = []
    
    # Known open datasets on data.gov.in related to government schemes
    # These are curated resource IDs from the OGD portal
    OGD_ENDPOINTS = [
        # Central Sector Schemes
        "https://data.gov.in/backend/dmspublic/v1/resources?filters%5Btitle%5D=scheme&offset=0&limit=50&sort%5Bcreated%5D=desc",
        # State welfare schemes dataset
        "https://data.gov.in/backend/dmspublic/v1/resources?filters%5Btitle%5D=subsidy&offset=0&limit=50&sort%5Bcreated%5D=desc",
        # Grant disbursement datasets 
        "https://data.gov.in/backend/dmspublic/v1/resources?filters%5Btitle%5D=welfare&offset=0&limit=50&sort%5Bcreated%5D=desc",
    ]
    
    for endpoint in OGD_ENDPOINTS:
        try:
            r = session.get(endpoint, headers=HEADERS, timeout=15, verify=False)
            if r.status_code != 200:
                print(f"  ⚠️ HTTP {r.status_code} for data.gov.in endpoint")
                continue
            
            data = r.json()
            resources = data.get("data", []) or data.get("records", []) or []
            
            for item in resources:
                title = item.get("title", "") or item.get("scheme_name", "")
                desc = item.get("description", "") or item.get("field_description", "")
                
                if title and len(title) > 5:
                    schemes.append({
                        "title": title,
                        "description": desc.strip() if desc else f"Open Government Data scheme: {title}",
                        "eligibilityCriteria": item.get("eligibility", "") or "Check data.gov.in for eligibility details",
                        "state": item.get("state", "") or "All States",
                        "category": item.get("sector", "") or item.get("category", "") or "Social Welfare",
                        "amount": 0,
                        "startDate": clean_date(item.get("created") or item.get("start_date")),
                        "applicationDeadline": clean_date(item.get("end_date") or item.get("deadline")),
                        "applicationUrl": item.get("catalog_url", "") or f"https://data.gov.in",
                        "isActive": True,
                        "source": "data.gov.in"
                    })
            
            print(f"  ✅ Fetched {len(resources)} resources from OGD endpoint")
            time.sleep(0.5)
        except Exception as e:
            print(f"  ⚠️ data.gov.in fetch error: {e}")
    
    print(f"  📦 Total from Data.gov.in: {len(schemes)}")
    return schemes


# ═══════════════════════════════════════════════════════
# SOURCE 3: India.gov.in National Portal Scraper
# ═══════════════════════════════════════════════════════
def fetch_from_india_gov():
    """Scrape scheme data from india.gov.in spotlight pages."""
    print("\n" + "=" * 60)
    print("📡 SOURCE 3: India.gov.in (National Portal)")
    print("=" * 60)
    
    schemes = []
    
    # India.gov.in has categorized scheme pages
    SCHEME_PAGES = [
        "https://www.india.gov.in/my-government/schemes",
        "https://www.india.gov.in/spotlight",
    ]
    
    for page_url in SCHEME_PAGES:
        try:
            r = session.get(page_url, headers=HEADERS, timeout=15, verify=False)
            if r.status_code != 200:
                print(f"  ⚠️ HTTP {r.status_code} for {page_url}")
                continue
            
            # Parse scheme links from HTML
            html = r.text
            # Find scheme titles and links using regex (lightweight, no BeautifulSoup needed)
            links = re.findall(r'<a[^>]*href="(/[^"]*scheme[^"]*)"[^>]*>([^<]+)</a>', html, re.IGNORECASE)
            alt_links = re.findall(r'<a[^>]*href="(https?://[^"]*)"[^>]*title="([^"]*scheme[^"]*)"', html, re.IGNORECASE)
            
            for link, title in links + alt_links:
                title = title.strip()
                if title and len(title) > 5 and len(title) < 200:
                    full_url = link if link.startswith("http") else f"https://www.india.gov.in{link}"
                    schemes.append({
                        "title": title,
                        "description": f"Government of India scheme: {title}. Visit india.gov.in for detailed information.",
                        "eligibilityCriteria": "Visit india.gov.in for eligibility criteria",
                        "state": "All States",
                        "category": "Central Government",
                        "amount": 0,
                        "startDate": None,
                        "applicationDeadline": None,
                        "applicationUrl": full_url,
                        "isActive": True,
                        "source": "india.gov.in"
                    })
            
            print(f"  ✅ Found {len(links) + len(alt_links)} scheme references from {page_url}")
            time.sleep(0.5)
        except Exception as e:
            print(f"  ⚠️ india.gov.in scrape error: {e}")
    
    print(f"  📦 Total from India.gov.in: {len(schemes)}")
    return schemes


# ═══════════════════════════════════════════════════════
# SOURCE 4: YouTube AI Pipeline (existing scraper)
# ═══════════════════════════════════════════════════════
def fetch_from_youtube_ai():
    """Use existing YouTube + AI pipeline to extract schemes from videos."""
    print("\n" + "=" * 60)
    print("📡 SOURCE 4: YouTube AI Pipeline")
    print("=" * 60)
    
    schemes = []
    try:
        from youtube_scraper import get_marathi_corner_videos, get_all_states_videos
        from ai_parser import parse_scheme_with_ai
        
        # Fetch videos
        marathi_videos = get_marathi_corner_videos()
        state_videos = get_all_states_videos()
        all_videos = marathi_videos + state_videos
        
        print(f"  🎬 Found {len(all_videos)} videos to process")
        
        for video in all_videos:
            context = f"Title: {video['title']}\nDescription: {video['description']}"
            parsed_data = parse_scheme_with_ai(context)
            
            if parsed_data and parsed_data.get("title"):
                parsed_data["source"] = "youtube_ai"
                parsed_data["isActive"] = True
                if "applicationUrl" not in parsed_data:
                    parsed_data["applicationUrl"] = ""
                schemes.append(parsed_data)
            
            time.sleep(2)  # Avoid Groq rate limits
    except ImportError:
        print("  ⚠️ YouTube scraper modules not found. Skipping this source.")
    except Exception as e:
        print(f"  ⚠️ YouTube AI pipeline error: {e}")
    
    print(f"  📦 Total from YouTube AI: {len(schemes)}")
    return schemes


# ═══════════════════════════════════════════════════════
# DEDUPLICATION ENGINE
# ═══════════════════════════════════════════════════════
def deduplicate_schemes(all_schemes):
    """Remove duplicate schemes across multiple sources. Prefers richer data."""
    print("\n" + "=" * 60)
    print("🔄 DEDUPLICATION ENGINE")
    print("=" * 60)
    
    seen = {}
    
    for scheme in all_schemes:
        title = scheme.get("title", "").strip().lower()
        if not title or len(title) < 3:
            continue
        
        # If we've seen this title, keep the version with more data
        if title in seen:
            existing = seen[title]
            # Prefer the one with a real description (not generic)
            existing_desc_len = len(existing.get("description", ""))
            new_desc_len = len(scheme.get("description", ""))
            
            if new_desc_len > existing_desc_len:
                seen[title] = scheme  # Replace with richer version
        else:
            seen[title] = scheme
    
    deduped = list(seen.values())
    
    # Assign unique IDs
    for scheme in deduped:
        if "id" not in scheme or not scheme["id"]:
            scheme["id"] = str(uuid.uuid4())
    
    print(f"  📊 Before dedup: {len(all_schemes)} | After dedup: {len(deduped)}")
    return deduped


# ═══════════════════════════════════════════════════════
# FIREBASE UPLOADER
# ═══════════════════════════════════════════════════════
def upload_to_firebase(schemes):
    """Upload deduplicated schemes to Firebase Firestore."""
    print("\n" + "=" * 60)
    print("🔥 UPLOADING TO FIREBASE")
    print("=" * 60)
    
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        
        # Find service account key
        key_paths = [
            os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "serviceAccountKey.json"),
            r"c:\Users\Akash\Desktop\New folder\Infosys-Springboard-7.0\backend\src\main\resources\serviceAccountKey.json",
        ]
        
        key_path = None
        for p in key_paths:
            if os.path.exists(p):
                key_path = p
                break
        
        if not key_path:
            print("  ❌ serviceAccountKey.json not found! Skipping Firebase upload.")
            return 0
        
        cred = credentials.Certificate(key_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # Get existing scheme titles to avoid duplicates
        existing = set()
        for doc in db.collection("subsidies").stream():
            existing.add(doc.to_dict().get("title", "").lower().strip())
        
        added = 0
        updated = 0
        batch = db.batch()
        
        for s in schemes:
            key = s["title"].lower().strip()
            
            if key in existing:
                # Update existing scheme with fresh data
                docs = db.collection("subsidies").where("title", "==", s["title"]).limit(1).stream()
                for doc in docs:
                    batch.update(doc.reference, s)
                    updated += 1
                    break
            else:
                # Insert new scheme
                s["id"] = str(uuid.uuid4())
                ref = db.collection("subsidies").document(s["id"])
                batch.set(ref, s)
                existing.add(key)
                added += 1
            
            # Commit in batches of 450 (Firestore limit is 500)
            if (added + updated) % 450 == 0 and (added + updated) > 0:
                batch.commit()
                batch = db.batch()
                print(f"  💾 Committed batch... (Added: {added}, Updated: {updated})")
        
        batch.commit()
        print(f"  ✅ Firebase upload complete! Added: {added} | Updated: {updated}")
        return added + updated
    except ImportError:
        print("  ❌ firebase_admin not installed. Run: pip install firebase-admin")
        return 0
    except Exception as e:
        print(f"  ❌ Firebase upload error: {e}")
        return 0


# ═══════════════════════════════════════════════════════
# MAIN ORCHESTRATOR
# ═══════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("🚀 MULTI-SOURCE GOVERNMENT SCHEME AGGREGATOR")
    print("   Fetching from 4 independent sources...")
    print("=" * 60)
    
    all_schemes = []
    source_stats = {}
    
    # Source 1: MyScheme.gov.in (Primary — most reliable, 4700+ schemes)
    try:
        myscheme_data = fetch_from_myscheme(max_schemes=5000)
        all_schemes.extend(myscheme_data)
        source_stats["myscheme.gov.in"] = len(myscheme_data)
    except Exception as e:
        print(f"  ❌ MyScheme source failed: {e}")
        source_stats["myscheme.gov.in"] = 0
    
    # Source 2: Data.gov.in (Secondary — Open Government Data)
    try:
        datagov_data = fetch_from_datagov()
        all_schemes.extend(datagov_data)
        source_stats["data.gov.in"] = len(datagov_data)
    except Exception as e:
        print(f"  ❌ Data.gov.in source failed: {e}")
        source_stats["data.gov.in"] = 0
    
    # Source 3: India.gov.in (Tertiary — National Portal)
    try:
        indiagov_data = fetch_from_india_gov()
        all_schemes.extend(indiagov_data)
        source_stats["india.gov.in"] = len(indiagov_data)
    except Exception as e:
        print(f"  ❌ India.gov.in source failed: {e}")
        source_stats["india.gov.in"] = 0
    
    # Source 4: YouTube AI Pipeline (Supplementary)
    try:
        youtube_data = fetch_from_youtube_ai()
        all_schemes.extend(youtube_data)
        source_stats["youtube_ai"] = len(youtube_data)
    except Exception as e:
        print(f"  ❌ YouTube AI source failed: {e}")
        source_stats["youtube_ai"] = 0
    
    # Deduplicate across all sources
    final_schemes = deduplicate_schemes(all_schemes)
    
    # Upload to Firebase
    total_uploaded = upload_to_firebase(final_schemes)
    
    # Final Report
    print("\n" + "=" * 60)
    print("📊 FINAL REPORT")
    print("=" * 60)
    for source, count in source_stats.items():
        status = "✅" if count > 0 else "❌"
        print(f"  {status} {source}: {count} schemes fetched")
    print(f"  ─────────────────────────────────")
    print(f"  📥 Total Raw:       {len(all_schemes)}")
    print(f"  🔄 After Dedup:     {len(final_schemes)}")
    print(f"  🔥 Uploaded to DB:  {total_uploaded}")
    print("=" * 60)
    print("✅ MULTI-SOURCE AGGREGATION COMPLETE!")
    print("=" * 60)

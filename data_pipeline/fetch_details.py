"""
STEP 2: For each slug in slugs.json, fetch real details and save to schemes_real.json
Run AFTER fetch_slugs.py completes.

Architecture Note:
  schemes_real.json = read-only source of truth for Scheme data
  Spring Boot loads this into memory — no cloud reads needed (zero quota)
  User Applications go to Supabase + Firebase (not schemes!)
"""
import requests
import json
import time
import sys
import ssl
import urllib3
import requests.adapters
import concurrent.futures

sys.stdout.reconfigure(encoding='utf-8')
urllib3.disable_warnings()

SLUGS_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\data_pipeline\slugs.json"
OUTPUT_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"

API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"
HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9",
    "origin": "https://www.myscheme.gov.in",
    "referer": "https://www.myscheme.gov.in/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "x-api-key": API_KEY,
    "x-client": "myscheme-ui",
}

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

def get_json(url):
    try:
        r = session.get(url, headers=HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            return r.json()
    except:
        pass
    return None

def parse_docs_md(docs_md):
    doc_names = []
    for line in docs_md.strip().split("\n"):
        line = line.strip()
        for prefix in ("1. ", "- ", "* "):
            if line.startswith(prefix):
                line = line[len(prefix):].strip()
                break
        if line and len(line) > 3:
            doc_names.append(line)
    return doc_names

def process_one(info):
    slug = info["slug"]
    scheme_obj = {
        "id": slug,
        "title": info["schemeName"],
        "description": info["briefDescription"],
        "ministry": info.get("ministry", ""),
        "category": info.get("category", "General"),
        "state": info.get("state", "All States"),
        "amount": 0.0,
        "eligibilityCriteria": "",
        "benefits": "",
        "applicationProcess": "",
        "documentsRequired": [],
        "applicationDeadline": info.get("schemeCloseDate") or None,
        "startDate": info.get("schemeOpenDate") or None,
        "isActive": True,
        "isExpired": False,
    }

    # Fetch detail
    detail = get_json(f"https://api.myscheme.gov.in/schemes/v6/public/schemes?slug={slug}&lang=en")
    scheme_id = None

    if detail:
        try:
            data = detail.get("data", {})
            scheme_id = data.get("_id")
            en = data.get("en", {})

            bd = en.get("basicDetails", {})
            m = bd.get("nodalMinistryName", {})
            if isinstance(m, dict):
                scheme_obj["ministry"] = m.get("label", scheme_obj["ministry"])

            if not scheme_obj["applicationDeadline"]:
                scheme_obj["applicationDeadline"] = bd.get("schemeCloseDate") or None
            if not scheme_obj["startDate"]:
                scheme_obj["startDate"] = bd.get("schemeOpenDate") or None

            elig = en.get("eligibilityCriteria", {})
            md = elig.get("eligibilityDescription_md", "")
            if md:
                scheme_obj["eligibilityCriteria"] = md.strip()

            sc = en.get("schemeContent", {})
            md2 = sc.get("benefits_md", "")
            if md2:
                scheme_obj["benefits"] = md2.strip()

            md_desc = sc.get("detailedDescription_md", "")
            if md_desc and len(md_desc) > len(scheme_obj["description"]):
                scheme_obj["description"] = md_desc.strip()

            procs = en.get("applicationProcess", [])
            if procs and isinstance(procs, list):
                for proc in procs:
                    md3 = proc.get("process_md", "")
                    if md3:
                        scheme_obj["applicationProcess"] = md3.strip()
                        break
        except:
            pass

    if scheme_id:
        docs = get_json(f"https://api.myscheme.gov.in/schemes/v6/public/schemes/{scheme_id}/documents?lang=en")
        if docs:
            try:
                doc_en = docs.get("data", {}).get("en", {})
                docs_md = doc_en.get("documentsRequired_md", "")
                if docs_md:
                    scheme_obj["documentsRequired"] = parse_docs_md(docs_md)
            except:
                pass

    return scheme_obj


def main():
    with open(SLUGS_FILE, "r", encoding="utf-8") as f:
        all_slugs = json.load(f)

    print(f"Loaded {len(all_slugs)} slugs from slugs.json")
    print(f"Fetching details with 10 parallel workers...\n")

    results = []
    WORKERS = 10

    with concurrent.futures.ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(process_one, info): info for info in all_slugs}

        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f"  Error: {e}")

            if (i + 1) % 100 == 0:
                pct = (i + 1) / len(all_slugs) * 100
                real = sum(1 for r in results if r.get("eligibilityCriteria"))
                print(f"  [{i+1}/{len(all_slugs)}] {pct:.0f}% done | real eligibility: {real}")

                # Checkpoint save
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(results, f, indent=2, ensure_ascii=False)

    # Final save
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    real_elig = sum(1 for r in results if r["eligibilityCriteria"])
    real_docs = sum(1 for r in results if r["documentsRequired"])
    real_ben = sum(1 for r in results if r["benefits"])

    print(f"\n{'='*60}")
    print(f"DONE! Saved {len(results)} schemes to schemes_real.json")
    print(f"  Real eligibility: {real_elig}/{len(results)}")
    print(f"  Real documents:   {real_docs}/{len(results)}")
    print(f"  Real benefits:    {real_ben}/{len(results)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()

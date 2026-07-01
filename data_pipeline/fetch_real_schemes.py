"""
Real Government Scheme Data Fetcher - FULL VERSION
Fetches ALL schemes from myscheme.gov.in API with pagination.
Uses the same API key and headers intercepted from the browser.
Zero AI-generated data. Everything from official government API.
"""
from playwright.sync_api import sync_playwright
import requests
import json
import time
import sys
import ssl
import urllib3
import requests.adapters

sys.stdout.reconfigure(encoding='utf-8')
urllib3.disable_warnings()

OUTPUT_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"

# API key intercepted from browser — same as what Playwright captures
API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"

HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9",
    "origin": "https://www.myscheme.gov.in",
    "referer": "https://www.myscheme.gov.in/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

def fetch_all_slugs():
    """Paginate through search API to collect all scheme slugs."""
    all_slugs = []
    seen = set()
    offset = 0
    size = 50
    total = 99999  # Will be updated from first response

    print("Fetching all scheme slugs from search API...")
    while offset < total:
        url = f"https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%5D&keyword=&sort=&from={offset}&size={size}"
        try:
            r = session.get(url, headers=HEADERS, timeout=15, verify=False)
            if r.status_code != 200:
                print(f"  Search API returned {r.status_code} at offset={offset}. Stopping.")
                break

            data = r.json()
            hits = data.get("data", {}).get("hits", {})
            items = hits.get("items", [])
            total = hits.get("page", {}).get("total", 0)

            if not items:
                break

            for item in items:
                fields = item.get("fields", {})
                slug = fields.get("slug", "")
                if slug and slug not in seen:
                    seen.add(slug)
                    all_slugs.append({
                        "slug": slug,
                        "schemeName": fields.get("schemeName", "Unknown"),
                        "briefDescription": fields.get("briefDescription", ""),
                        "nodalMinistryName": fields.get("nodalMinistryName", ""),
                        "schemeCategory": fields.get("schemeCategory", ["General"]),
                        "beneficiaryState": fields.get("beneficiaryState", []),
                        "schemeCloseDate": fields.get("schemeCloseDate", ""),
                        "schemeOpenDate": fields.get("schemeOpenDate", ""),
                    })

            print(f"  Offset {offset}: got {len(items)} items | total so far: {len(all_slugs)}/{total}")
            offset += size
            time.sleep(0.2)

        except Exception as e:
            print(f"  Error at offset {offset}: {e}")
            break

    print(f"Total unique slugs collected: {len(all_slugs)}")
    return all_slugs


def fetch_scheme_detail(slug):
    """Fetch eligibility, benefits, process for a single scheme slug."""
    url = f"https://api.myscheme.gov.in/schemes/v6/public/schemes?slug={slug}&lang=en"
    try:
        r = session.get(url, headers=HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        pass
    return None


def fetch_scheme_documents(scheme_id):
    """Fetch documents for a scheme using its _id."""
    url = f"https://api.myscheme.gov.in/schemes/v6/public/schemes/{scheme_id}/documents?lang=en"
    try:
        r = session.get(url, headers=HEADERS, timeout=12, verify=False)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None


def parse_documents_md(docs_md):
    """Parse markdown numbered list into a clean list of strings."""
    doc_names = []
    for line in docs_md.strip().split("\n"):
        line = line.strip()
        # Remove "1. " or "- " or "* " prefixes
        for prefix in ("1. ", "- ", "* "):
            if line.startswith(prefix):
                line = line[len(prefix):].strip()
                break
        if line and len(line) > 3:
            doc_names.append(line)
    return doc_names


def main():
    # Step 1: Collect slugs via API pagination
    all_slugs = fetch_all_slugs()

    if not all_slugs:
        print("ERROR: Could not fetch any slugs. Try running from browser first.")
        return

    print(f"\n{'='*60}")
    print(f"Fetching details for {len(all_slugs)} schemes...")
    print(f"{'='*60}\n")

    results = []
    stats = {"elig": 0, "benefits": 0, "process": 0, "docs": 0}

    for i, info in enumerate(all_slugs):
        slug = info["slug"]
        sys.stdout.write(f"[{i+1}/{len(all_slugs)}] {info['schemeName'][:50]}... ")
        sys.stdout.flush()

        # Build base object from search fields
        scheme_obj = {
            "id": slug,
            "title": info["schemeName"],
            "description": info["briefDescription"],
            "ministry": "",
            "category": "General",
            "state": "All States",
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

        # Extract ministry name
        ministry_raw = info.get("nodalMinistryName", "")
        if isinstance(ministry_raw, dict):
            scheme_obj["ministry"] = ministry_raw.get("label", "")
        elif isinstance(ministry_raw, str):
            scheme_obj["ministry"] = ministry_raw

        # Extract category
        cats = info.get("schemeCategory", [])
        if cats:
            c = cats[0]
            scheme_obj["category"] = c.get("label", str(c)) if isinstance(c, dict) else str(c)

        # Extract state
        states = info.get("beneficiaryState", [])
        if states:
            s = states[0]
            scheme_obj["state"] = s.get("label", str(s)) if isinstance(s, dict) else str(s)

        # Fetch detail
        got = []
        detail_resp = fetch_scheme_detail(slug)
        scheme_id = None

        if detail_resp:
            try:
                data = detail_resp.get("data", {})
                scheme_id = data.get("_id")
                en = data.get("en", {})

                bd = en.get("basicDetails", {})
                # Overwrite ministry from detailed data (more accurate)
                m = bd.get("nodalMinistryName", {})
                if isinstance(m, dict):
                    scheme_obj["ministry"] = m.get("label", scheme_obj["ministry"])

                # Dates from detail
                if not scheme_obj["applicationDeadline"]:
                    scheme_obj["applicationDeadline"] = bd.get("schemeCloseDate") or None
                if not scheme_obj["startDate"]:
                    scheme_obj["startDate"] = bd.get("schemeOpenDate") or None

                # Eligibility
                elig = en.get("eligibilityCriteria", {})
                md = elig.get("eligibilityDescription_md", "")
                if md:
                    scheme_obj["eligibilityCriteria"] = md.strip()
                    stats["elig"] += 1
                    got.append("elig")

                # Benefits
                sc = en.get("schemeContent", {})
                md2 = sc.get("benefits_md", "")
                if md2:
                    scheme_obj["benefits"] = md2.strip()
                    stats["benefits"] += 1
                    got.append("benefits")

                # Detailed description (override brief if longer)
                md_desc = sc.get("detailedDescription_md", "")
                if md_desc and len(md_desc) > len(scheme_obj["description"]):
                    scheme_obj["description"] = md_desc.strip()

                # Application Process
                procs = en.get("applicationProcess", [])
                if procs and isinstance(procs, list):
                    for proc in procs:
                        md3 = proc.get("process_md", "")
                        if md3:
                            scheme_obj["applicationProcess"] = md3.strip()
                            stats["process"] += 1
                            got.append("process")
                            break

            except Exception as e:
                pass

        # Fetch documents (separate endpoint using scheme _id)
        if scheme_id:
            docs_resp = fetch_scheme_documents(scheme_id)
            if docs_resp:
                try:
                    doc_en = docs_resp.get("data", {}).get("en", {})
                    docs_md = doc_en.get("documentsRequired_md", "")
                    if docs_md:
                        doc_list = parse_documents_md(docs_md)
                        if doc_list:
                            scheme_obj["documentsRequired"] = doc_list
                            stats["docs"] += 1
                            got.append(f"{len(doc_list)}docs")
                except:
                    pass

        if got:
            print(f"OK ({', '.join(got)})")
        else:
            print("(basic only)")

        results.append(scheme_obj)

        # Save checkpoint every 100 schemes
        if (i + 1) % 100 == 0:
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"  [CHECKPOINT] Saved {len(results)} schemes so far.")

        time.sleep(0.15)  # Be polite to the server

    # Final save
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"COMPLETE! Saved {len(results)} schemes to schemes_real.json")
    print(f"  Eligibility:          {stats['elig']}/{len(results)}")
    print(f"  Benefits:             {stats['benefits']}/{len(results)}")
    print(f"  Application Process:  {stats['process']}/{len(results)}")
    print(f"  Documents:            {stats['docs']}/{len(results)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()

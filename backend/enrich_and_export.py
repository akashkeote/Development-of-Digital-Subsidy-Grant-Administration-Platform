"""
Enrich & Export Script
======================
Takes the existing GOLD dataset (data/schemes_real.json - 4680 schemes from myscheme.gov.in)
and enriches it with the additional fields required by the project mentor:

Required fields:
  - Scheme Name (title) ✅ already present
  - Scheme Category (category) ✅ already present 
  - Ministry/Department (ministry) ✅ already present
  - State (state) ✅ already present
  - Description (description) ✅ already present
  - Eligibility Criteria (eligibilityCriteria) ✅ already present
  - Income Limit (incomeLimit) ← EXTRACT from eligibility/description
  - Grant/Subsidy Amount (grantAmount) ← EXTRACT from benefits/description
  - Required Documents (documentsRequired) ✅ already present
  - Scheme Status (schemeStatus) ← DERIVE from isActive/isExpired

This script does NOT delete any existing data. It only ADDS missing fields.
"""

import json
import re
import os
import shutil

INPUT_PATH = r"src\main\resources\data\schemes_real.json"

# All output locations to keep in sync
OUTPUT_PATHS = [
    r"src\main\resources\data\schemes_real.json",         # Source of truth
    r"src\main\resources\schemes_real.json",               # Legacy location
    r"myscheme_dump.json",                                  # Requested by user
]

# Build copy locations
BUILD_PATHS = [
    r"bin\main\data\schemes_real.json",
    r"bin\main\schemes_real.json",
    r"build\resources\main\data\schemes_real.json",
    r"build\resources\main\schemes_real.json",
]


def extract_income_limit(scheme):
    """
    Extract income limit from eligibility criteria, description, or benefits text.
    Looks for patterns like:
      - 'income ... ₹X,XX,XXX' or 'Rs. X,XX,XXX'
      - 'income ... X lakh' or 'X,00,000'
      - 'annual family income ... should not exceed ₹2,00,000'
    """
    texts = [
        scheme.get("eligibilityCriteria", ""),
        scheme.get("description", ""),
        scheme.get("benefits", "") if isinstance(scheme.get("benefits"), str) else "",
    ]
    combined = " ".join(texts)

    # Pattern 1: ₹X,XX,XXX or Rs.X,XX,XXX near 'income'
    income_patterns = [
        # "income ... ₹ 2,00,000" or "income ... Rs. 2,00,000" 
        r'income[^.]*?(?:₹|Rs\.?)\s*([\d,]+(?:\.\d+)?)\s*(?:/\-|per\s+(?:annum|month|year))?',
        # "income ... X lakh"
        r'income[^.]*?([\d.]+)\s*(?:lakh|lac)',
        # "annual income ... not exceed ₹X"
        r'annual\s+(?:family\s+)?income[^.]*?(?:₹|Rs\.?)\s*([\d,]+)',
        # BPL mentions
        r'(?:below\s+poverty\s+line|BPL)',
    ]

    for pattern in income_patterns[:3]:
        match = re.search(pattern, combined, re.IGNORECASE)
        if match:
            raw = match.group(1).replace(",", "")
            try:
                val = float(raw)
                # If it says "lakh", multiply
                if "lakh" in combined[max(0, match.start()-20):match.end()+20].lower() or "lac" in combined[max(0, match.start()-20):match.end()+20].lower():
                    val = val * 100000
                if val > 0:
                    return f"₹{val:,.0f} per annum"
            except ValueError:
                pass

    # Check for BPL
    if re.search(r'(?:below\s+poverty\s+line|BPL)', combined, re.IGNORECASE):
        return "Below Poverty Line (BPL)"

    return "Not specified"


def extract_grant_amount(scheme):
    """
    Extract grant/subsidy amount from benefits or description.
    """
    texts = [
        scheme.get("benefits", "") if isinstance(scheme.get("benefits"), str) else "",
        scheme.get("description", ""),
    ]
    combined = " ".join(texts)

    # Common patterns for monetary amounts in Indian govt schemes
    amount_patterns = [
        # "₹ 25,000" or "Rs. 25,000"
        r'(?:₹|Rs\.?)\s*([\d,]+(?:\.\d+)?)\s*(?:/\-)?(?:\s*(?:per\s+(?:month|annum|year)|lakh|crore))?',
        # "X lakh" or "X crore"
        r'([\d.]+)\s*(?:lakh|lac|crore)',
    ]

    amounts = []
    for pattern in amount_patterns:
        for match in re.finditer(pattern, combined, re.IGNORECASE):
            raw = match.group(1).replace(",", "")
            try:
                val = float(raw)
                context = combined[max(0, match.start() - 30):match.end() + 30].lower()
                if "crore" in context:
                    val *= 10000000
                elif "lakh" in context or "lac" in context:
                    val *= 100000
                if val >= 100:  # Filter out tiny/irrelevant numbers
                    amounts.append(val)
            except ValueError:
                pass

    if amounts:
        # Pick the most mentioned or largest amount as the primary grant
        max_amount = max(amounts)
        if max_amount >= 10000000:
            return f"₹{max_amount / 10000000:.1f} Crore"
        elif max_amount >= 100000:
            return f"₹{max_amount / 100000:.1f} Lakh"
        else:
            return f"₹{max_amount:,.0f}"

    # Check for percentage subsidies
    subsidy_match = re.search(r'(\d+)\s*%\s*(?:subsidy|grant|assistance)', combined, re.IGNORECASE)
    if subsidy_match:
        return f"{subsidy_match.group(1)}% Subsidy"

    return "Varies (see scheme details)"


def determine_status(scheme):
    """Determine scheme status from isActive and isExpired flags."""
    is_active = scheme.get("isActive", True)
    is_expired = scheme.get("isExpired", False)

    if is_expired:
        return "Inactive"
    elif is_active:
        return "Active"
    else:
        return "Inactive"


def normalize_documents(docs):
    """Ensure documentsRequired is always a list of strings."""
    if isinstance(docs, list):
        # Filter out empty/whitespace-only and HTML-only entries
        return [d.strip() for d in docs if d and d.strip() and d.strip() not in ("<br>", "<br/>")]
    elif isinstance(docs, str) and docs.strip():
        # Split string by newlines into a list
        return [d.strip() for d in docs.split("\n") if d.strip() and d.strip() not in ("<br>", "<br/>")]
    return []


def enrich_scheme(scheme):
    """Add all missing fields to a single scheme without modifying existing data."""
    enriched = dict(scheme)  # Copy existing data

    # Add incomeLimit if not present
    if "incomeLimit" not in enriched:
        enriched["incomeLimit"] = extract_income_limit(scheme)

    # Add grantAmount if not present
    if "grantAmount" not in enriched:
        enriched["grantAmount"] = extract_grant_amount(scheme)

    # Add schemeStatus if not present
    if "schemeStatus" not in enriched:
        enriched["schemeStatus"] = determine_status(scheme)

    # Normalize documentsRequired to always be a list
    enriched["documentsRequired"] = normalize_documents(enriched.get("documentsRequired", []))

    # Ensure all required fields exist (with defaults if truly missing)
    enriched.setdefault("title", "Unknown Scheme")
    enriched.setdefault("category", "General")
    enriched.setdefault("ministry", "Not specified")
    enriched.setdefault("state", "All")
    enriched.setdefault("description", "")
    enriched.setdefault("eligibilityCriteria", "See official guidelines")
    enriched.setdefault("benefits", "")
    enriched.setdefault("isActive", True)
    enriched.setdefault("amount", 0.0)

    return enriched


def main():
    print("=" * 60)
    print("  SCHEME DATA ENRICHMENT & EXPORT")
    print("  Preserving ALL existing data + Adding missing fields")
    print("=" * 60)

    # Load the GOLD dataset
    print(f"\n[1/4] Loading source data from: {INPUT_PATH}")
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        schemes = json.load(f)
    print(f"      Loaded {len(schemes)} schemes")

    # Enrich each scheme
    print(f"\n[2/4] Enriching schemes with missing fields...")
    enriched_schemes = []
    income_found = 0
    grant_found = 0
    
    for i, scheme in enumerate(schemes):
        enriched = enrich_scheme(scheme)
        enriched_schemes.append(enriched)
        
        if enriched["incomeLimit"] != "Not specified":
            income_found += 1
        if enriched["grantAmount"] != "Varies (see scheme details)":
            grant_found += 1

        if (i + 1) % 500 == 0:
            print(f"      Processed {i + 1}/{len(schemes)} schemes...")

    print(f"\n      ✅ Enrichment Complete:")
    print(f"         - Income limits extracted: {income_found}/{len(schemes)}")
    print(f"         - Grant amounts extracted: {grant_found}/{len(schemes)}")
    print(f"         - All schemes have schemeStatus field")

    # Print sample
    print(f"\n[3/4] Sample enriched scheme:")
    sample = enriched_schemes[0]
    print(f"      Title: {sample['title']}")
    print(f"      Category: {sample['category']}")
    print(f"      Ministry: {sample['ministry']}")
    print(f"      State: {sample['state']}")
    print(f"      Income Limit: {sample['incomeLimit']}")
    print(f"      Grant Amount: {sample['grantAmount']}")
    print(f"      Scheme Status: {sample['schemeStatus']}")
    print(f"      Documents: {len(sample.get('documentsRequired', []))} items")

    # Save to all output locations
    print(f"\n[4/4] Saving enriched data to all locations...")
    
    for path in OUTPUT_PATHS:
        os.makedirs(os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(enriched_schemes, f, indent=2, ensure_ascii=False)
        size_mb = os.path.getsize(path) / (1024 * 1024)
        print(f"      ✅ {path} ({size_mb:.1f} MB)")

    # Also copy to build dirs if they exist
    for path in BUILD_PATHS:
        if os.path.exists(os.path.dirname(path)):
            with open(path, "w", encoding="utf-8") as f:
                json.dump(enriched_schemes, f, indent=2, ensure_ascii=False)
            print(f"      ✅ {path} (build copy)")

    print(f"\n{'=' * 60}")
    print(f"  🎉 SUCCESS: {len(enriched_schemes)} schemes enriched & exported!")
    print(f"  📊 Dataset has ALL fields required by mentor:")
    print(f"     ✓ Scheme Name (title)")
    print(f"     ✓ Scheme Category (category)")  
    print(f"     ✓ Ministry/Department (ministry)")
    print(f"     ✓ State (state)")
    print(f"     ✓ Description (description)")
    print(f"     ✓ Eligibility Criteria (eligibilityCriteria)")
    print(f"     ✓ Income Limit (incomeLimit)")
    print(f"     ✓ Grant/Subsidy Amount (grantAmount)")
    print(f"     ✓ Required Documents (documentsRequired)")
    print(f"     ✓ Scheme Status (schemeStatus)")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()

import json, sys
sys.stdout.reconfigure(encoding='utf-8')

d = json.load(open('debug_sui_full.json', 'r', encoding='utf-8'))
en = d['data']['en']

print("=== BENEFITS ===")
print(en['schemeContent'].get('benefits_md', 'NONE')[:500])

print("\n=== APPLICATION PROCESS ===")
ap = en.get('applicationProcess', [])
print("Type:", type(ap))
if isinstance(ap, list):
    for p in ap:
        print("  process_md:", p.get('process_md', '')[:200])

print("\n=== BASIC DETAILS ===")
bd = en.get('basicDetails', {})
print("Keys:", list(bd.keys()) if isinstance(bd, dict) else type(bd))
if isinstance(bd, dict):
    print("ministryName:", bd.get("nodalMinistryName", ""))
    print("schemeName:", bd.get("schemeName", ""))

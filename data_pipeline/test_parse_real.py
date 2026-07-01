import json

with open("test_next_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("KEYS in data:", data.keys())
print("KEYS in props:", data.get("props", {}).keys())

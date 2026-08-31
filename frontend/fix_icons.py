import re

with open(r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\src\pages\LandingPage.tsx", "r", encoding="utf-8") as f:
    code = f.read()

lucide_import = re.search(r"import \{.*?\} from 'lucide-react';", code)
if lucide_import:
    import_str = lucide_import.group(0)
    new_imports = import_str
    for icon in ["Zap", "Target", "BarChart", "FileText"]:
        if icon not in new_imports:
            new_imports = new_imports.replace("{ ", "{ " + icon + ", ")
    code = code.replace(import_str, new_imports)

with open(r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\src\pages\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(code)
print("Icons added.")

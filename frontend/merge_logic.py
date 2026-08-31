import re
import os

landing_path = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\src\pages\LandingPage.tsx"
v2_path = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\src\pages\LandingV2.tsx"

with open(landing_path, "r", encoding="utf-8") as f:
    landing_code = f.read()

with open(v2_path, "r", encoding="utf-8") as f:
    v2_code = f.read()

# 1. Extract the Nav from LandingPage
# It starts at {/* 3D Glass Navbar (Floating Pill) */}
nav_start = landing_code.find("{/* 3D Glass Navbar (Floating Pill) */}")
nav_end = landing_code.find("{/* Hero Section */}")
nav_code = landing_code[nav_start:nav_end]

# 2. Extract the Rest of the Page from LandingPage
# We already appended "Visionary Leaders Graphic Section" to V2 earlier, but the user wants the FULL dashboard.
# So we need to grab everything from "Visionary Leaders" to the end of LandingPage,
# EXCEPT the footer, which is already in V2 (or we can just grab everything including footer).
rest_start = landing_code.find("{/* Visionary Leaders Graphic Section */}")
rest_end = landing_code.rfind("</div>\n    </>")
if rest_end == -1:
    rest_end = landing_code.rfind("</div>\n    </div>")
rest_code = landing_code[rest_start:rest_end]

# 3. Take V2, replace its Nav with `nav_code`
v2_nav_start = v2_code.find("{/* Navbar */}")
v2_nav_end = v2_code.find("{/* Sticky Canvas Container */}")
v2_code = v2_code[:v2_nav_start] + nav_code + v2_code[v2_nav_end:]

# 4. Take V2, remove the old "Visionary Leaders" section we appended earlier (if it's there)
v2_visionary_start = v2_code.find("{/* Spacer to push content below the 500vh scroll block */}")
if v2_visionary_start != -1:
    v2_code = v2_code[:v2_visionary_start]
else:
    # try to find just the section
    v2_vis = v2_code.find("{/* Visionary Leaders Graphic Section */}")
    if v2_vis != -1:
        v2_code = v2_code[:v2_vis]

# Now append `rest_code` at the end, just before the closing </div>
# In V2, the last things are usually:
#       </div>
#     </div>
#   );

v2_end_index = v2_code.rfind("</div>\n    </div>\n  );")
if v2_end_index == -1:
    v2_end_index = v2_code.rfind("</div>\n  );") # backup

final_code = v2_code[:v2_end_index] + "\n\n      {/* --- REST OF DASHBOARD --- */}\n      <div className=\"relative z-20 w-full bg-slate-50\">\n" + rest_code + "\n      </div>\n" + v2_code[v2_end_index:]

# 5. Fix fonts in V2 text overlays
final_code = final_code.replace("font-extrabold text-white tracking-tight", "font-heading font-extrabold text-white tracking-tight")
final_code = final_code.replace("font-bold tracking-tight", "font-heading font-extrabold tracking-tight")

# Also, we need to make sure the imports in LandingPage are included in LandingV2
# Let's just grab all imports from LandingPage and prepend them
imports_end = landing_code.find("const chiefMinisters =")
imports_code = landing_code[:imports_end]

# Combine imports (we can just replace V2 imports with LandingPage imports + framer motion + canvas stuff)
# It's safer to just inject the V2 hooks and state into LandingPage!

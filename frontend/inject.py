with open(r"src\pages\LandingPage.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add import
if "ScrollytellingSection" not in code:
    code = code.replace("import { Footer } from '../components/Footer';", "import { Footer } from '../components/Footer';\nimport { ScrollytellingSection } from '../components/ScrollytellingSection';")

# 2. Find Visionary section end
vis_start = code.find("{/* Visionary Leaders Graphic Section */}")
vis_end = code.find("</section>", vis_start) + len("</section>")

# 3. Insert after Visionary section
code = code[:vis_end] + "\n\n      {/* Inserted Scrollytelling Canvas */}\n      <ScrollytellingSection />\n\n" + code[vis_end:]

with open(r"src\pages\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Injected component successfully!")

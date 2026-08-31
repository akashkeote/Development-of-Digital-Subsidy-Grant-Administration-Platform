import os

with open(r"src\components\ScrollytellingSection.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Replace font-sans and tracking-tighter with font-heading and tracking-tight to match the original brand
code = code.replace("font-sans font-bold text-white/90 tracking-tighter", "font-heading font-extrabold text-white/90 tracking-tight")
code = code.replace("font-sans font-bold tracking-tighter text-white/90", "font-heading font-extrabold tracking-tight text-white/90")
code = code.replace("font-sans tracking-tight", "font-heading")

# Also the button had font-sans tracking-tight, let's make sure it's updated
code = code.replace("font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,214,255,0.3)] font-sans tracking-tight", "font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,214,255,0.3)] font-heading")

# Just a general catch-all for font-sans on headings in case I missed any
code = code.replace("font-sans", "font-heading")

with open(r"src\components\ScrollytellingSection.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Font updated to font-heading (Space Grotesk)!")

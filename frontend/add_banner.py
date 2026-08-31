import os

filepath = r"src\pages\SchemeListingPage.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# Add import if missing
if "import { PhoneFarmerAnimation }" not in code:
    code = code.replace(
        "import { SchemeModal } from '../components/SchemeModal';",
        "import { SchemeModal } from '../components/SchemeModal';\nimport { PhoneFarmerAnimation } from '../components/PhoneFarmerAnimation';"
    )

# Create the banner
banner_jsx = """
          {/* Hero Banner with Phone Farmer */}
          <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between mb-8 relative">
            <div className="p-8 md:p-12 z-10 w-full md:w-3/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
                <Compass className="w-3 h-3" /> Digital First
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
                Empowering your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">growth.</span>
              </h1>
              <p className="text-blue-100/80 text-sm md:text-base font-medium max-w-md">
                Browse through hundreds of government schemes, subsidies, and grants directly from your smartphone.
              </p>
            </div>
            
            <div className="w-full md:w-2/5 h-[300px] relative bg-slate-900/20">
              {/* Subtle overlay gradient to blend the animation into the card */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-transparent w-24 z-10 hidden md:block"></div>
              <PhoneFarmerAnimation />
            </div>
          </div>
"""

# Insert banner at the top of the container
if "id=\"scheme_listing_page_root\">" in code:
    code = code.replace(
        """id="scheme_listing_page_root">""",
        """id="scheme_listing_page_root">\n""" + banner_jsx
    )

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("Banner added to SchemeListingPage!")

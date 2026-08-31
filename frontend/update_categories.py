import os

filepath = r"src\pages\LandingPage.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# Add import
if "import { PhoneFarmerAnimation }" not in code:
    code = code.replace(
        "import { ScrollytellingSection } from '../components/ScrollytellingSection';",
        "import { ScrollytellingSection } from '../components/ScrollytellingSection';\nimport { PhoneFarmerAnimation } from '../components/PhoneFarmerAnimation';"
    )

# Replace the categories grid layout
old_grid = """<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 perspective-container">"""
new_layout = """<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
              
              {/* Left Side: 3D Phone Farmer Animation */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-2/5 aspect-square lg:aspect-auto min-h-[400px]"
              >
                <PhoneFarmerAnimation />
              </motion.div>

              {/* Right Side: Categories Grid */}
              <div className="w-full lg:w-3/5 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 perspective-container">"""

if old_grid in code:
    code = code.replace(old_grid, new_layout)
    # We also need to add one closing div after the categories map loop
    # Let's find the end of the map loop
    
    # Original ends with:
    #                 <span className="font-bold text-slate-700 text-sm md:text-base text-center group-hover:text-blue-700 transition-colors">{cat.label}</span>
    #               </motion.div>
    #             ))}
    #           </div>
    #         </div>
    
    find_str = """                <span className="font-bold text-slate-700 text-sm md:text-base text-center group-hover:text-blue-700 transition-colors">{cat.label}</span>
                </motion.div>
              ))}
            </div>"""
            
    replace_str = """                <span className="font-bold text-slate-700 text-sm md:text-base text-center group-hover:text-blue-700 transition-colors">{cat.label}</span>
                </motion.div>
              ))}
              </div>
            </div>"""
    
    code = code.replace(find_str, replace_str)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("Landing page layout updated for Phone Farmer!")

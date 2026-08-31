import os
import re

# Read original UI
with open("original_landing.txt", "r", encoding="utf-8") as f:
    orig_code = f.read()

# Read current UI (which has the working canvas logic)
with open(r"src\pages\LandingPage.tsx", "r", encoding="utf-8") as f:
    current_code = f.read()

# 1. Get the Canvas JSX
# The canvas section starts with {/* Scrollytelling Hero Section
# and ends with {/* --- REST OF DASHBOARD --- */} or similar. Wait, let's find the exact bounds.
canvas_start = current_code.find("{/* Scrollytelling Hero Section")
canvas_end = current_code.find("</section>", canvas_start) + len("</section>")
canvas_jsx = current_code[canvas_start:canvas_end]

# 2. Get the Hooks
hooks_start = current_code.find("// Scrollytelling Canvas State")
hooks_end = current_code.find("return (") - 2 # just before return
hooks_code = current_code[hooks_start:hooks_end]

# 3. Modify original code
# Add hooks
orig_code = orig_code.replace("export function LandingPage() {\n", "export function LandingPage() {\n" + hooks_code + "\n")
orig_code = orig_code.replace("export const LandingPage: React.FC = () => {\n", "export const LandingPage: React.FC = () => {\n" + hooks_code + "\n")

# Find the end of the Visionary Leaders section
# It starts with {/* Visionary Leaders Graphic Section */}
vis_start = orig_code.find("{/* Visionary Leaders Graphic Section */}")
vis_end = orig_code.find("</section>", vis_start) + len("</section>")

# Insert canvas JSX after Visionary Leaders
new_code = orig_code[:vis_end] + "\n\n" + canvas_jsx + "\n\n" + orig_code[vis_end:]

# 4. Fix imports
if "AnimatePresence" not in new_code:
    new_code = new_code.replace("import { motion } from 'motion/react';", "import { motion, AnimatePresence } from 'framer-motion';")
    new_code = new_code.replace("import { motion } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';")

# Add lucide icons if missing
import_lucide = re.search(r"import \{.*?\} from 'lucide-react';", new_code)
if import_lucide:
    imports = import_lucide.group(0)
    for icon in ["Zap", "Target", "BarChart", "FileText"]:
        if icon not in imports:
            imports = imports.replace("{ ", "{ " + icon + ", ")
    new_code = new_code.replace(import_lucide.group(0), imports)
    
# Add useEffect and useRef to React import
if "useRef" not in new_code.split("\n")[0]:
    new_code = new_code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect, useRef } from 'react';")

with open(r"src\pages\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(new_code)

print("Restored original Hero and inserted Scrollytelling Canvas after Visionary section!")

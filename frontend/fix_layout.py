import os

filepath = r"src\pages\Registration.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Replace the root div's overflow-hidden with overflow-x-hidden
code = code.replace(
    """<div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-hidden relative">""",
    """<div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-x-hidden relative">"""
)

# 2. Find the left panel div
old_left_panel_start = """<div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden flex flex-col justify-center px-8 lg:px-14 py-16 bg-blue-700 md:min-h-full">"""

new_left_panel_start = """<div className="w-full md:w-[45%] lg:w-[40%] relative bg-blue-700 md:min-h-full">
          <div className="md:sticky md:top-10 w-full flex flex-col justify-center h-auto md:h-[calc(100vh-40px)] relative overflow-hidden px-8 lg:px-14 py-16">"""

if old_left_panel_start in code:
    code = code.replace(old_left_panel_start, new_left_panel_start)
    
    # Insert closing div before right side comment
    right_side_comment = """{/* Right side - Registration Flow */}"""
    code = code.replace(
        right_side_comment,
        """  </div>\n\n        """ + right_side_comment
    )

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("Layout updated!")

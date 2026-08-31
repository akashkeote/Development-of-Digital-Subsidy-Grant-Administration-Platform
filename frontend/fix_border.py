import re

with open('src/pages/LandingV2.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace object-contain and scale with object-cover and no scale
old_canvas = '<canvas \n          ref={canvasRef} \n          className="w-full h-full object-contain scale-[0.85] md:scale-100 transform-gpu origin-center mix-blend-screen"\n        />'
new_canvas = '<canvas \n          ref={canvasRef} \n          className="w-full h-full object-cover transform-gpu origin-center mix-blend-screen"\n        />'

content = content.replace(old_canvas, new_canvas)

# Let's also remove the mix-blend-screen because it might wash out colors slightly.
# We'll just make it normal cover.
old_canvas_2 = '<canvas \n          ref={canvasRef} \n          className="w-full h-full object-cover transform-gpu origin-center mix-blend-screen"\n        />'
new_canvas_2 = '<canvas \n          ref={canvasRef} \n          className="w-full h-full object-cover transform-gpu origin-center"\n        />'

content = content.replace(old_canvas_2, new_canvas_2)

with open('src/pages/LandingV2.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

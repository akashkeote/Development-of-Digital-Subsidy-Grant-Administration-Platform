import re

with open('src/pages/LandingV2.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix draw logic for BOTH initial and scroll
old_draw_logic = """      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }"""

new_draw_logic = """      // Use CONTAIN logic to show the entire 3D model without cropping
      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);"""

content = content.replace(old_draw_logic, new_draw_logic)

# Fix opacities and gradient
content = content.replace('className="w-full h-full object-cover opacity-60"', 'className="w-full h-full object-cover"')
content = content.replace('className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none"', 'className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none"')

with open('src/pages/LandingV2.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

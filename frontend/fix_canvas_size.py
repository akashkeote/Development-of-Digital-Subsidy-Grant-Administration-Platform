import re

with open('src/pages/LandingV2.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify drawInitial
old_draw_initial = """    const drawInitial = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Use CONTAIN logic to show the entire 3D model without cropping
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
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };"""

new_draw_initial = """    const drawInitial = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Set canvas to native image resolution and let CSS handle scaling
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };"""
content = content.replace(old_draw_initial, new_draw_initial)

# 2. Simplify handleScroll draw logic
old_scroll_draw = """      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Use CONTAIN logic to show the entire 3D model without cropping
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
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);"""

new_scroll_draw = """      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);"""
content = content.replace(old_scroll_draw, new_scroll_draw)

# 3. Update canvas CSS class to object-contain with max sizes
old_canvas_css = '<canvas ref={canvasRef} className="w-full h-full object-cover" />'
new_canvas_css = '<canvas ref={canvasRef} className="w-full h-screen object-contain scale-[0.85] transform-gpu origin-center" />'
content = content.replace(old_canvas_css, new_canvas_css)

# 4. Update gradient overlay to ensure text is readable but image isn't too dark
old_gradient = '<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />'
new_gradient = '<div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]" />'
content = content.replace(old_gradient, new_gradient)

# Optional: Add text-shadow to make text pop more
content = content.replace('className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-2xl"', 'className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"')

with open('src/pages/LandingV2.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

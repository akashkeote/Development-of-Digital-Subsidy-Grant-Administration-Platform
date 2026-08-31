import os
import glob
from PIL import Image

src_dir = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\public\temp_farmer_phone"
dest_dir = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\public\anim-phone"

os.makedirs(dest_dir, exist_ok=True)

files = sorted(glob.glob(os.path.join(src_dir, "*.gif")))
for i, file_path in enumerate(files):
    try:
        img = Image.open(file_path).convert("RGBA") # Ensure RGBA/RGB
        
        # We can just convert to RGB if there's no transparency needed to save space
        # But if it's a 3D image, maybe we keep RGB.
        img = img.convert("RGB")
        
        out_path = os.path.join(dest_dir, f"frame_{i}.webp")
        img.save(out_path, "WEBP", quality=80)
    except Exception as e:
        print(f"Error on {file_path}: {e}")

print(f"Successfully processed {len(files)} frames to {dest_dir}")

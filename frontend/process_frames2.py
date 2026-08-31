import os
import glob
from PIL import Image

src_dir = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\public\temp_farmer_phone_2"
dest_dir = r"D:\Government-Subsidy-Grant-Disbursement-Tracking-System\frontend\public\anim-phone"
START_INDEX = 100

files = sorted(glob.glob(os.path.join(src_dir, "*.gif")))
for i, file_path in enumerate(files):
    try:
        img = Image.open(file_path).convert("RGB")
        
        frame_idx = START_INDEX + i
        out_path = os.path.join(dest_dir, f"frame_{frame_idx}.webp")
        img.save(out_path, "WEBP", quality=80)
    except Exception as e:
        print(f"Error on {file_path}: {e}")

print(f"Successfully processed {len(files)} new frames to {dest_dir}")

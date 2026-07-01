"""
Seed Firestore for project: gov-subsidy-tracker
Uses the firebase_admin SDK with the existing login credentials.
"""
import firebase_admin
from firebase_admin import credentials, firestore
import json
import sys
import time
import os

sys.stdout.reconfigure(encoding='utf-8')

SCHEMES_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"
PROJECT_ID = "gov-subsidy-tracker"

def main():
    print(f"Initializing Firebase for project: {PROJECT_ID}...")
    
    # Try Application Default Credentials (from firebase login)
    try:
        options = {"projectId": PROJECT_ID}
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, options)
        db = firestore.client()
        print("Firebase connected via Application Default Credentials!")
    except Exception as e:
        print(f"ADC failed: {e}")
        print("Trying with service account key...")
        
        # Fallback to service account key
        key_path = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\serviceAccountKey.json"
        if os.path.exists(key_path):
            try:
                if firebase_admin._apps:
                    firebase_admin.delete_app(firebase_admin.get_app())
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
                db = firestore.client()
                print("Firebase connected via service account key!")
            except Exception as e2:
                print(f"Service account key also failed: {e2}")
                return
        else:
            print("No service account key found. Exiting.")
            return

    print("Loading schemes...")
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    print(f"Loaded {len(schemes)} schemes. Pushing to Firestore...")

    BATCH_SIZE = 400
    total = 0

    for i in range(0, len(schemes), BATCH_SIZE):
        batch = db.batch()
        chunk = schemes[i:i + BATCH_SIZE]

        for s in chunk:
            clean = {k: (v if v is not None else "") for k, v in s.items()}
            doc_ref = db.collection("schemes").document(s["id"])
            batch.set(doc_ref, clean)

        batch.commit()
        total += len(chunk)
        pct = total / len(schemes) * 100
        print(f"  {pct:.0f}% ({total}/{len(schemes)})")
        time.sleep(0.3)

    print(f"\nDONE! {total} schemes in Firestore (project: {PROJECT_ID})")

if __name__ == "__main__":
    main()

"""
Firebase Firestore Seed Script
Pushes all 4680 real schemes to Firestore in batches.
Run ONCE — after this Flutter can use real-time Firestore listeners.

Architecture:
  - Firestore collection 'schemes' → all 4680 govt schemes (read-only from Flutter)
  - Firestore collection 'applications' → user applications (real-time updates)
  - Local JSON → backend in-memory (REST API, zero reads from Firestore)
"""
import firebase_admin
from firebase_admin import credentials, firestore
import json
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

SERVICE_KEY = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\serviceAccountKey.json"
SCHEMES_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"

def main():
    print("Initializing Firebase...")
    try:
        cred = credentials.Certificate(SERVICE_KEY)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase connected!")
    except Exception as e:
        print(f"Firebase init failed: {e}")
        return

    print("Loading schemes from JSON...")
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    print(f"Loaded {len(schemes)} schemes. Pushing to Firestore in batches...")

    # Firestore batch limit = 500 writes per batch
    BATCH_SIZE = 400
    total_written = 0
    errors = 0

    for batch_start in range(0, len(schemes), BATCH_SIZE):
        batch = db.batch()
        batch_schemes = schemes[batch_start:batch_start + BATCH_SIZE]

        for scheme in batch_schemes:
            # Clean None values (Firestore doesn't accept None, use empty string)
            clean = {k: (v if v is not None else "") for k, v in scheme.items()}
            # Use the slug as Firestore document ID (same as backend id field)
            doc_ref = db.collection("schemes").document(scheme["id"])
            batch.set(doc_ref, clean)

        try:
            batch.commit()
            total_written += len(batch_schemes)
            pct = total_written / len(schemes) * 100
            print(f"  Batch {batch_start}-{batch_start+len(batch_schemes)}: {pct:.0f}% ({total_written}/{len(schemes)})")
            time.sleep(0.5)  # Avoid Firestore rate limits
        except Exception as e:
            print(f"  Batch error at {batch_start}: {e}")
            errors += 1

    print(f"\nDONE! Written {total_written} schemes to Firestore.")
    print(f"Errors: {errors}")
    print("\nFirestore structure:")
    print("  /schemes/{slug}    → 4680 govt schemes")
    print("  /applications/{id} → user applications (real-time)")

if __name__ == "__main__":
    main()

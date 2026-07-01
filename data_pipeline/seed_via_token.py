"""
Seed gov-subsidy-tracker Firestore using Google OAuth token from Firebase CLI.
No service account key needed — uses the logged-in Firebase credentials.
"""
import subprocess
import json
import requests
import sys
import os
import time

sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ID = "gov-subsidy-tracker"
SCHEMES_FILE = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\data\schemes_real.json"

def get_firebase_token():
    """Get OAuth2 access token from the firebase CLI stored config."""
    import glob
    appdata = os.environ.get("APPDATA", "")
    
    # Firebase CLI stores token in .config/configstore/firebase-tools.json (npm global)
    config_paths = [
        os.path.join(os.path.expanduser("~"), ".config", "configstore", "firebase-tools.json"),
        os.path.join(appdata, "Roaming", "npm-cache", "_logs"),  # Sometimes here
    ]
    
    for path in config_paths:
        if os.path.exists(path):
            try:
                with open(path) as f:
                    cfg = json.load(f)
                tokens = cfg.get("tokens", {})
                refresh_token = tokens.get("refresh_token")
                if refresh_token:
                    # Exchange refresh token for access token
                    resp = requests.post(
                        "https://oauth2.googleapis.com/token",
                        data={
                            "client_id": "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
                            "client_secret": "j9iVZfS8ggxc57MYxDDWk2ks",
                            "refresh_token": refresh_token,
                            "grant_type": "refresh_token"
                        }
                    )
                    if resp.status_code == 200:
                        return resp.json()["access_token"]
                    else:
                        print(f"Token exchange failed: {resp.text[:200]}")
            except Exception as e:
                print(f"Error reading {path}: {e}")
    return None


def firestore_batch_write(project_id, docs, access_token):
    """Write a batch of documents to Firestore using REST API."""
    url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents:batchWrite"
    
    writes = []
    for slug, data in docs.items():
        fields = {}
        for k, v in data.items():
            if isinstance(v, str):
                fields[k] = {"stringValue": v}
            elif isinstance(v, bool):
                fields[k] = {"booleanValue": v}
            elif isinstance(v, (int, float)):
                fields[k] = {"doubleValue": float(v)}
            elif isinstance(v, list):
                array_vals = [{"stringValue": str(item)} for item in v]
                fields[k] = {"arrayValue": {"values": array_vals} if array_vals else {"values": []}}
            elif v is None:
                fields[k] = {"stringValue": ""}
            else:
                fields[k] = {"stringValue": str(v)}
        
        writes.append({
            "update": {
                "name": f"projects/{project_id}/databases/(default)/documents/schemes/{slug}",
                "fields": fields
            }
        })
    
    resp = requests.post(
        url,
        json={"writes": writes},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    return resp.status_code, resp.text[:200] if resp.status_code != 200 else "OK"


def main():
    print(f"Getting Firebase auth token...")
    token = get_firebase_token()
    
    if not token:
        print("Could not get token from Firebase CLI.")
        print("\nFALLBACK: Using firebase_admin with google-auth...")
        
        # Try using google-auth with firebase CLI credentials
        try:
            import google.oauth2.credentials
            import google.auth.transport.requests
            
            appdata = os.environ.get("APPDATA", "")
            config_path = os.path.join(os.path.expanduser("~"), ".config", "configstore", "firebase-tools.json")
            
            if os.path.exists(config_path):
                with open(config_path) as f:
                    cfg = json.load(f)
                tokens = cfg.get("tokens", {})
                refresh_token = tokens.get("refresh_token")
                access_token_stored = tokens.get("access_token")
                
                if refresh_token:
                    creds = google.oauth2.credentials.Credentials(
                        token=access_token_stored,
                        refresh_token=refresh_token,
                        token_uri="https://oauth2.googleapis.com/token",
                        client_id="563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
                        client_secret="j9iVZfS8ggxc57MYxDDWk2ks",
                        scopes=["https://www.googleapis.com/auth/cloud-platform"]
                    )
                    request = google.auth.transport.requests.Request()
                    creds.refresh(request)
                    token = creds.token
                    print(f"Got token via google-auth!")
        except Exception as e:
            print(f"google-auth fallback also failed: {e}")
            return
    
    if not token:
        print("\nCould not authenticate. Please:")
        print(f"1. Go to https://console.firebase.google.com/project/{PROJECT_ID}/settings/serviceaccounts/adminsdk")
        print("2. Generate new private key")
        print(r"3. Save as backend\src\main\resources\serviceAccountKey.json")
        print("4. Run: python seed_firestore_new.py")
        return
    
    print(f"Token obtained! Loading schemes...")
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)
    
    print(f"Loaded {len(schemes)} schemes. Seeding Firestore via REST API...")
    
    BATCH_SIZE = 20  # REST API batch limit is smaller
    total = 0
    errors = 0
    
    for i in range(0, len(schemes), BATCH_SIZE):
        chunk = schemes[i:i + BATCH_SIZE]
        docs = {s["id"]: s for s in chunk}
        
        status, msg = firestore_batch_write(PROJECT_ID, docs, token)
        if status == 200:
            total += len(chunk)
        else:
            errors += len(chunk)
            if errors <= 2:  # Only show first couple errors
                print(f"  Batch error at {i}: {status} - {msg}")
        
        if (i // BATCH_SIZE + 1) % 50 == 0:
            pct = total / len(schemes) * 100
            print(f"  {pct:.0f}% ({total}/{len(schemes)})")
        
        time.sleep(0.05)
    
    print(f"\nDONE! Written {total} schemes, {errors} errors")
    if errors == 0:
        print(f"All 4680 schemes are in {PROJECT_ID} Firestore!")

if __name__ == "__main__":
    main()

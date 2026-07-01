"""
Generate serviceAccountKey.json for gov-subsidy-tracker using Firebase CLI credentials.
Uses the access token stored by firebase CLI.
"""
import subprocess
import json
import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ID = "gov-subsidy-tracker"
OUTPUT = r"c:\Users\AkashK\Desktop\Infosys Springboard 7.0\backend\src\main\resources\serviceAccountKey.json"

def get_access_token():
    """Get access token from firebase CLI's stored credentials."""
    import glob, os
    # Firebase CLI stores credentials in AppData
    config_dirs = glob.glob(os.path.expandvars(r"%APPDATA%\npm\node_modules\firebase-tools\**\*.json"), recursive=True)
    
    # Try directly calling firebase token
    try:
        # Use firebase to get a token
        result = subprocess.run(
            ["firebase", "--project", PROJECT_ID, "apps:list", "--json"],
            capture_output=True, text=True, timeout=15
        )
        print(f"Firebase apps:list result (stdout len): {len(result.stdout)}")
        return None
    except Exception as e:
        print(f"Firebase CLI call failed: {e}")
        return None

def main():
    print(f"Project: {PROJECT_ID}")
    
    # The service account for Firebase Admin SDK in gov-subsidy-tracker
    sa_email = f"firebase-adminsdk@{PROJECT_ID}.iam.gserviceaccount.com"
    
    print(f"Service account: {sa_email}")
    print()
    print("=" * 60)
    print("MANUAL STEP REQUIRED:")
    print("=" * 60)
    print(f"1. Go to: https://console.firebase.google.com/project/{PROJECT_ID}/settings/serviceaccounts/adminsdk")
    print("2. Click 'Generate new private key'")
    print(f"3. Save the downloaded .json file as:")
    print(f"   {OUTPUT}")
    print("=" * 60)
    print()
    print("After doing this, run: python seed_firestore_new.py")
    print("to push all 4680 schemes to gov-subsidy-tracker Firestore.")

if __name__ == "__main__":
    main()

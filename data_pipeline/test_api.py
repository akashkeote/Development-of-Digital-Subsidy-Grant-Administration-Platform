import requests
import ssl
import urllib3
import requests.adapters
import json

urllib3.disable_warnings()

class TLSAdapter(requests.adapters.HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        ctx = ssl.create_default_context()
        ctx.set_ciphers("DEFAULT@SECLEVEL=1")
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        kwargs["ssl_context"] = ctx
        return super().init_poolmanager(*args, **kwargs)

session = requests.Session()
session.mount("https://", TLSAdapter())

HEADERS = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7',
    'origin': 'https://www.myscheme.gov.in',
    'referer': 'https://www.myscheme.gov.in/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'x-api-key': 'tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc',
    'x-client': 'myscheme-ui'
}

url = "https://api.myscheme.gov.in/schemes/v6/public/schemes?slug=sui&lang=en"
res = session.get(url, headers=HEADERS, verify=False)
data = res.json()
print("KEYS:", data.keys())
if 'error' in data:
    print("ERROR:", data['errorDescription'])
else:
    print("DATA keys:", data['data'].keys())

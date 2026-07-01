import requests
import ssl
import urllib3
import requests.adapters

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

res = session.get('https://api.myscheme.gov.in/search/v4/schemes?lang=en&q=&from=0&size=5', headers={'user-agent': 'Mozilla/5.0'}, verify=False)
print("Status:", res.status_code)
print("Text:", res.text)

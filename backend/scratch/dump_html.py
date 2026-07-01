from playwright.sync_api import sync_playwright

def dump_html():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://www.myscheme.gov.in/search", wait_until="networkidle")
        page.wait_for_selector("a[href*='/schemes/']", timeout=25000)
        html = page.content()
        with open("myscheme_dom.html", "w", encoding="utf-8") as f:
            f.write(html)
        browser.close()

if __name__ == "__main__":
    dump_html()

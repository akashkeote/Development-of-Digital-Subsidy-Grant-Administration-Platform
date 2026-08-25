import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import { LandingPage } from './pages/LandingPage';", "import { LandingPage } from './pages/LandingPage';\nimport { LandingV2 } from './pages/LandingV2';")

# Add route
content = content.replace("<Route path=\"/\" element={<PageTransition><LandingPage /></PageTransition>} />", "<Route path=\"/\" element={<PageTransition><LandingPage /></PageTransition>} />\n          <Route path=\"/v2\" element={<PageTransition><LandingV2 /></PageTransition>} />")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

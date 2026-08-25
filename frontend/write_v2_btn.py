with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Link to="/register" className="btn-3d text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full">Get Started</Link>',
    '<Link to="/v2" className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors mr-2">Try V2 Beta</Link>\n                <Link to="/register" className="btn-3d text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full">Get Started</Link>'
)

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

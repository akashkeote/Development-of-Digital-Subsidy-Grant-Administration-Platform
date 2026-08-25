import re

with open('src/pages/Login.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';")

new_markup = """                    <div className="text-center pt-2">
                      <p className="text-xs font-medium text-slate-400">Demo mode — enter any value to login</p>
                      {selectedRole === 'citizen' && (
                        <p className="text-xs font-medium mt-4">
                          New beneficiary?{' '}
                          <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Register & Link Aadhaar
                          </Link>
                        </p>
                      )}
                    </div>"""

content = content.replace('''                    <div className="text-center pt-2">
                      <p className="text-xs font-medium text-slate-400">Demo mode — enter any value to login</p>
                    </div>''', new_markup)

with open('src/pages/Login.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

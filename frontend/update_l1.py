import re

with open('frontend/src/pages/L1VerificationDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 font-mono truncate">File: {doc.name}</p>',
    '<p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 font-mono truncate">File: {doc.name}</p>\n{doc.url !== \'#\' && <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">View Document</a>}'
)

with open('frontend/src/pages/L1VerificationDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

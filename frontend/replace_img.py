import re

with open('src/components/ChatbotWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the first image (large button)
content = re.sub(
    r'<img\s*src="https://cdngovai.myscheme.in/[^"]+"\s*alt="DigiGrant"\s*className="w-11 h-11 object-contain p-1"\s*/>',
    '<div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Bot size={24} strokeWidth={2.5} /></div>',
    content,
    flags=re.MULTILINE
)

# Replace the second image (header)
content = re.sub(
    r'<img\s*src="https://cdngovai.myscheme.in/[^"]+"\s*alt="DigiGrant"\s*className=\{object-contain bg-white rounded-full[^]+\}\s*/>',
    '<div className={lex items-center justify-center bg-white text-blue-600 rounded-full }><Bot size={18} strokeWidth={2.5} /></div>',
    content,
    flags=re.MULTILINE
)

with open('src/components/ChatbotWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced!")

import sys

try:
    import PyPDF2
    with open(sys.argv[1], "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    
    with open(sys.argv[2], "w", encoding="utf-8") as out:
        out.write(text)
except Exception as e:
    with open(sys.argv[2], "w", encoding="utf-8") as out:
        out.write(str(e))

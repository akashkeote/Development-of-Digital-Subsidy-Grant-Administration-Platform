from reportlab.pdfgen import canvas

def create_pdf():
    c = canvas.Canvas("kisan_tractor.pdf")
    c.drawString(100, 800, "Government of Maharashtra - Official Notification")
    c.drawString(100, 780, "Scheme Name: Maha Kisan Tractor Subsidy Yojana")
    c.drawString(100, 760, "Department: Ministry of Agriculture")
    c.drawString(100, 720, "Overview:")
    c.drawString(100, 700, "This scheme provides financial assistance to small and marginal farmers to purchase tractors.")
    c.drawString(100, 660, "Eligibility Criteria:")
    c.drawString(100, 640, "- Must be a resident of Maharashtra.")
    c.drawString(100, 620, "- Must own at least 2 acres of agricultural land.")
    c.drawString(100, 600, "- Annual family income should be less than 5 Lakhs.")
    c.drawString(100, 560, "Benefits:")
    c.drawString(100, 540, "- Up to 50% subsidy on the purchase of a new tractor.")
    c.drawString(100, 520, "- Maximum subsidy amount is Rs. 1.25 Lakhs.")
    c.drawString(100, 480, "Documents Required:")
    c.drawString(100, 460, "- Aadhaar Card")
    c.drawString(100, 440, "- 7/12 Land Extract")
    c.drawString(100, 420, "- Income Certificate")
    c.drawString(100, 380, "Application Process:")
    c.drawString(100, 360, "- Visit the nearest Maha-e-Seva Kendra.")
    c.drawString(100, 340, "- Submit the application form with required documents.")
    c.drawString(100, 320, "- Wait for block officer verification.")
    c.save()
    
if __name__ == "__main__":
    create_pdf()
    print("kisan_tractor.pdf created successfully.")

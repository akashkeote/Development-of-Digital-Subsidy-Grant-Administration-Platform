import re

with open('src/pages/LandingV2.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Navbar replacements
content = content.replace("WH-1000XM6", "DIGIGRANT 2.0")
content = content.replace(">Technology<", ">DBT Tech<")
content = content.replace(">Noise Cancelling<", ">Zero Leakage<")
content = content.replace(">Specs<", ">Security<")
content = content.replace(">Buy<", ">Portal<")
content = content.replace("Experience DIGIGRANT 2.0", "Access Portal")

# Hero replacements
content = content.replace("Sony DIGIGRANT 2.0", "DigiGrant 2.0")
content = content.replace("Silence, perfected.", "Empowerment, perfected.")
content = content.replace("Flagship wireless noise cancelling, re-engineered for a world that never stops.", "Flagship digital subsidy distribution, re-engineered for a growing India.")

# Section 1 replacements
content = content.replace("Precision-engineered <br/> <span className=\"text-[#00D6FF]\">for silence.</span>", "Precision-engineered <br/> <span className=\"text-[#00D6FF]\">for impact.</span>")
content = content.replace("Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.", "Aadhaar-linked KYC, real-time PFMS tracking, and automated workflows deliver absolute transparency.")
content = content.replace("Every component is tuned for balance, power, and comfort-hour after hour.", "Every transaction is routed with precision, speed, and security-reaching the right hands, instantly.")

# Section 2 replacements
content = content.replace("Adaptive noise cancelling, <br/> <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-[#0050FF] to-[#00D6FF]\">redefined.</span>", "Subsidy distribution, <br/> <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-[#0050FF] to-[#00D6FF]\">redefined.</span>")
content = content.replace("Multi-microphone array listens in every direction.", "Multi-tier verification blocks fraudulent claims.")
content = content.replace("Real-time noise analysis adjusts to your environment.", "Real-time ledger analytics monitor every rupee.")
content = content.replace("Your music stays pure-planes and crowds fade away.", "Your funds stay secure-middlemen and delays fade away.")

# Section 3 replacements
content = content.replace("Immersive, <br/> lifelike sound.", "Immersive, <br/> live analytics.")
content = content.replace("High-performance drivers unlock detail, depth, and texture in every track.", "High-performance dashboards unlock detail, depth, and clarity in every scheme.")
content = content.replace("AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.", "End-to-end digital tracking restores trust to government spending, so every grant is accounted for.")

# Section 4 (Outro) replacements
content = content.replace("Hear everything. <br/> <span className=\"text-white/40\">Feel nothing else.</span>", "Track everything. <br/> <span className=\"text-white/40\">Lose absolutely nothing.</span>")
content = content.replace("DIGIGRANT 2.0. Designed for focus, crafted for comfort.", "DigiGrant 2.0. Designed for governance, crafted for citizens.")
content = content.replace(">See full specs<", ">View features<")
content = content.replace("Engineered for airports, offices, and everything in between.", "Engineered for farmers, nodal officers, and everyone in between.")

with open('src/pages/LandingV2.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

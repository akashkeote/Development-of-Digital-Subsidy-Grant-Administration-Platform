with open(r"src\components\ScrollytellingSection.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Replace fonts and styling to match the Apple/Sony premium aesthetic

# 1. Hero text
code = code.replace(
    """<h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">""", 
    """<h1 className="text-6xl md:text-8xl font-sans font-bold text-white/90 tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl">"""
)
code = code.replace(
    """<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">""",
    """<span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#00D6FF] drop-shadow-lg">"""
)
code = code.replace(
    """<p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">""",
    """<p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed tracking-wide">"""
)
code = code.replace(
    """<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-md">""",
    """<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-semibold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(0,214,255,0.15)]">"""
)

# 2. Features
# Precision Targeting
code = code.replace(
    """<h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">""",
    """<h3 className="text-5xl md:text-6xl font-sans font-bold tracking-tighter text-white/90 mb-6 leading-[1.1] drop-shadow-xl">"""
)
code = code.replace(
    """<p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">""",
    """<p className="text-lg md:text-xl text-white/60 leading-relaxed font-medium tracking-wide">"""
)

# 3. CTA
code = code.replace(
    """<h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 drop-shadow-xl leading-[1.1]">""",
    """<h2 className="text-6xl md:text-8xl font-sans font-bold tracking-tighter text-white/90 mb-6 drop-shadow-2xl leading-[1.05]">"""
)
code = code.replace(
    """<p className="text-2xl text-blue-200 mb-10 max-w-2xl mx-auto drop-shadow-lg font-medium">""",
    """<p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto tracking-wide font-medium">"""
)
code = code.replace(
    """<button \n                      onClick={() => navigate('/login')}\n                      className="px-10 py-4 bg-white text-[#050505] rounded-full font-bold text-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] font-heading"\n                    >""",
    """<button \n                      onClick={() => navigate('/login')}\n                      className="px-10 py-4 bg-white text-[#050505] rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,214,255,0.3)] font-sans tracking-tight"\n                    >"""
)

# General icon color tweak to match Sony electric blue aesthetic #00D6FF
code = code.replace('text-blue-400', 'text-[#00D6FF]')
code = code.replace('text-emerald-400', 'text-[#00D6FF]')
code = code.replace('text-purple-400', 'text-[#00D6FF]')

with open(r"src\components\ScrollytellingSection.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Aesthetic updated successfully!")

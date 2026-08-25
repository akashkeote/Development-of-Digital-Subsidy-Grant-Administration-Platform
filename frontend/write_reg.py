import re

with open('src/pages/Registration.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove hardcoded names in handleVerifyOtp
content = content.replace("setFullName('Rajesh Kumar Sharma');\n    setPhone('+91 98765 43210');", "")

# 2. Fix the fallback in handleSubmit
content = content.replace("name: fullName || 'Rajesh Kumar Sharma',", "name: fullName,")
content = content.replace("email: email || 'rajesh.sharma@email.com',", "email: email,")
content = content.replace("phone: phone || '+91 98765 43210',", "phone: phone,")
content = content.replace("aadhaar: aadhaar || '5432-8765-1092',", "aadhaar: aadhaar,")
content = content.replace("bankAccount: bankAccount || '30291827461',", "bankAccount: bankAccount,")
content = content.replace("ifsc: ifsc || 'SBIN0001234',", "ifsc: ifsc,")

# 3. Redesign OTP Sent box
old_otp_box = """<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto space-y-5 bg-emerald-50">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-900">OTP Sent successfully</p>
                            <p className="text-xs text-emerald-700 mt-1">A 6-digit verification code has been sent to the mobile number registered with Aadhaar <span className="font-bold tracking-wider">{aadhaar.replace(/(.{4})/g, '$1 ').trim()}</span></p>
                          </div>
                        </div>"""
new_otp_box = """<motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl max-w-md mx-auto shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border border-slate-700">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                              <div className="absolute inset-0 bg-blue-400 blur-md opacity-20"></div>
                              <Smartphone className="w-5 h-5 text-blue-400 relative z-10" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-white tracking-wide">UIDAI AUTHENTICATION</p>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">Secured</span>
                              </div>
                              <p className="text-xs text-slate-300 mt-2 leading-relaxed">Verification code dispatched to Aadhaar-linked mobile for <span className="text-white font-mono font-medium tracking-widest">{aadhaar.replace(/(.{4})/g, '$1 ').trim()}</span></p>
                            </div>
                          </div>
                        </div>
                      </motion.div>"""
content = content.replace(old_otp_box, new_otp_box)
content = content.replace("""</motion.div>
  
                      <div className="space-y-4 max-w-xs mx-auto pt-2">""", """<div className="space-y-4 max-w-xs mx-auto pt-2">""")

# 4. Redesign Demographics box
old_demo_box = """<div className="border border-emerald-200 rounded-2xl p-4 flex items-center space-x-4 bg-emerald-50">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Demographic Records Authenticated</p>
                        <p className="text-xs text-emerald-700 mt-1">Retrieved Name: <span className="font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">{fullName}</span> | Mobile: <span className="font-semibold">{phone}</span></p>
                      </div>
                    </div>"""
new_demo_box = """<div className="bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                      <div className="absolute -right-10 -top-10 text-blue-500/5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                        <ShieldCheck size={140} />
                      </div>
                      <div className="relative z-10 flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-white tracking-widest uppercase mb-1 flex items-center">
                            KYC Verified via Aadhaar
                            <span className="ml-3 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">Please review and complete the remaining beneficiary profile details. Fields have been unlocked for correction.</p>
                        </div>
                      </div>
                    </div>"""
content = content.replace(old_demo_box, new_demo_box)

# 5. Fix disabled inputs
content = content.replace("""<input 
                          type="text" 
                          value={fullName} 
                          disabled 
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold focus:outline-none cursor-not-allowed" 
                        />""", """<input 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Singh"
                          className="w-full p-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                          required
                        />""")

content = content.replace("""<input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Optional"
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                        />""", """<input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. ramesh@example.com (Optional)"
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                        />""")

content = content.replace("""<input 
                          type="text" 
                          value={phone} 
                          disabled 
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold focus:outline-none cursor-not-allowed" 
                        />""", """<input 
                          type="text" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full p-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                          required
                        />""")

with open('src/pages/Registration.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

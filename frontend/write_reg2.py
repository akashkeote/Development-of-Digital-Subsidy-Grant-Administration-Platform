import re

with open('src/pages/Registration.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace State Input with Dropdown
old_state = """<label className="text-xs font-bold text-slate-700 pl-1">Resident State</label>
                      <input 
                        type="text" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                        required
                      />"""

new_state = """<label className="text-xs font-bold text-slate-700 pl-1">Resident State</label>
                      <select 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none" 
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>"""

content = content.replace(old_state, new_state)


# Replace Bank Name Input with Dropdown
old_bank = """<label className="text-[11px] font-bold text-blue-900 pl-1 uppercase tracking-wider">Bank Name</label>
                            <input 
                              type="text" 
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full p-3 bg-white border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                              placeholder="e.g. State Bank of India"
                              required
                            />"""

new_bank = """<label className="text-[11px] font-bold text-blue-900 pl-1 uppercase tracking-wider">Bank Name (NPCI Mapped)</label>
                            <select 
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full p-3 bg-white border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none" 
                              required
                            >
                              <option value="">Select Bank</option>
                              <option value="State Bank of India">State Bank of India (SBI)</option>
                              <option value="HDFC Bank">HDFC Bank</option>
                              <option value="ICICI Bank">ICICI Bank</option>
                              <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                              <option value="Axis Bank">Axis Bank</option>
                              <option value="Bank of Baroda">Bank of Baroda (BOB)</option>
                              <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                              <option value="Canara Bank">Canara Bank</option>
                              <option value="Union Bank of India">Union Bank of India</option>
                              <option value="Bank of India">Bank of India</option>
                              <option value="Indian Bank">Indian Bank</option>
                            </select>"""

content = content.replace(old_bank, new_bank)

with open('src/pages/Registration.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

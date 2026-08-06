import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Code2, Terminal, Shield, Copy, CheckCircle2 } from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8" id="api_docs_page_root">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg relative overflow-hidden text-white border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-heading">API Documentation</h1>
              <p className="text-slate-400 font-medium text-sm mt-1">REST API for Government Department Integration (v1)</p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <Shield className="text-emerald-400 shrink-0" size={20} />
            <p className="text-sm text-slate-300">
              All endpoints require a valid <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-300">Bearer Token</code> issued by the API Gateway.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          
          {/* Endpoint: Fetch Schemes */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-800">List Active Schemes</h3>
                <p className="text-slate-500 text-sm mt-1">Returns a paginated list of all active welfare schemes.</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 font-mono text-sm font-bold">
                <span className="text-blue-500">GET</span>
                <span className="text-slate-600">/api/v1/schemes</span>
              </div>
            </div>
            
            <div className="p-0 grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Parameters</h4>
                <ul className="space-y-4">
                  <li className="flex justify-between items-start text-sm">
                    <code className="font-bold text-slate-700">status</code>
                    <span className="text-slate-500 text-right w-2/3">Filter by status (e.g., <code className="text-xs bg-slate-100 px-1 rounded">ACTIVE</code>)</span>
                  </li>
                  <li className="flex justify-between items-start text-sm">
                    <code className="font-bold text-slate-700">category</code>
                    <span className="text-slate-500 text-right w-2/3">Filter by domain category</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-900 p-6 text-sm text-slate-300 font-mono relative group">
                <button 
                  onClick={() => handleCopy('[\n  {\n    "id": "SCH-001",\n    "title": "PM Kisan Samman Nidhi",\n    "status": "ACTIVE"\n  }\n]', 'req1')}
                  className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === 'req1' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-800 pb-2">
                  <Terminal size={14} /> <span>Response (200 OK)</span>
                </div>
                <pre className="overflow-x-auto">
                  <code className="text-emerald-400">
                    [<br/>
                    &nbsp;&nbsp;{'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;"id": <span className="text-blue-300">"SCH-001"</span>,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;"title": <span className="text-blue-300">"PM Kisan Samman Nidhi"</span>,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;"status": <span className="text-blue-300">"ACTIVE"</span><br/>
                    &nbsp;&nbsp;{'}'}<br/>
                    ]
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoint: Verify Aadhaar */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-800">Verify Identity (eKYC)</h3>
                <p className="text-slate-500 text-sm mt-1">Ping the Central Identity Data Repository to verify Aadhaar.</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 font-mono text-sm font-bold">
                <span className="text-amber-600">POST</span>
                <span className="text-slate-600">/api/v1/auth/verify</span>
              </div>
            </div>
            
            <div className="p-0 grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Request Body</h4>
                <pre className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-600 border border-slate-200 mb-4 overflow-x-auto">
{`{
  "aadhaarNumber": "XXXX-XXXX-XXXX",
  "consentToken": "jwt_token_here"
}`}
                </pre>
              </div>
              
              <div className="bg-slate-900 p-6 text-sm text-slate-300 font-mono relative group">
                <button 
                  onClick={() => handleCopy('{\n  "status": "SUCCESS",\n  "verificationScore": 0.98\n}', 'req2')}
                  className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === 'req2' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-800 pb-2">
                  <Terminal size={14} /> <span>Response (200 OK)</span>
                </div>
                <pre className="overflow-x-auto">
                  <code className="text-emerald-400">
                    {'{'}<br/>
                    &nbsp;&nbsp;"status": <span className="text-blue-300">"SUCCESS"</span>,<br/>
                    &nbsp;&nbsp;"verificationScore": <span className="text-amber-300">0.98</span><br/>
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

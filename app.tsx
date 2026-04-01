import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Terminal, Lock, Cpu } from 'lucide-react';

// AZRAEL_V1: THE DUAL-CORE INTERFACE
export default function AzraelCommand() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'AZRAEL_V1 ONLINE. KERNEL: VOID-METAL. STATUS: SENTRY-ASSISTANT.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
    if (!input) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // REACHING INTO THE LOCAL IRON (OLLAMA DEFAULT PORT)
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3', // The 8B Scalpel
          messages: [...messages, userMsg],
          stream: false // Set to true if you want the "dripping" effect later
        }),
      });

      if (!response.ok) throw new Error("LOCAL_CORE_OFFLINE");

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message.content 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "[CRITICAL_ERROR] LOCAL_IRON_DISCONNECTED. ENSURE OLLAMA IS RUNNING." 
      }]);
    }
  };


  return (
    <div className="min-h-screen bg-black text-red-500 font-mono p-4 flex flex-col items-center">
      {/* HEADER: THE PERIMETER */}
      <div className="w-full max-w-4xl border-b border-red-900 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Shield className="text-red-600" /> AZRAEL_V1 // COMMAND_VOID
        </h1>
        <div className="flex gap-4 text-xs text-red-800">
          <span className="flex items-center gap-1"><Cpu size={12}/> CORE: LOCAL_IRON</span>
          <span className="flex items-center gap-1"><Lock size={12}/> STATUS: SOVEREIGN</span>
        </div>
      </div>

      {/* THE FEED: THE VOID */}
      <div className="flex-1 w-full max-w-4xl overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 border ${m.role === 'user' ? 'border-red-900 bg-zinc-950' : 'border-zinc-800 bg-black text-zinc-400'}`}>
            <span className="text-[10px] block mb-1 uppercase tracking-widest text-red-700">
              {m.role === 'user' ? 'Architect' : 'Azrael_Sentry'}
            </span>
            {m.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT: THE IGNITION */}
      <div className="w-full max-w-4xl mt-4 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-zinc-950 border border-red-900 p-3 outline-none focus:ring-1 focus:ring-red-600 text-red-400"
          placeholder="ENTER COMMAND FOR THE VOID..."
        />
        <button onClick={handleSend} className="bg-red-900 hover:bg-red-700 text-black px-6 font-bold uppercase flex items-center gap-2">
          <Zap size={18} /> Ignite
        </button>
      </div>
    </div>
  );
}

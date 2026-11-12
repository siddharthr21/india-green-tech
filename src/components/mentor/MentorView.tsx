import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';
import { askAIMentor } from '../../lib/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const MentorView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `### Namaste! I am your AI Clean Energy Mentor (Clean Energy Advisor / GridMentor) 🇮🇳

I can assist you with:
- **PM Surya Ghar: Muft Bijli Yojana** subsidies, slab brackets & DISCOM applications
- **State-wise electricity tariffs**, net metering rules & banking restrictions
- **Merit Order Dispatch (MOD)**, SLDC SCADA telemetry & the National Grid freshness ladder
- **Optimal solar orientation**, tilt angles & string sizing for Indian climates
- **Smart City municipal clean energy** capital allocation and storage planning

Ask me any question below, or tap one of the suggested prompts!`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const suggestedPrompts = [
    'How does PM Surya Ghar subsidy work for 3 kW?',
    'What is Merit Order Dispatch in the Indian National Grid?',
    'What is the best solar tilt angle for Delhi & Mumbai?',
    'How to balance budget between solar, wind & battery storage?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const response = await askAIMentor(query);
      const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'assistant', text: response };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Clean Energy Mentor</h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Clean Energy Advisor v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Specialized Indian energy regulatory, technical, and subsidy advisor
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all hover:border-emerald-500/40 text-left"
          >
            💬 {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none prose prose-invert'
              }`}
            >
              <div className="whitespace-pre-line">
                {m.text}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>AI Mentor is analyzing Indian grid data and regulations...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything about rooftop solar, Indian grid telemetry, subsidies or energy sizing..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          className="flex-grow bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isTyping}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

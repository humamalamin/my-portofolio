import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X,
  FileDown, 
  Sun, 
  Moon,
  Layers,
  Zap,
  ShieldCheck,
  Languages,
  GitBranchIcon
} from 'lucide-react';

// Konfigurasi API Gemini dihapus karena sekarang di-handle oleh Cloudflare Pages Function

const App = () => {
  console.log("App component executing");
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('id'); // 'id' atau 'en'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! Saya asisten AI Humam. Ada yang ingin Anda tanyakan tentang keahlian Laravel/Golang atau pengalaman teknis Humam lainnya?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef(null);

  // Kamus Bahasa
  const t = {
    id: {
      hero: "Saya Humam. Saya membangun infrastruktur backend yang tangguh, skalabel, dan aman menggunakan Laravel & Golang.",
      available: "Tersedia untuk Proyek Baru",
      hire: "Hubungi Saya",
      chatAi: "Tanya Asisten AI",
      download: "Unduh CV",
      experience: "Pengalaman Kerja",
      projects: "Proyek Unggulan",
      matcherTitle: "AI Smart Matcher",
      matcherDesc: "Tempelkan Job Description untuk melihat kecocokan skill Humam secara instan.",
      matcherPlaceholder: "Tempel Job Desc di sini...",
      matcherBtn: "Analisis Kecocokan",
      footer: "Senior Backend Portfolio.",
      aiTitle: "Asisten Karir AI",
      aiStatus: "Mode Ahli",
      aiPlaceholder: "Tanya apa saja tentang Humam...",
      suggestions: ["Keahlian Teknis?", "Pengalaman di Levart?", "Implementasi mTLS?", "Kenapa pilih Humam?"]
    },
    en: {
      hero: "I'm Humam. I build robust, scalable, and secure backend infrastructure using Laravel & Golang.",
      available: "Available for New Projects",
      hire: "Hire Me",
      chatAi: "Chat with AI",
      download: "Download CV",
      experience: "Work Experience",
      projects: "Featured Projects",
      matcherTitle: "AI Smart Matcher",
      matcherDesc: "Paste a Job Description to instantly see how well Humam matches the role.",
      matcherPlaceholder: "Paste Job Desc here...",
      matcherBtn: "Analyze Match",
      footer: "Senior Backend Portfolio.",
      aiTitle: "AI Career Assistant",
      aiStatus: "Expert Mode",
      aiPlaceholder: "Ask anything about Humam...",
      suggestions: ["Tech Stack?", "Experience at Levart?", "mTLS Implementation?", "Why hire Humam?"]
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGemini = async (prompt, systemInstruction, history = []) => {
    const url = `/api/gemini`;
    const payload = {
      prompt,
      systemInstruction,
      history
    };

    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        if (i === 4) throw error;
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }
  };

  const systemPrompt = `
    Anda adalah asisten AI Humam Al Amin (Senior Backend Engineer). 
    Humam adalah expert di Laravel (Octane, Filament) & Golang (Clean Arch). 
    Pencapaian: 5000 req/s, mTLS, OAuth2, VIDA Integration, Hexagonal Architecture.
    Jawab dalam bahasa ${lang === 'id' ? 'Indonesia' : 'Inggris'}. 
    Nada: Profesional, Ahli, Percaya Diri.
  `;

  const handleSendMessage = async (text = chatInput) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    if (text === chatInput) setChatInput('');
    setIsLoading(true);

    try {
      const res = await callGemini(text, systemPrompt, messages);
      setMessages(prev => [...prev, { role: 'bot', text: res || "Gagal memproses." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Koneksi terganggu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDesc.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const analysisPrompt = `
      Anda adalah Pakar HR Tech. Analisis secara objektif kecocokan Humam Al Amin dengan Job Description berikut: "${jobDesc}".
      Berikan analisis mendalam mengenai skill Backend (Laravel/Golang/System Architecture).
      
      OUTPUT HARUS BERUPA JSON MURNI DALAM BAHASA ${lang === 'id' ? 'Indonesia' : 'Inggris'} (TANPA TEKS LAIN GUNA PARSING):
      {"score": 0-100, "summary": "Penjelasan singkat dalam bahasa ${lang === 'id' ? 'Indonesia' : 'Inggris'} kenapa dapat skor tersebut", "matchingSkills": ["skill1", "skill2"]}
    `;

    try {
      const responseText = await callGemini(analysisPrompt, "Pakar HR Tech.");
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) setAnalysisResult(JSON.parse(jsonStr));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const experiences = [
    {
      company: 'Levart Indonesia',
      role: 'Software Engineer',
      period: '2024 - Present',
      highlights: {
        id: [
          'Integrasi API aman perbankan dengan OAuth2 & mTLS.',
          'Nol insiden keamanan selama 12 bulan berturut-turut.',
          'Performa tinggi dengan Laravel Octane (5.000 req/s).',
          'Mempercepat delivery dashboard admin 3x menggunakan Filament 3.'
        ],
        en: [
          'Secure API integration with OAuth2 & mTLS for banking systems.',
          'Zero security incidents for 12 months consecutive.',
          'High performance with Laravel Octane (5,000 req/s).',
          'Accelerated admin panel delivery 3x using Filament 3.'
        ]
      }
    },
    {
      company: 'BuildWithAngga',
      role: 'Golang Mentor',
      period: '2024 - Present',
      highlights: {
        id: [
          'Membimbing 2.000+ siswa dalam proyek Golang dunia nyata.',
          'Tingkat kelulusan lebih tinggi melalui dukungan komunitas Discord aktif.'
        ],
        en: [
          'Mentored 2,000+ students in real-world Golang projects.',
          'Higher completion rate through active Discord community support.'
        ]
      }
    },
    {
      company: 'Otoklix',
      role: 'Backend Developer',
      period: '2022',
      highlights: {
        id: [
          'Revamp API Python ke Golang: peningkatan performa 30% dalam 3 bulan.',
          'Implementasi Clean Architecture & Unit Testing untuk keandalan sistem.'
        ],
        en: [
          'Python to Golang revamp: 30% performance boost in 3 months.',
          'Implemented Clean Architecture & Unit Testing for reliability.'
        ]
      }
    }
  ];

  const projects = [
    {
      title: { id: 'DMS Aman & E-Signature', en: 'Secure DMS & E-Signature' },
      tech: 'Laravel, VIDA API, Redis',
      desc: { 
        id: 'Sistem manajemen dokumen dengan tanda tangan digital legal (Kominfo) yang mengurangi penggunaan kertas hingga 70%.',
        en: 'Document management system with legal digital signatures (Kominfo) reducing paper usage by up to 70%.'
      },
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: { id: 'Mesin Sinkronisasi Marketplace', en: 'Marketplace Sync Engine' },
      tech: 'PHP, Go, RabbitMQ, MySQL',
      desc: {
        id: 'Integrasi multichannel (Tokopedia, Shopee) untuk sinkronisasi inventaris & transaksi POS secara real-time.',
        en: 'Multichannel integration (Tokopedia, Shopee) for real-time inventory and POS transaction synchronization.'
      },
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: { id: 'Platform LMS Achieve', en: 'Achieve LMS Platform' },
      tech: 'Lumen, Sentry, Elasticsearch',
      desc: {
        id: 'Optimasi platform pembelajaran yang menangani lonjakan user dan peningkatan pertumbuhan 20% pertahun.',
        en: 'Optimized learning platform handling user spikes and 20% annual growth.'
      },
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const theme = {
    bg: darkMode ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]',
    text: darkMode ? 'text-gray-100' : 'text-slate-900',
    sub: darkMode ? 'text-gray-400' : 'text-slate-600',
    card: darkMode ? 'bg-white/5 border-white/10 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500/50',
    nav: darkMode ? 'bg-black/50 border-white/5' : 'bg-white/70 border-slate-200',
    input: darkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300 shadow-inner',
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme.bg} ${theme.text} font-sans selection:bg-indigo-500/40`}>
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors ${theme.nav}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent italic">HA.</span>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <Languages size={16} className="text-indigo-500" />
              {lang.toUpperCase()}
            </button>

            {/* Theme Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="https://wa.me/6282125938523" target="_blank" className="hidden sm:block text-sm px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">{t[lang].hire}</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <section className="mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> {t[lang].available}
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Senior <br /><span className="text-indigo-500">Backend</span> Engineer.
          </h1>
          <p className={`text-xl md:text-2xl ${theme.sub} max-w-2xl mb-12 leading-relaxed`}>
            {t[lang].hero}
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsChatOpen(true)} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" /> {t[lang].chatAi}
            </button>
            
            {/* Re-added Download CV Button */}
            <a href="#" className={`px-8 py-4 font-bold rounded-2xl flex items-center gap-3 transition-all ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              <FileDown className="w-5 h-5" /> {t[lang].download}
            </a>

            <a href="https://github.com/humamalamin" target="_blank" className={`px-8 py-4 font-bold rounded-2xl flex items-center gap-3 transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}>
              <GitBranchIcon className="w-5 h-5" /> GitHub
            </a>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tight">{t[lang].projects}</h2>
            <div className={`flex-1 h-px ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <div key={i} className={`p-8 rounded-[2rem] border transition-all group ${theme.card}`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{p.title[lang]}</h3>
                <p className={`text-xs font-bold text-indigo-500/80 mb-4 uppercase tracking-widest`}>{p.tech}</p>
                <p className={`text-sm leading-relaxed ${theme.sub}`}>{p.desc[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & AI Tool Split */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 mb-32">
          <section id="experience">
            <h2 className="text-3xl font-black mb-12 tracking-tight">{t[lang].experience}</h2>
            <div className="space-y-12">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-indigo-500/20">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                  <div className="text-sm font-bold text-indigo-500 mb-2">{exp.period}</div>
                  <h3 className="text-2xl font-black mb-1">{exp.role}</h3>
                  <div className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{exp.company}</div>
                  <ul className="space-y-3">
                    {exp.highlights[lang].map((h, i) => (
                      <li key={i} className={`flex gap-3 text-sm leading-relaxed ${theme.sub}`}>
                        <ChevronRight size={18} className="text-indigo-500 shrink-0 mt-0.5" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-8">
            <div className={`p-8 rounded-[2.5rem] border sticky top-24 ${darkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-white border-slate-200 shadow-xl shadow-indigo-100/50'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-indigo-500" />
                <h3 className="font-black text-xl">{t[lang].matcherTitle}</h3>
              </div>
              <p className={`text-sm ${theme.sub} mb-6`}>{t[lang].matcherDesc}</p>
              <textarea 
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder={t[lang].matcherPlaceholder}
                className={`w-full h-32 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4 ${theme.input}`}
              />
              <button 
                onClick={() => handleAnalyzeJob()}
                disabled={isAnalyzing || !jobDesc}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : t[lang].matcherBtn}
              </button>

              {analysisResult && (
                <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold">Match Score</span>
                    <span className="text-3xl font-black text-indigo-500">{analysisResult.score}%</span>
                  </div>
                  <div className={`text-xs p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'} ${theme.sub} leading-relaxed`}>
                    {analysisResult.summary}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* AI Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end p-4 md:p-8 bg-black/80 backdrop-blur-md">
          <div className={`w-full md:w-[500px] h-[750px] max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border transition-all animate-in slide-in-from-right-12 duration-500 ${darkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="p-8 bg-indigo-600 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"><Bot size={28} /></div>
                <div>
                  <h3 className="font-black">{t[lang].aiTitle}</h3>
                  <div className="flex items-center gap-2 opacity-80"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> <span className="text-[10px] font-bold uppercase tracking-widest">{t[lang].aiStatus}</span></div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={`p-5 rounded-3xl text-sm leading-relaxed ${msg.role === 'bot' ? (darkMode ? 'bg-white/5 text-gray-300' : 'bg-slate-100 text-slate-800') : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-8 pb-4 flex flex-wrap gap-2 shrink-0">
              {t[lang].suggestions.map((q, i) => (
                <button key={i} onClick={() => handleSendMessage(q)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  {q}
                </button>
              ))}
            </div>

            <div className={`p-8 border-t ${darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t[lang].aiPlaceholder} 
                  className={`flex-1 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${theme.input}`} 
                />
                <button onClick={() => handleSendMessage()} className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg hover:bg-indigo-500 transition-all"><Send size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={`py-20 text-center border-t transition-colors ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <p className={`text-sm ${theme.sub}`}>&copy; {new Date().getFullYear()} Humam Al Amin. {t[lang].footer}</p>
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mt-4 italic">Built with React + Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
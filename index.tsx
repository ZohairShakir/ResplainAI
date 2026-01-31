import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  LogOut,
  Sparkles,
  Loader2,
  Trash2,
  Database,
  Cpu,
  Globe,
  Twitter,
  Github,
  Info,
  Clock,
  ArrowUpRight,
  Mail,
  Search,
  LayoutGrid,
  Menu,
  X,
  Plus,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { authAPI, papersAPI, galleryAPI, libraryAPI } from './src/api/client.js';

// --- Constants ---
type View = 'landing' | 'login' | 'signup' | 'app' | 'pricing' | 'docs' | 'gallery';
type AgeLevel = 'preschool' | 'middleschool' | 'college' | 'professional';

const LOGOS = ["Twilio", "Superhuman", "Perplexity", "Vercel", "Antidote", "Blackbird", "Ripple"];

const AGE_CONFIGS: Record<AgeLevel, { label: string, instruction: string }> = {
  preschool: { 
    label: 'Preschool', 
    instruction: 'Explain like I am 5. Use very basic words, short sentences, and compare things to toys or animals.'
  },
  middleschool: { 
    label: '12 Years Old', 
    instruction: 'Explain like I am 12. Use relatable analogies about school, sports, or games. No jargon.'
  },
  college: { 
    label: 'College', 
    instruction: 'Explain like a college student. Keep it academic but remove the dense filler. Focus on logic.'
  },
  professional: { 
    label: 'Professional', 
    instruction: 'Executive summary. Focus on ROI, technical breakthroughs, and practical implementation.'
  }
};

const INITIAL_GALLERY = [
  { id: 1, title: "Attention Is All You Need", author: "Google Brain", category: "AI", summary: "How transformers changed the world of AI by focusing on the most important parts of a sentence.", source: "Resplain AI" },
  { id: 2, title: "Quantum Supremacy", author: "Nature", category: "Quantum", summary: "Google's breakthrough in making computers that solve impossible problems in seconds.", source: "Dr. Elena" },
  { id: 3, title: "The Bitcoin Whitepaper", author: "Satoshi Nakamoto", category: "Finance", summary: "A system for digital money without needing a bank in the middle.", source: "Resplain AI" },
  { id: 4, title: "Generative Adversarial Nets", author: "Ian Goodfellow", category: "ML", summary: "Two AI models competing against each other to create super-realistic images.", source: "Sam K." },
  { id: 5, title: "Modern Monetary Theory", author: "L. Randall Wray", category: "Economics", summary: "How governments that print their own money can never really run out of it.", source: "Resplain AI" },
];

// --- API Service ---
// Removed direct Gemini calls - now handled by backend

// --- Components ---
const Button = ({ children, variant = 'primary', className = '', onClick, disabled }: any) => {
  const base = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm select-none shadow-sm active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:active:scale-100";
  const variants: any = {
    primary: "bg-[#FF7A59] text-white hover:bg-[#f86b48]",
    secondary: "bg-white text-[#FF7A59] border border-[#FF7A59]/20 hover:bg-orange-50",
    ghost: "text-slate-500 hover:text-[#FF7A59] hover:bg-orange-50/50",
    black: "bg-[#111] text-white hover:bg-black"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Navbar = ({ onViewChange, currentView, user, onLogout }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-xl md:text-2xl cursor-pointer" onClick={() => { onViewChange('landing'); setIsOpen(false); }}>
          <div className="w-7 h-7 md:w-8 md:h-8 border-[3px] border-[#FF7A59] rounded-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-[#FF7A59] rounded-full" />
          </div>
          <span className="tracking-tighter">Resplain</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
          <button onClick={() => onViewChange('gallery')} className={`hover:text-[#FF7A59] transition-colors ${currentView === 'gallery' ? 'text-[#FF7A59]' : ''}`}>Gallery</button>
          <button onClick={() => onViewChange('docs')} className={`hover:text-[#FF7A59] transition-colors ${currentView === 'docs' ? 'text-[#FF7A59]' : ''}`}>Docs</button>
          <button onClick={() => onViewChange('pricing')} className={`hover:text-[#FF7A59] transition-colors ${currentView === 'pricing' ? 'text-[#FF7A59]' : ''}`}>Pricing</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="rounded-full py-2 px-6" onClick={() => onViewChange('app')}>Workspace</Button>
              <button onClick={onLogout} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <>
              <button onClick={() => onViewChange('login')} className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 hover:text-[#FF7A59]">Login</button>
              <Button variant="primary" onClick={() => onViewChange('signup')} className="rounded-full px-6 py-2.5">Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-500 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-slate-100 overflow-hidden px-6 pb-8">
            <div className="flex flex-col gap-5 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <button onClick={() => { onViewChange('gallery'); setIsOpen(false); }} className="text-left py-2">Gallery</button>
              <button onClick={() => { onViewChange('docs'); setIsOpen(false); }} className="text-left py-2">Docs</button>
              <button onClick={() => { onViewChange('pricing'); setIsOpen(false); }} className="text-left py-2">Pricing</button>
              <div className="h-px bg-slate-100" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <Button variant="primary" onClick={() => { onViewChange('app'); setIsOpen(false); }}>Workspace</Button>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-left text-red-500 py-2">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button onClick={() => { onViewChange('login'); setIsOpen(false); }} className="py-2">Login</button>
                  <Button variant="primary" onClick={() => { onViewChange('signup'); setIsOpen(false); }}>Get Started</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ onStart, onViewChange }: any) => (
  <div className="bg-white min-h-screen relative grid-bg">
    <section className="relative z-10 pt-40 md:pt-48 pb-24 px-6 md:px-8 text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF7A59] mb-8 md:mb-12 shadow-sm">
           Simplified Research <Button variant="primary" className="rounded-full py-1 px-3 text-[9px] h-auto ml-2">Try Resplain <ArrowRight size={10}/></Button>
        </div>
        
        <h1 className="text-5xl md:text-[100px] font-black tracking-tighter text-[#111] mb-8 md:mb-10 leading-[0.9] max-w-4xl mx-auto">
          Understand research <br className="hidden md:block" /> like you're 12.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
          The AI platform that turns dense academic papers into simple analogies and actionable insights. Faster learning for curious minds.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16 md:mb-24">
          <Button variant="primary" className="w-full md:w-auto px-10 py-4 rounded-full text-base" onClick={onStart}>Try Resplain AI</Button>
          <Button variant="secondary" className="w-full md:w-auto px-10 py-4 rounded-full text-base" onClick={() => onViewChange('gallery')}>View Gallery</Button>
        </div>

        {/* Realistic Product Mockup */}
        <div className="max-w-5xl mx-auto mb-20 md:mb-32 px-2">
          <div className="bg-white rounded-[24px] md:rounded-[40px] overflow-hidden soft-shadow border border-slate-100 p-2 md:p-3 relative">
            <div className="bg-slate-50 rounded-[20px] md:rounded-[32px] p-4 md:p-10 text-left min-h-[400px] md:min-h-[500px]">
              {/* Fake UI Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 border-b border-slate-200 pb-6">
                <div>
                  <h3 className="font-black text-xl text-[#111] mb-1">Quantum_Paper_v2.pdf</h3>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black bg-orange-100 text-[#FF7A59] px-2 py-0.5 rounded uppercase tracking-widest">12 Years Old Level</span>
                    <span className="text-[9px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">Processed</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <div className="h-10 w-full md:w-32 bg-white rounded-lg border border-slate-200" />
                   <div className="h-10 w-10 bg-[#FF7A59] rounded-lg shrink-0 flex items-center justify-center text-white"><Download size={18}/></div>
                </div>
              </div>

              {/* Fake Content Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 text-[#FF7A59]"><Sparkles size={16}/> <span className="text-xs font-black uppercase tracking-widest">The Analogy</span></div>
                    <p className="text-slate-600 font-medium leading-relaxed">Imagine you have a magic coin that can be both heads and tails at the exact same time until you look at it. Quantum computers use these magic coins to solve puzzles billions of times faster than your iPad...</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <div className="h-2 w-32 bg-slate-100 rounded mb-4" />
                     <div className="space-y-3">
                       <div className="h-2 w-full bg-slate-50 rounded" />
                       <div className="h-2 w-5/6 bg-slate-50 rounded" />
                     </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Key Takeaways</h4>
                    <div className="space-y-4">
                      {[1,2,3].map(i => <div key={i} className="flex gap-3"><div className="w-2 h-2 rounded-full bg-[#FF7A59] mt-1 shrink-0"/><div className="h-2 w-full bg-slate-200 rounded"/></div>)}
                    </div>
                  </div>
                  <div className="h-32 bg-orange-50/50 rounded-2xl border border-orange-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="max-w-6xl mx-auto pt-20 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-14">Accelerating understanding for world-class teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-16 gap-y-10 opacity-30 grayscale invert-[0.1]">
            {LOGOS.map(l => <span key={l} className="text-xl md:text-2xl font-black tracking-tighter">{l}</span>)}
          </div>
        </div>
      </div>
    </section>
  </div>
);

const GalleryPage = ({ papers: initialPapers }: { papers: any[] }) => {
  const [search, setSearch] = useState("");
  const [papers, setPapers] = useState(initialPapers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const response = await galleryAPI.getAll(search);
        setPapers(response.papers);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchGallery();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search]);

  const filtered = papers.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 md:pt-40 bg-[#fefefe] px-6 md:px-10 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111] mb-6">Discover Explanations</h1>
            <p className="text-xl text-slate-500 font-medium">Browse public summaries generated by the community and Resplain AI.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search papers or tags..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF7A59] transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((paper) => (
            <motion.div 
              key={paper.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 soft-shadow hover:scale-[1.02] transition-transform cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black bg-orange-50 text-[#FF7A59] px-3 py-1 rounded-full uppercase tracking-widest">{paper.category}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{paper.source}</span>
              </div>
              <h3 className="text-2xl font-black text-[#111] mb-3 leading-tight group-hover:text-[#FF7A59] transition-colors">{paper.title}</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">{paper.author}</p>
              <p className="text-slate-600 font-medium leading-relaxed line-clamp-3 mb-8">{paper.summary}</p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[#FF7A59] font-black text-[10px] uppercase tracking-widest">
                <span>Read Full Resplain</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No papers found</div>
          )}
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ mode, onAuthSuccess, onModeChange }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = mode === 'login' 
        ? await authAPI.login(email, password)
        : await authAPI.signup(email, password);
      
      // Store token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      onAuthSuccess(response.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex items-center justify-center p-4 md:p-8 pt-24 md:pt-32">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl bg-white rounded-[40px] md:rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl min-h-[500px] lg:min-h-[650px]">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-1 gradient-panel p-20 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white, transparent)' }} />
          <div className="relative z-10 flex items-center gap-2 text-white font-black text-2xl">
             <div className="w-9 h-9 border-[3.5px] border-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <span className="tracking-tighter">Resplain</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
              Bridge the gap between <br/> jargon and clarity.
            </h2>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8 md:mb-12">
              <div className="text-[#FF7A59] mb-6"><Sparkles size={40} /></div>
              <h1 className="text-4xl font-black mb-4 tracking-tight text-[#111]">
                {mode === 'login' ? 'Welcome back' : 'Start learning'}
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Unlock 3 free research explains per month or upgrade for unlimited clarity.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF7A59] transition-all font-medium" placeholder="natalia@research.ai" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF7A59] transition-all font-medium" placeholder="••••••••" />
              </div>
              <Button variant="primary" className="w-full py-5 text-base rounded-2xl mt-4" disabled={loading}>
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign in' : 'Create account')}
              </Button>
            </form>

            <div className="mt-10 text-center">
               <p className="text-slate-400 text-sm font-medium">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
                  <button onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')} className="text-[#FF7A59] font-black ml-2 hover:underline">
                    {mode === 'login' ? 'Register' : 'Login'}
                  </button>
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LibraryList = () => {
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await libraryAPI.getLibrary();
        setLibrary(response.library);
      } catch (err) {
        console.error('Failed to fetch library:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading...</div>;
  }

  if (library.length === 0) {
    return <div className="text-slate-400 text-sm">No papers yet. Upload your first paper!</div>;
  }

  return (
    <ul className="space-y-6">
      {library.map((paper) => (
        <li key={paper.id} className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-[#FF7A59] cursor-pointer group transition-colors">
          <FileText size={18} className="text-slate-200 group-hover:text-[#FF7A59]"/> {paper.name}
        </li>
      ))}
    </ul>
  );
};

const AppDashboard = ({ onPostToGallery }: { onPostToGallery: (title: string, summary: string) => void }) => {
  const [file, setFile] = useState<any>(null);
  const [ageLevel, setAgeLevel] = useState<AgeLevel>('middleschool');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [explanation, setExplanation] = useState<string>("");
  const [hasPosted, setHasPosted] = useState(false);
  const [currentPaperId, setCurrentPaperId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (f: File) => {
    setFile(f);
    setStatus('analyzing');
    setHasPosted(false);
    setError('');
    
    try {
      const response = await papersAPI.process(f.name, ageLevel);
      setExplanation(response.paper.explanation);
      setCurrentPaperId(response.paper.id);
      setStatus('done');
    } catch (err: any) {
      setError(err.message || 'Failed to process paper. Please try again.');
      setStatus('idle');
    }
  };

  const handlePost = async () => {
    if (!currentPaperId) {
      setError('No paper ID available. Please process a paper first.');
      return;
    }
    
    try {
      await galleryAPI.postToGallery(currentPaperId, 'Community');
      const summary = explanation.split('\n').filter(l => l.trim() !== '').slice(1, 3).join(' ');
      onPostToGallery(file.name, summary);
      setHasPosted(true);
      setError(''); // Clear any previous errors
    } catch (err: any) {
      setError(err.message || 'Failed to post to gallery. Please try again.');
    }
  };

  const exportText = () => {
    const blob = new Blob([explanation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resplain-${file?.name || 'analysis'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 bg-[#f9f9f9] px-6 md:px-10 pb-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-80 space-y-8">
           <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3"><Clock size={16}/> My Library</h3>
             <LibraryList />
             <Button variant="secondary" className="w-full mt-8 py-3.5 flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
                <Plus size={16}/> New Upload
             </Button>
           </div>
           <div className="bg-[#111] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden hidden lg:block">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
             <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Subscription</p>
             <h4 className="font-bold text-xl mb-6">Pro Member</h4>
             <div className="h-1.5 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                <div className="h-full w-2/3 bg-[#FF7A59] rounded-full" />
             </div>
             <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Unlimited Papers</p>
           </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h2 className="text-4xl font-black tracking-tight mb-2 text-[#111]">Workspace</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select complexity level to begin</p>
            </div>
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                {(Object.keys(AGE_CONFIGS) as AgeLevel[]).map((key) => (
                <button key={key} onClick={() => { setAgeLevel(key); if (status === 'done') handleUpload(file); }} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${ageLevel === key ? 'bg-[#FF7A59] text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-slate-600'}`}>
                    {AGE_CONFIGS[key].label}
                </button>
                ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => fileInputRef.current?.click()} className="h-[400px] md:h-[600px] border-[3px] border-dashed border-slate-200 rounded-[48px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#FF7A59]/30 transition-all bg-white/40 group px-6 text-center">
                <input type="file" ref={fileInputRef} hidden onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                <div className="w-20 md:w-24 h-20 md:h-24 bg-white rounded-[32px] flex items-center justify-center mb-8 md:mb-10 text-[#FF7A59] shadow-2xl border border-slate-50 group-hover:scale-110 transition-transform">
                  <Upload size={36} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Upload PDF</h3>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Select a research paper to resplain</p>
              </motion.div>
            )}

            {status === 'analyzing' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[400px] md:h-[600px] flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-[#FF7A59] animate-spin mb-10" />
                <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Synthesizing...</h3>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Target: {AGE_CONFIGS[ageLevel].label}</p>
              </motion.div>
            )}

            {error && status !== 'analyzing' && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6">
                {error}
              </div>
            )}

            {status === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 md:p-8 rounded-[32px] text-[#111] soft-shadow border border-slate-100 gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-[#FF7A59]"><FileText size={24} /></div>
                    <div className="min-w-0">
                      <h1 className="font-bold text-lg md:text-xl mb-1 truncate max-w-xs">{file?.name}</h1>
                      <span className="text-[9px] bg-orange-100 text-[#FF7A59] px-3 py-1 rounded-full font-black uppercase tracking-widest">{AGE_CONFIGS[ageLevel].label} level</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="ghost" className="p-3" onClick={() => setStatus('idle')}><Trash2 size={20} /></Button>
                    <Button variant="secondary" disabled={hasPosted} className="h-12 px-6 rounded-2xl" onClick={handlePost}>
                      <Share2 size={18} /> {hasPosted ? 'Posted' : 'Post to Gallery'}
                    </Button>
                    <Button variant="primary" className="flex-1 md:flex-none h-12 px-8 rounded-2xl" onClick={exportText}><Download size={18} /> Export</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-16 lg:p-24 shadow-xl min-h-[500px]">
                  {explanation.split('\n').map((line, i) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return <div key={i} className="h-4" />;
                    const isHeader = cleanLine.toUpperCase() === cleanLine || cleanLine.endsWith(':');
                    return (
                      <p key={i} className={`${isHeader ? 'text-xl md:text-2xl font-black text-[#111] mt-10 mb-6' : 'text-slate-700 text-base md:text-lg leading-relaxed font-medium mb-4'}`}>
                        {cleanLine}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PricingPage = ({ onStart }: any) => (
  <section className="pt-40 md:pt-48 pb-32 px-6 md:px-10 bg-[#fefefe]">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Simple Pricing.</h2>
      <p className="text-lg md:text-xl text-slate-500 mb-20 max-w-xl mx-auto leading-relaxed font-medium">Focus on learning, not billing. Start for free and upgrade for more power.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto text-left">
        <div className="bg-white p-10 md:p-14 rounded-[40px] md:rounded-[48px] border border-slate-100 soft-shadow flex flex-col">
          <h4 className="text-2xl font-black mb-3">Free</h4>
          <div className="flex items-baseline gap-2 mb-8 text-[#FF7A59]">
            <span className="text-5xl font-black text-[#111]">₹0</span>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">/mo</span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-10">Casual Readers</p>
          <ul className="space-y-5 mb-12 flex-1">
            {["3 papers per month", "Standard AI model", "Public gallery access"].map(f => (
              <li key={f} className="flex items-center gap-4 text-sm font-bold text-slate-500">
                <CheckCircle2 size={16} className="text-[#FF7A59]" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full py-5 rounded-2xl" onClick={onStart}>Get Started</Button>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[40px] md:rounded-[48px] border-[3px] border-[#FF7A59] shadow-2xl shadow-orange-500/10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FF7A59] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">Pro</div>
          <h4 className="text-2xl font-black mb-3">Monthly</h4>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-black text-[#111]">₹99</span>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">/mo</span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-10">Serious Scholars</p>
          <ul className="space-y-5 mb-12 flex-1 text-sm font-bold text-slate-700">
            {["Unlimited uploads", "Priority Gemini Pro", "Full text exports", "Private library"].map(f => (
              <li key={f} className="flex items-center gap-4">
                <CheckCircle2 size={16} className="text-[#FF7A59]" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full py-5 rounded-2xl" onClick={onStart}>Subscribe Now</Button>
        </div>
      </div>
    </div>
  </section>
);

const DocsPage = () => (
  <section className="pt-40 md:pt-48 pb-32 px-6 md:px-10 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tight text-[#111]">Platform Guide</h1>
      <p className="text-lg md:text-xl text-slate-500 mb-20 max-w-2xl font-medium leading-relaxed">Resplain is a browser-based research companion. No installation required. Master your reading flow in minutes.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">
        <div>
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-[#FF7A59]">Features</h2>
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-black mb-4">The Analogy Engine</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Every paper is processed through a target audience filter. We don't just summarize; we find real-world metaphors that fit the logic of the source material.</p>
            </section>
            <section>
              <h3 className="text-xl font-black mb-4">Gallery Discovery</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Browse explanations posted by other users or curated by the Resplain team. Shared knowledge is the best knowledge.</p>
            </section>
          </div>
        </div>
        <div className="bg-slate-50 p-8 md:p-12 rounded-[40px] md:rounded-[48px]">
          <h2 className="text-2xl font-black mb-6">Common Questions</h2>
          <div className="space-y-8">
            {[
              { q: "Supported formats?", a: "Currently, we prioritize PDF files as they are the academic standard." },
              { q: "Is it secure?", a: "Papers are processed in isolated sessions. Pro users have private workspaces." },
              { q: "What's the Free plan?", a: "Anyone can resplain up to 3 papers per month at no cost." }
            ].map((faq, i) => (
              <div key={i}>
                 <h4 className="font-bold text-[#111] mb-2">{faq.q}</h4>
                 <p className="text-sm text-slate-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ onViewChange }: any) => (
  <footer className="py-24 px-6 md:px-10 bg-white border-t border-slate-100">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
      <div className="max-w-xs">
        <div className="flex items-center gap-2 font-black text-2xl mb-8">
          <div className="w-8 h-8 border-[3px] border-[#FF7A59] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#FF7A59] rounded-full" />
          </div>
          <span className="tracking-tighter">Resplain</span>
        </div>
        <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-wider">
          Accelerating the world's understanding of complex research.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-20">
        <div className="space-y-6">
          <h6 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FF7A59]">Product</h6>
          <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <li><button onClick={() => onViewChange('landing')} className="hover:text-[#111] transition-colors">Home</button></li>
            <li><button onClick={() => onViewChange('gallery')} className="hover:text-[#111] transition-colors">Gallery</button></li>
            <li><button onClick={() => onViewChange('pricing')} className="hover:text-[#111] transition-colors">Pricing</button></li>
            <li><button onClick={() => onViewChange('docs')} className="hover:text-[#111] transition-colors">Docs</button></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h6 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FF7A59]">Social</h6>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FF7A59] transition-colors"><Twitter size={18}/></button>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FF7A59] transition-colors"><Github size={18}/></button>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] gap-4">
      <p>© 2024 Resplain AI Global</p>
      <p>Research Papers, Explained Simply.</p>
    </div>
  </footer>
);

const App = () => {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<any>(null);
  const [galleryPapers, setGalleryPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authAPI.getMe().catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      });
    }

    // Fetch gallery papers
    const fetchGallery = async () => {
      try {
        const response = await galleryAPI.getAll();
        setGalleryPapers(response.papers);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
        setGalleryPapers(INITIAL_GALLERY); // Fallback to initial
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (u: any) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    navigate('app');
  };

  const handlePostToGallery = async (title: string, summary: string) => {
    // Refresh gallery after posting
    try {
      const response = await galleryAPI.getAll();
      setGalleryPapers(response.papers);
    } catch (err) {
      console.error('Failed to refresh gallery:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('landing');
  };

  return (
    <div className="antialiased">
      <Navbar onViewChange={navigate} currentView={view} user={user} onLogout={handleLogout} />
      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onStart={() => user ? navigate('app') : setView('signup')} onViewChange={navigate} />
              <Footer onViewChange={navigate} />
            </motion.div>
          )}

          {view === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GalleryPage papers={loading ? INITIAL_GALLERY : galleryPapers} />
              <Footer onViewChange={navigate} />
            </motion.div>
          )}

          {(view === 'login' || view === 'signup') && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthPage mode={view} onAuthSuccess={handleAuthSuccess} onModeChange={(m: any) => setView(m)} />
            </motion.div>
          )}

          {view === 'app' && (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AppDashboard onPostToGallery={handlePostToGallery} />
            </motion.div>
          )}

          {view === 'pricing' && (
             <motion.div key="pricing-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PricingPage onStart={() => user ? navigate('app') : setView('signup')} />
                <Footer onViewChange={navigate} />
             </motion.div>
          )}

          {view === 'docs' && (
            <motion.div key="docs-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <DocsPage />
               <Footer onViewChange={navigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

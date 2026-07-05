"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

const ScrollReveal = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

const CIVIC_QUOTES = [
  {
    text: "The city is not an assembly of buildings, but a community of citizens.",
    author: "Ancient Proverb"
  },
  {
    text: "Small acts, when multiplied by millions of people, can transform the grid.",
    author: "Howard Zinn"
  },
  {
    text: "What affects all is the responsibility of all. Resilience is built together.",
    author: "Civic Maxim"
  },
  {
    text: "A civilization is defined by how quickly it repairs its fractures.",
    author: "Muncipal Protocol"
  },
  {
    text: "The best way to safeguard the future is to actively construct it today.",
    author: "Operational Directive"
  }
];

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeState, setFadeState] = useState("opacity-100 scale-100");
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const playHoverSound = () => {
    if (typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    playHoverSound();
    
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("opacity-0 scale-95 filter blur-sm");
      
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % CIVIC_QUOTES.length);
        setFadeState("opacity-100 scale-100 filter blur-none");
      }, 800); 

    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />

      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/40 mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-900/40 mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-900/40 mix-blend-screen filter blur-[130px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <header className="relative z-50 w-full px-8 py-10 flex justify-between items-center">
        <div className="text-xl font-bold tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          CivicConnect
        </div>
        <a 
          href="#login" 
          onMouseEnter={playHoverSound}
          className="px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
        >
          Access Portal
        </a>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <ScrollReveal>
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-6">
            <span className="block text-white drop-shadow-2xl">THE CITY</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              SPEAKS.
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl font-light text-gray-400 tracking-wide leading-relaxed mb-16">
            A next-generation citizen platform. Report failures, track municipal action, and build resilient infrastructure.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="animate-bounce opacity-50 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-4 text-cyan-400">Scroll to Explore</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-400 to-transparent"></div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center min-h-[200px] flex flex-col justify-center items-center">
        <ScrollReveal>
          <div className="w-12 h-px bg-cyan-500/50 mb-8"></div>
          <div className={`transition-all duration-700 ease-in-out transform ${fadeState} max-w-3xl mx-auto space-y-4`}>
            <p className="text-2xl md:text-4xl font-extralight tracking-wide text-gray-200 leading-relaxed italic">
              "{CIVIC_QUOTES[quoteIndex].text}"
            </p>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400/70">
              // {CIVIC_QUOTES[quoteIndex].author}
            </p>
          </div>
          <div className="w-12 h-px bg-cyan-500/50 mt-8"></div>
        </ScrollReveal>
      </section>

      <div className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          <ScrollReveal>
            <div 
              onMouseEnter={playHoverSound}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-1 md:p-2 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-16">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Civic Infrastructure</h2>
                  <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Instantly report potholes, water leaks, and hazards. Our system logs the data and routes it directly to municipal command centers.
                  </p>
                  <a href="/report" className="inline-block mt-4 px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-cyan-500 hover:text-black transition-colors">
                    Log an Incident
                  </a>
                </div>
                <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-20">
                  <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070" alt="City" className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div 
              onMouseEnter={playHoverSound}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-1 md:p-2 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-12 p-8 md:p-16">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Interactive Live Map</h2>
                  <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Visualize the health of your neighborhood in real-time. Upvote issues that affect you to prioritize municipal response times.
                  </p>
                </div>
                <a href="/dashboard" className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl block cursor-pointer relative z-20 group-hover:border-cyan-500/50 transition-colors duration-500">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2070" alt="Map" className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-700" />
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>

      <section id="login" className="relative z-10 py-32 px-4 flex justify-center items-center">
        <ScrollReveal>
          <div className="w-full max-w-md">
            
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold tracking-tight mb-3">
                {isLogin ? "Citizen Authentication" : "Citizen Registration"}
              </h3>
              <p className="text-gray-400">Secure access required for official submissions.</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <form onSubmit={handleAuth} className="space-y-6">
                
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-semibold tracking-widest uppercase text-gray-400 pl-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest uppercase text-gray-400 pl-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest uppercase text-gray-400 pl-1">Password</label>
                  <input 
                    type="password"
                    required 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  onMouseEnter={playHoverSound}
                  className={`w-full text-white font-bold tracking-widest py-4 rounded-xl uppercase transition-all duration-300 mt-4 ${
                    isAuthenticating 
                      ? "bg-gray-800 text-cyan-500 cursor-not-allowed" 
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-0.5"
                  }`}
                >
                  {isAuthenticating ? "VERIFYING..." : isLogin ? "Sign In" : "Register Account"}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-mono text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already registered? Sign in"}
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-4 opacity-50">
                <div className="h-px bg-white/20 flex-1"></div>
                <span className="text-xs tracking-widest uppercase">Or</span>
                <div className="h-px bg-white/20 flex-1"></div>
              </div>
              
              <button 
                type="button"
                onClick={handleAuth}
                disabled={isAuthenticating}
                onMouseEnter={playHoverSound}
                className="w-full mt-8 bg-white/5 border border-white/10 text-white font-semibold tracking-widest py-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Continue with Google
              </button>
            </div>
            
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
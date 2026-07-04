"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "../../lib/supabase"; 

const ScrollReveal = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
      {children}
    </div>
  );
};

export default function ReportIssue() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [existingReports, setExistingReports] = useState<any[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);
  const [isAutoClassified, setIsAutoClassified] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      const { data } = await supabase.from('reports').select('id, title, description').limit(20);
      if (data) setExistingReports(data);
    };
    fetchExisting();
  }, []);

  const playHoverSound = () => {
    if (typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    }
  };

  const analyzeInput = (text: string) => {
    const lowerText = text.toLowerCase();
    
    let detectedCategory = category;
    if (lowerText.match(/(pothole|crack|road|pavement|asphalt|traffic)/)) detectedCategory = "Road Hazard";
    else if (lowerText.match(/(leak|pipe|water|drain|flood|sewage)/)) detectedCategory = "Water Network";
    else if (lowerText.match(/(wire|spark|power|light|pole|electricity)/)) detectedCategory = "Electrical";
    else if (lowerText.match(/(garbage|trash|smell|waste|bin|dump)/)) detectedCategory = "Sanitation";

    if (detectedCategory !== category && detectedCategory !== "") {
      setCategory(detectedCategory);
      setIsAutoClassified(true);
      setTimeout(() => setIsAutoClassified(false), 3000);
    }

    const significantWords = lowerText.split(/[\s,.]+/).filter(w => w.length > 4);
    
    if (significantWords.length > 1 && existingReports.length > 0) {
      const match = existingReports.find(report => {
        const reportText = (report.title + " " + report.description).toLowerCase();
        const overlapCount = significantWords.filter(word => reportText.includes(word)).length;
        return overlapCount >= 2;
      });

      if (match) setDuplicateWarning(match);
      else setDuplicateWarning(null);
    } else {
      setDuplicateWarning(null);
    }
  };

  const captureLocation = () => {
    playHoverSound();
    setIsLocating(true);
    setErrorMessage("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          setErrorMessage("GPS Signal Denied. Using regional default coordinates.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMessage("Geospatial tracking not supported.");
      setIsLocating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      playHoverSound();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let finalImageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('evidence').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('evidence').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      const { error } = await supabase.from('reports').insert([{ 
        title, category, description, 
        latitude: lat || 22.8046, longitude: lng || 86.2029, image_url: finalImageUrl 
      }]);

      if (error) throw error;
      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage("Transmission Failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-cyan-400">Target Locked.</h2>
        <p className="mt-4">The municipal grid has been alerted.</p>
        <a href="/dashboard" className="mt-8 px-8 py-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500 hover:text-black">View Dashboard</a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden py-12 px-4">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <ScrollReveal>
          <div className="mb-12 border-l-4 border-cyan-500 pl-6">
            <a href="/" className="inline-flex items-center text-cyan-500 text-xs font-bold tracking-[0.2em] uppercase mb-6 hover:text-cyan-300">&larr; Return to Base</a>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Log Civic Anomaly.</h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative">
            
            {duplicateWarning && (
              <div className="mb-8 p-4 bg-amber-900/40 border border-amber-500/50 rounded-lg flex items-start animate-fade-in shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="text-amber-400 mr-3 text-xl">⚠️</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-400 tracking-widest uppercase">System AI: Similar Anomaly Detected</h4>
                  <p className="text-xs text-amber-200/70 mt-1">We found a recent report matching your description: <span className="font-bold text-white">"{duplicateWarning.title}"</span></p>
                  <button type="button" onClick={() => window.location.href='/dashboard'} className="mt-3 px-4 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-amber-500 hover:text-black transition-colors">
                    + Upvote Existing Report Instead
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-cyan-500/70">Anomaly Designation</label>
                  <input type="text" required value={title} 
                    onChange={(e) => { setTitle(e.target.value); analyzeInput(e.target.value); }} 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-cyan-500" 
                  />
                </div>
                
                <div className="space-y-3 relative">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-cyan-500/70 flex justify-between items-center">
                    Threat Level
                    {isAutoClassified && <span className="text-emerald-400 text-[9px] animate-pulse">✨ AI Auto-Classified</span>}
                  </label>
                  <select required value={category} onChange={(e) => setCategory(e.target.value)} 
                    className={`w-full bg-black/50 border ${isAutoClassified ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-white/10'} rounded-lg p-4 text-white outline-none transition-all duration-500`}
                  >
                    <option value="">Classify the issue...</option>
                    <option value="Road Hazard">Class A: Road & Infrastructure</option>
                    <option value="Water Network">Class B: Water Network</option>
                    <option value="Electrical">Class C: Electrical Grid</option>
                    <option value="Sanitation">Class D: Sanitation & Waste</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold tracking-[0.2em] uppercase text-cyan-500/70">Tactical Analysis</label>
                <textarea required rows={4} value={description} 
                  onChange={(e) => { setDescription(e.target.value); analyzeInput(e.target.value); }} 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-cyan-500 resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-cyan-500/70">Visual Intel</label>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                  <div onClick={() => fileInputRef.current?.click()} className="h-32 bg-black/40 border-2 border-dashed border-cyan-500/30 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative group">
                    {imagePreview ? <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-60" /> : <span className="text-xs text-cyan-500/70 font-bold uppercase tracking-widest group-hover:text-cyan-400">Attach Image</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-cyan-500/70">GPS Telemetry</label>
                  <div className="h-32 bg-black/60 border border-white/10 rounded-lg p-4 flex flex-col justify-center text-center">
                    <div className="mb-3">
                      {lat && lng ? <span className="text-emerald-400 text-xs font-mono tracking-widest">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span> : <span className="text-red-400 text-xs font-mono tracking-widest">OFFLINE</span>}
                    </div>
                    <button type="button" onClick={captureLocation} className="bg-white/5 border border-white/10 py-2 rounded text-xs uppercase hover:bg-cyan-500/20 text-gray-300">Acquire Lock</button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <button type="submit" disabled={isSubmitting || !!duplicateWarning} className={`w-full py-5 rounded-lg text-sm font-black tracking-[0.3em] uppercase transition-all ${isSubmitting ? "bg-gray-900 text-cyan-700" : duplicateWarning ? "bg-amber-500/50 text-black cursor-not-allowed" : "bg-cyan-500 text-black hover:bg-cyan-400"}`}>
                  {isSubmitting ? "TRANSMITTING..." : duplicateWarning ? "PLEASE RESOLVE DUPLICATE" : "Execute Report Protocol"}
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
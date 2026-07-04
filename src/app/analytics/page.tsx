"use client";

import { useState } from "react";

export default function AnalyticsDashboard() {
  const [activeAlert, setActiveAlert] = useState(true);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden p-4 md:p-8">
      
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px]"></div>
      </div>

      {activeAlert && (
        <div className="relative z-20 mb-8 w-full bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse-slow">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="text-red-400 font-bold tracking-widest uppercase text-sm">Municipal Broadcast: Level 4 Alert</h4>
              <p className="text-red-200/70 text-xs mt-1">Severe waterlogging reported near Jubilee Park, Jamshedpur. Avoid Marine Drive. Field units dispatched.</p>
            </div>
          </div>
          <button onClick={() => setActiveAlert(false)} className="mt-4 sm:mt-0 px-4 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-red-500 hover:text-black transition-colors shrink-0">
            Acknowledge
          </button>
        </div>
      )}

      <div className="relative z-10 flex justify-between items-end border-b border-white/10 pb-6 mb-8">
        <div>
          <a href="/" className="text-cyan-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-cyan-300 transition-colors">
            &larr; Return to Base
          </a>
          <h1 className="text-3xl font-black tracking-wider uppercase mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            System Analytics
          </h1>
          <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em] mt-1 uppercase">Grid: Jamshedpur Notified Area Committee (JNAC)</p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Issues", value: "142", color: "text-amber-400", sub: "+12% this week" },
              { label: "Avg Resolution", value: "48h", color: "text-cyan-400", sub: "-5h improvement" },
              { label: "Field Units", value: "34", color: "text-emerald-400", sub: "Currently deployed" },
              { label: "Citizen Trust", value: "89%", color: "text-purple-400", sub: "Upvote interaction rate" }
            ].map((stat, i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] text-gray-600 mt-2 font-mono">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Department Clearance Rates</h3>
            <div className="space-y-4">
              {[
                { dept: "Roads & Highways", progress: "78%", color: "bg-cyan-500" },
                { dept: "Water & Sanitation", progress: "62%", color: "bg-blue-500" },
                { dept: "Electrical Grid", progress: "91%", color: "bg-emerald-500" },
                { dept: "Waste Management", progress: "45%", color: "bg-amber-500" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span>{item.dept}</span>
                    <span>{item.progress} Resolved</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 border border-white/5 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.progress }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
             <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Locality Hotspots (Jamshedpur Grid)</h3>
             <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">42</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Bistupur</div>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">28</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Tatanagar Station</div>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">12</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Sakchi</div>
                </div>
             </div>
          </div>

        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl h-full border-t-2 border-t-red-500/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-red-400">AI Priority Queue</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            
            <p className="text-[10px] text-gray-500 font-mono mb-4 leading-relaxed">
              Algorithm accounts for severity class, citizen upvotes, and population density radius.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-lg hover:bg-red-900/40 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Score: 98.4</span>
                  <span className="text-[9px] text-gray-500 font-mono">Class C</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Live Wire Down near School</h4>
                <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-3">
                  <span>Loc: Sector 2</span>
                  <span>42 Citizens Affected</span>
                </div>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-lg hover:bg-amber-900/40 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Score: 84.2</span>
                  <span className="text-[9px] text-gray-500 font-mono">Class B</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Main Pipeline Burst</h4>
                <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-3">
                  <span>Loc: Marine Drive</span>
                  <span>128 Upvotes</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/40 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Score: 71.0</span>
                  <span className="text-[9px] text-gray-500 font-mono">Class A</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Massive Sinkhole</h4>
                <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-3">
                  <span>Loc: Bistupur Market</span>
                  <span>High Traffic Risk</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
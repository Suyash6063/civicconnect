"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";

const LiveMap = dynamic(() => import("../../components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-cyan-500 font-mono text-xs uppercase tracking-widest">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Initializing GIS Satellite Feed...
    </div>
  )
});

interface Report {
  id: string;
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  image_url?: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setReports(data);
          if (data.length > 0) setSelectedReport(data[0]);
        }
      } catch (err) {
        console.error("Error fetching telemetry:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();

    const subscription = supabase
      .channel("realtime-reports")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          setReports((prev) => [payload.new as Report, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-cyan-400 flex flex-col items-center justify-center font-mono uppercase tracking-widest">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Downloading Telemetry Matrix...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8 relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyan-500/20 pb-6 mb-8 gap-4">
        <div>
          <a href="/" className="text-cyan-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-cyan-300 transition-colors">
            &larr; Return to Base
          </a>
          <h1 className="text-3xl font-black tracking-wider uppercase mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Civic Network Command
          </h1>
          <p className="text-xs font-mono text-cyan-500/70 uppercase mt-1">
            Status: Operational // Grid: Jamshedpur // Incidents: {reports.length}
          </p>
        </div>
        
        {/* NEW NAVIGATION MENU */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/community"
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 hover:text-white transition-all"
          >
            Community Hub
          </a>
          <a
            href="/analytics"
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 hover:text-white transition-all"
          >
            Analytics
          </a>
          <a
            href="/report"
            className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            + Log New Anomaly
          </a>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 px-1">
            Incoming Data Stream
          </h2>
          
          {reports.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-sm text-gray-500 font-mono">
              NO ANOMALIES DETECTED IN QUADRANT
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-black/40 backdrop-blur-md ${
                  selectedReport?.id === report.id
                    ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/30">
                    {report.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(report.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="font-bold text-white tracking-wide truncate">{report.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-light">{report.description}</p>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>LAT: {report.latitude.toFixed(4)}</span>
                  <span>LNG: {report.longitude.toFixed(4)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[50vh] lg:min-h-auto relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/80 px-3 py-1.5 rounded-full border border-white/20 z-20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest ml-2">GIS Uplink Active</span>
          </div>

          <div className="flex-1 w-full relative min-h-[350px] z-20 rounded-lg overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <LiveMap 
              reports={reports as any} 
              selectedReport={selectedReport as any} 
              onSelectReport={(r: any) => setSelectedReport(r)} 
            />
          </div>

          {selectedReport ? (
            <div className="border-t border-white/10 pt-6 mt-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Target Intel Matrix</span>
                  <h3 className="text-xl font-bold tracking-wide uppercase text-white mt-1">{selectedReport.title}</h3>
                </div>
                <div className="mt-2 sm:mt-0 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-xs font-mono uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse mr-2"></span>
                  {selectedReport.status || 'Pending Triage'}
                </div>
              </div>
              
              <div className="mb-6 bg-black/40 rounded-xl p-5 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-800 z-0"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[15%] h-0.5 bg-cyan-500 z-0 shadow-[0_0_10px_#06b6d4]"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-black shadow-[0_0_10px_#06b6d4]"></div>
                    <span className="text-[9px] font-mono mt-2 text-cyan-400">LOGGED</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-black"></div>
                    <span className="text-[9px] font-mono mt-2 text-gray-500">VERIFIED</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-black"></div>
                    <span className="text-[9px] font-mono mt-2 text-gray-500">ASSIGNED</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-black"></div>
                    <span className="text-[9px] font-mono mt-2 text-gray-500">RESOLVED</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Tactical Analysis</h4>
                  <p className="text-sm text-gray-300 font-light leading-relaxed">{selectedReport.description}</p>
                </div>
                
                {selectedReport.image_url ? (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Visual Evidence</h4>
                    <div className="rounded-lg overflow-hidden border border-white/10 h-32 relative group cursor-pointer">
                      <img src={selectedReport.image_url} alt="Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-mono text-white tracking-widest uppercase">Expand</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Visual Evidence</h4>
                    <div className="rounded-lg border border-dashed border-white/10 h-32 flex items-center justify-center bg-black/20">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">No Visual Intel Uploaded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
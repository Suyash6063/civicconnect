"use client";

import { useState } from "react";

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  title: string;
  text: string;
  time: string;
  upvotes: number;
  hasUpvoted: boolean;
  comments: Comment[];
  isCommenting: boolean;
}

export default function CommunityHub() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"discussions" | "events">("discussions");

  const [newPostText, setNewPostText] = useState("");
  const [newCommentTexts, setNewCommentTexts] = useState<{ [key: string]: string }>({});

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Sarah Jenkins",
      title: "Massive thanks to the sanitation workers!",
      text: "The garbage accumulation issue I reported near Bistupur market yesterday was cleared up this morning. Great to see the platform actually accelerating official response times.",
      time: "2 hours ago",
      upvotes: 42,
      hasUpvoted: false,
      comments: [
        { id: "c1", author: "Municipal Dept", text: "Thank you! We are prioritizing Class D hazards this week.", time: "1 hour ago" }
      ],
      isCommenting: false
    },
    {
      id: "2",
      author: "Priya K.",
      title: "Seeking volunteers for tree plantation drive",
      text: "Hey everyone, the local environmental society is looking for hands this weekend. We will be planting saplings along the Marine Drive stretch. Will post an official event in the Action Grid soon.",
      time: "5 hours ago",
      upvotes: 18,
      hasUpvoted: false,
      comments: [],
      isCommenting: false
    }
  ]);

  const playHoverSound = () => {
    if (typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
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

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: "Alex Vanguard",
      title: "Community Update", 
      text: newPostText,
      time: "Just now",
      upvotes: 0,
      hasUpvoted: false,
      comments: [],
      isCommenting: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    playHoverSound();
  };

  const toggleUpvote = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasUpvoted: !post.hasUpvoted,
          upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1
        };
      }
      return post;
    }));
    playHoverSound();
  };

  const toggleCommentBox = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isCommenting: !post.isCommenting } : post
    ));
  };

  const submitComment = (postId: string) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Alex Vanguard",
      text: text,
      time: "Just now"
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    setNewCommentTexts({ ...newCommentTexts, [postId]: "" });
    playHoverSound();
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden p-4 md:p-8">
      
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113563332-ce147f897693?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-900/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <a href="/" className="text-cyan-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-cyan-300 transition-colors">
            &larr; Return to Base
          </a>
          <h1 className="text-3xl font-black tracking-wider uppercase mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Community <span className="text-cyan-400">Hub</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4 bg-black/50 p-2 rounded-lg border border-white/10 backdrop-blur-md">
          <span className={`text-[10px] font-mono tracking-widest uppercase ${!isAdminMode ? 'text-cyan-400' : 'text-gray-500'}`}>Citizen</span>
          <button 
            onClick={() => { setIsAdminMode(!isAdminMode); playHoverSound(); }}
            className="w-12 h-6 rounded-full bg-gray-800 relative transition-colors duration-300 focus:outline-none border border-white/20"
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 ${isAdminMode ? 'translate-x-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'translate-x-0 bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}></div>
          </button>
          <span className={`text-[10px] font-mono tracking-widest uppercase ${isAdminMode ? 'text-amber-400' : 'text-gray-500'}`}>Official Override</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            {isAdminMode && <div className="absolute inset-0 bg-amber-500/10 z-0 animate-pulse"></div>}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-900 to-black border-2 border-cyan-500/50 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080" alt="Profile" className="w-full h-full object-cover opacity-80" />
              </div>
              <h2 className="text-xl font-bold tracking-widest uppercase text-white">Alex Vanguard</h2>
              <p className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] mt-1">Locality: Bistupur, Jamshedpur</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl font-black text-cyan-400">14</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">Issues Reported</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">12</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">Issues Resolved</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-left">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">Earned Badges</h3>
                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-amber-400">★</span> <span>Seismic Safety Responder</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-cyan-400">♦</span> <span>Verified Reporter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          
          <div className="flex space-x-2 mb-6 bg-black/40 p-1 rounded-lg border border-white/10 inline-flex backdrop-blur-md">
            <button 
              onClick={() => { setActiveTab("discussions"); playHoverSound(); }}
              className={`px-6 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all ${activeTab === "discussions" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-500 hover:text-gray-300"}`}
            >
              Discussions (Forum)
            </button>
            <button 
              onClick={() => { setActiveTab("events"); playHoverSound(); }}
              className={`px-6 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all ${activeTab === "events" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-500 hover:text-gray-300"}`}
            >
              Action Grid (Events)
            </button>
          </div>

          {activeTab === "discussions" && (
            <div className="space-y-4">
              
              {!isAdminMode && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center space-x-4 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-full bg-cyan-900 overflow-hidden shrink-0 border border-cyan-500/50">
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080" alt="Me" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="text" 
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                    placeholder="Start a community discussion... (Press Enter)" 
                    className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-gray-500" 
                  />
                  <button onClick={handleCreatePost} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest rounded shrink-0 transition-colors">Post</button>
                </div>
              )}

              {posts.map(post => (
                <div key={post.id} className="bg-black/60 border border-white/10 rounded-xl p-6 backdrop-blur-md transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-200">{post.author}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{post.time}</div>
                    </div>
                  </div>
                  
                  {post.title && <h4 className="text-md font-bold mb-2">{post.title}</h4>}
                  <p className="text-sm text-gray-400 font-light leading-relaxed">{post.text}</p>
                  
                  <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => toggleUpvote(post.id)}
                      className={`flex items-center space-x-2 text-xs transition-colors ${post.hasUpvoted ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}
                    >
                      <span>▲ Upvote ({post.upvotes})</span>
                    </button>
                    <button 
                      onClick={() => toggleCommentBox(post.id)}
                      className={`flex items-center space-x-2 text-xs transition-colors ${post.isCommenting ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
                    >
                      <span>💬 Comment ({post.comments.length})</span>
                    </button>
                    
                    {isAdminMode && (
                      <button onClick={() => deletePost(post.id)} className="flex items-center space-x-2 text-xs text-red-500/70 hover:text-red-500 ml-auto transition-colors">
                        <span>[REMOVE POST]</span>
                      </button>
                    )}
                  </div>

                  {post.isCommenting && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex space-x-3 bg-white/5 p-3 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-[10px]">{comment.author.charAt(0)}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-gray-300">{comment.author}</span>
                              <span className="text-[9px] text-gray-600 font-mono">{comment.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {!isAdminMode && (
                        <div className="flex items-center space-x-2 mt-2">
                          <input 
                            type="text" 
                            placeholder="Write a reply..." 
                            value={newCommentTexts[post.id] || ""}
                            onChange={(e) => setNewCommentTexts({ ...newCommentTexts, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 w-full"
                          />
                          <button onClick={() => submitComment(post.id)} className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500 hover:text-black transition-colors">Reply</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              <div className="bg-black/60 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-[9px] uppercase tracking-widest rounded font-mono">Registrations Open</span>
                    <h3 className="text-lg font-bold text-white mt-3">Community Tech Quiz & Awareness Drive</h3>
                    <p className="text-sm text-gray-400 mt-1">A business, fintech, and civic awareness event.</p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 font-mono">
                      <span>Venue: NIT Jamshedpur Campus</span>
                    </div>
                  </div>
                  {!isAdminMode && <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black rounded text-xs font-bold uppercase">Register</button>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
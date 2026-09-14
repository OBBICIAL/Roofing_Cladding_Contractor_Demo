"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Zap, CheckCircle2, ArrowRight, Bot, Star, ShieldCheck, 
  ChevronLeft, UploadCloud, FileText
} from "lucide-react";

type PhoneMode = "funnel" | "sms";

export default function RoofingDemo() {
  const [phoneMode, setPhoneMode] = useState<PhoneMode>("sms");
  const [activeTab, setActiveTab] = useState("cockpit");

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['cockpit', 'reactivation', 'triage', 'docs'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element's top is in the upper half of the viewport
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveTab(id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Slider State (Sleeping Beauty Engine)
  const [sliderValue, setSliderValue] = useState(65);
  
  // Calculations
  const reactivationRate = 0.22;
  const bookedSurveys = Math.round(sliderValue * reactivationRate);
  const foundCashValue = bookedSurveys * 14500;
  
  // Funnel State
  const [eircode, setEircode] = useState("");
  const [jobType, setJobType] = useState("");
  const [feasibility, setFeasibility] = useState("");
  
  // SMS State
  const [chatMessages, setChatMessages] = useState([
    { sender: "Emma", text: "Hi John, it’s Emma from Gleason Roofing & Carpentry desk. Is this still the same John that had us out for an attic conversion estimate a while back?", time: "09:41 AM" },
    { sender: "Customer", text: "Yes still me. We put it on ice because timber prices were mental last year.", time: "09:45 AM" },
    { sender: "Emma", text: "Completely fair! Structural C24 timber and insulation costs have leveled off nicely over the last few months. Sean has a survey van in your estate on Thursday at 10:00 or Friday at 2:00 if you want him to check the rafter spans and refresh your quote for free?", time: "09:47 AM" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSurveyCard, setShowSurveyCard] = useState(false);

  const playSound = (type: 'ding' | 'send') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'ding') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1108.73, audioCtx.currentTime + 0.1); // C#6
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.log('Audio error', e);
    }
  };

  const handleSmsReply = (reply: string) => {
    playSound('send');
    setChatMessages(prev => [...prev, { sender: "Customer", text: reply, time: "09:50 AM" }]);
    setIsTyping(true);
    
    if (reply.includes("Thursday")) {
      setTimeout(() => {
        setIsTyping(false);
        playSound('ding');
        setChatMessages(prev => [...prev, { sender: "System", text: "Site survey locked for Thursday 10:00 AM • Sean dispatched", time: "09:51 AM" }]);
        setShowSurveyCard(true);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsTyping(false);
        playSound('ding');
        setChatMessages(prev => [...prev, { sender: "Emma", text: "I'll update your file. Let me know if you need anything in the future!", time: "09:51 AM" }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="max-w-[1400px] mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800/60 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <Home className="text-zinc-950 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
              Gleason Roofing & Carpentry <span className="text-zinc-500 font-normal">| AI Sales & Operations OS |</span> 
              <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium whitespace-nowrap"><ShieldCheck className="w-4 h-4"/> SafePass & CIRI Verified</span>
            </h1>
            <p className="text-sm text-zinc-400 font-medium">North Kildare & West Dublin Hub • Residential Reroofing, Commercial Cladding & Attic Conversions</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'cockpit', label: 'Full Cockpit' },
            { id: 'reactivation', label: 'Old/Dead Quote Reactivation' },
            { id: 'triage', label: 'Speed-to-Lead & Triage' },
            { id: 'docs', label: 'Docs & Regs Chaser' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors border ${
                activeTab === tab.id 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Executive Operations Hub (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top KPI Summary Strip */}
          <div id="cockpit" className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-24">
            <div className="bg-zinc-900 border border-zinc-800/60 p-4 rounded-xl">
               <div className="text-[10px] text-amber-500 font-bold tracking-wider mb-1">SPEED-TO-LEAD RESPONSE</div>
               <div className="text-2xl font-mono text-white mb-1">38 Seconds</div>
               <div className="text-[11px] text-zinc-500 leading-tight">Missed Call -&gt; WhatsApp Handshake</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/60 p-4 rounded-xl">
               <div className="text-[10px] text-amber-500 font-bold tracking-wider mb-1">OFFICE DESK TIME SAVED</div>
               <div className="text-2xl font-mono text-white mb-1">18.5 Hrs/Wk</div>
               <div className="text-[11px] text-zinc-500 leading-tight">Zero phone tag for pitch photos & measurements</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/60 p-4 rounded-xl relative overflow-hidden">
               <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-500/10 blur-xl"></div>
               <div className="text-[10px] text-emerald-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3"/> BCAR & COMPLIANCE
               </div>
               <div className="text-2xl font-mono text-white mb-1">100% Pre-Checked</div>
               <div className="text-[11px] text-zinc-500 leading-tight">Ridge height &gt;2.3m & span verification</div>
            </div>
            <div className="bg-zinc-900 border border-emerald-500/30 p-4 rounded-xl relative overflow-hidden">
               <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 blur-2xl"></div>
               <div className="text-[10px] text-emerald-400 font-bold tracking-wider mb-1">REACTIVATED PIPELINE</div>
               <div className="text-2xl font-mono text-emerald-400 mb-1">€{foundCashValue.toLocaleString()}</div>
               <div className="text-[11px] text-emerald-500/70 leading-tight">From sleeping quotes this month</div>
            </div>
          </div>

          {/* Feature 1: Triage Banner */}
          <div id="triage" className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 relative overflow-hidden scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wider mb-3">
                  <Zap className="w-3 h-3"/> FEATURE 1: 24/7 SPEED-TO-LEAD & INBOUND TRIAGE
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Homeowner Eircode & Attic Feasibility Engine</h3>
                <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">Instantly qualifies emergency leaks vs. €35k attic conversions. Weeds out sub-2.3m non-compliant attics before you waste diesel driving out.</p>
              </div>
              <button onClick={() => setPhoneMode('funnel')} className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
                Test Funnel on Mobile Frame <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* Feature 2: Regs Chaser */}
          <div id="docs" className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 scroll-mt-24">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold tracking-wider mb-4">
              <FileText className="w-3 h-3"/> FEATURE 2: BCAR PART L & INSURANCE DAMAGE CHASER
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Emergency Slate Repair - Celbridge", desc: "Roof Pitch & Valley leak photo verified via AI OCR", status: "Verified", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { title: "Full Attic Conversion - Maynooth", desc: "Ridge height confirmed at 2.45m; truss alteration flagged", status: "Qualified", color: "text-blue-400", bg: "bg-blue-400/10" },
                { title: "Natural Slate Re-Roof - Clane", desc: "SEAI Home Energy Grant pre-check queued", status: "Ready", color: "text-amber-400", bg: "bg-amber-400/10" },
                { title: "Commercial Torch-on Felt - Naas", desc: "48hr Drone/Photo survey report generated for estimator", status: "Actioned", color: "text-purple-400", bg: "bg-purple-400/10" }
              ].map((card, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
                  <div>
                     <div className="text-sm font-bold text-zinc-200 mb-1">{card.title}</div>
                     <div className="text-xs text-zinc-500 mb-3">{card.desc}</div>
                  </div>
                  <div className="self-end">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${card.bg} ${card.color}`}>{card.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 3: Sleeping Beauty Engine */}
          <div id="reactivation" className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-5 scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
                <Bot className="w-3 h-3"/> FEATURE 3: SLEEPING BEAUTY QUOTE REVIVAL ENGINE
              </div>
              <button onClick={() => setPhoneMode('sms')} className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-2 transition-colors border border-zinc-700">
                View Emma SMS AI <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
              <div className="flex-1">
                 <div className="flex justify-between mb-3">
                   <label className="text-sm font-medium text-zinc-300">Dormant Quote Archive Slider (Past 6–18 Months)</label>
                   <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{sliderValue} Quotes</span>
                 </div>
                 <input 
                   type="range" min="20" max="300" 
                   value={sliderValue} 
                   onChange={(e) => setSliderValue(parseInt(e.target.value))}
                   className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
              <div className="hidden lg:block w-px h-12 bg-zinc-800"></div>
              <div className="flex gap-8">
                 <div>
                   <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Reactivation Rate</div>
                   <div className="text-2xl font-mono text-white">22%</div>
                 </div>
                 <div>
                   <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Booked Surveys</div>
                   <div className="text-2xl font-mono text-blue-400">{bookedSurveys}</div>
                 </div>
              </div>
            </div>

            {/* Kanban */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Kiss Sent", count: sliderValue, color: "border-zinc-700" },
                { name: "Replied", count: Math.round(sliderValue * 0.45), color: "border-blue-500/30" },
                { name: "Scope Qualified", count: Math.round(sliderValue * 0.32), color: "border-amber-500/30" },
                { name: "Survey Locked", count: bookedSurveys + (showSurveyCard ? 1 : 0), color: "border-emerald-500/50", highlight: showSurveyCard }
              ].map((stage, i) => (
                <div key={i} className={`bg-zinc-950 border ${stage.color} rounded-lg p-3 relative transition-all duration-500 ${stage.highlight ? 'ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-500/5' : ''}`}>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{stage.name}</div>
                  <div className="text-2xl font-mono text-white">{stage.count}</div>
                  {stage.highlight && (
                     <div className="absolute -top-2 -right-2 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-pulse">
                       +1 NEW
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feature 4: Post-Sale Rep */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Dormer Attic Conversion - Straffan: Final invoice cleared</div>
              <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-emerald-500"/> <span className="font-medium text-zinc-300">5-Star Google Review request dispatched via WhatsApp</span> (Auto-synced to Google Business Profile)
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel: Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-8">
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 w-full max-w-[360px]">
            <button 
              onClick={() => setPhoneMode('funnel')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${phoneMode === 'funnel' ? 'bg-zinc-800 text-blue-400 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              1. Homeowner Funnel
            </button>
            <button 
              onClick={() => setPhoneMode('sms')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${phoneMode === 'sms' ? 'bg-zinc-800 text-blue-400 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              2. Sales SMS (Emma)
            </button>
          </div>

          {/* Phone Frame */}
          <div className="w-[360px] h-[720px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-800 p-4 relative shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col shadow-blue-900/10">
            {/* Dynamic Island / Notch area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-3xl z-50"></div>
            
            <div className="flex-1 bg-white rounded-[2rem] overflow-hidden flex flex-col relative mt-2 text-zinc-900">
              
              {phoneMode === 'funnel' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col h-full bg-slate-50">
                   {/* Header */}
                   <div className="bg-white px-5 pt-10 pb-4 shadow-sm z-10 flex items-center justify-between">
                      <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center">
                        <Home className="text-white w-5 h-5"/>
                      </div>
                      <div className="font-bold text-sm text-slate-800">Instant Quote Engine</div>
                      <div className="w-8"></div>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
                     {/* Step 1 */}
                     <div>
                       <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">1. Property Location</div>
                       <div className="relative">
                         <input 
                           type="text" placeholder="Enter Eircode" 
                           value={eircode} onChange={e => setEircode(e.target.value)}
                           className="w-full border border-slate-300 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         />
                         {eircode.length >= 3 && (
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
                             <CheckCircle2 className="w-3 h-3"/> Leinster autofill
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Step 2 */}
                     <div>
                       <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">2. Job Type</div>
                       <div className="grid grid-cols-2 gap-2">
                         {["Emergency Leak Repair", "Full Slate/Tile Re-Roof", "Velux Attic Conversion", "Commercial Flat Roof"].map(type => (
                           <button 
                             key={type} onClick={() => { setJobType(type); setFeasibility(""); }}
                             className={`p-2.5 text-[11px] font-semibold border rounded-lg text-center transition-all ${jobType === type ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600'}`}
                           >
                             {type}
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* Step 3 */}
                     <AnimatePresence>
                       {jobType && (
                         <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="overflow-hidden">
                           <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider mt-1">3. Feasibility Filter</div>
                           <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                             <p className="text-xs font-semibold text-slate-700 mb-3 leading-relaxed">
                               {jobType.includes("Attic") ? "Is your internal highest point (ridge height) above 2.3m?" : "Is water actively dripping into the living space?"}
                             </p>
                             <div className="flex gap-2">
                               {jobType.includes("Attic") ? (
                                 <>
                                   <button onClick={()=>setFeasibility('Yes')} className={`flex-1 py-2 text-xs font-bold rounded-md border transition-colors ${feasibility==='Yes'?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-300'}`}>Yes</button>
                                   <button onClick={()=>setFeasibility('Not Sure')} className={`flex-1 py-2 text-xs font-bold rounded-md border transition-colors ${feasibility==='Not Sure'?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-300'}`}>Not Sure</button>
                                   <button onClick={()=>setFeasibility('Low')} className={`flex-1 py-2 text-xs font-bold rounded-md border transition-colors ${feasibility==='Low'?'bg-red-50 text-red-600 border-red-200':'bg-white text-slate-600 border-slate-300'}`}>Low Ceiling</button>
                                 </>
                               ) : (
                                 <>
                                   <button onClick={()=>setFeasibility('Emergency')} className={`flex-1 py-2 text-xs font-bold rounded-md border transition-colors ${feasibility==='Emergency'?'bg-red-600 text-white border-red-600':'bg-white text-slate-600 border-slate-300'}`}>Emergency Callout</button>
                                   <button onClick={()=>setFeasibility('No')} className={`flex-1 py-2 text-xs font-bold rounded-md border transition-colors ${feasibility==='No'?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-300'}`}>No, just damp</button>
                                 </>
                               )}
                             </div>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>

                     {/* Step 4 */}
                     <div>
                       <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">4. Site Photos</div>
                       <div className="border-2 border-dashed border-slate-300 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                         <UploadCloud className="w-6 h-6 mb-2 text-blue-500" />
                         <span className="text-xs font-medium text-center">Drop leak or roof photo</span>
                       </div>
                     </div>
                   </div>

                   <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 pb-8">
                     <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                       Submit Scope & Connect <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">45s</span>
                     </button>
                   </div>
                </motion.div>
              )}

              {phoneMode === 'sms' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col h-full bg-[#f4f4f5]">
                  {/* iOS SMS Header */}
                  <div className="bg-[#f4f4f5]/90 pt-12 pb-3 px-4 flex items-center justify-between border-b border-zinc-200/80 backdrop-blur-md z-10 sticky top-0">
                     <div className="flex items-center gap-1 text-blue-500">
                       <ChevronLeft className="w-6 h-6"/>
                       <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-1 text-sm font-bold bg-gradient-to-b from-zinc-400 to-zinc-500 shadow-sm">
                         E
                       </div>
                     </div>
                     <div className="flex flex-col items-center">
                       <div className="text-sm font-semibold flex items-center gap-1 text-black">
                         Emma (Desk) <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                       </div>
                       <div className="text-[10px] text-zinc-500 font-medium">Gleason Direct Line</div>
                     </div>
                     <div className="w-14"></div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40">
                     <div className="text-[10px] text-center text-zinc-400 font-bold mb-6 mt-2">Today 09:41 AM</div>
                     
                     <AnimatePresence initial={false}>
                       {chatMessages.map((msg, i) => (
                         <motion.div 
                           key={i}
                           initial={{ opacity: 0, y: 10, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           transition={{ duration: 0.2 }}
                         >
                           {msg.sender === "System" ? (
                             <div className="text-[11px] text-center text-zinc-600 font-medium my-5 bg-zinc-200/60 py-1.5 px-4 rounded-full w-fit mx-auto shadow-sm border border-zinc-300/30">
                               {msg.text}
                             </div>
                           ) : (
                             <div className={`flex ${msg.sender === "Customer" ? 'justify-end' : 'justify-start'} mb-1`}>
                               <div className={`px-4 py-2.5 max-w-[85%] rounded-[1.25rem] text-[15px] leading-snug shadow-sm ${
                                 msg.sender === "Customer" 
                                   ? 'bg-[#007AFF] text-white rounded-br-sm' 
                                   : 'bg-[#E9E9EB] text-black rounded-bl-sm border border-black/5'
                               }`}>
                                 {msg.text}
                               </div>
                             </div>
                           )}
                         </motion.div>
                       ))}
                     </AnimatePresence>

                     {isTyping && (
                       <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-start">
                         <div className="bg-[#E9E9EB] px-4 py-3.5 rounded-[1.25rem] rounded-bl-sm w-16 flex justify-center gap-1.5 border border-black/5 shadow-sm">
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                         </div>
                       </motion.div>
                     )}
                  </div>

                  {/* Quick Replies / Input */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#f4f4f5]/90 backdrop-blur-md border-t border-zinc-200 p-3 pb-8 z-20">
                     {chatMessages.length <= 3 && !isTyping ? (
                       <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-2 mb-1">
                         <button onClick={() => handleSmsReply("Thursday at 10:00 suits perfectly.")} className="w-full text-left bg-white border border-zinc-200 p-3 rounded-xl text-[13px] font-semibold text-[#007AFF] shadow-sm active:bg-zinc-50 transition-colors">
                           "Thursday at 10:00 suits perfectly."
                         </button>
                         <button onClick={() => handleSmsReply("Roughly what are you charging per sq metre now?")} className="w-full text-left bg-white border border-zinc-200 p-3 rounded-xl text-[13px] font-semibold text-[#007AFF] shadow-sm active:bg-zinc-50 transition-colors">
                           "Roughly what are you charging per sq metre now?"
                         </button>
                         <button onClick={() => handleSmsReply("Already got it done, thanks.")} className="w-full text-left bg-white border border-zinc-200 p-3 rounded-xl text-[13px] font-semibold text-[#007AFF] shadow-sm active:bg-zinc-50 transition-colors">
                           "Already got it done, thanks."
                         </button>
                       </motion.div>
                     ) : (
                       <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full py-1.5 px-2 mb-1">
                          <div className="text-zinc-400 text-[15px] flex-1 ml-3 font-medium">iMessage</div>
                          <div className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center shadow-sm">
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                       </motion.div>
                     )}
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

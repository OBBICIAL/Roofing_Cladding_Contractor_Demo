"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Zap, CheckCircle2, ArrowRight, Bot, Star, ShieldCheck, 
  ChevronLeft, UploadCloud, FileText, X, Clock, Flame, Calendar, DollarSign, MapPin
} from "lucide-react";

type PhoneMode = "funnel" | "sms";

export default function RoofingDemo() {
  const [phoneMode, setPhoneMode] = useState<PhoneMode>("sms");
  const [activeTab, setActiveTab] = useState("cockpit");
  const [isDocsDrawerOpen, setIsDocsDrawerOpen] = useState(false);
  
  // Slider State
  const [sliderValue, setSliderValue] = useState(65);
  
  // Calculations
  const reactivationRate = 0.22;
  const bookedSurveys = Math.round(sliderValue * reactivationRate);
  
  // SMS Simulator states for pipeline updates
  const [showSurveyCard, setShowSurveyCard] = useState(false);
  const [triageDispatched, setTriageDispatched] = useState(false);
  
  // Dynamic pipeline value adding €14,500 if the survey is locked in
  const basePipeline = bookedSurveys * 14500;
  const totalPipeline = basePipeline + (showSurveyCard ? 14500 : 0);
  
  // Funnel State
  const [funnelStep, setFunnelStep] = useState(1);
  const [jobType, setJobType] = useState("");
  const [urgency, setUrgency] = useState("");
  const [ridgeHeight, setRidgeHeight] = useState("");
  const [eircode, setEircode] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // SMS Scenarios State
  const [smsScenario, setSmsScenario] = useState<"A" | "B">("A");
  
  const scenarioAMessages = [
    { sender: "Emma", text: "Hi John, it’s Emma from the Gleason Roofing desk. Is this still the same John who had Colm out to price up the roof work a while back?", time: "09:41 AM" },
    { sender: "Customer", text: "Yes, still me. We put it on ice because materials and timber prices were mental last year.", time: "09:45 AM" },
    { sender: "Emma", text: "Completely understand! Slate and timber prices have leveled off nicely this quarter. Colm has an estimator van out in your area this Thursday at 10:30 AM or Friday at 2:00 PM to re-check your roof pitches and refresh your quote for free. Would either time suit?", time: "09:47 AM" }
  ];

  const scenarioBMessages = [
    { sender: "Emma", text: "Hi, it’s Emma from Gleason Roofing desk. Colm and the crew are flat out on a roof and couldn't pick up. Is this for an active leak repair, a full re-roof, or an attic conversion?", time: "09:41 AM" }
  ];

  const [chatMessages, setChatMessages] = useState(scenarioAMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInteractionStep, setChatInteractionStep] = useState(0); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, phoneMode]);

  useEffect(() => {
    setChatMessages(smsScenario === "A" ? scenarioAMessages : scenarioBMessages);
    setChatInteractionStep(0);
    setShowSurveyCard(false);
    setTriageDispatched(false);
  }, [smsScenario]);

  const handleTabClick = (id: string) => {
    if (id === 'docs') {
      setIsDocsDrawerOpen(true);
      return;
    }
    setActiveTab(id);
    setIsDocsDrawerOpen(false);

    if (id === 'reactivation') {
      setPhoneMode('sms');
      setSmsScenario('A');
    } else if (id === 'triage') {
      setPhoneMode('sms');
      setSmsScenario('B');
    } else if (id === 'cockpit') {
      setPhoneMode('sms');
      setSmsScenario('A');
    }
  };

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
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(1108.73, audioCtx.currentTime + 0.1); 
        
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

  const handleSmsReply = (replyId: string, replyText: string) => {
    playSound('send');
    setChatMessages(prev => [...prev, { sender: "Customer", text: replyText, time: "09:50 AM" }]);
    setIsTyping(true);
    setChatInteractionStep(prev => prev + 1);
    
    if (smsScenario === "A") {
      if (replyId === "A") {
        setTimeout(() => {
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "System", text: "Site survey locked for Thursday 10:30 AM! Colm is booked into the dispatch diary with the ladder and laser measure pack.", time: "09:51 AM" }]);
          setShowSurveyCard(true);
          
          // Keep typing active for Emma's human response
          setTimeout(() => {
            setIsTyping(false);
            playSound('ding');
            setChatMessages(prev => [...prev, { sender: "Emma", text: "Alright John, that's all confirmed. Colm will see you then!", time: "09:51 AM" }]);
          }, 2000);
        }, 1500);
      } else if (replyId === "B") {
        setTimeout(() => {
          setIsTyping(false);
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "Emma", text: "It depends on rafter depths and whether we're reusing existing slates or laying fresh concrete tiles, which is why Colm checks the roof pitches in 15 minutes. Would Thursday morning at 10:30 or Friday at 2:00 suit for him to pop up?", time: "09:51 AM" }]);
          setChatInteractionStep(0); 
        }, 1500);
      } else if (replyId === "C") {
        setTimeout(() => {
          setIsTyping(false);
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "Emma", text: "No problem at all John, thanks for letting me know! If you ever need structural repairs or timber framing down the road, you have my direct desk line.", time: "09:51 AM" }]);
        }, 1500);
      }
    } else {
      if (replyId === "ActiveLeak") {
        setTimeout(() => {
          setIsTyping(false);
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "Emma", text: "Understood, let's get that secured. What is your Eircode, and could you text back a quick photo of the ceiling or roofline from outside?", time: "09:51 AM" }]);
        }, 1500);
      } else if (replyId === "SendEircode") {
        setTimeout(() => {
          setIsTyping(false);
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "Emma", text: "Got it. Photo OCR verified: Valley gutter damage flagged. Colm has been dispatched for emergency tarping. ETA 45 mins.", time: "09:52 AM" }]);
          setTriageDispatched(true);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          playSound('ding');
          setChatMessages(prev => [...prev, { sender: "Emma", text: "Understood. Please let us know your Eircode and we'll have an estimator reach out shortly.", time: "09:51 AM" }]);
        }, 1500);
      }
    }
  };

  const handleFunnelSubmit = () => {
    setFunnelStep(4);
    setTimeout(() => {
      setPhoneMode('sms');
      setSmsScenario('B');
      setFunnelStep(1); // reset for next time
    }, 3500);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 relative">
      
      {/* Sticky Header */}
      <header className="flex-none bg-zinc-950 border-b border-zinc-800/80 py-2 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <Home className="text-zinc-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Gleason Roofing & Carpentry <span className="text-zinc-500 font-normal">| AI Sales & Operations OS |</span> 
              <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium"><ShieldCheck className="w-3.5 h-3.5"/> SafePass & CIRI Verified</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: 'cockpit', label: 'Full Cockpit' },
            { id: 'reactivation', label: "'Dead' Quote Reactivation" },
            { id: 'triage', label: 'Speed-to-Lead & Triage' },
            { id: 'docs', label: 'Docs & Regs Chaser' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors border ${
                activeTab === tab.id && !isDocsDrawerOpen && tab.id !== 'docs'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                  : (isDocsDrawerOpen && tab.id === 'docs')
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-6">
        
        {/* Left Panel: Operations Hub (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* 1. Top KPI Summary Strip */}
          <div className="grid grid-cols-4 gap-3 shrink-0">
            <div className={`bg-zinc-900 border ${triageDispatched ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-zinc-800'} p-3 rounded-xl flex flex-col justify-center transition-all duration-500`}>
               <div className="text-[9px] text-amber-500 font-bold tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> SPEED-TO-LEAD RESPONSE</div>
               <div className="text-xl font-mono text-white mb-0.5">{triageDispatched ? '32 Seconds' : '38 Seconds'}</div>
               <div className="text-[10px] text-zinc-500 leading-tight">Missed Call -&gt; SMS Handshake</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-center">
               <div className="text-[9px] text-blue-400 font-bold tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> ESTIMATOR BENCH TIME SAVED</div>
               <div className="text-xl font-mono text-white mb-0.5">16.5 Hrs/Wk</div>
               <div className="text-[10px] text-zinc-500 leading-tight">Zero unviable site surveys</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-center">
               <div className="text-[9px] text-emerald-500 font-bold tracking-wider mb-1 flex items-center gap-1"><Star className="w-3 h-3"/> GOOGLE REPUTATION ENGINE</div>
               <div className="text-xl font-mono text-white mb-0.5">10 Reviews <span className="text-xs text-zinc-400 font-sans">(4.5 ★)</span></div>
               <div className="text-[9px] text-amber-500 font-medium mb-1">Stagnant (Last review: 7 yrs ago) -&gt; Projected +24 this Qtr</div>
               <div className="text-[9px] text-zinc-500 leading-tight">Automated 48h post-job WhatsApp trigger active</div>
            </div>
            <div className="bg-zinc-900 border border-emerald-500/40 p-3 rounded-xl relative overflow-hidden flex flex-col justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 blur-xl rounded-full"></div>
               <div className="text-[9px] text-emerald-400 font-bold tracking-wider mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> UNCLAIMED PIPELINE VALUE</div>
               <div className="text-xl font-mono text-emerald-400 mb-0.5 transition-all duration-300">€{totalPipeline.toLocaleString()}</div>
               <div className="text-[10px] text-emerald-500/70 leading-tight">Wired to recovery engine</div>
            </div>
          </div>

          {/* 2. Automated Quote Reactivation Engine */}
          <div className={`bg-zinc-900 border ${activeTab === 'reactivation' ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-zinc-800'} rounded-xl p-4 shrink-0 transition-all duration-500`}>
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
                <Bot className="w-3 h-3"/> DATABASE RECOVERY ENGINE (ZERO AD SPEND)
              </div>
              <button onClick={() => handleTabClick('reactivation')} className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors border border-zinc-700">
                View Emma SMS AI <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
            
            <div className="flex items-center gap-6 mb-5">
              <div className="flex-1">
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-semibold text-zinc-300">Dormant Quote Archive (Past 6–18 Months)</label>
                   <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{sliderValue} Quotes</span>
                 </div>
                 <input 
                   type="range" min="20" max="300" 
                   value={sliderValue} 
                   onChange={(e) => setSliderValue(parseInt(e.target.value))}
                   className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
              <div className="w-px h-10 bg-zinc-800"></div>
              <div className="flex gap-6 shrink-0">
                 <div>
                   <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Re-engagement Benchmark</div>
                   <div className="text-lg font-mono text-zinc-200">22%</div>
                 </div>
                 <div>
                   <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Estimated Pipeline Addition</div>
                   <div className="text-lg font-mono text-emerald-400">€{basePipeline.toLocaleString()}</div>
                 </div>
              </div>
            </div>

            {/* Kanban */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Initial Outreach", count: sliderValue, color: "border-zinc-700/50" },
                { name: "Lead Responded", count: Math.round(sliderValue * 0.44), color: "border-blue-500/30" },
                { name: "Scope Qualified", count: Math.round(sliderValue * 0.32), color: "border-amber-500/30" },
                { name: "Survey Dispatched", count: bookedSurveys + (showSurveyCard ? 1 : 0), color: "border-emerald-500/50", highlight: showSurveyCard }
              ].map((stage, i) => (
                <div key={i} className={`bg-zinc-950 border ${stage.color} rounded-lg p-2.5 relative transition-all duration-300 ${stage.highlight ? 'ring-1 ring-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`}>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{stage.name}</div>
                  <div className="text-xl font-mono text-zinc-100">{stage.count}</div>
                  {stage.highlight && (
                     <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-zinc-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg">
                       +1 NEW
                     </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. 24/7 Inbound Speed-to-Lead & Triage */}
          <div className={`bg-zinc-900 border ${activeTab === 'triage' ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-zinc-800/80'} rounded-xl p-4 shrink-0 transition-all duration-500`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold tracking-wider mb-2">
                  <Flame className="w-3 h-3"/> SPEED-TO-LEAD TRIAGE (&lt;60s)
                </div>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">Automated missed-call filter. Captures Eircode, verifies roof type, and filters out non-compliant attics (&lt;2.3m ridge clearance) before van dispatch.</p>
              </div>
              <button onClick={() => handleTabClick('triage')} className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors">
                Test Triage SMS <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className={`bg-zinc-950 border ${triageDispatched ? 'border-amber-500/40 bg-amber-500/5' : 'border-zinc-800/80'} p-2.5 rounded-lg flex items-center justify-between transition-colors`}>
                <div className="text-[11px] font-medium text-zinc-300">
                  <span className="text-zinc-100 font-semibold">Emergency Slate Leak - Celbridge</span> <span className="text-zinc-600 px-1">•</span> Photo OCR Verified <span className="text-zinc-600 px-1">•</span> {triageDispatched ? <span className="text-amber-400">Emergency Crew En Route</span> : "Callout Dispatched"}
                </div>
                {triageDispatched ? (
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">En Route</span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded">Verified</span>
                )}
              </div>
              <div className="bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div className="text-[11px] font-medium text-zinc-300">
                  <span className="text-zinc-100 font-semibold">Attic Conversion - Maynooth</span> <span className="text-zinc-600 px-1">•</span> Ridge Height 2.45m Confirmed <span className="text-zinc-600 px-1">•</span> Survey Queued
                </div>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold px-2 py-0.5 rounded">Qualified</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Panel: Mobile Simulator (5 cols) */}
        <div className="col-span-5 flex flex-col items-center h-full pb-4">
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-full max-w-[340px]">
            <button 
              onClick={() => setPhoneMode('funnel')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${phoneMode === 'funnel' ? 'bg-zinc-800 text-blue-400 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              1. Homeowner Funnel
            </button>
            <button 
              onClick={() => setPhoneMode('sms')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${phoneMode === 'sms' ? 'bg-zinc-800 text-blue-400 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              2. Sales SMS (Emma)
            </button>
          </div>

          {/* Phone Frame */}
          <div className="w-full max-w-[340px] flex-1 min-h-0 bg-zinc-950 rounded-[2.5rem] border-[6px] border-zinc-800 p-3 relative shadow-2xl flex flex-col ring-1 ring-white/10">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-800 rounded-b-2xl z-50"></div>
            
            <div className="flex-1 min-h-0 bg-white rounded-[1.8rem] overflow-hidden flex flex-col relative text-zinc-900 mt-1">
              
              {phoneMode === 'funnel' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col h-full bg-slate-50 relative">
                   {/* Header */}
                   <div className="bg-white px-4 pt-8 pb-3 shadow-sm z-10 flex items-center justify-between shrink-0">
                      <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center">
                        <Home className="text-white w-4 h-4"/>
                      </div>
                      <div className="font-bold text-xs text-slate-800">Instant Quote Engine</div>
                      <div className="w-7 text-[9px] font-semibold text-slate-400 text-right">
                        {funnelStep <= 3 && `${funnelStep}/3`}
                      </div>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                     <AnimatePresence mode="wait">
                       {funnelStep === 1 && (
                         <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                           <div className="text-lg font-bold text-slate-800 mb-6 leading-tight">What service do you need?</div>
                           <div className="grid grid-cols-1 gap-3">
                             {["Emergency Roof Leak", "Full Re-Roof (Slate / Tile)", "Attic Conversion", "Commercial Flat Roof"].map(type => (
                               <button 
                                 key={type} 
                                 onClick={() => { setJobType(type); setFunnelStep(2); }}
                                 className="p-4 text-sm font-semibold border-2 rounded-xl text-left transition-all bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:shadow-md"
                               >
                                 {type}
                               </button>
                             ))}
                           </div>
                         </motion.div>
                       )}

                       {funnelStep === 2 && (
                         <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                           <div className="text-lg font-bold text-slate-800 leading-tight">When do you need this completed?</div>
                           <div className="space-y-3">
                             {[
                               {id: 'immediate', label: 'Immediate Emergency (< 24 Hours)'},
                               {id: '2weeks', label: 'Within 2-4 Weeks'},
                               {id: 'planning', label: 'Planning / Budgeting Phase'}
                             ].map(opt => (
                               <label key={opt.id} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${urgency === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                                 <input type="radio" name="urgency" value={opt.id} checked={urgency === opt.id} onChange={() => setUrgency(opt.id)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                 <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                               </label>
                             ))}
                           </div>
                           
                           {jobType === "Attic Conversion" && (
                             <div className="pt-2">
                               <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Internal Ridge Height &gt; 2.3m?</div>
                               <select className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none bg-white font-medium" value={ridgeHeight} onChange={e => setRidgeHeight(e.target.value)}>
                                 <option value="" disabled>Select...</option>
                                 <option value="Yes">Yes</option>
                                 <option value="Not Sure">Not Sure</option>
                               </select>
                             </div>
                           )}
                         </motion.div>
                       )}

                       {funnelStep === 3 && (
                         <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-5">
                           <div className="text-lg font-bold text-slate-800 leading-tight">Where should we dispatch the assessment?</div>
                           
                           <div>
                             <div className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Eircode / Address</div>
                             <input type="text" placeholder="e.g. W91 Naas, Co. Kildare" value={eircode} onChange={e => setEircode(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none font-medium" />
                           </div>

                           <div>
                             <div className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</div>
                             <input type="text" placeholder="John Doe" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none font-medium" />
                           </div>

                           <div>
                             <div className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Mobile Phone Number</div>
                             <input type="tel" placeholder="08X XXX XXXX" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none font-medium" />
                           </div>
                         </motion.div>
                       )}

                       {funnelStep === 4 && (
                         <motion.div key="step4" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-10">
                           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                             <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                           </div>
                           <h3 className="text-lg font-bold text-slate-800">Assessment Request Dispatched!</h3>
                           <p className="text-sm text-slate-600 leading-relaxed px-2">Emma has triggered an instant WhatsApp handshake to collect damage photos and confirm your time slot.</p>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>

                   {/* Footer Actions */}
                   {funnelStep > 1 && funnelStep < 4 && (
                     <div className="shrink-0 p-4 bg-white border-t border-slate-100 flex gap-2">
                       <button onClick={() => setFunnelStep(prev => prev - 1)} className="px-4 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors">
                         Back
                       </button>
                       {funnelStep === 2 ? (
                         <button onClick={() => setFunnelStep(3)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                           Continue to Location & Contact <ArrowRight className="w-3.5 h-3.5"/>
                         </button>
                       ) : (
                         <button onClick={handleFunnelSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                           Request Free Site Assessment <ArrowRight className="w-3.5 h-3.5"/>
                         </button>
                       )}
                     </div>
                   )}
                </motion.div>
              )}

              {phoneMode === 'sms' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col h-full bg-[#f4f4f5]">
                  {/* iOS SMS Header */}
                  <div className="bg-[#f4f4f5]/90 pt-8 pb-2 px-3 flex items-center justify-between border-b border-zinc-200/80 backdrop-blur-md z-10 shrink-0">
                     <div className="flex items-center gap-0.5 text-blue-500">
                       <ChevronLeft className="w-5 h-5"/>
                       <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-b from-zinc-400 to-zinc-500 shadow-sm">
                         E
                       </div>
                     </div>
                     <div className="flex flex-col items-center flex-1">
                       <div className="text-xs font-semibold flex items-center gap-1 text-black">
                         Emma (Office Desk) <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
                       </div>
                       <div className="text-[9px] text-zinc-500 font-medium">Gleason Direct Line</div>
                     </div>
                     <div className="w-10"></div>
                  </div>

                  {/* Chat Thread Container */}
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col pb-4 custom-scrollbar">
                     <div className="text-[9px] text-center text-zinc-400 font-bold mb-2 mt-auto">Today 09:41 AM</div>
                     
                     <AnimatePresence initial={false}>
                       {chatMessages.map((msg, i) => (
                         <motion.div 
                           key={i}
                           initial={{ opacity: 0, y: 10, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           transition={{ duration: 0.2 }}
                         >
                           {msg.sender === "System" ? (
                             <div className="text-[10px] text-center text-zinc-600 font-medium my-3 bg-zinc-200/60 py-1 px-3 rounded-full w-fit mx-auto shadow-sm border border-zinc-300/30">
                               {msg.text}
                             </div>
                           ) : (
                             <div className={`flex ${msg.sender === "Customer" ? 'justify-end' : 'justify-start'} mb-1`}>
                               <div className={`px-3 py-2 max-w-[85%] rounded-2xl text-[13px] leading-relaxed shadow-sm ${
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
                         <div className="bg-[#E9E9EB] px-3 py-2.5 rounded-2xl rounded-bl-sm w-12 flex justify-center gap-1 border border-black/5 shadow-sm">
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                         </div>
                       </motion.div>
                     )}
                     
                     <div ref={messagesEndRef} className="h-1 shrink-0" />
                  </div>

                  {/* Pinned Action Chips Tray */}
                  <div className="shrink-0 border-t border-zinc-300/50 bg-[#f4f4f5]/90 backdrop-blur-md px-3 pt-2 pb-6 z-20">
                     {chatInteractionStep === 0 && !isTyping ? (
                       <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-1.5">
                         {smsScenario === "A" ? (
                           <>
                             <button onClick={() => handleSmsReply("A", "Thursday at 10:30 AM suits.")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "Thursday at 10:30 AM suits."
                             </button>
                             <button onClick={() => handleSmsReply("B", "Roughly what are you charging per sq metre now?")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "Roughly what are you charging per sq metre now?"
                             </button>
                             <button onClick={() => handleSmsReply("C", "Already got it sorted, thanks.")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "Already got it sorted, thanks."
                             </button>
                           </>
                         ) : (
                           <>
                             <button onClick={() => handleSmsReply("ActiveLeak", "Active leak coming through ceiling")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "Active leak coming through ceiling"
                             </button>
                             <button onClick={() => handleSmsReply("ReRoof", "Looking for a full re-roof quote")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "Looking for a full re-roof quote"
                             </button>
                             <button onClick={() => handleSmsReply("General", "General enquiry")} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs py-2 px-3 rounded-lg border border-zinc-700 transition">
                               "General enquiry"
                             </button>
                           </>
                         )}
                       </motion.div>
                     ) : chatInteractionStep === 1 && smsScenario === "B" && !triageDispatched && !isTyping ? (
                       <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex justify-center pb-1">
                         <button onClick={() => handleSmsReply("SendEircode", "W91 K2X7 (Naas)")} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition">
                           <MapPin className="w-4 h-4" /> Tap to Send: W91 K2X7 (Naas)
                         </button>
                       </motion.div>
                     ) : (
                       <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2 bg-white border border-zinc-300 rounded-full py-1.5 px-2 mb-1">
                          <div className="text-zinc-400 text-xs flex-1 ml-2 font-medium">iMessage</div>
                          <div className="w-6 h-6 bg-[#007AFF] rounded-full flex items-center justify-center shadow-sm">
                            <ArrowRight className="w-3 h-3 text-white" />
                          </div>
                       </motion.div>
                     )}
                     {/* Home Indicator visual mock */}
                     <div className="w-24 h-1 bg-zinc-300 rounded-full mx-auto mt-4"></div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Docs & Regs Chaser Drawer Overlay */}
      <AnimatePresence>
        {isDocsDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDocsDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[450px] max-w-full bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-purple-400">
                  <FileText className="w-5 h-5"/>
                  <h2 className="font-bold text-sm tracking-wide">Docs & Regs Chaser</h2>
                </div>
                <button onClick={() => setIsDocsDrawerOpen(false)} className="text-zinc-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                  {[
                    { title: "Emergency Slate Repair - Celbridge", desc: "Roof Pitch & Valley leak photo verified via AI OCR", status: "Verified", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { title: "Full Attic Conversion - Maynooth", desc: "Ridge height confirmed at 2.45m; truss alteration flagged", status: "Qualified", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Natural Slate Re-Roof - Clane", desc: "SEAI Home Energy Grant pre-check queued", status: "Ready", color: "text-amber-400", bg: "bg-amber-400/10" },
                    { title: "Commercial Torch-on Felt - Naas", desc: "48hr Drone/Photo survey report generated for estimator", status: "Actioned", color: "text-purple-400", bg: "bg-purple-400/10" }
                  ].map((card, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                      <div className="mb-3">
                         <div className="text-sm font-bold text-zinc-200 mb-1">{card.title}</div>
                         <div className="text-xs text-zinc-500 leading-relaxed">{card.desc}</div>
                      </div>
                      <div className="self-start">
                         <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${card.bg} ${card.color}`}>{card.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Global Style overrides for hiding native scrollbars on custom-scrollbar classes */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}

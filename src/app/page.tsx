"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Home, AlertTriangle, Factory, MapPin, Calendar, CheckCircle2,
  Clock, Zap, Smartphone, Bot, MessageSquare, ArrowRight,
  UploadCloud, LayoutDashboard, PhoneCall, TrendingUp, DollarSign,
  ShieldCheck, FileText, Check, ChevronRight, Activity, History
} from "lucide-react";

type PropertyType = "Residential Reroof" | "Commercial Cladding" | "Storm Damage / Leak" | "Industrial Gutters";
type Urgency = "Active Water Ingress" | "Within 14 Days" | "Planning / Budgeting";

interface FeedItem {
  id: number;
  type: string;
  price: number;
  time: string;
  tag: string;
}

export default function RoofingDemo() {
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [eventProgress, setEventProgress] = useState(0);

  const [pipelineValue, setPipelineValue] = useState(124500);
  const [recoveredQuotes, setRecoveredQuotes] = useState(8);
  
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: 1, type: "Commercial Warehouse Cladding", price: 62000, time: "2 hrs ago", tag: "commercial" },
    { id: 2, type: "Full 4-Bed Residential Reroof", price: 14500, time: "3 hrs ago", tag: "residential" },
    { id: 3, type: "Emergency Slate Repair", price: 1800, time: "5 hrs ago", tag: "emergency" },
  ]);

  // For number animation
  const prevPipelineValue = useRef(pipelineValue);

  const propertyTypes = [
    { name: "Residential Reroof", icon: Home },
    { name: "Commercial Cladding", icon: Building2 },
    { name: "Storm Damage / Leak", icon: AlertTriangle },
    { name: "Industrial Gutters", icon: Factory },
  ];

  const urgencies = [
    "Active Water Ingress", 
    "Within 14 Days", 
    "Planning / Budgeting"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyType || !address || !urgency) return;
    
    setIsSubmitted(true);
    setEventProgress(0);
    
    setTimeout(() => setEventProgress(1), 800);
    setTimeout(() => setEventProgress(2), 1400);
    setTimeout(() => setEventProgress(3), 2100);
    setTimeout(() => setEventProgress(4), 4500);
    setTimeout(() => {
      setEventProgress(5);
      
      const newPrice = propertyType === "Commercial Cladding" ? 45000 : 
                       propertyType === "Storm Damage / Leak" ? 1200 : 
                       propertyType === "Industrial Gutters" ? 3500 : 12500;
                       
      prevPipelineValue.current = pipelineValue;
      setPipelineValue(prev => prev + newPrice);
      
      setFeed(prev => [{
        id: Date.now(),
        type: `${propertyType} - ${address}`,
        price: newPrice,
        time: "Just now",
        tag: "new"
      }, ...prev]);
      
    }, 5200);
  };

  const logs = [
    { time: "0.8s", title: "Webhook Received", desc: "Lead row logged to PostgreSQL via Drizzle ORM.", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/20" },
    { time: "1.4s", title: "AI Qualification", desc: `Model parsed urgency: Qualified as "${propertyType}".`, icon: Bot, color: "text-purple-400", bg: "bg-purple-500/20" },
    { time: "2.1s", title: "Automated Outreach", desc: `Twilio SMS sent to ${address}: "Hi, Liam here... reply 1 or 2 to confirm survey."`, icon: Smartphone, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { time: "4.5s", title: "Prospect Reply", desc: `"2 works perfect."`, icon: MessageSquare, color: "text-zinc-300", bg: "bg-zinc-700" },
    { time: "5.2s", title: "Survey Dispatched", desc: "Site survey locked into Estimator Van 3 calendar.", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/20" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">TradeOS <span className="text-slate-500 font-normal">Command Center</span></h1>
            <p className="text-sm text-slate-400">Live Roofing & Cladding Demo Environment</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Intake Simulation */}
        <div className="space-y-6">
          <div className="mb-2">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Customer Instant Intake & Triage Simulation
            </h2>
            <p className="text-sm text-slate-400 mt-1">Homeowner / Commercial Intake Flow (&lt;60s Latency)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Form */}
            <form onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-500 ${isSubmitted ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
              
              {/* 1. Property Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">1. Select Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map(pt => (
                    <button
                      key={pt.name}
                      type="button"
                      onClick={() => setPropertyType(pt.name as PropertyType)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        propertyType === pt.name 
                          ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <pt.icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium text-center">{pt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Address */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">2. Property Location (Eircode / Address)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. D04 V4X7"
                    className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                  {address.length > 3 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                      <Check className="w-3 h-3" /> Validated
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Urgency */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">3. Timeline & Urgency</label>
                <div className="flex flex-wrap gap-2">
                  {urgencies.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u as Urgency)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        urgency === u
                          ? u.includes("Emergency") || u.includes("Active")
                            ? "bg-red-500/10 border-red-500 text-red-400"
                            : "bg-blue-500/10 border-blue-500 text-blue-400"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">4. Attach Site Photos (Optional)</label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/50 hover:border-slate-600 transition-all cursor-pointer">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-sm">Drag & drop photos or click to browse</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!propertyType || !address || !urgency}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                Submit Quote & Request Site Survey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Live Event Log Overlay */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm p-6 flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                    Live Workflow Engine Processing...
                  </h3>
                  
                  <div className="space-y-5 flex-1 overflow-y-auto pr-2">
                    {logs.map((log, index) => (
                      <AnimatePresence key={index}>
                        {eventProgress > index && (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4 relative"
                          >
                            {index !== logs.length - 1 && (
                              <div className="absolute left-5 top-10 bottom-[-20px] w-[2px] bg-slate-800" />
                            )}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${log.bg}`}>
                              <log.icon className={`w-5 h-5 ${log.color}`} />
                            </div>
                            <div className="bg-slate-800/80 rounded-xl p-4 flex-1 border border-slate-700/50 shadow-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-semibold ${log.color}`}>{log.title}</span>
                                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">{log.time}</span>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">{log.desc}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>
                  
                  {eventProgress >= 5 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 pt-4 border-t border-slate-700/50 flex justify-center"
                    >
                      <button 
                        onClick={() => { setIsSubmitted(false); setEventProgress(0); }}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Run Another Simulation
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: TradeOS Dashboard */}
        <div className="space-y-6">
          <div className="mb-2">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Operational TradeOS Command Center
            </h2>
            <p className="text-sm text-slate-400 mt-1">Live metrics and automated dispatch feed</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              key={pipelineValue}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/10" />
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Protected Pipeline</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                €{pipelineValue.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Active Month Value
              </div>
            </motion.div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Speed-to-Lead</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">42 Sec</div>
              </div>
              <div className="text-xs font-medium bg-emerald-500/10 text-emerald-400 py-1 px-2 rounded w-fit">
                40% conversion boost vs 4hr delay
              </div>
            </div>
            
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
               <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <History className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Unworked Quotes Recovered</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-white">
                    {recoveredQuotes} <span className="text-lg font-normal text-slate-500">Active Quotes</span>
                  </div>
                  <div className="text-sm font-medium text-blue-400">
                    Worth €58,000
                  </div>
                </div>
            </div>
          </div>

          {/* Live Dispatch Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Live Survey Dispatch Feed</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              <AnimatePresence initial={false}>
                {feed.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`p-4 rounded-xl border ${item.tag === 'new' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-slate-800/50 border-slate-700'} transition-colors`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        item.tag === 'new' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.tag === 'new' ? 'JUST IN' : item.time}
                      </span>
                      <span className="text-sm font-semibold text-white">€{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-3">{item.type}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className="text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Dispatch Estimator
                      </button>
                      <button className="text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> AI Call Transcript
                      </button>
                      <button className="text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Quote Follow-Up
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quote Follow-Up Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
             <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-500" />
                Quote Follow-Up Engine (48h/14d Cadence)
             </h3>
             <div className="space-y-4">
                {[
                  { name: "O'Connor Commercial (Unit 4)", status: "Day 2 Follow-Up Sent via WhatsApp", prog: "w-[15%]" },
                  { name: "Dalkey Residential - 12A", status: "Day 7 SMS Sequence Active", prog: "w-[50%]" },
                  { name: "Apex Logistics Hub", status: "Day 14 Final Email + SMS Sent", prog: "w-[100%]" }
                ].map((q, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-medium">{q.name}</span>
                      <span className="text-xs text-slate-500">{q.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-blue-500 ${q.prog} rounded-full`}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

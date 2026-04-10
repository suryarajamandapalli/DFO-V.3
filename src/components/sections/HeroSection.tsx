import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Activity, ArrowRight, ChevronLeft, ChevronRight, LayoutDashboard, Brain } from 'lucide-react';

const slides = [
  {
    tag: "Clinical OS v2.0 Platform",
    title: "Intelligence Beyond Support.",
    subtitle: "Digital Front Office",
    desc: "Automated intake flows, real-time risk telemetry, and unified role-based command for modern parenthood care clinics.",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070&auto=format&fit=crop",
    stat: "100% SLA Compliance"
  },
  {
    tag: "Real-time Telemetry",
    title: "Precision Clinical Insight.",
    subtitle: "Sentiment-BERT Engine",
    desc: "Identify critical high-risk cases instantly with our hybrid AI engine designed for obstetric precision and medical safety.",
    image: "https://images.unsplash.com/photo-1551288049-bbdac8a28a80?q=80&w=2070&auto=format&fit=crop",
    stat: "1.2ms Inference Latency"
  }
];

export function HeroSection({ onEnterDashboard }: { onEnterDashboard: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-white clinical-grid">
      {/* Dynamic Background Overlays */}
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-sky-50/30 via-white to-white -z-10" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-sky-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-content-${current}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_oklch(0.708_0.15_240)] animate-pulse" />
                  <span>{slides[current].tag}</span>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-sky-500 text-[11px] font-black uppercase tracking-[0.4em] ml-1">{slides[current].subtitle}</p>
                  <h1 className="text-6xl sm:text-7xl xl:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter">
                    {slides[current].title.split(' ').map((word, i) => (
                      <span key={i} className={word.toLowerCase() === 'intelligence' || word.toLowerCase() === 'precision' ? 'text-glow-sky' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </h1>
                </div>

                <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl font-medium leading-relaxed tracking-tight border-l-2 border-slate-100 pl-6">
                  {slides[current].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button
                size="lg"
                onClick={onEnterDashboard}
                className="w-full sm:w-auto h-16 px-10 bg-slate-950 hover:bg-sky-600 text-white shadow-2xl rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group"
              >
                Launch Clinical Dashboard
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center gap-3">
                 <button onClick={prevSlide} className="h-14 w-14 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center group">
                    <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                 </button>
                 <button onClick={nextSlide} className="h-14 w-14 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center group">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                 </button>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-16 bg-slate-950' : 'w-6 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-image-${current}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white aspect-[4/3]">
                  <img
                    src={slides[current].image}
                    alt={slides[current].title}
                    className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                  {/* UI Overlay Element */}
                  <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-xl px-6 py-4 rounded-xl border border-white/40 shadow-2xl flex items-center gap-4">
                    <Brain className="w-6 h-6 text-sky-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest leading-none mb-1">Live Telemetry</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{slides[current].stat}</span>
                    </div>
                  </div>
                </div>

                {/* Floating Context Card */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-10 -left-10 bg-slate-950 p-6 rounded-2xl shadow-2xl border border-white/10 hidden xl:flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shadow-inner">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm tracking-tight uppercase">Protocol Delta</p>
                    <p className="text-sky-400 text-[9px] font-black tracking-widest uppercase">Verified System</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

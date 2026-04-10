import { Card } from './LandingCard';
import { HeartPulse, Shield, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutSection() {
  const features = [
    {
      title: "Intelligent Triage",
      desc: "Continuous support powered by clinical intelligence that provides immediate, localized guidance and filters high-risk queries in real-time.",
      icon: MessageCircle,
      delay: 0.1
    },
    {
      title: "Verified Connections",
      desc: "More than just an AI. We bridge the critical gap between patients and medical professionals when urgency or empathy is required.",
      icon: HeartPulse,
      delay: 0.2
    },
    {
      title: "Language Agnostic",
      desc: "Care beyond barriers. Our platform interprets intent and emotion across diverse linguistic landscapes to ensure inclusivity.",
      icon: Shield,
      delay: 0.3
    }
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mb-20 md:mb-28">
          <div className="w-full lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mission Statement</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-[0.95]"
            >
              The Intelligence Layer for <br /> <span className="text-slate-200">Clinical Operations.</span>
            </motion.h2>
          </div>
          <div className="w-full lg:w-2/5 lg:pt-16">
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed border-l-4 border-sky-500/20 pl-8 py-2">
              JanmaSethu is not just a portal—it's a clinical OS. We elevate healthcare providers with the tools to manage 10x the patient volume without sacrificing care quality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i} delay={f.delay} className="group hover:bg-slate-950 transition-all duration-700 py-12 px-10 border-slate-100 shadow-premium">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-10 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-sky-400">
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-6 group-hover:text-white transition-colors tracking-tight">{f.title}</h3>
              <p className="text-[15px] text-slate-500 mb-10 font-medium leading-[1.7] group-hover:text-slate-400 transition-colors">
                {f.desc}
              </p>
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 group-hover:text-sky-400 transition-all hover:gap-5">
                Learn Methodology <ArrowRight className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

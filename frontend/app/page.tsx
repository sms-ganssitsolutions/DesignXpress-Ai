'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { 
  Play, Sparkles, Video, Mic, Image as ImageIcon, 
  Users, Zap, ArrowRight, Star 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#8B5CF6] transition-colors">Features</a>
            <a href="#studio" className="hover:text-[#8B5CF6] transition-colors">Studio</a>
            <Link href="/templates" className="hover:text-[#8B5CF6] transition-colors">Templates</Link>
            <Link href="/login" className="text-white/70 hover:text-white">Log in</Link>
            <Link 
              href="/register" 
              className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium"
            >
              Start Creating Free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative pt-20 pb-24 px-8">
        <div className="max-w-5xl mx-auto text-center pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span className="text-sm tracking-wide">Now in Public Beta</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-semibold tracking-[-4.5px] leading-[0.92] mb-6">
            Where Innovation<br />Meets Excellence
          </h1>
          
          <p className="text-2xl text-white/70 max-w-2xl mx-auto mb-10 tracking-[-0.3px]">
            The most advanced AI Story Video Studio.<br />
            Create cinematic films in minutes, not months.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="btn-primary px-10 py-4 rounded-2xl text-lg font-medium flex items-center gap-3 group"
            >
              Start Creating Free
              <ArrowRight className="group-hover:translate-x-0.5 transition" />
            </Link>
            <Link 
              href="#studio" 
              className="btn-secondary px-8 py-4 rounded-2xl text-lg font-medium flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Watch 1:42 demo
            </Link>
          </div>
          <p className="text-xs text-white/40 mt-4">No credit card required • 14-day Pro trial</p>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-[#8B5CF6] rounded-full blur-[120px] opacity-20 -z-10" />
        <div className="absolute top-60 right-1/4 w-[420px] h-[420px] bg-[#F97316] rounded-full blur-[100px] opacity-20 -z-10" />
      </div>

      {/* TRUST BAR */}
      <div className="border-y border-white/10 py-5">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-x-16 opacity-60 text-sm tracking-[2px]">
          <div>RUNWAY</div><div>ADOBE</div><div>OPENAI</div><div>ELEVENLABS</div><div>STABILITY AI</div>
        </div>
      </div>

      {/* AI DASHBOARD PREVIEW */}
      <div id="studio" className="max-w-6xl mx-auto px-8 pt-24 pb-20">
        <div className="text-center mb-10">
          <div className="text-[#F97316] text-sm tracking-[3px] mb-3">INTRODUCING</div>
          <h2 className="text-6xl font-semibold tracking-[-2.5px]">The Future of Storytelling</h2>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="aspect-video bg-[#111117] flex items-center justify-center relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
                <Play className="w-9 h-9 text-white ml-1" />
              </div>
              <p className="text-2xl text-white/60">Interactive Studio Preview</p>
            </div>
            
            {/* Fake UI overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            <div className="absolute top-6 left-6">
              <Logo size="sm" withText />
            </div>
            <div className="absolute bottom-8 right-8 text-right">
              <div className="text-sm text-white/50">NEON REQUIEM • 2:14 / 4:58</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="bg-[#111117] py-20 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="text-[#8B5CF6] text-sm tracking-[4px] mb-3">POWERED BY THE BEST MODELS</div>
            <h3 className="text-5xl font-semibold tracking-[-2px]">Everything you need to tell stories</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "AI Script & Story Generator", desc: "From a single prompt to complete cinematic narratives with perfect structure." },
              { icon: Video, title: "AI Scene Builder", desc: "Generate beautiful scenes, shots, and transitions automatically." },
              { icon: Mic, title: "ElevenLabs Voiceovers", desc: "Studio-quality voice acting in 30+ languages with emotional control." },
              { icon: ImageIcon, title: "AI Thumbnails & Art", desc: "Generate scroll-stopping visuals with Stability AI and DALL·E 3." },
              { icon: Zap, title: "Smart Subtitles & Captions", desc: "Auto-synced, beautifully designed subtitles that match your brand." },
              { icon: Users, title: "Real-time Collaboration", desc: "Work with your team live. Comments, versions, and approvals built-in." },
            ].map((f, i) => (
              <div key={i} className="floating-card glass rounded-3xl p-8 group">
                <f.icon className="w-9 h-9 text-[#8B5CF6] mb-6" />
                <h4 className="text-2xl tracking-[-1px] font-semibold mb-3">{f.title}</h4>
                <p className="text-white/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="max-w-5xl mx-auto px-8 py-24">
        <div className="text-center mb-12">
          <h3 className="text-5xl font-semibold tracking-[-2px] mb-4">Simple, transparent pricing</h3>
          <p className="text-xl text-white/60">Start free. Scale as you create.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Creator", price: "0", features: ["10 AI generations/mo", "720p exports", "Basic voiceovers", "Community support"], cta: "Start Free" },
            { name: "Pro", price: "29", popular: true, features: ["Unlimited generations", "4K exports", "Premium voices + music", "Priority rendering", "Team collaboration"], cta: "Start 14-day Trial" },
            { name: "Studio", price: "79", features: ["Everything in Pro", "Custom brand models", "Unlimited team seats", "API access", "Dedicated support"], cta: "Contact Sales" },
          ].map((plan, idx) => (
            <div key={idx} className={`rounded-3xl p-8 border flex flex-col ${plan.popular ? 'border-[#8B5CF6] scale-[1.02] neon-purple' : 'border-white/10 glass'}`}>
              {plan.popular && <div className="text-xs tracking-[2px] text-[#8B5CF6] mb-2">MOST POPULAR</div>}
              <div className="text-3xl font-semibold">{plan.name}</div>
              <div className="mt-6 mb-8">
                <span className="text-6xl font-semibold tracking-tighter">${plan.price}</span>
                <span className="text-white/50">/mo</span>
              </div>
              <ul className="space-y-3 text-sm mb-10 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <Star className="w-4 h-4 mt-0.5 text-[#F97316] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} text-center py-3.5 rounded-2xl font-medium block`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="bg-[#111117] border-t border-white/10 py-20">
        <div className="max-w-2xl mx-auto text-center px-8">
          <h3 className="text-6xl font-semibold tracking-[-2.5px] leading-none mb-6">
            Ready to create<br />your next masterpiece?
          </h3>
          <p className="text-xl text-white/60 mb-9">Join thousands of filmmakers, creators, and studios already using DesignXpress AI.</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-3 px-14 py-4 rounded-2xl text-lg">
            Get started for free <ArrowRight />
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-sm text-white/40">
        <div className="max-w-6xl mx-auto px-8 flex justify-between">
          <div>© {new Date().getFullYear()} DesignXpress AI. All rights reserved.</div>
          <div>Where Innovation Meets Excellence</div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

const templates = [
  { id: 't1', title: 'Neon Noir', category: 'Cinematic', desc: 'Dark cyberpunk thriller style' },
  { id: 't2', title: 'Emotional Documentary', category: 'Documentary', desc: 'Heartfelt storytelling' },
  { id: 't3', title: 'Brand Launch', category: 'Commercial', desc: 'Premium product reveal' },
  { id: 't4', title: 'Horror Short', category: 'Genre', desc: 'Atmospheric tension' },
  { id: 't5', title: 'Corporate Vision', category: 'Corporate', desc: 'Inspirational company film' },
  { id: 't6', title: 'Music Video', category: 'Music', desc: 'Stylized performance piece' },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <Logo size="md" href="/dashboard" />
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">← Back to Projects</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-6xl font-semibold tracking-[-2.5px] mb-2">Templates</h1>
        <p className="text-white/60 text-xl mb-10">Start from beautiful AI-optimized cinematic templates</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => (
            <div key={t.id} className="glass rounded-3xl p-8 group hover:border-[#8B5CF6]/60 border border-white/10 transition-all">
              <div className="uppercase tracking-[2px] text-xs text-[#F97316] mb-3">{t.category}</div>
              <h3 className="text-3xl font-semibold tracking-tight mb-3 group-hover:text-[#8B5CF6]">{t.title}</h3>
              <p className="text-white/60 mb-8">{t.desc}</p>
              
              <Link href="/studio" className="btn-primary inline-block px-8 py-3 rounded-2xl text-sm">
                Use This Template
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

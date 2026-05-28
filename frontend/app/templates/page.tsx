'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function PublicTemplatesMarketplace() {
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/templates/public')
      .then(res => setTemplates(res.data.templates || []))
      .catch(() => {
        // Fallback demo data
        setTemplates([
          { id: 'pub1', title: 'Neon Requiem', category: 'Cinematic', author: 'Alex Rivera', likes: 1243, description: 'Cyberpunk short film about memory and loss' },
          { id: 'pub2', title: 'The Last Signal', category: 'Sci-Fi', author: 'Maya Chen', likes: 892, description: 'Emotional story of first contact' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = templates.filter((t: any) => 
    t.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Logo size="md" href="/" />
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
            <Link href="/studio" className="btn-primary px-6 py-2 rounded-xl text-sm">Open Studio</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-[#F97316] tracking-[4px] text-sm mb-2">COMMUNITY</div>
          <h1 className="text-7xl font-semibold tracking-[-3px] mb-4">Templates Marketplace</h1>
          <p className="text-2xl text-white/60">Discover and remix cinematic stories from creators worldwide</p>
        </div>

        <input 
          type="text" 
          placeholder="Search templates..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md mx-auto block mb-10 bg-black/40 border border-white/20 rounded-2xl px-6 py-3 text-lg focus:border-[#8B5CF6] outline-none"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center text-white/50 py-12">Loading community templates...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-3 text-center text-white/50 py-12">No templates found. Be the first to publish one from the Studio!</div>
          ) : (
            filtered.map((t: any) => (
              <div key={t.id} className="glass rounded-3xl p-8 group hover:border-[#8B5CF6]/50 border border-white/10 transition">
                <div className="flex justify-between mb-4">
                  <div className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70">{t.category || 'Cinematic'}</div>
                  <div className="text-xs text-white/50">by {t.author || 'Community'}</div>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight mb-3 group-hover:text-[#8B5CF6]">{t.title}</h3>
                <p className="text-white/70 mb-6 line-clamp-2">{t.description || 'Beautiful AI-generated cinematic template.'}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/50">❤️ {(t.usageCount || t.likes || 0).toLocaleString()}</div>
                  <Link href={`/studio?template=${t.id}`} className="btn-primary px-6 py-2 rounded-2xl text-sm">Use Template</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12 text-white/50 text-sm">
          Want to publish your own? Open any project in the Studio and click "Publish as Template".
        </div>
      </div>
    </div>
  );
}

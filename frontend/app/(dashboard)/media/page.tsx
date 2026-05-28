'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Upload, Search, Folder } from 'lucide-react';

export default function MediaLibrary() {
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState('All');

  const folders = ['All', 'Video', 'Images', 'Audio', 'Music'];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        type: f.type,
        folder: f.type.startsWith('video') ? 'Video' : f.type.startsWith('image') ? 'Images' : 'Audio',
        uploadedAt: new Date().toISOString(),
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const filteredFiles = files
    .filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeFolder === 'All' || f.folder === activeFolder)
    );

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <Logo size="md" href="/dashboard" />
          <Link href="/dashboard" className="text-sm text-white/60">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-6xl font-semibold tracking-[-2.5px]">Media Library</h1>
            <p className="text-white/60 text-xl">Organize and attach assets to your scenes</p>
          </div>
          <label className="btn-primary px-8 py-3 rounded-2xl cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Media
            <input type="file" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="flex gap-4 mb-6">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`px-5 py-2 rounded-2xl text-sm flex items-center gap-2 transition ${activeFolder === folder ? 'bg-[#8B5CF6] text-white' : 'glass'}`}
            >
              <Folder className="w-4 h-4" /> {folder}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-3.5 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-2xl pl-11 py-3 text-sm focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-8 min-h-[420px]">
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-6 opacity-30">📁</div>
              <p className="text-white/60 max-w-xs">No assets yet. Upload videos, images, or audio to start building your scenes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((f, i) => (
                <div key={i} className="bg-[#1A1A22] rounded-2xl p-4 text-sm hover:border-[#8B5CF6]/50 border border-white/10 transition">
                  <div className="font-medium truncate mb-1">{f.name}</div>
                  <div className="text-white/50 text-xs">{f.size} • {f.folder}</div>
                  <div className="text-[10px] text-white/40 mt-2">Ready to attach</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

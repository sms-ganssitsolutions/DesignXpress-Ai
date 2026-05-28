'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Upload } from 'lucide-react';

export default function MediaLibrary() {
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        type: f.type,
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <Logo size="md" href="/dashboard" />
          <Link href="/dashboard" className="text-sm text-white/60">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-6xl font-semibold tracking-[-2.5px]">Media Library</h1>
            <p className="text-white/60 text-xl">Your assets for AI video projects</p>
          </div>
          <label className="btn-primary px-8 py-3 rounded-2xl cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Media
            <input type="file" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="glass rounded-3xl p-8 min-h-[420px]">
          {files.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-6 opacity-30">📁</div>
              <p className="text-white/60 max-w-xs">Upload images, video clips, audio, and music to use across your projects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((f, i) => (
                <div key={i} className="bg-[#1A1A22] rounded-2xl p-5 text-sm">
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="text-white/50 text-xs mt-1">{f.size}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

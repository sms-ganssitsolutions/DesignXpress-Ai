'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { projectsAPI } from '@/lib/api';
import { Plus } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  updatedAt?: string;
  _count?: { scenes: number; assets: number };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dx_token');
    if (!token) {
      router.push('/login');
      return;
    }
    const userData = localStorage.getItem('dx_user');
    if (userData) setUser(JSON.parse(userData));

    // Fetch real projects
    projectsAPI.list()
      .then(res => {
        setProjects(res.data.projects || []);
      })
      .catch(() => {
        // Fallback to demo data if backend not running
        setProjects([
          { id: 'demo-1', title: 'Neon Requiem', status: 'draft', description: 'A cyberpunk short film about memory' },
          { id: 'demo-2', title: 'The Last Transmission', status: 'processing', description: 'Sci-fi documentary series' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dx_token');
    localStorage.removeItem('dx_user');
    router.push('/');
  };

  const handleNewProject = async () => {
    try {
      const res = await projectsAPI.create({
        title: "Untitled Story",
        description: "New AI-generated project",
      });
      router.push(`/studio?project=${res.data.project.id}`);
    } catch {
      // Fallback
      router.push('/studio');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Logo size="md" href="/dashboard" />
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/60">Welcome back, <span className="text-white">{user?.name?.split(' ')[0] || 'Creator'}</span></div>
            <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5">Log out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[#F97316] text-xs tracking-[3px] mb-2">YOUR STUDIO</div>
            <h1 className="text-6xl font-semibold tracking-[-2.5px]">Projects</h1>
          </div>

          <div className="flex gap-3">
            <Link href="/templates" className="btn-secondary px-6 py-3.5 rounded-2xl text-sm">Browse Templates</Link>
            <button 
              onClick={handleNewProject}
              className="btn-primary flex items-center gap-3 px-8 py-3.5 rounded-2xl text-base"
            >
              <Plus className="w-5 h-5" /> New AI Project
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/50">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link 
                key={index} 
                href={`/studio?project=${project.id}`}
                className="group floating-card glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 block"
              >
                <div className="aspect-video bg-[#1A1A22] relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-40">🎬</div>
                    <div className="text-xs tracking-[2px] text-white/40">OPEN IN STUDIO</div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] bg-black/60 backdrop-blur text-white/80">
                    {project.status?.toUpperCase() || 'DRAFT'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-2xl tracking-[-1px] mb-1.5 group-hover:text-[#8B5CF6] transition-colors">{project.title}</h3>
                  <p className="text-white/60 line-clamp-2 text-sm">{project.description || 'AI-powered story project'}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/50 mt-6">
                    <div>{project._count?.scenes || 0} scenes</div>
                    <div>{project._count?.assets || 0} assets</div>
                  </div>
                </div>
              </Link>
            ))}

            <button 
              onClick={handleNewProject}
              className="group border-2 border-dashed border-white/15 hover:border-[#8B5CF6]/60 rounded-3xl flex flex-col items-center justify-center min-h-[280px] transition-all hover:bg-white/[0.015]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-[#8B5CF6]/20 transition">
                <Plus className="w-7 h-7 text-[#8B5CF6]" />
              </div>
              <div className="font-medium text-xl">Start a new project</div>
              <div className="text-sm text-white/50 mt-1">AI will help you build it</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('dx_token', 'demo-token-2026');
      localStorage.setItem('dx_user', JSON.stringify({
        id: 'new-user',
        name: form.name || 'New Creator',
        email: form.email,
      }));
      router.push('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Logo size="lg" href="/" />
        </div>

        <div className="glass rounded-3xl p-10">
          <h1 className="text-4xl font-semibold tracking-[-1.5px] mb-2 text-center">Create your account</h1>
          <p className="text-white/60 text-center mb-8">Start making cinematic stories today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs tracking-[1.5px] text-white/50 block mb-2">FULL NAME</label>
              <input 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-[#8B5CF6]" 
                required 
              />
            </div>
            <div>
              <label className="text-xs tracking-[1.5px] text-white/50 block mb-2">EMAIL</label>
              <input 
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-[#8B5CF6]" 
                required 
              />
            </div>
            <div>
              <label className="text-xs tracking-[1.5px] text-white/50 block mb-2">PASSWORD</label>
              <input 
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-[#8B5CF6]" 
                minLength={6}
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-lg font-medium mt-3 disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-white/60">
            Already have an account? <Link href="/login" className="text-[#8B5CF6]">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@designxpress.ai');
  const [password, setPassword] = useState('demo123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication for local development
    // In production this would call /api/auth/login
    setTimeout(() => {
      if (email && password.length >= 6) {
        localStorage.setItem('dx_token', 'demo-token-2026');
        localStorage.setItem('dx_user', JSON.stringify({
          id: 'demo-user',
          name: 'Alex Rivera',
          email,
        }));
        router.push('/dashboard');
      } else {
        setError('Please enter valid credentials');
      }
      setLoading(false);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Logo size="lg" href="/" />
        </div>

        <div className="glass rounded-3xl p-10">
          <h1 className="text-4xl font-semibold tracking-[-1.5px] mb-2 text-center">Welcome back</h1>
          <p className="text-white/60 text-center mb-8">Sign in to continue creating</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs tracking-[1.5px] text-white/50 block mb-2">EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-[#8B5CF6]" 
                required 
              />
            </div>
            
            <div>
              <label className="text-xs tracking-[1.5px] text-white/50 block mb-2">PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-[#8B5CF6]" 
                required 
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-lg font-medium disabled:opacity-70 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-white/60">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#8B5CF6] hover:underline">Create one for free</Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-8">
          Demo account pre-filled. Use any password 6+ characters.
        </p>
      </div>
    </div>
  );
}

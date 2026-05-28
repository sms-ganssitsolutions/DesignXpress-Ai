'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <Logo size="md" href="/dashboard" />
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">← Back</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-6xl font-semibold tracking-[-2.5px] mb-2">Settings</h1>
        <p className="text-white/60 text-xl mb-10">Manage your DesignXpress AI experience</p>

        <div className="space-y-8">
          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-6">Account</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <div>Name</div>
                <div className="text-white/60">Alex Rivera</div>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <div>Email</div>
                <div className="text-white/60">demo@designxpress.ai</div>
              </div>
              <div className="flex justify-between">
                <div>Plan</div>
                <div className="text-[#8B5CF6]">Studio (Beta)</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-6">AI Preferences</h3>
            <div className="text-sm text-white/70 space-y-2">
              <div>• Default voice: Rachel (ElevenLabs)</div>
              <div>• Image model: Stable Diffusion XL</div>
              <div>• Video quality: 4K • 24fps</div>
            </div>
            <p className="text-xs text-white/40 mt-6">More AI settings coming in v0.4</p>
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-4">Danger Zone</h3>
            <button className="text-red-400 hover:text-red-500 text-sm">Delete all projects and data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

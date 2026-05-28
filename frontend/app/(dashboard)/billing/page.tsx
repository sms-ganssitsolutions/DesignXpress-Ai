'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

const plans = [
  { 
    name: "Creator", 
    price: "0", 
    current: true,
    features: ["10 AI generations/mo", "720p exports", "Basic voices"] 
  },
  { 
    name: "Pro", 
    price: "29", 
    popular: true,
    features: ["Unlimited generations", "4K exports", "Premium voices + music", "Priority rendering"] 
  },
  { 
    name: "Studio", 
    price: "79", 
    features: ["Everything in Pro", "Custom brand models", "Unlimited team", "API access"] 
  },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="glass border-b border-white/10 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <Logo size="md" href="/dashboard" />
          <Link href="/dashboard" className="text-sm text-white/60">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-6xl font-semibold tracking-[-2.5px] mb-2">Billing &amp; Plans</h1>
        <p className="text-white/60 text-xl mb-10">Manage your subscription and usage</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-3xl p-8 border ${plan.current ? 'border-[#8B5CF6]' : plan.popular ? 'border-[#F97316] scale-[1.02]' : 'border-white/10 glass'}`}>
              {plan.popular && <div className="text-xs text-[#F97316] tracking-widest mb-2">MOST POPULAR</div>}
              <div className="text-3xl font-semibold">{plan.name}</div>
              <div className="mt-6 mb-8">
                <span className="text-6xl font-semibold tracking-tighter">${plan.price}</span>
                <span className="text-white/50">/mo</span>
              </div>
              <ul className="space-y-2 text-sm mb-8 text-white/80">
                {plan.features.map((f, idx) => <li key={idx}>• {f}</li>)}
              </ul>
              <button 
                disabled={plan.current}
                className={`w-full py-3 rounded-2xl text-sm font-medium ${plan.current ? 'bg-white/10 cursor-default' : 'btn-primary'}`}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-8 text-sm">
          <div className="font-medium mb-3">Usage This Month</div>
          <div className="text-white/70">42 / 100 AI generations used • 3 video exports</div>
          <div className="text-xs text-white/40 mt-4">Billing history and invoices coming in v0.6</div>
        </div>
      </div>
    </div>
  );
}

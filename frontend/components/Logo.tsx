'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  href?: string;
}

export default function Logo({ size = 'md', withText = true, href = '/' }: LogoProps) {
  const sizes = {
    sm: { img: 28, text: 'text-xl' },
    md: { img: 36, text: 'text-2xl' },
    lg: { img: 52, text: 'text-4xl' },
  };

  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-3 group">
      <div className="relative">
        <Image
          src="/designxpress-logo.png"
          alt="DesignXpress AI"
          width={s.img}
          height={s.img}
          className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
        />
      </div>
      {withText && (
        <div>
          <div className={`${s.text} font-semibold tracking-[-1.5px] text-white`}>
            DesignXpress
          </div>
          <div className="text-[10px] text-[#F97316] -mt-1.5 tracking-[3px] font-medium">
            AI STUDIO
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

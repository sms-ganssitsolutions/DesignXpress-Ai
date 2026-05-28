import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DesignXpress AI | Story Video Studio",
  description: "Where Innovation Meets Excellence. Create cinematic AI-powered stories and videos with professional-grade tools.",
  icons: {
    icon: "/designxpress-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0A0A0F] text-white">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "ENCORE — Living Digital City",
  description: "The entire live music scene inside one interactive digital world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#030B29]">
        <div className="encore-ambient" aria-hidden>
          <div className="encore-orb w-[42vw] h-[42vw] bg-[#00D8FF]/40 -top-[12vw] left-[8vw]" />
          <div className="encore-orb w-[36vw] h-[36vw] bg-[#5A68FF]/40 bottom-[-10vw] right-[-6vw]" style={{ animationDelay: "-6s" }} />
          <div className="encore-orb w-[28vw] h-[28vw] bg-[#0076FF]/40 bottom-[4vh] left-[-8vw]" style={{ animationDelay: "-11s" }} />
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="encore-particle"
              style={{
                left: `${(i * 53) % 100}%`,
                bottom: `${(i * 29) % 40}%`,
                animationDuration: `${7 + (i % 6)}s`,
                animationDelay: `${(i * 0.9) % 7}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}

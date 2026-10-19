"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Building2, CalendarDays, Compass, Map, Menu, Music2, UserRound, X } from "lucide-react";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/venues", label: "Venues" },
  { href: "/artists", label: "Artists" },
  { href: "/discover?when=Tonight", label: "Tonight" },
  { href: "/for-business", label: "For Business" },
];

const mobileLinks = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/discover?view=map", label: "Map", icon: Map },
  { href: "/discover?when=Tonight", label: "Gigs", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/account", label: "Profile", icon: UserRound },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand" aria-label="ENCORE home" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Music2 size={18} aria-hidden /></span>
          <span>ENCORE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? "active" : ""}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <label className="nav-city"><span className="sr-only">Choose city</span><select defaultValue="Kuala Lumpur" onChange={(event) => router.push(`/discover?city=${encodeURIComponent(event.target.value)}`)}><option>Kuala Lumpur</option><option>Petaling Jaya</option><option>Johor Bahru</option><option>Singapore</option></select></label>
          <Link href="/account" className="account-link">Account</Link>
          <Link href="/venue/register" className="button button-small"><Building2 size={15} /> List Your Venue</Link>
          <button className="mobile-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav container" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/account" onClick={() => setOpen(false)}><UserRound size={16} /> Login / Account</Link>
          <Link href="/venue/register" onClick={() => setOpen(false)}><Building2 size={16} /> List Your Venue</Link>
        </nav>
      )}
      <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
        {mobileLinks.map(({ href, label, icon: Icon }) => <Link key={label} href={href} className={!href.includes("?") && pathname === href ? "active" : ""}><Icon size={19} /><span>{label}</span></Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand"><span className="brand-mark"><Music2 size={18} /></span><span>ENCORE</span></Link>
          <p>Live music, made easier to find.</p>
          <span className="demo-label">Sample listings are clearly marked</span>
        </div>
        <div className="footer-links">
          <Link href="/discover">Discover tonight</Link>
          <Link href="/artist/register">Join as an artist</Link>
          <Link href="/venue/register">List your venue</Link>
          <Link href="/for-business">For Business</Link>
        </div>
      </div>
    </footer>
  );
}

export function DemoPill({ children = "Sample listing" }: { children?: React.ReactNode }) {
  return <span className="demo-pill">{children}</span>;
}


import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Music2, UsersRound } from "lucide-react";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "For Business", description: "Give your live music programme a home on ENCORE." };

export default function ForBusinessPage() {
  return <><SiteHeader/><main>
    <section className="page-hero"><div className="container"><DemoPill>Business preview</DemoPill><p className="eyebrow">For venues and bookers</p><h1>Make your live programme discoverable.</h1><p>Create a polished venue profile, publish a weekly schedule and give customers one reliable place to plan their night.</p><div className="hero-actions"><Link className="button" href="/venue/register">List Your Venue <ArrowRight size={16}/></Link><Link className="button button-ghost" href="/venue/dashboard">View sample dashboard</Link></div></div></section>
    <section className="section container"><div className="steps-grid"><div><Building2/><span>01</span><h3>Build your profile</h3><p>Showcase the room, atmosphere, menu, access details and location.</p></div><div><CalendarDays/><span>02</span><h3>Publish your programme</h3><p>Keep upcoming performances visible and easy to scan.</p></div><div><UsersRound/><span>03</span><h3>Connect with artists</h3><p>Review sample enquiries and coordinate availability.</p></div><div><Music2/><span>04</span><h3>Grow the scene</h3><p>Help more listeners find the right room for the right night.</p></div></div></section>
  </main><SiteFooter/></>;
}

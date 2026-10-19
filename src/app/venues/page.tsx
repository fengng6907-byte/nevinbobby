import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VenueMiniCard } from "@/components/Cards";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { gigs, venues } from "@/data/demo";

export const metadata: Metadata = { title: "Live Music Venues", description: "Browse live music bars and venues across Malaysia and Singapore." };

export default function VenuesPage() {
  return <><SiteHeader/><main>
    <section className="page-hero"><div className="container"><DemoPill/><p className="eyebrow">Rooms worth leaving home for</p><h1>Venues with a point of view.</h1><p>Browse sample live-music rooms by city, mood and sound, then check the published schedule before you go.</p></div></section>
    <section className="section container"><div className="section-head"><div><p className="eyebrow">Malaysia · Singapore</p><h2>All venues</h2></div><Link href="/discover" className="text-link">Open filters <ArrowRight size={16}/></Link></div>
      <div className="venue-directory">{venues.map((venue)=>{const next=gigs.find((gig)=>gig.venueSlug===venue.slug);return <VenueMiniCard key={venue.slug} {...venue} upcoming={next?`${next.day} · ${next.time}`:undefined}/>})}</div>
    </section>
  </main><SiteFooter/></>;
}

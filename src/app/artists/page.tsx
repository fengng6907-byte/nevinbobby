import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArtistMiniCard } from "@/components/Cards";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { artists } from "@/data/demo";

export const metadata: Metadata = { title: "Live Bands & Artists", description: "Discover live bands and artists across Malaysia and Singapore." };

export default function ArtistsPage() {
  return <><SiteHeader/><main>
    <section className="page-hero"><div className="container"><DemoPill/><p className="eyebrow">The region in rotation</p><h1>Meet the artists shaping the night.</h1><p>Explore sample profiles, languages, genres and published performances across Malaysia and Singapore.</p></div></section>
    <section className="section container"><div className="section-head"><div><p className="eyebrow">Featured profiles</p><h2>Artists on ENCORE</h2></div><Link href="/artist/register" className="text-link">Join as an artist <ArrowRight size={16}/></Link></div>
      <div className="artist-list">{artists.map((artist)=><ArtistMiniCard key={artist.slug} slug={artist.slug} name={artist.name} city={artist.city} image={artist.image} genres={artist.genre}/>)}</div>
    </section>
  </main><SiteFooter/></>;
}

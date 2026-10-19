import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Languages, Music2, Share2, UsersRound } from "lucide-react";
import EnquiryCard from "@/components/EnquiryCard";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { artists, getArtist, getVenue, gigs } from "@/data/demo";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return artists.map(({slug})=>({slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const artist=getArtist((await params).slug);return artist?{title:artist.name,description:`Sample artist portfolio for ${artist.name}.`,robots:{index:false,follow:true}}:{title:"Artist not found"}}
export default async function ArtistPage({params}:Props){const artist=getArtist((await params).slug);if(!artist)notFound();const schedule=gigs.filter(g=>g.artistSlug===artist.slug);return <><SiteHeader/><main>
  <section className="detail-hero artist-cover"><Image src={artist.image} alt={`${artist.name} sample cover image`} fill priority sizes="100vw" className="cover-image"/><div className="hero-overlay"/><div className="container detail-hero-copy artist-hero-copy"><div className="artist-portrait"><Image src={artist.image} alt={`${artist.name} sample portrait`} fill sizes="180px" className="cover-image"/></div><div><DemoPill>Sample artist</DemoPill><h1>{artist.name}</h1><p>{artist.genre.join(" · ")} · {artist.city}</p><div className="tag-row"><span className="tag"><Languages size={13} style={{display:"inline"}}/> {artist.languages.join(" · ")}</span><button className="tag" type="button"><Share2 size={13} style={{display:"inline"}}/> Share profile</button></div></div></div></section>
  <div className="container detail-grid"><div>
    <section className="detail-section"><p className="eyebrow">Artist biography</p><h2>A sound for the hours after dark.</h2><p>{artist.bio}</p></section>
    <section className="detail-section"><p className="eyebrow">The band</p><h2>Meet the members</h2><div className="amenity-grid">{artist.members.map(m=><span key={m}><UsersRound size={14} style={{display:"inline"}}/> {m}</span>)}</div></section>
    <section className="detail-section"><p className="eyebrow">Video showcase</p><h2>Performance reel</h2><div className="scenario-box" style={{minHeight:340,display:"grid",placeItems:"center",textAlign:"center"}}><div><span className="round-arrow" style={{margin:"0 auto 18px"}}>▶</span><strong>Demo performance reel</strong><p>Media upload and playback surface. No fabricated external video is embedded.</p></div></div></section>
    <section className="detail-section"><p className="eyebrow">Upcoming performances</p><h2>See them live</h2>{schedule.map(g=>{const venue=getVenue(g.venueSlug)!;return <div className="schedule-row" key={g.slug}><div><strong>{g.day}</strong><small>{g.date}</small></div><div><strong><Link href={`/venues/${venue.slug}`}>{venue.name}</Link></strong><small>{venue.city} · {g.cover}</small></div><Link className="text-link" href={`/gigs/${g.slug}`}><CalendarDays size={14}/>{g.time}</Link></div>})}</section>
    <section className="detail-section"><p className="eyebrow">Past performances</p><h2>The archive</h2><div className="empty-inline"><Music2 size={20}/><div><strong>No verified past gigs published yet.</strong><p>Past performances will appear here after venue and artist records are connected.</p></div></div></section>
    <section className="detail-section"><p className="eyebrow">Availability & socials</p><h2>{artist.availability}</h2><div className="social-row"><span className="tag" aria-disabled="true"><Share2 size={14}/> Instagram</span><span className="tag" aria-disabled="true"><Share2 size={14}/> YouTube</span><span className="tag" aria-disabled="true"><Music2 size={14}/> Spotify</span></div><p>Sample social labels are intentionally not linked to real accounts.</p></section>
  </div><EnquiryCard kind="booking"/></div>
  </main><SiteFooter/></>}

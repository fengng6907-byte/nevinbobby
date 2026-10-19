import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ExternalLink, MapPin, Music2 } from "lucide-react";
import EnquiryCard from "@/components/EnquiryCard";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { artists, getArtist, getVenue, gigs, venues } from "@/data/demo";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return venues.map(({slug})=>({slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const venue=getVenue((await params).slug);return venue?{title:venue.name,description:`Sample venue profile for ${venue.name} in ${venue.city}.`,robots:{index:false,follow:true}}:{title:"Venue not found"}}
export default async function VenuePage({params}:Props){const venue=getVenue((await params).slug);if(!venue)notFound();const schedule=gigs.filter(g=>g.venueSlug===venue.slug);return <><SiteHeader/><main>
  <section className="detail-hero"><Image src={venue.image} alt={`${venue.name} sample venue cover`} fill priority sizes="100vw" className="cover-image"/><div className="hero-overlay"/><div className="container detail-hero-copy"><DemoPill>Sample venue</DemoPill><h1>{venue.name}</h1><p><MapPin size={17}/>{venue.district}, {venue.city} · {venue.category}</p></div></section>
  <div className="container detail-grid"><div>
    <section className="detail-section"><p className="eyebrow">About the venue</p><h2>A room built around the music.</h2><p>{venue.description}</p><div className="tag-row">{venue.genres.map(g=><span className="tag" key={g}><Music2 size={12} style={{display:"inline"}}/> {g}</span>)}</div></section>
    <section className="detail-section"><p className="eyebrow">Gallery</p><h2>See the room before you arrive.</h2><div className="detail-gallery">{[venue.image,"/images/violet-hour-band.png","/images/encore-hero.png"].map((image,index)=><div key={`${image}-${index}`}><Image src={image} alt={`${venue.name} sample gallery view ${index+1}`} fill sizes="(max-width: 640px) 92vw, 360px" className="cover-image"/></div>)}</div></section>
    <section className="detail-section"><p className="eyebrow">Upcoming performances</p><h2>Live-band schedule</h2>{schedule.length?schedule.map(g=>{const artist=getArtist(g.artistSlug)!;return <div className="schedule-row" key={g.slug}><div><strong>{g.day}</strong><small>{g.date}</small></div><div><strong><Link href={`/artists/${artist.slug}`}>{artist.name}</Link></strong><small>{artist.genre.join(" · ")} · {g.language}</small></div><Link className="text-link" href={`/gigs/${g.slug}`}>{g.time}</Link></div>}):<p>No published demo performances for this venue yet.</p>}</section>
    <section className="detail-section"><p className="eyebrow">Before you go</p><h2>Venue details</h2><div className="amenity-grid">{venue.amenities.map(a=><span key={a}>{a}</span>)}</div><p><Clock3 size={15} style={{display:"inline"}}/> {venue.hours}</p><p>{venue.price}</p><p>{venue.transport}</p></section>
    <section className="detail-section"><p className="eyebrow">Menu & house notes</p><h2>A useful preview, not a promise.</h2><p>Illustrative menu: small plates, sharing mains and a concise drinks list. Prices and availability would be maintained by a verified venue owner in the production product.</p><div className="notice warning">Demo menu and venue details are fictional. No real establishment is represented.</div></section>
    <section className="detail-section"><p className="eyebrow">Location</p><h2>{venue.address}</h2><p>{venue.transport}</p><a className="text-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}>Open directions <ExternalLink size={15}/></a></section>
  </div><EnquiryCard/></div>
  <section className="section section-soft"><div className="container"><p className="eyebrow">Artists for this room</p><h2 style={{marginBottom:30}}>Discover the line-up</h2><div className="artist-list">{artists.slice(0,2).map(a=><Link className="artist-mini-card" href={`/artists/${a.slug}`} key={a.slug}><div className="artist-thumb"><Image src={a.image} alt="Fictional artist artwork" fill sizes="88px" className="cover-image"/></div><div><span className="eyebrow">Demo artist</span><h3>{a.name}</h3><p>{a.genre.join(" · ")}</p></div></Link>)}</div></div></section>
  </main><SiteFooter/></>}

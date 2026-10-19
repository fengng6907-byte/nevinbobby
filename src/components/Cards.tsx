import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Music2 } from "lucide-react";
import { DemoGig, getGigDetails } from "@/data/demo";
import { DemoPill } from "./SiteChrome";

export function GigCard({ gig, priority = false }: { gig: DemoGig; priority?: boolean }) {
  const details = getGigDetails(gig);
  return (
    <article className="gig-card">
      <Link href={`/venues/${details.venue.slug}`} className="card-image-wrap" aria-label={`View ${details.venue.name}`}>
        <Image src={details.venue.image} alt="Fictional live-music venue demonstration artwork" fill sizes="(max-width: 720px) 88vw, 380px" priority={priority} className="cover-image" />
        <div className="image-shade" />
        <div className="card-image-meta"><DemoPill /> <span>{gig.cover}</span></div>
      </Link>
      <div className="card-body">
        <div className="eyebrow">{gig.day} · {gig.time}</div>
        <h3><Link href={`/gigs/${gig.slug}`}>{details.artist.name}</Link></h3>
        <p className="muted"><MapPin size={15} /> {details.venue.name} · {details.venue.district}</p>
        <div className="tag-row">{details.artist.genre.map((genre) => <span className="tag" key={genre}>{genre}</span>)}</div>
        <div className="card-actions">
          <span><Clock3 size={15} /> {gig.time}–{gig.endTime}</span>
          <Link href={`/gigs/${gig.slug}`} aria-label={`View ${details.artist.name} performance`}><ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </article>
  );
}

export function VenueMiniCard({ slug, name, city, district, image, genres, upcoming }: { slug: string; name: string; city: string; district: string; image: string; genres: string[]; upcoming?: string }) {
  return (
    <Link href={`/venues/${slug}`} className="venue-mini-card">
      <Image src={image} alt="Fictional venue demonstration artwork" fill sizes="(max-width: 720px) 88vw, 320px" className="cover-image" />
      <div className="image-shade" />
      <div className="venue-mini-copy">
        <DemoPill />
        <h3>{name}</h3>
        <p><MapPin size={14} /> {district}, {city}</p>
        <span>{genres.join(" · ")}</span>
        <strong className="venue-next">{upcoming || "Schedule coming soon"}</strong>
      </div>
    </Link>
  );
}

export function ArtistMiniCard({ slug, name, city, image, genres }: { slug: string; name: string; city: string; image: string; genres: string[] }) {
  return (
    <Link href={`/artists/${slug}`} className="artist-mini-card">
      <div className="artist-thumb"><Image src={image} alt="Fictional artist demonstration portrait" fill sizes="88px" className="cover-image" /></div>
      <div><span className="eyebrow">Featured artist · Demo</span><h3>{name}</h3><p>{genres.join(" · ")} · {city}</p></div>
      <span className="round-arrow"><Music2 size={18} /></span>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Building2, CalendarDays, ChevronRight, Compass, Headphones, MapPin, Mic2, Search, Sparkles } from "lucide-react";
import { artists, gigs, venues } from "@/data/demo";
import { ArtistMiniCard, GigCard, VenueMiniCard } from "./Cards";
import { DemoPill } from "./SiteChrome";

const genres = ["Jazz", "Indie soul", "Mandopop", "Acoustic", "Funk", "Pop"];

export default function HomeExperience() {
  const router = useRouter();
  const [city, setCity] = useState("Kuala Lumpur");
  const [query, setQuery] = useState("");
  const [when, setWhen] = useState("Tonight");
  const [genre, setGenre] = useState("All genres");

  function search(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ city, when });
    if (query.trim()) params.set("q", query.trim());
    if (genre !== "All genres") params.set("genre", genre);
    router.push(`/discover?${params.toString()}`);
  }

  return (
    <>
      <section className="hero">
        <Image src="/images/encore-hero.png" alt="Original editorial artwork of a fictional band performing at a Kuala Lumpur rooftop venue" fill loading="eager" sizes="100vw" className="hero-image" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <DemoPill>Curated sample listings</DemoPill>
          <p className="eyebrow light">Malaysia · Singapore</p>
          <h1>Find Your Music.<br /><em>Find Your Night.</em></h1>
          <p className="hero-copy">Discover the best live bands, bars and music venues across Malaysia and Singapore.</p>
          <form className="search-panel" onSubmit={search}>
            <label className="search-query"><span><Search size={15} /> Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artist, venue or genre" /></label>
            <label><span><MapPin size={15} /> City</span><select value={city} onChange={(event) => setCity(event.target.value)}><option>Kuala Lumpur</option><option>Petaling Jaya</option><option>Johor Bahru</option><option>Singapore</option></select></label>
            <label><span><CalendarDays size={15} /> Date</span><select value={when} onChange={(event) => setWhen(event.target.value)}><option>Tonight</option><option>Tomorrow</option><option>Weekend</option></select></label>
            <label><span><Headphones size={15} /> Genre</span><select value={genre} onChange={(event) => setGenre(event.target.value)}><option>All genres</option>{genres.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button className="button search-submit" type="submit">Explore <ArrowRight size={17} /></button>
          </form>
        </div>
        <div className="hero-caption">Original AI-generated demo artwork · No real venue or partnership implied</div>
      </section>

      <section className="section container">
        <div className="section-head"><div><p className="eyebrow">Tonight&apos;s edit</p><h2>Playing tonight</h2></div><Link href="/discover">View all <ArrowRight size={16} /></Link></div>
        <div className="card-grid">{gigs.slice(0, 3).map((gig, index) => <GigCard gig={gig} key={gig.slug} priority={index === 0} />)}</div>
      </section>

      <section className="section container">
        <div className="section-head"><div><p className="eyebrow">Curated rooms</p><h2>Popular venues</h2></div><span className="section-note">Fictional examples for product demonstration</span></div>
        <div className="venue-grid">{venues.slice(0, 3).map((venue) => { const next = gigs.find((gig) => gig.venueSlug === venue.slug); return <VenueMiniCard key={venue.slug} {...venue} upcoming={next ? `${next.day} · ${next.time}` : undefined} />; })}</div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="split-heading"><div><p className="eyebrow">Find your sound</p><h2>Discover by genre</h2></div><p>Start with the music, then find the right room around it.</p></div>
          <div className="genre-grid">{genres.map((genre, index) => <Link href={`/discover?genre=${encodeURIComponent(genre)}`} key={genre}><span>0{index + 1}</span><strong>{genre}</strong><ChevronRight size={18} /></Link>)}</div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><div><p className="eyebrow">On our radar</p><h2>Featured artists</h2></div><Link href="/artist/register">Join ENCORE <ArrowRight size={16} /></Link></div>
        <div className="artist-list">{artists.map((artist) => <ArtistMiniCard key={artist.slug} slug={artist.slug} name={artist.name} city={artist.city} image={artist.image} genres={artist.genre} />)}</div>
      </section>

      <section className="section container">
        <div className="city-feature">
          <div><p className="eyebrow light">Explore by city</p><h2>Four scenes.<br />One stage.</h2><p>From rooftop soul in Kuala Lumpur to close-up acoustic sets in Singapore, discover a night that sounds like you.</p><Link href="/my/kuala-lumpur/live-music" className="button button-light">Explore Kuala Lumpur</Link></div>
          <div className="city-list">{["Kuala Lumpur", "Petaling Jaya", "Johor Bahru", "Singapore"].map((item, index) => <Link href={item === "Singapore" ? "/sg/singapore/live-music" : `/discover?city=${encodeURIComponent(item)}`} key={item}><span>0{index + 1}</span>{item}<ArrowRight size={17} /></Link>)}</div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><div><p className="eyebrow">Plan the week</p><h2>Upcoming performances</h2></div><Link href="/discover?when=Weekend">See the full calendar <ArrowRight size={16} /></Link></div>
        <div className="card-grid">{gigs.slice(1, 4).map((gig) => <GigCard gig={gig} key={gig.slug} />)}</div>
      </section>

      <section className="section container">
        <div className="section-head"><div><p className="eyebrow">One connected marketplace</p><h2>How ENCORE works</h2></div></div>
        <div className="steps-grid">
          <div><Compass /><span>01</span><h3>Discover</h3><p>Customers find a performance by place, sound and time.</p></div>
          <div><Headphones /><span>02</span><h3>Connect</h3><p>Artists build a professional presence and reach new rooms.</p></div>
          <div><CalendarDays /><span>03</span><h3>Coordinate</h3><p>Venues publish schedules and manage enquiries in one place.</p></div>
          <div><Sparkles /><span>04</span><h3>Grow</h3><p>Build repeat audiences around a dependable live programme.</p></div>
        </div>
      </section>

      <section className="section container dual-cta">
        <div><Mic2 /><DemoPill /><h2>Make your next audience easier to find.</h2><p>Create a polished artist profile and publish where you&apos;re playing.</p><Link href="/artist/register" className="text-link">Join as an artist <ArrowRight size={16} /></Link></div>
        <div><Building2 /><DemoPill /><h2>Turn your live programme into a destination.</h2><p>List your venue, connect artists, and manage a weekly line-up.</p><Link href="/venue/register" className="text-link">List your venue <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Clock3, ExternalLink, Grid2X2, List, Map, MapPin, Music2 } from "lucide-react";
import { ArtistMiniCard, VenueMiniCard } from "@/components/Cards";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { artists, getGigDetails, gigs, venues } from "@/data/demo";

type ResultKind = "Performances" | "Venues" | "Artists";
type ViewMode = "split" | "list" | "map";

function DiscoverContent() {
  const params = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "All cities");
  const [genre, setGenre] = useState(params.get("genre") || "All genres");
  const [date, setDate] = useState(params.get("when") || "Any date");
  const [language, setLanguage] = useState("Any language");
  const [category, setCategory] = useState("Any venue");
  const [sort, setSort] = useState("Start time");
  const [kind, setKind] = useState<ResultKind>("Performances");
  const [view, setView] = useState<ViewMode>(params.get("view") === "map" ? "map" : "split");
  const [selected, setSelected] = useState(venues[0].slug);
  const q = (params.get("q") || "").toLowerCase();

  const performanceResults = useMemo(() => gigs.map(getGigDetails).filter((item) => {
    const cityMatch = city === "All cities" || item.venue.city === city;
    const genreMatch = genre === "All genres" || item.artist.genre.includes(genre) || item.venue.genres.includes(genre);
    const dateMatch = date === "Any date" || date === "Weekend" || item.day === date;
    const languageMatch = language === "Any language" || item.language.includes(language);
    const categoryMatch = category === "Any venue" || item.venue.category === category;
    const queryMatch = !q || `${item.artist.name} ${item.venue.name} ${item.artist.genre.join(" ")}`.toLowerCase().includes(q);
    return cityMatch && genreMatch && dateMatch && languageMatch && categoryMatch && queryMatch;
  }).sort((a, b) => sort === "Alphabetical" ? a.artist.name.localeCompare(b.artist.name) : a.time.localeCompare(b.time)), [city, genre, date, language, category, q, sort]);

  const venueResults = useMemo(() => venues.filter((venue) => {
    return (city === "All cities" || venue.city === city) &&
      (genre === "All genres" || venue.genres.includes(genre)) &&
      (category === "Any venue" || venue.category === category) &&
      (!q || `${venue.name} ${venue.district} ${venue.genres.join(" ")}`.toLowerCase().includes(q));
  }), [city, genre, category, q]);

  const artistResults = useMemo(() => artists.filter((artist) => {
    return (city === "All cities" || artist.city === city) &&
      (genre === "All genres" || artist.genre.includes(genre)) &&
      (language === "Any language" || artist.languages.includes(language)) &&
      (!q || `${artist.name} ${artist.genre.join(" ")}`.toLowerCase().includes(q));
  }), [city, genre, language, q]);

  const resultCount = kind === "Performances" ? performanceResults.length : kind === "Venues" ? venueResults.length : artistResults.length;

  function clearFilters() {
    setCity("All cities"); setGenre("All genres"); setDate("Any date"); setLanguage("Any language"); setCategory("Any venue");
  }

  return <><SiteHeader /><main>
    <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Discover</span></div><p className="eyebrow">Live music discovery</p><h1>Where should we go tonight?</h1><p>Browse sample venue, artist and performance listings across Malaysia and Singapore. Every sample is identified; schedules are not live feeds.</p></div></section>
    <div className="toolbar"><div className="container filter-row">
      <select className="filter-control" value={city} onChange={(e)=>setCity(e.target.value)} aria-label="City"><option>All cities</option><option>Kuala Lumpur</option><option>Petaling Jaya</option><option>Johor Bahru</option><option>Singapore</option></select>
      <select className="filter-control" value={date} onChange={(e)=>setDate(e.target.value)} aria-label="Date"><option>Any date</option><option>Tonight</option><option>Tomorrow</option><option>Weekend</option></select>
      <select className="filter-control" value={genre} onChange={(e)=>setGenre(e.target.value)} aria-label="Genre"><option>All genres</option><option>Jazz</option><option>Indie soul</option><option>Mandopop</option><option>Acoustic</option><option>Funk</option><option>Pop</option></select>
      <select className="filter-control" value={language} onChange={(e)=>setLanguage(e.target.value)} aria-label="Language"><option>Any language</option><option>English</option><option>Malay</option><option>Mandarin</option></select>
      <select className="filter-control" value={category} onChange={(e)=>setCategory(e.target.value)} aria-label="Venue category"><option>Any venue</option><option>Rooftop lounge</option><option>Listening bar</option><option>Restaurant &amp; music room</option><option>Cocktail bar</option></select>
      <select className="filter-control" value={sort} onChange={(e)=>setSort(e.target.value)} aria-label="Sort results"><option>Start time</option><option>Alphabetical</option></select>
    </div></div>
    <div className="container discover-controls">
      <div className="segmented-control" aria-label="Result type">{(["Performances", "Venues", "Artists"] as ResultKind[]).map((item)=><button key={item} className={kind===item?"active":""} onClick={()=>setKind(item)}>{item}</button>)}</div>
      <div className="segmented-control view-control" aria-label="Result view"><button className={view==="list"?"active":""} onClick={()=>setView("list")}><List size={15}/> List</button><button className={view==="split"?"active":""} onClick={()=>setView("split")}><Grid2X2 size={15}/> Split</button><button className={view==="map"?"active":""} onClick={()=>setView("map")}><Map size={15}/> Map</button></div>
    </div>
    <div className={`container discover-layout ${view}-view`}>
      <div className="discover-results"><div className="section-head compact"><div><p className="eyebrow">{resultCount} matches</p><h2>The shortlist</h2></div><DemoPill /></div>
        <div className={kind === "Performances" ? "result-list" : "directory-list"}>
          {kind === "Performances" && performanceResults.map((item)=><article className="result-card" key={item.slug} onMouseEnter={()=>setSelected(item.venue.slug)}><div className="result-image"><Image src={item.venue.image} alt={`${item.venue.name} sample venue`} fill sizes="220px" className="cover-image" /></div><div className="result-copy"><p className="eyebrow">{item.day} · {item.time}</p><h3><Link href={`/artists/${item.artist.slug}`}>{item.artist.name}</Link></h3><p><MapPin size={14}/>{item.venue.name} · {item.venue.district}</p><p><Music2 size={14}/>{item.artist.genre.join(" · ")} · {item.language}</p><div className="result-meta"><span className="tag"><Clock3 size={12}/> {item.time}–{item.endTime}</span><div className="result-actions"><Link href={`/venues/${item.venue.slug}`}>Venue</Link><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.venue.address)}`} target="_blank" rel="noreferrer">Directions <ExternalLink size={12}/></a></div></div></div></article>)}
          {kind === "Venues" && venueResults.map((venue)=>{const next=gigs.find((gig)=>gig.venueSlug===venue.slug);return <VenueMiniCard key={venue.slug} {...venue} upcoming={next?`${next.day} · ${next.time}`:undefined}/>})}
          {kind === "Artists" && artistResults.map((artist)=><ArtistMiniCard key={artist.slug} slug={artist.slug} name={artist.name} city={artist.city} image={artist.image} genres={artist.genre}/>)}
          {resultCount === 0 && <div className="panel"><h3>No sample listings match yet.</h3><p className="muted">Try clearing the filters to see the complete catalogue.</p><button className="button" onClick={clearFilters}>Clear filters</button></div>}
        </div>
      </div>
      <aside className="demo-map" aria-label="Sample map with illustrative positions"><div className="map-grid"/><div className="map-road"/><div className="map-label"><DemoPill>Map preview</DemoPill><span className="section-note">Illustrative positions</span></div>{venueResults.map((venue)=><button key={venue.slug} title={venue.name} onClick={()=>setSelected(venue.slug)} className="map-pin" style={{left:`${venue.coordinates.x}%`,top:`${venue.coordinates.y}%`,opacity:selected===venue.slug?1:.58}}><MapPin size={17}/></button>)}</aside>
    </div>
  </main><SiteFooter /></>;
}

export default function DiscoverPage() {
  return <Suspense fallback={<div className="page-hero"><div className="container"><p className="eyebrow">Loading discovery</p><h1>Finding tonight&apos;s music…</h1></div></div>}><DiscoverContent /></Suspense>;
}

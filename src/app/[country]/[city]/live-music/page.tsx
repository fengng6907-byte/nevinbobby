import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GigCard } from "@/components/Cards";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { gigs, getGigDetails } from "@/data/demo";
const pages=[{country:"my",city:"kuala-lumpur",label:"Kuala Lumpur"},{country:"sg",city:"singapore",label:"Singapore"}];
type Props={params:Promise<{country:string;city:string}>};
export function generateStaticParams(){return pages.map(({country,city})=>({country,city}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const p=await params;const page=pages.find(x=>x.country===p.country&&x.city===p.city);return page?{title:`Live music in ${page.label}`,description:`Discover live-music demonstration listings in ${page.label}.`,robots:{index:false,follow:true}}:{title:"City not found"}}
export default async function CityPage({params}:Props){const p=await params;const page=pages.find(x=>x.country===p.country&&x.city===p.city);if(!page)notFound();const list=gigs.filter(g=>getGigDetails(g).venue.city===page.label);return <><SiteHeader/><main><section className="page-hero"><div className="container"><DemoPill>Demo city guide · No real listings</DemoPill><p className="eyebrow" style={{marginTop:18}}>Explore the scene</p><h1>Live music in {page.label}</h1><p>A curated demonstration of how ENCORE can make tonight&apos;s programme searchable by city, sound and time.</p><Link className="button" href={`/discover?city=${encodeURIComponent(page.label)}`}>Filter this city <ArrowRight size={16}/></Link></div></section><section className="section container"><div className="card-grid">{list.map(g=><GigCard key={g.slug} gig={g}/>)}</div></section></main><SiteFooter/></>}

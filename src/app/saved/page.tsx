import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return <><SiteHeader/><main><section className="page-hero"><div className="container"><p className="eyebrow">Your shortlist</p><h1>Save the nights you want to remember.</h1><p>Saved listings will appear here once account persistence is connected.</p></div></section><section className="section container"><div className="empty-state"><Bookmark size={32}/><h2>No saved listings yet.</h2><p>Explore venues, artists and performances to build your shortlist.</p><Link className="button" href="/discover">Start discovering <ArrowRight size={16}/></Link></div></section></main><SiteFooter/></>;
}

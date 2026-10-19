import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Music2, UserRound } from "lucide-react";
import { DemoPill, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return <><SiteHeader/><main><section className="page-hero"><div className="container"><DemoPill>Account preview</DemoPill><p className="eyebrow">Your ENCORE</p><h1>Choose your workspace.</h1><p>Authentication is not configured in this repository. These sample workspaces demonstrate the intended artist and venue experiences without creating an account.</p></div></section>
    <section className="section container account-grid"><Link className="account-card" href="/artist/dashboard"><UserRound/><div><p className="eyebrow">Artist workspace</p><h2>Manage your profile and availability.</h2><span className="text-link">Open sample artist dashboard <ArrowRight size={16}/></span></div></Link><Link className="account-card" href="/venue/dashboard"><Building2/><div><p className="eyebrow">Venue workspace</p><h2>Publish schedules and manage enquiries.</h2><span className="text-link">Open sample venue dashboard <ArrowRight size={16}/></span></div></Link></section>
    <section className="container notice warning account-notice"><Music2 size={16}/> Login and saved-account data require an authentication and database integration that is not present in the source repository.</section>
  </main><SiteFooter/></>;
}

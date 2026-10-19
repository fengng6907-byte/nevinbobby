"use client";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export default function EnquiryCard({ kind = "reservation" }: { kind?: "reservation" | "booking" }) {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  return <aside className="sticky-card"><p className="eyebrow">{kind === "reservation" ? "Reservation enquiry" : "Performance enquiry"}</p><h3>{kind === "reservation" ? "Plan your night" : "Ask about availability"}</h3><p className="muted">This prototype sends a local demo enquiry only. It does not confirm a reservation or notify a business.</p>{sent ? <div className="notice"><strong>Enquiry drafted.</strong><br/>Status: Awaiting venue response. No message was sent externally.</div> : <form onSubmit={submit}><label className="field"><span>Date</span><input type="date" required defaultValue="2026-10-23" /></label><label className="field"><span>{kind === "reservation" ? "Party size" : "Event details"}</span>{kind === "reservation" ? <select defaultValue="2"><option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5+ guests</option></select> : <textarea required placeholder="Tell the artist about the room, date and set."/>}</label><label className="field"><span>Your name</span><input required placeholder="Name" /></label><button className="button" type="submit"><Send size={16}/> Send demo enquiry</button><div className="notice warning">Enquiries remain unconfirmed until the recipient responds.</div></form>}</aside>;
}

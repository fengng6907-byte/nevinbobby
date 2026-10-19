import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{const base=process.env.NEXT_PUBLIC_SITE_URL||"https://nevinbobby.vercel.app";return{rules:{userAgent:"*",allow:"/",disallow:["/account","/saved","/artist/dashboard","/venue/dashboard","/legacy"]},sitemap:`${base}/sitemap.xml`}}

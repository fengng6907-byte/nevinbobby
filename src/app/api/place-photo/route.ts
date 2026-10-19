import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  if (!ref || !apiKey) return new NextResponse(null, { status: 404 });
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("maxwidth", "800");
  url.searchParams.set("photo_reference", ref);
  url.searchParams.set("key", apiKey);
  const response = await fetch(url, { redirect: "follow", next: { revalidate: 86400 } });
  if (!response.ok) return new NextResponse(null, { status: 502 });
  return new NextResponse(response.body, { headers: { "Content-Type": response.headers.get("content-type") || "image/jpeg", "Cache-Control": "public, max-age=86400" } });
}

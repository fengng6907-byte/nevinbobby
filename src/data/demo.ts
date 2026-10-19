export type DemoArtist = {
  slug: string;
  name: string;
  city: string;
  country: "Malaysia" | "Singapore";
  genre: string[];
  languages: string[];
  bio: string;
  members: string[];
  image: string;
  availability: string;
};

export type DemoVenue = {
  slug: string;
  name: string;
  city: string;
  district: string;
  country: "Malaysia" | "Singapore";
  category: string;
  genres: string[];
  description: string;
  address: string;
  price: string;
  currency: "MYR" | "SGD";
  amenities: string[];
  hours: string;
  transport: string;
  image: string;
  coordinates: { x: number; y: number };
};

export type DemoGig = {
  slug: string;
  venueSlug: string;
  artistSlug: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  status: "Scheduled" | "Doors open";
  cover: string;
  language: string;
};

export const artists: DemoArtist[] = [
  {
    slug: "violet-hour",
    name: "Violet Hour",
    city: "Kuala Lumpur",
    country: "Malaysia",
    genre: ["Indie soul", "R&B"],
    languages: ["English", "Malay"],
    bio: "A four-piece collective pairing warm harmonies with late-night grooves and a distinctly Southeast Asian point of view.",
    members: ["Alya — vocals", "Ray — guitar", "Mika — keys", "Zain — drums"],
    image: "/images/violet-hour-band.png",
    availability: "Selected Fridays · MY & SG",
  },
  {
    slug: "paper-lanterns",
    name: "Paper Lanterns",
    city: "Singapore",
    country: "Singapore",
    genre: ["Mandopop", "Acoustic"],
    languages: ["Mandarin", "English"],
    bio: "An acoustic trio reworking familiar melodies into intimate, close-harmony sets.",
    members: ["Jun — vocals", "Mei — guitar", "Hao — percussion"],
    image: "/images/encore-hero.png",
    availability: "Weeknights · Singapore",
  },
  {
    slug: "southbound-club",
    name: "Southbound Club",
    city: "Johor Bahru",
    country: "Malaysia",
    genre: ["Funk", "Pop"],
    languages: ["English", "Malay", "Mandarin"],
    bio: "A high-energy seven-piece built for celebratory rooms, from funk standards to modern pop.",
    members: ["Nadia — vocals", "Isaac — bass", "Ben — drums", "Four-piece horn section"],
    image: "/images/encore-hero.png",
    availability: "Saturdays · Southern Malaysia",
  },
];

export const venues: DemoVenue[] = [
  {
    slug: "the-amber-room",
    name: "The Amber Room",
    city: "Kuala Lumpur",
    district: "Bukit Bintang",
    country: "Malaysia",
    category: "Rooftop lounge",
    genres: ["Indie soul", "Jazz"],
    description: "An intimate rooftop room pairing live sets with a compact modern Malaysian menu and skyline views.",
    address: "Bukit Bintang, Kuala Lumpur",
    price: "RM45–90 per person",
    currency: "MYR",
    amenities: ["Live stage", "Dining", "Covered terrace", "Wheelchair access"],
    hours: "Tue–Sun · 6:00 PM–1:00 AM",
    transport: "6 min walk from Bukit Bintang MRT · Valet nearby",
    image: "/images/encore-hero.png",
    coordinates: { x: 31, y: 48 },
  },
  {
    slug: "afterglow-social",
    name: "Afterglow Social",
    city: "Petaling Jaya",
    district: "Damansara",
    country: "Malaysia",
    category: "Listening bar",
    genres: ["Acoustic", "Neo-soul"],
    description: "A neighbourhood listening bar with a low stage, thoughtful acoustics and relaxed table service.",
    address: "Damansara, Petaling Jaya",
    price: "RM30–70 per person",
    currency: "MYR",
    amenities: ["Live stage", "Parking", "Dining", "Non-smoking room"],
    hours: "Wed–Sun · 5:30 PM–12:30 AM",
    transport: "On-site parking · Ride-hailing drop-off",
    image: "/images/violet-hour-band.png",
    coordinates: { x: 64, y: 32 },
  },
  {
    slug: "harbour-note",
    name: "Harbour Note",
    city: "Johor Bahru",
    district: "Puteri Harbour",
    country: "Malaysia",
    category: "Restaurant & music room",
    genres: ["Pop", "Funk"],
    description: "A waterside restaurant with weekend band sets and a family-friendly early programme.",
    address: "Puteri Harbour, Johor Bahru",
    price: "RM35–85 per person",
    currency: "MYR",
    amenities: ["Live stage", "Dining", "Family seating", "Parking"],
    hours: "Daily · 4:00 PM–12:00 AM",
    transport: "Covered parking · Taxi stand",
    image: "/images/encore-hero.png",
    coordinates: { x: 48, y: 72 },
  },
  {
    slug: "room-23",
    name: "Room 23",
    city: "Singapore",
    district: "Tanjong Pagar",
    country: "Singapore",
    category: "Cocktail bar",
    genres: ["Mandopop", "Jazz"],
    description: "A compact late-night room for close-up acoustic sets, cocktails and small plates.",
    address: "Tanjong Pagar, Singapore",
    price: "S$35–75 per person",
    currency: "SGD",
    amenities: ["Live stage", "Dining", "MRT nearby", "Reservations"],
    hours: "Mon–Sat · 6:00 PM–1:30 AM",
    transport: "4 min walk from Tanjong Pagar MRT",
    image: "/images/violet-hour-band.png",
    coordinates: { x: 73, y: 58 },
  },
];

export const gigs: DemoGig[] = [
  { slug: "violet-hour-at-amber-room", venueSlug: "the-amber-room", artistSlug: "violet-hour", day: "Tonight", date: "19 Oct 2026", time: "8:30 PM", endTime: "11:00 PM", status: "Scheduled", cover: "No cover", language: "English · Malay" },
  { slug: "paper-lanterns-at-room-23", venueSlug: "room-23", artistSlug: "paper-lanterns", day: "Tonight", date: "19 Oct 2026", time: "9:00 PM", endTime: "11:30 PM", status: "Scheduled", cover: "S$18 cover", language: "Mandarin · English" },
  { slug: "southbound-at-harbour-note", venueSlug: "harbour-note", artistSlug: "southbound-club", day: "Tomorrow", date: "20 Oct 2026", time: "8:00 PM", endTime: "10:30 PM", status: "Scheduled", cover: "RM25 cover", language: "English · Malay" },
  { slug: "violet-hour-afterglow", venueSlug: "afterglow-social", artistSlug: "violet-hour", day: "Friday", date: "23 Oct 2026", time: "9:00 PM", endTime: "11:15 PM", status: "Scheduled", cover: "RM20 cover", language: "English · Malay" },
];

export function getVenue(slug: string) {
  return venues.find((venue) => venue.slug === slug);
}

export function getArtist(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}

export function getGig(slug: string) {
  return gigs.find((gig) => gig.slug === slug);
}

export function getGigDetails(gig: DemoGig) {
  return {
    ...gig,
    venue: getVenue(gig.venueSlug)!,
    artist: getArtist(gig.artistSlug)!,
  };
}

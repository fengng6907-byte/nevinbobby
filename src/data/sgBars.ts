export interface SGBar {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingsTotal: number;
  distance: string;
  distanceValue: number;
  photoUrl: string | null;
  openNow: boolean | null;
  priceLevel: number | null;
}

export const sgBars: SGBar[] = [
  { place_id: "sg01", name: "The Inn Livehouse @ Bugis", address: "201 Victoria St, #07-07 Bugis Plus", lat: 1.2993, lng: 103.8553, rating: 4.8, userRatingsTotal: 1342, distance: "1.8 km", distanceValue: 1.8, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg02", name: "A_Livehouse", address: "6 Raffles Blvd, #01-01/02/03 Marina Square", lat: 1.2915, lng: 103.8579, rating: 4.5, userRatingsTotal: 146, distance: "2.1 km", distanceValue: 2.1, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg03", name: "Deck Bar", address: "2 Kallang Ave, #01-K1", lat: 1.3117, lng: 103.8634, rating: 4.4, userRatingsTotal: 77, distance: "3.0 km", distanceValue: 3.0, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg04", name: "Timbre @ The Substation", address: "45 Armenian St", lat: 1.2948, lng: 103.8490, rating: 4.3, userRatingsTotal: 892, distance: "1.2 km", distanceValue: 1.2, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg05", name: "Crazy Elephant", address: "3E River Valley Rd, #01-03 Clarke Quay", lat: 1.2907, lng: 103.8465, rating: 4.2, userRatingsTotal: 534, distance: "0.9 km", distanceValue: 0.9, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg06", name: "Hood Bar and Café", address: "49 Bugis St, #01-12", lat: 1.2995, lng: 103.8538, rating: 4.4, userRatingsTotal: 328, distance: "1.7 km", distanceValue: 1.7, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg07", name: "Hero's Bar", address: "Marriott Tang Plaza Hotel, 320 Orchard Rd", lat: 1.3043, lng: 103.8322, rating: 4.1, userRatingsTotal: 203, distance: "0.8 km", distanceValue: 0.8, photoUrl: null, openNow: true, priceLevel: 3 },
  { place_id: "sg08", name: "The Winery Tapas Bar", address: "80 Mohamed Sultan Rd, #01-12", lat: 1.2923, lng: 103.8402, rating: 4.6, userRatingsTotal: 187, distance: "0.6 km", distanceValue: 0.6, photoUrl: null, openNow: true, priceLevel: 3 },
  { place_id: "sg09", name: "Blu Jaz Café", address: "11 Bali Ln", lat: 1.3012, lng: 103.8580, rating: 4.3, userRatingsTotal: 1056, distance: "2.0 km", distanceValue: 2.0, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg10", name: "Southbridge", address: "80 Boat Quay", lat: 1.2867, lng: 103.8494, rating: 4.5, userRatingsTotal: 412, distance: "1.3 km", distanceValue: 1.3, photoUrl: null, openNow: true, priceLevel: 3 },
  { place_id: "sg11", name: "Level Up", address: "3A River Valley Rd, #02-04 Clarke Quay", lat: 1.2906, lng: 103.8460, rating: 4.0, userRatingsTotal: 289, distance: "0.9 km", distanceValue: 0.9, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg12", name: "Barber Shop by Timbre", address: "30 Victoria St", lat: 1.2948, lng: 103.8530, rating: 4.4, userRatingsTotal: 567, distance: "1.5 km", distanceValue: 1.5, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg13", name: "Muddy Murphy's Irish Pub", address: "111 Somerset Rd, #01-11 TripleOne Somerset", lat: 1.3005, lng: 103.8373, rating: 4.2, userRatingsTotal: 645, distance: "0.4 km", distanceValue: 0.4, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg14", name: "Singapore Polo Club — The Verandah", address: "80 Mount Pleasant Rd", lat: 1.3191, lng: 103.8412, rating: 4.3, userRatingsTotal: 98, distance: "2.5 km", distanceValue: 2.5, photoUrl: null, openNow: false, priceLevel: 3 },
  { place_id: "sg15", name: "Acid Bar", address: "180 Orchard Rd, Peranakan Place", lat: 1.3016, lng: 103.8389, rating: 4.1, userRatingsTotal: 423, distance: "0.5 km", distanceValue: 0.5, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg16", name: "Hard Rock Cafe Singapore", address: "50 Cuscaden Rd, #02-01 HPL House", lat: 1.3038, lng: 103.8293, rating: 4.2, userRatingsTotal: 2134, distance: "1.0 km", distanceValue: 1.0, photoUrl: null, openNow: true, priceLevel: 3 },
  { place_id: "sg17", name: "Bar Rouge", address: "2 Stamford Rd, Level 71 Swissôtel", lat: 1.2933, lng: 103.8530, rating: 4.0, userRatingsTotal: 367, distance: "1.6 km", distanceValue: 1.6, photoUrl: null, openNow: true, priceLevel: 3 },
  { place_id: "sg18", name: "Going Om", address: "63 Haji Ln", lat: 1.3016, lng: 103.8594, rating: 4.6, userRatingsTotal: 231, distance: "2.2 km", distanceValue: 2.2, photoUrl: null, openNow: true, priceLevel: 1 },
  { place_id: "sg19", name: "Esplanade Annexe Studio", address: "1 Esplanade Dr, #01-05", lat: 1.2897, lng: 103.8557, rating: 4.7, userRatingsTotal: 178, distance: "1.9 km", distanceValue: 1.9, photoUrl: null, openNow: false, priceLevel: 2 },
  { place_id: "sg20", name: "Lantern @ Fullerton Bay", address: "80 Collyer Quay, The Fullerton Bay Hotel", lat: 1.2835, lng: 103.8535, rating: 4.5, userRatingsTotal: 892, distance: "2.0 km", distanceValue: 2.0, photoUrl: null, openNow: true, priceLevel: 4 },
  { place_id: "sg21", name: "Bob's Bar", address: "15 Duxton Hill", lat: 1.2791, lng: 103.8430, rating: 4.4, userRatingsTotal: 156, distance: "1.6 km", distanceValue: 1.6, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg22", name: "Backstage Bar", address: "13A Trengganu St", lat: 1.2834, lng: 103.8445, rating: 4.3, userRatingsTotal: 287, distance: "1.4 km", distanceValue: 1.4, photoUrl: null, openNow: true, priceLevel: 2 },
  { place_id: "sg23", name: "Wildseed Bar at The Summerhouse", address: "3 Park Lane", lat: 1.3935, lng: 103.8611, rating: 4.7, userRatingsTotal: 342, distance: "10.5 km", distanceValue: 10.5, photoUrl: null, openNow: false, priceLevel: 3 },
  { place_id: "sg24", name: "1-Altitude Gallery & Bar", address: "1 Raffles Pl, Level 63", lat: 1.2842, lng: 103.8510, rating: 4.3, userRatingsTotal: 1567, distance: "1.7 km", distanceValue: 1.7, photoUrl: null, openNow: true, priceLevel: 4 },
];

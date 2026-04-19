import { wait } from "../utils/helpers";

const citySpotCatalog = {
  Pune: [
    { id: "pune-1", time: "09:00 AM", name: "Shaniwar Wada", description: "Historic Maratha fort and cultural landmark.", lat: 18.5196, lng: 73.8553, category: "Heritage" },
    { id: "pune-2", time: "11:00 AM", name: "Vada Pav Corner", description: "Classic vada pav with spicy garlic chutney.", lat: 18.5168, lng: 73.8567, category: "Street Food" },
    { id: "pune-3", time: "01:30 PM", name: "Maharashtrian Thali House", description: "Regional thali with pithla, bhakri, and puran poli.", lat: 18.5222, lng: 73.8597, category: "Local Meal" },
    { id: "pune-4", time: "04:30 PM", name: "Aga Khan Palace", description: "Museum and palace with quiet gardens.", lat: 18.5525, lng: 73.9013, category: "Sightseeing" },
    { id: "pune-5", time: "08:00 PM", name: "FC Road Cafe", description: "Evening cafe scene and fusion plates.", lat: 18.5204, lng: 73.8417, category: "Dinner" }
  ],
  Mumbai: [
    { id: "mumbai-1", time: "09:00 AM", name: "Gateway of India", description: "Start with the iconic waterfront monument.", lat: 18.922, lng: 72.8347, category: "Landmark" },
    { id: "mumbai-2", time: "11:00 AM", name: "Colaba Breakfast Club", description: "Bombay breakfast and fresh filter coffee.", lat: 18.9219, lng: 72.8331, category: "Breakfast" },
    { id: "mumbai-3", time: "01:30 PM", name: "Girgaon Chowpatty", description: "Street snacks by the sea.", lat: 18.9543, lng: 72.8124, category: "Street Food" },
    { id: "mumbai-4", time: "04:30 PM", name: "Kala Ghoda Arts District", description: "Art galleries and heritage lanes.", lat: 18.9288, lng: 72.8315, category: "Culture" },
    { id: "mumbai-5", time: "08:00 PM", name: "Marine Drive Dinner Deck", description: "Sunset drive and coastal dinner.", lat: 18.943, lng: 72.8238, category: "Dinner" }
  ],
  Jaipur: [
    { id: "jaipur-1", time: "09:00 AM", name: "Amber Fort", description: "Begin at Jaipur's hilltop fort complex.", lat: 26.9855, lng: 75.8513, category: "Heritage" },
    { id: "jaipur-2", time: "11:00 AM", name: "Lassi Stall", description: "Kesar lassi and local sweets.", lat: 26.9165, lng: 75.8209, category: "Local Drink" },
    { id: "jaipur-3", time: "01:30 PM", name: "Old City Thali Stop", description: "Dal baati churma and gatte ki sabzi.", lat: 26.9239, lng: 75.8267, category: "Lunch" },
    { id: "jaipur-4", time: "04:30 PM", name: "Hawa Mahal", description: "Iconic facade and bustling bazaars.", lat: 26.9239, lng: 75.8267, category: "Landmark" },
    { id: "jaipur-5", time: "08:00 PM", name: "Rooftop Pink City Dinner", description: "Royal Rajasthani dinner with city view.", lat: 26.9124, lng: 75.7873, category: "Dinner" }
  ],
  Kochi: [
    { id: "kochi-1", time: "09:00 AM", name: "Fort Kochi Walk", description: "Colonial streets and old port vibes.", lat: 9.964, lng: 76.242, category: "Walk" },
    { id: "kochi-2", time: "11:00 AM", name: "Spice Market Lane", description: "Pepper, cardamom, and local spice stores.", lat: 9.9676, lng: 76.2602, category: "Market" },
    { id: "kochi-3", time: "01:30 PM", name: "Seafood Lunch Pier", description: "Fresh fish curry and appam.", lat: 9.9705, lng: 76.2433, category: "Lunch" },
    { id: "kochi-4", time: "04:30 PM", name: "Chinese Fishing Nets", description: "Sunset photos and harbor breeze.", lat: 9.9668, lng: 76.2425, category: "Scenic" },
    { id: "kochi-5", time: "08:00 PM", name: "Backwater Dinner Cruise", description: "Slow evening cruise with local cuisine.", lat: 9.9312, lng: 76.2673, category: "Dinner" }
  ],
  Delhi: [
    { id: "delhi-1", time: "09:00 AM", name: "Qutub Minar", description: "Start with Indo-Islamic architectural marvels.", lat: 28.5244, lng: 77.1855, category: "Heritage" },
    { id: "delhi-2", time: "11:00 AM", name: "Paratha Gali", description: "Stuffed parathas and chutneys.", lat: 28.6505, lng: 77.2334, category: "Breakfast" },
    { id: "delhi-3", time: "01:30 PM", name: "Mughlai Lunch Court", description: "Butter chicken and kebabs.", lat: 28.6328, lng: 77.2197, category: "Lunch" },
    { id: "delhi-4", time: "04:30 PM", name: "India Gate Promenade", description: "Evening stroll and local snacks.", lat: 28.6129, lng: 77.2295, category: "Landmark" },
    { id: "delhi-5", time: "08:00 PM", name: "Connaught Place Dinner", description: "Cafe clusters and modern Indian plates.", lat: 28.6315, lng: 77.2167, category: "Dinner" }
  ]
};

export const getCitySpotCatalog = (city) => citySpotCatalog[city] || citySpotCatalog.Pune;

export const generateItinerary = async ({ city, days, travelMode }) => {
  await wait(500);

  const baseSpots = getCitySpotCatalog(city);

  return Array.from({ length: Number(days) }, (_, index) => {
    const day = index + 1;
    const rotatedSpots = baseSpots.map((spot, spotIndex) => {
      const shift = (spotIndex + index) % baseSpots.length;
      return {
        ...baseSpots[shift],
        id: `${baseSpots[shift].id}-day-${day}`
      };
    });

    return {
      id: `${city}-${day}`,
      day,
      title: `Explore ${city} - Day ${day}`,
      spots: rotatedSpots,
      activities: rotatedSpots.map(
        (spot) => `${spot.time} - ${spot.name}: ${spot.description} (${travelMode})`
      )
    };
  });
};

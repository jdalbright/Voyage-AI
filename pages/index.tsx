import Head from "next/head";
import { useState } from "react";
import PlannerForm from "../components/PlannerForm";
import ItineraryDisplay, { ItineraryData } from "../components/ItineraryDisplay";
import BlueskyFeed from "../components/BlueskyFeed";

const MOCK_ITINERARY: ItineraryData = {
  tripName: "Sample Voyage: Tokyo Discovery",
  origin: "San Francisco",
  destination: "Tokyo",
  startDate: "2024-09-10",
  endDate: "2024-09-17",
  days: [
    {
      day: "Day 1",
      summary: "Arrive in Tokyo, settle into the hotel, and explore Shinjuku.",
      flights: ["SFO ➜ HND · JL 1"],
      hotels: ["Park Hyatt Tokyo"],
      activities: [
        {
          time: "Evening",
          description: "Stroll through Omoide Yokocho and enjoy yakitori."
        }
      ]
    },
    {
      day: "Day 2",
      summary: "Cultural immersion with visits to Asakusa and the Sumida River.",
      flights: [],
      hotels: ["Park Hyatt Tokyo"],
      activities: [
        {
          time: "Morning",
          description: "Visit Sensō-ji Temple and Nakamise shopping street."
        },
        {
          time: "Afternoon",
          description: "Cruise down the Sumida River with skyline views."
        }
      ]
    }
  ]
};

/**
 * Home surfaces the core Voyage AI experience: itinerary planning, itinerary output, and social inspiration.
 */
function Home() {
  const [itinerary] = useState<ItineraryData | null>(MOCK_ITINERARY);

  return (
    <>
      <Head>
        <title>Voyage AI | Intelligent Travel Planning</title>
        <meta
          name="description"
          content="Voyage AI crafts intelligent itineraries using LLMs and live travel data."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <header className="text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Voyage AI
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-white">
              Design unforgettable journeys with intelligence.
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Pair LLM inspiration with live maps, flights, and community stories to build the perfect adventure.
            </p>
          </header>

          <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <PlannerForm />
            <ItineraryDisplay itinerary={itinerary} />
          </section>

          <BlueskyFeed tag="#travel" />
        </div>
      </main>
    </>
  );
}

export default Home;

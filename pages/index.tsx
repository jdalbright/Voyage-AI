import Head from "next/head";
import { useState } from "react";
import PlannerForm, { PlannerFormValues } from "../components/PlannerForm";
import ItineraryDisplay, { ItineraryData } from "../components/ItineraryDisplay";
import BlueskyFeed from "../components/BlueskyFeed";

/**
 * Home surfaces the core Voyage AI experience: itinerary planning, itinerary output, and social inspiration.
 */
function Home() {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [hasGeneratedItinerary, setHasGeneratedItinerary] = useState<boolean>(false);
  const [lastRequest, setLastRequest] = useState<PlannerFormValues | null>(null);

  const handleGenerateItinerary = async (formValues: PlannerFormValues) => {
    setIsGenerating(true);
    setGenerateError(null);
    setHasGeneratedItinerary(false);
    setLastRequest({ ...formValues });

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        throw new Error(`Failed to generate itinerary: ${response.status}`);
      }

      const payload = (await response.json()) as { itinerary: ItineraryData };
      setItinerary(payload.itinerary);
      setHasGeneratedItinerary(true);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "An unexpected error occurred while generating your itinerary.";
      setGenerateError(message);
      setHasGeneratedItinerary(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const retryLastGeneration = () => {
    if (!lastRequest || isGenerating) {
      return;
    }

    void handleGenerateItinerary(lastRequest);
  };

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
            <PlannerForm
              onSubmit={handleGenerateItinerary}
              isSubmitting={isGenerating}
              submitError={generateError}
            />
            <div className="space-y-4">
              {isGenerating && (
                <p className="rounded-md border border-indigo-500/40 bg-indigo-500/10 p-3 text-sm text-indigo-200">
                  Crafting your itinerary...
                </p>
              )}
              {hasGeneratedItinerary && itinerary && !generateError && !isGenerating && (
                <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  Your personalized itinerary is ready—enjoy the highlights below!
                </p>
              )}
              {generateError && !isGenerating && (
                <div className="space-y-3 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
                  <p>{generateError}</p>
                  {lastRequest && (
                    <button
                      type="button"
                      onClick={retryLastGeneration}
                      className="inline-flex items-center justify-center rounded-md border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:border-red-300/60 hover:text-white"
                    >
                      Try again
                    </button>
                  )}
                </div>
              )}
              <ItineraryDisplay itinerary={itinerary} />
            </div>
          </section>

          <BlueskyFeed tag="#travel" />
        </div>
      </main>
    </>
  );
}

export default Home;

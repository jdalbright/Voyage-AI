import Head from "next/head";
import { useState, useEffect } from "react";
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

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedItinerary = localStorage.getItem('voyage-ai-itinerary');
        const savedRequest = localStorage.getItem('voyage-ai-last-request');
        const savedHasGenerated = localStorage.getItem('voyage-ai-has-generated');

        if (savedItinerary) {
          setItinerary(JSON.parse(savedItinerary));
        }
        if (savedRequest) {
          setLastRequest(JSON.parse(savedRequest));
        }
        if (savedHasGenerated === 'true' && savedItinerary) {
          setHasGeneratedItinerary(true);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Clear corrupted data
        localStorage.removeItem('voyage-ai-itinerary');
        localStorage.removeItem('voyage-ai-last-request');
        localStorage.removeItem('voyage-ai-has-generated');
      }
    }
  }, []);

  // Save itinerary to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && itinerary) {
      localStorage.setItem('voyage-ai-itinerary', JSON.stringify(itinerary));
    }
  }, [itinerary]);

  // Save last request to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && lastRequest) {
      localStorage.setItem('voyage-ai-last-request', JSON.stringify(lastRequest));
    }
  }, [lastRequest]);

  // Save hasGeneratedItinerary state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('voyage-ai-has-generated', hasGeneratedItinerary.toString());
    }
  }, [hasGeneratedItinerary]);

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

  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('voyage-ai-itinerary');
      localStorage.removeItem('voyage-ai-last-request');
      localStorage.removeItem('voyage-ai-has-generated');
      localStorage.removeItem('voyage-ai-form-data');

      setItinerary(null);
      setLastRequest(null);
      setHasGeneratedItinerary(false);
      setGenerateError(null);

      // Trigger page reload to reset form
      window.location.reload();
    }
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <header className="text-center mb-12 relative">
            <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Voyage AI
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
              Design unforgettable journeys with intelligence.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
              Pair LLM inspiration with live maps, flights, and community stories to build the perfect adventure.
            </p>

            {/* Clear Data Button - only show if there's saved data */}
            {(itinerary || lastRequest) && (
              <div className="mt-6">
                <button
                  onClick={clearSavedData}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
                  title="Clear all saved data and reset form"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Saved Data
                </button>
              </div>
            )}
          </header>

          {/* Two-column layout that stacks on mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Form Column */}
            <div className="order-2 xl:order-1">
              <PlannerForm
                onSubmit={handleGenerateItinerary}
                isSubmitting={isGenerating}
                submitError={generateError}
              />
            </div>

            {/* Results Column */}
            <div className="order-1 xl:order-2 space-y-4">
              {isGenerating && (
                <div className="rounded-md border border-indigo-500/40 bg-indigo-500/10 p-4 text-sm text-indigo-200">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-300 border-t-transparent"></div>
                    <span>Crafting your itinerary...</span>
                  </div>
                </div>
              )}

              {hasGeneratedItinerary && itinerary && !generateError && !isGenerating && (
                <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Your personalized itinerary is ready—enjoy the highlights below!</span>
                  </div>
                </div>
              )}

              {generateError && !isGenerating && (
                <div className="space-y-3 rounded-md border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-red-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p>{generateError}</p>
                      {lastRequest && (
                        <button
                          type="button"
                          onClick={retryLastGeneration}
                          className="mt-3 inline-flex items-center justify-center rounded-md border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:border-red-300/60 hover:text-white"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <ItineraryDisplay itinerary={itinerary} />
            </div>
          </div>

          {/* Bluesky Feed - Full Width */}
          <div className="mt-16">
            <BlueskyFeed tag="#travel" />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;

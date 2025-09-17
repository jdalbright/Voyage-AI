export interface ActivitySuggestion {
  time: string;
  description: string;
}

export interface DayItinerary {
  day: string;
  summary: string;
  flights: string[];
  hotels: string[];
  activities: ActivitySuggestion[];
}

export interface ItineraryData {
  tripName: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayItinerary[];
}

interface ItineraryDisplayProps {
  itinerary: ItineraryData | null;
}

/**
 * ItineraryDisplay renders the LLM-produced travel plan in a day-by-day layout,
 * providing placeholders for downstream integrations (flights, hotels, activities).
 */
function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  if (!itinerary) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
        Your personalized itinerary will appear here once generated.
      </div>
    );
  }

  return (
    <section className="mt-10 space-y-6">
      <header className="rounded-2xl bg-slate-900/70 p-6 shadow-lg">
        <h2 className="text-3xl font-semibold text-white">{itinerary.tripName}</h2>
        <p className="mt-2 text-sm text-slate-300">
          {itinerary.origin} → {itinerary.destination} | {itinerary.startDate} – {itinerary.endDate}
        </p>
      </header>

      {itinerary.days.map((day) => (
        <article
          key={day.day}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-md"
        >
          <h3 className="text-xl font-semibold text-white">{day.day}</h3>
          <p className="mt-2 text-sm text-slate-300">{day.summary}</p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <section className="rounded-lg bg-slate-900/60 p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
                Flights
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {day.flights.length ? (
                  day.flights.map((flight) => <li key={flight}>{flight}</li>)
                ) : (
                  <li className="text-slate-500">Flight details coming soon.</li>
                )}
              </ul>
            </section>

            <section className="rounded-lg bg-slate-900/60 p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                Stays
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {day.hotels.length ? (
                  day.hotels.map((hotel) => <li key={hotel}>{hotel}</li>)
                ) : (
                  <li className="text-slate-500">Hotel suggestions will appear here.</li>
                )}
              </ul>
            </section>

            <section className="rounded-lg bg-slate-900/60 p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
                Activities
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {day.activities.length ? (
                  day.activities.map((activity) => (
                    <li key={`${day.day}-${activity.time}`}>
                      <span className="font-medium text-white">{activity.time}</span> — {activity.description}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Activities yet to be generated.</li>
                )}
              </ul>
            </section>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ItineraryDisplay;

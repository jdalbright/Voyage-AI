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
  const exportToPDF = async () => {
    if (!itinerary) return;

    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const itineraryElement = document.getElementById('itinerary-content');
    if (!itineraryElement) return;

    const canvas = await html2canvas(itineraryElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0f172a'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${itinerary.tripName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const exportToCalendar = () => {
    if (!itinerary) return;

    const createICSEvent = (day: DayItinerary, date: Date) => {
      const formatDate = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const eventDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59);

      const activities = day.activities.map(a => `${a.time}: ${a.description}`).join('\\n');
      const hotels = day.hotels.length ? `Hotels: ${day.hotels.join(', ')}\\n` : '';
      const flights = day.flights.length ? `Flights: ${day.flights.join(', ')}\\n` : '';

      return `BEGIN:VEVENT
DTSTART:${formatDate(eventDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${day.day} - ${itinerary.destination}
DESCRIPTION:${day.summary}\\n\\n${flights}${hotels}Activities:\\n${activities}
LOCATION:${itinerary.destination}
END:VEVENT`;
    };

    const startDate = new Date(itinerary.startDate);
    const events = itinerary.days.map((day, index) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + index);
      return createICSEvent(day, dayDate);
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Voyage AI//Travel Itinerary//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${itinerary.tripName}
X-WR-CALDESC:Travel itinerary for ${itinerary.origin} to ${itinerary.destination}
${events}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${itinerary.tripName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
  };
  if (!itinerary) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base">Your personalized itinerary will appear here once generated.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeIcon = (time: string) => {
    const timeStr = time.toLowerCase();
    if (timeStr.includes('morning')) {
      return (
        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2v2m6.364.636l-1.414 1.414M22 12h-2m-1.636 6.364l-1.414-1.414M12 22v-2m-6.364-1.636l1.414-1.414M2 12h2m1.636-6.364l1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"/>
        </svg>
      );
    } else if (timeStr.includes('afternoon')) {
      return (
        <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3a9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9z"/>
        </svg>
      );
    } else if (timeStr.includes('evening') || timeStr.includes('night')) {
      return (
        <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    );
  };

  return (
    <section className="mt-10 space-y-8" id="itinerary-content">
      {/* Enhanced Header */}
      <header className="rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 sm:p-8 shadow-xl backdrop-blur border border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {itinerary.tripName}
              </h2>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{itinerary.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{itinerary.destination}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(itinerary.startDate)} – {formatDate(itinerary.endDate)}</span>
              <span className="mx-2">•</span>
              <span className="text-slate-300 font-semibold">{itinerary.days.length} days</span>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0 lg:ml-6">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-500/25 px-5 py-3 text-sm font-medium text-red-300 transition-all hover:from-red-500/25 hover:to-red-600/25 hover:text-red-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/10"
              title="Export as PDF"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export PDF</span>
            </button>

            <button
              onClick={exportToCalendar}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500/15 to-blue-600/15 border border-blue-500/25 px-5 py-3 text-sm font-medium text-blue-300 transition-all hover:from-blue-500/25 hover:to-blue-600/25 hover:text-blue-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
              title="Export to Calendar"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Day Cards */}
      <div className="space-y-6">
        {itinerary.days.map((day, index) => (
          <article
            key={day.day}
            className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur transition-all hover:border-slate-700/50 hover:bg-slate-900/60"
          >
            {/* Day Number Badge */}
            <div className="absolute -left-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
              {index + 1}
            </div>

            <div className="p-8 pl-12">
              {/* Day Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{day.day}</h3>
                <p className="text-slate-300 text-base leading-relaxed">{day.summary}</p>
              </div>

              {/* Enhanced Grid Layout */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Flights Section */}
                <section className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 border border-slate-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
                      <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Flights</h4>
                  </div>
                  <ul className="space-y-3">
                    {day.flights.length ? (
                      day.flights.map((flight, i) => (
                        <li key={i} className="text-sm text-slate-200 leading-relaxed border-l-2 border-indigo-500/30 pl-3">
                          {flight}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-sm italic">No flights scheduled for this day</li>
                    )}
                  </ul>
                </section>

                {/* Hotels Section */}
                <section className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 border border-slate-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Accommodation</h4>
                  </div>
                  <ul className="space-y-3">
                    {day.hotels.length ? (
                      day.hotels.map((hotel, i) => (
                        <li key={i} className="text-sm text-slate-200 leading-relaxed border-l-2 border-emerald-500/30 pl-3">
                          {hotel}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-sm italic">Accommodation details coming soon</li>
                    )}
                  </ul>
                </section>

                {/* Activities Section */}
                <section className="rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 border border-slate-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20">
                      <svg className="h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-sky-300">Activities</h4>
                  </div>
                  <ul className="space-y-4">
                    {day.activities.length ? (
                      day.activities.map((activity, i) => (
                        <li key={i} className="border-l-2 border-sky-500/30 pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            {getTimeIcon(activity.time)}
                            <span className="text-xs font-semibold text-white uppercase tracking-wide">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed">{activity.description}</p>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-sm italic">Activities being planned</li>
                    )}
                  </ul>
                </section>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ItineraryDisplay;

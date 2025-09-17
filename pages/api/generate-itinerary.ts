import type { NextApiRequest, NextApiResponse } from "next";

interface GenerateItineraryRequestBody {
  originCity: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  interests: string;
  budget: "budget" | "moderate" | "luxury";
}

interface GenerateItineraryResponse {
  itinerary: {
    tripName: string;
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
    days: Array<{
      day: string;
      summary: string;
      flights: string[];
      hotels: string[];
      activities: Array<{ time: string; description: string }>;
    }>;
  };
}

/**
 * generateItinerary composes the itinerary using LLM output, Google Flights insights, and other travel data sources.
 */
export default function generateItinerary(
  request: NextApiRequest,
  response: NextApiResponse<GenerateItineraryResponse | { error: string }>
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const body = request.body as GenerateItineraryRequestBody;

  // TODO: Use Google Flights API with `process.env.MAPS_API_KEY` to compare route pricing and availability.
  // TODO: Invoke the selected LLM (e.g., Gemini or GPT) with user preferences to craft the itinerary narrative.

  const mockItinerary: GenerateItineraryResponse["itinerary"] = {
    tripName: `Voyage to ${body.destinationCity}`,
    origin: body.originCity,
    destination: body.destinationCity,
    startDate: body.startDate,
    endDate: body.endDate,
    days: [
      {
        day: "Day 1",
        summary: "Arrival, hotel check-in, and introduction to local cuisine.",
        flights: ["Placeholder flight details"],
        hotels: ["Hotel recommendations powered by Google Maps"],
        activities: [
          { time: "Morning", description: "City orientation walk." },
          { time: "Evening", description: `Dinner at a top-rated ${body.destinationCity} restaurant.` }
        ]
      },
      {
        day: "Day 2",
        summary: "Immersive cultural experiences tailored to interests.",
        flights: [],
        hotels: ["Hotel recommendations powered by Google Maps"],
        activities: [
          { time: "Morning", description: "Guided museum visit." },
          { time: "Afternoon", description: `Explore attractions aligned with interests: ${body.interests}` }
        ]
      }
    ]
  };

  return response.status(200).json({ itinerary: mockItinerary });
}

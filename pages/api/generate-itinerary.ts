import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
 * generateItinerary composes the itinerary using Gemini AI and travel preferences.
 */
export default async function generateItinerary(
  request: NextApiRequest,
  response: NextApiResponse<GenerateItineraryResponse | { error: string }>
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const body = request.body as GenerateItineraryRequestBody;
  const { originCity, destinationCity, startDate, endDate, interests, budget } = body;

  if (!process.env.GEMINI_API_KEY) {
    return response.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Calculate trip duration for prompt
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tripDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    const prompt = `Create a detailed travel itinerary in JSON format for the following trip:

Origin: ${originCity}
Destination: ${destinationCity}
Start Date: ${startDate}
End Date: ${endDate}
Duration: ${tripDuration} days
Interests: ${interests}
Budget: ${budget}

Please generate a JSON response that matches this exact structure:
{
  "tripName": "A creative name for this trip",
  "origin": "${originCity}",
  "destination": "${destinationCity}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "days": [
    {
      "day": "Day 1",
      "summary": "Brief summary of the day's theme",
      "flights": ["Flight suggestions or details"],
      "hotels": ["Hotel recommendations"],
      "activities": [
        {"time": "Morning", "description": "Specific activity description"},
        {"time": "Afternoon", "description": "Specific activity description"},
        {"time": "Evening", "description": "Specific activity description"}
      ]
    }
  ]
}

Generate exactly ${tripDuration} days. Consider the budget level (${budget}) when making recommendations. Tailor activities to the interests: ${interests}. Be specific and practical with recommendations. Include real places and activities in ${destinationCity}.

Return only valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up the response to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    const itineraryData = JSON.parse(jsonMatch[0]);

    return response.status(200).json({ itinerary: itineraryData });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate itinerary"
    });
  }
}

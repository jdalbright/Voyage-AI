import type { NextApiRequest, NextApiResponse } from "next";

interface BlueskyPost {
  id: string;
  authorHandle: string;
  content: string;
  publishedAt: string;
}

interface BlueskyPostsResponse {
  posts: BlueskyPost[];
}

/**
 * getBlueskyPosts searches the Bluesky API for posts tagged with the requested hashtag.
 */
export default async function getBlueskyPosts(
  request: NextApiRequest,
  response: NextApiResponse<BlueskyPostsResponse | { error: string }>
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const { tag = "#travel" } = request.query as { tag?: string };

  // TODO: Authenticate using `process.env.BLUESKY_APP_PASSWORD` and query the Bluesky API for relevant posts.
  // TODO: Normalize the Bluesky response into the shape defined by `BlueskyPost`.

  const mockPosts: BlueskyPost[] = [
    {
      id: "demo-1",
      authorHandle: "globetrotter",
      content: `Just touched down in ${tag.replace("#", "")}! Voyage AI itinerary nailed it.`,
      publishedAt: new Date().toISOString()
    },
    {
      id: "demo-2",
      authorHandle: "foodie-files",
      content: "Tasting street food gems thanks to Voyage AI recommendations!",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ];

  return response.status(200).json({ posts: mockPosts });
}

import { useEffect, useState } from "react";

interface BlueskyPost {
  id: string;
  authorHandle: string;
  content: string;
  publishedAt: string;
}

interface BlueskyFeedProps {
  tag?: string;
}

/**
 * BlueskyFeed fetches travel chatter from the internal API and renders it as a grid of cards.
 */
function BlueskyFeed({ tag = "#travel" }: BlueskyFeedProps) {
  const [posts, setPosts] = useState<BlueskyPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const skeletonCards = Array.from({ length: 3 });

  useEffect(() => {
    const controller = new AbortController();
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ tag });
        const response = await fetch(`/api/get-bluesky-posts?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Bluesky posts: ${response.status}`);
        }

        const payload = await response.json();
        setPosts(payload.posts ?? []);
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") {
          setError((fetchError as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();

    return () => {
      controller.abort();
    };
  }, [tag]);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Voyager Feed</h2>
          <p className="text-sm text-slate-400">Trending stories from Bluesky for {tag}</p>
        </div>
      </div>

      {isLoading && posts.length === 0 && (
        <>
          <p className="sr-only" role="status">
            Loading travel stories
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {skeletonCards.map((_, index) => (
              <article
                key={`skeleton-${index}`}
                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
              >
                <div className="h-3 w-24 rounded bg-slate-700/80" />
                <div className="mt-4 space-y-3">
                  <div className="h-3 w-full rounded bg-slate-800/80" />
                  <div className="h-3 w-5/6 rounded bg-slate-800/70" />
                  <div className="h-3 w-2/3 rounded bg-slate-800/60" />
                </div>
                <div className="mt-6 h-2 w-32 rounded bg-slate-700/60" />
              </article>
            ))}
          </div>
        </>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {!error && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.length ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-slate-900/70 p-5 shadow-lg border border-slate-800"
              >
                <p className="text-sm uppercase tracking-wide text-indigo-300">
                  @{post.authorHandle}
                </p>
                <p className="mt-3 text-sm text-slate-200">{post.content}</p>
                <p className="mt-4 text-xs text-slate-500">
                  {new Date(post.publishedAt).toLocaleString()}
                </p>
              </article>
            ))
          ) : !isLoading ? (
            <p className="col-span-full rounded-md border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
              No posts found for this tag yet.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default BlueskyFeed;

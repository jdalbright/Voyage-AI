import Head from "next/head";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
}

/**
 * ProductCard renders placeholder digital goods that will be sold via Stripe Checkout.
 */
function ProductCard({ id, name, description, price }: ProductCardProps) {
  const handlePurchase = () => {
    // TODO: Integrate with `/api/stripe-checkout` to create Stripe Checkout sessions.
    console.log(`Trigger checkout for product: ${id}`);
  };

  return (
    <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="mt-3 flex-1 text-sm text-slate-300">{description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-indigo-300">{price}</span>
        <button
          type="button"
          onClick={handlePurchase}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

const PRODUCTS: ProductCardProps[] = [
  {
    id: "packing-list",
    name: "Custom Packing List",
    description: "AI-curated packing essentials tailored to your itinerary and preferences.",
    price: "$19"
  },
  {
    id: "insider-guide",
    name: "Insider City Guide",
    description: "Handpicked dining, nightlife, and cultural experiences from trusted locals.",
    price: "$29"
  },
  {
    id: "flight-watch",
    name: "Flight Deal Watch",
    description: "Real-time alerts for fare drops on your preferred routes and travel dates.",
    price: "$15"
  }
];

/**
 * Store lists digital offerings that monetize the Voyage AI experience via Stripe.
 */
function Store() {
  return (
    <>
      <Head>
        <title>Voyage AI Store</title>
        <meta
          name="description"
          content="Discover digital travel products powered by Voyage AI."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <header className="text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Storefront
            </span>
            <h1 className="mt-6 text-4xl font-semibold text-white">Curated Digital Travel Tools</h1>
            <p className="mt-4 text-lg text-slate-300">
              Enhance every stage of your journey with AI-enhanced products.
            </p>
          </header>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default Store;

import type { NextApiRequest, NextApiResponse } from "next";

interface StripeCheckoutRequestBody {
  productId: string;
}

interface StripeCheckoutResponse {
  checkoutUrl: string;
}

/**
 * stripeCheckout will orchestrate a Stripe Checkout session for digital travel products.
 */
export default async function stripeCheckout(
  request: NextApiRequest,
  response: NextApiResponse<StripeCheckoutResponse | { error: string }>
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const { productId } = request.body as StripeCheckoutRequestBody;

  if (!productId) {
    return response.status(400).json({ error: "Missing productId" });
  }

  // TODO: Initialize Stripe with `process.env.STRIPE_SECRET_KEY` and create a checkout session.
  // TODO: Configure success/cancel URLs and line items based on the supplied product.

  const mockCheckoutUrl = `https://checkout.stripe.com/pay/mock-session-for-${productId}`;

  return response.status(200).json({ checkoutUrl: mockCheckoutUrl });
}

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tenantId, email } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }

    if (!process.env.STRIPE_PRICE_ID_RM49) {
      throw new Error("STRIPE_PRICE_ID_RM49 is missing");
    }

    if (!process.env.NEXT_PUBLIC_URL) {
      throw new Error("NEXT_PUBLIC_URL is missing");
    }

    if (!email) {
      throw new Error("Customer email is required");
    }

    if (!tenantId) {
      throw new Error("Tenant ID is required");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer_email: email,

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_RM49,
          quantity: 1,
        },
      ],

      metadata: {
        tenantId: String(tenantId),
      },

      success_url:
        `${process.env.NEXT_PUBLIC_URL}/dashboard?subscription=success`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_URL}/dashboard?subscription=cancelled`,
    });

    return Response.json({
      url: session.url,
    });

  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return Response.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

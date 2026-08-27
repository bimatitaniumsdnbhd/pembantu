import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tenantId, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_RM49,
          quantity: 1,
        },
      ],
      metadata: {
        tenantId: tenantId,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?subscription=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

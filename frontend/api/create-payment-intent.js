import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "STRIPE_SECRET_KEY is completely missing in Vercel Environment Variables!" });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { amount, currency } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

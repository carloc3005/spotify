import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    // For development/preview, we'll create a placeholder that throws meaningful errors
    console.warn('STRIPE_SECRET_KEY not found in environment variables');
}

export const stripe = new Stripe(
    stripeSecretKey ?? 'sk_test_placeholder',
    {
        apiVersion: '2025-05-28.basil',
        appInfo: {
            name: 'Carlo Spotify Clone',
            version: '0.1.0'
        }
    }
);
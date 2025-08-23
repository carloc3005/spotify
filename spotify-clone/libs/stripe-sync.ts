import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { stripe } from './stripe';
// TODO: Replace with Neon database operations
// import { upsertProductRecord, upsertPriceRecord } from './neonAdmin';

const syncProductAndPrices = async (productId: string) => {
  try {
    console.log(`Fetching product from Stripe: ${productId}`);
    const product = await stripe.products.retrieve(productId);
    console.log(`Product fetched: ${product.name}`);
    // TODO: Implement Neon database upsert
    // await upsertProductRecord(product);

    console.log(`Fetching prices for ${product.name}...`);
    const prices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    });

    for (const price of prices.data) {
      console.log(`Price found: ${price.id}`);
      // TODO: Implement Neon database upsert
      // await upsertPriceRecord(price);
    }
    console.log('Sync complete! (Note: Database operations are commented out)');
  } catch (error) {
    console.error('Error syncing product and prices:', error);
  }
};

// The product ID provided by the user.
// Uncomment the line below when you're ready to sync with Neon database
// const productIdToSync = 'prod_SZIMPMV0j5efuh';
// syncProductAndPrices(productIdToSync);

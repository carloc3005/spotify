import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { stripe } from './stripe';
import { upsertProductRecord, upsertPriceRecord } from './supabaseAdmin';

const syncProductAndPrices = async (productId: string) => {
  try {
    console.log(`Fetching product from Stripe: ${productId}`);
    const product = await stripe.products.retrieve(productId);
    console.log(`Upserting product: ${product.name}`);
    await upsertProductRecord(product);

    console.log(`Fetching prices for ${product.name}...`);
    const prices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    });

    for (const price of prices.data) {
      console.log(`Upserting price: ${price.id}`);
      await upsertPriceRecord(price);
    }
    console.log('Sync complete!');
  } catch (error) {
    console.error('Error syncing product and prices:', error);
  }
};

// The product ID provided by the user.
const productIdToSync = 'prod_SZIMPMV0j5efuh';
syncProductAndPrices(productIdToSync);

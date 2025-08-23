import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/libs/stripe';

export const upsertProductRecord = async (product: Stripe.Product) => {
  try {
    // TODO: Implement if you need to store Stripe products in your database
    // For now, we'll just log the product information
    console.log('Product webhook received:', product.id, product.name);
    
    // Uncomment and modify if you want to store products in your database:
    /*
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        active: product.active,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        metadata: product.metadata,
      },
      create: {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        metadata: product.metadata,
      },
    });
    */
  } catch (error) {
    console.error('Error upserting product record:', error);
    throw error;
  }
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  try {
    // TODO: Implement if you need to store Stripe prices in your database
    console.log('Price webhook received:', price.id, price.unit_amount);
    
    // Uncomment and modify if you want to store prices in your database:
    /*
    await prisma.price.upsert({
      where: { id: price.id },
      update: {
        productId: price.product as string,
        active: price.active,
        currency: price.currency,
        description: price.nickname,
        type: price.type,
        unitAmount: price.unit_amount,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        trialPeriodDays: price.recurring?.trial_period_days,
        metadata: price.metadata,
      },
      create: {
        id: price.id,
        productId: price.product as string,
        active: price.active,
        currency: price.currency,
        description: price.nickname,
        type: price.type,
        unitAmount: price.unit_amount,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        trialPeriodDays: price.recurring?.trial_period_days,
        metadata: price.metadata,
      },
    });
    */
  } catch (error) {
    console.error('Error upserting price record:', error);
    throw error;
  }
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  try {
    // Get the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the customer by email (since we're using NextAuth, not Stripe customer IDs)
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    if (!customer.email) {
      console.error('No customer email found');
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: customer.email }
    });

    if (!user) {
      console.error('No user found for email:', customer.email);
      return;
    }

    // Upsert the subscription in your database
    const subscriptionData = {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: (subscription as any).status,
    };

    await prisma.subscription.upsert({
      where: { 
        stripeSubscriptionId: subscriptionId 
      },
      update: subscriptionData,
      create: {
        ...subscriptionData,
        userId: user.id,
      },
    });

    console.log(`Subscription ${createAction ? 'created' : 'updated'} for user:`, user.email);
  } catch (error) {
    console.error('Error managing subscription status change:', error);
    throw error;
  }
};

export const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  try {
    // First, try to find existing customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    // Create new customer if none exists
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: uuid
      }
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating or retrieving customer:', error);
    throw error;
  }
};

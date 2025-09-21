import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/neonAdmin";

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please contact support." },
        { status: 500 }
      );
    }

    const authSession = await getServerSession();
    
    if (!authSession?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const customerId = await createOrRetrieveCustomer({
      email: authSession.user.email,
      uuid: authSession.user.id || "",
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: customerId,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata,
      },
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
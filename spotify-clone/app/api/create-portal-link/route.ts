import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/neonAdmin";

export async function POST() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const customerId = await createOrRetrieveCustomer({
            email: session.user.email,
            uuid: session.user.id || "",
        });

        const { url } = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${getUrl()}/account`
        });

        return NextResponse.json({ url });
        
    } catch (error: any ) {
        console.log(error);
        return new NextResponse('Internal Error', {status: 500});
    }
}
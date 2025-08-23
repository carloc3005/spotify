import { Product, Price } from "@/types";
import { prisma } from "@/lib/prisma";

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  try {
    // For now, return empty array since we're focusing on the core music functionality
    // You can implement Stripe products/prices later if needed for subscription features
    return [];
    
    // TODO: If you need Stripe products, implement this:
    /*
    const products = await prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        prices: true,
      },
      orderBy: {
        // You'll need to add an index field to your Product model if needed
        createdAt: 'desc',
      },
    });

    return products.map(product => ({
      ...product,
      prices: product.prices,
    }));
    */
  } catch (error) {
    console.log('Error fetching products:', error);
    return [];
  }
};

export default getActiveProductsWithPrices;
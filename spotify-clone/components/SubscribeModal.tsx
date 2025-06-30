"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductWithPrice } from "@/types";

import Modal from "./Modal";
import Button from "./Button";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already subscribed");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content = (
    <div className="text-center py-8">
      <div className="text-neutral-400 mb-4">
        Loading subscription plans...
      </div>
    </div>
  );

  if (subscription) {
    content = (
      <div className="text-center py-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-4">
          <div className="text-green-500 text-lg font-semibold mb-2">
            🎉 You're already subscribed!
          </div>
          <div className="text-neutral-400">
            Enjoy unlimited access to all premium features.
          </div>
        </div>
      </div>
    );
  } else if (products.length) {
    content = (
      <div className="space-y-4">
        {products.map((product) => {
          if (!product.prices?.length) {
            return null; // Don't show products without prices
          }

          return product.prices.map((price) => (
            <div
              key={price.id}
              className="border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-500">
                      {formatPrice(price)}
                    </span>
                    {price.interval && (
                      <span className="text-neutral-400">
                        / {price.interval}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-neutral-400 text-sm">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="ml-6">
                  <Button
                    onClick={() => handleCheckout(price)}
                    disabled={isLoading || price.id === priceIdLoading}
                    className="min-w-[100px] bg-green-500 hover:bg-green-400 text-black font-semibold"
                  >
                    {price.id === priceIdLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ));
        })}
        
        <div className="bg-neutral-800/50 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Cancel anytime • Secure payment • Instant access</span>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="text-center py-8">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-4">
          <div className="text-yellow-500 text-lg font-semibold mb-2">
            No subscription plans available
          </div>
          <div className="text-neutral-400 text-sm">
            We're working on setting up subscription plans. Please check back later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title="Upgrade to Premium"
      description="Unlock unlimited music and exclusive features"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
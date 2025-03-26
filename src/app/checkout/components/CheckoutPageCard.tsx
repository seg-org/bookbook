"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";

const CheckoutPageCard = ({
  amount,
  setIsDialogOpen,
}: {
  amount: number;
  setIsDialogOpen: (isOpen: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        if (data.clientSecret) {
          fetch("/api/transaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              buyerId: "user_3",
              status: "PAYING",
              paymentMethod: "CREDIT_CARD",
              hashId: "aEc!K/NGQ'9?6.UGaPr\"^!&Gyj8.2j?}",
              shipmentMethod: "DELIVERY",
              trackingURL: "_.V59O4-Q}KkUr^U!zL-2o8PpVQgb]N!",
              amount: amount,
            }),
          });
        }
      });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction-history-page`);

    if (process.env.NEXT_PUBLIC_BASE_URL === undefined) {
      console.log("NEXT_PUBLIC_BASE_URL is undefined");
    }
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/transaction-history-page`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-white">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <DialogFooter className="pt-8">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="default" disabled={!stripe || loading}>
          {!loading ? `Pay ฿${amount}` : "Processing..."}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CheckoutPageCard;

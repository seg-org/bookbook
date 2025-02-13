"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import CheckoutPage from "./components/CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function Home() {
  const searchParms = useSearchParams();
  const encodedAmountString = searchParms.get("amount");
  const amountString = encodedAmountString ? decodeURIComponent(encodedAmountString) : "";
  const encodedBookTitle = searchParms.get("bookTitle");
  const bookTitle = encodedBookTitle ? decodeURIComponent(encodedBookTitle) : "";
  const amount = amountString ? parseFloat(amountString) : 0;
  const encodedPostId = searchParms.get("postId");
  const postId = encodedPostId ? decodeURIComponent(encodedPostId) : "";

  return (
    <main className="m-10 mx-auto max-w-6xl rounded-md border bg-gradient-to-tr from-blue-500 to-purple-500 p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold">{bookTitle}</h1>
        <h2 className="text-2xl">
          Price (THB):
          <span className="font-bold"> ฿{amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: Math.round(amount * 100),
          currency: "thb",
          payment_method_types: ["card"],
        }}
      >
        <CheckoutPage amount={amount} postId={postId} />
      </Elements>
    </main>
  );
  return (
    <main className="m-10 mx-auto max-w-6xl rounded-md border bg-gradient-to-tr from-blue-500 to-purple-500 p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold">{bookTitle}</h1>
        <h2 className="text-2xl">
          Price (THB):
          <span className="font-bold"> ฿{amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: Math.round(amount * 100),
          currency: "thb",
          payment_method_types: ["card"],
        }}
      >
        <CheckoutPage amount={amount} postId={postId} />
      </Elements>
    </main>
  );
}

export default Home;

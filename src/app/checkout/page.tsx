"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./components/CheckoutPage";
import { useSearchParams } from "next/navigation";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function Home() {
    const searchParms = useSearchParams();
    const encodedAmountString = searchParms.get("amount");
    const encodedEmail = searchParms.get("email");
    const amountString = encodedAmountString ? decodeURIComponent(encodedAmountString) : "";
    const email = encodedEmail ? decodeURIComponent(encodedEmail) : "";
    const encodedBookTitle = searchParms.get("bookTitle");
    const bookTitle = encodedBookTitle ? decodeURIComponent(encodedBookTitle) : "";
    const amount = amountString ? parseFloat(amountString) : 0;
    const encodedPostId = searchParms.get("postId");
    const postId = encodedPostId ? decodeURIComponent(encodedPostId) : "";

    return (
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2">{bookTitle}</h1>
            <h2 className="text-2xl">
              negotiated price: 
              <span className="font-bold"> ฿{amount}</span>
            </h2>
            <h2 className="text-2xl">
              Buyer email: 
              <span className="font-bold"> {email}</span>
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
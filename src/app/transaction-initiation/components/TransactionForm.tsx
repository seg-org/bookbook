// "use client"
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import axios from "axios";

// const transactionSchema = z.object({
//   bookId: z.string().min(1, "Book ID is required"),
//   paymentMethod: z.enum(["Credit Card", "PayPal", "Bank Transfer"], {
//     errorMap: () => ({ message: "Invalid payment method selected" }),
//   }),
//   shipmentDetails: z.string().min(5, "Shipment details must be provided"),
// });

// type TransactionFormData = z.infer<typeof transactionSchema>;

// export default function TransactionForm({ bookId }: { bookId: string }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<TransactionFormData>({
//     resolver: zodResolver(transactionSchema),
//     defaultValues: { bookId },
//   });

//   const onSubmit = async (data: TransactionFormData) => {
//     try {
//       const response = await axios.post("/api/transaction", data);
//       alert("Transaction initiated successfully!");
//     } catch (error) {
//       alert("Transaction failed. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Initiate Transaction</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Payment Method</label>
//           <select {...register("paymentMethod")} className="border rounded p-2 w-full">
//             <option value="">Select Payment Method</option>
//             <option value="Credit Card">Credit Card</option>
//             <option value="PayPal">PayPal</option>
//             <option value="Bank Transfer">Bank Transfer</option>
//           </select>
//           {errors.paymentMethod && (
//             <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Shipment Details</label>
//           <textarea {...register("shipmentDetails")} className="border rounded p-2 w-full"></textarea>
//           {errors.shipmentDetails && (
//             <p className="text-red-500 text-sm">{errors.shipmentDetails.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           {isSubmitting ? "Processing..." : "Confirm Transaction"}
//         </button>
//       </form>
//     </div>
//   );
// }


// Mock data ver
"use client"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const transactionSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  paymentMethod: z.enum(["Credit Card", "PayPal", "Bank Transfer"], {
    errorMap: () => ({ message: "Invalid payment method selected" }),
  }),
  shipmentDetails: z.string().min(5, "Shipment details must be provided"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionForm({ bookId }: { bookId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { bookId },
  });

  // Mock state for transaction success
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const onSubmit = (data: TransactionFormData) => {
    console.log("Mock transaction data:", data);

    // Simulating a successful transaction without backend
    setTimeout(() => {
      setTransactionSuccess(true);
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Mock Transaction Form</h2>

      {transactionSuccess === true && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          🎉 Mock Transaction Successful!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <select {...register("paymentMethod")} className="border rounded p-2 w-full">
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Shipment Details</label>
          <textarea {...register("shipmentDetails")} className="border rounded p-2 w-full"></textarea>
          {errors.shipmentDetails && (
            <p className="text-red-500 text-sm">{errors.shipmentDetails.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isSubmitting ? "Processing..." : "Confirm Transaction"}
        </button>
      </form>
    </div>
  );
}
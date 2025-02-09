// import { getServerSession } from "next-auth/next";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { SellerVerificationList } from "./components/SellerVerificationList";

// async function getUnverifiedSellers() {
//   return await prisma.sellerProfile.findMany({
//     where: {
//       isApproved: false,
//     },
//     include: {
//       user: {
//         select: {
//           email: true,
//           firstName: true,
//           lastName: true,
//           phoneNumber: true,
//         },
//       },
//     },
//   });
// }

// export default async function AdminVerifySellersPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.isAdmin) {
//     redirect("/");
//   }

//   const unverifiedSellers = await getUnverifiedSellers();

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-6">Verify Sellers</h1>
//       <SellerVerificationList sellers={unverifiedSellers} />
//     </div>
//   );
// }

// // app/admin/verify-sellers/components/SellerVerificationList.tsx
// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";

// type Seller = {
//   id: string;
//   idCardNumber: string;
//   idCardImage: string;
//   bankAccount: string;
//   bankName: string;
//   shopName: string;
//   shopDescription: string;
//   user: {
//     email: string;
//     firstName: string;
//     lastName: string;
//     phoneNumber: string | null;
//   };
// };

// export function SellerVerificationList({ sellers }: { sellers: Seller[] }) {
//   const [loading, setLoading] = useState<Record<string, boolean>>({});
//   const { toast } = useToast();

//   const handleVerification = async (sellerId: string, approved: boolean) => {
//     setLoading((prev) => ({ ...prev, [sellerId]: true }));

//     try {
//       const response = await fetch("/api/admin/verify-seller", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sellerId, approved }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to verify seller");
//       }

//       toast({
//         title: "Success",
//         description: `Seller ${approved ? "approved" : "rejected"} successfully`,
//       });

//       // Refresh the page to update the list
//       window.location.reload();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to process verification",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, [sellerId]: false }));
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {sellers.map((seller) => (
//         <Card key={seller.id}>
//           <CardHeader>
//             <CardTitle>{seller.shopName}</CardTitle>
//             <CardDescription>
//               {seller.user.firstName} {seller.user.lastName} ({seller.user.email})
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold mb-2">Personal Information</h3>
//                 <p>Phone: {seller.user.phoneNumber}</p>
//                 <p>ID Card: {seller.idCardNumber}</p>
//                 <p>Bank Account: {seller.bankAccount}</p>
//                 <p>Bank Name: {seller.bankName}</p>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-2">Shop Information</h3>
//                 <p>{seller.shopDescription}</p>
//               </div>
//               <div className="md:col-span-2">
//                 <h3 className="font-semibold mb-2">ID Card Image</h3>
//                 <img
//                   src={seller.idCardImage}
//                   alt="ID Card"
//                   className="max-w-md rounded-lg"
//                 />
//               </div>
//               <div className="md:col-span-2 flex space-x-4">
//                 <Button
//                   onClick={() => handleVerification(seller.id, true)}
//                   disabled={loading[seller.id]}
//                   className="flex-1"

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { bookId, paymentMethod, shipmentDetails } = await req.json();

//     if (!bookId || !paymentMethod || !shipmentDetails) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const transaction = await prisma.transaction.create({
//       data: {
//         bookId,
//         paymentMethod,
//         shipmentDetails,
//         status: "Pending",
//       },
//     });

//     return NextResponse.json({ message: "Transaction initiated", transaction }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
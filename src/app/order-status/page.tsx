"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMockOrderStatus = async () => {
      try {
        // Mock order data
        const mockOrders = [
          {
            id: "12345",
            status: "Shipped",
            amount: 29.99,
            paymentMethod: "Credit Card",
            trackingNumber: "TRACK123456",
            trackingUrl: "https://track.example.com/TRACK123456",
            bookTitle: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
          },
          {
            id: "67890",
            status: "Processing",
            amount: 49.99,
            paymentMethod: "PayPal",
            trackingNumber: null,
            trackingUrl: null,
            bookTitle: "To Kill a Mockingbird",
            author: "Harper Lee",
          },
        ];

        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load order status.");
        setLoading(false);
      }
    };

    fetchMockOrderStatus();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading order details...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Check the details of your recent order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Amount:</strong> ${order.amount}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Book Title:</strong> {order.bookTitle}
              </p>
              <p>
                <strong>Author:</strong> {order.author}
              </p>
              <p>
                <strong>Tracking Number:</strong> {order.trackingNumber || "Not available"}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                {order.trackingUrl && (
                  <Button variant='outline' onClick={() => window.open(order.trackingUrl, "_blank")}>Track Order</Button>
                )}
                <Button onClick={() => router.push(`/review`)}>Write a Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderStatusPage;

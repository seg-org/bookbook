"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald"
          },
          {
            id: "67890",
            status: "Processing",
            amount: 49.99,
            paymentMethod: "PayPal",
            trackingNumber: null,
            trackingUrl: null,
            title: "To Kill a Mockingbird",
            author: "Harper Lee"
          }
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

  if (loading) return <div className="text-center py-10">Loading order details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Check the details of your recent order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Amount:</strong> ${order.amount}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Book Title:</strong> {order.title}</p>
              <p><strong>Author:</strong> {order.author}</p>
              <p><strong>Tracking Number:</strong> {order.trackingNumber || "Not available"}</p>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-blue-600 underline">
                  Track Order
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderStatusPage;
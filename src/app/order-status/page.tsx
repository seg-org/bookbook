"use client";
import React, { useEffect, useState } from "react";

const OrderStatusPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMockOrderStatus = async () => {
      try {
        // Mock order data
        const mockOrder = {
          id: "12345",
          status: "Shipped",
          amount: 29.99,
          paymentMethod: "Credit Card",
          trackingNumber: "TRACK123456"
        };

        setTimeout(() => {
          setOrder(mockOrder);
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Order Status</h2>
      {order ? (
        <div>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Amount:</strong> ${order.amount}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Tracking Number:</strong> {order.trackingNumber || "Not available"}</p>
          {order.trackingNumber && (
            <a
              href={`https://track.example.com/${order.trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-600 underline">
              Track Order
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Order details not found.</p>
      )}
    </div>
  );
};

export default OrderStatusPage;
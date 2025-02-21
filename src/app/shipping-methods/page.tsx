"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimated_delivery: string;
}

const mockShippingMethods: ShippingMethod[] = [
  {
    id: "1",
    name: "Standard Shipping",
    cost: 5.99,
    estimated_delivery: "3-5 business days",
  },
  {
    id: "2",
    name: "Express Shipping",
    cost: 12.99,
    estimated_delivery: "1-2 business days",
  },
  {
    id: "3",
    name: "Overnight Shipping",
    cost: 24.99,
    estimated_delivery: "1 business day",
  },
];

const ShippingMethods = ({ transactionId }: { transactionId: string }) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShippingMethods(mockShippingMethods);
      } catch (err) {
        setError("Failed to load shipping methods");
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, [transactionId]);

  const handleSelect = async () => {
    if (!selectedMethod) return;

    try {
      setLoading(true);
      // Simulate API call to select shipping method
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Shipping method selected successfully!");
    } catch (err) {
      setError("Failed to select shipping method");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4">
      {shippingMethods.map((method) => (
        <Card
          key={method.id}
          className={`cursor-pointer ${selectedMethod === method.id ? "border-blue-500" : "border-gray-300"}`}
          onClick={() => setSelectedMethod(method.id)}
        >
          <CardHeader>
            <CardTitle>{method.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cost: ${method.cost.toFixed(2)}</p>
            <p>Estimated Delivery: {method.estimated_delivery}</p>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSelect} disabled={!selectedMethod || loading}>
        Confirm Shipping Method
      </Button>
    </div>
  );
};

export default ShippingMethods;

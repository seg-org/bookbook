"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    shipmentMethod: "",
  });

  const shipmentMethods = [
    { id: "standard", name: "Standard Shipping (3-5 days)" },
    { id: "express", name: "Express Shipping (1-2 days)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout Data:", formData);
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <textarea
          name="address"
          placeholder="Full Address (Street, City, State, ZIP Code)"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          rows="3"
        />
        <select
          name="shipmentMethod"
          value={formData.shipmentMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a shipping method</option>
          {shipmentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}

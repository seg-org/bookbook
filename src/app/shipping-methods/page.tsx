"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Types
interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimated: string;
}

interface BuyerInfo {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  shippingMethod: string;
}

// Mock Data
const mockShippingMethods: ShippingMethod[] = [
  { id: "standard", name: "Standard Shipping", cost: 5.99, estimated: "3-5 business days" },
  { id: "express", name: "Express Shipping", cost: 12.99, estimated: "1-2 business days" },
];

// Custom Hook for Form Logic
const useShippingForm = () => {
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    shippingMethod: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validateField = (field: keyof BuyerInfo, value: string): boolean => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required.";
    } else if (field === "phone" && !/^\d+$/.test(value)) {
      error = "Phone number must contain only numbers.";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleInputChange = (field: keyof BuyerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuyerInfo((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleShippingChange = (value: string) => {
    setSelectedMethod(value);
    setErrors((prev) => ({ ...prev, shippingMethod: "" }));
  };

  const validateForm = (): boolean => {
    const fieldsValid = Object.keys(buyerInfo).every((field) =>
      validateField(field as keyof BuyerInfo, buyerInfo[field as keyof BuyerInfo])
    );
    const shippingValid = selectedMethod !== null;
    if (!shippingValid) {
      setErrors((prev) => ({ ...prev, shippingMethod: "Please select a shipping method." }));
    }
    return fieldsValid && shippingValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    console.log("Order confirmed:", { buyerInfo, selectedMethod });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setBuyerInfo({ firstName: "", lastName: "", address: "", phone: "" });
    setSelectedMethod(null);
    setErrors({ firstName: "", lastName: "", address: "", phone: "", shippingMethod: "" });
  };

  return {
    buyerInfo,
    selectedMethod,
    errors,
    isDialogOpen,
    handleInputChange,
    handleShippingChange,
    handleSubmit,
    handleConfirm,
    setIsDialogOpen,
    getShippingDisplay: () => mockShippingMethods.find((m) => m.id === selectedMethod)?.name ?? "Not selected",
  };
};

// Form Field Component
const FormField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}> = ({ id, label, value, onChange, error, placeholder }) => (
  <div className="flex flex-col space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

// Main Component
const ShippingMethodsPage: React.FC = () => {
  const {
    buyerInfo,
    selectedMethod,
    errors,
    isDialogOpen,
    handleInputChange,
    handleShippingChange,
    handleSubmit,
    handleConfirm,
    setIsDialogOpen,
    getShippingDisplay,
  } = useShippingForm();

  return (
    <div className="flex justify-center p-10">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Fill in your details and select a shipping method.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex space-x-4">
              <FormField
                id="firstName"
                label="First Name"
                value={buyerInfo.firstName}
                onChange={handleInputChange("firstName")}
                error={errors.firstName}
                placeholder="First name"
              />
              <FormField
                id="lastName"
                label="Last Name"
                value={buyerInfo.lastName}
                onChange={handleInputChange("lastName")}
                error={errors.lastName}
                placeholder="Last name"
              />
            </div>
            <FormField
              id="address"
              label="Address"
              value={buyerInfo.address}
              onChange={handleInputChange("address")}
              error={errors.address}
              placeholder="Shipping address"
            />
            <FormField
              id="phone"
              label="Phone Number"
              value={buyerInfo.phone}
              onChange={handleInputChange("phone")}
              error={errors.phone}
              placeholder="Phone number"
            />
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="shipping">Shipping Method</Label>
              <Select onValueChange={handleShippingChange} value={selectedMethod ?? undefined}>
                <SelectTrigger
                  id="shipping"
                  aria-invalid={!!errors.shippingMethod}
                  aria-describedby={errors.shippingMethod ? "shipping-error" : undefined}
                >
                  <SelectValue placeholder="Select a shipping method" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {mockShippingMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {`${method.name} - $${method.cost} (${method.estimated})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shippingMethod && (
                <p id="shipping-error" className="text-sm text-red-500">
                  {errors.shippingMethod}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Place Order</Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              Name: {buyerInfo.firstName} {buyerInfo.lastName}
            </p>
            <p>Address: {buyerInfo.address}</p>
            <p>Phone: {buyerInfo.phone}</p>
            <p>Shipping Method: {getShippingDisplay()}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingMethodsPage;

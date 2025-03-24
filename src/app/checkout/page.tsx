"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";

const shipmentMethods = [
  { id: "standard", name: "Standard Shipping (3-5 days)" },
  { id: "express", name: "Express Shipping (1-2 days)" },
];

// Define validation schema with Zod (Book section has no validation)
const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  shipmentMethod: z.string().min(0, "Please select a shipping method"),
  // Book section (No validation)
  title: z.string().optional(),
  author: z.string().optional(),
  price: z.number().optional(),
});

// Infer TypeScript type from schema
type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderData, setOrderData] = useState<CheckoutFormData | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      shipmentMethod: "",
      title: "",
      author: "",
      price: 0,
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    setOrderData(data);
    setIsDialogOpen(true); // Open confirmation dialog
  };

  const router = useRouter();

  const handleConfirmOrder = () => {
    // ---------------------------------
    // fix this please
    // --------------------------------
    // fetch("/api/transaction", { method: "POST", body: JSON.stringify({ buyerId: session?.user.id, postId: postId, amount: orderData?.price }) })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
    //alert("Order placed successfully!");
    router.push("/transaction-history-page");
  };

  const { data: session } = useSession();
  const userId = session?.user.id;
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return; // Prevent fetch if userId is missing

    fetch(`/api/add-to-cart/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Cart Data:", data);
        if (data.postId) {
          setPostId(data.postId);
        }
      })
      .catch((error) => {
        console.error("Error getting cart", error);
      });

    form.setValue("name", session?.user.name || "");
    form.setValue("email", session?.user.email || "");
    form.setValue("phoneNumber", session?.user.phoneNumber || "");
  }, [form, session?.user.email, session?.user.name, session?.user.phoneNumber, userId]);

  useEffect(() => {
    if (!postId) return; // Prevent fetch if postId is still null

    fetch(`/api/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Post Data:", data);
        form.setValue("title", data.book.title);
        form.setValue("author", data.book.author);
        form.setValue("price", data.price);
      })
      .catch((error) => {
        console.error("Error getting post", error);
      });
  }, [postId, form]);

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Checkout</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Book Section*/}
          <h2 className="mt-6 text-xl font-semibold">Book Details</h2>

          {/* Book Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl>
                  <Input placeholder="fetching... book title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Book Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="fetching... author's name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Book Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="fetching... price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* User Section*/}
          <h2 className="mt-6 text-xl font-semibold">User Details</h2>
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="fetching... Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="fetching... Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="fetching... Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Fill Address (Street, City, State, ZIP Code)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*Shipment Method*/}
          <FormField
            control={form.control}
            name="shipmentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipment Method</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      {shipmentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Section*/}
          <h2 className="mt-6 text-xl font-semibold">Payment Details</h2>
          <Select onValueChange={(value) => console.log(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Fill payment details" />
            </SelectTrigger>
            <SelectContent>
              {/* Add your payment options here */}
              <SelectItem value="creditCard">Credit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </Form>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>
          {orderData && (
            <div>
              <p>
                <strong>Name:</strong> {orderData.name}
              </p>
              <p>
                <strong>Email:</strong> {orderData.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {orderData.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {orderData.address}
              </p>
              <p>
                <strong>Shipping Method:</strong> {shipmentMethods.find((m) => m.id === orderData.shipmentMethod)?.name}
              </p>
              <h3 className="mt-4 text-lg font-semibold">Book Details</h3>
              <p>
                <strong>Title:</strong> {orderData.title}
              </p>
              <p>
                <strong>Author:</strong> {orderData.author}
              </p>
              <p>
                <strong>Price:</strong> {orderData.price}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => handleConfirmOrder()}>
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

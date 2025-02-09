"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/CheckBox";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PDPAConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/pdpa-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted }),
      });

      if (!response.ok) {
        throw new Error("Failed to save consent");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h2 className="text-2xl font-bold">Personal Data Protection Act Consent</h2>

      <div className="prose prose-sm">
        <h3>Collection of Personal Data</h3>
        <p>
          We collect personal data including but not limited to your name, contact information, and identification
          details for the purpose of providing our services.
        </p>

        <h3>Use of Personal Data</h3>
        <p>
          Your personal data will be used for: - Account creation and management - Verification of identity - Processing
          of transactions - Communication about our services - Legal and regulatory compliance
        </p>

        <h3>Disclosure of Personal Data</h3>
        <p>
          We may share your personal data with: - Service providers and partners - Legal authorities when required by
          law - Other users (limited to necessary information for transactions)
        </p>

        <h3>Your Rights</h3>
        <p>
          You have the right to: - Access your personal data - Request corrections to your data - Withdraw consent -
          Request data deletion (subject to legal requirements)
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="consent" checked={accepted} onCheckedChange={(checked) => setAccepted(checked as boolean)} />
          <label htmlFor="consent" className="text-sm">
            I have read and agree to the collection, use, and disclosure of my personal data as described above
          </label>
        </div>

        <Button type="submit" disabled={!accepted || isLoading} className="w-full">
          {isLoading ? "Saving..." : "Accept and Continue"}
        </Button>
      </form>
    </div>
  );
}

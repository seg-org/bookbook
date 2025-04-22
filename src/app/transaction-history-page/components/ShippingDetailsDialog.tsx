"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (trackingNumber: string, trackingURL: string) => void;
}

export const ShippingDetailsDialog = ({ open, onClose, onConfirm }: Props) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingURL, setTrackingURL] = useState("");

  const handleConfirm = () => {
    onConfirm(trackingNumber, trackingURL);
    onClose();
    window.location.href = "/transaction-history-page";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>รายละเอียดจัดส่ง</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="หมายเลขพัสดุ"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Input placeholder="ลิงก์ติดตามพัสดุ" value={trackingURL} onChange={(e) => setTrackingURL(e.target.value)} />
        </div>
        <DialogFooter className="space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            ปิด
          </Button>
          <Button onClick={handleConfirm}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

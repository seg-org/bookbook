import { PhoneVerification } from "@/components/auth/PhoneVerification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyPhonePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ยืนยันเบอร์โทรศัพท์</CardTitle>
        </CardHeader>
        <CardContent>
          <PhoneVerification />
        </CardContent>
      </Card>
    </main>
  );
}

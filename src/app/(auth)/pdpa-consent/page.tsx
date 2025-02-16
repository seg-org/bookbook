import { PDPAConsent } from "@/components/auth/PDPAConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PDPAConsentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">ความยินยอมตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)</CardTitle>
        </CardHeader>
        <CardContent>
          <PDPAConsent />
        </CardContent>
      </Card>
    </main>
  );
}

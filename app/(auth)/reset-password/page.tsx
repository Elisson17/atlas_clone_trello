import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Loading from "@/components/ui/Loading";

export default async function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading text="Carregando..." />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

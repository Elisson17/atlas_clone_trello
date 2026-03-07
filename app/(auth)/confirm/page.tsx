import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function ConfirmPage() {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Email confirmado!</h2>
      <p className="text-slate-500 mb-6">
        Sua conta foi confirmada com sucesso. Agora você pode fazer login.
      </p>
      <Link href="/login">
        <Button size="lg" className="w-full">
          Ir para o login
        </Button>
      </Link>
    </div>
  );
}

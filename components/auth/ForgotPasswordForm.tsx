"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/auth";
import { forgotPasswordAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft, Mail } from "lucide-react";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("@/components/ui/ThemeToggle"), {
  ssr: false,
});

export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setError("");
    const result = await forgotPasswordAction(data.email);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Erro ao enviar email");
    }
  }

  if (success) {
    return (
      <div className="flex h-screen bg-[#0a0a12] items-center justify-center px-4">
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center max-w-sm w-full">
          <div className="mx-auto w-14 h-14 bg-blue-950/50 border border-blue-800/50 rounded-full flex items-center justify-center mb-5">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Email enviado!</h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Se o email existir em nossa base, enviaremos as instruções para
            redefinir sua senha.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a12] dark:bg-[#0a0a12] items-center justify-center px-4">
      {/* Theme toggle — top-left corner */}
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Atlas
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Informe seu email para receber as instruções
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Enviar instruções
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth";
import { resetPasswordAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setError("");
    const result = await resetPasswordAction(token, data.password, data.password_confirmation);
    if (result.success) {
      router.push("/login");
    } else {
      setError(result.error || "Erro ao redefinir senha");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Atlas</h1>
        <p className="text-slate-500 mt-2">Defina sua nova senha</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <Input
          id="password"
          label="Nova senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="password_confirmation"
          label="Confirmar nova senha"
          type="password"
          placeholder="Repita a nova senha"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Redefinir senha
        </Button>
      </form>
    </div>
  );
}

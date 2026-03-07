"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
import { registerAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Code2 } from "lucide-react";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("@/components/ui/ThemeToggle"), {
  ssr: false,
});

function SkeletonKanban() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Board title skeleton */}
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Columns */}
        <div className="flex gap-3 h-120">
          {/* Column 1 */}
          <div className="flex-1 bg-[#0d0d1a] rounded-xl p-3 flex flex-col gap-3 border border-[#1e2035]/60">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-6 rounded-full" />
            </div>
            <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
              <div className="flex gap-1.5">
                <Skeleton className="h-4 w-10 rounded-sm" />
                <Skeleton className="h-4 w-14 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
              <div className="flex items-center justify-between mt-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
              <Skeleton className="h-4 w-12 rounded-sm" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
              <div className="flex items-center justify-between mt-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-8 w-full rounded-lg mt-auto opacity-40" />
          </div>

          {/* Column 2 — highlighted with blue top bar */}
          <div className="flex-1 bg-[#0d0d1a] rounded-xl overflow-hidden flex flex-col border border-blue-900/30">
            <div className="h-0.5 w-full bg-blue-600" />
            <div className="p-3 flex flex-col gap-3 flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>
              <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
                <Skeleton className="h-4 w-16 rounded-sm" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
                <div className="flex items-center justify-between mt-1">
                  <Skeleton className="h-3 w-18" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
              <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
                <Skeleton className="h-4 w-16 rounded-sm" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
                <div className="flex items-center justify-between mt-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-full rounded-lg mt-auto opacity-40" />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex-1 bg-[#0d0d1a] rounded-xl p-3 flex flex-col gap-3 border border-[#1e2035]/60">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-6 rounded-full" />
            </div>
            <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
              <Skeleton className="h-4 w-20 rounded-sm" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
              <div className="flex items-center justify-between mt-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <div className="bg-[#111120] rounded-lg p-3 border border-[#1e2035]/40 flex flex-col gap-2">
              <Skeleton className="h-4 w-10 rounded-sm" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-5 w-5 rounded-full self-end mt-1" />
            </div>
            <Skeleton className="h-8 w-full rounded-lg mt-auto opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setError("");
    const result = await registerAction(data);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Erro ao criar conta");
    }
  }

  if (success) {
    return (
      <div className="flex h-screen bg-[#0a0a12] items-center justify-center">
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center max-w-sm mx-auto px-8">
          <div className="mx-auto w-16 h-16 bg-green-950/50 border border-green-800/50 rounded-full flex items-center justify-center mb-5">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Conta criada!</h2>
          <p className="text-slate-400 mt-2 text-sm">
            Enviamos um email de confirmação. Verifique sua caixa de entrada.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full mt-6"
            size="lg"
          >
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a12] dark:bg-[#0a0a12] overflow-hidden">
      {/* Theme toggle — top-left corner */}
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel — form (40%) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-[#0a0a12] dark:bg-[#0a0a12] overflow-y-auto">
        <div className="w-full max-w-sm mx-auto py-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Atlas
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Comece a organizar seus projetos hoje
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="first_name"
                label="Nome"
                placeholder="João"
                error={errors.first_name?.message}
                {...register("first_name")}
              />
              <Input
                id="last_name"
                label="Sobrenome"
                placeholder="Silva"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
            </div>

            <Input
              id="username"
              label="Username"
              placeholder="joaosilva"
              error={errors.username?.message}
              {...register("username")}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              id="password_confirmation"
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              error={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Entrar
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-slate-600 text-xs">
            <span>Built by Elisson</span>
            <Code2 className="h-3.5 w-3.5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Right panel — skeleton kanban (60%) */}
      <div className="hidden lg:block lg:w-[60%] bg-[#07070f] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#1e2035 1px, transparent 1px), linear-gradient(90deg, #1e2035 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <SkeletonKanban />
        {/* Left fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#07070f] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

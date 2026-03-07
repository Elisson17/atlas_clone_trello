"use client";

import { useState, useCallback, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: Window & { google?: any };
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Code2 } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GoogleIcon from "@/components/svg/GoogleIcon";

export default function LoginForm() {
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const gisInitialized = useRef(false);

  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      setGoogleLoading(true);
      setError("");
      const result = await googleLogin(response.credential);
      if (!result.success) {
        setError(result.error || "Erro ao entrar com Google");
        setGoogleLoading(false);
      }
    },
    [googleLogin],
  );

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Login com Google não configurado. Adicione NEXT_PUBLIC_GOOGLE_CLIENT_ID no .env.local");
      return;
    }
    if (!window.google?.accounts?.id) {
      setError("Google não está disponível. Verifique sua conexão.");
      return;
    }
    if (!gisInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });
      gisInitialized.current = true;
    }
    window.google.accounts.id.prompt();
  };

  async function onSubmit(data: LoginFormData) {
    setError("");
    const result = await login(data.email, data.password);
    if (!result.success) {
      setError(result.error || "Erro ao fazer login");
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a12] dark:bg-[#0a0a12] overflow-hidden">
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-[#0a0a12] dark:bg-[#0a0a12]">
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white dark:text-white">
              Bem-vindo de volta!
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Entre na sua conta para continuar
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#1e2035] bg-transparent hover:bg-[#111120] disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 py-2.5 rounded-lg transition-colors text-sm font-medium mb-5"
          >
            <GoogleIcon />
            {googleLoading ? "Entrando..." : "Continuar com o Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#1e2035]" />
            <span className="text-slate-500 text-xs">ou</span>
            <div className="flex-1 h-px bg-[#1e2035]" />
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

            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Criar conta
            </Link>
          </p>

          <div className="mt-12 flex items-center justify-center gap-1.5 text-slate-600 text-xs">
            <span>Built by Elisson</span>
            <Code2 className="h-3.5 w-3.5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <Image
          src="/images/banner_login.png"
          alt="Atlas kanban board preview"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-[#0a0a12] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#0a0a12] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0a0a12] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#0a0a12]/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

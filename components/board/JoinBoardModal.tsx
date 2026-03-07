"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinBoardSchema, type JoinBoardFormData } from "@/schemas/board";
import { joinBoardAction } from "@/actions/board";
import { useBoard } from "@/contexts/BoardContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface JoinBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinBoardModal({ isOpen, onClose }: JoinBoardModalProps) {
  const router = useRouter();
  const { loadBoards } = useBoard();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinBoardFormData>({
    resolver: zodResolver(joinBoardSchema),
  });

  async function onSubmit(data: JoinBoardFormData) {
    setError("");
    const result = await joinBoardAction(data.invite_code);
    if (result.success && result.data) {
      await loadBoards();
      reset();
      onClose();
      router.push(`/boards/${result.data.id}`);
    } else {
      setError(result.error || "Código de convite inválido");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entrar em um board">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <Input
          id="invite-code"
          label="Código de convite"
          placeholder="Cole o código de convite aqui"
          error={errors.invite_code?.message}
          {...register("invite_code")}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>
            Entrar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

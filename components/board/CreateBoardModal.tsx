"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBoardSchema, type CreateBoardFormData } from "@/schemas/board";
import { createBoardAction } from "@/actions/board";
import { useBoard } from "@/contexts/BoardContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { cn } from "@/utils/cn";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBoardModal({
  isOpen,
  onClose,
}: CreateBoardModalProps) {
  const router = useRouter();
  const { loadBoards } = useBoard();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { board_type: "personal" },
  });

  const boardType = watch("board_type");

  async function onSubmit(data: CreateBoardFormData) {
    setError("");
    const result = await createBoardAction(data);
    if (result.success && result.data) {
      await loadBoards();
      reset();
      onClose();
      router.push(`/boards/${result.data.id}`);
    } else {
      setError(result.error || "Erro ao criar board");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar novo board">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          id="board-name"
          label="Nome do board"
          placeholder="Ex: Projeto Atlas"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="board-description"
          label="Descrição (opcional)"
          placeholder="Descreva o propósito deste board..."
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("board_type", "personal")}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-colors",
                boardType === "personal"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 dark:border-[#1e2035]",
              )}
            >
              <p
                className={cn(
                  "font-medium text-sm text-slate-900",
                  boardType === "personal" ? "" : "text-white",
                )}
              >
                Pessoal
              </p>
              <p className="text-xs text-slate-500 mt-1">Apenas você</p>
            </button>
            <button
              type="button"
              onClick={() => setValue("board_type", "team")}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-colors",
                boardType === "team"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 dark:border-[#1e2035]",
              )}
            >
              <p
                className={cn(
                  "font-medium text-sm text-slate-900",
                  boardType === "team" ? "" : "text-white",
                )}
              >
                Time
              </p>
              <p className="text-xs text-slate-500 mt-1">Convide membros</p>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>
            Criar board
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBoardSchema, type UpdateBoardFormData } from "@/schemas/board";
import { updateBoardAction, deleteBoardAction } from "@/actions/board";
import {
  createLabelAction,
  updateLabelAction,
  deleteLabelAction,
} from "@/actions/label";
import { useBoard } from "@/contexts/BoardContext";
import type { Board } from "@/models/board";
import type { Label } from "@/models/label";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { toast } from "sonner";
import { Trash2, Plus, Check, Pencil, X } from "lucide-react";
import { LABEL_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface BoardSettingsModalProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
}

interface LabelRowProps {
  label: Label;
  onUpdated: () => void;
  onDeleted: (id: number) => void;
}

function LabelRow({ label, onUpdated, onDeleted }: LabelRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(label.name);
  const [editColor, setEditColor] = useState(label.color);

  async function handleSave() {
    if (!editName.trim()) return;
    const result = await updateLabelAction(label.id, {
      name: editName.trim(),
      color: editColor,
    });
    if (result.success) {
      onUpdated();
      setIsEditing(false);
    } else {
      toast.error(result.error || "Erro ao atualizar etiqueta");
    }
  }

  async function handleDelete() {
    const result = await deleteLabelAction(label.id);
    if (result.success) {
      onDeleted(label.id);
    } else {
      toast.error(result.error || "Erro ao excluir etiqueta");
    }
  }

  if (isEditing) {
    return (
      <div className="py-2 space-y-2">
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full text-sm bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-[#1e2035] rounded-md px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {LABEL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setEditColor(c)}
              className={cn(
                "w-5 h-5 rounded-full transition-all",
                editColor === c
                  ? "ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#0d0d1a] ring-slate-400 scale-110"
                  : "opacity-60 hover:opacity-100",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            <Check className="h-3 w-3" />
            Salvar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 text-xs transition-colors"
          >
            <X className="h-3 w-3" />
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 py-2 group">
      <span
        className="w-8 h-5 rounded flex-shrink-0"
        style={{ backgroundColor: label.color }}
      />
      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">
        {label.name}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 rounded text-slate-400 hover:text-blue-500 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function BoardSettingsModal({
  board,
  isOpen,
  onClose,
}: BoardSettingsModalProps) {
  const router = useRouter();
  const { loadBoard, loadBoards, labels, loadLabels } = useBoard();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBoardFormData>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      name: board.name,
      description: board.description || "",
    },
  });

  async function onSubmit(data: UpdateBoardFormData) {
    const result = await updateBoardAction(board.id, data);
    if (result.success) {
      await loadBoard(board.id);
      toast.success("Board atualizado!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao atualizar board");
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Tem certeza que deseja excluir este board? Esta ação é irreversível.",
      )
    )
      return;
    setIsDeleting(true);
    const result = await deleteBoardAction(board.id);
    if (result.success) {
      await loadBoards();
      toast.success("Board excluído!");
      router.push("/boards");
    } else {
      toast.error(result.error || "Erro ao excluir board");
    }
    setIsDeleting(false);
  }

  async function handleCreateLabel() {
    if (!newLabelName.trim()) return;
    const result = await createLabelAction(board.id, {
      name: newLabelName.trim(),
      color: newLabelColor,
    });
    if (result.success) {
      await loadLabels(board.id);
      setNewLabelName("");
      setNewLabelColor(LABEL_COLORS[0]);
      setIsAddingLabel(false);
    } else {
      toast.error(result.error || "Erro ao criar etiqueta");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações do Board" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="settings-name"
          label="Nome"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="settings-description"
          label="Descrição"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>
            Salvar
          </Button>
        </div>
      </form>

      <hr className="my-5 border-slate-200 dark:border-[#1e2035]" />

      {/* Labels section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Etiquetas
          </h4>
          <button
            onClick={() => setIsAddingLabel(!isAddingLabel)}
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
          >
            {isAddingLabel ? (
              <>
                <X className="h-3.5 w-3.5" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Nova etiqueta
              </>
            )}
          </button>
        </div>

        {isAddingLabel && (
          <div className="mb-3 p-3 bg-slate-50 dark:bg-[#111120] rounded-lg border border-slate-200 dark:border-[#1e2035] space-y-2.5">
            <input
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Nome da etiqueta..."
              className="w-full text-sm bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-[#1e2035] rounded-md px-2.5 py-1.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateLabel();
                if (e.key === "Escape") setIsAddingLabel(false);
              }}
            />
            <div className="flex flex-wrap gap-1.5">
              {LABEL_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewLabelColor(c)}
                  className={cn(
                    "w-5 h-5 rounded-full transition-all",
                    newLabelColor === c
                      ? "ring-2 ring-offset-1 ring-offset-slate-50 dark:ring-offset-[#111120] ring-slate-400 scale-110"
                      : "opacity-60 hover:opacity-100",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {newLabelName.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Prévia:
                </span>
                <span
                  className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${newLabelColor}20`,
                    color: newLabelColor,
                  }}
                >
                  {newLabelName}
                </span>
              </div>
            )}

            <button
              onClick={handleCreateLabel}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              Criar etiqueta
            </button>
          </div>
        )}

        <div className="divide-y divide-slate-100 dark:divide-[#1e2035]">
          {labels.map((label) => (
            <LabelRow
              key={label.id}
              label={label}
              onUpdated={() => loadLabels(board.id)}
              onDeleted={() => loadLabels(board.id)}
            />
          ))}
          {labels.length === 0 && !isAddingLabel && (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-2">
              Nenhuma etiqueta criada neste board.
            </p>
          )}
        </div>
      </div>

      <hr className="my-5 border-slate-200 dark:border-[#1e2035]" />

      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
        <h4 className="text-sm font-medium text-red-900 dark:text-red-400 mb-2">
          Zona de perigo
        </h4>
        <p className="text-xs text-red-700 dark:text-red-500 mb-3">
          Excluir este board irá remover todas as colunas, cartões e dados
          associados permanentemente.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir board
        </Button>
      </div>
    </Modal>
  );
}

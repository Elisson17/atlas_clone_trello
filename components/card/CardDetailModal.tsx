"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  User,
  Flag,
  AlignLeft,
  Trash2,
  Zap,
  ArrowUp,
  Minus,
  ArrowDown,
} from "lucide-react";
import type { CardDetail } from "@/models/card";
import {
  fetchCardAction,
  updateCardAction,
  deleteCardAction,
} from "@/actions/card";
import { useBoard } from "@/contexts/BoardContext";
import CardComments from "@/components/card/CardComments";
import CardActivity from "@/components/card/CardActivity";
import CardLabels from "@/components/card/CardLabels";
import { formatInputDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import Avatar from "@/components/ui/Avatar";

interface CardDetailModalProps {
  cardId: number;
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  {
    value: "urgent",
    label: "Urgente",
    icon: Zap,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    value: "high",
    label: "Alta",
    icon: ArrowUp,
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    value: "medium",
    label: "Média",
    icon: Minus,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    value: "low",
    label: "Baixa",
    icon: ArrowDown,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
] as const;

export default function CardDetailModal({
  cardId,
  isOpen,
  onClose,
}: CardDetailModalProps) {
  const { updateCardInColumn, loadColumns, currentBoard } = useBoard();
  const [card, setCard] = useState<CardDetail | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "activity">(
    "comments",
  );

  const loadCard = useCallback(() => {
    fetchCardAction(cardId).then((result) => {
      if (result.success && result.data) {
        setCard(result.data);
        setTitle(result.data.title);
        setDescription(result.data.description || "");
        updateCardInColumn(result.data);
      }
    });
  }, [cardId, updateCardInColumn]);

  useEffect(() => {
    if (isOpen) loadCard();
  }, [isOpen, loadCard]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  async function handleUpdateTitle() {
    if (!card || !title.trim() || title === card.title) {
      setIsEditingTitle(false);
      return;
    }
    const result = await updateCardAction(card.id, { title: title.trim() });
    if (result.success && result.data) {
      const updated = { ...card, ...result.data };
      setCard(updated);
      updateCardInColumn(updated);
    }
    setIsEditingTitle(false);
  }

  async function handleUpdateDescription() {
    if (!card) return;
    const newDesc = description.trim() || null;
    if (newDesc === card.description) {
      setIsEditingDesc(false);
      return;
    }
    const result = await updateCardAction(card.id, { description: newDesc });
    if (result.success && result.data) {
      const updated = { ...card, ...result.data };
      setCard(updated);
      updateCardInColumn(updated);
    }
    setIsEditingDesc(false);
  }

  async function handleUpdatePriority(priority: string | null) {
    if (!card) return;
    const result = await updateCardAction(card.id, { priority });
    if (result.success && result.data) {
      const updated = { ...card, ...result.data };
      setCard(updated);
      updateCardInColumn(updated);
    }
  }

  async function handleUpdateDate(
    field: "start_date" | "due_date",
    value: string,
  ) {
    if (!card) return;
    const result = await updateCardAction(card.id, { [field]: value || null });
    if (result.success && result.data) {
      const updated = { ...card, ...result.data };
      setCard(updated);
      updateCardInColumn(updated);
    }
  }

  async function handleDelete() {
    if (!card) return;
    if (!confirm("Tem certeza que deseja excluir este cartão?")) return;
    const result = await deleteCardAction(card.id);
    if (result.success && currentBoard) {
      await loadColumns(currentBoard.id);
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#0d0d1a] rounded-xl shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] max-h-[90vh] flex flex-col border border-slate-200 dark:border-[#1e2035]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {!card ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            Carregando...
          </div>
        ) : (
          <div className="flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#1e2035] shrink-0">
              {isEditingTitle ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateTitle();
                    if (e.key === "Escape") {
                      setTitle(card.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="text-xl font-semibold text-slate-900 dark:text-slate-100 w-full border-b-2 border-blue-500 bg-transparent focus:outline-none pb-1 pr-8"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-xl font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors pr-8 leading-snug"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {card.title}
                </h2>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Left panel */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-6 py-4 space-y-5">
                {/* Labels */}
                <CardLabels
                  cardId={card.id}
                  currentLabels={card.labels}
                  onUpdate={loadCard}
                />

                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlignLeft className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Descrição
                    </h4>
                  </div>
                  {isEditingDesc ? (
                    <div className="space-y-2">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-slate-200 dark:border-[#1e2035] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111120] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateDescription}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setDescription(card.description || "");
                            setIsEditingDesc(false);
                          }}
                          className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap cursor-pointer hover:bg-slate-50 dark:hover:bg-[#111120] rounded-lg p-2.5 min-h-15 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#1e2035]"
                      onClick={() => setIsEditingDesc(true)}
                    >
                      {card.description || (
                        <span className="text-slate-400 dark:text-slate-600">
                          Adicione uma descrição mais detalhada...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div>
                  <div className="flex gap-1 border-b border-slate-200 dark:border-[#1e2035] mb-4">
                    <button
                      onClick={() => setActiveTab("comments")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                        activeTab === "comments"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
                      )}
                    >
                      Comentários
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                        activeTab === "activity"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
                      )}
                    >
                      Atividade
                    </button>
                  </div>

                  {activeTab === "comments" ? (
                    <CardComments cardId={card.id} />
                  ) : (
                    <CardActivity cardId={card.id} />
                  )}
                </div>
              </div>

              {/* Right sidebar */}
              <div className="w-56 shrink-0 border-l border-slate-100 dark:border-[#1e2035] px-4 py-4 space-y-5 overflow-y-auto">
                {/* Priority */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Flag className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Prioridade
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {priorityOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = card.priority === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            handleUpdatePriority(isActive ? null : opt.value)
                          }
                          className={cn(
                            "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                            isActive
                              ? cn(opt.bg, opt.color)
                              : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#111120] hover:border-slate-200 dark:hover:border-[#1e2035]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isActive
                                ? opt.color
                                : "text-slate-400 dark:text-slate-500",
                            )}
                          />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Responsável
                    </h4>
                  </div>
                  {card.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={card.assignee.avatar_url}
                        name={`${card.assignee.first_name} ${card.assignee.last_name}`}
                        size="sm"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                        {card.assignee.first_name} {card.assignee.last_name}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Nenhum responsável
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Datas
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-500 block mb-1">
                        Início
                      </label>
                      <input
                        type="date"
                        value={formatInputDate(card.start_date)}
                        onChange={(e) =>
                          handleUpdateDate("start_date", e.target.value)
                        }
                        className="w-full border border-slate-200 dark:border-[#1e2035] rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-[#111120] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-500 block mb-1">
                        Entrega
                      </label>
                      <input
                        type="date"
                        value={formatInputDate(card.due_date)}
                        onChange={(e) =>
                          handleUpdateDate("due_date", e.target.value)
                        }
                        className="w-full border border-slate-200 dark:border-[#1e2035] rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-[#111120] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-[#1e2035]">
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    Excluir cartão
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

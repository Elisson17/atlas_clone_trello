"use client";

import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  Check,
  X,
  GripVertical,
} from "lucide-react";
import type { Column } from "@/models/column";
import type { Card } from "@/models/card";
import { useBoard } from "@/contexts/BoardContext";
import KanbanCard from "@/components/kanban/KanbanCard";
import { cn } from "@/utils/cn";
import { COLUMN_COLORS } from "@/utils/constants";

interface KanbanColumnProps {
  column: Column;
  onCardClick: (card: Card) => void;
}

export default function KanbanColumn({
  column,
  onCardClick,
}: KanbanColumnProps) {
  const { addCard, removeColumn, updateColumn } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);
  const [editColor, setEditColor] = useState(column.color);
  const [isDragging, setIsDragging] = useState(false);
  const [columnEdge, setColumnEdge] = useState<Edge | null>(null);

  const columnRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colEl = columnRef.current;
    const handleEl = dragHandleRef.current;
    const cardsEl = cardsContainerRef.current;
    if (!colEl || !handleEl || !cardsEl) return;

    // Torna a coluna arrastável, mas APENAS a partir do ícone de grip.
    // dragHandle restringe o elemento que inicia o arrasto.
    const cleanupDrag = draggable({
      element: colEl,
      dragHandle: handleEl,
      getInitialData: () => ({ type: "column", columnId: column.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    // Drop target na div externa da coluna:
    // - Aceita outras COLUNAS: detecta borda esquerda/direita para saber onde inserir
    // - Aceita CARDS: funciona como fallback quando o cursor está na área vazia
    //   da coluna (ex: coluna sem cards, ou abaixo de todos os cards)
    const cleanupColumnDrop = dropTargetForElements({
      element: colEl,
      canDrop: ({ source }) =>
        (source.data.type === "column" && source.data.columnId !== column.id) ||
        source.data.type === "card",
      getData: ({ input, element, source }) => {
        if (source.data.type === "column") {
          return attachClosestEdge(
            { type: "column", columnId: column.id },
            { input, element, allowedEdges: ["left", "right"] },
          );
        }
        // Para cards, retorna só o columnId sem edge — significa "inserir no fim"
        return { type: "column", columnId: column.id };
      },
      onDragEnter: ({ self, source }) => {
        if (source.data.type === "column") {
          setColumnEdge(extractClosestEdge(self.data));
        }
      },
      onDrag: ({ self, source }) => {
        if (source.data.type === "column") {
          setColumnEdge(extractClosestEdge(self.data));
        }
      },
      onDragLeave: () => setColumnEdge(null),
      onDrop: () => setColumnEdge(null),
    });

    // Drop target no container de cards:
    // Tem prioridade maior que a coluna por ser mais interno.
    // Quando um card é solto aqui (e não sobre outro card), vai para o fim da coluna.
    const cleanupCardsDrop = dropTargetForElements({
      element: cardsEl,
      canDrop: ({ source }) => source.data.type === "card",
      getData: () => ({ type: "column", columnId: column.id }),
    });

    return () => {
      cleanupDrag();
      cleanupColumnDrop();
      cleanupCardsDrop();
    };
  }, [column.id]);

  function openEdit() {
    setEditName(column.name);
    setEditColor(column.color);
    setIsEditing(true);
    setShowMenu(false);
  }

  async function handleSaveEdit() {
    const data: { name?: string; color?: string } = {};
    if (editName.trim() && editName.trim() !== column.name)
      data.name = editName.trim();
    if (editColor !== column.color) data.color = editColor;
    if (Object.keys(data).length > 0) {
      await updateColumn(column.id, data);
    }
    setIsEditing(false);
  }

  async function handleAddCard() {
    if (!newCardTitle.trim()) return;
    const success = await addCard(column.id, newCardTitle.trim());
    if (success) {
      setNewCardTitle("");
      setIsAdding(false);
    }
  }

  async function handleDeleteColumn() {
    if (
      confirm(
        "Tem certeza que deseja excluir esta coluna e todos os seus cartões?",
      )
    ) {
      await removeColumn(column.id);
    }
    setShowMenu(false);
  }

  return (
    <div className="relative shrink-0 w-72">
      {/* Linha vertical indicando onde a coluna será inserida ao reordenar */}
      {columnEdge === "left" && (
        <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-blue-500 rounded z-20 pointer-events-none" />
      )}
      {columnEdge === "right" && (
        <div className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-blue-500 rounded z-20 pointer-events-none" />
      )}

      <div
        ref={columnRef}
        className={cn(
          "w-72 bg-slate-100 dark:bg-[#0d0d1a] rounded-xl flex flex-col max-h-[calc(100vh-10rem)] transition-colors overflow-hidden",
          isDragging &&
            "opacity-50 shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* Barra colorida no topo */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{ backgroundColor: editColor }}
        />

        {/* Formulário de edição */}
        {isEditing ? (
          <div className="px-3 py-2.5 space-y-2.5 border-b border-slate-200 dark:border-[#1e2035]">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nome da coluna"
              className="w-full text-sm bg-white dark:bg-[#111120] border border-slate-200 dark:border-[#1e2035] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />

            <div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Cor
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COLUMN_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all",
                      editColor === color
                        ? "ring-2 ring-offset-1 ring-offset-slate-100 dark:ring-offset-[#0d0d1a] ring-white scale-110"
                        : "opacity-70 hover:opacity-100",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
              >
                <Check className="h-3 w-3" />
                Salvar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
              >
                <X className="h-3 w-3" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          /* Cabeçalho normal */
          <div className="px-3 py-2.5 flex items-center gap-1.5 justify-between">
            {/* Drag handle — único ponto que inicia o arrasto da coluna */}
            <button
              ref={dragHandleRef}
              className="shrink-0 p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
              tabIndex={-1}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3
                className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate cursor-pointer"
                onDoubleClick={openEdit}
              >
                {column.name}
              </h3>
              <span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1e2035] px-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {column.cards.length}
              </span>
            </div>

            <div className="relative ml-1">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1e2035] transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#0d0d1a] rounded-lg shadow-lg border border-slate-200 dark:border-[#1e2035] py-1 z-20">
                    <button
                      onClick={openEdit}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1a1a2e]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={handleDeleteColumn}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Área de cards — registrada como drop target de fallback */}
        <div
          ref={cardsContainerRef}
          className="flex-1 overflow-y-auto px-2 pb-1 space-y-2 min-h-10"
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </div>

        {/* Adicionar card */}
        <div className="p-2">
          {isAdding ? (
            <div className="space-y-2">
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard();
                  }
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewCardTitle("");
                  }
                }}
                placeholder="Título do cartão..."
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-200 dark:border-[#1e2035] bg-white dark:bg-[#111120] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCard}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCardTitle("");
                  }}
                  className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1e2035] rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

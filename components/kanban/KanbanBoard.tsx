"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { Plus } from "lucide-react";
import { useBoard } from "@/contexts/BoardContext";
import type { Card } from "@/models/card";
import type { Column } from "@/models/column";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import CardDetailModal from "@/components/card/CardDetailModal";
import Loading from "@/components/ui/Loading";
import { COLUMN_COLORS } from "@/utils/constants";
import { useBoardChannel } from "@/hooks/useBoardChannel";

interface KanbanBoardProps {
  boardId: number;
}

export default function KanbanBoard({ boardId }: KanbanBoardProps) {
  const {
    columns,
    isLoadingColumns,
    loadColumns,
    loadLabels,
    addColumn,
    moveCard,
    reorderColumns,
    setColumns,
  } = useBoard();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // Ref para acessar o valor mais recente de columns dentro do monitorForElements
  // sem precisar re-registrar o monitor toda vez que columns muda.
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  useEffect(() => {
    loadColumns(boardId);
    loadLabels(boardId);
  }, [boardId, loadColumns, loadLabels]);

  useBoardChannel(boardId);

  // monitorForElements escuta TODOS os eventos de drag do pragmatic globalmente.
  // É o equivalente ao DndContext do dnd-kit, mas sem ser um wrapper React.
  // Registramos uma única vez (deps vazias) e acessamos columns via ref.
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const targets = location.current.dropTargets;
        if (!targets.length) return;

        const innerTarget = targets[0];
        const cols = columnsRef.current;

        if (source.data.type === "card") {
          const cardId = source.data.cardId as number;

          if (innerTarget.data.type === "card") {
            const targetCardId = innerTarget.data.cardId as number;
            const edge = extractClosestEdge(innerTarget.data);

            const sourceCol = cols.find((c) =>
              c.cards.some((card) => card.id === cardId),
            );
            const targetCol = cols.find((c) =>
              c.cards.some((card) => card.id === targetCardId),
            );
            if (!sourceCol || !targetCol) return;

            const sourceIndex = sourceCol.cards.findIndex(
              (c) => c.id === cardId,
            );
            const targetIndex = targetCol.cards.findIndex(
              (c) => c.id === targetCardId,
            );

            let destIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;

            if (sourceCol.id === targetCol.id) {
              if (sourceIndex < destIndex) destIndex -= 1;
              if (sourceIndex === destIndex) return;

              const cards = [...sourceCol.cards];
              const [moved] = cards.splice(sourceIndex, 1);
              cards.splice(destIndex, 0, moved);

              setColumns(
                cols.map((c) => (c.id === sourceCol.id ? { ...c, cards } : c)),
              );
              moveCard(cardId, sourceCol.id, destIndex);
            } else {
              const movedCard = {
                ...sourceCol.cards[sourceIndex],
                column_id: targetCol.id,
              };

              setColumns(
                cols.map((c) => {
                  if (c.id === sourceCol.id) {
                    return {
                      ...c,
                      cards: c.cards.filter((card) => card.id !== cardId),
                    };
                  }
                  if (c.id === targetCol.id) {
                    const cards = [...c.cards];
                    cards.splice(destIndex, 0, movedCard);
                    return { ...c, cards };
                  }
                  return c;
                }),
              );
              moveCard(cardId, targetCol.id, destIndex);
            }
          } else if (innerTarget.data.type === "column") {
            const targetColumnId = innerTarget.data.columnId as number;
            const sourceCol = cols.find((c) =>
              c.cards.some((card) => card.id === cardId),
            );
            const targetCol = cols.find((c) => c.id === targetColumnId);
            if (!sourceCol || !targetCol || sourceCol.id === targetCol.id)
              return;

            const movedCard = {
              ...sourceCol.cards.find((c) => c.id === cardId)!,
              column_id: targetCol.id,
            };
            const destIndex = targetCol.cards.length;

            setColumns(
              cols.map((c) => {
                if (c.id === sourceCol.id) {
                  return {
                    ...c,
                    cards: c.cards.filter((card) => card.id !== cardId),
                  };
                }
                if (c.id === targetCol.id) {
                  return { ...c, cards: [...c.cards, movedCard] };
                }
                return c;
              }),
            );
            moveCard(cardId, targetCol.id, destIndex);
          }
        }

        // ── DROP DE COLUNA ──────────────────────────────────────────────────
        if (
          source.data.type === "column" &&
          innerTarget.data.type === "column"
        ) {
          const sourceColId = source.data.columnId as number;
          const targetColId = innerTarget.data.columnId as number;
          if (sourceColId === targetColId) return;

          const edge = extractClosestEdge(innerTarget.data);
          const sourceIndex = cols.findIndex((c) => c.id === sourceColId);
          const targetIndex = cols.findIndex((c) => c.id === targetColId);
          if (sourceIndex === -1 || targetIndex === -1) return;

          let destIndex = edge === "right" ? targetIndex + 1 : targetIndex;
          if (sourceIndex < destIndex) destIndex -= 1;

          const newCols = [...cols];
          const [movedCol] = newCols.splice(sourceIndex, 1);
          newCols.splice(destIndex, 0, movedCol);

          setColumns(newCols);
          reorderColumns(
            newCols.map((c: Column, i: number) => ({
              id: c.id,
              position: i + 1,
            })),
          );
        }
      },
    });
  }, [setColumns, moveCard, reorderColumns]);

  const handleAddColumn = useCallback(async () => {
    if (!newColumnName.trim()) return;
    const color = COLUMN_COLORS[columns.length % COLUMN_COLORS.length];
    const success = await addColumn(boardId, newColumnName.trim(), color);
    if (success) {
      setNewColumnName("");
      setIsAddingColumn(false);
    }
  }, [newColumnName, columns.length, addColumn, boardId]);

  if (isLoadingColumns) {
    return <Loading className="py-24" text="Carregando board..." />;
  }

  return (
    <>
      <div className="flex-1 overflow-x-auto bg-slate-100 dark:bg-[#07070f] p-4">
        <div className="flex gap-4 items-start h-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCardClick={(card) => setSelectedCard(card)}
            />
          ))}

          <div className="shrink-0 w-72">
            {isAddingColumn ? (
              <div className="bg-slate-200 dark:bg-[#0d0d1a] border border-slate-300 dark:border-[#1e2035] rounded-xl p-3 space-y-2">
                <input
                  placeholder="Nome da coluna..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn();
                    if (e.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 dark:border-[#1e2035] bg-white dark:bg-[#111120] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }}
                    className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-slate-300 dark:border-[#1e2035] bg-slate-200/50 dark:bg-[#0d0d1a]/50 hover:bg-slate-200 dark:hover:bg-[#0d0d1a] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar coluna
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardDetailModal
          cardId={selectedCard.id}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}

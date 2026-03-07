"use client";

import { useEffect, useRef } from "react";
import { getCableConsumer } from "@/services/cable";
import { useBoard } from "@/contexts/BoardContext";
import type { CardPriority } from "@/models/card";
import type { Column } from "@/models/column";

export function useBoardChannel(boardId: number) {
  const { setColumns, refreshColumns, columns } = useBoard();

  // Refs estáveis para usar dentro do callback do ActionCable sem re-assinar
  const columnsRef = useRef(columns);
  const setColumnsRef = useRef(setColumns);
  const refreshColumnsRef = useRef(refreshColumns);

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);
  useEffect(() => {
    setColumnsRef.current = setColumns;
  }, [setColumns]);
  useEffect(() => {
    refreshColumnsRef.current = refreshColumns;
  }, [refreshColumns]);

  useEffect(() => {
    const consumer = getCableConsumer();

    const subscription = consumer.subscriptions.create(
      { channel: "BoardChannel", board_id: boardId },
      {
        received(data: Record<string, unknown>) {
          const cols = columnsRef.current;
          const set = setColumnsRef.current;
          const reload = refreshColumnsRef.current;

          switch (data.type) {
            // ── Eventos que requerem recarga completa ────────────────────────
            case "card_created":
            case "card_moved":
            case "column_created":
            case "columns_reordered":
              reload(boardId);
              break;

            // ── Atualização de card ──────────────────────────────────────────
            case "card_updated": {
              const card = data.card as {
                id: number;
                title: string;
                priority: CardPriority | null;
                due_date: string | null;
                assignee: { id: number; username: string; first_name: string; last_name: string; avatar_url: string | null } | null;
              };
              set(
                cols.map((col) => ({
                  ...col,
                  cards: col.cards.map((c) =>
                    c.id === card.id
                      ? {
                          ...c,
                          title: card.title,
                          priority: card.priority,
                          due_date: card.due_date,
                          assignee: card.assignee,
                        }
                      : c,
                  ),
                })),
              );
              break;
            }

            // ── Remoção de card ──────────────────────────────────────────────
            case "card_deleted": {
              const cardId = data.card_id as number;
              set(
                cols.map((col) => ({
                  ...col,
                  cards: col.cards.filter((c) => c.id !== cardId),
                })),
              );
              break;
            }

            // ── Atualização de coluna ────────────────────────────────────────
            case "column_updated": {
              const col = data.column as {
                id: number;
                name: string;
                color: string;
              };
              set(
                cols.map((c) =>
                  c.id === col.id
                    ? { ...c, name: col.name, color: col.color }
                    : c,
                ),
              );
              break;
            }

            // ── Remoção de coluna ────────────────────────────────────────────
            case "column_deleted": {
              const columnId = data.column_id as number;
              set(cols.filter((c: Column) => c.id !== columnId));
              break;
            }
          }
        },
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [boardId]);
}

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
  MessageSquare,
  Calendar,
  ArrowDown,
  ArrowUp,
  Minus,
  Zap,
} from "lucide-react";
import type { Card } from "@/models/card";
import { isOverdue, isDueSoon, formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import Avatar from "@/components/ui/Avatar";

interface KanbanCardProps {
  card: Card;
  onClick: () => void;
}

const priorityConfig = {
  urgent: { icon: Zap, color: "text-red-500" },
  high: { icon: ArrowUp, color: "text-orange-500" },
  medium: { icon: Minus, color: "text-amber-500" },
  low: { icon: ArrowDown, color: "text-blue-500" },
} as const;

export default function KanbanCard({ card, onClick }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Torna o card arrastável.
    // getInitialData define os dados que ficam disponíveis para os drop targets
    // e para o monitorForElements no KanbanBoard.
    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({
        type: "card",
        cardId: card.id,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    // Torna o card um alvo de drop para OUTROS cards.
    // attachClosestEdge detecta se o cursor está mais perto do topo ou fundo,
    // o que determina se o card vai ser inserido antes ou depois deste.
    const cleanupDrop = dropTargetForElements({
      element: el,
      canDrop: ({ source }) =>
        source.data.type === "card" && source.data.cardId !== card.id,
      getData: ({ input, element }) =>
        attachClosestEdge(
          { type: "card", cardId: card.id },
          { input, element, allowedEdges: ["top", "bottom"] },
        ),
      onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [card.id]);

  const overdue = card.due_date ? isOverdue(card.due_date) : false;
  const dueSoon = card.due_date ? isDueSoon(card.due_date) : false;
  const priority = card.priority as keyof typeof priorityConfig | null;
  const PriorityIcon = priority ? priorityConfig[priority]?.icon : null;
  const priorityColor = priority ? priorityConfig[priority]?.color : null;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={cn(
        "relative bg-white dark:bg-[#111120] rounded-lg border border-slate-200 dark:border-[#1e2035]/60 p-3 cursor-grab active:cursor-grabbing",
        "hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        "transition-all duration-150",
        isDragging && "opacity-40",
      )}
    >
      {/* Linha indicadora de drop acima do card */}
      {closestEdge === "top" && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded z-20 pointer-events-none" />
      )}

        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-snug">
          {card.title}
        </p>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2">
            {PriorityIcon && priorityColor && (
              <PriorityIcon
                className={cn("h-3.5 w-3.5 shrink-0", priorityColor)}
              />
            )}

            {card.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded",
                  overdue
                    ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                    : dueSoon
                      ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                      : "bg-slate-100 dark:bg-[#1e2035] text-slate-500 dark:text-slate-400",
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(card.due_date)}
              </span>
            )}

            {card.comments_count > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                <MessageSquare className="h-3 w-3" />
                {card.comments_count}
              </span>
            )}
          </div>

          {card.assignee && (
            <Avatar
              src={card.assignee.avatar_url}
              name={`${card.assignee.first_name} ${card.assignee.last_name}`}
              size="sm"
            />
          )}
        </div>

      {/* Linha indicadora de drop abaixo do card */}
      {closestEdge === "bottom" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded z-20 pointer-events-none" />
      )}
    </div>
  );
}

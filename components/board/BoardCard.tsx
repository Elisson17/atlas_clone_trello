"use client";

import Link from "next/link";
import { Star, Users, Lock, Globe } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Board } from "@/models/board";
import { useBoard } from "@/contexts/BoardContext";

interface BoardCardProps {
  board: Board;
}

function MiniBoardPreview({ boardId }: { boardId: number }) {
  const n = boardId;
  const configs = [
    { cards: 1 + (n % 2), color: "#3b82f6" },
    { cards: 1 + ((n + 1) % 3), color: "#8b5cf6" },
    { cards: 1 + ((n + 2) % 2), color: "#22c55e" },
  ];

  return (
    <div className="flex gap-2 h-18 overflow-hidden rounded-lg bg-slate-100 dark:bg-[#07070f] p-2 mb-4">
      {configs.map((col, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col gap-1.5 bg-white dark:bg-[#0d0d1a] rounded-md p-1.5 border border-slate-200/60 dark:border-[#1e2035]/60 overflow-hidden"
        >
          <div
            className="h-0.5 w-full rounded-full"
            style={{ backgroundColor: col.color }}
          />
          {Array.from({ length: Math.min(col.cards, 3) }).map((_, j) => (
            <div
              key={j}
              className="h-3 rounded bg-slate-200 dark:bg-[#1e2035] w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BoardCard({ board }: BoardCardProps) {
  const { toggleFavorite } = useBoard();

  return (
    <Link
      href={`/boards/${board.id}`}
      className="group relative block rounded-xl border border-slate-200 dark:border-[#1e2035] bg-white dark:bg-[#0d0d1a] p-4 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-blue-300 dark:hover:border-blue-800/60 transition-all duration-200"
    >
      <MiniBoardPreview boardId={board.id} />

      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-slate-900 dark:text-white truncate text-sm leading-snug">
          {board.name}
        </h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(board.id, board.is_favorite);
          }}
          className={cn(
            "shrink-0 p-1 rounded transition-all",
            board.is_favorite
              ? "text-yellow-500 opacity-100"
              : "text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-yellow-500"
          )}
        >
          <Star
            className={cn("h-4 w-4", board.is_favorite && "fill-yellow-500")}
          />
        </button>
      </div>

      {board.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {board.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1e2035]">
        <span
          className={cn(
            "flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium",
            board.board_type === "team"
              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              : "bg-slate-100 dark:bg-[#1e2035] text-slate-500 dark:text-slate-400"
          )}
        >
          {board.board_type === "team" ? (
            <>
              <Globe className="h-3 w-3" />
              Team
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              Pessoal
            </>
          )}
        </span>

        {board.board_type === "team" && board.members_count > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <Users className="h-3.5 w-3.5" />
            {board.members_count}
          </span>
        )}
      </div>
    </Link>
  );
}

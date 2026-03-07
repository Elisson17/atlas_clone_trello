"use client";

import { Star, Users, MoreHorizontal, Globe, Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Board } from "@/models/board";
import { useBoard } from "@/contexts/BoardContext";
import Avatar from "@/components/ui/Avatar";

interface HeaderProps {
  board: Board;
  onOpenMembers?: () => void;
  onOpenSettings?: () => void;
}

export default function Header({
  board,
  onOpenMembers,
  onOpenSettings,
}: HeaderProps) {
  const { toggleFavorite } = useBoard();

  return (
    <header className="h-14 bg-white/80 dark:bg-[#0d0d1a]/80 backdrop-blur-sm border-b border-slate-200 dark:border-[#1e2035] flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {board.name}
        </h1>
        <button
          onClick={() => toggleFavorite(board.id, board.is_favorite)}
          className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-[#1a1a2e]"
        >
          <Star
            className={cn(
              "h-5 w-5",
              board.is_favorite
                ? "text-yellow-500 fill-yellow-500"
                : "text-slate-400 dark:text-slate-500",
            )}
          />
        </button>
        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1e2035] px-2 py-1 rounded-full">
          {board.board_type === "team" ? (
            <>
              <Globe className="h-3 w-3" /> Team
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" /> Pessoal
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMembers}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
        >
          <Users className="h-4 w-4" />
          <div className="flex -space-x-2">
            <Avatar
              src={board.owner.avatar_url}
              name={`${board.owner.first_name} ${board.owner.last_name}`}
              size="sm"
            />
          </div>
          {board.members_count > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{board.members_count}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  Plus,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { useBoard } from "@/contexts/BoardContext";
import Avatar from "@/components/ui/Avatar";
import ThemeToggle from "../ui/ThemeToggle";

interface SidebarProps {
  onCreateBoard: () => void;
}

export default function Sidebar({ onCreateBoard }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { boards, loadBoards } = useBoard();

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const favoriteBoards = boards.filter((b) => b.is_favorite);
  const myBoards = boards.filter((b) => b.owner.id === user?.id);

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#0d0d1a] border-r border-slate-200 dark:border-[#1e2035] flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 px-4 border-b border-slate-200 dark:border-[#1e2035] flex justify-between items-center">
        <Link href="/boards" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Atlas
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <Link
          href="/boards"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/boards"
              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a2e] hover:text-slate-900 dark:hover:text-white",
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Inicial</span>
        </Link>

        <div className="pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Favoritos
            </span>
          </div>
          {favoriteBoards.length === 0 ? (
            <p className="px-3 text-xs text-slate-400 dark:text-slate-500">
              Nenhum favorito
            </p>
          ) : (
            favoriteBoards.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                  pathname === `/boards/${board.id}`
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a2e]",
                )}
              >
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="truncate flex-1">{board.name}</span>
              </Link>
            ))
          )}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Meus Boards
            </span>
            <button
              onClick={onCreateBoard}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {myBoards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors group",
                pathname === `/boards/${board.id}`
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a2e]",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="truncate flex-1 dark:text-slate-300 group-hover:dark:text-white">
                {board.name}
              </span>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-[#1e2035]">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar
            src={user?.avatar_url}
            name={user ? `${user.first_name} ${user.last_name}` : "U"}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              @{user?.username}
            </p>
          </div>
          <Link
            href="/settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
            title="Configurações"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={logout}
            className="p-1.5 cursor-pointer rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

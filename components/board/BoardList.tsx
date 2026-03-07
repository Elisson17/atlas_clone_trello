"use client";

import { useEffect, useState } from "react";
import { Plus, UserPlus, LayoutDashboard, Search } from "lucide-react";
import { useBoard } from "@/contexts/BoardContext";
import BoardCard from "@/components/board/BoardCard";
import CreateBoardModal from "@/components/board/CreateBoardModal";
import JoinBoardModal from "@/components/board/JoinBoardModal";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

export default function BoardList() {
  const { boards, isLoadingBoards, loadBoards } = useBoard();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoadingBoards) {
    return <Loading className="py-24" text="Carregando boards..." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Boards</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {boards.length} {boards.length === 1 ? "board" : "boards"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setJoinOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            Entrar em board
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Novo board
          </Button>
        </div>
      </div>

      {boards.length > 0 && (
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs pl-9 pr-4 py-1.5 border border-slate-200 dark:border-[#1e2035] rounded-lg text-sm bg-white dark:bg-[#0d0d1a] text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      )}

      {filtered.length === 0 && boards.length === 0 ? (
        <EmptyState
          icon={<LayoutDashboard className="h-12 w-12" />}
          title="Nenhum board ainda"
          description="Crie seu primeiro board para começar a organizar suas tarefas."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar board
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-12 text-sm">
          Nenhum board encontrado para &quot;{search}&quot;
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}

      <CreateBoardModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <JoinBoardModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}

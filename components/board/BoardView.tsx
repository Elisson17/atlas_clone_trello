"use client";

import { useEffect, useState } from "react";
import { useBoard } from "@/contexts/BoardContext";
import Header from "@/components/layout/Header";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import MembersModal from "@/components/board/MembersModal";
import BoardSettingsModal from "@/components/board/BoardSettingsModal";
import Loading from "@/components/ui/Loading";

interface BoardViewProps {
  boardId: number;
}

export default function BoardView({ boardId }: BoardViewProps) {
  const { currentBoard, loadBoard } = useBoard();
  const [membersOpen, setMembersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    loadBoard(boardId);
  }, [boardId, loadBoard]);

  if (!currentBoard) {
    return <Loading className="py-24" text="Carregando board..." />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        board={currentBoard}
        onOpenMembers={() => setMembersOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <KanbanBoard boardId={boardId} />
      <MembersModal
        boardId={boardId}
        isOpen={membersOpen}
        onClose={() => setMembersOpen(false)}
      />
      <BoardSettingsModal
        board={currentBoard}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

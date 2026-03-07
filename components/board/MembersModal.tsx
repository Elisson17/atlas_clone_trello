"use client";

import { useState, useEffect } from "react";
import { fetchMembersAction, removeMemberAction } from "@/actions/board";
import type { BoardMember } from "@/models/board";
import { useAuth } from "@/contexts/AuthContext";
import { useBoard } from "@/contexts/BoardContext";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { UserMinus, Shield, Copy } from "lucide-react";
import { toast } from "sonner";

interface MembersModalProps {
  boardId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MembersModal({
  boardId,
  isOpen,
  onClose,
}: MembersModalProps) {
  const { user } = useAuth();
  const { currentBoard } = useBoard();
  const [members, setMembers] = useState<BoardMember[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchMembersAction(boardId).then((result) => {
        if (result.success && result.data) {
          setMembers(result.data.members);
        }
      });
    }
  }, [isOpen, boardId]);

  async function handleRemove(memberId: number) {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;
    const result = await removeMemberAction(boardId, memberId);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Membro removido!");
    }
  }

  function handleCopyInviteCode() {
    if (currentBoard?.invite_code) {
      navigator.clipboard.writeText(currentBoard.invite_code);
      toast.success("Código de convite copiado!");
    }
  }

  const isOwner = currentBoard?.owner.id === user?.id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Membros" size="md">
      {currentBoard?.board_type === "team" && currentBoard.invite_code && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-xs font-medium text-indigo-700 mb-1">
            Código de convite
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm text-indigo-900 font-mono flex-1">
              {currentBoard.invite_code}
            </code>
            <button
              onClick={handleCopyInviteCode}
              className="p-1.5 rounded hover:bg-indigo-100 text-indigo-600 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {currentBoard && (
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <Avatar
              src={currentBoard.owner.avatar_url}
              name={`${currentBoard.owner.first_name} ${currentBoard.owner.last_name}`}
              size="md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {currentBoard.owner.first_name} {currentBoard.owner.last_name}
              </p>
              <p className="text-xs text-slate-500">
                @{currentBoard.owner.username}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
              <Shield className="h-3 w-3" />
              Dono
            </span>
          </div>
        )}

        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
          >
            <Avatar
              src={member.user.avatar_url}
              name={`${member.user.first_name} ${member.user.last_name}`}
              size="md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {member.user.first_name} {member.user.last_name}
              </p>
              <p className="text-xs text-slate-500">@{member.user.username}</p>
            </div>
            <span className="text-xs text-slate-500 capitalize">
              {member.role}
            </span>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(member.id)}
                className="p-1.5!"
              >
                <UserMinus className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

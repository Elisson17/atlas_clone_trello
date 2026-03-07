"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@/models/comment";
import {
  fetchCommentsAction,
  createCommentAction,
  deleteCommentAction,
} from "@/actions/comment";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { Trash2 } from "lucide-react";
import { formatRelative } from "@/utils/date";

interface CardCommentsProps {
  cardId: number;
}

export default function CardComments({ cardId }: CardCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await fetchCommentsAction(cardId);
      if (result.success && result.data?.comments) {
        setComments(result.data.comments);
      }
    }
    load();
  }, [cardId]);

  async function handleSubmit() {
    if (!body.trim()) return;
    setIsSubmitting(true);
    const result = await createCommentAction(cardId, body.trim());
    if (result.success && result.data) {
      setComments((prev) => [result.data!, ...prev]);
      setBody("");
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: number) {
    const result = await deleteCommentAction(id);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar
          src={user?.avatar_url}
          name={user ? `${user.first_name} ${user.last_name}` : "U"}
          size="sm"
        />
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={2}
            className="w-full border border-slate-200 dark:border-[#1e2035] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111120] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
          <button
            className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors"
            onClick={handleSubmit}
            disabled={isSubmitting || !body.trim()}
          >
            {isSubmitting ? "Enviando..." : "Comentar"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <Avatar
              src={comment.user.avatar_url}
              name={`${comment.user.first_name} ${comment.user.last_name}`}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {comment.user.first_name} {comment.user.last_name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatRelative(comment.created_at)}
                </span>
                {user?.id === comment.user.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
}

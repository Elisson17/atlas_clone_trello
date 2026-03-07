"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { formatRelative } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { Notification } from "@/models/notification";

export default function DashboardHeader() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const last10 = Array.isArray(notifications) ? notifications.slice(0, 10) : [];

  function handleNotificationClick(notification: Notification) {
    if (!notification.read_at) markAsRead(notification.id);
    if (notification.board_id) {
      router.push(`/boards/${notification.board_id}`);
    }
    setOpen(false);
  }

  return (
    <header className="h-16 bg-white dark:bg-[#0d0d1a] border-b border-slate-200 dark:border-[#1e2035] flex items-center justify-end px-4 sticky top-0 z-40 shrink-0">
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
        >
          <Bell className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-[#1e2035] rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-[#1e2035]">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Notificações
              </span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Marcar todas
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {last10.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Nenhuma notificação</p>
                </div>
              ) : (
                last10.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                      "flex items-start gap-2.5 w-full text-left px-3 py-2.5 transition-colors border-b border-slate-50 dark:border-[#111120] last:border-0",
                      n.read_at
                        ? "hover:bg-slate-50 dark:hover:bg-[#111120]"
                        : "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                        n.read_at ? "bg-transparent" : "bg-blue-500",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs leading-relaxed",
                          n.read_at
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-800 dark:text-slate-200 font-medium",
                        )}
                      >
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {formatRelative(n.created_at)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-2 border-t border-slate-100 dark:border-[#1e2035]">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block w-full text-center text-xs text-blue-500 hover:text-blue-400 py-1.5 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
              >
                Mostrar mais
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

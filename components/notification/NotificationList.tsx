"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatRelative } from "@/utils/date";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

export default function NotificationList() {
  const router = useRouter();
  const { notifications, isLoading, loadNotifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  function handleClick(notification: (typeof notifications)[0]) {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    if (notification.board_id) {
      router.push(`/boards/${notification.board_id}`);
    }
  }

  if (isLoading) {
    return <Loading className="py-24" text="Carregando notificações..." />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">{unreadCount} não lidas</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-12 w-12" />}
          title="Nenhuma notificação"
          description="Você será notificado quando houver atividades relevantes."
        />
      ) : (
        <div className="space-y-1">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleClick(notification)}
              className={cn(
                "flex items-start gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors",
                notification.read_at
                  ? "hover:bg-slate-50"
                  : "bg-indigo-50/50 hover:bg-indigo-50"
              )}
            >
              <div
                className={cn(
                  "mt-1 p-2 rounded-full",
                  notification.read_at ? "bg-slate-100" : "bg-indigo-100"
                )}
              >
                <Bell
                  className={cn(
                    "h-4 w-4",
                    notification.read_at ? "text-slate-400" : "text-indigo-600"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm",
                    notification.read_at ? "text-slate-600" : "text-slate-900 font-medium"
                  )}
                >
                  {notification.message}
                </p>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  {formatRelative(notification.created_at)}
                </span>
              </div>
              {!notification.read_at && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { notificationService } from "@/services/notification";
import type { NotificationsResponse } from "@/models/notification";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchNotificationsAction(): Promise<
  ActionResult<NotificationsResponse>
> {
  try {
    const response = await notificationService.list();
    const data = response.data;
    return { success: true, data };
  } catch {
    return { success: false, error: "Erro ao carregar notificações" };
  }
}

export async function markNotificationReadAction(
  id: number,
): Promise<ActionResult> {
  try {
    await notificationService.markAsRead(id);
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao marcar notificação como lida" };
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  try {
    await notificationService.markAllAsRead();
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao marcar notificações como lidas" };
  }
}

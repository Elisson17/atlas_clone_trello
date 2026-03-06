export type NotificationType =
  | "assigned_to_card"
  | "mentioned_in_comment"
  | "card_updated"
  | "member_joined"
  | "member_removed"
  | "board_invitation";

export interface Notification {
  id: number;
  notification_type: NotificationType;
  message: string;
  read_at: string | null;
  card_id: number | null;
  board_id: number | null;
  created_at: string;
}

export type NotificationsResponse = {
  notifications: Notification[];
};
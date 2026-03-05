import { UserSummary } from "./user";

export type ActivityAction =
  | "card_created"
  | "card_moved"
  | "title_changed"
  | "description_changed"
  | "priority_changed"
  | "assignee_changed"
  | "label_added"
  | "label_removed"
  | "comment_added"
  | "due_date_changed"
  | "start_date_changed"
  | "attachment_added"
  | "attachment_removed";

export interface Activity {
  id: number;
  action: ActivityAction;
  metadata: Record<string, unknown>;
  card_id: number;
  user: UserSummary;
  created_at: string;
}

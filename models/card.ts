import { UserSummary } from "./user";
import { Label } from "./label";

export type CardPriority = "urgent" | "high" | "medium" | "low";

export interface Card {
  id: number;
  title: string;
  description: string | null;
  position: number;
  priority: CardPriority | null;
  start_date: string | null;
  due_date: string | null;
  column_id: number;
  creator: UserSummary;
  assignee: UserSummary | null;
  labels: Label[];
  comments_count: number;
  attachments_count: number;
  created_at: string;
  updated_at: string;
}

export interface CardDetail extends Card {
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  content_type: string;
  byte_size: number;
}

import { UserSummary } from "./user";

export interface Comment {
  id: number;
  body: string;
  card_id: number;
  user: UserSummary;
  created_at: string;
  updated_at: string;
}

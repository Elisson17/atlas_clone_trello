import { UserSummary } from "./user";

export type BoardType = "personal" | "team";

export interface Board {
  id: number;
  name: string;
  description: string | null;
  board_type: BoardType;
  invite_code: string | null;
  cover_url: string | null;
  owner: UserSummary;
  members_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardMember {
  id: number;
  user: UserSummary;
  role: "member" | "admin";
  created_at: string;
}

export interface BoardFavorite {
  id: number;
  board_id: number;
  position: number;
}

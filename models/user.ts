export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  online_status: "offline" | "online" | "away";
  last_seen_at: string | null;
  google_connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSummary {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string | null;
}

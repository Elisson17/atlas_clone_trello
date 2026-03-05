import { Card } from "./card";

export interface Column {
  id: number;
  name: string;
  color: string;
  position: number;
  board_id: number;
  cards: Card[];
  created_at: string;
  updated_at: string;
}

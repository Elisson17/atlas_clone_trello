"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Board } from "@/models/board";
import type { Column } from "@/models/column";
import type { Card } from "@/models/card";
import type { Label } from "@/models/label";
import {
  fetchBoardAction,
  fetchBoardsAction,
  toggleFavoriteAction,
} from "@/actions/board";
import {
  fetchColumnsAction,
  createColumnAction,
  updateColumnAction,
  deleteColumnAction,
  reorderColumnsAction,
} from "@/actions/column";
import {
  createCardAction,
  moveCardAction,
  deleteCardAction,
} from "@/actions/card";
import { fetchLabelsAction } from "@/actions/label";

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  columns: Column[];
  labels: Label[];
  isLoadingBoards: boolean;
  isLoadingColumns: boolean;
  loadBoards: () => Promise<void>;
  loadBoard: (id: number) => Promise<void>;
  loadColumns: (boardId: number) => Promise<void>;
  refreshColumns: (boardId: number) => Promise<void>;
  loadLabels: (boardId: number) => Promise<void>;
  addColumn: (boardId: number, name: string, color: string) => Promise<boolean>;
  updateColumn: (
    id: number,
    data: { name?: string; color?: string; position?: number },
  ) => Promise<boolean>;
  removeColumn: (id: number) => Promise<boolean>;
  reorderColumns: (
    positions: Array<{ id: number; position: number }>,
  ) => Promise<boolean>;
  addCard: (columnId: number, title: string) => Promise<boolean>;
  moveCard: (
    cardId: number,
    columnId: number,
    position: number,
  ) => Promise<boolean>;
  removeCard: (cardId: number, columnId: number) => Promise<boolean>;
  updateCardInColumn: (card: Card) => void;
  toggleFavorite: (boardId: number, isFavorite: boolean) => Promise<boolean>;
  setColumns: (columns: Column[]) => void;
  setLabels: (labels: Label[]) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);

  const loadBoards = useCallback(async () => {
    setIsLoadingBoards(true);
    const result = await fetchBoardsAction();
    if (result.success && Array.isArray(result.data?.boards)) {
      setBoards(result.data.boards);
    }
    setIsLoadingBoards(false);
  }, []);

  const loadBoard = useCallback(async (id: number) => {
    const result = await fetchBoardAction(id);
    if (result.success && result.data) {
      setCurrentBoard(result.data);
    }
  }, []);

  const loadColumns = useCallback(async (boardId: number) => {
    setIsLoadingColumns(true);
    const result = await fetchColumnsAction(boardId);
    if (result.success && result.data?.columns) {
      setColumns(result.data.columns);
    }
    setIsLoadingColumns(false);
  }, []);

  const refreshColumns = useCallback(async (boardId: number) => {
    const result = await fetchColumnsAction(boardId);
    if (result.success && result.data?.columns) {
      setColumns(result.data.columns);
    }
  }, []);

  const loadLabels = useCallback(async (boardId: number) => {
    const result = await fetchLabelsAction(boardId);
    if (result.success && result.data?.labels) {
      setLabels(result.data.labels);
    }
  }, []);

  const addColumn = useCallback(
    async (boardId: number, name: string, color: string) => {
      const result = await createColumnAction(boardId, { name, color });
      if (result.success && result.data) {
        setColumns((prev) => [...prev, { ...result.data!, cards: [] }]);
        return true;
      }
      return false;
    },
    [],
  );

  const updateColumn = useCallback(
    async (
      id: number,
      data: { name?: string; color?: string; position?: number },
    ) => {
      const result = await updateColumnAction(id, data);
      if (result.success && result.data) {
        setColumns((prev) => {
          const updated = prev.map((col) =>
            col.id === id ? { ...col, ...result.data! } : col,
          );
          // Re-sort by position if position changed
          if (data.position !== undefined) {
            return [...updated].sort((a, b) => a.position - b.position);
          }
          return updated;
        });
        return true;
      }
      return false;
    },
    [],
  );

  const removeColumn = useCallback(async (id: number) => {
    const result = await deleteColumnAction(id);
    if (result.success) {
      setColumns((prev) => prev.filter((col) => col.id !== id));
      return true;
    }
    return false;
  }, []);

  const reorderColumnsHandler = useCallback(
    async (positions: Array<{ id: number; position: number }>) => {
      const result = await reorderColumnsAction(positions);
      return result.success;
    },
    [],
  );

  const addCard = useCallback(async (columnId: number, title: string) => {
    const result = await createCardAction(columnId, title);
    if (result.success && result.data) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, cards: [...col.cards, result.data!] }
            : col,
        ),
      );
      return true;
    }
    return false;
  }, []);

  const moveCard = useCallback(
    async (cardId: number, columnId: number, position: number) => {
      const result = await moveCardAction(cardId, columnId, position);
      return result.success;
    },
    [],
  );

  const removeCard = useCallback(async (cardId: number, columnId: number) => {
    const result = await deleteCardAction(cardId);
    if (result.success) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col,
        ),
      );
      return true;
    }
    return false;
  }, []);

  const updateCardInColumn = useCallback((card: Card) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === card.column_id
          ? {
              ...col,
              cards: col.cards.map((c) => (c.id === card.id ? card : c)),
            }
          : col,
      ),
    );
  }, []);

  const toggleFavorite = useCallback(
    async (boardId: number, isFavorite: boolean) => {
      const result = await toggleFavoriteAction(boardId, isFavorite);
      if (result.success) {
        setBoards((prev) =>
          prev.map((b) =>
            b.id === boardId ? { ...b, is_favorite: !isFavorite } : b,
          ),
        );
        if (currentBoard?.id === boardId) {
          setCurrentBoard((prev) =>
            prev ? { ...prev, is_favorite: !isFavorite } : prev,
          );
        }
        return true;
      }
      return false;
    },
    [currentBoard],
  );

  return (
    <BoardContext.Provider
      value={{
        boards,
        currentBoard,
        columns,
        labels,
        isLoadingBoards,
        isLoadingColumns,
        loadBoards,
        loadBoard,
        loadColumns,
        refreshColumns,
        loadLabels,
        addColumn,
        updateColumn,
        removeColumn,
        reorderColumns: reorderColumnsHandler,
        addCard,
        moveCard,
        removeCard,
        updateCardInColumn,
        toggleFavorite,
        setColumns,
        setLabels,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard deve ser usado dentro de um BoardProvider");
  }
  return context;
}

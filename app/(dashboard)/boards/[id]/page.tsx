import BoardView from "@/components/board/BoardView";
import { extractBoardId } from "@/utils/params";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const boardId = extractBoardId({ id });

  return <BoardView boardId={boardId} />;
}

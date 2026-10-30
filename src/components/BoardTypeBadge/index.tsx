import { FiAward, FiClipboard } from "react-icons/fi";
import {
  BoardType,
  boardTypeDescriptions,
  boardTypeLabels,
  isBoardType,
  type TBoardType,
} from "../../admin/types/TBoardType";
import { Badge } from "./styles";

export function BoardTypeBadge({ type }: { type?: TBoardType | null }) {
  if (!isBoardType(type)) return null;
  const Icon = type === BoardType.DEFENSE ? FiAward : FiClipboard;
  return (
    <Badge $defense={type === BoardType.DEFENSE} title={boardTypeDescriptions[type]}>
      <Icon aria-hidden="true" />
      {boardTypeLabels[type]}
    </Badge>
  );
}

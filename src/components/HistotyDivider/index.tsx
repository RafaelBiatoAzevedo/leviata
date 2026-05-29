import { Container, Ornament } from "./styles";

interface HistoryDividerProps {
  symbol?: string;
  hasMarginVertical?: boolean;
}

//symbol = "✦"

export function HistoryDivider({
  symbol = "✠",
  hasMarginVertical = false,
}: HistoryDividerProps) {
  return (
    <Container hasMarginVertical={hasMarginVertical}>
      <Ornament>{symbol}</Ornament>
    </Container>
  );
}

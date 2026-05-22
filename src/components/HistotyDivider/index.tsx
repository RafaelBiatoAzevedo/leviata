import { Container, Ornament } from "./styles";

interface HistoryDividerProps {
  symbol?: string;
}

//symbol = "✦"

export function HistoryDivider({ symbol = "✠" }: HistoryDividerProps) {
  return (
    <Container>
      <Ornament>{symbol}</Ornament>
    </Container>
  );
}

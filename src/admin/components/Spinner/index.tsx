import { Spinner as SpinnerStyled } from "./styles";

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 16 }: SpinnerProps) {
  return <SpinnerStyled $size={size} />;
}

export default Spinner;

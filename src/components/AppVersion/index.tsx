import { version } from "../../../package.json";
import { Badge } from "./styles";

// The displayed release follows package.json in every part of the portal.
export function AppVersion() {
  return (
    <Badge title={`Versão do sistema ${version}`} aria-label={`Versão ${version}`}>
      v{version}
    </Badge>
  );
}

import type { InputHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import {
  HiddenInput,
  Slider,
  Switch,
  SwitchContainer,
  SwitchLabel,
} from "./styles";

interface AdminSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  description?: string;
  error?: string;
  text?: string;
}

export function AdminSwitch({
  label,
  description,
  error,
  text,
  id,
  ...rest
}: AdminSwitchProps) {
  const switchId = id ?? `switch-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      htmlFor={switchId}
    >
      <SwitchContainer>
        <Switch htmlFor={switchId}>
          <HiddenInput id={switchId} type="checkbox" {...rest} />

          <Slider />
        </Switch>

        {text && <SwitchLabel>{text}</SwitchLabel>}
      </SwitchContainer>
    </AdminField>
  );
}

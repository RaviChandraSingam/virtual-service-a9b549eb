import * as React from 'react';
import MuiSwitch from '@mui/material/Switch';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function Switch({ checked, onCheckedChange, disabled, id, className }: SwitchProps) {
  return (
    <MuiSwitch
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      id={id}
    />
  );
}
export { Switch };

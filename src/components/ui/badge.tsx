import * as React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const variantColor: Record<string, ChipProps['color']> = {
  default: 'primary',
  secondary: 'default',
  destructive: 'error',
  outline: 'default',
};

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <Chip
      label={children}
      size='small'
      color={variantColor[variant] || 'default'}
      variant={variant === 'outline' ? 'outlined' : 'filled'}
    />
  );
}
export { Badge };

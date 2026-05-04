import * as React from 'react';
import TextField from '@mui/material/TextField';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, value, onChange, disabled, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        type={type}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange as any}
        disabled={disabled}
        size='small'
        fullWidth
        variant='outlined'
        inputProps={props as any}
      />
    );
  }
);
Input.displayName = 'Input';
export { Input };

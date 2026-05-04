import * as React from 'react';
import TextField from '@mui/material/TextField';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, value, onChange, disabled, rows, ...props }, ref) => (
    <TextField
      inputRef={ref}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange as any}
      disabled={disabled}
      multiline
      rows={rows || 4}
      fullWidth
      variant='outlined'
      inputProps={props as any}
    />
  )
);
Textarea.displayName = 'Textarea';
export { Textarea };

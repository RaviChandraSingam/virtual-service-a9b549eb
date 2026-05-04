import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <FormLabel ref={ref as any} {...props as any}>{children}</FormLabel>
  )
);
Label.displayName = 'Label';
export { Label };

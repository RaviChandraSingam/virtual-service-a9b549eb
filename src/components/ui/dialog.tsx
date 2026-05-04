import * as React from 'react';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';

const DialogContext = React.createContext({ open: false, onOpenChange: (o) => {} });

function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open: open || false, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, asChild }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return <span onClick={() => onOpenChange(true)}>{children}</span>;
}

function DialogContent({ children, className }) {
  const { open, onOpenChange } = React.useContext(DialogContext);
  return (
    <MuiDialog open={open} onClose={() => onOpenChange(false)} maxWidth="md" fullWidth>
      <MuiDialogContent>{children}</MuiDialogContent>
    </MuiDialog>
  );
}

function DialogHeader({ children, className }) { return <>{children}</>; }
function DialogFooter({ children, className }) { return <MuiDialogActions>{children}</MuiDialogActions>; }
function DialogTitle({ children, className }) { return <MuiDialogTitle>{children}</MuiDialogTitle>; }

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle };

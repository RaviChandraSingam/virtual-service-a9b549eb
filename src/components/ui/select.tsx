import * as React from 'react';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const SelectContext = React.createContext({ value: '', onValueChange: undefined });

function Select({ value, onValueChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children, className }) { return null; }
function SelectValue({ placeholder }) { return null; }

function SelectContent({ children }) {
  const { value, onValueChange } = React.useContext(SelectContext);
  return (
    <FormControl size="small" fullWidth>
      <MuiSelect
        value={value || ''}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        displayEmpty
      >
        {children}
      </MuiSelect>
    </FormControl>
  );
}

function SelectItem({ value, children }) {
  return <MenuItem value={value}>{children}</MenuItem>;
}

function SelectGroup({ children }) { return <>{children}</>; }
function SelectLabel({ children }) { return null; }

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel };

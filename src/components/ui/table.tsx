import * as React from 'react';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Table({ children, className }) {
  return (
    <MuiTableContainer component={Paper} className={className}>
      <MuiTable size="small">{children}</MuiTable>
    </MuiTableContainer>
  );
}

function TableHeader({ children, className }) { return <MuiTableHead>{children}</MuiTableHead>; }
const TableBody = MuiTableBody;
const TableRow = MuiTableRow;
const TableHead = MuiTableCell;
const TableCell = MuiTableCell;

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

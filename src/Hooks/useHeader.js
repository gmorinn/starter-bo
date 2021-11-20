import React from "react";
import { Checkbox, TableCell, TableHead, TableRow, Box, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils'

const EnhancedTableHead = props => {

    const { data, setSelected, order, setOrder, setOrderBy, orderBy, numSelected, rowCount, headCells } = props

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = data.map((n) => n.id);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
      };


    const createSortHandler = property => event => handleRequestSort(event, property)

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllClick}
                    inputProps={{
                    'aria-label': 'select all desserts',
                    }}
                />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
  }

export default EnhancedTableHead
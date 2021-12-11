import React from "react";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useHistory } from "react-router-dom";

const DashboardContent = ({ selected, isItemSelected, row, labelId, edit, setSelected, children }) => {
    const history = useHistory()
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
    };
  
    return (
      <TableRow
          hover
          onClick={(e) => handleClick(e, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
        >
        <TableCell padding="checkbox">
        <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
            'aria-labelledby': labelId,
            }}
        />
        </TableCell>
        {children}
        <TableCell align="center">
            <IconButton
            aria-label="edit page"
            size="small"
            onClick={() => history.push(edit)}
            >
            <ModeEditIcon fontSize="small"/>
          </IconButton>
          </TableCell>
      </TableRow>
    )
  }

export default DashboardContent
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { useApi } from '../../Hooks/useApi';
import * as sort from '../../Hooks/useSort'
import Pagination from '../../Hooks/usePagination'
import Header from '../../Hooks/useHeader'
import DashboardFilter from '../../Hooks/useDashboardFilter';

const headCells = [
  {
    id: 'firstname',
    numeric: false,
    disablePadding: true,
    label: 'Firstname',
  },
  {
    id: 'lastname',
    numeric: true,
    disablePadding: false,
    label: 'Lastname',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  }, 
  {
    id: 'birthday',
    numeric: true,
    disablePadding: false,
    label: 'Birthday',
  },
];

const Users = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('price');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([])
  const { Fetch } = useApi()

  useEffect(() => {
    setData([])
    Fetch(`/v1/bo/users`)
        .then(res => res?.success && res.users && res.users.length > 0 && setData(res.users))
    // eslint-disable-next-line
  }, [])

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
          <DashboardFilter 
            title="Users"
            numSelected={selected.length} 
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
            {/* ********* HEADER ****** */}
            <Header
              data={data}
              setSelected={setSelected}
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
              orderBy={orderBy}
              rowCount={data.length}
            />

            {/* *********** VALUES ************** */}
            <TableBody>
              {sort.stableSort(data, sort.getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = selected.indexOf(row.name) !== -1;;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
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
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.firstname}
                      </TableCell>
                      <TableCell align="right">{row.lastname}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.birthday}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {/* ****** PAGINATION ********* */}
            <Pagination 
              data={data}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
            />
          </Table>
        </TableContainer>
      </Paper>
    </Box>
    )
}

export default Users
import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox } from '@mui/material';
import { useApi } from '../../Hooks/useApi';
import * as sort from '../../Hooks/useSort'
import Pagination from '../../Hooks/usePagination'
import Header from '../../Hooks/useHeader'
import { useHistory } from "react-router-dom";
import DashboardFilter from '../../Hooks/useDashboardFilter';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Category',
  },
];

const Products = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('price');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([])
  const { Fetch } = useApi()
  const history = useHistory()

  const deleteItems = () => {
    Fetch("/v1/bo/products/remove", "PATCH", {tab: selected}, true)
      .then(res => res?.success && setSelected([]))
      .then(() => listItem())
  }

  const listItem = () => {
    Fetch("/v1/bo/products")
      .then(res => res.success && res.products && res.products.length > 0 && setData(res.products))
  }

  useEffect(() => {
    Fetch(`/v1/bo/products`)
        .then(res => res?.success && res.products && res.products.length > 0 && setData(res.products))
    return () => setData([])
    // eslint-disable-next-line
  }, [])

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
          <DashboardFilter 
            title="Products"
            numSelected={selected.length} 
            deleteItems={deleteItems}
            add={() => history.push('/product/add')}
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
                  const isItemSelected = selected.indexOf(row.id) !== -1;;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
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
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="right">{row.category}</TableCell>
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
  );
}

export default Products
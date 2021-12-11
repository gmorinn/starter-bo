import React, { useEffect, useState } from 'react';
import { Box, TableCell, Paper } from '@mui/material';
import { useApi } from '../../Hooks/useApi';
import { useHistory } from "react-router-dom";
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../Hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';

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
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([])
  const { Fetch } = useApi()
  const history = useHistory()
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const deleteItems = () => {
    Fetch("/v1/bo/products/remove", "PATCH", {tab: selected}, true)
      .then(res => res?.success && setSelected([]))
      .then(() => listItem())
  }

  const listItem = () => {
    Fetch(`/v1/bo/products/${page*rowsPerPage}/${rowsPerPage}?direction=${order}&field=${orderBy}`)
      .then(res => {
        if (res?.success && res.success && res.products && res.products.length > 0) {
          setData(res.products)
          setTotal(res.count)
        }
      })
  }

  useUpdateEffect(() => {
    listItem()
  }, [rowsPerPage, page, order, orderBy])

  useEffect(() => {
    listItem()
    return () => setData([])
    // eslint-disable-next-line
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
          <DashboardTable
            add={() => history.push('/product/add')}
            deleteItems={deleteItems}
            order={order}
            total={total}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            setOrder={setOrder}
            selected={selected}
            setSelected={setSelected}
            data={data}
            headCells={headCells}
          >
                {data && data.length > 0 && data.map((row, index) => {
                    const isItemSelected = selected.indexOf(row.id) !== -1;;
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <DashboardContent
                        selected={selected}
                        setSelected={setSelected} 
                        row={row}
                        key={row.id}
                        isItemSelected={isItemSelected}
                        labelId={labelId}
                        redirect={() => history.push(`/product/edit/${row.id}`)}
                      >

                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.category}</TableCell>

                      </DashboardContent>
                    );
                })}
          </DashboardTable>
      </Paper>
    </Box>
  );
}

export default Products
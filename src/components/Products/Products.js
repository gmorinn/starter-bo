import React, { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../Hooks/useApi';
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
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const [selected, setSelected] = useState([]);

  //// PAGINATION ////
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  ////////////////////

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
      <DashboardTable
        add="/product/add"
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
            return (
              <DashboardContent
                selected={selected}
                setSelected={setSelected} 
                row={row}
                key={row.id}
                isItemSelected={selected.indexOf(row.id) !== -1}
                labelId={`checkbox-${index}`}
                edit={`/product/edit/${row.id}`}
              >

                <TableCell component="th" id={`checkbox-${index}`} scope="row" padding="none">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.category}</TableCell>

              </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Products
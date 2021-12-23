import React, { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../Hooks/useApi';
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../Hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';

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
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role',
  },
];

const Users = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const [selected, setSelected] = useState([]);

  //// PAGINATION ////
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstname');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  ////////////////////

  const deleteItems = () => {
      Fetch("/v1/bo/users/remove", "PATCH", {tab: selected}, true)
        .then(res => res?.success && setSelected([]))
        .then(() => listItem())
    }

    const listItem = () => {
      Fetch(`/v1/bo/users/${page*rowsPerPage}/${rowsPerPage}?field=${orderBy}&direction=${order}`)
      .then(res => {
        if (res?.success && res.success && res.users && res.users.length > 0) {
          setData(res.users)
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
        add="/user/add"
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
                edit={`/user/edit/${row.id}`}
              >
                      <TableCell
                        component="th"
                        id={`checkbox-${index}`}
                        scope="row"
                        padding="none"
                      >
                        {row.firstname}
                      </TableCell>
                      <TableCell align="right">{row.lastname}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone && "+"+row.phone}</TableCell>
                      <TableCell align="right">{row.birthday}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Users
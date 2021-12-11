import React from "react";
import { Table, TableBody, TableContainer } from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import DashboardPagination from "./DashboardPagination";
import DashboardHeaderFilter from "./DashboardHeaderFilter";

const DashboardTable = ({ deleteItems, add, total, orderBy, setOrderBy, page, rowsPerPage, setRowsPerPage, setPage, order, setOrder, selected, setSelected, data, headCells, children }) => {
    return (
        <>
            <DashboardHeaderFilter 
                title="Products"
                numSelected={selected.length} 
                deleteItems={deleteItems}
                add={add}
            />
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                >
                {/* ********* HEADER ****** */}
                <DashboardHeader
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
                    {children}
                </TableBody>

                {/* ****** PAGINATION ********* */}
                <DashboardPagination 
                    total={total}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                />
                </Table>
            </TableContainer>
        </>
    )
}

export default DashboardTable
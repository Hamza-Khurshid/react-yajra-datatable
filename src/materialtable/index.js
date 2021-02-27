import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

import query from './services/query';

const requestSearch = (value, regex = false) => ({
  value,
  regex
});

const DESC = 'desc';
const ASC = 'asc';
const toggleDirection = (direction) => (direction === ASC) ? DESC : ASC;

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function MaterialTable({ url, method, columns }) {
  let queryColumns = columns.map(col => ({ name: col['label'], data: col['id'] }));

  const classes = useStyles();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [entriesToShow, setEntriesToShow] = React.useState(10);

  const [data, setData] = useState([])
  const [drawCount, setDrawCount] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [recordsTotal, setRecordsTotal] = useState(0)
  const [recordsFiltered, setRecordsFiltered] = useState(0)
  const [orderColumnIndex, setOrderColumnIndex] = useState(0)
  const [orderColumnDirection, setOrderColumnDirection] = useState(ASC)

  // Get data initially
  useEffect(() => {
    draw()
  } ,[currentPage, entriesToShow])

  // Set loading and request data
  const draw = () => {
    setRefreshing(true)
    refresh()
  }

  // Requesting data
  const refresh = () => {
    query({
      url,
      method: method || 'get',
      data: getRequestData(),
    }).then(updateTableState);
  }

  const getRequestData = () => {
    return {
        columns: getColumns(),
        start: getStartIndex(),
        length: entriesToShow,
        search: requestSearch(searchInput),
        order: getOrderForRequest(),
        draw: drawCount
    };
  }

  const getStartIndex = () => {
    return currentPage * entriesToShow;
  }

  const getOrderForRequest = () => {
    return [{
      column: orderColumnIndex,
      dir: orderColumnDirection
    }];
  }

  const getColumns = () => {
    return queryColumns.slice(0).map(column => (Object.assign({
        searchable: true,
        orderable: true,
        search: requestSearch(''),
    }, column)));
  }

  const updateTableState = (response) => {
    const { recordsTotal, recordsFiltered, data, draw } = getResponseData(response.data);
    setRecordsTotal(recordsTotal)
    setRecordsFiltered(recordsFiltered)
    setData(data)
    setDrawCount(draw+1)
    setRefreshing(false)
  }

  const getResponseData = (data) => {
    return data;
    // return responseDataGetter ? responseDataGetter(data) : data;
  }

  const handleChangePage = (event, newPage) => {
    if (currentPage != newPage) {
      setCurrentPage(newPage)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setEntriesToShow(+event.target.value);
    setCurrentPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              refreshing ? 
                null
              :  
                data.map((row) => {
                  return (
                    <TableRow onClick={(row2)=>console.log('Row Data: ', row2)} hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
        {
          refreshing ?
            <CircularProgress style={{ margin: 20 }} /> : null
        }
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={recordsTotal}
        rowsPerPage={entriesToShow}
        page={currentPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
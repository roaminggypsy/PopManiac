import React from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from 'react-table';
import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;
  table {
    width: 100%;
    border-spacing: 0;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      :hover {
        background-color: rgb(158, 142, 173);
      }
    }
    th,
    td {
      margin: 0;
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid lightgrey;
      :last-child {
        border-right: 0;
      }
    }
  }
  .pagination {
    width: 100%;
    margin-top: 20px;
    padding: 0.5rem;
    text-align: center;
  }
  button,
  input,
  select {
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    margin-left: 8px;
    margin-right: 8px;
    padding-left: 6px;
    padding-right: 6px;
  }
`;

const SortSpan = styled.span`
  margin-left: 8px;
`;

const PageInfo = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`;

export default function Table({
  columns,
  data,
  showPageSizeOptions = true,
  defaultPageSize = 10,
  updatePageSize = undefined,
  sortedRows = [],
}) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    /**
     * Instance Properties
     */
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // only have the rows for the active page
    // Pagination related
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      /**
       * Table Options
       */
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize,
        sortBy: sortedRows,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  {column.canFilter && column.Filter
                    ? column.render('Filter')
                    : null}
                  {''}
                  {/* Sort State */}
                  <SortSpan>
                    {column.disableSortBy === false &&
                      (column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className='fa fa-sort-desc' aria-hidden='true'></i>
                        ) : (
                          <i className='fa fa-sort-asc' aria-hidden='true'></i>
                        )
                      ) : (
                        <i className='fa fa-sort' aria-hidden='true'></i>
                      ))}
                  </SortSpan>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps([{ style: cell.column.style }])}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 
        Pagination UI
      */}
      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <PageInfo>
          <strong>{data.length}</strong> records total, page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          {'  '}| Go to page:{'  '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '80px' }}
          />
        </PageInfo>{' '}
        {showPageSizeOptions ? (
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        ) : null}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
      </div>
    </Styles>
  );
}

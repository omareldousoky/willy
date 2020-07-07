import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './styles.scss';
import * as local from '../../../Shared/Assets/ar.json';
import { connect } from 'react-redux';
import { searchFilters, search } from '../../redux/search/actions';

interface Props {
  mappers: Array<any>;
  pagination: boolean;
  data: Array<any>;
  totalCount: number;
  changeNumber?: (key: string, number: number) => void | undefined;
  search: (data) => void;
  setSearchFilters: (data) => void;
  searchFilters: any;
  size?: number;
  from?: number;
  url?: string;
}

const DynamicTable = (props: Props) => {
  const [page, changePage] = useState(0);
  const [rowsPerPage, changeRowsPerPage] = useState(props.pagination ? 10 : props.data.length);
  const [order, changeOrder] = useState('');
  const [selectedSortKey, changeSortKey] = useState('');
  const totalPages: Array<number> = [];
  for (let index = 1; index <= Math.ceil(props.totalCount / rowsPerPage); index++) {
    totalPages.push(index)
  }
  function getArrayOfNumbers() {
    const length = page + 5 >= totalPages.length ? totalPages.length : page + 5;
    const output: Array<number> = [];
    for (let index = page + 1; index <= length; index++) {
      output.push(index)
    }
    return output;
  }
  function sortBy(key: string) {
    changeSortKey(key);
    if (order === '') {
      changeOrder('asc');
      changePage(0);
      props.setSearchFilters({ ...props.searchFilters, sort: key, order: 'asc' })
      props.search({ size: props.size, from: 0, url: props.url, sort: key, order: 'asc' });
    } else if (order === 'asc') {
      changeOrder('desc');
      changePage(0);
      props.setSearchFilters({ ...props.searchFilters, sort: key, order: 'desc' })
      props.search({ size: props.size, from: 0, url: props.url, sort: key, order: 'desc' });
    } else {
      changeOrder('');
      changePage(0);
      props.setSearchFilters({ ...props.searchFilters, sort: '', order: '' })
      props.search({ size: props.size, from: 0, url: props.url });
    }
  }
  function getOrderIcon(key: string) {
    if (key === selectedSortKey) {
      switch (order) {
        case '': return <span className="fa fa-sort sort-icons" ></span>
        case 'asc': return key === selectedSortKey ? <span className="fa fa-sort-down sort-icons"></span> : null
        case 'desc': return key === selectedSortKey ? <span className="fa fa-sort-up sort-icons"></span> : null
        default: return null;
      }
    } else return <span className="fa fa-sort sort-icons" ></span>
  }
  return (
    <>
      {props.data?.length ?
        <Table striped hover style={{ textAlign: 'right' }}>
          <thead>
            <tr>
              {props.mappers?.map((mapper, index: number) => {
                return (
                  <th style={mapper.sortable ? { cursor: 'pointer' } : {}} key={index} onClick={() => mapper.sortable ? sortBy(mapper.key) : null}>
                    {mapper.title}
                    {mapper.sortable ? getOrderIcon(mapper.key) : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {props.data.map((item, index: number) => {
              return (
                <tr key={index}>
                  {props.mappers?.map((mapper, index: number) => {
                    return (
                      <td key={index}>
                        {(mapper.render || (data => data[mapper.key]))(item, index)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
        :
        <div style={{ textAlign: 'center', marginBottom: 40 }}>        <img alt='no-data-found' src={require('../../Assets/no-results-found.svg')} />
          <h4>{local.noResultsFound}</h4>
        </div>
      }
      {props.pagination && props.data?.length ?
        <div className="footer-container" style={{ marginBottom: 20, marginRight: 30 }}>
          <div className="dropdown-container">
            <p className="dropdown-label">{local.show}</p>
            <Form.Control as="select" className="dropdown-select" onChange={(event) => {
              changeRowsPerPage(Number(event.currentTarget.value));
              props.changeNumber && props.changeNumber('size', Number(event.currentTarget.value))
              props.changeNumber && props.changeNumber('from', 0)
              changePage(0)
            }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Control>
          </div>
          <div className="pagination-container">
            <div className={page === 0 ? "pagination-next-prev-disabled" : "pagination-next-prev-enabled"}
              onClick={() => {
                if (page !== 0) {
                  changePage(page - 1);
                  props.changeNumber && props.changeNumber('from', (page * rowsPerPage - rowsPerPage));
                }
              }}>{local.previous}</div>
            <div className="pagination-numbers">
              {getArrayOfNumbers().map(number => {
                return (
                  <div key={number}
                    className={page === number - 1 ? "pagination-number-active" : "pagination-number-inactive"}
                    onClick={() => {
                      changePage(number - 1);
                      props.changeNumber && props.changeNumber('from', (number - 1) * rowsPerPage)
                    }}>
                    <p>{number}</p>
                  </div>
                )
              })}
            </div>
            <div className={page + 1 !== Math.ceil(props.totalCount / rowsPerPage) ? "pagination-next-prev-enabled" : "pagination-next-prev-disabled"}
              onClick={() => {
                if (page + 1 !== Math.ceil(props.totalCount / rowsPerPage)) {
                  changePage(page + 1);
                  props.changeNumber && props.changeNumber('from', (page * rowsPerPage + rowsPerPage));
                }
              }}>{local.next}</div>
          </div>
        </div>
        : null}
    </>
  )
}

const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setSearchFilters: data => dispatch(searchFilters(data)),
  };
};
const mapStateToProps = state => {
  return {
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(DynamicTable);
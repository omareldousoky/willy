import React, { useState, useEffect, ReactNode } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import './styles.scss'
import { connect } from 'react-redux'
import * as local from '../../Assets/ar.json'
import { searchFilters, search } from '../../redux/search/actions'
import { DynamicTableProps } from './types'

const DynamicTable = (props: DynamicTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(
    props.pagination ? props?.customPagination?.size || 10 : props.data.length
  )
  const [order, changeOrder] = useState('')
  const [selectedSortKey, changeSortKey] = useState('')
  const totalPages: Array<number> = []
  useEffect(() => {
    if (props.from === 0) {
      setPage(0)
    }
  }, [props.from])
  for (
    let index = 1;
    index <= Math.ceil(props.totalCount / rowsPerPage);
    index += 1
  ) {
    totalPages.push(index)
  }

  const pagesList = props.pagination
    ? props?.customPagination?.pagesList || [10, 25, 50, 100]
    : undefined
  function getArrayOfNumbers() {
    const length = page + 5 >= totalPages.length ? totalPages.length : page + 5
    const output: Array<number> = []
    for (let index = page + 1; index <= length; index += 1) {
      output.push(index)
    }
    return output
  }
  function sortBy(key: string) {
    changeSortKey(key)
    if (order === '') {
      changeOrder('asc')
      setPage(0)
      props.setSearchFilters({
        ...props.searchFilters,
        sort: props.url === 'loan' && key === '' ? 'issueLoan' : key,
        order: 'asc',
      })
      props.search({
        size: props.size,
        from: 0,
        url: props.url,
        sort: props.url === 'loan' && key === '' ? 'issueLoan' : key,
        order: 'asc',
      })
    } else if (order === 'asc') {
      changeOrder('desc')
      setPage(0)
      props.setSearchFilters({
        ...props.searchFilters,
        sort: props.url === 'loan' && key === '' ? 'issueLoan' : key,
        order: 'desc',
      })
      props.search({
        size: props.size,
        from: 0,
        url: props.url,
        sort: props.url === 'loan' && key === '' ? 'issueLoan' : key,
        order: 'desc',
      })
    } else {
      changeOrder('')
      setPage(0)
      props.setSearchFilters({
        ...props.searchFilters,
        sort: props.url === 'loan' ? 'issueLoan' : '',
        order: '',
      })
      props.search({
        size: props.size,
        from: 0,
        url: props.url,
        sort: props.url === 'loan' ? 'issueLoan' : '',
      })
    }
  }
  function getOrderIcon(key: string) {
    if (key === selectedSortKey) {
      switch (order) {
        case '':
          return <span className="fa fa-sort sort-icons" />
        case 'asc':
          return key === selectedSortKey ? (
            <span className="fa fa-sort-down sort-icons" />
          ) : null
        case 'desc':
          return key === selectedSortKey ? (
            <span className="fa fa-sort-up sort-icons" />
          ) : null
        default:
          return null
      }
    } else return <span className="fa fa-sort sort-icons" />
  }
  return (
    <>
      {props.data?.length ? (
        <Table striped hover style={{ textAlign: 'right' }}>
          <thead>
            <tr>
              {props.mappers?.map((mapper, index: number) => {
                return (
                  <th
                    style={mapper.sortable ? { cursor: 'pointer' } : {}}
                    key={index}
                    onClick={() =>
                      mapper.sortable ? sortBy(mapper.key) : null
                    }
                  >
                    {typeof mapper.title === 'string'
                      ? mapper.title
                      : mapper.title()}
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
                  {props.mappers?.map((mapper, i: number) => {
                    return (
                      <td
                        key={i}
                        style={{ width: 'fit-content', maxWidth: '300px' }}
                      >
                        {
                          (mapper.render || ((data) => data[mapper.key]))(
                            item,
                            i
                          ) as ReactNode
                        }
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        <div
          style={{ textAlign: 'center', marginBottom: 40 }}
          className="print-none"
        >
          <img
            alt="no-data-found"
            src={require('../../Assets/no-results-found.svg')}
          />
          <h4>{local.noResultsFound}</h4>
        </div>
      )}
      {props.pagination && props.data?.length ? (
        <div
          className="footer-container"
          style={{ marginBottom: 20, marginRight: 30 }}
        >
          <div className="dropdown-container">
            <p className="dropdown-label">{local.show}</p>
            <Form.Control
              as="select"
              className="dropdown-select"
              value={props.size}
              onChange={(event) => {
                setRowsPerPage(Number(event.currentTarget.value))
                props.changeNumber &&
                  props.changeNumber('size', Number(event.currentTarget.value))
                props.changeNumber && props.changeNumber('from', 0)
                setPage(0)
              }}
            >
              {pagesList &&
                pagesList.map((optionValue, index) => {
                  return (
                    <option
                      key={index}
                      value={optionValue}
                      data-qc={optionValue}
                    >
                      {optionValue}
                    </option>
                  )
                })}
            </Form.Control>
          </div>
          <div className="pagination-container print-none">
            <div
              className={
                page === 0
                  ? 'pagination-next-prev-disabled'
                  : 'pagination-next-prev-enabled'
              }
              onClick={() => {
                if (page !== 0) {
                  setPage(page - 1)
                  props.changeNumber &&
                    props.changeNumber('from', page * rowsPerPage - rowsPerPage)
                }
              }}
            >
              {local.previous}
            </div>
            <div className="pagination-numbers">
              {getArrayOfNumbers().map((number) => {
                return (
                  <div
                    key={number}
                    className={
                      page === number - 1
                        ? 'pagination-number-active'
                        : 'pagination-number-inactive'
                    }
                    onClick={() => {
                      setPage(number - 1)
                      props.changeNumber &&
                        props.changeNumber('from', (number - 1) * rowsPerPage)
                    }}
                  >
                    <p>{number}</p>
                  </div>
                )
              })}
            </div>
            <div
              className={
                page + 1 !== Math.ceil(props.totalCount / rowsPerPage)
                  ? 'pagination-next-prev-enabled'
                  : 'pagination-next-prev-disabled'
              }
              onClick={() => {
                if (page + 1 !== Math.ceil(props.totalCount / rowsPerPage)) {
                  setPage(page + 1)
                  props.changeNumber &&
                    props.changeNumber('from', page * rowsPerPage + rowsPerPage)
                }
              }}
            >
              {local.next}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    searchFilters: state.searchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(DynamicTable)

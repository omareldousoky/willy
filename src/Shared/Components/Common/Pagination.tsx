import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import local from '../../Assets/ar.json'
import { PaginationProps } from './types'

const MAX_PAGE_NUMBERS = 5

export const Pagination = ({
  totalCount,
  updatePagination,
  size,
  paginationArr,
  from,
}: PaginationProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(size || 10)

  useEffect(() => {
    if (from === 0) setPage(0)
  }, [from])
  const totalPagesCount: number = Math.ceil(totalCount / rowsPerPage)
  const getPages = () => {
    const maxLength =
      page + MAX_PAGE_NUMBERS >= totalPagesCount
        ? totalPagesCount
        : page + MAX_PAGE_NUMBERS
    const pages: Array<number> = []
    for (let index = page + 1; index <= maxLength; index += 1) {
      pages.push(index)
    }
    return pages
  }

  return (
    <div className="footer-container">
      <div className="dropdown-container">
        <p className="dropdown-label">{local.show}</p>
        <Form.Control
          as="select"
          className="dropdown-select"
          onChange={(event) => {
            setRowsPerPage(Number(event.currentTarget.value))
            updatePagination &&
              updatePagination('size', Number(event.currentTarget.value))
            updatePagination && updatePagination('from', 0)
            setPage(0)
          }}
        >
          {paginationArr ? (
            paginationArr.map((optionValue, index) => {
              return (
                <option key={index} value={optionValue}>
                  {optionValue}
                </option>
              )
            })
          ) : (
            <>
              <option value={10}>10</option>
              <option value={10}>25</option>
              <option value={10}>50</option>
            </>
          )}
        </Form.Control>
      </div>
      <div className="pagination-container">
        <Button
          variant="default"
          className={
            page === 0
              ? 'pagination-next-prev-disabled'
              : 'pagination-next-prev-enabled'
          }
          onClick={() => {
            if (page !== 0) {
              setPage(page - 1)
              updatePagination &&
                updatePagination('from', page * rowsPerPage - rowsPerPage)
            }
          }}
        >
          {local.previous}
        </Button>
        <div className="pagination-numbers">
          {getPages().map((number) => {
            return (
              <Button
                variant="default"
                key={number}
                className={
                  page === number - 1
                    ? 'pagination-number-active'
                    : 'pagination-number-inactive'
                }
                onClick={() => {
                  setPage(number - 1)
                  updatePagination &&
                    updatePagination('from', (number - 1) * rowsPerPage)
                }}
              >
                {number}
              </Button>
            )
          })}
        </div>
        <Button
          variant="default"
          className={
            page + 1 !== Math.ceil(totalCount / rowsPerPage)
              ? 'pagination-next-prev-enabled'
              : 'pagination-next-prev-disabled'
          }
          onClick={() => {
            if (page + 1 !== Math.ceil(totalCount / rowsPerPage)) {
              setPage(page + 1)
              updatePagination &&
                updatePagination('from', page * rowsPerPage + rowsPerPage)
            }
          }}
        >
          {local.next}
        </Button>
      </div>
    </div>
  )
}

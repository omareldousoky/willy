import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './styles.scss';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
  mappers: Array<any>;
  pagination: boolean;
  data: Array<any>;
  changeNumber: (key: string, number: number) => void;
}

const DynamicTable = (props: Props) => {
  const [page, changePage] = useState(0);
  const [rowsPerPage, changeRowsPerPage] = useState(props.pagination ? 5 : props.data.length);
  return (
    <>
      <Table striped hover>
        <thead>
          <tr>
            {props.mappers.map((mapper, index: number) => {
              return <th key={index}>{mapper.title}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {props.data
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index: number) => {
              return (
                <tr key={index}>
                  {props.mappers.map((mapper, index: number) => {
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
      {props.pagination ?
        <div className="footer-container">
          <div className="dropdown-container">
            <p className="dropdown-label">{local.show}</p>
            <Form.Control as="select" className="dropdown-select" onChange={(event) => {
              changeRowsPerPage(Number(event.currentTarget.value));
              props.changeNumber('size', Number(event.currentTarget.value))
              props.changeNumber('from', 0)
              changePage(0)
            }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </Form.Control>
          </div>
          <div className="pagination-container">
            <div className={page === 0 ? "pagination-next-prev-disabled" : "pagination-next-prev-enabled"}
              onClick={() => {
                if (page !== 0) {
                  changePage(page - 1);
                  props.changeNumber('from', (page * rowsPerPage + rowsPerPage));
                }
              }}>{local.previous}</div>
            {[1, 2, 3, 4, 5, 6].map(number => {
              return (
                <div key={number}
                  className={page === number - 1 ? "pagination-number-active" : "pagination-number-inactive"}
                  onClick={() => {
                    changePage(number - 1);
                    props.changeNumber('from', (number - 1 * rowsPerPage + rowsPerPage))
                  }}>
                  <p>{number}</p>
                </div>
              )
            })}
            <div className="pagination-next-prev-enabled" onClick={() => {
              changePage(page + 1);
              props.changeNumber('from', (page * rowsPerPage + rowsPerPage));
            }}>{local.next}</div>
          </div>
        </div>
        : null}
    </>
  )
}

export default DynamicTable
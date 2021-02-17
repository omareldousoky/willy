import React, { useState } from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import Form from 'react-bootstrap/Form';
const Pagination = props => {
    const [page, changePage] = useState(0);
    const [rowsPerPage, changeRowsPerPage] = useState(props.pagination ? 5 : props.dataLength);
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
    return (
        <>
            <div className="footer-container" style={{ marginBottom: 20, marginRight: 30 }}>
                <div className="dropdown-container">
                    <p className="dropdown-label">{local.show}</p>
                    <Form.Control as="select" className="dropdown-select" onChange={(event) => {
                        changeRowsPerPage(Number(event.currentTarget.value));
                        props.changeNumber && props.changeNumber('size', Number(event.currentTarget.value))
                        props.changeNumber && props.changeNumber('from', 0)
                        changePage(0)
                    }}>
                        {props.paginationArr ? 
                        props.paginationArr.map((optionValue,index)=>{
                            return(
                                <option key={index} value={optionValue}>{optionValue}</option>
                            )
                        })
                        :
                        <>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        </>
                     } 
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
        </>
    )
}


export default Pagination
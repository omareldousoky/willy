import React from 'react'
import Table from 'react-bootstrap/Table'
import local from '../../Assets/ar.json'
import { CustomerScore } from '../../Services/APIs/customer/customerCategorization'

type Props = {
  ratings: Array<CustomerScore>
}
export const CustomerCategorization = (props: Props) => {
  const { ratings } = props

  const getColor = (score: number) => {
    if (score >= 4 && score <= 6) return '#7DC356'
    if (score >= 7 && score <= 9) return '#edb600'
    if (score >= 10 && score <= 12) return '#ff0000'
  }

  return (
    <>
      {ratings.length > 0 ? (
        <Table
          striped
          bordered
          style={{ textAlign: 'right' }}
          className="horizontal-table"
        >
          <thead>
            <tr>
              <th>{local.loanCode}</th>
              <th>{local.customerCategorization}</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating, index) => {
              return (
                <tr key={index}>
                  <td>{rating.loanApplicationKey}</td>
                  <td>
                    <span
                      style={{
                        background: getColor(rating.customerScore),
                        padding: '0px 20px',
                        color: '#fff',
                        borderRadius: 20,
                      }}
                    >
                      {rating.customerScore}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        <p>{local.noDataAvaliable}</p>
      )}
    </>
  )
}

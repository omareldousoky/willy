import React from 'react'
import './CollectionStatement.scss'
import Table from 'react-bootstrap/Table'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

interface CollectionStatementProps {
  data: any
  isCF?: boolean
}
export const CollectionStatement: React.FC<CollectionStatementProps> = ({
  data,
  isCF,
}) => {
  const { branches } = data.data
  const { total } = data.data
  const { startDate, endDate, financialLeasing } = data

  const trimmedValue = (value: string) => {
    if (value.includes('.')) {
      const splitted = value.split('.', 2)
      splitted[1] = splitted[1].substring(0, 2)
      return splitted.join('.')
    }
    return value
  }

  const BranchComponent = ({ branch }) => {
    return (
      <>
        <tr>
          <th style={{ fontSize: 16 }}>{branch.branchCode}</th>
          <th style={{ fontSize: 16 }}>{branch.branchName}</th>
        </tr>
        <tr>
          <th>التاريخ</th>
          <th>رسوم</th>
          <th>أقساط _ أصل</th>
          <th>أقساط _ تكلفه التمويل</th>
          <th>أقساط _ إجمالي</th>
          <th>الغرامات</th>
          <th>ايرادات اخري</th>
          <th>إجمالي عام</th>
        </tr>
        {branch.rows?.map((row, idx) => (
          <tr key={idx}>
            <td>{row.truthDate.substring(0, 10)}</td>
            <td>{trimmedValue(row.fees)}</td>
            <td>{trimmedValue(row.installmentsPrincipal)}</td>
            <td>{trimmedValue(row.installmentsInterest)}</td>
            <td>{trimmedValue(row.installmentsTotal)}</td>
            <td>{trimmedValue(row.penalties)}</td>
            <td>{trimmedValue(row.otherIncome)}</td>
            <td>{trimmedValue(row.totalCollected)}</td>
          </tr>
        ))}
        <tr>
          <td>{branch.branchName}</td>
          <td>{trimmedValue(branch.fees)}</td>
          <td>{trimmedValue(branch.installmentsPrincipal)}</td>
          <td>{trimmedValue(branch.installmentsInterest)}</td>
          <td>{trimmedValue(branch.installmentsTotal)}</td>
          <td>{trimmedValue(branch.penalties)}</td>
          <td>{trimmedValue(branch.otherIncome)}</td>
          <td>{trimmedValue(branch.totalCollected)}</td>
        </tr>
      </>
    )
  }

  return (
    <>
      <Orientation size="portrait" />
      <div className="CollectionStatement">
        <Header
          title="حركات السداد باليوم"
          fromDate={startDate}
          toDate={endDate}
          cf={isCF}
          fl={financialLeasing}
        />
        <Table className="w-100" striped bordered hover>
          <tbody>
            {branches?.map((branch, idx) => (
              <BranchComponent key={idx} branch={branch} />
            ))}
            <tr style={{ fontSize: 16 }}>
              <td>إجمالى عام</td>
              <td>{trimmedValue(total.fees)}</td>
              <td>{trimmedValue(total.installmentsPrincipal)}</td>
              <td>{trimmedValue(total.installmentsInterest)}</td>
              <td>{trimmedValue(total.installmentsTotal)}</td>
              <td>{trimmedValue(total.penalties)}</td>
              <td>{trimmedValue(total.otherIncome)}</td>
              <td>{trimmedValue(total.totalCollected)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}

import React from 'react'
import './ClientGuaranteedLoans.scss'
import Col from 'react-bootstrap/Col'
import * as local from '../../../../Assets/ar.json'

const ClientGuaranteedLoans = (props) => {
  const { GuarantorName } = props.data
  const { data } = props.data
  const getStatus = (value) => {
    switch (value) {
      case 'unpaid':
        return local.unpaid
      case 'pending':
        return local.pending
      case 'paid':
        return local.paid
      case 'partiallyPaid':
        return local.partiallyPaid
      case 'rescheduled':
        return local.rescheduled
      case 'canceled':
        return local.cancelled
      case 'issued':
        return local.issued
      case 'created':
        return local.created
      case 'approved':
        return local.approved
      case 'underReview':
        return local.underReview
      case 'reviewed':
        return local.reviewed
      default:
        return ''
    }
  }

  return (
    <div className="ClientGuaranteedLoans">
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <tbody>
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th colSpan={6}>
              <div className="logo-print-tb" />
            </th>
            <th colSpan={6}>
              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </tbody>
      </table>
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={3}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={3} />
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>المركز الرئيسي</th>
            <th colSpan={3} />
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>{new Date().toDateString()}</th>
            <th colSpan={3}>تقرير طلبات القروض التي ضمنها العميل</th>
          </tr>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
          <tr>
            <th>إسم الضامن</th>
            <th>كود المقترض</th>
            <th>كود طلب المقترض</th>
            <th>إسم المقترض</th>
            <th>حالة طلب القرض</th>
            <th>تاريخ قرار اللجنه</th>
            <th>حالة القرض</th>
            <th>تاريخ القرض</th>
          </tr>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((record, idx) => {
              return (
                <tr key={idx}>
                  <td className="gray frame">{GuarantorName}</td>
                  <td>
                    <Col>{record.customerKey}</Col>
                    <Col>
                      <small>
                        {record.guarantorOrder === 0 ? 'ضامن أول' : 'ضامن ثاني'}
                      </small>
                    </Col>
                  </td>
                  <td>{record.applicationCode}</td>
                  <td>{record.customerName}</td>
                  <td>
                    {record.appStatus ? getStatus(record.appStatus) : '-'}
                  </td>
                  <td>{record.approvalDate ? record.approvalDate : '-'}</td>
                  <td>
                    {record.loanStatus ? getStatus(record.loanStatus) : '-'}
                  </td>
                  <td>{record.issueDate ? record.issueDate : '-'}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default ClientGuaranteedLoans

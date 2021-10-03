import React from 'react'
import './unpaidInst.scss'
import Table from 'react-bootstrap/Table'
import local from '../../../../Assets/ar.json'
import { numbersToArabic, timeToArabicDate } from '../../../../Services/utils'

const UnpaidInst = (props) => {
  const startDate = new Date(props.fromDate).valueOf()
  const endDate = new Date(props.toDate).valueOf()
  return (
    <div>
      {props.data?.branches?.map((branch, index) => {
        return (
          <div key={index} className="unpaid-inst">
            <table className="header-table">
              <thead>
                <tr>
                  <th className="grey-background">
                    شركة تساهيل للتمويل متناهى الصغر
                  </th>
                  <th />
                  <th rowSpan={2}>
                    <div className="logo-print-tb" />
                  </th>
                </tr>
                <tr>
                  <th className="frame" colSpan={1}>
                    {branch.name}
                  </th>
                </tr>
                <tr>
                  <th style={{ fontSize: 18 }}>
                    قائمة الاقساط الغير مسددة بمناطق العمل
                  </th>
                </tr>
                <tr>
                  <th />
                  <th style={{ fontSize: 18 }}>
                    من {timeToArabicDate(startDate, false)} الي
                    {timeToArabicDate(endDate, false)}
                  </th>
                </tr>
              </thead>
            </table>
            <div>
              <span>الفرع : </span>
              <span
                className="grey-background frame"
                style={{ padding: '5px 5px 5px 50px' }}
              >
                {branch.name}
              </span>
            </div>
            {branch.areas.map((area, areaIndex) => {
              return (
                <div key={areaIndex}>
                  <div style={{ marginTop: 20 }}>
                    <span>منطقة العمل : </span>
                    <span
                      className="grey-background frame"
                      style={{ padding: '5px 5px 5px 50px' }}
                    >
                      {area.name}
                    </span>
                  </div>
                  <Table className="repeated-table">
                    <thead>
                      <tr>
                        <th>اسم العميل</th>
                        <th>رقم القسط</th>
                        <th>ت الاستحقاق</th>
                        <th>حالة القسط</th>
                        <th>قيمة القسط</th>
                        <th>المستحق</th>
                        <th>ت المحمول</th>
                        <th>العنوان</th>
                        <th>اسم المندوب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {area.customers.map((customer, customerIndex) => {
                        return (
                          <tr key={customerIndex}>
                            <td>{customer.customerName}</td>
                            <td>{customer.installmentSerial}</td>
                            <td>
                              {timeToArabicDate(customer.truthDate, false)}
                            </td>
                            <td>{local[customer.installmentStatus]}</td>
                            <td>
                              {numbersToArabic(customer.installmentAmount)}
                            </td>
                            <td>{customer.amountDue}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.address}</td>
                            <td>{customer.representativeName}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                  <div className="horizontal-line" />
                  <div>
                    <span>إجمالى: منطقة العمل : </span>
                    <span
                      className="grey-background frame"
                      style={{ padding: '5px 5px 5px 50px' }}
                    >
                      {area.name}
                    </span>
                    <span
                      className="frame"
                      style={{
                        padding: '5px 5px 5px 50px',
                        textAlign: 'center',
                      }}
                    >
                      {area.count}
                    </span>
                    <span
                      className="frame"
                      style={{
                        padding: '5px 5px 5px 50px',
                        textAlign: 'center',
                      }}
                    >
                      {area.amount}
                    </span>
                  </div>
                  <div className="horizontal-line" />
                </div>
              )
            })}
            <div className="horizontal-line" />
            <div>
              <span> إجمالى : الفرع: </span>
              <span
                className="grey-background frame"
                style={{ padding: '5px 5px 5px 80px' }}
              >
                {branch.name}
              </span>
              <span
                className="frame"
                style={{ padding: '5px 5px 5px 50px', textAlign: 'center' }}
              >
                {branch.count}
              </span>
              <span
                className="frame"
                style={{ padding: '5px 5px 5px 50px', textAlign: 'center' }}
              >
                {branch.amount}
              </span>
            </div>
            <div className="horizontal-line" />
            {index === props.data.branches.length - 1 ? (
              <>
                <div className="horizontal-line" />
                <div>
                  <span>الإجمالى العام: </span>
                  <span
                    className="frame"
                    style={{
                      padding: '5px 5px 5px 50px',
                      textAlign: 'center',
                    }}
                  >
                    {props.data?.count}
                  </span>
                  <span
                    className="frame"
                    style={{
                      padding: '5px 5px 5px 50px',
                      textAlign: 'center',
                    }}
                  >
                    {props.data?.amount}
                  </span>
                </div>
                <div className="horizontal-line" />
              </>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default UnpaidInst

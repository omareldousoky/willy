import React from 'react'
import {
  currency,
  numbersToArabic,
  timeToArabicDate,
  timeToArabicDateNow,
} from '../../../Services/utils'
import { CustomerApplicationTransactionsResponse } from '../../../Services/interfaces'
import Orientation from '../../Common/orientation'
import './customerTransactionReport.scss'

interface CustomerTransactionsProps {
  result: CustomerApplicationTransactionsResponse
  isCF?: boolean
}

export const CustomerTransactionReport = (props: CustomerTransactionsProps) => {
  const renderHeader = (result) => {
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'lightgrey',
              border: '1px solid black',
              width: '70%',
              textAlign: 'center',
              marginBottom: 5,
            }}
          >
            {props.isCF
              ? 'حالا للتمويل الاستهلاكي ش. م. م.'
              : 'شركة تساهيل للتمويل متناهي الصغر'}
          </div>
          <p style={{ margin: 0 }}>{timeToArabicDateNow(true)}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>الحركة تبعا للعميل</p>
          <p style={{ marginTop: 10 }}>
            <span style={{ border: '1px solid black', padding: 10 }}>
              {result.customer.name}
            </span>
            <span style={{ border: '1px solid black', padding: 10 }}>
              {result.customer.key}
            </span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>1/1</p>
        </div>
      </div>
    )
  }
  const renderBranchNameDiv = (branch) => (
    <div style={{ display: 'flex', marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'lightgrey',
            border: '1px solid black',
            minWidth: 240,
            textAlign: 'right',
            paddingRight: 5,
            marginRight: 2,
          }}
        >
          <span style={{ margin: '0px 5px' }}>{branch.code}</span>
          <span>{branch.name}</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  )
  const renderTableBody = (array) => {
    return (
      <tbody>
        {array.map((el, idx) => {
          return (
            <tr key={idx}>
              <td className="medium">{el.transactionCode}</td>
              <td className="medium">
                {numbersToArabic(el.installmentSerial) || '٠'}
              </td>
              <td className="medium">
                {el.date
                  ? timeToArabicDate(new Date(Number(el.date)).valueOf(), false)
                  : ''}
              </td>
              <td className="nowrap">{el.action}</td>
              <td className="medium">
                {numbersToArabic(el.transactionAmount)}
              </td>
              <td className="medium">{currency(el.currency)}</td>
              <td className="medium">{el.branchName}</td>
              <td className="medium">{el.manualPaymentReceipt || ''}</td>
              <td className="medium">{el.username}</td>
              <td className="medium">
                {timeToArabicDate(Number(el.createdAt), true)}
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }
  const renderTable = (_data) => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>كود الحركة</th>
            <th>رقم القسط</th>
            <th>التاريخ</th>
            <th>نوع الحركه</th>
            <th>قيمة الحركة</th>
            <th>عمله</th>
            <th>خزينه/بنك</th>
            <th>مستند حركة</th>
            <th>المستخدم</th>
            <th>الوقت</th>
          </tr>
        </thead>
        {renderTableBody(_data)}
      </table>
    )
  }
  const renderData = ({ result }) => {
    return (
      <>
        <Orientation size="landscape" />
        <div className="customerTrasactionReport" dir="rtl" lang="ar">
          {renderHeader(result)}
          {renderBranchNameDiv(result.branch)}
          {renderTable(result.result)}
        </div>
      </>
    )
  }
  return renderData(props)
}

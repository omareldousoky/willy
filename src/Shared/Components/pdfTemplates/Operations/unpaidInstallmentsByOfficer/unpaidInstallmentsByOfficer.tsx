import React from 'react'
import { Header } from '../../pdfTemplateCommon/header'
import './unpaidInstallmentsByOfficer.scss'

const numbersToArabic = (input) => {
  if (input || input === 0) {
    const id = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹']
    const inputStr = input.toString()
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number]
    })
  }
  return ''
}
const installmentStatuses = {
  unpaid: 'غير مسدد',
  partiallyPaid: 'مدفوع جزئيا',
  pending: 'قيد التحقيق',
}

interface UnpaidInstallmentsByOfficerProps {
  fromDate: string
  toDate: string
  data: any
  isCF?: boolean
}

const UnpaidInstallmentsByOfficer: React.FC<UnpaidInstallmentsByOfficerProps> = ({
  data,
  fromDate,
  toDate,
  isCF,
}) => {
  const renderCommissaryDetailsDiv = (CommissaryName = '') => (
    <div style={{ display: 'flex', margin: '5px 0' }}>
      <div style={{ width: '70%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '15%', minWidth: 80 }}>
            أسم المندوب :
          </p>
          <div
            style={{
              backgroundColor: 'darkgrey',
              border: '1px solid black',
              minWidth: 320,
              textAlign: 'right',
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{CommissaryName}</span>
          </div>
          {/* block below is commented for now, pending nadim to add representativeCode in the API `/report/unpaid-installments-by-officer` */}
          {/* <div
            style={{
              border: "1px solid black",
              minWidth: 160,
              textAlign: "left",
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{representativeCode}</span>
          </div> */}
        </div>
      </div>
      <div style={{ width: '30%' }} />
    </div>
  )
  const renderSummary = (
    type,
    name,
    count,
    totalInstallmentAmount,
    paidAmounts: null | number,
    totalrequiredAmount
  ) => {
    return (
      <div style={{ margin: '2px 0' }}>
        <div className="lineStroke" />
        <div style={{ display: 'flex', margin: '4px 0' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {type === 'Total' ? (
              <span style={{ marginLeft: 4, minWidth: 130 }}>
                {'الإجمالي العام : '}
              </span>
            ) : (
              <>
                <span style={{ marginLeft: 4, minWidth: 60 }}>
                  {'إجمالي : '}
                </span>
                <span style={{ marginLeft: 4, minWidth: 70 }}>
                  {'المندوب : '}
                </span>
              </>
            )}

            <div
              style={{
                backgroundColor: 'darkgrey',
                border: '1px solid black',
                minWidth: 330,
                textAlign: 'right',
                paddingRight: 2,
                marginLeft: 4,
              }}
            >
              <span>{name}</span>
            </div>
            <div
              style={{
                border: '1px solid black',
                textAlign: 'center',
                minWidth: 80,
                marginLeft: 4,
              }}
            >
              {count}
            </div>
            <div
              style={{
                border: '1px solid black',
                textAlign: 'center',
                minWidth: 80,
                marginLeft: 4,
              }}
            >
              {totalInstallmentAmount}
            </div>
            <div
              style={{
                border: '1px solid black',
                textAlign: 'center',
                minWidth: 80,
                marginLeft: 4,
              }}
            >
              {paidAmounts || 0}
            </div>
            <div
              style={{
                border: '1px solid black',
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              {totalrequiredAmount}
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>
        <div className="lineStroke" />
      </div>
    )
  }
  const renderTableBody = (array) => {
    return (
      <tbody>
        {array.map((el, idx) => {
          return (
            <tr key={idx}>
              <td>{el.customerName}</td>
              <td>{el.dateOfPayment}</td>
              <td>{el.installmentNumber}</td>
              <td>{installmentStatuses[el.installmentStatus]}</td>
              <td>{numbersToArabic(el.installmentAmount)}</td>
              <td>{el.paidAmount ? el.paidAmount : 0}</td>
              <td>{el.requiredAmount}</td>
              <td>{el.branchName}</td>
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
            <th>أسم العميل</th>
            <th>ت الإستحقاق</th>
            <th>رقم القسط</th>
            <th>حالة القسط</th>
            <th>قيمة القسط</th>
            <th>مسدد</th>
            <th>المستحق</th>
            <th>إسم الفرع</th>
          </tr>
        </thead>
        {renderTableBody(_data)}
      </table>
    )
  }
  const renderCommissaryData = (offficer) => {
    return (
      <div className="CommissaryDiv">
        {renderCommissaryDetailsDiv(
          offficer.unpaidInstallmentsByOfficerTotal.representativeName
            ? offficer.unpaidInstallmentsByOfficerTotal.representativeName
            : '--'
        )}
        {renderTable(offficer.unpaidInstallmentsByOfficerRows)}
        {renderSummary(
          'offficer',
          offficer.unpaidInstallmentsByOfficerTotal.representativeName
            ? offficer.unpaidInstallmentsByOfficerTotal.representativeName
            : '--',
          offficer.unpaidInstallmentsByOfficerTotal.count,
          offficer.unpaidInstallmentsByOfficerTotal.installmentAmounts,
          offficer.unpaidInstallmentsByOfficerTotal.paidAmounts
            ? offficer.unpaidInstallmentsByOfficerTotal.paidAmounts
            : 0,
          offficer.unpaidInstallmentsByOfficerTotal.requiredAmounts
        )}
      </div>
    )
  }
  const calculateTotal = (_data, key) => {
    let total = 0
    if (_data) {
      _data.forEach((el) => {
        if (el.unpaidInstallmentsByOfficerTotal[key]) {
          total += el.unpaidInstallmentsByOfficerTotal[key]
        }
      })
    }
    return total
  }
  const renderData = () => {
    const _data = data.response
    return (
      <div className="unpaidInstallmentsByOfficer" dir="rtl" lang="ar">
        <Header
          cf={isCF}
          fromDate={fromDate}
          toDate={toDate}
          title="قائمة الإقساط المستحقة بالمندوب"
        />
        {_data ? _data.map((offficer) => renderCommissaryData(offficer)) : null}
        {renderSummary(
          'Total',
          null,
          calculateTotal(_data, 'count'),
          calculateTotal(_data, 'installmentAmounts'),
          calculateTotal(_data, 'paidAmounts'),
          calculateTotal(_data, 'requiredAmounts')
        )}
      </div>
    )
  }
  return renderData()
}

export default UnpaidInstallmentsByOfficer

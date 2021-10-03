import React from 'react'
import { numbersToArabic, timeToArabicDate } from '../../../../Services/utils'
import Orientation from '../../../Common/orientation'
import './installmentsDuePerOfficerCustomerCard.scss'

const installmentStatuses = {
  unpaid: 'غير مسدد',
  partiallyPaid: 'مدفوع جزئيا',
  pending: 'قيد التحقيق',
}
interface InstallmentsDuePerOfficerCustomerCardProps {
  fromDate: string
  toDate: string
  data: any
}

const InstallmentsDuePerOfficerCustomerCard = (
  props: InstallmentsDuePerOfficerCustomerCardProps
) => {
  const renderHeader = (fromDate, toDate) => {
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
              width: '50%',
              textAlign: 'center',
              marginBottom: 5,
            }}
          >
            شركة تساهيل
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>الاقساط المستحقة للمندوب كارت العميل</p>
          <p style={{ margin: 0 }}>
            <span>{'من '}</span>
            <span>{fromDate}</span>
            <span>{'إلى '}</span>
            <span>{toDate}</span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>1/1</p>
          <p style={{ margin: 0 }}>{new Date().toDateString()}</p>
        </div>
      </div>
    )
  }
  const renderBranchNameDiv = (branchName = '') => (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <p style={{ margin: 0 }}>الفرع :</p>
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
            <span>{branchName}</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  )
  const renderCommissaryDetailsDiv = (
    CommissaryName = '',
    CommissaryID = null
  ) => (
    <div style={{ display: 'flex', margin: '5px 0' }}>
      <div style={{ width: '60%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '15%', minWidth: 90 }}>
            اسم المندوب :
          </p>
          <div
            style={{
              backgroundColor: 'lightgrey',
              border: '1px solid black',
              minWidth: 320,
              textAlign: 'right',
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{CommissaryName}</span>
          </div>
          {CommissaryID ? (
            <div
              style={{
                border: '1px solid black',
                minWidth: 160,
                textAlign: 'left',
                paddingRight: 5,
                marginRight: 2,
              }}
            >
              <span>{CommissaryID}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ width: '40%' }} />
    </div>
  )
  const renderSummary = (type, name = null, count, amount) => {
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
                <span style={{ marginLeft: 4, minWidth: 90 }}>
                  {type === 'Commissary' ? 'اسم المندوب : ' : 'الفرع : '}
                </span>
              </>
            )}

            <div
              style={{
                backgroundColor: 'lightgrey',
                border: '1px solid black',
                minWidth: 320,
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
              }}
            >
              {amount}
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
              <td className="short">ف&nbsp;&nbsp;{idx + 1}</td>
              <td className="long">{el.customerName}</td>
              <td className="nowrap" dir="ltr">
                {numbersToArabic(el.installmentNumber) || '٠'}
              </td>
              <td className="nowrap">
                {el.dateOfPayment
                  ? timeToArabicDate(
                      new Date(el.dateOfPayment).valueOf(),
                      false
                    )
                  : 'لا يوجد'}
              </td>
              <td className="nowrap">
                {el.lastPaymentDate
                  ? timeToArabicDate(
                      new Date(el.lastPaymentDate).valueOf(),
                      false
                    )
                  : 'لا يوجد'}
              </td>
              <td className="nowrap">
                {el.lastInstallmentDate
                  ? timeToArabicDate(
                      new Date(el.lastInstallmentDate).valueOf(),
                      false
                    )
                  : 'لا يوجد'}
              </td>
              <td className="nowrap">
                {installmentStatuses[el.installmentStatus]}
              </td>
              <td>{numbersToArabic(el.installmentAmount)}</td>
              <td>{el.amountDue}</td>
              <td>{numbersToArabic(el.mobilePhone) || 'لا يوجد'}</td>
              <td>{numbersToArabic(el.homePhone) || 'لا يوجد'}</td>
              <td>{numbersToArabic(el.businessPhone) || 'لا يوجد'}</td>
              <td>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <span>{el.credit}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'lightgrey',
                        minWidth: 30,
                        marginLeft: 4,
                      }}
                    >
                      {el.sum}
                    </span>
                    <span
                      style={{ backgroundColor: 'lightgrey', minWidth: 30 }}
                    >
                      {el.amount}
                    </span>
                  </div>
                </div>
              </td>
              <td className="long">{el.address}</td>
              <td className="area">{el.area}</td>
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
            <th />
            <th>اسم العميل</th>
            <th>رقم القسط</th>
            <th>ت الإستحقاق</th>
            <th>ت أخر سداد</th>
            <th>ت أخر قسط</th>
            <th>حالة القسط</th>
            <th>قيمة القسط</th>
            <th>المستحق</th>
            <th>الموبيل</th>
            <th>ت المنزل</th>
            <th>ت العمل</th>
            <th>رصيد مبلغ/عدد</th>
            <th>العنوان</th>
            <th>منطقة العمل</th>
          </tr>
        </thead>
        {renderTableBody(_data)}
      </table>
    )
  }
  const renderCommissaryData = (representative) => {
    return (
      <div className="CommissaryDiv">
        {renderCommissaryDetailsDiv(
          representative.name ? representative.name : '--',
          representative.id
        )}
        {renderTable(representative.customers)}
        {renderSummary(
          'Commissary',
          representative.name ? representative.name : '',
          representative.count,
          representative.amount
        )}
      </div>
    )
  }

  const renderBranchData = (branch) => {
    return (
      <div className="branchDiv">
        {renderBranchNameDiv(branch.name ? branch.name : '--')}
        {branch.representatives.map((representative) =>
          renderCommissaryData(representative)
        )}
        {renderSummary(
          'Branch',
          branch.name ? branch.name : '',
          branch.count,
          branch.amount
        )}
      </div>
    )
  }
  const renderData = ({ data, fromDate, toDate }) => {
    return (
      <>
        <Orientation size="landscape" />
        <div
          className="installmentsDuePerOfficerCustomerCard"
          dir="rtl"
          lang="ar"
        >
          {renderHeader(fromDate, toDate)}
          {data && data.branches
            ? data.branches.map((branch) => renderBranchData(branch))
            : null}
          {renderSummary('Total', null, data.count, data.amount)}
        </div>
      </>
    )
  }
  return renderData(props)
}

export default InstallmentsDuePerOfficerCustomerCard

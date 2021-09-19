import React from 'react'
import Tafgeet from 'tafgeetjs'
import { numbersToArabic, timeToArabicDateNow } from '../../../Services/utils'
import { companies, licenses } from '../../../Constants/pdf'
import './earlyPaymentReceipt.scss'

const EarlyPaymentReceipt = (props) => {
  const { type = 'lts' } = props
  function getCode() {
    if (props.data.product.beneficiaryType === 'individual')
      return props.data.customer.key
    return props.data.group.individualsInGroup.find(
      (customer) => customer.type === 'leader'
    ).customer.key
  }
  return (
    <div className="early-payment-receipt" lang="ar">
      <table className="title">
        <table
          style={{
            fontSize: '12px',
            margin: '10px 0px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              <div
                className={`${type === 'sme' ? 'lts' : type}-logo-print-tb`}
              />
            </th>
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              {licenses[type]}
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </table>
        <tbody>
          <tr>
            <th>{companies[type]}</th>
          </tr>
          <tr>
            <td>{`${props.branchDetails.name} - ${props.branchDetails.governorate}`}</td>
          </tr>
          <tr>
            <td>إيصال إيداع نقدية</td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <th className="frame">التاريخ</th>
            <td className="frame">{timeToArabicDateNow(false)}</td>
          </tr>
          <tr>
            <th className="frame">رقم الإيصال</th>
            <td className="frame">
              {numbersToArabic(props.receiptData[0].receiptNumber)}
            </td>
          </tr>
          <tr>
            <th className="frame">اسم العميل</th>
            <td className="frame">{props.receiptData[0].customerName}</td>
          </tr>
          <tr>
            <th className="frame">كود العميل</th>
            <td className="frame">{numbersToArabic(getCode())}</td>
          </tr>
          <tr>
            <th className="frame"> السداد الحالي </th>
            <td className="frame" style={{ direction: 'ltr' }}>
              {numbersToArabic(props.receiptData[0].paidNow)}
              <div>
                {new Tafgeet(props.receiptData[0].paidNow, 'EGP').parse()}
              </div>
            </td>
          </tr>
          <tr style={{ height: '45px' }}>
            <td>توقيع المستلم :</td>
            <td>-------------------------------------------</td>
          </tr>
          <tr>
            <td>روجع واعتمد :</td>
            <td>-------------------------------------------</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EarlyPaymentReceipt

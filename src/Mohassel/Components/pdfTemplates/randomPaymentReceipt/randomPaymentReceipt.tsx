import React from 'react'
import './randomPaymentReceipt.scss'
import Tafgeet from 'tafgeetjs'
import {
  timeToArabicDate,
  numbersToArabic,
} from '../../../../Shared/Services/utils'
import * as local from '../../../../Shared/Assets/ar.json'

const randomPaymentReceipt = (props) => {
  // function getPurpose(installmentSerial: number) {
  //   switch (installmentSerial) {
  //     case 0:
  //       return local.stamps
  //     case 1:
  //       return local.representativeFees
  //     case 2:
  //       return local.applicationFee
  //     default:
  //       return ''
  //   }
  // }
  const getValueFromLocalizationFileByKey = (key) => {
    if (key === 'reissuingFees') return local.reissuingFees
    if (key === 'legalFees') return local.legalFees
    if (key === 'clearanceFees') return local.clearanceFees
    if (key === 'toktokStamp') return local.toktokStamp
    if (key === 'tricycleStamp') return local.tricycleStamp
    return ''
  }
  return (
    <div className="random-payment-receipt">
      {props.receiptData.map((receiptData, index) => {
        return (
          <div
            key={index}
            className="random-payment-receipt"
            dir="rtl"
            lang="ar"
          >
            <div className="receipt-container">
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
                  <th colSpan={6}>
                    <div className="logo-print-tb" />
                  </th>
                  <th colSpan={6}>
                    ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
                  </th>
                </tr>
                <tr style={{ height: '10px' }} />
              </table>
              <div className="receipt-header">
                <h5>{local.tasaheelName}</h5>
                <h5>{local.paymentReceipt}</h5>
              </div>
              <div className="receipt-content">
                <div>
                  <span className="title">{local.date}</span>
                  <span className="info">
                    {timeToArabicDate(receiptData.date, false)}
                  </span>
                </div>
                <div>
                  <span className="title">{local.receiptNumber}</span>
                  <span className="info">
                    {numbersToArabic(receiptData.receiptNumber)}
                  </span>
                </div>
                <div>
                  <span className="title">{local.customerName}</span>
                  <span className="info">{receiptData.customerName}</span>
                </div>
                <div>
                  <span className="title">{local.value}</span>
                  <span className="info">
                    <span style={{ direction: 'ltr' }}>
                      {numbersToArabic(receiptData.installmentAmount)}
                    </span>
                    {receiptData.installmentAmount
                      ? ` = (${new Tafgeet(
                          receiptData.installmentAmount,
                          'EGP'
                        ).parse()})`
                      : null}
                  </span>
                </div>
                <div>
                  <span className="title">{local.purpose}</span>
                  <span className="info">
                    {receiptData.type === 'penalty'
                      ? local.payPenalty
                      : receiptData.type === 'randomPayment'
                      ? getValueFromLocalizationFileByKey(
                          receiptData.randomPaymentType
                        )
                      : ''}
                  </span>
                </div>
                <div>
                  <span className="title">{local.recipientSignature}</span>
                  <span className="dots">
                    ........................................................
                  </span>
                </div>
                <div>
                  <span className="title">{local.revisedAndIssued}</span>
                  <span className="dots">
                    ........................................................
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default randomPaymentReceipt

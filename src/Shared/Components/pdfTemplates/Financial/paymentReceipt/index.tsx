import React from 'react'
import './paymentReceipt.scss'
import Tafgeet from 'tafgeetjs'
import * as local from '../../../../Assets/ar.json'
import { numbersToArabic, extractGMTDate } from '../../../../Services/utils'
import { PaymentReceiptProps } from './types'
import { companies, licenses } from '../../../../Constants/pdf'

const PaymentReceipt = (props: PaymentReceiptProps) => {
  const { type } = props
  const isCF = type === 'cf'

  function getPurpose(installmentSerial: number) {
    switch (installmentSerial) {
      case 0:
        return local.stamps
      case 1:
        return local.representativeFees
      case 2:
        return local.applicationFee
      default:
        return ''
    }
  }

  return (
    <>
      {props.receiptData.map((receiptData, index) => {
        return (
          <div key={index} className="payment-receipt" lang="ar">
            <div className="receipt-container">
              <table>
                <tbody>
                  <tr style={{ height: '10px' }} />
                  <tr className="w-100 d-flex flex-row justify-content-between">
                    <th colSpan={6}>
                      <div className={`${isCF ? 'cf' : 'lts'}-logo-print-tb`} />
                    </th>
                    <th colSpan={6}>{licenses[type] ?? licenses.lts}</th>
                  </tr>
                  <tr style={{ height: '10px' }} />
                </tbody>
              </table>
              <div className="receipt-header">
                <h5>{companies[type] ?? companies.lts}</h5>
                <h5>{local.paymentReceipt}</h5>
              </div>
              <div className="receipt-data">
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">{local.date}</span>
                  <span className="info">
                    {extractGMTDate(receiptData.date)}
                  </span>
                </div>
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">{local.receiptNumber}</span>
                  <span className="info">
                    {numbersToArabic(receiptData.receiptNumber)}
                  </span>
                </div>
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">
                    {props.companyReceipt
                      ? local.companyName
                      : local.customerName}
                  </span>
                  <span className="info">{receiptData.customerName}</span>
                </div>
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">
                    {props.fromLoanIssuance
                      ? local.value
                      : local.installmentType}
                  </span>
                  <span className="info">
                    <span style={{ direction: 'ltr' }}>
                      {numbersToArabic(receiptData.installmentAmount)}
                    </span>
                  </span>
                </div>
                {props.fromLoanIssuance ? null : (
                  <div className="d-flex my-4 mx-0 w-100">
                    <span className="title">{local.paidFrom}</span>
                    <span className="info">
                      {numbersToArabic(receiptData.previouslyPaid)}
                    </span>
                  </div>
                )}
                {props.fromLoanIssuance ? null : (
                  <div className="d-flex my-4 mx-0 w-100">
                    <span className="title">{local.currentPayment}</span>
                    <span className="info">
                      <span style={{ direction: 'ltr' }}>
                        {numbersToArabic(receiptData.paidNow)}
                      </span>
                      {receiptData.paidNow
                        ? ` = (${new Tafgeet(
                            receiptData.paidNow,
                            'EGP'
                          ).parse()})`
                        : null}
                    </span>
                  </div>
                )}
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">{local.purpose}</span>
                  {props.fromLoanIssuance ? (
                    <span className="info">
                      {getPurpose(receiptData.installmentSerial)}
                    </span>
                  ) : (
                    <span className="info">
                      {'سداد قسط رقم : ' +
                        numbersToArabic(props.data?.applicationKey) +
                        '/' +
                        numbersToArabic(receiptData.installmentSerial)}
                    </span>
                  )}
                </div>
                {props.fromLoanIssuance ? null : (
                  <div className="d-flex my-4 mx-0 w-100">
                    <span className="title">{local.remaining}</span>
                    <span className="info">
                      {numbersToArabic(receiptData.remaining)}
                    </span>
                  </div>
                )}
                <div className="d-flex my-4 mx-0 w-100">
                  <span className="title">{local.recipientSignature}</span>
                  <span className="dots">
                    ........................................................
                  </span>
                </div>
                <div className="d-flex my-4 mx-0 w-100">
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
    </>
  )
}

export default PaymentReceipt

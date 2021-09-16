import React from 'react'
import './randomPaymentReceipt.scss'
import Tafgeet from 'tafgeetjs'
import { numbersToArabic, extractGMTDate } from '../../../Services/utils'
import local from '../../../Assets/ar.json'
import { RandomPaymentReceiptProps } from './types'
import { Header as CFHeader } from '../../../../CF/Components/PdfTemplates/pdfTemplatesCommon/header'

const LTSReceiptHeader = () => (
  <>
    <table
      className="w-100 text-center"
      style={{
        margin: '10px 0px',
      }}
    >
      <tbody>
        <tr style={{ height: '10px' }} />
        <tr className="w-100 d-flex flex-row justify-content-between">
          <th colSpan={6}>
            <div className="logo-print-tb" />
          </th>
          <th colSpan={6}>
            ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (2) لسنة 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </tbody>
    </table>
  </>
)

const RandomPaymentReceipt = ({
  receiptData,
  appType = 'LTS',
}: RandomPaymentReceiptProps) => {
  const pdfHeaders = {
    LTS: <LTSReceiptHeader />,
    CF: <CFHeader />,
  }

  return (
    <div className="random-payment-receipt">
      {receiptData?.map((data, index) => {
        return (
          <div key={index} className="random-payment-receipt" lang="ar">
            <div className="receipt-container">
              {pdfHeaders[appType]}

              <div className="receipt-header">
                <h5>{local.tasaheelName}</h5>
                <h5>{local.paymentReceipt}</h5>
              </div>

              <div className="receipt-content">
                <div>
                  <span className="title">{local.date}</span>
                  <span className="info">{extractGMTDate(data.date)}</span>
                </div>
                <div>
                  <span className="title">{local.receiptNumber}</span>
                  <span className="info">
                    {numbersToArabic(data.receiptNumber)}
                  </span>
                </div>
                <div>
                  <span className="title">{local.customerName}</span>
                  <span className="info">{data.customerName}</span>
                </div>
                <div>
                  <span className="title">{local.value}</span>
                  <span className="info">
                    <span style={{ direction: 'ltr' }}>
                      {numbersToArabic(data.installmentAmount)}
                    </span>
                    {data.installmentAmount
                      ? ` = (${new Tafgeet(
                          data.installmentAmount,
                          'EGP'
                        ).parse()})`
                      : null}
                  </span>
                </div>
                <div>
                  <span className="title">{local.purpose}</span>
                  <span className="info">
                    {data.type === 'penalty'
                      ? local.payPenalty
                      : data.type === 'randomPayment'
                      ? local[data.randomPaymentType]
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

export default RandomPaymentReceipt

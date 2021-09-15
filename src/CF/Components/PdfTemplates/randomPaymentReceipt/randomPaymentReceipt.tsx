import React from 'react'
import './randomPaymentReceipt.scss'
import Tafgeet from 'tafgeetjs'
import {
  numbersToArabic,
  extractGMTDate,
} from '../../../../Shared/Services/utils'
import local from '../../../../Shared/Assets/ar.json'
import { Header } from '../pdfTemplatesCommon/header'

const RandomPaymentReceipt = (props) => {
  return (
    <div className="random-payment-receipt">
      {props.receiptData.map((receiptData, index) => {
        return (
          <div key={index} className="random-payment-receipt" lang="ar">
            <div className="receipt-container">
              <Header />

              <div className="receipt-content">
                <div>
                  <span className="title">{local.date}</span>
                  <span className="info">
                    {extractGMTDate(receiptData.date)}
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
                      ? local[receiptData.randomPaymentType]
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

import React from 'react'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import './officersPercentPayment.scss'

interface OfficersPercentPaymentHeaderProps {
  fromDate: string
  toDate: string
}
const OfficersPercentPaymentHeader = ({
  fromDate,
  toDate,
}: OfficersPercentPaymentHeaderProps) => {
  return (
    <>
      <div className="wrapper">
        <span className="logo-print" role="img" />
        <p className="m-0 ml-3 text-right text-sm">
          ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
        </p>
      </div>
      <p className="mr-3 text-left">شركة تساهيل للتمويل متناهي الصغر</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '95%',
        }}
      >
        <p style={{ margin: 'auto 0 15px', fontSize: '16px' }}>
          تقرير نسب السداد و الانتاجيه للمندوبين : من &nbsp;
          {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى : &nbsp;
          {timeToArabicDate(new Date(toDate).valueOf(), false)}
        </p>
      </div>
    </>
  )
}

export default OfficersPercentPaymentHeader

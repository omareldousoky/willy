import React from 'react'
import store from '../../../../Shared/redux/store'
import {
  getCurrentTime,
  timeToArabicDate,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'

interface HeaderProps {
  title: string
  showCurrentUser?: boolean
  showCurrentTime?: boolean
  showCurrentDate?: boolean
  fromDate?: string | number
  toDate?: string | number
  branchName?: string
  sme?: boolean
}
export const Header = ({
  title,
  showCurrentUser = true,
  showCurrentTime = true,
  showCurrentDate = false,
  fromDate,
  toDate,
  branchName,
  sme,
}: HeaderProps) => {
  return (
    <>
      <div className="d-flex justify-content-between m-2">
        <span className="logo-print" role="img" />
        <p className="m-0 ml-3 text-right text-sm">
          {sme
            ? 'ترخيص ممارسه نشاط تمويل المشروعات الصغيره والمتوسطة رقم ١ لسنه ٢٠٢١'
            : 'ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (2) لسنه 2015'}
        </p>
      </div>
      <div className="d-flex mb-3">
        <p className="ml-3 pt-1 text-left">
          <span>شركة تساهيل للتمويل متناهي الصغر</span>
          {branchName && (
            <>
              <br />
              <p className="font-weight-bold ml-auto pr-2">فرع: {branchName}</p>
            </>
          )}
        </p>
        {showCurrentUser && (
          <p className="font-weight-bold ml-auto pr-2">
            {store.getState().auth.name}
          </p>
        )}
        {showCurrentTime && (
          <p className="font-weight-bold ml-auto pr-2">{getCurrentTime()}</p>
        )}
        {showCurrentDate && (
          <p className="font-weight-bold ml-auto pr-2">
            {timeToArabicDateNow(true)}
          </p>
        )}
      </div>
      <div className="d-flex mb-3">
        <p className="m-auto" style={{ fontSize: '16px' }}>
          {title} {fromDate && `من : `}
          {fromDate &&
            `${timeToArabicDate(new Date(fromDate).valueOf(), false)}`}
          {toDate &&
            ` إلى : ${timeToArabicDate(new Date(toDate).valueOf(), false)}`}
        </p>
      </div>
    </>
  )
}

import React from 'react'
import store from '../../../redux/store'
import {
  getCurrentTime,
  timeToArabicDate,
  timeToArabicDateNow,
} from '../../../Services/utils'

interface HeaderProps {
  title?: string
  showCurrentUser?: boolean
  showCurrentTime?: boolean
  showCurrentDate?: boolean
  fromDate?: string | number
  toDate?: string | number
  branchName?: string
  sme?: boolean
  cf?: boolean
  fl?: boolean
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
  cf,
  fl,
}: HeaderProps) => {
  return (
    <>
      <div className="d-flex justify-content-between m-2">
        <span className={`${cf ? 'cf-' : ''}logo-print`} role="img" />
        <p className="m-0 ml-3 text-right text-sm">
          {cf
            ? 'ترخيص رقم 23 بتاريخ 31/05/2021'
            : fl
            ? 'مرخصه بسجل المؤجرين التمويليين بالهيئه العامه للرقابه الماليه برقم ٣٠١ بتاريخ ٣١/ ٥ /٢٠٢١'
            : sme
            ? 'ترخيص ممارسة نشاط تمويل المشروعات المتوسطة والصغيرة رقم ١ لسنه ٢٠٢١'
            : 'ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (2) لسنه 2015'}
        </p>
      </div>
      <div className="d-flex mb-3">
        <p className="ml-3 pt-1 text-left">
          <span>
            {cf
              ? 'حالا للتمويل الاستهلاكي ش. م. م.'
              : 'شركة تساهيل للتمويل متناهي الصغر'}
          </span>
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
        {title && (
          <p className="m-auto" style={{ fontSize: '16px' }}>
            {title} {fromDate && `من : `}
            {fromDate &&
              `${timeToArabicDate(new Date(fromDate).valueOf(), false)}`}
            {toDate &&
              ` إلى : ${timeToArabicDate(new Date(toDate).valueOf(), false)}`}
          </p>
        )}
      </div>
    </>
  )
}

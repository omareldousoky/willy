import React from 'react'
import store from '../../../../Shared/redux/store'
import { getCurrentTime, timeToArabicDate } from '../../../../Shared/Services/utils'

interface HeaderProps {
	title: string;
	showCurrentUser?: boolean;
	showCurrentTime?: boolean;
  fromDate?: string;
  toDate?: string;
}
export const Header = ({
	title,
	showCurrentUser = true,
	showCurrentTime = true,
  fromDate,
  toDate,
}: HeaderProps) => {
  return (
    <>
      <div className="d-flex justify-content-between m-2">
        <span className="logo-print" role="img" />
        <p className="m-0 ml-3 text-right text-sm">
          ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
        </p>
      </div>
			<div className="d-flex mb-3">
      	<p className="ml-3 pt-1 text-left">شركة تساهيل للتمويل متناهي الصغر</p>
				{showCurrentUser && <p className="font-weight-bold ml-auto pr-2">{store.getState().auth.name}</p>}
				{showCurrentTime && <p className="font-weight-bold ml-auto pr-2">{getCurrentTime()}</p>}
			</div>
      <div className="d-flex mb-3">
        <p className="m-auto" style={{ fontSize: '16px' }}>
          {title} {fromDate && `من : `}
          {fromDate && `${timeToArabicDate(new Date(fromDate).valueOf(), false)}`}
          {toDate && `إلى : ${timeToArabicDate(new Date(toDate).valueOf(), false)}`}
        </p>
      </div>
		</>	
  )
}


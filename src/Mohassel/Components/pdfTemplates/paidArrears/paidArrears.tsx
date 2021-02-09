import React from "react";
import store from "../../../../Shared/redux/store";
import {
  getCurrentTime,
  timeToArabicDate,
  timeToArabicDateNow,
} from "../../../../Shared/Services/utils";
import "./paidArrears.scss";

interface PaidArrearsProps {
  fromDate: string;
  toDate: string;
  data: any; //TODO
}
export const PaidArrears = ({ toDate, fromDate, data }: PaidArrearsProps) => {
  return (
    <div className="paid-arrears" lang="ar">
      <div className="header-wrapper">
        <span className="logo-print" role="img" />
        <p className="m-0">
          ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
        </p>
      </div>
      <div className="header-wrapper mb-0">
        <p style={{ marginRight: "10px" }}>شركة تساهيل للتمويل متناهي الصغر</p>
        <p>{store.getState().auth.name}</p>
        <p>{getCurrentTime()}</p>
      </div>
      <div className="d-flex flex-column mx-3">
        <p className="report-title">
          حركات سداد على المتأخرات : من &nbsp;
          {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى : &nbsp;
          {timeToArabicDate(new Date(toDate).valueOf(), false)}
        </p>
        <hr className="horizontal-line" />
      </div>
      <table>
        <thead>
          <th>غرامة مسددة</th>
          <th>غرامات مستحقة على القسط</th>
          <th>أيام التأخير للقسط</th>
          <th>قيمة الحركة</th>
          <th>ت حركة السداد</th>
          <th>قيمة القسط</th>
          <th>رقم القسط</th>
          <th>اسم العميل</th>
          <th>كود العميل</th>
          <th>كود الحركة</th>
          <th>الفرع</th>
          <th>كود الفرع</th>
        </thead>
        <tbody>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
          <td>0000.0000</td>
        </tbody>
      </table>
    </div>
  );
};

import React from "react";
import store from "../../../../Shared/redux/store";
import {
  getCurrentTime,
  groupBy,
  numbersToArabic,
  timeToArabicDate,
} from "../../../../Shared/Services/utils";
import {
  CustomersArrearsResponse,
  CustomersArrearsSingleResponse,
} from "../../../Services/interfaces";
import "./customersArrears.scss";

interface CustomersArrearsProps {
  date: string;
  data: CustomersArrearsResponse;
}
export const CustomersArrears = ({ data, date }: CustomersArrearsProps) => {
  const dataGroupedByBranch = groupBy(
    data as Record<string, unknown>[],
    (data) => data.branchCode
  );
  return (
    <div className="customers-arrears">
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
          متأخرات المندوب لم يستحق أو مسدد جزئي حتي :&nbsp;
          {timeToArabicDate(new Date(date).valueOf(), false)}
        </p>
        <hr className="horizontal-line" />
      </div>
      {dataGroupedByBranch &&
        dataGroupedByBranch.forEach(
          (key: string, value: CustomersArrearsSingleResponse) => (
            <React.Fragment key={key}>
              <p className="branch-name">
                {value.branchName} (كود الفرع:{" "}
                {numbersToArabic(value.branchCode)})
              </p>
              <table
                className="report-container"
                cellPadding="2"
                cellSpacing="2"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>تاريخ آخر حركة سداد</th>
                    <th></th>
                    <th colSpan={2}></th>
                    <th colSpan={2}>الرصيد</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={3}>المتأخرات</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={8}>بيانات العميل</th>
                  </tr>
                  <tr>
                    <th colSpan={2}>القسط مسدد بالكامل</th>
                    <th>مرات الترحيل</th>
                    <th colSpan={2}>مبلغ آخر سداد</th>
                    <th>مبلغ</th>
                    <th>عدد</th>
                    <th>قيمة القسط</th>
                    <th>أيام التأخير</th>
                    <th>أخر سداد</th>
                    <th>أكبر تأخير</th>
                    <th>بداية التأخير</th>
                    <th>مبلغ</th>
                    <th>عدد</th>
                    <th>عدد أقساط</th>
                    <th>قيمة التمويل</th>
                    <th>ت التمويل</th>
                    <th colSpan={3}>المندوب</th>
                    <th colSpan={3}>اسم العميل</th>
                    <th>نوع العميل</th>
                    <th>كود العميل</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      {value.latestFullPaymentDate
                        ? timeToArabicDate(
                            new Date(value.latestFullPaymentDate).valueOf(),
                            false
                          )
                        : ""}
                    </td>
                    <td>{numbersToArabic(value.tarheelatCount) || "۰"}</td>
                    <td colSpan={2}>
                      {numbersToArabic(value.lateAmount) || "۰"}
                    </td>
                    <td>{numbersToArabic(value.raseedAmount) || "۰"}</td>
                    <td>{numbersToArabic(value.raseedCount) || "۰"}</td>
                    <td>{numbersToArabic(value.installmentAmount) || "۰"}</td>
                    <td>{numbersToArabic(value.lateDays) || "۰"}</td>
                    <td>
                      {value.latestPaymentDate
                        ? timeToArabicDate(
                            new Date(value.latestPaymentDate).valueOf(),
                            false
                          )
                        : ""}
                    </td>
                    <td>{numbersToArabic(value.lastPaidAmount) || "۰"}</td>
                    <td>٢٣/١٢/٢٠٢٠</td>
                    <td>{numbersToArabic(6120)}</td>
                    <td>{numbersToArabic(10)}</td>
                    <td>{numbersToArabic(24)}</td>
                    <td>{numbersToArabic(10000)}</td>
                    <td>٢٣/١٢/٢٠٢٠</td>
                    <td colSpan={3}>مصطفى عبدالقادر عبدالعظيم علم الدين</td>
                    <td colSpan={3}>ايمان عبدالمنعم محمد مصطفي</td>
                    <td>فردي</td>
                    <td>{numbersToArabic(110700004847)}</td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )
        )}
      <table className="report-container" cellPadding="2" cellSpacing="2">
        <tbody>
          {/* total Data */}
          <tr className="baby-blue">
            <td colSpan={2}></td>
            <td></td>
            <td colSpan={2}></td>
            <td>{numbersToArabic("12345,444")}</td>
            <td>{numbersToArabic(24)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{numbersToArabic("12345,444")}</td>
            <td>{numbersToArabic(24)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td colSpan={3}></td>
            <td colSpan={3}></td>
            <td>{numbersToArabic(4)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

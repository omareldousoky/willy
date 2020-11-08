import React from "react";
import "./crossedOutLoansList.scss";
import * as local from "../../../../Shared/Assets/ar.json";
import { timeToArabicDate } from "../../../../Shared/Services/utils";

const CrossedOutLoansList = (props) => {
  const data = props.data.data;
  const days = data.days;
  const totalNumberOfTransactions = Number(data.numTrx);
  const totalTransactionAmount = Number(data.transactionAmount);
  const totalTransactionInterest = Number(data.transactionInterest);
  const totalTransactionPrincipal = Number(data.transactionPrincipal);
  const startDate = timeToArabicDate(props.data.req.startDate, false);
  const endDate = timeToArabicDate(props.data.req.endDate, false);

  const getStatus = (value) => {
    switch (value) {
      case "unpaid":
        return local.unpaid;
      case "pending":
        return local.pending;
      case "paid":
        return local.paid;
      case "partiallyPaid":
        return local.partiallyPaid;
      case "rescheduled":
        return local.rescheduled;
      case "cancelled":
        return local.cancelled;
      case "issued":
        return local.issued;
      case "created":
        return local.created;
      case "approved":
        return local.approved;
      default:
        return "";
    }
  };

  const DayComponent = ({ day }) => {
    return (
      <>
        {day.branches.map((branch, idx) => (
          <BranchComponent key={idx} branch={branch} />
        ))}

        <tr style={{ height: "1em" }}></tr>
        <tbody className="tbodyborder">
          <tr>
            <td></td>
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">{day.truthDate.substring(0, 10)}</td>
            <td></td>
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">{day.numTrx}</td>
            <td></td>
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">{day.transactionPrincipal}</td>
            <td className="frame">{day.transactionInterest}</td>
            <td className="frame">{day.transactionAmount}</td>
          </tr>

          <tr>
            <td colSpan={8}></td>
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">{day.rbPrincipal}</td>
            <td className="frame">{day.rbInt}</td>
            <td className="frame">{day.rbAmount}</td>
          </tr>
          <tr>
            <td colSpan={8}></td>
            <td className="frame">صافي المبلغ</td>
            <td className="frame">{day.netPrincipal}</td>
            <td className="frame">{day.netInt}</td>
            <td className="frame">{day.netAmount}</td>
          </tr>
        </tbody>

        <tr style={{ height: "1em" }}></tr>
      </>
    );
  };

  const BranchComponent = ({ branch }) => {
    return (
      <tbody>
        <tr>
          <th className="gray frame" colSpan={2}>
            {branch.branchName}
          </th>
        </tr>

        {branch.rows.map((row, idx) => (
          <tr key={row.loanId}>
            <td>{idx + 1}</td>
            <td>{row.customerKey}</td>
            <td>{row.customerName}</td>
            <td>{row.loanSerial}</td>
            <td>{row.loanPrincipal}</td>
            <td>{row.issueDate}</td>
            <td>{getStatus(row.loanStatus)}</td>
            <td></td>
            <td></td>
            <td>{row.transactionPrincipal}</td>
            <td>{row.transactionInterest}</td>
            <td>{row.transactionAmount}</td>
            <td>{row.canceled === 1 ? local.cancelledTransaction : null}</td>
          </tr>
        ))}

        <tr>
          <th colSpan={100} className="horizontal-line"></th>
        </tr>

        <tr>
          <td></td>
          <td className="frame" colSpan={2}>
            إجمالي
          </td>
          <td className="frame" colSpan={2}>
            {branch.branchName}
          </td>
          <td className="frame" colSpan={1}>
            {branch.truthDate.substring(0, 10)}
          </td>
          <td className="frame">{branch.numTrx}</td>
          <td></td>
          <td className="frame">إجمالي المبلغ</td>
          <td className="frame">{branch.transactionPrincipal}</td>
          <td className="frame">{branch.transactionInterest}</td>
          <td className="frame">{branch.transactionAmount}</td>
        </tr>

        <tr>
          <td colSpan={8}></td>
          <td className="frame">القيمة الملغاه</td>
          <td className="frame">{branch.rbPrincipal}</td>
          <td className="frame">{branch.rbInt}</td>
          <td className="frame">{branch.rbAmount}</td>
        </tr>
        <tr>
          <td colSpan={8}></td>
          <td className="frame">صافي المبلغ</td>
          <td className="frame">{branch.netPrincipal}</td>
          <td className="frame">{branch.netInt}</td>
          <td className="frame">{branch.netAmount}</td>
        </tr>
        <tr>
          <th colSpan={100} className="horizontal-line"></th>
        </tr>
      </tbody>
    );
  };

  return (
    <>
      <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
        <tr style={{ height: "10px" }}></tr>
        <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
        <tr style={{ height: "10px" }}></tr>
      </table>
      <div
        className="crossed-out-loans-list"
        style={{ direction: "rtl" }}
        lang="ar"
      >
        <table className="report-container">
          <thead className="report-header">
            <tr className="headtitle">
              <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
              <th colSpan={6}>قائمة حركات إعدام ديون القروض المنفذة</th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>المركز الرئيسي</th>
              <th colSpan={6}>
                تاريخ الحركه من {startDate} الي {endDate}
              </th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>{new Date().toDateString()}</th>
              <th colSpan={6}>جنيه مصري</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line"></th>
            </tr>
            <tr>
              {/* <th>رقم مسلسل</th> */}
              <th>كود الحركه</th>
              <th>كود العميل</th>
              <th className="name">أسم العميل</th>
              <th>مسلسل القرض</th>
              <th>قيمة</th>
              <th>تاريخ القرض</th>
              <th style={{ width: "10%" }}>الحالة الان</th>
              <th></th>
              <th></th>
              <th>أصل</th>
              <th>قيمة الحركة فائدة</th>
              <th>إجمالي</th>
              <th>حالة الحركة</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line"></th>
            </tr>
            {/* <tr>
            <th className="gray frame" colSpan={2}>
              تاريخ الحركه
            </th>
            <th className="gray frame" colSpan={2}>
              2020/06/09
            </th>
          </tr> */}
          </thead>

          {days.map((day, idx) => (
            <DayComponent key={idx} day={day} />
          ))}

          <tr style={{ height: "1em" }}></tr>

          <tbody className="tbodyborder">
            <tr>
              <td></td>
              <td className="gray frame" colSpan={2}>
                إجمالي بالعمله
            </td>
              <td className="gray frame">جنيه مصري</td>
              <td></td>
              <td className="frame">إجمالي عدد الحركات</td>
              <td className="frame">{totalNumberOfTransactions}</td>
              <td></td>
              <td className="frame">إجمالي المبلغ</td>
              <td className="frame">{totalTransactionPrincipal}</td>
              <td className="frame">{totalTransactionInterest}</td>
              <td className="frame">{totalTransactionAmount}</td>
            </tr>

            <tr>
              <td colSpan={8}></td>
              <td className="frame">القيمة الملغاه</td>
              <td className="frame">{data.rbPrincipal}</td>
              <td className="frame">{data.rbInt}</td>
              <td className="frame">{data.rbAmount}</td>
            </tr>
            <tr>
              <td colSpan={8}></td>
              <td className="frame">صافي المبلغ</td>
              <td className="frame">{data.netPrincipal}</td>
              <td className="frame">{data.netInt}</td>
              <td className="frame">{data.netAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CrossedOutLoansList;

import React from "react";
import "./loanPenaltiesList.scss";
import * as local from "../../../../Shared/Assets/ar.json";
import { timeToArabicDate } from "../../../../Shared/Services/utils"

const LoanPenaltiesList = (props) => {
  const data = props.data;
  const days = data.days;
  const totalNumberOfTransactions = Number(data.totalNumberOfTransactions);
  const totalTransactionAmount = Number(data.totalTransactionAmount);
  const startDate = timeToArabicDate(props.data.startDate, false);
  const endDate = timeToArabicDate(props.data.endDate, false);
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
            <td className="gray horizontal-line" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray horizontal-line">
              {day.truthDate.substring(0, 10)}
            </td>
            <td></td>
            <td className="horizontal-line">إجمالي عدد الحركات</td>
            <td className="horizontal-line">{day.numTrx}</td>
            <td></td>
            <td className="horizontal-line">إجمالي المبلغ</td>
            <td className="horizontal-line">{day.transactionAmount}</td>
          </tr>

          <tr>
            <td colSpan={8}></td>
            <td className="horizontal-line">القيمة الملغاه</td>
            <td className="horizontal-line">{day.rbAmount}</td>
          </tr>
          <tr>
            <td colSpan={8}></td>
            <td className="horizontal-line">القيمة المسدده</td>
            <td className="horizontal-line">{day.netAmount}</td>
          </tr>
        </tbody>
      </>
    );
  };

  const BranchComponent = ({ branch }) => {
    return (
      <tbody>
        <tr>
          <th className="gray horizontal-line" colSpan={2}>
            {branch.branchName}
          </th>
        </tr>

        {branch.rows.map((row, idx) => (
          <tr key={row.loanId}>
            <td>{idx + 1}</td>
            {/* <td>{row.transactionCode}</td> */}
            <td colSpan={2}>{row.customerKey}</td>
            <td colSpan={2}>{row.customerName}</td>
            <td colSpan={1}>{row.loanSerial}</td>
            {/* <td>0004519</td> */}
            <td>{row.loanPrincipal}</td>
            <td colSpan={2}>{row.issueDate}</td>
            <td colSpan={1}>{getStatus(row.loanStatus)}</td>
            <td colSpan={1}></td>
            <td colSpan={2}>{row.transactionAmount}</td>
            <td colSpan={2}>{row.canceled === 1 ? local.cancelledTransaction : null}</td>
          </tr>
        ))}

        <tr>
          <th colSpan={15} className="border-line"></th>
        </tr>

        <tr>
          <td></td>
          <td className="horizontal-line" colSpan={2}>
            إجمالي
          </td>
          <td className="horizontal-line" colSpan={2}>
            {branch.branchName}
          </td>
          <td className="horizontal-line" colSpan={1}>
            {branch.truthDate.substring(0, 10)}
          </td>
          <td className="horizontal-line">{branch.numTrx}</td>
          <td></td>
          <td className="horizontal-line">إجمالي المبلغ</td>
          <td className="horizontal-line">{branch.transactionAmount}</td>
        </tr>

        <tr>
          <td colSpan={8}></td>
          <td className="horizontal-line">القيمة الملغاه</td>
          <td className="horizontal-line">{branch.rbAmount}</td>
        </tr>
        <tr>
          <td colSpan={8}></td>
          <td className="horizontal-line">القيمة المسدده</td>
          <td className="horizontal-line">{branch.netAmount}</td>
        </tr>
        <tr>
          <th colSpan={15} className="border-line"></th>
        </tr>
      </tbody>
    );
  };

  return (
      <div className="loan-penalties-list" dir="rtl" lang="ar">
      <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
        <tr style={{ height: "10px" }}></tr>
        <tr style={{width:'100%',display:'flex',flexDirection:'row' , justifyContent:'space-between'}}><th colSpan={6} style = {{backgroundColor:'red'}}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6} style={{backgroundColor:'blue'}}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
        <tr style={{ height: "10px" }}></tr>
      </table>
        <table className="report-container">
          <thead className="report-header">
            <tr className="headtitle">
              <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
              <th colSpan={6}>قائمة حركة غرامات القروض المنفذة</th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>المركز الرئيسي</th>
              <th colSpan={6}>
                تاريخ الحركه من {startDate} الي {endDate}
              </th>
            </tr>
            {/* <tr className="headtitle">
            <th colSpan={4}>12:17:26 &emsp; 2020/07/05</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr> */}
            <tr>
              <th colSpan={15} className="border-line"></th>
            </tr>
            <tr>
              <th>رقم مسلسل</th>
              {/* <th>كود الحركه</th> */}
              <th colSpan={2}>كود العميل</th>
              <th colSpan={2}>أسم العميل</th>
              <th colSpan={1}>مسلسل القرض</th>
              {/* <th>رقم الشيك</th> */}
              <th>قيمة</th>
              <th colSpan={2}>تاريخ القرض</th>
              <th colSpan={1}>حالة القرض</th>
              <th colSpan={1}>مستند الحركة</th>
              <th colSpan={2}>قيمة الغرامة</th>
              <th colSpan={2}>حالة الحركة</th>
            </tr>
            <tr>
              <th colSpan={15} className="border-line"></th>
            </tr>
          </thead>

          {days.map((day, idx) => (
            <DayComponent key={idx} day={day} />
          ))}

          <tr style={{ height: "1em" }}></tr>

          <tbody className="tbodyborder">
            <tr>
              <td></td>
              <td className="gray horizontal-line" colSpan={2}>
                إجمالي بالعمله
            </td>
              <td className="gray horizontal-line">جنيه مصري</td>
              <td></td>
              <td className="horizontal-line">إجمالي عدد الحركات</td>
              <td className="horizontal-line">{totalNumberOfTransactions}</td>
              <td></td>
              <td className="horizontal-line">إجمالي المبلغ</td>
              <td className="horizontal-line">{totalTransactionAmount}</td>
            </tr>

            <tr>
              <td colSpan={8}></td>
              <td className="horizontal-line">القيمة الملغاه</td>
          <td className="horizontal-line">{data.rbAmount}</td>
            </tr>
            <tr>
              <td colSpan={8}></td>
              <td className="horizontal-line">القيمة المسدده</td>
              <td className="horizontal-line">{data.netAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
  );
};

export default LoanPenaltiesList;

import React from 'react'
import './activeWalletIndividual.scss';
import Orientation from '../../Common/orientation';
import store from "../../../../Shared/redux/store";
import {
  numbersToArabic,
  timeToArabicDate,
  timeToDate,
} from "../../../../Shared/Services/utils";
interface ActiveWalletIndividualResponse {
  response: {
    branchName: string;
    totalLoanCount: number;
    totalPrincipal: number;
    customersCount: number;
    totalCreditInstallmentCount: number;
    totalCreditInstallmentAmount: number;
    totalLateInstallmentCount: number;
    totalLateInstallmentAmount: number;
    data:
    {
      phoneNumber: string;
      workArea: string;
      address: string;
      activity: string;
      creditAmount: number;
      creditCount: number;
      firstLateDate: string;
      latestPaymentDate: string;
      lateAmount: number;
      lateCount: number;
      principal: number;
      loanDate: string;
      customerName: string;
      customerCode: number;
    }[];
  }[];
}
interface Props {
  date: string;
  data: ActiveWalletIndividualResponse;
}
const ActiveWalletIndividual = (props: Props) => {
  const { data } = props;
  return (
    <>
      <Orientation size="landscape" />
      <div className={"activeWalletIndividual"}>
        <div className="header-wrapper">
          <span className="logo-print" role="img" />
          <p className="m-0">
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </p>
        </div>
        <div className="header-wrapper mb-0">
          <p style={{ marginRight: "10px" }}>
            شركة تساهيل للتمويل متناهي الصغر
          </p>
          <h3>المحفظة النشطه للمندوبين - فردى</h3>
          <div className="col-nowrap">
            <p>{store.getState().auth.name}</p>
            <p>{new Date().toLocaleString('en-GB', { hour12: false })}</p>
          </div>
        </div>
        {data?.response?.map((branch, index) => {
          return (
            <React.Fragment key={index}>
              <div className="report-header">
                <div className="row-nowrap mt-1"><p>الفرع:</p><p className="box">{'--'}</p></div>
                <div className="row-nowrap"><p>المندوب:</p> <p className="box small-box"></p><p className="box">{'--'}</p></div>
                <div className="row-nowrap"><p>منطقة العمل:</p><p className="box">{'--'}</p></div>
              </div>
              <table className="report-container">
                <thead>
                  <tr>
                    <th colSpan={6}></th>
                    <th colSpan={3}>الرصيد</th>
                    <th colSpan={2}></th>
                    <th colSpan={5}>متأخرات</th>
                    <th colSpan={6}>بيانات رئيسة المجموعه</th>
                  </tr>
                  <tr>
                    <th colSpan={4}>المجموعه</th>
                    <th colSpan={2}> ت التمويل</th>
                    <th colSpan={2}>قيمة التمويل</th>
                    <th>عدد</th>
                    <th>مبلغ</th>
                    <th colSpan={2}> ت أخر سداد</th>
                    <th>عدد</th>
                    <th colSpan={2}>مبلغ</th>
                    <th colSpan={2}>بداية تاخير</th>
                    <th>نشاط ر. مجموعه</th>
                    <th colSpan={3}>عنوان ر. مجموعه</th>
                    <th>منطقة العمل</th>
                    <th>التليفون</th>
                  </tr>
                </thead>
                {branch.data?.map((row, i) => {
                  return (
                    <>
                      <tbody key={i}>
                        <td colSpan={4}>{row.customerName}</td>
                        <td colSpan={2}>{row.loanDate}</td>
                        <td>{row.principal}</td>
                        <td>{row.creditCount}</td>
                        <td>{row.creditAmount}</td>
                        <td>{row.lateCount}</td>
                        <td>{row.lateAmount}</td>
                        <td colSpan={2}>{row.latestPaymentDate}</td>
                        <td>{row.firstLateDate}</td>
                        <td>{row.activity}</td>
                        <td colSpan={3}>{row.address}</td>
                        <td>{row.workArea}</td>
                        <td>{row.phoneNumber}</td>
                      </tbody>
                      <tr><p>تعديل:</p></tr>
                    </>
                  )
                })}
              </table>
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

export default ActiveWalletIndividual

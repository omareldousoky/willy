import React from "react";
import {
    OfficerPercentPaymentResponse,
    OfficerPercentPaymentRow,
    OfficerPercentPaymentTotalRow,
} from "../../../Services/interfaces";
import OfficersPercentPaymentHeader from "./officerPercentPaymentHeader";
import "./officersPercentPayment.scss";
import OfficersPercentPaymentFooter from "./officersPercentPaymentFooter";

interface OfficerPercentPaymentProps {
    fromDate: string;
    toDate: string;
    data: OfficerPercentPaymentResponse;
}

const getPrevious3Months = (fromDate: string): Record<string, string> => {
    const date = new Date(fromDate);
    const m = date.getMonth();
    const y = date.getFullYear();
    const prevMonth = (m: number, y: number): string => {
        if (m < 0) return "";
        const isJan = !m;
        return isJan ? `12-${y - 1}` : `${m < 10 ? `0${m}-${y}` : `${m}-${y}`}`;
    };
    return {
        firstMonth: prevMonth(m < 0 ? m + 12 : m, m < 0 ? y - 1 : y),
        secondMonth: prevMonth(
            m - 1 < 0 ? m - 1 + 12 : m - 1,
            m - 1 < 0 ? y - 1 : y
        ),
        thirdMonth: prevMonth(
            m - 2 < 0 ? m - 2 + 12 : m - 2,
            m - 2 < 0 ? y - 1 : y
        ),
    };
};

enum OfficersType {
    Active = "مندوبين بالخدمه",
    Inactive = "مشرفين او مندوبين مستقيلين",
}

export const formatPercent = (value?: number): string => {
    if (!value) return "";
    const foramtted = value.toString();
    const splitOnPoint = foramtted.split(".");
    return splitOnPoint[1]
        ? `%${splitOnPoint[0]}.${splitOnPoint[1].slice(0, 2)}`
        : `%${foramtted}`;
};
const OfficerPercentPayment = (props: OfficerPercentPaymentProps) => {
    const { fromDate, toDate, data } = props;
    const previous3Months = getPrevious3Months(fromDate);

    const populateTotalRow = (
        data?: OfficerPercentPaymentTotalRow,
        totalName?: string
    ): JSX.Element => (
        <tr className="border-top border-bottom border-dark">
            <td colSpan={5}>{totalName ? `إجمالى ${totalName}` : ""}</td>
            <td>{data?.issuedCount || "0"}</td>
            <td>{data?.issuedAmount || "0.00"}</td>
            <td>{data?.firstMonth || "0.00"}</td>
            <td>{data?.secondMonth || "0.00"}</td>
            <td>{data?.thirdMonth || "0.00"}</td>
            <td colSpan={2}>{data?.expectedPayments || "0"}</td>
            <td colSpan={2}>{data?.paid || "0.00"}</td>
            <td>{formatPercent(data?.paidPercent) || "%00.00"}</td>
            <td>{data?.walletCount || "0"}</td>
            <td>{data?.walletAmount || "0.00"}</td>
            <td colSpan={2}>{data?.collections || "0.00"}</td>
        </tr>
    );
    const populateTableBody = (
        officers: Array<OfficerPercentPaymentRow>,
        officersTypeLabel: string,
        officersTotal?: OfficerPercentPaymentTotalRow
    ): JSX.Element => (
        <>
            {officers.map((officer) => (
                <tr key={officer.officerName}>
                    <td colSpan={4} className="text-right">
                        {officer.officerName}
                    </td>
                    <td>{officer.hiringDate}</td>
                    <td>{officer.issuedCount || "0"}</td>
                    <td>{officer.issuedAmount || "0.00"}</td>
                    <td>{officer.firstMonth || "0.00"}</td>
                    <td>{officer.secondMonth || "0.00"}</td>
                    <td>{officer.thirdMonth || "0.00"}</td>
                    <td colSpan={2}>{officer.expectedPayments || "0"}</td>
                    <td colSpan={2}>{officer.paid || "0.00"}</td>
                    <td>{formatPercent(officer.paidPercent) || "%00.00"}</td>
                    <td>{officer.walletCount || "0"}</td>
                    <td>{officer.walletAmount || "0.00"}</td>
                    <td colSpan={2}>{officer.collections || "0.00"}</td>
                </tr>
            ))}
            {populateTotalRow(officersTotal, officersTypeLabel)}
        </>
    );
    return (
        <div className="officers-payment" lang="ar">
            <OfficersPercentPaymentHeader toDate={toDate} fromDate={fromDate} />
            {data.response
                ? data.response.map((branchData, i) => (
                      <>
                          <p
                              className="branch-name"
                              key={branchData.branchName}
                          >
                              {branchData.branchName}
                          </p>
                          <table className="body" key={branchData.branchName}>
                              <thead>
                                  <tr>
                                      <th colSpan={4}></th>
                                      <th></th>
                                      <th colSpan={2}>الاصدار</th>
                                      <th colSpan={3}>الاصدار شهور سابقه</th>
                                      <th colSpan={2} rowSpan={2}>
                                          سدادات متوقعه
                                          <br /> فى هذه الفتره
                                      </th>
                                      <th colSpan={2} rowSpan={2}>
                                          مسدد حتى نهاية
                                          <br /> الفتره
                                      </th>
                                      <th></th>
                                      <th colSpan={2}>المحفظه الان</th>
                                      <th colSpan={2}></th>
                                  </tr>
                                  <tr>
                                      <th colSpan={4}>المندوب</th>
                                      <th>ت التعيين</th>
                                      <th>عدد</th>
                                      <th>مبلغ</th>
                                      <th>{previous3Months.firstMonth}</th>
                                      <th>{previous3Months.secondMonth}</th>
                                      <th>{previous3Months.thirdMonth}</th>
                                      <th>نسبة السداد</th>
                                      <th>عدد</th>
                                      <th>مبلغ</th>
                                      <th colSpan={2}>متحصلات الفتره</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {branchData.activeOfficers && (
                                      <>
                                          <tr>
                                              <td className="bg-grey">
                                                  {OfficersType.Active}
                                              </td>
                                          </tr>
                                          {populateTableBody(
                                              branchData.activeOfficers,
                                              OfficersType.Active,
                                              branchData.activeOfficersTotal
                                          )}
                                      </>
                                  )}
                                  {branchData.inactiveOfficers && (
                                      <>
                                          <tr>
                                              <td className="bg-grey">
                                                  {OfficersType.Inactive}
                                              </td>
                                          </tr>
                                          {populateTableBody(
                                              branchData.inactiveOfficers,
                                              OfficersType.Inactive,
                                              branchData.inactiveOfficersTotal
                                          )}
                                      </>
                                  )}
                                  {populateTotalRow(
                                      branchData.total,
                                      branchData.branchName
                                  )}
                                  {data.response.length - 1 == i &&
                                      populateTotalRow(data.total)}
                              </tbody>
                          </table>
                      </>
                  ))
                : ""}
            <OfficersPercentPaymentFooter />
        </div>
    );
};

export default OfficerPercentPayment;

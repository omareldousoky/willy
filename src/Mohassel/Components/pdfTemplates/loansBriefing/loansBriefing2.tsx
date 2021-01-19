import React from "react";
import store from "../../../../Shared/redux/store";
import {
    getCurrentTime,
    timeToArabicDate,
} from "../../../../Shared/Services/utils";
import { LoansBriefingReportResponse } from "../../../Services/interfaces";
import "./loansBriefing.scss";

interface LoansBriefing2Props {
    fromDate: string;
    toDate: string;
    data: LoansBriefingReportResponse;
}

const LoansBriefing2 = (props: LoansBriefing2Props) => {
    const { fromDate, toDate, data } = props;
    return (
        <div className="loans-briefing-2" lang="ar">
            <div
                style={{
                    margin: "10px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "98%",
                    backgroundColor: "white",
                }}
            >
                <span className="logo-print" role="img" />
                <p style={{ margin: "0", fontSize: "10px" }}>
                    ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
                </p>
            </div>
            <div
                style={{
                    margin: "10px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "98%",
                    backgroundColor: "white",
                }}
            >
                <p style={{ marginRight: "10px", fontSize: "12px" }}>
                    شركة تساهيل للتمويل متناهي الصغر
                </p>
                <p style={{ fontSize: "11px" }}>{store.getState().auth.name}</p>
                <p style={{ fontSize: "11px" }}>{getCurrentTime()}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                }}
            >
                <p style={{ margin: "auto", fontSize: "16px" }}>
                    القروض والحالات للفترة من : &nbsp;
                    {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى
                    : &nbsp;
                    {timeToArabicDate(new Date(toDate).valueOf(), false)}
                </p>
                <hr className="horizontal-line"></hr>
            </div>
            <table className="body">
                <thead>
                    <tr>
                        <th rowSpan={2}>م</th>
                        <th colSpan={2} className="bg-white"></th>
                        <th colSpan={2}>تمويلات فردي</th>
                        <th colSpan={2}>تمويلات جماعي</th>
                        <th colSpan={2}>اجمالي تمويلات</th>
                        <th className="empty"></th>
                        <th colSpan={2}>طلبات فردي</th>
                        <th colSpan={2}>طلبات جماعي</th>
                        <th colSpan={2}>طلبات اجمالي</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>اسم الفرع</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th className="empty"></th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                    </tr>
                    <tr className="empty"></tr>
                </thead>
                <tbody>
                    {data.branchBriefing ? (
                        data.branchBriefing.map((brief) => {
                            return (
                                <tr key={brief.branchName}>
                                    <td></td>
                                    <td colSpan={2}>{brief.branchName}</td>
                                    <td>{brief.individualLoansCount || "0"}</td>
                                    <td className="bg-grey">
                                        {brief.individualLoansCredit || "0.0"}
                                    </td>
                                    <td>{brief.groupLoansCount || "0"}</td>
                                    <td className="bg-grey">
                                        {brief.groupLoansCredit || "0.0"}
                                    </td>
                                    <td>{brief.loansTotal || "0"}</td>
                                    <td className="bg-grey">
                                        {brief.loansTotalAmount || "0.0"}
                                    </td>
                                    <td className="empty"></td>
                                    <td>
                                        {brief.individualRequestsCount || "0"}
                                    </td>
                                    <td className="bg-grey">
                                        {brief.individualRequestsCredit ||
                                            "0.0"}
                                    </td>
                                    <td>{brief.groupRequestsCount || "0"}</td>
                                    <td className="bg-grey">
                                        {brief.groupRequestsCredit || "0.0"}
                                    </td>
                                    <td>{brief.requestsTotalCount || "0"}</td>
                                    <td className="bg-grey">
                                        {brief.requestsTotalAmount || "0.0"}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr></tr>
                    )}
                    <tr>
                        <td colSpan={3} rowSpan={2}>
                            إجمالى
                        </td>
                        <td rowSpan={2}>{data.individualLoansCount || "0"}</td>
                        <td rowSpan={2} className="bg-grey">
                            {data.individualLoansCredit || "0.0"}
                        </td>
                        <td rowSpan={2}>{data.groupLoansCount || "0"}</td>
                        <td rowSpan={2} className="bg-grey">
                            {data.groupLoansCredit || "0.0"}
                        </td>
                        <td rowSpan={2}>{data.loansTotal || "0"}</td>
                        <td rowSpan={2} className="bg-grey">
                            {data.loansTotalAmount || "0.0"}
                        </td>
                        <td rowSpan={2} className="empty"></td>
                        <td rowSpan={2}>
                            {data.individualRequestsCount || "0"}
                        </td>
                        <td rowSpan={2} className="bg-grey">
                            {data.individualRequestsCredit || "0.0"}
                        </td>
                        <td rowSpan={2}>{data.groupRequestsCount || "0"}</td>
                        <td rowSpan={2} className="bg-grey">
                            {data.groupRequestsCredit || "0"}
                        </td>
                        <td rowSpan={2}>{data.requestsTotalCount || "0"}</td>
                        <td rowSpan={2} className="bg-grey">
                            {data.requestsTotalAmount || "0.0"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default LoansBriefing2;

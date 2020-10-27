import React from 'react';
import store from '../../../../Shared/redux/store';
import './branchesLoanList.scss';
import { timeToArabicDate } from "../../../../Shared/Services/utils";
import { theme } from '../../../../theme';

const BranchesLoanList = (props) => {
    return (
        <div className="branches-loan-list" lang="ar">
            <table>
                <thead className="report-header">
                    <tr>
                        <th>
                            <div>
                                <table>
                                    <thead style={{ fontSize: "12px" }}>
                                        <tr style={{ height: "10px" }}></tr>
                                        <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                                        <tr style={{ height: "10px" }}></tr>
                                    </thead>
                                    <tbody>
                                        <tr className="headtitle">
                                            <th>شركة تساهيل للتمويل متناهي الصغر</th>
                                            <td>{store.getState().auth.name}</td>
                                            <th>القروض والحالات للفتره من : {timeToArabicDate(props.fromDate, false)} الي : {timeToArabicDate(props.toDate, false)}</th>
                                            <th>1/1</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </th>
                    </tr>
                </thead>
            </table>

            <table className="body">
                <thead>
                    <tr>
                        <th colSpan={2}>مجموعه</th>
                    </tr>
                    <tr>
                        <th rowSpan={3}>م</th>
                        <th rowSpan={3}>اسم الفرع</th>
                        <th colSpan={6}>الفروع</th>
                        <th colSpan={6}>**الحالات</th>
                        <th colSpan={2} rowSpan={2}>إجمالي عام</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>غير مصدر</th>
                        <th colSpan={2}>مصدر</th>
                        <th colSpan={2}>إجمالي</th>
                        <th colSpan={2}>منتظر قرار</th>
                        <th colSpan={2}>موافق عليه</th>
                        <th colSpan={2}>إجمالي</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.result[0] && props.data.result[0].rows.map((row, index) => {
                        if (row.branchName !== "Total") {
                            return (
                                <tr key={index}>
                                    <td></td>
                                    <td>{row.branchName}</td>
                                    <td>{row.createdCount}</td>
                                    <td>{row.createdSum}</td>
                                    <td>{row.issuedCount}</td>
                                    <td>{row.issuedSum}</td>
                                    <th>{row.totalCreatedIssuedCount}</th>
                                    <th>{row.totalCreatedIssuedSum}</th>
                                    <td>{row.reviewedCount}</td>
                                    <td>{row.reviewedSum}</td>
                                    <td>{row.approvedCount}</td>
                                    <td>{row.approvedSum}</td>
                                    <th>{row.totalReviewedApprovedCount}</th>
                                    <th>{row.totalReviewedApprovedSum}</th>
                                    <th>{row.totalAllCount}</th>
                                    <th>{row.totalAllSum}</th>
                                </tr>
                            )
                        }
                    })}
                    {props.data.result[0] && props.data.result[0].rows.map((row, index) => {
                        if (row.branchName === "Total") {
                            return (
                                <tr key={index}>
                                    <td colSpan={2}>إجمالي المجموعه</td>
                                    <td>{row.createdCount}</td>
                                    <td>{row.createdSum}</td>
                                    <td>{row.issuedCount}</td>
                                    <td>{row.issuedSum}</td>
                                    <th>{row.totalCreatedIssuedCount}</th>
                                    <th>{row.totalCreatedIssuedSum}</th>
                                    <td>{row.reviewedCount}</td>
                                    <td>{row.reviewedSum}</td>
                                    <td>{row.approvedCount}</td>
                                    <td>{row.approvedSum}</td>
                                    <th>{row.totalReviewedApprovedCount}</th>
                                    <th>{row.totalReviewedApprovedSum}</th>
                                    <th>{row.totalAllCount}</th>
                                    <th>{row.totalAllSum}</th>
                                </tr>
                            )
                        }
                    })}
                </tbody>

                <thead>
                    <tr>
                        <th colSpan={2}>فردي</th>
                    </tr>
                    <tr>
                        <th rowSpan={3}>م</th>
                        <th rowSpan={3}>اسم الفرع</th>
                        <th colSpan={6}>الفروع</th>
                        <th colSpan={6}>**الحالات</th>
                        <th colSpan={2} rowSpan={2}>إجمالي عام</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>غير مصدر</th>
                        <th colSpan={2}>مصدر</th>
                        <th colSpan={2}>إجمالي</th>
                        <th colSpan={2}>منتظر قرار</th>
                        <th colSpan={2}>موافق عليه</th>
                        <th colSpan={2}>إجمالي</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.result[1] && props.data.result[1].rows.map((row, index) => {
                        if (row.branchName !== "Total") {
                            return (
                                <tr key={index}>
                                    <td></td>
                                    <td>{row.branchName}</td>
                                    <td>{row.createdCount}</td>
                                    <td>{row.createdSum}</td>
                                    <td>{row.issuedCount}</td>
                                    <td>{row.issuedSum}</td>
                                    <th>{row.totalCreatedIssuedCount}</th>
                                    <th>{row.totalCreatedIssuedSum}</th>
                                    <td>{row.reviewedCount}</td>
                                    <td>{row.reviewedSum}</td>
                                    <td>{row.approvedCount}</td>
                                    <td>{row.approvedSum}</td>
                                    <th>{row.totalReviewedApprovedCount}</th>
                                    <th>{row.totalReviewedApprovedSum}</th>
                                    <th>{row.totalAllCount}</th>
                                    <th>{row.totalAllSum}</th>
                                </tr>
                            )
                        }
                    })}
                    {props.data.result[1] && props.data.result[1].rows.map((row, index) => {
                        if (row.branchName === "Total") {
                            return (
                                <tr key={index}>
                                    <td colSpan={2}>إجمالي فردي</td>
                                    <td>{row.createdCount}</td>
                                    <td>{row.createdSum}</td>
                                    <td>{row.issuedCount}</td>
                                    <td>{row.issuedSum}</td>
                                    <th>{row.totalCreatedIssuedCount}</th>
                                    <th>{row.totalCreatedIssuedSum}</th>
                                    <td>{row.reviewedCount}</td>
                                    <td>{row.reviewedSum}</td>
                                    <td>{row.approvedCount}</td>
                                    <td>{row.approvedSum}</td>
                                    <th>{row.totalReviewedApprovedCount}</th>
                                    <th>{row.totalReviewedApprovedSum}</th>
                                    <th>{row.totalAllCount}</th>
                                    <th>{row.totalAllSum}</th>
                                </tr>
                            )
                        }
                    })}

                </tbody>

                <tbody>
                    {props.data.result[2] && props.data.result[2].rows.map((row, index) => {
                        return (
                            <tr key={index}>
                                <th colSpan={2}>إﺟﻣﺎﻟﻰ ﺷرﻛﺔ ﺗﺳﺎھﯾل ﻟﻠﺗﻣوﯾل ﻣﺗﻧﺎھﻰ اﻟﺻﻐر</th>
                                <td>{row.createdCount}</td>
                                <td>{row.createdSum}</td>
                                <td>{row.issuedCount}</td>
                                <td>{row.issuedSum}</td>
                                <th>{row.totalCreatedIssuedCount}</th>
                                <th>{row.totalCreatedIssuedSum}</th>
                                <td>{row.reviewedCount}</td>
                                <td>{row.reviewedSum}</td>
                                <td>{row.approvedCount}</td>
                                <td>{row.approvedSum}</td>
                                <th>{row.totalReviewedApprovedCount}</th>
                                <th>{row.totalReviewedApprovedSum}</th>
                                <th>{row.totalAllCount}</th>
                                <th>{row.totalAllSum}</th>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default BranchesLoanList;
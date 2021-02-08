import React from "react";
import { timeToArabicDateNow } from "../../../../Shared/Services/utils";
import './paidArrears.scss'

export const PaidArrears = (props) => {
    return (
        <div className="arrears-payed" lang="ar">
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><th colSpan={6}><div className={"logo-print"}></div></th><th colSpan={6} >ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
                <tbody className="report-header">
                    <tr className="headtitle">
                        <th>شركة تساهيل للتمويل متناهي الصغر</th>
                        <th>{timeToArabicDateNow(true)}</th>
                    </tr>
                    <tr className="headtitle">
                        <th rowSpan={2}>حركات سداد على المتأخرات</th>
                        <th rowSpan={2}>من 01-12-2020 الى 31-12-2020 </th>
                    </tr>
                </tbody>
                <tr>
                    <th colSpan={100} className="horizontal-line"></th>
                </tr>
             </table>
                <table className="report-container">
                <thead>
                    <th>غرامه مسدده</th>
                    <th>غرامات مستحقه على القسط</th>
                    <th>ايام التأخير للقسط</th>
                    <th>قيمة الحركه</th>
                    <th>ت حركة السداد</th>
                    <th>قيمة القسط</th>
                    <th>رقم القسط</th>
                    <th>اسم العميل</th>
                    <th>كود العميل</th>
                    <th>كود الحركه</th>
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
    )
}
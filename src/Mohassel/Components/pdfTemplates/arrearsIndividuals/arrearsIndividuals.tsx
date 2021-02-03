import React from 'react'
import { timeToArabicDateNow } from '../../../../Shared/Services/utils'
import './arrears-individuals.scss'
export const ArrearsIndividuals = () => {
    return (
        <div className={'arrears-individuals'}>
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
                        <th rowSpan={2}>متأخرات الفردي</th>
                        <th rowSpan={2}>من 01-12-2020 الى 31-12-2020 </th>
                    </tr>
                </tbody>
                <tr>
                    <th colSpan={100} className="horizontal-line"></th>
                </tr>
             </table>
             <table className="report-container">
                 
             </table>
        </div>
    )
}

import React from 'react'
import { timeToArabicDateNow } from '../../../../Shared/Services/utils'
import './arrearsIndividuals.scss'
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
             <table className="report-container"   cellPadding="2" cellSpacing="2">
                 
                 <thead>
                     <th colSpan={2}>تاريخ اخر حركة سداد</th>
                     <th></th>
                     <th colSpan={2}></th>
                     <th></th>
                     <th colSpan={2}>الرصيد</th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th colSpan={3}>المتأخرات</th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th colSpan={6}>بيانات العميل</th>
                 </thead>
                 <thead>
                        <th colSpan={2}>القسط مسدد بالكامل</th>
                         <th >مرات الترحيل</th>
                         <th colSpan={2}>مبلغ اخر سداد</th>
                         <th>آخر سداد</th>
                         <th>عدد</th>
                         <th>مبلغ</th>
                         <th >قيمة القسط</th>
                         <th >ايام التأخير</th>
                         <th>أخر سداد</th>
                         <th>اكبر تأخير</th>
                         <th>بداية التأخير</th>
                         <th>عدد</th>
                         <th>مبلغ</th>
                         <th >عدد أقساط</th>
                         <th>قيمة التمويل</th>
                         <th>ت التمويل</th>
                         <th>المندوب</th>
                         <th >اسم العميل</th>
                         <th>كود العميل</th>
                         <th>كود</th>
                         <th>فرع</th>
                         <th>branch code</th>
                 </thead>
                 <tbody>
                     {[1,2,3,4,5,6,7,8,9,10].map((i)=>{
                     return(
                      <tr key={i}>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td colSpan={2}>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     <td>{i*100}</td>
                     </tr>
                     )})
                     }
                        {/* total Data */}
                     <tr className="babyBlue">
                     <td colSpan={2}></td>
                     <td></td>
                     <td colSpan={2}></td>
                     <td></td>
                     <td>12345,444</td>
                     <td>1234</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td>12345,444</td>
                     <td>1234</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td>4</td>
                     <td></td>
                     <td></td>
                     </tr>
                 </tbody>
             </table>
        </div>
    )
}

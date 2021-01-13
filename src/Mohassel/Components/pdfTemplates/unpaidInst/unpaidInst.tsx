import React from "react";
import "./unpaidInst.scss";
import local from "../../../../Shared/Assets/ar.json";
import { timeToArabicDate } from "../../../../Shared/Services/utils"

const UnpaidInst = (props) => {
  return (
    <div className="unpaid-inst">
      <table className="header-table">
        <thead>
          <tr>
            <th className="grey-background">شركة تساهيل للتمويل متناهى الصغر</th>
            <th></th>
            <th rowSpan={2}><div className="logo-print" ></div></th>
          </tr>
          <tr>
            <th className="frame" colSpan={1}>اسوان - ادفو</th>
          </tr>
          <tr>
            <th>tmohamed0</th>
            <th style={{ fontSize: 18 }}>قائمة الاقساط الغير مسددة بمناطق العمل</th>
          </tr>
          <tr>
            <th></th>
            <th style={{ fontSize: 18 }}>٢٠٢١/٠١/١٠ الى ٢٠٢١/٠١/٠١ من</th>
          </tr>
        </thead>
      </table>
      <div><span>الفرع : </span><span className="grey-background frame" style={{ padding: "5px 5px 5px 50px" }}> اسوان - ادفو </span></div>
      <div style={{ marginTop: 20 }}><span>منطقة العمل : </span><span className="grey-background frame" style={{ padding: "5px 5px 5px 50px" }}> السباعية شرق والشروانة - المحاميد </span></div>
      <table className="repeated-table">
        <thead>
          <tr>
            <th>اسم العميل</th>
            <th>رقم القسط</th>
            <th>ت الاستحقاق</th>
            <th>حالة القسط</th>
            <th>قيمة القسط</th>
            <th>المستحق</th>
            <th colSpan={2}>ت المحمول</th>
            <th>اسم المندوب</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>هيثم محمد ضيف سيد</td>
            <td>015/001/0004979/070</td>
            <td>٠٣/٠١/٢٠٢١</td>
            <td>غير مسدد</td>
            <td>٩١٨٫٠٠</td>
            <td>00.918</td>
            <td>٠١١٤٧٩٠٦٥٩٧</td>
            <td>ادفو العقيبه الجزيره بجوار الترعه</td>
            <td>علياء عبده احمد حسين</td>

          </tr>
        </tbody>
      </table>
      <div className="horizontal-line"></div>
      <div>
        <span>إجمالى: منطقة العمل : </span>
        <span className="grey-background frame" style={{ padding: "5px 5px 5px 50px" }}> السباعية شرق والشروانة - المحاميد </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 3 </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 2754.00 </span>
      </div>
      <div className="horizontal-line"></div>
      <div className="horizontal-line"></div>
      <div>
        <span> إجمالى : الفرع: </span>
        <span className="grey-background frame" style={{ padding: "5px 5px 5px 80px" }}> اسوان - ادفو </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 3 </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 2754.00 </span>
      </div>
      <div className="horizontal-line"></div>
      <div className="horizontal-line"></div>
      <div>
        <span>الإجمالى العام:  </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 3 </span>
        <span className="frame" style={{ padding: "5px 5px 5px 50px", textAlign: 'center' }}> 2754.00 </span>
      </div>
      <div className="horizontal-line"></div>
    </div>
  )
}

export default UnpaidInst;
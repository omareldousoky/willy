import React from 'react';
import './customerCard.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';
import store from '../../../redux/store';

const CustomerCardPDF = (props) => {
    function getGov() {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer.governorate;
        else return props.data.group.individualsInGroup[0].customer.governorate;
    }
    function getCode() {
        if (props.data.product.beneficiaryType === "individual")
            props.data.customer.key;
        else return props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer.key;
    }
    return (
        <div className="customer-card-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <td className="title bold titleborder titlebackground">
                            شركة تساهيل للتمويل متناهي الصغر</td>
                        <td style={{ width: "30%" }}></td>
                        <td className="title bold">{props.branchDetails.name} - {getGov()}</td>
                    </tr>
                    <tr>
                        <td className="bold">ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (٢) لسنة ٢٠١٥</td>
                        <td></td>
                        <td style={{ fontSize: "8px" }}>{store.getState().auth.name}</td>
                    </tr>
                    <tr>
                        <td>{timeToArabicDate(0, true)}</td>
                        <td className="title2 bold"><u>كارت العميل</u></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div style={{ marginBottom: "2px" }} className="bold title"> عميلنا العزيز، برجاء الالتزام بسداد الاقساط حسب
            الجدول
            المرفق
	</div>

            <table className="titleborder">
                <tbody>
                    <tr>
                        <td> المجموعه
					<div className="frame">{numbersToArabic(getCode())}</div>
                            <div className="frame">{props.data.customer.customerName}</div>
                        </td>
                        <td> التاريخ
					<div className="frame">{timeToArabicDate(0, false)}</div>
                        </td>
                        <td> المندوب
					<div className="frame">{props.loanOfficer}</div>
                        </td>
                    </tr>
                </tbody>
            </table>


            <table>
                <tbody>
                    <tr>
                        <td>قيمة التمويل <div className="frame">{numbersToArabic(props.data.principal)}</div>
                        </td>
                        <td>فترة السداد <div className="frame">كل {numbersToArabic(props.data.product.periodLength)} {props.data.product.periodType === 'days' ? local.day : local.month}</div>
                        </td>
                        <td>عدد الاقساط <div className="frame">{numbersToArabic(props.data.installmentsObject.installments.length)}</div>
                        </td>
                        <td>فترة السماح
					<div className="frame">{numbersToArabic(props.data.product.gracePeriod)}</div>
                            <div className="frame">{props.data.customer.businessActivity}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="tablestyle" style={{ width: "50%", border: "1px black solid" }}>
                <tbody>
                    <tr>
                        <th>القسط</th>
                        <th>تاريخ الآستحقاق</th>
                        <th>القيمه</th>
                        <th style={{ width: "40%" }}>ملاحظات</th>
                    </tr>
                    {props.data.installmentsObject.installments.map(installment => {
                        return (<tr key={installment.id}>
                            <td>{numbersToArabic(installment.id)}</td>
                            <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                            <td>{numbersToArabic(installment.installmentResponse)}</td>
                            <td></td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <table className="tablestyle" style={{ border: "1px black solid" }}>
                <tbody>
                    {props.data.product.beneficiaryType === "individual" ?
                        <tr>
                            <th>كود الضامن</th>
                            <th>اسم الضامن</th>
                            <th>المنطقه</th>
                            <th>العنوان</th>
                            <th>تليفون</th>
                        </tr>
                        :
                        <tr>
                            <th>كود العضو</th>
                            <th>اسم العضو</th>
                            <th>المنطقه</th>
                            <th>العنوان</th>
                            <th>تليفون</th>
                        </tr>
                    }
                    {props.data.product.beneficiaryType === "individual" ?
                        props.data.guarantors.map((guarantor, index) => {
                            return (
                                <tr key={index}>
                                    <td>{numbersToArabic(guarantor.key)}</td>
                                    <td>{guarantor.customerName}</td>
                                    <td>{guarantor.district}</td>
                                    <td>{guarantor.customerHomeAddress}</td>
                                    <td>{numbersToArabic(guarantor.mobilePhoneNumber)}</td>
                                </tr>
                            )
                        })
                        :
                        props.data.group.individualsInGroup.map((individualInGroup, index) => {
                            return (
                                <tr key={index}>
                                    <td>{numbersToArabic(individualInGroup.customer.key)}</td>
                                    <td>{individualInGroup.customer.customerName}</td>
                                    <td>{individualInGroup.customer.district}</td>
                                    <td>{individualInGroup.customer.customerHomeAddress}</td>
                                    <td>{numbersToArabic(individualInGroup.customer.mobilePhoneNumber)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div style={{ textAlign: 'right' }}>
                <div className="bold frame title2">
                    <u>تعليمات خاصه بالسداد</u>
                </div>
            </div>
            <ol>
                <li>يتم دفع الاقساط في مواعيدها من خلال خزينة الفرع بايصال رسمي مختوم او عبر وسائل الدفع الالكتروني المعتمده
                من
                هيئة
			الرقابه</li>
                <li>ممنوع منعا باتا دفع اي مبالغ نقديه للمندوب تحت اي مسمي</li>
                <li>الاداره غير مسؤله عن اي مبالغ يتم دفعها لاي شخص بدون ايصال رسمي مختوم من خزينة الفرع</li>
                <li>تلتزم الاعضاء بسداد غرامة تآخير قدرها ٥٪ من قيمة القسط في اليوم التالي لتاريخ الاستحقاق للقسط، وابتداء
                من
                اليوم
			الذي يليه كالتالي:-</li>
                <ul>يتم تحصيل ٢ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط أقل من ١٥٠٠ ج</ul>
                <ul>يتم تحصيل ٣ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط تتراوح من ١٥٠٠ ج حتي أقل من ٢٠٠٠ ج</ul>
                <ul>يتم تحصيل ٤ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط تتراوح من ٢٠٠٠ ج حتي أقل من ٢٥٠٠ ج</ul>
                <ul>يتم تحصيل ٥ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط اكبر من او يساوي ٢٥٠٠ ج</ul>
                <li>في حالة طلب سداد المديونيه المستحقه يتم خصم تكلفة التمويل للشهر الذي يتم فيه السداد مع اضافة عموله سداد
                معجل
                ٥٪
                من باقي المبلغ المستحق (اصل) المراد تعجيل الوفاه به</li>
                <li>يحق للشركه مطالبه قيمة القرض وكافة المصروفات وتكاليف تمويله في حالة استخدام مبلغ القرض في غرض غير
                استخدامه
                داخل
			النشاط او اغلاق النشاط</li>
            </ol>
        </div >
    )
}

export default CustomerCardPDF;
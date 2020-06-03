import React from 'react';
import './customerCard.scss';
import * as local from '../../../../Shared/Assets/ar.json';

const CustomerCardPDF = (props) => {
    console.log('props', props)
    return (
        <div className="customer-card-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <td className="title bold titleborder titlebackground">
                            شركة تساهيل للتمويل متناهي الصغر</td>
                        <td style={{ width: "30%" }}></td>
                        <td className="title bold">الجيزه - امبابه ثان</td>
                    </tr>
                    <tr>
                        <td className="bold">ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (٢) لسنة ٢٠١٥</td>
                        <td></td>
                        <td style={{ fontSize: "8px" }}>١/١ &emsp; جرجس فوزي عطيه - اخصائي نظم معلومات</td>
                    </tr>
                    <tr>
                        <td>١٦:٢٦:٠١ &emsp; ٢٠٢٠/٠٥/٠٥</td>
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
					<div className="frame">٠٠٦/٠٠١١٩٩٤</div>
                            <div className="frame">{props.data.customer.customerName}</div>
                        </td>
                        <td> التاريخ
					<div className="frame">٢٠٢٠/٠٥/٠٥</div>
                        </td>
                        <td> المندوب
					<div className="frame">ايمان مصطفي عبده ابراهيم</div>
                        </td>
                    </tr>
                </tbody>
            </table>


            <table>
                <tbody>
                    <tr>
                        <td>قيمة التمويل <div className="frame">{props.data.principal}</div>
                        </td>
                        <td>فترة السداد <div className="frame">كل {props.data.product.periodLength} {local[props.data.product.periodType]}</div>
                        </td>
                        <td>عدد الاقساط <div className="frame">{props.data.installmentsObject.installments.length}</div>
                        </td>
                        <td>فترة السماح
					<div className="frame">{props.data.product.gracePeriod}</div>
                            <div className="frame">شراء بضاعه وخدمات</div>
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
                            <td>{installment.id}</td>
                            <td>{new Date(installment.dateOfPayment).toISOString().slice(0, 10)}</td>
                            <td>{installment.installmentResponse}</td>
                            <td></td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <table className="tablestyle" style={{ border: "1px black solid" }}>
                <tbody>
                    <tr>
                        <th>كود العضو</th>
                        <th>اسم العضو</th>
                        <th>المنطقه</th>
                        <th>العنوان</th>
                        <th>تليفون</th>
                    </tr>
                    <tr>
                        <td>٦/١١٩٩٥</td>
                        <td>مني نور الدين عباس مبروك</td>
                        <td>امبابه</td>
                        <td>٢٩ شارع حجاج عبد الرحيم من الطناني ع ناصية عطار د٢</td>
                        <td>٠١٢٠٧٢٣٨٢٢٤</td>
                    </tr>
                    <tr>
                        <td>٦/١١٩٩٥</td>
                        <td>مني نور الدين عباس مبروك</td>
                        <td>امبابه</td>
                        <td>٢٩ شارع حجاج عبد الرحيم من الطناني ع ناصية عطار د٢</td>
                        <td>٠١٢٠٧٢٣٨٢٢٤</td>
                    </tr>
                    <tr>
                        <td>٦/١١٩٩٥</td>
                        <td>مني نور الدين عباس مبروك</td>
                        <td>امبابه</td>
                        <td>٢٩ شارع حجاج عبد الرحيم من الطناني ع ناصية عطار د٢</td>
                        <td>٠١٢٠٧٢٣٨٢٢٤</td>
                    </tr>
                    <tr>
                        <td>٦/١١٩٩٥</td>
                        <td>مني نور الدين عباس مبروك</td>
                        <td>امبابه</td>
                        <td>٢٩ شارع حجاج عبد الرحيم من الطناني ع ناصية عطار د٢</td>
                        <td>٠١٢٠٧٢٣٨٢٢٤</td>
                    </tr>
                    <tr>
                        <td>٦/١١٩٩٥</td>
                        <td>مني نور الدين عباس مبروك</td>
                        <td>امبابه</td>
                        <td>٢٩ شارع حجاج عبد الرحيم من الطناني ع ناصية عطار د٢</td>
                        <td>٠١٢٠٧٢٣٨٢٢٤</td>
                    </tr>

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
import React from 'react';
import './earlyPayment.scss';
import * as local from '../../../../Shared/Assets/ar.json';

const EarlyPaymentPDF = (props) => {
    console.log('props', props)
    return (
        <div className="early-payment-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <th style={{ width: "35%" }} className="title bold border">
                            شركة تساهيل للتمويل متناهي الصغر</th>
                        <td></td>
                        <td className="title bold">الدقهليه - المنزله</td>
                    </tr>
                    <tr>
                        <td>15:17:26 &emsp; 2020/06/14</td>
                        <td className="title2 bold"><u>السداد المعجل</u></td>
                        <td>1/1</td>
                    </tr>
                </tbody>
            </table>
            <table className="border">
                <tbody>
                    <tr>
                        <td> العميل
					<div className="frame">076/0022648</div>
                            <div className="frame">السيد السيد العربي محمد عبد الصبيحي</div>
                        </td>
                        <td> التاريخ
					<div className="frame">2020/06/14</div>
                        </td>
                        <td> المندوب
					<div className="frame">احمد محمد محمد عوضين على</div>
                        </td>
                    </tr>
                </tbody>
            </table>


            <table>
                <tbody>
                    <tr>
                        <td>تاريخ الحساب <div className="frame">2020/6/14</div>
                        </td>
                        <td>فترة السداد <div className="frame">شهري</div>
                        </td>
                        <td>عدد الاقساط <div className="frame">18</div>
                        </td>
                        <td>فترة السماح
					<div className="frame">0</div>
                            <div className="frame">شراء بضاعه وخدمات</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    <tr>
                        <td>عدد ايام التأخير :<span>0</span>
                        </td>
                        <td>الغرامات المسدده :<span>0</span>
                        </td>
                        <td>الغرامات المستحقه : <div className="frame">0.00</div>

                        </td>
                        <td>ر ط
					<div className="frame">300</div>
                        </td>
                    </tr>
                </tbody>
            </table>



            <table className="tablestyle">
                <tbody>
                    <tr>
                        <th className="border">القسط</th>
                        <th className="border">تاريخ الآستحقاق</th>
                        <th className="border">القسط</th>
                        <th className="border">المصاريف</th>
                        <th className="border">قيمه مسدده</th>
                        <th className="border">مصاريف مسدده</th>
                        <th className="border">الحاله</th>
                        <th className="border">تاريخ الحاله</th>
                        <th className="border">ايام التأخير</th>
                        <th className="border">الملاحظات</th>
                    </tr>
                    <tr>
                        <td>076/0022648/001/1</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>266.00</td>
                        <td>707.00</td>
                        <td>266.00</td>
                        <td>مسدد</td>
                        <td>2020/06/14</td>
                        <td>-30</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/2</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/3</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/4</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/5</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/6</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/7</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/8</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/9</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/10</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/11</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/12</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/13</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/14</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>076/0022648/001/15</td>
                        <td>2020/07/14</td>
                        <td>707.00</td>
                        <td>255.00</td>
                        <td>0</td>
                        <td>0</td>
                        <td>غير مسدد</td>
                        <td></td>
                        <td>0</td>
                        <td></td>
                    </tr>


                    <tr>
                        <td></td>
                        <th>الإجمالي</th>
                        <td className="border">12726.00</td>
                        <td className="border">2726.00</td>
                        <td className="border">707.00</td>
                        <td className="border">266.00</td>
                        <th className="border">ايام التأخير</th>
                        <td className="border">0</td>
                        <th className="border">ايام التبكير</th>
                        <td className="border">0</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ border: "1px solid black" }}></div>

            <table className="tablestyle">
                <tbody>
                    <tr>
                        <td></td>
                        <th className="border">الاجمالي</th>
                        <th className="border">مصاريف</th>
                        <th className="border">الأصل</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>الرصيد</th>
                        <td className="border">12019.00</td>
                        <td className="border">2460.00</td>
                        <td className="border">9559.00</td>
                        <td></td>
                        <td></td>
                        <th className="border">الخصم</th>
                        <td className="border">1982</td>
                    </tr>
                    <tr>
                        <td></td>
                        <th className="border">اقساط يجب سدادها</th>
                        <th className="border">الرصيد الأصل</th>
                        <th className="border">5%</th>
                        <th className="border">إجمالي السداد المعجل</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>السداد المعجل</th>
                        <td className="border">0.00</td>
                        <td className="border">9559.00</td>
                        <td className="border">478</td>
                        <td className="border">10037</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>

            </table>
            <div>
                * يجب العوده لبرنامج المحصل لاحتساب الغرامات إن وجدت
	        </div>
        </div >
    )
}

export default EarlyPaymentPDF;
import React from 'react';
import './manualPaymentsReviewList.scss';

const ManualPaymentsReviewList = (props) => {
    return (
            <div className="manual-payments-review-list" dir="rtl" lang="ar">
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr style={{width:'100%',display:'flex',flexDirection:'row' , justifyContent:'space-between'}}><th colSpan={6}><div className={"logo-print"}></div></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>مراجعه حركات السداد اليدوي</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>اسيوط ابوتيج</th>
                            <th colSpan={6}>تاريخ الحركه من 1900/01/01 الي 2020/07/02</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>12:17:26 &emsp; 2020/07/05</th>
                            <th colSpan={6}>جنيه مصري</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                        <tr>
                            <th>رقم مسلسل</th>
                            <th>كود الحركه</th>
                            <th>مسلسل القسط</th>
                            <th className="name">أسم العميل</th>
                            <th>مستند الضمان</th>
                            <th>قيمة القسط</th>
                            <th>تاريخ استحقاق القسط</th>
                            <th>حالة القسط</th>
                            <th>مستند الحركه</th>
                            <th>أصل</th>
                            <th>تكلفه التمويل المسدده</th>
                            <th>إجمالي</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>

                    </thead>

                    <tbody>
                        <tr>
                            <th className="gray frame" colSpan={2}>تاريخ الحركه</th>
                            <th className="gray frame" colSpan={2}>2020/07/02</th>
                        </tr>
                        <tr>
                            <th className="gray frame" colSpan={2}>بنك / خرينه </th>
                            <th className="gray frame" colSpan={2}>خزينه 5 فرع ابوتيج - اسيوط - ابوتيج</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>010/00125012</td>
                            <td>010/0016708/002/012</td>
                            <td>إبتسام احمد صديق سليمان</td>
                            <td></td>
                            <td>2465.00</td>
                            <td>2020/07/24</td>
                            <td>في الخزينه</td>
                            <td>4221</td>
                            <td>2340.00</td>
                            <td>125.00</td>
                            <td>2465.00</td>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                        <tr>
                            <td className="frame" colSpan={2}>إجمالي بنك / خزينه</td>
                            <td className="frame" colSpan={2}>خزينه 5 فرع ابوتيج - اسيوط - ابوتيج</td>
                            <td className="frame" colSpan={1}>2020/07/02</td>
                            <td className="frame">1</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>2340.00</td>
                            <td>125.00</td>
                            <td>2465.00</td>
                        </tr>

                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                    </tbody>


                    <tr style={{ height: "1em" }}></tr>

                    <tbody className="tbodyborder">
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي تاريخ الحركه</td>
                            <td className="gray frame">2020/06/09</td>
                            <td></td>
                            <td className="frame">إجمالي عدد الحركات</td>
                            <td className="frame">162</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="frame">2340.00</td>
                            <td className="frame">125.00</td>
                            <td className="frame">2465.00</td>
                        </tr>

                    </tbody>

                    <tr style={{ height: "1em" }}></tr>

                    <tbody className="tbodyborder">
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                            <td className="gray frame">جنيه مصري</td>
                            <td></td>
                            <td className="frame">إجمالي عدد الحركات</td>
                            <td className="frame">162</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="frame">2340.00</td>
                            <td className="frame">125.00</td>
                            <td className="frame">2465.00</td>
                        </tr>


                    </tbody>
                </table>
            </div>
    )
}

export default ManualPaymentsReviewList;
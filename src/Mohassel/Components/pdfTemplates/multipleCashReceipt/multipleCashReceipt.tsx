import React from 'react';
import Tafgeet from 'tafgeetjs';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';
import './multipleCashReceipt.scss';

const MultipleCashReceipt = (props) => {
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="multiple-cash-receipt frame" dir="rtl" lang="ar">
                <table className="title">
                    <tbody>
                        <tr>
                            <th>شركة تساهيل للتمويل متناهي الصغر</th>
                        </tr>
                        <tr>
                            <td>أسيوط - أبوتيج</td>
                        </tr>
                        <tr>
                            <td>إيصال إيداع نقدية</td>
                        </tr>
                        <tr>
                            <td>خزينه 5 فرع أبوتيج</td>
                        </tr>
                    </tbody>
                </table>


                <table className="body">
                    <tbody>
                        <tr>
                            <th>رقم الإيصال :</th>
                            <td>26878</td>
                        </tr>

                        <tr>
                            <th>إسم العميل :</th>
                            <td>إبتسام احمد صديق سليمان</td>
                        </tr>

                        <tr>
                            <th>السداد الحالي :</th>
                            <td>1.00</td>
                        </tr>

                        <tr>
                            <td className="title frame" colSpan={2}>فقط واحد جنيه مصري فقط لاغير</td>
                        </tr>

                        <tr>
                            <th style={{ verticalAlign: "top" }}>الغـــــــرض :</th>
                            <td>رسوم إعادة إصدار
					<div>
                                    10/16708/1
					</div>
                            </td>
                        </tr>

                        <tr>
                            <th>بنك الإصدار :</th>
                            <td>خزينه 5 فرع أبوتيج</td>
                        </tr>

                        <tr>
                            <th>التاريخ :</th>
                            <td>2020/07/02</td>
                        </tr>

                        <tr>
                            <td colSpan={2} style={{ borderTop: "1px solid black" }}></td>
                        </tr>

                        <tr>
                            <th>توقيع المستلم :</th>
                            <td>--------------------------------------------------</td>
                        </tr>
                        <tr>
                            <th>روجع واعتمد :</th>
                            <td>--------------------------------------------------</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MultipleCashReceipt;
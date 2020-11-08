import React from 'react';
import Tafgeet from 'tafgeetjs';
import { timeToArabicDate, numbersToArabic } from "../../../../Shared/Services/utils";
import './earlyPaymentReceipt.scss';

const EarlyPaymentReceipt = (props) => {
    function getCode() {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer.key;
        else return props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer.key;
    }
    return (
        <>
            <div className="early-payment-receipt" dir="rtl" lang="ar">
                <table className="title">
                <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
                    <tbody>
                        <tr>
                            <th>شركة تساهيل للتمويل متناهي الصغر</th>
                        </tr>
                        <tr>
                            <td>{`${props.branchDetails.name} - ${props.branchDetails.governorate}`}</td>
                        </tr>
                        <tr>
                            <td>إيصال إيداع نقدية</td>
                        </tr>
                    </tbody>
                </table>


                <table>
                    <tbody>
                        <tr>
                            <th className="frame">التاريخ</th>
                            <td className="frame">{timeToArabicDate(0, false)}</td>

                        </tr>
                        <tr>
                            <th className="frame">رقم الإيصال</th>
                            <td className="frame">{numbersToArabic(props.receiptData[0].receiptNumber)}</td>
                        </tr>
                        <tr>
                            <th className="frame">إسم العميل</th>
                            <td className="frame">{props.receiptData[0].customerName}</td>
                        </tr>
                        <tr>
                            <th className="frame">كود العميل</th>
                            <td className="frame">{numbersToArabic(getCode())}</td>
                        </tr>
                        <tr>
                            <th className="frame"> السداد الحالي </th>
                            <td className="frame" style={{ direction: 'ltr' }}>{numbersToArabic(props.receiptData[0].paidNow)}
                                <div>{new Tafgeet(props.receiptData[0].paidNow, 'EGP').parse()}</div>
                            </td>
                        </tr>
                        <tr style={{ height: "45px" }}>
                            <td>توقيع المستلم :</td>
                            <td>-----------------------------------------------</td>
                        </tr>
                        <tr>
                            <td>روجع واعتمد :</td>
                            <td>-----------------------------------------------</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default EarlyPaymentReceipt;
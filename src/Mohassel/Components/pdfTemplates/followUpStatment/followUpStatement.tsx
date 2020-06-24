import React from 'react';
import './followUpStatment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, dayToArabic } from '../../../Services/utils';

const FollowUpStatment = (props) => {
    return (
        <div className="follow-up-statment" dir="rtl" lang="ar">
            <table className="margin" >
                <tbody>
                    <tr>
                        <td>{props.branchDetails.name} - {props.data.customer.governorate}</td>
                        <td></td>
                        <td>١/١ &emsp; جرجس فوزي عطيه - اخصائي نظم معلومات</td>
                    </tr>
                    <tr>
                        <td>{timeToArabicDate(0, true)}</td>
                        <td></td>
                        <td>{dayToArabic(new Date().getDay())}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className="title2 bold"><u>بيان متابعه</u></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <table className="titleborder">
                <tbody>
                    <tr>
                        <td style={{ textAlign: "right" }}> العميل
					<div className="frame">{props.data.customer.code}</div>
                            <div className="frame">{props.data.customer.customerName}</div>
                        </td>

                    </tr>
                </tbody>
            </table>


            <table className="table-content" style={{ width: "50%" }}>
                <tbody>
                    <tr>
                        <th>القسط</th>
                        <th>تاريخ الآستحقاق</th>
                        <th>القيمه</th>
                        <th style={{ width: "40%" }}>ملاحظات</th>
                    </tr>
                    {props.data.installmentsObject.installments.map((installment, index) => {
                        return (
                            <tr key={index}>
                                <td>{numbersToArabic(installment.id)}</td>
                                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                                <td>{numbersToArabic(installment.installmentResponse)}</td>
                                <td></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default FollowUpStatment;
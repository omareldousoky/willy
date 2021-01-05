import React from 'react';
import './followUpStatment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, dayToArabic } from "../../../../Shared/Services/utils";
import store from '../../../../Shared/redux/store';

const FollowUpStatment = (props) => {
    function getCustomerData(key: string) {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer[key]
        else return props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer[key];
    }
    function dateShift(date) {
        const originalDate = new Date(date);
        const dateInMonth = new Date(props.data.creationDate).getDate()
        if (1 <= dateInMonth && dateInMonth <= 10) {
            originalDate.setDate(20)
        } else if (11 <= dateInMonth && dateInMonth <= 20) {
            originalDate.setDate(30)
        } else if (21 <= dateInMonth && dateInMonth <= 31) {
            originalDate.setDate(10)
            originalDate.setMonth(originalDate.getMonth() + 1)
        }
        if (originalDate.getDay() === 5) {
            originalDate.setDate(originalDate.getDate() + 2)
        }
        if (originalDate.getDay() === 6) {
            originalDate.setDate(originalDate.getDate() + 1)
        }

        return originalDate.valueOf()
    }
    return (
        <div className="follow-up-statment" dir="rtl" lang="ar">
            <table className="margin">
                <tbody>
                    <tr>
                        <td>{props.branchDetails.name} - {props.branchDetails.governorate}</td>
                        <td></td>
                        <td>{store.getState().auth.name}</td>
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
					<div className="frame">{numbersToArabic(getCustomerData('key'))}</div>
                            <div className="frame">{getCustomerData('customerName')}</div>
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
                                <td>{numbersToArabic(props.data.applicationKey) + "/" + numbersToArabic(installment.id)}</td>
                                <td>{timeToArabicDate(props.data.product.beneficiaryType !== "individual" ? (installment.dateOfPayment - (5 * 24 * 60 * 60 * 1000)) : dateShift(installment.dateOfPayment), false)}</td>
                                <td>{numbersToArabic(installment.installmentResponse)}</td>
                                <td></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {props.data.product.beneficiaryType !== "individual" ?
                <table className="table-content" style={{ width: "50%" }}>
                    <tbody>
                        <tr>
                            <th>كود العضوه</th>
                            <th>اسم العضو</th>
                            <th>التمويل</th>
                            <th>النشاط</th>
                            <th>المنطقه</th>
                        </tr>
                        {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                            return (
                                <tr key={index}>
                                    <td>{numbersToArabic(individualInGroup.customer.key)}</td>
                                    <td>{individualInGroup.customer.customerName}</td>
                                    <td>{numbersToArabic(individualInGroup.amount)}</td>
                                    <td>{individualInGroup.customer.businessSector + "-" + individualInGroup.customer.businessActivity + "-" + individualInGroup.customer.businessSpeciality}</td>
                                    <td>{individualInGroup.customer.district}</td>
                                </tr>
                            )
                        })}
                    </tbody>

                </table>
                : null}
        </div>
    )
}

export default FollowUpStatment;
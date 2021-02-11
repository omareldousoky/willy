import React from 'react';
import './followUpStatment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, dayToArabic, timeToArabicDateNow } from "../../../../Shared/Services/utils";
import store from '../../../../Shared/redux/store';
import { shareInGroup } from '../customerCard/customerCard';

export function dateShift(creationDate, index) {
    const originalDate = new Date(creationDate);
    const originalMonth = originalDate.getMonth();
    const dateInMonth = new Date(creationDate).getDate()
    if (1 <= dateInMonth && dateInMonth <= 10) {
        originalDate.setMonth(originalMonth + index)
        originalDate.setDate(20)
    } else if (11 <= dateInMonth && dateInMonth <= 20) {
        originalDate.setMonth(originalMonth + index)
        originalMonth + index === 1 ? originalDate.setDate(28): originalDate.setDate(30)
    } else if (21 <= dateInMonth && dateInMonth <= 31) {
        originalDate.setMonth(originalMonth + 1 + index)
        originalDate.setDate(10)
    }
    if (originalDate.getDay() === 5) {
        originalDate.setDate(originalDate.getDate() + 2)
    }
    if (originalDate.getDay() === 6) {
        originalDate.setDate(originalDate.getDate() + 1)
    }

    return originalDate.valueOf()
}
export function twoWeekGroupShift(day) {
    const originalDate = new Date(day)
    switch (originalDate.getDay()) {
        case 0:
            //sunday
            return originalDate.setDate(originalDate.getDate() - 5).valueOf()
        case 1:
            return originalDate.setDate(originalDate.getDate() - 6).valueOf()
        case 2:
            return originalDate.setDate(originalDate.getDate() - 7).valueOf()
        case 3:
            return originalDate.setDate(originalDate.getDate() - 8).valueOf()
        case 4:
            return originalDate.setDate(originalDate.getDate() - 9).valueOf()
        case 5:
            return originalDate.setDate(originalDate.getDate() - 10).valueOf()
        case 6:
            return originalDate.setDate(originalDate.getDate() - 11).valueOf()
        default:
            return originalDate.valueOf()
    }
}
export function shiftDaysBackAvoidingWeeekend(day){
    const originalDate = new Date(day)
    if (originalDate.getDay() === 5) {
        originalDate.setDate(originalDate.getDate() - 1)
    }
    if (originalDate.getDay() === 6) {
        originalDate.setDate(originalDate.getDate() - 2)
    }
    return originalDate.valueOf()
}
const FollowUpStatementPDF = (props) => {
    function getCustomerData(key: string) {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer[key]
        else return props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer[key];
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
                        <td>{timeToArabicDateNow(true)}</td>
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
                                <td>{timeToArabicDate(props.data.product.beneficiaryType !== "individual" ? (props.data.product.periodLength === 1 && props.data.product.periodType === 'months') ? dateShift(props.data.creationDate, index) : (props.data.product.periodLength === 14 && props.data.product.periodType === 'days') ? twoWeekGroupShift(installment.dateOfPayment) : (installment.dateOfPayment - (5 * 24 * 60 * 60 * 1000))
                                    : (props.data.product.periodLength === 1 && props.data.product.periodType === 'months') ? dateShift(props.data.creationDate, index) : shiftDaysBackAvoidingWeeekend(installment.dateOfPayment - 3 * (5 * 24 * 60 * 60 * 1000)), false)}</td>
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
                            <th>القسط</th>
                            <th>النشاط</th>
                            <th>المنطقه</th>
                        </tr>
                        {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                            return (
                                <tr key={index}>
                                    <td>{numbersToArabic(individualInGroup.customer.key)}</td>
                                    <td>{individualInGroup.customer.customerName}</td>
                                    <td>{numbersToArabic(individualInGroup.amount)}</td>
                                    <td>{numbersToArabic(shareInGroup(individualInGroup.amount, props.data.principal, props.data.installmentsObject.installments[0].installmentResponse))}</td>
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

export default FollowUpStatementPDF;
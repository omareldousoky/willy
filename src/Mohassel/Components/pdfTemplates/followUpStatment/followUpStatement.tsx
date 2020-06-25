import React from 'react';
import './followUpStatment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, dayToArabic } from '../../../Services/utils';

const FollowUpStatment = (props) => {
    function getGov() {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer.governorate;
        else return props.data.group.individualsInGroup[0].customer.governorate;
    }
    function getCustomerData(key: string) {
        if (props.data.product.beneficiaryType === "individual")
            return props.data.customer[key]
        else return props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer[key];
    }
    return (
        <div className="follow-up-statment" dir="rtl" lang="ar">
            <table className="margin" >
                <tbody>
                    <tr>
                        <td>{props.branchDetails.name} - {getGov()}</td>
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
					<div className="frame">{getCustomerData('code')}</div>
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
                                <td>{numbersToArabic(installment.id)}</td>
                                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
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
                                    <td>{individualInGroup.customer.code}</td>
                                    <td>{individualInGroup.customer.customerName}</td>
                                    <td>{individualInGroup.amount}</td>
                                    <td></td>
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
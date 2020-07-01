import React from 'react';
import './testCalculateFormula.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, dayToArabic } from '../../../Services/utils';
import store from '../../../redux/store';

const TestCalculateFormulaPDF = (props) => {
    return (
        <div className="test-calculate-formula" dir="rtl" lang="ar">
            <table className="margin" >
                <tbody>
                    <tr>
                        <td>{props.branchName}</td>
                        <td></td>
                        <td>{store.getState().auth.name}</td>
                    </tr>
                    <tr>
                        <td>{timeToArabicDate(0,true)}</td>
                        <td></td>
                        <td>{dayToArabic(new Date().getDay())}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className="title2 bold"><u>{props.data.formulaName} - إختبار طريقة حساب الاقساط</u></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table className="table-content" style={{ width: "50%" }}>
                <tbody>
                    <tr>
                        <th>الرقم المسلسل</th>
                        <th>قيمة القسط</th>
                        <th>الأصل</th>
                        <th>المصاريف</th>
                        <th>تاريخ الآستحقاق</th>
                    </tr>
                    {props.data.result?.output.map(installment => {
                        return (
                            <tr key={installment.id}>
                                <td>{numbersToArabic(installment.id)}</td>
                                <td>{installment.installmentResponse ? numbersToArabic(installment.installmentResponse) : numbersToArabic(0)}</td>
                                <td>{installment.principalInstallment ? numbersToArabic(installment.principalInstallment) : numbersToArabic(0)}</td>
                                <td>{installment.feesInstallment ? numbersToArabic(installment.feesInstallment) : numbersToArabic(0)}</td>
                                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td>الإجمالي</td>
                        <td>{numbersToArabic(props.data.result?.sum.installmentSum)}</td>
                        <td>{numbersToArabic(props.data.result?.sum.principal)}</td>
                        <td>{numbersToArabic((props.data.result?.sum.feesSum)?props.data.result?.sum.feesSum:0)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TestCalculateFormulaPDF;
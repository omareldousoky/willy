import React from 'react';
import './testCalculateFormula.scss';
import * as local from '../../../../Shared/Assets/ar.json';

const TestCalculateFormulaPDF = (props) => {
    return (
        <div className="test-calculate-formula" dir="rtl" lang="ar">
            <table className="margin" >
                <tbody>
                    <tr>
                        <td>الغربية - زفتى</td>
                        <td></td>
                        <td>١/١ &emsp; جرجس فوزي عطيه - اخصائي نظم معلومات</td>
                    </tr>
                    <tr>
                        <td>١٦:٢٦:٠١ &emsp; ٢٠٢٠/٠٥/٠٥</td>
                        <td></td>
                        <td>الاربعاء</td>
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
                                <td>{installment.id}</td>
                                <td>{installment.installmentResponse ? installment.installmentResponse : 0}</td>
                                <td>{installment.principalInstallment ? installment.principalInstallment : 0}</td>
                                <td>{installment.feesInstallment ? installment.feesInstallment : 0}</td>
                                <td>{new Date(installment.dateOfPayment).toISOString().slice(0, 10)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TestCalculateFormulaPDF;
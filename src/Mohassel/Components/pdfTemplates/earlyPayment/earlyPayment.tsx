import React from 'react';
import './earlyPayment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';

const EarlyPaymentPDF = (props) => {
    function getStatus(status: string){
        switch(status){
            case 'paid': return local.paid;
            case 'unpaid': return local.unpaid;
            case 'partiallyPaid': return local.partiallyPaid;
            case 'late': return local.late;
            case 'cancelled': return local.cancelled;
            default: return '';
        }
    }
    function getSum(key: string){
        let max = 0;
        props.data.installmentsObject.installments.forEach(installment => {
            max = max + installment[key];
        })
        return max;
    }
    function getInstallmentsRemaining() {
        const installmentsRemaining: Array<number> = [];
        props.data.installmentsObject.installments.forEach(installment => {
          if (installment.status !== 'paid')
            installmentsRemaining.push(installment.id);
        })
        return numbersToArabic(installmentsRemaining.toString());
      }
    return (
        <div className="early-payment-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <th style={{ width: "35%" }} className="title bold border">
                            شركة تساهيل للتمويل متناهي الصغر</th>
                        <td></td>
                        <td className="title bold">{props.branchDetails.name} - {props.data.customer.governorate}</td>
                    </tr>
                    <tr>
                        <td>{timeToArabicDate(0, true)}</td>
                        <td className="title2 bold"><u>السداد المعجل</u></td>
                        <td>1/1</td>
                    </tr>
                </tbody>
            </table>
            <table className="border">
                <tbody>
                    <tr>
                        <td> العميل
					<div className="frame">{props.data.customer.code}</div>
                            <div className="frame">{props.data.customer.customerName}</div>
                        </td>
                        <td> التاريخ
					<div className="frame">{timeToArabicDate(0, false)}</div>
                        </td>
                        <td> المندوب
					<div className="frame">{props.loanOfficer}</div>
                        </td>
                    </tr>
                </tbody>
            </table>


            <table>
                <tbody>
                    <tr>
                        <td>تاريخ الحساب <div className="frame">{timeToArabicDate(0, false)}</div>
                        </td>
                        <td>فترة السداد <div className="frame">{props.data.product.periodType}</div>
                        </td>
                        <td>عدد الاقساط <div className="frame">{numbersToArabic(props.data.installmentsObject.installments.length)}</div>
                        </td>
                        <td>فترة السماح
					        <div className="frame">{numbersToArabic(props.data.product.gracePeriod)}</div>
                            <div className="frame">{props.data.customer.businessActivity}</div>
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
                        <th className="border"> قيمة القسط</th>
                        <th className="border">المصاريف</th>
                        <th className="border">قيمه مسدده</th>
                        <th className="border">مصاريف مسدده</th>
                        <th className="border">الحاله</th>
                        <th className="border">تاريخ الحاله</th>
                        <th className="border">ايام التأخير</th>
                        <th className="border">الملاحظات</th>
                    </tr>
                    {props.data.installmentsObject.installments.map((installment, index) => {
                        return (
                            <tr key={index}>
                                <td>{numbersToArabic(installment.id)}</td>
                                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                                <td>{numbersToArabic(installment.principalInstallment)}</td>
                                <td>{numbersToArabic(installment.feesInstallment)}</td>
                                <td>{numbersToArabic(installment.principalPaid)}</td>
                                <td>{numbersToArabic(installment.feesPaid)}</td>
                                <td>{getStatus(installment.status)}</td>
                                <td>{timeToArabicDate(installment.paidAt, false)}</td>
                                <td>{Math.round((installment.paidAt-installment.dateOfPayment)/(1000*60*60*24))> 0? numbersToArabic(Math.round((installment.paidAt-installment.dateOfPayment))): ''}</td>
                                <td></td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <th>الإجمالي</th>
                        <td className="border">{numbersToArabic(props.data.installmentsObject.totalInstallments.principal)}</td>
                        <td className="border">{numbersToArabic(props.data.installmentsObject.totalInstallments.feesSum)}</td>
                        <td className="border">{numbersToArabic(getSum('principalPaid'))}</td>
                        <td className="border">{numbersToArabic(getSum('feesPaid'))}</td>
                        <th className="border">ايام التأخير</th>
                        <td className="border"></td>
                        <th className="border">ايام التبكير</th>
                        <td className="border"></td>
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
                        <td className="border">{numbersToArabic(props.earlyPaymentData.requiredAmount)}</td>
                        <td className="border">{numbersToArabic(props.data.installmentsObject.totalInstallments.feesSum - getSum('feesPaid'))}</td>
                        <td className="border">{numbersToArabic(props.earlyPaymentData.remainingPrincipal)}</td>
                        <td></td>
                        <td></td>
                        <th className="border">الخصم</th>
                        <td className="border">{numbersToArabic((props.data.installmentsObject.totalInstallments.feesSum - getSum('feesPaid'))-(props.data.product.earlyPaymentFees * props.earlyPaymentData.remainingPrincipal))}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <th className="border">اقساط يجب سدادها</th>
                        <th className="border">الرصيد الأصل</th>
                        <th className="border">{numbersToArabic(props.data.product.earlyPaymentFees)}%</th>
                        <th className="border">إجمالي السداد المعجل</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>السداد المعجل</th>
                        <td className="border">{getInstallmentsRemaining()}</td>
                        <td className="border">{numbersToArabic(props.earlyPaymentData.remainingPrincipal)}</td>
                        <td className="border">{numbersToArabic(props.data.product.earlyPaymentFees * props.earlyPaymentData.remainingPrincipal)}</td>
                        <td className="border">{numbersToArabic(props.earlyPaymentData.requiredAmount - (props.data.installmentsObject.totalInstallments.feesSum - getSum('feesPaid'))-(props.data.product.earlyPaymentFees * props.earlyPaymentData.remainingPrincipal))}</td>
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
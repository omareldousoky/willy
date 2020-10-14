import React, { useEffect, useState, Component } from 'react';
import './earlyPayment.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, getStatus } from '../../../Services/utils';
interface Props {
    data: any;
    earlyPaymentData: any;
    branchDetails: any;
}
interface State {
    totalDaysLate: number;
    totalDaysEarly: number;
    latePrincipal: number;
    installmentsDue: Array<number>;
}
class EarlyPaymentPDF extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            totalDaysLate: 0,
            totalDaysEarly: 0,
            latePrincipal: 0,
            installmentsDue: [],
        }
    }
    UNSAFE_componentWillMount() {
        let totalDaysLate = 0;
        let totalDaysEarly = 0;
        let latePrincipal = 0;
        const installmentsDue: Array<number> = []
        this.props.data.installmentsObject.installments.forEach(installment => {
            if ((new Date(installment.dateOfPayment).getMonth() === new Date().getMonth()
                    && new Date(installment.dateOfPayment).getFullYear() === new Date().getFullYear() && (getStatus(installment) === local.unpaid)) 
                || (getStatus(installment) === local.late) 
                || ((new Date(installment.dateOfPayment).getMonth() <= new Date().getMonth()
                    && new Date(installment.dateOfPayment).getFullYear() <= new Date().getFullYear()) && (getStatus(installment) === local.partiallyPaid))) {
                latePrincipal = latePrincipal + (installment.principalInstallment - installment.principalPaid)
                installmentsDue.push(installment.id);
            }
            if (installment.status !== "rescheduled") {
                if (installment.paidAt) {
                    const number = Math.round((new Date(installment.paidAt).setHours(23, 59, 59, 59) - new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) / (1000 * 60 * 60 * 24));
                    if (number > 0) {
                        totalDaysLate = totalDaysLate + number;
                    } else totalDaysEarly = totalDaysEarly + number;
                } else {
                    const number = Math.round((new Date().setHours(23, 59, 59, 59).valueOf() - new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) / (1000 * 60 * 60 * 24));
                    if (number > 0) totalDaysLate = totalDaysLate + number;
                }
            }
        });
        this.setState({ totalDaysEarly, totalDaysLate, latePrincipal, installmentsDue })
    }
    
    getSum(key: string) {
        let max = 0;
        this.props.data.installmentsObject.installments.forEach(installment => {
            max = max + installment[key];
        })
        return max;
    }
    getInstallmentsRemaining() {
        let total = 0;
        this.props.data.installmentsObject.installments.forEach(installment => {
            if(this.state.installmentsDue.includes(installment.id)) {
                total= total + installment.installmentResponse
            }
        });
        return total;
    }
    getApplicationFee() {
        if (this.props.data.product.applicationFeePercent !== 0) {
            return numbersToArabic(this.props.data.product.applicationFeePercent)
        } else if (this.props.data.product.applicationFeePercentPerPerson !== 0) {
            return numbersToArabic(this.props.data.product.applicationFeePercentPerPerson)
        } else if (this.props.data.product.individualApplicationFee !== 0) {
            return numbersToArabic(this.props.data.product.individualApplicationFee)
        } else if (this.props.data.product.applicationFee !== 0) {
            return numbersToArabic(this.props.data.product.applicationFee)
        } else return numbersToArabic(0);
    }
    render() {
        return (
            <div className="early-payment-print" style={{ direction: "rtl" }} lang="ar">
                <table>
                    <tbody>
                        <tr>
                            <th style={{ width: "35%" }} className="title bold border">
                                شركة تساهيل للتمويل متناهي الصغر</th>
                            <td></td>
                            <td className="title bold">{this.props.branchDetails.name} - {this.props.branchDetails.governorate}</td>
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
					<div className="frame">{(this.props.data.product.beneficiaryType === "individual") ? numbersToArabic(this.props.data.customer.key) : numbersToArabic(this.props.data.group.individualsInGroup.find(member => member.type === 'leader').customer.key)}</div>
                                <div className="frame">{(this.props.data.product.beneficiaryType === "individual") ? this.props.data.customer.customerName : this.props.data.group.individualsInGroup.find(member => member.type === 'leader').customer.customerName}</div>
                            </td>
                            <td> التاريخ
					<div className="frame">{timeToArabicDate(0, false)}</div>
                            </td>
                            <td> المندوب
					<div className="frame">{(this.props.data.product.beneficiaryType === 'group') ? this.props.data.group.individualsInGroup.find(member => member.type === 'leader').customer.representativeName : this.props.data.customer.representativeName}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <table>
                    <tbody>
                        <tr>
                            <td>تاريخ الحساب <div className="frame">{timeToArabicDate(0, false)}</div>
                            </td>
                            <td>فترة السداد <div className="frame">{this.props.data.product.periodType === 'days' ? local.daily : local.inAdvanceFromMonthly}</div>
                            </td>
                            <td>عدد الاقساط <div className="frame">{numbersToArabic(this.props.data.installmentsObject.installments.length)}</div>
                            </td>
                            <td>فترة السماح
					        <div className="frame">{numbersToArabic(this.props.data.product.gracePeriod)}</div>
                                <div className="frame">{this.props.data.product.beneficiaryType === "individual" ? this.props.data.customer.businessActivity : "تمويل رأس المال"}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td>عدد ايام التأخير :<span className="frame">{numbersToArabic(this.state.totalDaysLate)}</span>
                            </td>
                            <td>غرامات المسدده :<span className="frame">{numbersToArabic(this.props.data.penaltiesPaid)}</span>
                            </td>
                            <td>غرامات معفاة : <div className="frame">{numbersToArabic(this.props.data.penaltiesCanceled)}</div>
                            </td>
                            <td>رسوم تحصيل
					<div className="frame">{this.getApplicationFee()}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>



                <table className="tablestyle">
                    <tbody>
                        <tr>
                            <th className="border">القسط</th>
                            <th className="border">تاريخ الآستحقاق</th>
                            <th className="border"> اصل القسط</th>
                            <th className="border">الفائدة</th>
                            <th className="border">اجمالي القيمة</th>
                            <th className="border">قيمه مسدده</th>
                            <th className="border">فائدة مسدده</th>
                            <th className="border">الحاله</th>
                            <th className="border">تاريخ الحاله</th>
                            <th className="border">ايام التأخير</th>
                            <th className="border">الملاحظات</th>
                        </tr>
                        {this.props.data.installmentsObject.installments.map((installment, index) => {
                            return (
                                <tr key={index}>
                                    <td>{numbersToArabic(this.props.data.applicationKey) + "/" + numbersToArabic(installment.id)}</td>
                                    <td className={this.state.installmentsDue.includes(installment.id)? 'due': ''}>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                                    <td>{numbersToArabic(installment.principalInstallment)}</td>
                                    <td>{numbersToArabic(installment.feesInstallment)}</td>
                                    <td>{numbersToArabic(installment.installmentResponse)}</td>
                                    <td>{numbersToArabic(installment.principalPaid)}</td>
                                    <td>{numbersToArabic(installment.feesPaid)}</td>
                                    <td>{getStatus(installment)}</td>
                                    <td>{installment.paidAt ? timeToArabicDate(installment.paidAt, false) : ''}</td>
                                    <td>{installment.paidAt ?
                                        numbersToArabic(Math.round((new Date(installment.paidAt).setHours(23, 59, 59, 59) - new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) / (1000 * 60 * 60 * 24)))
                                        :
                                        ((new Date().setHours(23, 59, 59, 59).valueOf() > new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) && installment.status !== "rescheduled") ? numbersToArabic(Math.round((new Date().setHours(23, 59, 59, 59).valueOf() - new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) / (1000 * 60 * 60 * 24))): ''}</td>
                                    <td></td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td></td>
                            <th>الإجمالي</th>
                            <td className="border">{numbersToArabic(this.props.data.installmentsObject.totalInstallments.principal)}</td>
                            <td className="border">{numbersToArabic(this.props.data.installmentsObject.totalInstallments.feesSum)}</td>
                            <td className="border">{numbersToArabic(this.props.data.installmentsObject.totalInstallments.installmentSum)}</td>
                            <td className="border">{numbersToArabic(this.getSum('principalPaid'))}</td>
                            <td className="border">{numbersToArabic(this.getSum('feesPaid'))}</td>
                            <th className="border">ايام التأخير</th>
                            <td className="border">{this.state.totalDaysLate > 0 ? numbersToArabic(this.state.totalDaysLate) : numbersToArabic(0)}</td>
                            <th className="border">ايام التبكير</th>
                            <td className="border">{numbersToArabic(this.state.totalDaysEarly < 0 ? this.state.totalDaysEarly * -1 : this.state.totalDaysEarly)}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ border: "1px solid black" }}></div>

                <table className="tablestyle">
                    <tbody>
                        <tr>
                            <td></td>
                            <th className="border">الاجمالي</th>
                            <th className="border">فائدة</th>
                            <th className="border">الأصل</th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>الرصيد</th>
                            <td className="border">{numbersToArabic((this.props.data.installmentsObject.totalInstallments.feesSum - this.getSum('feesPaid')) + this.props.earlyPaymentData.remainingPrincipal)}</td>
                            <td className="border">{numbersToArabic(this.props.data.installmentsObject.totalInstallments.feesSum - this.getSum('feesPaid'))}</td>
                            <td className="border">{numbersToArabic(this.props.earlyPaymentData.remainingPrincipal)}</td>
                            <td></td>
                            <td></td>
                            <th className="border">الخصم</th>
                            <td className="border">{numbersToArabic(((this.props.data.installmentsObject.totalInstallments.feesSum - this.getSum('feesPaid')) + this.props.earlyPaymentData.remainingPrincipal)-((this.props.earlyPaymentData.remainingPrincipal) + ((this.props.data.product.earlyPaymentFees * (this.props.earlyPaymentData.remainingPrincipal)) / 100)))}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <th className="border">اقساط يجب سدادها</th>
                            <th className="border">الرصيد الأصل</th>
                            <th className="border">{numbersToArabic(this.props.data.product.earlyPaymentFees)}%  (مصاريف الترحيل)</th>
                            <th className="border">إجمالي السداد المعجل</th>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>السداد المعجل</th>
                            <td className="border">{this.getInstallmentsRemaining()}</td>
                            <td className="border">{numbersToArabic(this.props.earlyPaymentData.remainingPrincipal - this.state.latePrincipal)}</td>
                            <td className="border">{numbersToArabic((this.props.data.product.earlyPaymentFees * (this.props.earlyPaymentData.remainingPrincipal - this.state.latePrincipal)) / 100)}</td>
                            <td className="border">{numbersToArabic((this.props.earlyPaymentData.remainingPrincipal) + ((this.props.data.product.earlyPaymentFees * (this.props.earlyPaymentData.remainingPrincipal)) / 100))}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>

                </table>
            </div >
        )
    }
}

export default EarlyPaymentPDF;
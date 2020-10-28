import React, { Component } from 'react';
import './customerCard.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic, getStatus } from '../../../Services/utils';
import store from '../../../redux/store';

interface Props {
    data: any;
    branchDetails: any;
    penalty: number;
    getGeoArea: Function;
}
interface State {
    totalDaysLate: number;
    totalDaysEarly: number;
}

class CustomerCardPDF extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            totalDaysLate: 0,
            totalDaysEarly: 0,
        }
    }
    UNSAFE_componentWillMount() {
        let totalDaysLate = 0;
        let totalDaysEarly = 0;
        this.props.data.installmentsObject.installments.forEach(installment => {
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
        this.setState({ totalDaysEarly, totalDaysLate })
    }
    getCode() {
        if (this.props.data.product.beneficiaryType === "individual")
            return this.props.data.customer.key;
        else return this.props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer.key;
    }
    getSum(key: string) {
        let max = 0;
        this.props.data.installmentsObject.installments.forEach(installment => {
            max = max + installment[key];
        })
        return max;
    }
    render() {
        return (
            <>
                <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                    <tr style={{ height: "10px" }}></tr>
                    <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                    <tr style={{ height: "10px" }}></tr>
                </table>
                <div className="customer-card-print" style={{ direction: "rtl" }} lang="ar">
                    <table>
                        <tbody>
                            <tr>
                                <td className="title bold titleborder titlebackground">
                                    شركة تساهيل للتمويل متناهي الصغر</td>
                                <td style={{ width: "30%" }}></td>
                                <td className="title bold">{this.props.branchDetails.name} - {this.props.branchDetails.governorate}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={{ fontSize: "8px" }}>{store.getState().auth.name}</td>
                            </tr>
                            <tr>
                                <td>{timeToArabicDate(0, true)}</td>
                                <td className="title2 bold"><u>كارت العميل</u></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ marginBottom: "2px" }} className="bold title"> عميلنا العزيز، برجاء الالتزام بسداد الاقساط حسب
                    الجدول
                    المرفق
	</div>

                    <table className="titleborder">
                        <tbody>
                            <tr>
                                <td>  العميل
                            <div className="frame">{numbersToArabic(this.getCode())}</div>
                                    <div className="frame">{this.props.data.product.beneficiaryType === "individual" ? this.props.data.customer.customerName : this.props.data.group.individualsInGroup.find(customer => customer.type === 'leader').customer.customerName}</div>
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
                                <td>قيمة التمويل <div className="frame">{numbersToArabic(this.props.data.principal)}</div>
                                </td>
                                <td>فترة السداد <div className="frame">{this.props.data.product.periodType === 'days' ? local.daily : local.inAdvanceFromMonthly}</div>
                                </td>
                                <td>عدد الاقساط <div className="frame">{numbersToArabic(this.props.data.installmentsObject.installments.length)}</div>
                                </td>
                                <td>فترة السماح
					<div className="frame">{numbersToArabic(this.props.data.product.gracePeriod)}</div>
                                    <div className="frame">تمويل رأس المال</div>
                                </td>
                            </tr>
                            <tr>
                                <td>غرامات مسددة <div className="frame">{numbersToArabic(this.props.data.penaltiesPaid)}</div>
                                </td>
                                <td>غرامات مطلوبة <div className="frame">{numbersToArabic(this.props.penalty)}</div>
                                </td>
                                <td>غرامات معفاة <div className="frame">{numbersToArabic(this.props.data.penaltiesCanceled)}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="tablestyle" style={{ border: "1px black solid" }}>
                        <tbody>
                            <tr>
                                <th>القسط</th>
                                <th>تاريخ الآستحقاق</th>
                                <th> قيمة القسط</th>
                                <th>الفائدة</th>
                                <th>اجمالي القيمة</th>
                                <th>قيمه مسدده</th>
                                <th>فائدة مسدده</th>
                                <th>الحاله</th>
                                <th>تاريخ الحاله</th>
                                <th>ايام التأخير</th>
                                <th style={{ width: "15%" }}>ملاحظات</th>
                            </tr>
                            {this.props.data.installmentsObject.installments.map(installment => {
                                return (<tr key={installment.id}>
                                    <td>{numbersToArabic(this.props.data.applicationKey) + "/" + numbersToArabic(installment.id)}</td>
                                    <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
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
                                        ((new Date().setHours(23, 59, 59, 59).valueOf() > new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) && installment.status !== "rescheduled") ? numbersToArabic(Math.round((new Date().setHours(23, 59, 59, 59).valueOf() - new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) / (1000 * 60 * 60 * 24))) : ''}</td>
                                    <td></td>
                                </tr>)
                            })}
                            <tr>
                                <td>الإجمالي</td>
                                <td></td>
                                <td>{numbersToArabic(this.props.data.installmentsObject.totalInstallments.principal)}</td>
                                <td>{numbersToArabic(this.props.data.installmentsObject.totalInstallments.feesSum)}</td>
                                <td>{numbersToArabic(this.props.data.installmentsObject.totalInstallments.installmentSum)}</td>
                                <td>{numbersToArabic(this.getSum('principalPaid'))}</td>
                                <td>{numbersToArabic(this.getSum('feesPaid'))}</td>
                                <th>ايام التأخير</th>
                                <td>{this.state.totalDaysLate > 0 ? numbersToArabic(this.state.totalDaysLate) : numbersToArabic(0)}</td>
                                <th>ايام التبكير</th>
                                <td>{numbersToArabic(this.state.totalDaysEarly < 0 ? this.state.totalDaysEarly * -1 : this.state.totalDaysEarly)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="tablestyle" style={{ border: "1px black solid" }}>
                        <tbody>
                            {this.props.data.product.beneficiaryType === "individual" && this.props.data.guarantors.length > 0 ?
                                <tr>
                                    <th>كود الضامن</th>
                                    <th>اسم الضامن</th>
                                    <th>المنطقه</th>
                                    <th>العنوان</th>
                                    <th>تليفون</th>
                                </tr>
                                : this.props.data.product.beneficiaryType === "group" ?
                                    <tr>
                                        <th>كود العضو</th>
                                        <th>اسم العضو</th>
                                        <th>المنطقه</th>
                                        <th>العنوان</th>
                                        <th>تليفون</th>
                                    </tr>
                                    : null
                            }
                            {this.props.data.product.beneficiaryType === "individual" && this.props.data.guarantors.length > 0 ?
                                this.props.data.guarantors.map((guarantor, index) => {
                                    const area = this.props.getGeoArea(guarantor.geoAreaId);
                                    return (
                                        <tr key={index}>
                                            <td>{numbersToArabic(guarantor.key)}</td>
                                            <td>{guarantor.customerName}</td>
                                            <td style={{ color: (!area.active && area.name !== '-') ? 'red' : 'black' }}>{area.name}</td>
                                            <td>{guarantor.customerHomeAddress}</td>
                                            <td>{numbersToArabic(guarantor.mobilePhoneNumber) + '-' + numbersToArabic(guarantor.businessPhoneNumber) + '-' + numbersToArabic(guarantor.homePhoneNumber)}</td>
                                        </tr>
                                    )
                                })
                                : this.props.data.product.beneficiaryType === "group" ?
                                    this.props.data.group.individualsInGroup.map((individualInGroup, index) => {
                                        const area = this.props.getGeoArea(individualInGroup.customer.geoAreaId);
                                        return (
                                            <tr key={index}>
                                                <td>{numbersToArabic(individualInGroup.customer.key)}</td>
                                                <td>{individualInGroup.customer.customerName}</td>
                                                <td style={{ color: (!area.active && area.name !== '-') ? 'red' : 'black' }}>{area.name}</td>
                                                <td>{individualInGroup.customer.customerHomeAddress}</td>
                                                <td>{numbersToArabic(individualInGroup.customer.mobilePhoneNumber) + '-' + numbersToArabic(individualInGroup.customer.businessPhoneNumber) + '-' + numbersToArabic(individualInGroup.customer.homePhoneNumber)}</td>
                                            </tr>
                                        )
                                    })
                                    : null
                            }
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'right' }}>
                        <div className="bold frame title2">
                            <u>تعليمات خاصه بالسداد</u>
                        </div>
                    </div>
                    <ol>
                        <li>يتم دفع الاقساط في مواعيدها من خلال خزينة الفرع بايصال رسمي مختوم او عبر وسائل الدفع الالكتروني المعتمده
                        من
                        هيئة
			الرقابه المالية</li>
                        <li>ممنوع منعا باتا دفع اي مبالغ نقديه للمندوب تحت اي مسمي</li>
                        <li>الاداره غير مسؤله عن اي مبالغ يتم دفعها لاي شخص بدون ايصال رسمي مختوم من خزينة الفرع</li>
                        {this.props.data.product.beneficiaryType === "individual" ?
                            <>
                                <li>يلتزم العميل بسداد غرامه تاخير قدرها ٥% من قيمه القسط في اليوم التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي يليه كالتالي :</li>
                                <ul>يتم تحصيل ٥ ج عن كل يوم تاخير اذا كان قيمه القسط اقل من ٢٠٠٠ ج .</ul>
                                <ul> ويتم تحصيل ٧٫٥ ج عن كل يوم تاخير اذا كان قيمه القسط يتراوح من ٢٠٠٠ ج حتي ٣٠٠٠ ج .</ul>
                                <ul>ويتم تحصيل ١٠ ج عن كل يوم تاخير اذا كان قيمه القسط اكبر من ٣٠٠٠ ج .</ul>
                            </>
                            :
                            <>
                                <li>تلتزم الأعضاء بسداد غرامه تاخير قدرها ٥% من قيمه القسط في اليوم التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي يليه كالتالي :</li>
                                <ul>يتم تحصيل ٢ ج عن كل يوم تأخير اذا كان قيمة القسط أقل من ١٥٠٠ ج</ul>
                                <ul> يتم تحصيل ٣ ج عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ١٥٠٠ ج حتي٢٠٠٠ ج</ul>
                                <ul>تم تحصيل ٤ ج عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠ جنيها حتي٢٥٠٠ ج</ul>
                                <ul>يتم تحصيل ٥ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط اكبر من او يساوي ٢٥٠٠ ج</ul>
                            </>
                        }
                        <li>في حالة طلب سداد المديونيه المستحقه يتم خصم تكلفة التمويل للشهر الذي يتم فيه السداد مع اضافة عموله سداد
                        معجل
                        ٥٪
                من باقي المبلغ المستحق (اصل) المراد تعجيل الوفاه به</li>
                        <li>يحق للشركه مطالبه قيمة القرض وكافة المصروفات وتكاليف تمويله في حالة استخدام مبلغ القرض في غرض غير
                        استخدامه
                        داخل
			النشاط او اغلاق النشاط</li>
                    </ol>
                </div >
            </>
        )
    }
}

export default CustomerCardPDF;
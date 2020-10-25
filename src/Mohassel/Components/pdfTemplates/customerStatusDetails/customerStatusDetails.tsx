import React from 'react';
import './customerStatusDetails.scss';
import { timeToArabicDate, currency, periodType, getStatus, getLoanStatus, beneficiaryType, numbersToArabic, arabicGender } from '../../../Services/utils';

const CustomerStatusDetails = (props) => {
    function getCustomerStatus(status: string) {
        switch (status) {
            case 'no commitment': return 'ليس عليه إلتزامات';
            case 'open loan': return 'قرض مفتوح';
            case 'open application': return 'طلب مفتوح';
            default: return '';
        }
    }
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="customer-status-details" lang="ar">
                <table>
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={3}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th rowSpan={3} colSpan={3}>التقرير التفصيلي لحالة العميل</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={3}>المركز الرئيسي</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={3}>{timeToArabicDate(0, true)}</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                        <tr>
                            <th className="gray frame">الأسم</th>
                            <td className="frame">{props.data.customerName}</td>
                            <th className="gray frame">الكود</th>
                            <td className="frame">{props.customerKey}</td>
                            <th className="gray frame">الحاله</th>
                            <td className="frame">{getCustomerStatus(props.data.customerStatus)}</td>
                            <th className="gray frame">حالة التعامل مع العميل</th>
                            <td className="frame"></td>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="borderless" colSpan={100}>
                                {props.data.Loans && props.data.Loans.length > 0 && props.data.Loans.map((loan, index) => {
                                    return (
                                        <div key={index} style={{ pageBreakAfter: 'always' }}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th className="frame gray" colSpan={100}>بيانات العميل</th>
                                                    </tr>
                                                    <tr>
                                                        <th>الفرع الحالي</th>
                                                        <td>{props.data.accountBranch}</td>
                                                        <th>نوع الاقتراض</th>
                                                        <td>{beneficiaryType(loan.beneficiaryType)}</td>
                                                        <th>المندوب الحالي</th>
                                                        <td>{props.data.officerName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>الرقم القومي</th>
                                                        <td>{numbersToArabic(props.data.nationalId)}</td>
                                                        <th>بتاريخ</th>
                                                        <td>{timeToArabicDate(props.data.nationalIdIssueDate, false)}</td>
                                                        <th>النوع</th>
                                                        <td>{arabicGender(props.data.gender)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>تاريخ الميلاد</th>
                                                        <td>{timeToArabicDate(props.data.birthDate, false)}</td>
                                                        <th>البطاقه</th>
                                                        <td>{props.data.nationalId}</td>
                                                        <th>صادره من</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>ملاحظات</th>
                                                        <td colSpan={3}></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={100} className="horizontal-line"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th className="frame gray" colSpan={100}>بيانات القرض</th>
                                                    </tr>
                                                    <tr>
                                                        <th>رقم القرض</th>
                                                        <td>{loan.idx}</td>
                                                        <th>تاريخ القرض</th>
                                                        <td>{timeToArabicDate(loan.creationDate, false)}</td>
                                                        <th>القيمة</th>
                                                        <td>{loan.principal}</td>
                                                        <th>العمله</th>
                                                        <td>{currency(loan.currency)}</td>
                                                        <th>رسوم الطوابع</th>
                                                        <td>{loan.stamps}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>رسوم طلب القرض</th>
                                                        <td>{loan.applicationFees}</td>
                                                        <th>عدد الأقساط</th>
                                                        <td>{loan.numInst}</td>
                                                        <th>فترة السداد</th>
                                                        <td>{loan.periodLength + " " + periodType(loan.periodType)}</td>
                                                        <th>فترة السماح</th>
                                                        <td>{loan.gracePeriod}</td>
                                                        <th>عمولة المندوب</th>
                                                        <td>{loan.representativeFees}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>فائدة القسط</th>
                                                        <td>{loan.feesInstallment}</td>
                                                        <th>المصاريف الموزعه</th>
                                                        <td>{loan.interest} % سنويا</td>
                                                        <th>المصاريف المقدمه</th>
                                                        <td colSpan={5}>0% من القرض - قيمة مستقله لا تستقطع من المصاريف الموزعه</td>
                                                    </tr>
                                                    <tr>
                                                        <th>مندوب التنميه الحالي</th>
                                                        <td colSpan={2}>{loan.representativeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>حالة القرض</th>
                                                        <td>{getLoanStatus(loan.status)}</td>
                                                        <th>غرامات مسدده</th>
                                                        <td>{loan.penaltiesPaid === "None" ? '' : loan.penaltiesPaid}</td>
                                                        <th>غرامات معفاه</th>
                                                        <td>{loan.penaltiesCanceled === "None" ? '' : loan.penaltiesCanceled}</td>
                                                        <th>غرامات مستحقه</th>
                                                        <td>{loan.penalties === "None" ? '' : loan.penalties}</td>
                                                    </tr>
                                                    {loan.rejectionReason !== "None" ?
                                                        <tr>
                                                            <th>سبب الإلغاء</th>
                                                            <td>{loan.rejectionReason}</td>
                                                            <td>مندوب التنميه السابق</td>
                                                            <td>{loan.prevRepName ? loan.prevRepName : loan.representativeName ? loan.representativeName : ''}</td>
                                                        </tr>
                                                        : null
                                                    }
                                                    <tr>
                                                        <th>طريقة الحساب</th>
                                                        <td>{loan.calculationFormulaName}</td>

                                                    </tr>
                                                    <tr>
                                                        <td colSpan={100} className="horizontal-line"></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {loan.beneficiaryType === "individual" && <table>
                                                <tbody>
                                                    <tr>
                                                        {loan.guarantors.length > 0 && loan.guarantors.map((guarantor, index) => {
                                                            return (
                                                                <td key={index}>
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="frame gray" colSpan={100}>الضامن الرئيسي</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <th>الأسم</th>
                                                                                <td>{guarantor.customerName}</td>
                                                                                <th>النوع</th>
                                                                                <td>{arabicGender(guarantor.gender)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>الرقم القومي</th>
                                                                                <td>{guarantor.nationalId}</td>
                                                                                <th>تاريخ الأصدار</th>
                                                                                <td>{guarantor.nationalIdIssueDate ? timeToArabicDate(guarantor.nationalIdIssueDate, false) : ''}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>تاريخ الميلاد</th>
                                                                                <td>{guarantor.birthDate}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>العنوان</th>
                                                                                <td>{guarantor.customerHomeAddress}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>التليفون</th>
                                                                                <td>{guarantor.mobilePhoneNumber}</td>
                                                                                <th>الرقم البريدي</th>
                                                                                <td>{guarantor.homePostalCode}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>البطاقه صادره من</th>
                                                                                <td></td>
                                                                                <th>الرقم المطبوع</th>
                                                                                <td></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={100} className="horizontal-line"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            }

                                            {loan.beneficiaryType === "group" && <table>
                                                <tbody>
                                                    <tr>
                                                        <th className="frame gray" colSpan={100}>اسماء اعضاء المجموعه لهذا القرض</th>
                                                    </tr>
                                                    <tr>
                                                        <th>كود العضو</th>
                                                        <th>أسم العضو</th>
                                                        <th>حصة العضو من القرض</th>
                                                        <th></th>
                                                    </tr>
                                                    {loan.groupMembers.map((member, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{member.key}</td>
                                                                <td>{member.customerName}</td>
                                                                <td>{member.amount}</td>
                                                                {member.type === "leader" ? <td>رئيس المجموعه</td> : null}
                                                            </tr>
                                                        )
                                                    })}
                                                    <tr>
                                                        <td colSpan={100} className="horizontal-line"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            }
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>رقم</th>
                                                        <th>تاريخ الأستحقاق</th>
                                                        <th>قيمة</th>
                                                        <th>المصاريف</th>
                                                        <th>قيمة مسدده</th>
                                                        <th>المصاريف المسدده</th>
                                                        <th>الحاله</th>
                                                        <th>تاريخ الحاله</th>
                                                        <th>عدد أيام التأخير / التبكير</th>
                                                    </tr>
                                                    {loan.installments.map((installment, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{installment.idx}</td>
                                                                <td>{timeToArabicDate(new Date(installment.dateOfPayment).valueOf(), false)}</td>
                                                                <td style={{ direction: 'ltr' }}>{Number(installment.instTotal)}</td>
                                                                <td style={{ direction: 'ltr' }}>{installment.feesInstallment}</td>
                                                                <td style={{ direction: 'ltr' }}>{Number(installment.totalPaid)}</td>
                                                                <td style={{ direction: 'ltr' }}>{installment.feesPaid}</td>
                                                                <td>{getStatus(installment)}</td>
                                                                <td>{installment.paidAt ? timeToArabicDate(new Date(installment.paidAt).valueOf(), false) : ''}</td>
                                                                <td>{installment.delay}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                    <tr>
                                                        <td className="borderless" colSpan={2}></td>
                                                        <td>{loan.instTotalDue}</td>
                                                        <td>{loan.feesInstallmentDue}</td>
                                                        <td>{loan.totalPaid}</td>
                                                        <td>{loan.totalFeesPaid}</td>
                                                        <th>رصيد العميل</th>
                                                        <td></td>
                                                        <th>أيام التأخير </th>
                                                        <td>{loan.lateDays}</td>
                                                        <th> أيام التبكير </th>
                                                        <td>{loan.earlyDays}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default CustomerStatusDetails;
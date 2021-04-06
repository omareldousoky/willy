import React, { Component } from 'react'
import './customerCard.scss'
import {
  timeToArabicDate,
  numbersToArabic,
  getStatus,
} from '../../../../Shared/Services/utils'
import { IndividualWithInstallments } from '../../LoanProfile/loanProfile'

interface Props {
  data: any
  branchDetails: any
  penalty: number
  getGeoArea: Function
  remainingTotal: number
  members: IndividualWithInstallments
}
interface State {
  totalDaysLate: number
  totalDaysEarly: number
}
export function roundTo2(value: number) {
  return Math.round(value * 100) / 100
}
class CustomerCardPDF extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      totalDaysLate: 0,
      totalDaysEarly: 0,
    }
  }

  UNSAFE_componentWillMount() {
    let totalDaysLate = 0
    let totalDaysEarly = 0
    this.props.data.installmentsObject.installments.forEach((installment) => {
      if (installment.status !== 'rescheduled') {
        if (installment.paidAt) {
          const number = Math.round(
            (new Date(installment.paidAt).setHours(23, 59, 59, 59) -
              new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
              (1000 * 60 * 60 * 24)
          )
          if (number > 0) {
            totalDaysLate += number
          } else totalDaysEarly += number
        } else {
          const number = Math.round(
            (new Date().setHours(23, 59, 59, 59).valueOf() -
              new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
              (1000 * 60 * 60 * 24)
          )
          if (number > 0) totalDaysLate += number
        }
      }
    })
    this.setState({ totalDaysEarly, totalDaysLate })
  }

  getCode() {
    if (this.props.data.product.beneficiaryType === 'individual')
      return this.props.data.customer.key
    return this.props.data.group.individualsInGroup.find(
      (customer) => customer.type === 'leader'
    ).customer.key
  }

  getSum(key: string) {
    let max = 0
    this.props.data.installmentsObject.installments.forEach((installment) => {
      max += installment[key]
    })
    return max.toFixed(2)
  }

  render() {
    return (
      <div
        className="customer-card-print"
        style={{ direction: 'rtl' }}
        lang="ar"
      >
        <table className="tablestyle" style={{ border: '1px black solid' }}>
          <tbody>
            <tr>
              <th>القسط</th>
              <th>تاريخ الآستحقاق</th>
              <th> قيمة القسط</th>
              <th>تكلفه التمويل</th>
              <th>اجمالي القيمة</th>
              <th>قيمه مسدده</th>
              <th>تكلفه التمويل مسدده</th>
              <th>الحاله</th>
              <th>تاريخ الحاله</th>
              <th>ايام التأخير</th>
              <th style={{ width: '15%' }}>ملاحظات</th>
            </tr>
            {this.props.data.installmentsObject.installments.map(
              (installment) => {
                return (
                  <tr key={installment.id}>
                    <td>
                      {numbersToArabic(this.props.data.applicationKey) +
                        '/' +
                        numbersToArabic(installment.id)}
                    </td>
                    <td>
                      {timeToArabicDate(installment.dateOfPayment, false)}
                    </td>
                    <td>{numbersToArabic(installment.principalInstallment)}</td>
                    <td>{numbersToArabic(installment.feesInstallment)}</td>
                    <td>{numbersToArabic(installment.installmentResponse)}</td>
                    <td>{numbersToArabic(installment.principalPaid)}</td>
                    <td>{numbersToArabic(installment.feesPaid)}</td>
                    <td style={{ minWidth: 100 }}>{getStatus(installment)}</td>
                    <td>
                      {installment.paidAt
                        ? timeToArabicDate(installment.paidAt, false)
                        : ''}
                    </td>
                    <td>
                      {installment.paidAt
                        ? numbersToArabic(
                            Math.round(
                              (new Date(installment.paidAt).setHours(
                                23,
                                59,
                                59,
                                59
                              ) -
                                new Date(installment.dateOfPayment).setHours(
                                  23,
                                  59,
                                  59,
                                  59
                                )) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : new Date().setHours(23, 59, 59, 59).valueOf() >
                            new Date(installment.dateOfPayment).setHours(
                              23,
                              59,
                              59,
                              59
                            ) && installment.status !== 'rescheduled'
                        ? numbersToArabic(
                            Math.round(
                              (new Date().setHours(23, 59, 59, 59).valueOf() -
                                new Date(installment.dateOfPayment).setHours(
                                  23,
                                  59,
                                  59,
                                  59
                                )) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : ''}
                    </td>
                    <td />
                  </tr>
                )
              }
            )}
            <tr>
              <td>الإجمالي</td>
              <td />
              <td>
                {numbersToArabic(
                  this.props.data.installmentsObject.totalInstallments.principal
                )}
              </td>
              <td>
                {numbersToArabic(
                  this.props.data.installmentsObject.totalInstallments.feesSum
                )}
              </td>
              <td>
                {numbersToArabic(
                  this.props.data.installmentsObject.totalInstallments
                    .installmentSum
                )}
              </td>
              <td>{numbersToArabic(this.getSum('principalPaid'))}</td>
              <td>{numbersToArabic(this.getSum('feesPaid'))}</td>
              <th>ايام التأخير</th>
              <td>
                {this.state.totalDaysLate > 0
                  ? numbersToArabic(this.state.totalDaysLate)
                  : numbersToArabic(0)}
              </td>
              <th>ايام التبكير</th>
              <td>
                {numbersToArabic(
                  this.state.totalDaysEarly < 0
                    ? this.state.totalDaysEarly * -1
                    : this.state.totalDaysEarly
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3} style={{ backgroundColor: 'white' }} />
              <th
                colSpan={2}
                style={{ padding: '10px 0', marginRight: '2rem' }}
              >
                رصيد العميل
              </th>
              <td colSpan={2} style={{ padding: '10px 0' }}>
                {numbersToArabic(this.props.remainingTotal)}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="tablestyle" style={{ border: '1px black solid' }}>
          <tbody>
            {this.props.data.product.beneficiaryType === 'individual' &&
            this.props.data.guarantors.length > 0 ? (
              <tr>
                <th>كود الضامن</th>
                <th>اسم الضامن</th>
                <th>المنطقه</th>
                <th>العنوان</th>
                <th>تليفون</th>
              </tr>
            ) : this.props.data.product.beneficiaryType === 'group' ? (
              <tr>
                <th>كود العضو</th>
                <th>اسم العضو</th>
                <th>التمويل</th>
                <th>القسط</th>
                <th>المنطقه</th>
                <th>العنوان</th>
                <th>تليفون</th>
              </tr>
            ) : null}
            {this.props.data.product.beneficiaryType === 'individual' &&
            this.props.data.guarantors.length > 0
              ? this.props.data.guarantors.map((guarantor, index) => {
                  const area = this.props.getGeoArea(guarantor.geoAreaId)
                  return (
                    <tr key={index}>
                      <td>{numbersToArabic(guarantor.key)}</td>
                      <td>{guarantor.customerName}</td>
                      <td
                        style={{
                          color:
                            !area.active && area.name !== '-' ? 'red' : 'black',
                        }}
                      >
                        {area.name}
                      </td>
                      <td>{guarantor.customerHomeAddress}</td>
                      <td>
                        {numbersToArabic(guarantor.mobilePhoneNumber) +
                          '-' +
                          numbersToArabic(guarantor.businessPhoneNumber) +
                          '-' +
                          numbersToArabic(guarantor.homePhoneNumber)}
                      </td>
                    </tr>
                  )
                })
              : this.props.data.product.beneficiaryType === 'group'
              ? this.props.data.group.individualsInGroup.map(
                  (individualInGroup, index) => {
                    const area = this.props.getGeoArea(
                      individualInGroup.customer.geoAreaId
                    )
                    const share = this.props.members.customerTable?.filter(
                      (member) =>
                        member.customer._id === individualInGroup.customer._id
                    )[0].installmentAmount
                    return (
                      <tr key={index}>
                        <td>
                          {numbersToArabic(individualInGroup.customer.key)}
                        </td>
                        <td>{individualInGroup.customer.customerName}</td>
                        <td>{numbersToArabic(individualInGroup.amount)}</td>
                        <td>{numbersToArabic(share)}</td>
                        <td
                          style={{
                            color:
                              !area.active && area.name !== '-'
                                ? 'red'
                                : 'black',
                          }}
                        >
                          {area.name}
                        </td>
                        <td>
                          {individualInGroup.customer.customerHomeAddress}
                        </td>
                        <td>
                          {numbersToArabic(
                            individualInGroup.customer.mobilePhoneNumber
                          ) +
                            '-' +
                            numbersToArabic(
                              individualInGroup.customer.businessPhoneNumber
                            ) +
                            '-' +
                            numbersToArabic(
                              individualInGroup.customer.homePhoneNumber
                            )}
                        </td>
                      </tr>
                    )
                  }
                )
              : null}
          </tbody>
        </table>
        <div style={{ textAlign: 'right' }}>
          <div className="bold frame title2">
            <u>تعليمات خاصه بالسداد</u>
          </div>
        </div>
        <ol>
          <li>
            يتم دفع الاقساط في مواعيدها من خلال خزينة الفرع بايصال رسمي مختوم او
            عبر وسائل الدفع الالكتروني المعتمده من هيئة الرقابه المالية
          </li>
          <li>ممنوع منعا باتا دفع اي مبالغ نقديه للمندوب تحت اي مسمي</li>
          <li>
            الاداره غير مسؤله عن اي مبالغ يتم دفعها لاي شخص بدون ايصال رسمي
            مختوم من خزينة الفرع
          </li>
          {this.props.data.product.beneficiaryType === 'individual' ? (
            <>
              <li>
                يلتزم العميل بسداد غرامه تاخير قدرها ٥% من قيمه القسط في اليوم
                التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي يليه
                كالتالي :
              </li>
              <ul>
                يتم تحصيل ٥ ج عن كل يوم تاخير اذا كان قيمه القسط اقل من ٢٠٠٠ ج .
              </ul>
              <ul>
                {' '}
                ويتم تحصيل ٧٫٥ ج عن كل يوم تاخير اذا كان قيمه القسط يتراوح من
                ٢٠٠٠ ج حتي ٣٠٠٠ ج .
              </ul>
              <ul>
                ويتم تحصيل ١٠ ج عن كل يوم تاخير اذا كان قيمه القسط اكبر من ٣٠٠٠
                ج .
              </ul>
            </>
          ) : (
            <>
              <li>
                تلتزم الأعضاء بسداد غرامه تاخير قدرها ٥% من قيمه القسط في اليوم
                التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي يليه
                كالتالي :
              </li>
              <ul>
                يتم تحصيل ٢ ج عن كل يوم تأخير اذا كان قيمة القسط أقل من ١٥٠٠ ج
              </ul>
              <ul>
                {' '}
                يتم تحصيل ٣ ج عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ١٥٠٠
                ج حتي٢٠٠٠ ج
              </ul>
              <ul>
                تم تحصيل ٤ ج عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠
                جنيها حتي٢٥٠٠ ج
              </ul>
              <ul>
                يتم تحصيل ٥ ج لكل عضوه عن كل يوم تأخير إذا كان قيمة القسط اكبر
                من او يساوي ٢٥٠٠ ج
              </ul>
            </>
          )}
          <li>
            في حالة طلب سداد المديونيه المستحقه يتم خصم تكلفة التمويل للشهر الذي
            يتم فيه السداد مع اضافة عموله سداد معجل ٥٪ من باقي المبلغ المستحق
            (اصل) المراد تعجيل الوفاه به
          </li>
          <li>
            يحق للشركه مطالبه قيمة القرض وكافة تكاليف تمويله في حالة استخدام
            مبلغ القرض في غرض غير استخدامه داخل النشاط او اغلاق النشاط
          </li>
        </ol>
      </div>
    )
  }
}

export default CustomerCardPDF

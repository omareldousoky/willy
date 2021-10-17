import React, { Component } from 'react'
import './customerCard.scss'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  timeToArabicDate,
  numbersToArabic,
  getStatus,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import store from '../../../../Shared/redux/store'
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
  hasFeesInstallment = this.props.data.installmentsObject?.installments.some(
    (installment) => installment.id === 0
  )

  installmentsLength =
    this.props.data.installmentsObject?.installments?.length ?? 0

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
        <table
          style={{
            fontSize: '12px',
            margin: '10px 0px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              <div className="logo-print-tb" />
            </th>
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              {this.props.data.product.type === 'sme'
                ? 'ترخيص ممارسة نشاط تمويل المشروعات المتوسطة والصغيرة رقم ١ لسنه ٢٠٢١'
                : 'ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015'}
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </table>
        <table>
          <tbody>
            <tr>
              <td className="title bold titleborder titlebackground">
                شركة تساهيل للتمويل متناهي الصغر
              </td>
              <td style={{ width: '30%' }} />
              <td className="title bold">
                {this.props.branchDetails.name} -
                {this.props.branchDetails.governorate}
              </td>
            </tr>
            <tr>
              <td />
              <td style={{ fontSize: '8px' }}>{store.getState().auth.name}</td>
            </tr>
            <tr>
              <td>{timeToArabicDateNow(true)}</td>
              <td className="title2 bold">
                <u>كارت العميل</u>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
        <div style={{ marginBottom: '2px' }} className="bold title">
          عميلنا العزيز، برجاء الالتزام بسداد الاقساط حسب الجدول المرفق
        </div>

        <table className="titleborder">
          <tbody>
            <tr>
              <td>
                العميل
                <div className="frame">{numbersToArabic(this.getCode())}</div>
                <div className="frame">
                  {this.props.data.product.beneficiaryType === 'individual'
                    ? this.props.data.customer.customerName ||
                      this.props.data.customer.businessName
                    : this.props.data.group.individualsInGroup.find(
                        (customer) => customer.type === 'leader'
                      ).customer.customerName}
                </div>
              </td>
              <td>
                التاريخ
                <div className="frame">
                  {timeToArabicDate(this.props.data.creationDate, false)}
                </div>
              </td>
              <td>
                المندوب
                <div className="frame">
                  {this.props.data.product.beneficiaryType === 'group'
                    ? this.props.data.group.individualsInGroup.find(
                        (member) => member.type === 'leader'
                      ).customer.representativeName
                    : this.props.data.customer.representativeName}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td>
                قيمة التمويل
                <div className="frame">
                  {numbersToArabic(this.props.data.principal)}
                </div>
              </td>
              <td>
                فترة السداد
                <div className="frame">
                  {this.props.data.product.periodType === 'days'
                    ? local.daily
                    : local.inAdvanceFromMonthly}
                </div>
              </td>
              <td>
                عدد الاقساط
                <div className="frame">
                  {numbersToArabic(
                    this.hasFeesInstallment
                      ? this.installmentsLength - 1
                      : this.installmentsLength
                  )}
                </div>
              </td>
              <td>
                فترة السماح
                <div className="frame">
                  {numbersToArabic(this.props.data.product.gracePeriod)}
                </div>
                <div className="frame">تمويل رأس المال</div>
              </td>
            </tr>
            <tr>
              <td>
                غرامات مسددة
                <div className="frame">
                  {numbersToArabic(this.props.data.penaltiesPaid)}
                </div>
              </td>
              <td>
                غرامات مطلوبة
                <div className="frame">
                  {numbersToArabic(this.props.penalty)}
                </div>
              </td>
              <td>
                غرامات معفاة
                <div className="frame">
                  {numbersToArabic(this.props.data.penaltiesCanceled)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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
        {this.props.data.product.type === 'sme' ? (
          <ol>
            <li>
              يتم دفع الاقساط في مواعيدها من خلال إيداع نقدي أو تحويل بنكي لحساب
              شركة تساهيل للتمويل متناهي الصغر أو عبر أحد وسائل الدفع الالكتروني
              المعتمدة من هيئة الرقابة الماليه مع موافاة الفرع بصورة من المستند
              المؤيد لذلك .
            </li>
            <li>ممنوع منعا باتا دفع اي مبالغ نقديه للمندوب تحت اي مسمي</li>
            <li>
              الادارة غير مسئوله عن أي مبالغ يتم دفعها لاي شخص بدون وجه حق .
            </li>
            <li>
              يلتزم العميل بسداد غرامة تأخير قدرها واحد جنيه عن كل الف جنيه عن
              كل يوم تأخير من قيمة القسط إعتبارا من اليوم التالي لتاريخ
              الاستحقاق .
            </li>
            <li>
              في حالة طلب سداد المديونية المستحقة قبل تاريخ الاستحقاق المتفق
              عليه يتم خصم تكلفة التمويل للشهر الذي يتم فيه السداد مع إضافة
              عمولة سداد معجل 5 % من باقي المبلغ المستحق ( أصل ) المراد التعجيل
              الوفاء به .
            </li>
            <li>
              يحق لشركة تساهيل للتمويل متناهي الصغر المطالبة بقيمة القرض وكافة
              المصروفات تكاليف تمويله في حالة استخدام مبلغ القرض في غرض غير
              إستخدامه داخل النشاط أو إغلاق النشاط .
            </li>
          </ol>
        ) : (
          <ol>
            <li>
              يتم دفع الاقساط في مواعيدها من خلال خزينة الفرع بايصال رسمي مختوم
              او عبر وسائل الدفع الالكتروني المعتمده من هيئة الرقابه المالية
            </li>
            <li>ممنوع منعا باتا دفع اي مبالغ نقديه للمندوب تحت اي مسمي</li>
            <li>
              الاداره غير مسؤله عن اي مبالغ يتم دفعها لاي شخص بدون ايصال رسمي
              مختوم من خزينة الفرع
            </li>
            {this.props.data.product.type === 'nano' ? (
              <li>
                يلتزم العميل بسداد غرامة تأخير قدرها 2 جنيه (فقط اثنان جنيها لا
                غير) عن اليوم الواحد ابتدأ من اليوم التالي لتاريخ استحقاق القسط
              </li>
            ) : this.props.data.product.beneficiaryType === 'individual' ? (
              <>
                <li>
                  يلتزم العميل بسداد غرامه تاخير قدرها ٣% من قيمه القسط في اليوم
                  التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي يليه
                  كالتالي :
                </li>
                <ul>
                  يتم تحصيل ٢ جنيهات عن كل يوم تأخير اذا كان قيمة مبلغ التمويل
                  أقل من ١٠٠٠٠ جنيها
                </ul>
                <ul>
                  يتم تحصيل ٣ جنيهات عن كل يوم تأخير إذا كان قيمة مبلغ التمويل
                  يتراوح من ١٠٠٠٠ جنيها حتي أقل من ١٥٠٠٠ جنيها
                </ul>
                <ul>
                  يتم تحصيل ٤ جنيهات عن كل يوم تأخير إذا كان قيمة مبلغ التمويل
                  يتراوح من ١٥٠٠٠ جنيها حتي أقل من ٢٠٠٠٠ جنيها
                </ul>
                <ul>
                  يتم تحصيل ٥ جنيهات عن كل يوم تأخير إذا كان قيمة مبلغ التمويل
                  يتراوح من ٢٠٠٠٠ جنيها حتي أقل من ٥٠٠٠٠ جنيها
                </ul>
                <ul>
                  يتم تحصيل ١٠ جنيهات عن كل يوم تأخير إذا كان قيمة مبلغ التمويل
                  يتراوح من ٥٠٠٠٠ جنيها حتي أقل من ١٠٠٠٠٠ جنيها
                </ul>
                <ul>
                  يتم تحصيل ١٥ جنيهات عن كل يوم تأخير إذا كان قيمة مبلغ التمويل
                  يتراوح من ١٠٠٠٠٠ جنيها حتي ٢٠٠٠٠٠ جنيها
                </ul>
              </>
            ) : (
              <>
                <li>
                  تلتزم الأعضاء بسداد غرامه تاخير قدرها ٣% من قيمه القسط في
                  اليوم التالي لتاريخ الاستحقاق للقسط , وابتدأ من اليوم الذي
                  يليه كالتالي :
                </li>
                <ul>
                  يتم تحصيل ٢ ج لكل عضوة عن كل يوم تأخير اذا كان قيمة مبلغ
                  التمويل للمجموعة أقل من ١٠٠٠٠ ج
                </ul>
                <ul>
                  يتم تحصيل ٣ ج لكل عضوة عن كل يوم تأخير إذا كان قيمة مبلغ
                  التمويل للمجموعة يتراوح من ١٠٠٠٠ ج حتي أقل من ١٥٠٠٠ ج
                </ul>
                <ul>
                  يتم تحصيل ٤ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ التمويل
                  للمجموعة يتراوح من ١٥٠٠٠ ج حتي أقل من ٢٠٠٠٠ ج
                </ul>
                <ul>
                  يتم تحصيل ٥ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ التمويل
                  للمجموعة يتراوح من ٢٠٠٠٠ ج حتي أقل من ٥٠٠٠٠ ج
                </ul>
                <ul>
                  يتم تحصيل ١٠ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ التمويل
                  للمجموعة يتراوح من ٥٠٠٠٠ ج حتي أقل من ١٠٠٠٠٠ ج
                </ul>
                <ul>
                  يتم تحصيل ١٥ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ التمويل
                  للمجموعة يساوي ١٠٠٠٠٠ ج
                </ul>
              </>
            )}
            <li>
              في حالة طلب سداد المديونيه المستحقه يتم خصم تكلفة التمويل للشهر
              الذي يتم فيه السداد مع اضافة عموله سداد معجل ٥٪ من باقي المبلغ
              المستحق (اصل) المراد تعجيل الوفاه به
            </li>
            <li>
              يحق للشركه مطالبه قيمة القرض وكافة تكاليف تمويله في حالة استخدام
              مبلغ القرض في غرض غير استخدامه داخل النشاط او اغلاق النشاط
            </li>
          </ol>
        )}
      </div>
    )
  }
}

export default CustomerCardPDF

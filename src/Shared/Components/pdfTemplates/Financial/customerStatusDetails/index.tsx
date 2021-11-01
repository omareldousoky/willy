import React from 'react'
import './customerStatusDetails.scss'
import {
  timeToArabicDate,
  currency,
  periodType,
  getStatus,
  getLoanStatus,
  beneficiaryType,
  numbersToArabic,
  arabicGender,
  timeToArabicDateNow,
  guarantorOrderLocal,
  orderLocal,
} from '../../../../Services/utils'
import { CustomerIsBlocked, CustomerStatusLocal } from './types'
import local from '../../../../Assets/ar.json'

export const CustomerStatusDetails = (props) => {
  const {
    BusinessPhoneNumber,
    Comments,
    HomePhoneNumber,
    Loans,
    MobilePhoneNumber,
    accountBranch,
    birthDate,
    customerLegalStatus,
    customerName,
    customerStatus,
    gender,
    nationalId,
    nationalIdIssueDate,
    officerName,
    customerType,
  } = props.data

  const isCompany = customerType === 'company'
  const checkLoanLegalStatus = (loan) => {
    const { isWrittenOff, isDoubtful } = loan

    return isWrittenOff ? '- معدوم' : isDoubtful ? '- مشكوك فيه' : ''
  }

  return (
    <div className="customer-status-details" lang="ar">
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <thead>
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th colSpan={6} style={{ backgroundColor: 'white' }}>
              <div className="logo-print-tb" />
            </th>
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </thead>
      </table>
      <table>
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={3}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th rowSpan={3} colSpan={3}>
              التقرير التفصيلي لحالة العميل
            </th>
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>المركز الرئيسي</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>{timeToArabicDateNow(true)}</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
          <tr>
            <th className="gray frame">الأسم</th>
            <td className="frame">{customerName}</td>
            <th className="gray frame">الكود</th>
            <td className="frame">{numbersToArabic(props.customerKey)}</td>
            <th className="gray frame">الحاله</th>
            <td className="frame">
              {CustomerStatusLocal[customerStatus || 'default']}
            </td>
            <th className="gray frame">حالة التعامل مع العميل</th>
            <td className="frame">
              {CustomerIsBlocked[customerLegalStatus] ||
                CustomerIsBlocked.false}
            </td>
            <td className="frame" />
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="borderless" colSpan={100}>
              {Loans && Loans.length > 0 ? (
                Loans.map((loan, index) => {
                  return (
                    <div key={index} style={{ pageBreakAfter: 'always' }}>
                      <table>
                        <tbody>
                          <tr>
                            <th className="frame gray" colSpan={100}>
                              بيانات {isCompany ? 'الشركة' : 'العميل'}
                            </th>
                          </tr>
                          <tr>
                            <th>الفرع الحالي</th>
                            <td>{accountBranch}</td>
                            <th>نوع الاقتراض</th>
                            <td>{beneficiaryType(loan.beneficiaryType)}</td>
                            <th>المندوب الحالي</th>
                            <td>{officerName}</td>
                          </tr>
                          {!isCompany && (
                            <>
                              <tr>
                                <th>الرقم القومي</th>
                                <td>{numbersToArabic(nationalId)}</td>
                                <th>بتاريخ</th>
                                <td>
                                  {timeToArabicDate(nationalIdIssueDate, false)}
                                </td>
                                <th>النوع</th>
                                <td>{arabicGender(gender)}</td>
                              </tr>
                              <tr>
                                <th>تاريخ الميلاد</th>
                                <td>{timeToArabicDate(birthDate, false)}</td>
                                <th>البطاقه</th>
                                <td>{numbersToArabic(nationalId)}</td>
                                <th>صادره من</th>
                                <td />
                              </tr>
                              <tr>
                                <th>الموبيل</th>
                                <td>
                                  {numbersToArabic(MobilePhoneNumber) || ''}
                                </td>
                                <th>تليفون المنزل</th>
                                <td>
                                  {numbersToArabic(HomePhoneNumber) || ''}
                                </td>
                                <th>تليفون العمل</th>
                                <td>
                                  {numbersToArabic(BusinessPhoneNumber) || ''}
                                </td>
                              </tr>
                            </>
                          )}
                          <tr>
                            <th>ملاحظات</th>
                            <td colSpan={3}>{Comments || ''}</td>
                          </tr>
                          <tr>
                            <td colSpan={100} className="horizontal-line" />
                          </tr>
                        </tbody>
                      </table>
                      <table>
                        <tbody>
                          <tr>
                            <th className="frame gray" colSpan={100}>
                              بيانات القرض
                            </th>
                          </tr>
                          <tr>
                            <th>رقم القرض</th>
                            <td>{numbersToArabic(loan.idx)}</td>
                            <th>تاريخ القرض</th>
                            <td>
                              {timeToArabicDate(loan.creationDate, false)}
                            </td>
                            <th>القيمة</th>
                            <td>{numbersToArabic(loan.principal)}</td>
                            <th>العمله</th>
                            <td>{currency(loan.currency)}</td>
                            <th>رسوم الطوابع</th>
                            <td>{numbersToArabic(loan.stamps)}</td>
                          </tr>
                          <tr>
                            <th>رسوم طلب القرض</th>
                            <td>{numbersToArabic(loan.applicationFees)}</td>
                            <th>عدد الأقساط</th>
                            <td>{numbersToArabic(loan.numInst)}</td>
                            <th>فترة السداد</th>
                            <td>{`${numbersToArabic(
                              loan.periodLength,
                              false
                            )}  ${periodType(loan.periodType)}`}</td>
                            <th>فترة السماح</th>
                            <td>{numbersToArabic(loan.gracePeriod)}</td>
                            <th>عمولة المندوب</th>
                            <td>{numbersToArabic(loan.representativeFees)}</td>
                          </tr>
                          <tr>
                            <th>تكلفه التمويل القسط</th>
                            <td>{numbersToArabic(loan.feesInstallment)}</td>
                            <th>تكلفه التمويل الموزعه</th>
                            <td>
                              {numbersToArabic(loan.interest, false)} % سنويا
                            </td>
                            <th>تكلفه التمويل المقدمه</th>
                            <td colSpan={5}>
                              0% من القرض - قيمة مستقله لا تستقطع من تكلفه
                              التمويل الموزعه
                            </td>
                          </tr>
                          <tr>
                            <th>مندوب التنميه الحالي</th>
                            <td colSpan={2}>{loan.representativeName}</td>
                          </tr>
                          <tr>
                            <th>حالة القرض</th>
                            <td>{`${getLoanStatus(
                              loan.status
                            )} ${checkLoanLegalStatus(loan)}`}</td>
                            <th>غرامات مسدده</th>
                            <td>
                              {loan.penaltiesPaid === 'None'
                                ? ''
                                : numbersToArabic(loan.penaltiesPaid)}
                            </td>
                            <th>غرامات معفاه</th>
                            <td>
                              {loan.penaltiesCanceled === 'None'
                                ? ''
                                : numbersToArabic(loan.penaltiesCanceled)}
                            </td>
                            <th>غرامات مستحقه</th>
                            <td>
                              {loan.penalties === 'None'
                                ? ''
                                : numbersToArabic(loan.penalties)}
                            </td>
                          </tr>
                          {loan.rejectionReason !== 'None' ? (
                            <tr>
                              <th>سبب الإلغاء</th>
                              <td>{loan.rejectionReason}</td>
                              <td>مندوب التنميه السابق</td>
                              <td>
                                {loan.prevRepName
                                  ? loan.prevRepName
                                  : loan.representativeName
                                  ? loan.representativeName
                                  : ''}
                              </td>
                            </tr>
                          ) : null}
                          <tr>
                            <th>طريقة الحساب</th>
                            <td>{loan.calculationFormulaName}</td>
                          </tr>
                          <tr>
                            <td colSpan={100} className="horizontal-line" />
                          </tr>
                        </tbody>
                      </table>

                      {loan.beneficiaryType === 'individual' && (
                        <div className="d-flex flex-wrap">
                          {loan.guarantors.length > 0 &&
                            Object.keys(loan.guarantors[0]).length > 0 &&
                            loan.guarantors.map((guarantor, guarantorIndex) => {
                              // TODO: change check on adding `type` key
                              const isCompanyGuarantor = !guarantor?.gender
                              return (
                                <table
                                  key={guarantorIndex}
                                  className={`${
                                    loan.guarantors.length > 1 ? 'multi-tb' : ''
                                  }`}
                                >
                                  <thead>
                                    <tr>
                                      <th className="frame gray" colSpan={100}>
                                        {
                                          guarantorOrderLocal[
                                            guarantorIndex > 10
                                              ? 'default'
                                              : guarantorIndex
                                          ]
                                        }
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>الاسم</th>
                                      <td>{guarantor.customerName}</td>
                                      {!isCompanyGuarantor && (
                                        <>
                                          <th>النوع</th>
                                          <td>
                                            {arabicGender(guarantor.gender)}
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                    {isCompanyGuarantor ? (
                                      <>
                                        <tr>
                                          <th>البطاقة الضريبية</th>
                                          <td>
                                            {numbersToArabic(
                                              guarantor?.taxCardNumber ?? 0
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>السجل التجاري</th>
                                          <td>
                                            {numbersToArabic(
                                              guarantor?.commercialRegisterNumber ??
                                                0
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    ) : (
                                      <>
                                        <tr>
                                          <th>الرقم القومي</th>
                                          <td>
                                            {numbersToArabic(
                                              guarantor?.nationalId
                                            )}
                                          </td>
                                          <th>تاريخ الأصدار</th>
                                          <td>
                                            {guarantor.nationalIdIssueDate
                                              ? timeToArabicDate(
                                                  guarantor.nationalIdIssueDate,
                                                  false
                                                )
                                              : ''}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>تاريخ الميلاد</th>
                                          <td>
                                            {guarantor.birthDate
                                              ? timeToArabicDate(
                                                  guarantor.birthDate,
                                                  false
                                                )
                                              : ''}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>العنوان</th>
                                          <td>
                                            {guarantor.customerHomeAddress}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>التليفون</th>
                                          <td>
                                            {numbersToArabic(
                                              guarantor.mobilePhoneNumber
                                            )}
                                          </td>
                                          <th>الرقم البريدي</th>
                                          <td>
                                            {numbersToArabic(
                                              guarantor.homePostalCode
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>البطاقه صادره من</th>
                                          <td />
                                          <th>الرقم المطبوع</th>
                                          <td />
                                        </tr>
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              )
                            })}
                        </div>
                      )}

                      {loan.beneficiaryType === 'individual' && (
                        <div className="d-flex flex-wrap">
                          {loan.entitled.length > 0 &&
                            Object.keys(loan.entitled[0]).length > 0 &&
                            loan.entitled.map((entitled, entitledIndex) => {
                              return (
                                <table
                                  key={entitledIndex}
                                  className={`${
                                    loan.entitled.length > 1 ? 'multi-tb' : ''
                                  }`}
                                >
                                  <thead>
                                    <tr>
                                      <th className="frame gray" colSpan={100}>
                                        {local.entitledToSign}&nbsp; (
                                        {
                                          orderLocal[
                                            entitledIndex > 10
                                              ? 'default'
                                              : entitledIndex
                                          ]
                                        }
                                        )
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>الاسم</th>
                                      <td>{entitled.customerName}</td>
                                      <th>النوع</th>
                                      <td>{arabicGender(entitled.gender)}</td>
                                    </tr>
                                    <tr>
                                      <th>الرقم القومي</th>
                                      <td>
                                        {numbersToArabic(entitled?.nationalId)}
                                      </td>
                                      <th>تاريخ الإصدار</th>
                                      <td>
                                        {entitled.nationalIdIssueDate
                                          ? timeToArabicDate(
                                              entitled.nationalIdIssueDate,
                                              false
                                            )
                                          : ''}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>تاريخ الميلاد</th>
                                      <td>
                                        {entitled.birthDate
                                          ? timeToArabicDate(
                                              entitled.birthDate,
                                              false
                                            )
                                          : ''}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>العنوان</th>
                                      <td>{entitled.customerHomeAddress}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              )
                            })}
                        </div>
                      )}

                      {loan.beneficiaryType === 'group' && (
                        <table>
                          <tbody>
                            <tr>
                              <th className="frame gray" colSpan={100}>
                                اسماء اعضاء المجموعه لهذا القرض
                              </th>
                            </tr>
                            <tr>
                              <th>كود العضو</th>
                              <th>أسم العضو</th>
                              <th>حصة العضو من القرض</th>
                              <th />
                            </tr>
                            {loan.groupMembers.map((member, memberIndex) => {
                              return (
                                <tr key={memberIndex}>
                                  <td>{numbersToArabic(member.key)}</td>
                                  <td>{member.customerName}</td>
                                  <td>{numbersToArabic(member.amount)}</td>
                                  {member.type === 'leader' ? (
                                    <td>رئيس المجموعه</td>
                                  ) : null}
                                </tr>
                              )
                            })}
                            <tr>
                              <td colSpan={100} className="horizontal-line" />
                            </tr>
                          </tbody>
                        </table>
                      )}
                      <table>
                        <tbody>
                          <tr>
                            <th>رقم</th>
                            <th>تاريخ الأستحقاق</th>
                            <th>قيمة</th>
                            <th>تكلفه التمويل</th>
                            <th>قيمة مسدده</th>
                            <th>تكلفه التمويل المسدده</th>
                            <th>الحاله</th>
                            <th>تاريخ الحاله</th>
                            <th>عدد أيام التأخير / التبكير</th>
                          </tr>
                          {loan.installments.map(
                            (installment, installmentIndex) => {
                              if (installment.instTotal)
                                return (
                                  <tr key={installmentIndex}>
                                    <td>{numbersToArabic(installment.idx)} </td>
                                    <td>
                                      {installment.dateOfPayment
                                        ? timeToArabicDate(
                                            new Date(
                                              installment.dateOfPayment
                                            ).valueOf(),
                                            false
                                          )
                                        : ''}
                                    </td>
                                    <td>
                                      {numbersToArabic(installment.instTotal)}
                                    </td>
                                    <td>
                                      {numbersToArabic(
                                        installment.feesInstallment
                                      )}
                                    </td>
                                    <td>
                                      {numbersToArabic(installment.totalPaid)}
                                    </td>
                                    <td>
                                      {numbersToArabic(installment.feesPaid)}
                                    </td>
                                    <td>{getStatus(installment)}</td>
                                    <td>
                                      {installment.paidAt
                                        ? timeToArabicDate(
                                            new Date(
                                              installment.paidAt
                                            ).valueOf(),
                                            false
                                          )
                                        : ''}
                                    </td>
                                    <td>
                                      {numbersToArabic(installment.delay)}
                                    </td>
                                  </tr>
                                )
                            }
                          )}
                          <tr>
                            <td className="borderless" colSpan={2} />
                            <td>{numbersToArabic(loan.instTotalDue)}</td>
                            <td>{numbersToArabic(loan.feesInstallmentDue)}</td>
                            <td>{numbersToArabic(loan.totalPaid)}</td>
                            <td>{numbersToArabic(loan.totalFeesPaid)}</td>
                            <th>رصيد العميل</th>
                            <td>
                              {loan.status === 'pending' ||
                              loan.status === 'issued'
                                ? numbersToArabic(props.data.remainingTotal)
                                : 0}
                            </td>
                            <th>أيام التأخير </th>
                            <td>{numbersToArabic(loan.lateDays)}</td>
                            <th> أيام التبكير </th>
                            <td>{numbersToArabic(loan.earlyDays)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                })
              ) : (
                <table>
                  <tbody>
                    <tr>
                      <th className="frame gray" colSpan={100}>
                        بيانات العميل
                      </th>
                    </tr>
                    <tr>
                      <th>الفرع الحالي</th>
                      <td>{accountBranch}</td>
                      <th>المندوب الحالي</th>
                      <td>{officerName}</td>
                    </tr>
                    <tr>
                      <th>الرقم القومي</th>
                      <td>{numbersToArabic(nationalId)}</td>
                      <th>بتاريخ</th>
                      <td>{timeToArabicDate(nationalIdIssueDate, false)}</td>
                      <th>النوع</th>
                      <td>{arabicGender(gender)}</td>
                    </tr>
                    <tr>
                      <th>تاريخ الميلاد</th>
                      <td>{timeToArabicDate(birthDate, false)}</td>
                      <th>البطاقه</th>
                      <td>{numbersToArabic(nationalId)}</td>
                      <th>صادره من</th>
                      <td />
                    </tr>
                    <tr>
                      <th>الموبيل</th>
                      <td>{numbersToArabic(MobilePhoneNumber) || ''}</td>
                      <th>تليفون المنزل</th>
                      <td>{numbersToArabic(HomePhoneNumber) || ''}</td>
                      <th>تليفون العمل</th>
                      <td>{numbersToArabic(BusinessPhoneNumber) || ''}</td>
                    </tr>
                    <tr>
                      <th>ملاحظات</th>
                      <td colSpan={3}>{Comments || ''}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

import React from 'react'
import './loanApplicationDetails.scss'
import * as local from '../../../../Assets/ar.json'
import {
  beneficiaryType,
  arabicGender,
  currency,
  interestPeriod,
  periodType,
  timeToArabicDateNow,
  guarantorOrderLocal,
  numbersToArabic,
  orderLocal,
  timeToArabicDate,
} from '../../../../Services/utils'

export const LoanApplicationDetails = (props) => {
  const getStatus = (status: string) => {
    switch (status) {
      case 'unpaid':
        return local.unpaid
      case 'pending':
        return local.pending
      case 'paid':
        return local.paid
      case 'partiallyPaid':
        return local.partiallyPaid
      case 'rescheduled':
        return local.rescheduled
      case 'cancelled':
      case 'canceled':
        return local.cancelled
      case 'issued':
        return local.issued
      case 'created':
        return local.created
      case 'approved':
        return local.approved
      case 'underReview':
        return local.underReview
      case 'reviewed':
        return local.reviewed
      case 'rejected':
        return local.rejected
      case 'secondReview':
        return local.secondReviewed
      case 'thirdReview':
        return local.thirdReviewed
      default:
        return ''
    }
  }

  const { customerType } = props.data
  const isCompany = customerType === 'company'

  return (
    <div className="loan-application-details" lang="ar">
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <tbody>
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th colSpan={6}>
              <div className="logo-print-tb" />
            </th>
            <th colSpan={6}>
              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </tbody>
      </table>
      {props.data.loans ? (
        props.data.loans.map((loan, index) => {
          return (
            <div className="loan-application-details" lang="ar" key={index}>
              <table className="report-container">
                <thead className="report-header">
                  <tr className="headtitle">
                    <th>شركة تساهيل للتمويل متناهي الصغر</th>
                    <th>{props.customerBranchName}</th>
                  </tr>
                  <tr className="headtitle">
                    <th>{props.customerBranchName}</th>
                    <th rowSpan={2}>تفاصيل طلب القرض</th>
                  </tr>
                  <tr className="headtitle">
                    <th>{timeToArabicDateNow(true)}</th>
                  </tr>
                </thead>
              </table>
              <table>
                <tbody>
                  <tr>
                    <th>كود طلب القرض</th>
                    <td>{loan.applicationKey}</td>
                    {/*  <td></td> */}
                    <th>حالة طلب القرض</th>
                    {getStatus(loan.reviewStatus) ? (
                      <td>{getStatus(loan.reviewStatus)}</td>
                    ) : null}
                    {getStatus(loan.approvalStatus) ? (
                      <td>{getStatus(loan.approvalStatus)}</td>
                    ) : null}
                    {getStatus(loan.creationStatus) ? (
                      <td>{getStatus(loan.creationStatus)}</td>
                    ) : null}
                    {getStatus(loan.status) ? (
                      <td>{getStatus(loan.status)}</td>
                    ) : null}
                  </tr>
                  <tr>
                    <th>إسم الطالب</th>
                    <td>{props.data.customerName}</td>
                  </tr>
                  <tr>
                    <th>نوع الأقتراض</th>
                    <td>{beneficiaryType(loan.beneficiaryType)}</td>
                    <th>المندوب الحالي</th>
                    <td>
                      {loan.officerName === 'None' ? '' : loan.officerName}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th className="frame gray" colSpan={100}>
                      بيانات {isCompany ? 'الشركة' : 'العميل'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isCompany ? (
                    <>
                      <tr>
                        <th>البطاقة الضريبية</th>
                        <td>{numbersToArabic(props.data.taxCardNumber)}</td>
                        <th>السجل التجاري</th>
                        <td>
                          {numbersToArabic(props.data.commercialRegisterNumber)}
                        </td>
                      </tr>
                      <tr>
                        <th>العنوان</th>
                        <td>{props.data.customerHomeAddress}</td>
                        <th>السمه التجاريه</th>
                        <td>{props.data.businessCharacteristic}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <th>الرقم القومي</th>
                        <td>{numbersToArabic(props.data.nationalId)}</td>
                        <th>فاكس رقم</th>
                      </tr>
                      <tr>
                        <th>العنوان</th>
                        <td>{props.data.customerHomeAddress}</td>
                        <th>النوع</th>
                        <td>{arabicGender(props.data.customerGender)}</td>
                      </tr>
                      <tr>
                        <th>تاريخ الميلاد</th>
                        <td>{props.data.customerBirthDate}</td>
                        <th>التليفون</th>
                        <td>
                          {props.data.customerWorkPhone === 'None'
                            ? props.data.homePhoneNumber === 'None'
                              ? ''
                              : props.data.homePhoneNumber
                            : props.data.customerWorkPhone}
                        </td>
                      </tr>
                      <tr>
                        <th>تاريخ الاصدار</th>
                        <td>
                          {props.data.nationalIdIssueDate
                            ? timeToArabicDate(
                                props.data.nationalIdIssueDate,
                                false
                              )
                            : ''}
                        </td>
                        <th>الرقم البريدي</th>
                      </tr>
                      <tr>
                        <th>البريد الالكتروني</th>
                      </tr>
                      <tr>
                        <th>تليفون محمول</th>
                        <td>
                          {(props.data.mobilePhoneNumber
                            ? props.data.mobilePhoneNumber
                            : '') +
                            ' - ' +
                            (props.data.homePhoneNumber
                              ? props.data.homePhoneNumber
                              : '')}
                        </td>
                      </tr>
                      <tr>
                        <th>الموقع الالكتروني</th>
                      </tr>
                    </>
                  )}
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
              </table>

              {!isCompany && (
                <table>
                  <thead>
                    <tr>
                      <th className="frame gray" colSpan={100}>
                        بيانات العمل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>اسم المنشأه</th>
                      <td>{props.data.customerWorkName}</td>
                      <th>تليفون العمل</th>
                      <td>
                        {props.data.customerWorkPhone === 'None'
                          ? ''
                          : props.data.customerWorkPhone}
                      </td>
                    </tr>
                    <tr>
                      <th>رقم الرخصه</th>
                      <td />
                      <th>منطقة العمل</th>
                      <td>{props.data.customerGeo}</td>
                    </tr>
                    <tr>
                      <th>عمال دائمين</th>
                      <td>0</td>
                      <th>عمال مؤقتين</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th>مكان الترخيص</th>
                      <td />
                      <th>الرقم البريدي</th>
                      <td />
                    </tr>
                    <tr>
                      <th>تاريخ الترخيص</th>
                      <td />
                      <th>بطاقه ضريبيه</th>
                      <td />
                    </tr>
                    <tr>
                      <th>العنوان</th>
                      <td>{props.data.customerWorkAddress}</td>
                      <th>السجل التجارى</th>
                      <td />
                    </tr>
                    <tr>
                      <th>قطاع العمل والنشاط والتخصص</th>
                      <td>{props.data.customerActivity}</td>
                      <th>السجل الصناعي</th>
                      <td />
                    </tr>
                    <tr>
                      <th colSpan={100} className="horizontal-line" />
                    </tr>
                  </tbody>
                </table>
              )}

              <table>
                <thead>
                  <tr>
                    <th className="frame gray" colSpan={100}>
                      بيانات القرض المطلوب
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>مصدر التمويل</th>
                    <td>تساهيل للتمويل متناهى الصغر</td>
                    <th>العمله</th>
                    <td>{currency(loan.currency)}</td>
                    <th>تاريخ الإدخال</th>
                    <td>{loan.entryDate}</td>
                  </tr>
                  <tr>
                    <th>نوع القرض</th>
                    <td>{loan.loanType}</td>
                    <th>القيمه الموافق عليها</th>
                    <td>{loan.principal}</td>
                    <th>رسوم الطوابع</th>
                    <td>{loan.stamps}</td>
                  </tr>
                  <tr>
                    <th>قيمة القرض</th>
                    <td>{loan.principal}</td>
                    <th>عدد الأقساط</th>
                    <td>{loan.numInst}</td>
                    <th>عمولة المندوب</th>
                    <td>{loan.representativeFees}</td>
                  </tr>
                  <tr>
                    <th>طريقة الحساب</th>
                    <td>{loan.calculationFormula}</td>
                    <th>فترة السماح</th>
                    <td>{loan.gracePeriod}</td>
                    <th>ايام الترحيل</th>
                    <td>0</td>
                  </tr>

                  <tr>
                    <td colSpan={100}>
                      <table>
                        <thead>
                          <tr>
                            <th className="frame gray" colSpan={100}>
                              رسوم طلب القرض
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>قيمه</th>
                            <td>{loan.applicationFees}</td>
                            <th>حصة العضو</th>
                            <td>{loan.individualApplicationFee}</td>
                            <th>نسبه من قيمة القرض</th>
                            <td>{loan.applicationFeesPerc}</td>
                            <th>نسبة حصة العضو من قيمة القرض</th>
                            <td>{loan.applicationFeePercentPerPerson}</td>
                            <th>القيمة الكامله</th>
                            <td>{loan.applicationFeesPaid}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <th>فترة السداد كل</th>
                    <td>
                      {loan.periodLength} {periodType(loan.periodType)}
                    </td>
                    <th>حساب السداد</th>
                    <td />
                    <th>تكلفه تمويل إداريه القسط</th>
                    <td>{loan.adminFees}</td>
                  </tr>

                  <tr>
                    <th>تكلفه التمويل الموزعه</th>
                    <td>
                      {loan.productInterest}%
                      {interestPeriod(loan.interestPeriod)}
                    </td>
                    <th>تكلفه التمويل المقدمه</th>
                    <td>
                      {loan.inAdvanceFees}% من القرض - قيمة مستقله لا تستقطع من
                      تكلفه التمويل الموزعه
                    </td>
                  </tr>

                  <tr>
                    <th>الأستخدام</th>
                    <td>{loan.loanUsage}</td>
                    <th>حساب الإصدار</th>
                  </tr>
                  <tr>
                    <th>حساب التجميد</th>
                  </tr>
                  <tr>
                    <th>نائب مدير ميداني</th>
                    <td />
                    <th>تاريخ الزيارة</th>
                    <td>{loan.visitationDate}</td>
                  </tr>

                  <tr>
                    <th>مدير الفرع</th>
                    <td>{loan.mgrName}</td>
                    <th>تاريخ زيارة مدير الفرع</th>
                    <td>{loan.mgrVisitationDate}</td>
                  </tr>

                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
              </table>

              <div className="d-flex flex-wrap">
                {loan.beneficiaryType === 'individual' &&
                  loan.guarantors &&
                  loan.guarantors.length > 0 &&
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
                                    guarantor?.commercialRegisterNumber ?? 0
                                  )}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr>
                                <th>الرقم القومي</th>
                                <td>{numbersToArabic(guarantor.nationalId)}</td>
                                <th>تاريخ الإصدار</th>
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
                                <th>النوع</th>
                                <td>{arabicGender(guarantor.gender)}</td>
                                <th>تاريخ الميلاد</th>
                                <td>
                                  {guarantor.customerBirthDate
                                    ? timeToArabicDate(
                                        guarantor.customerBirthDate,
                                        false
                                      )
                                    : ''}
                                </td>
                              </tr>
                              <tr>
                                <th>التليفون</th>
                                <td>{`${
                                  guarantor.homePhoneNumber
                                    ? guarantor.homePhoneNumber
                                    : ''
                                } ${
                                  guarantor.mobilePhoneNumber
                                    ? ` - ${guarantor.mobilePhoneNumber}`
                                    : ''
                                }`}</td>
                                <th>الرقم البريدي</th>
                                <td>{guarantor.homePostalCode}</td>
                              </tr>
                              <tr>
                                <th>العنوان</th>
                                <td>{guarantor.customerHomeAddress}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    )
                  })}

                {loan.beneficiaryType === 'individual' &&
                  loan.entitled &&
                  loan.entitled.length > 0 &&
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
                                  entitledIndex > 10 ? 'default' : entitledIndex
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
                          </tr>
                          <tr>
                            <th>الرقم القومي</th>
                            <td>{numbersToArabic(entitled.nationalId)}</td>
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
                            <th>النوع</th>
                            <td>{arabicGender(entitled.gender)}</td>
                            <th>تاريخ الميلاد</th>
                            <td>
                              {entitled.customerBirthDate
                                ? timeToArabicDate(
                                    entitled.customerBirthDate,
                                    false
                                  )
                                : ''}
                            </td>
                          </tr>
                          <tr>
                            <th>التليفون</th>
                            <td>{`${
                              entitled.homePhoneNumber
                                ? entitled.homePhoneNumber
                                : ''
                            } ${
                              entitled.mobilePhoneNumber
                                ? ` - ${entitled.mobilePhoneNumber}`
                                : ''
                            }`}</td>
                          </tr>
                          <tr>
                            <th>العنوان</th>
                            <td>{entitled.customerHomeAddress}</td>
                          </tr>
                        </tbody>
                      </table>
                    )
                  })}

                {loan.beneficiaryType === 'group' &&
                  loan.members &&
                  loan.members.map((member, memberIndex) => {
                    return (
                      <table
                        key={memberIndex}
                        className={`${
                          loan.members.length > 1 ? 'multi-tb' : ''
                        }`}
                      >
                        <thead>
                          <tr>
                            <th className="frame gray" colSpan={100}>
                              عضو المجموعة
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>الاسم</th>
                            <td>{member.customerName}</td>
                          </tr>
                          <tr>
                            <th>الرقم القومي</th>
                            <td>{numbersToArabic(member.nationalId)}</td>
                          </tr>
                          <tr>
                            <th>النوع</th>
                            <td>{arabicGender(member.gender)}</td>
                          </tr>
                          <tr>
                            <th>تاريخ الميلاد</th>
                            <td>
                              {member.customerBirthDate
                                ? timeToArabicDate(
                                    member.customerBirthDate,
                                    false
                                  )
                                : ''}
                            </td>
                          </tr>
                          <tr>
                            <th>التليفون</th>
                            <td>
                              {member.homePhoneNumber + member.mobilePhoneNumber
                                ? ` - ${member.mobilePhoneNumber}`
                                : ''}
                            </td>
                          </tr>
                          <tr>
                            <th>الرقم البريدي</th>
                            <td>{member.homePostalCode}</td>
                          </tr>
                          <tr>
                            <th>العنوان</th>
                            <td>{member.customerHomeAddress}</td>
                          </tr>
                          <tr>
                            <th>قطاع العمل</th>
                            <td>{member.businessSector}</td>
                          </tr>
                          <tr>
                            <th>النشاط</th>
                            <td>{member.businessActivity}</td>
                          </tr>
                          <tr>
                            <th>التخصص</th>
                            <td>{member.businessSpecialty}</td>
                          </tr>
                          <tr>
                            <th>حصة العضو من قيمة القرض</th>
                            <td>{numbersToArabic(member.amount)}</td>
                          </tr>
                          <tr>
                            <th>تاريخ الإصدار</th>
                            <td>
                              {member.nationalIdIssueDate
                                ? timeToArabicDate(
                                    member.nationalIdIssueDate,
                                    false
                                  )
                                : ''}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )
                  })}
              </div>
            </div>
          )
        })
      ) : (
        <h1 style={{ textAlign: 'right' }}>هذا العميل ليس لديه قروض </h1>
      )}
    </div>
  )
}

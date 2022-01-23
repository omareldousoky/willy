import React from 'react'
import { Header } from '../pdfTemplateCommon/header'

import './index.scss'
import { MonthlyAnalysisReportProps } from './types'

const MonthlyAnalysisReport = ({
  monthlyAnalysis1,
  monthlyAnalysis2,
  monthlyAnalysis2Members,
}: MonthlyAnalysisReportProps) => {
  const renderValue = (value) => value || 0

  return (
    <div id="monthlyAnalysisReport">
      <table>
        <Header
          title="تقرير التحليل الشهرى"
          showCurrentUser={false}
          showCurrentTime={false}
        />
      </table>

      <table>
        <tbody>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
          <tr>
            <th>مصدر التمويل</th>
            <td className="frame gray">إجمالى لجميع مصادر التمويل</td>
            <th>نوع الاقتراض</th>
            <td className="frame gray">إجمالى لجميع أنواع الإقتراض</td>
          </tr>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
          <tr>
            <th>
              <u>اسم العملة</u>
            </th>
            <td className="frame gray">
              ملخص لجميع العملات محولة الى العملة الرئيسية
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td />
            <td />
            <td>جديد</td>
            <td>تجديد</td>
            <td>اجمالى</td>
            <td>الأعضاء</td>
            <td>عدد القروض المشطوبة</td>
            <td>{renderValue(monthlyAnalysis1.writtenOffLoans)}</td>
          </tr>
          <tr>
            <td>منذ بدء النشاط</td>
            <td>عدد القروض المصدرة</td>
            <td>{renderValue(monthlyAnalysis1.newIssuedLoansLifetime)}</td>
            <td>{renderValue(monthlyAnalysis1.renewalIssuedLoansLifetime)}</td>
            <td>{renderValue(monthlyAnalysis1.totalIssuedLoansLifetime)}</td>
            <td>{renderValue(monthlyAnalysis1.membersLifetime)}</td>
            <td>قيمة القروض المشطوبة - أصل</td>
            <td>{renderValue(monthlyAnalysis1.writtenOffLoansPrincipal)}</td>
          </tr>
          <tr>
            <td />
            <td>قيمة القروض المصدرة</td>
            <td>
              {renderValue(monthlyAnalysis1.newIssuedLoansLifetimePrincipals)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis1.renewalIssuedLoansLifetimePrincipals
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis1.totalIssuedLoansLifetimePrincipals)}
            </td>
            <td />
            <td>القيمة المسددة - اصل فقط - قبل شطب القرض</td>
            <td>{renderValue(monthlyAnalysis1.paidBeforeWrittenOff)}</td>
          </tr>
          <tr>
            <td>الشهر الحالى</td>
            <td>عدد القروض المصدرة</td>
            <td>{renderValue(monthlyAnalysis1.newIssuedLoans)}</td>
            <td>{renderValue(monthlyAnalysis1.renewalIssuedLoans)}</td>
            <td>{renderValue(monthlyAnalysis1.totalIssuedLoans)}</td>
            <td>{renderValue(monthlyAnalysis1.members)}</td>
            <td>القيمة المسددة - اصل فقط - بعد شطب القرض</td>
            <td>{renderValue(monthlyAnalysis1.paidAfterWrittenOff)}</td>
          </tr>
          <tr>
            <td />
            <td>قيمة القروض المصدرة</td>
            <td>{renderValue(monthlyAnalysis1.newIssuedLoansPrincipals)}</td>
            <td>
              {renderValue(monthlyAnalysis1.renewalIssuedLoansPrincipals)}
            </td>
            <td>{renderValue(monthlyAnalysis1.totalIssuedLoansPrincipals)}</td>
          </tr>
          <tr>
            <td colSpan={100}>
              <u>القروض المصدرة فى فترات سابقة وألغيت فى هذه الفترة</u>
            </td>
          </tr>
          <tr>
            <td />
            <td>عدد القروض</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td />
            <td>قيمة القروض</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>اجمالى عدد العملاء المعرفين بالنظام</td>
            <td>{renderValue(monthlyAnalysis1.allSystemCustomers)}</td>
            <td>متوسط عدد العملاء الذين لديهم قروض للمندوب</td>
            <td>
              {renderValue(monthlyAnalysis1.averageCustomersWithLoanPerOfficer)}{' '}
              (الأعضاء{' '}
              {renderValue(
                monthlyAnalysis1.memberActiveLoanCustomers /
                  monthlyAnalysis1.IssuedLoanOfficers
              )}
              )
            </td>
          </tr>
          <tr>
            <td>عدد العملاء الذين اخذوا قروض بالفعل</td>
            <td>
              {renderValue(monthlyAnalysis1.customersTookLoans)} (الأعضاء{' '}
              {renderValue(monthlyAnalysis1.memberCustomersTookLoans)})
            </td>
            <td>متوسط عدد القروض للمندوب هذا الشهر</td>
            <td>{renderValue(monthlyAnalysis1.averageLoansPerOfficer)}</td>
          </tr>
          <tr>
            <td>عدد العملاء الذين لديهم قروض مفتوحة</td>
            <td>
              {renderValue(monthlyAnalysis1.activeLoanCustomers)} (الأعضاء{' '}
              {renderValue(monthlyAnalysis1.memberActiveLoanCustomers)})
            </td>
            <td>متوسط عدد القروض الجديدة للمندوب هذا الشهر</td>
            <td>{renderValue(monthlyAnalysis1.averageNewLoansPerOfficer)}</td>
          </tr>
          <tr>
            <td>
              عدد المندوبين الذين أصدرت لهم قروض من هذا النوع منذ بدء النشاط
            </td>
            <td>{renderValue(monthlyAnalysis1.totalIssuedLoanOfficers)}</td>
            <td>متوسط عدد قروض التجديد للمندوب هذا الشهر</td>
            <td>
              {renderValue(monthlyAnalysis1.averageRenewalLoansPerOfficer)}
            </td>
          </tr>
          <tr>
            <td>عدد المندوبين الذين اصدرت لهم قروض الشهر الحالى</td>
            <td>{renderValue(monthlyAnalysis1.IssuedLoanOfficers)}</td>
            <td>متوسط حجم القرض</td>
            <td>{renderValue(monthlyAnalysis1.averageLoanPrincipal)}</td>
          </tr>

          <tr>
            <td>عدد المندوبين الذكور الذين اصدرت لهم قروض الشهر الحالى</td>
            <td>{renderValue(monthlyAnalysis1.maleIssuedLoanOfficers)}</td>
            <td>متوسط حجم القرض - جديد</td>
            <td>{renderValue(monthlyAnalysis1.averageLoanPrincipalNew)}</td>
          </tr>

          <tr>
            <td>عدد المندوبين الاناث الذين اصدرت لهم قروض الشهر الحالى</td>
            <td>{renderValue(monthlyAnalysis1.femaleIssuedLoanOfficers)}</td>
            <td>متوسط حجم القرض - تجديد</td>
            <td>{renderValue(monthlyAnalysis1.averageLoanPrincipalRenewal)}</td>
          </tr>

          <tr>
            <td>متوسط عدد الأقساط للشهر الحالى</td>
            <td>{renderValue(monthlyAnalysis1.averageInstallments)}</td>
            <td>اجمالى قيمة محفظة القروض عند هذا الشهر - أصل فقط</td>
            <td>{renderValue(monthlyAnalysis1.wallet)}</td>
          </tr>

          <tr>
            <td>
              إجمالي الغرامات المسددة منذ بدء النشاط حتى نهاية الشهر السابق
            </td>
            <td>{renderValue(monthlyAnalysis1.totalPaidPenaltiesLastMonth)}</td>
            <td>
              إجمالي المصاريف المسددة منذ بدء النشاط حتى نهاية الشهر السابق
            </td>
            <td>{renderValue(monthlyAnalysis1.pastMonthPaidFees)}</td>
          </tr>

          <tr>
            <td>إجمالي قيمة الغرامات المسددة هذا الشهر</td>
            <td>
              {renderValue(monthlyAnalysis1.totalPaidPenaltiesCurrentMonth)}
            </td>
            <td>إجمالي قيمة المصاريف المسددة هذا الشهر</td>
            <td>{renderValue(monthlyAnalysis1.currentMonthPaidFees)}</td>
          </tr>

          <tr>
            <td>عدد الفروع - غير المركز الرئيسى</td>
            <td>{renderValue(monthlyAnalysis1.branches)}</td>
            <td>عدد العملاء الإناث الحاصلات على ٣٠٠٠ فأقل هذا الشهر</td>
            <td>{renderValue(monthlyAnalysis1.femalesUnder3000)}</td>
          </tr>
        </tbody>
      </table>

      <table className="equations">
        <tbody>
          <tr>
            <th>نسبة السداد</th>
            <td>=</td>
            <td className="frac">
              <span>
                اجمالى السدادات التى تمت خلال هذا الشهر + اقساط مستحقة هذا الشهر
                سددت مسبقا
              </span>
              <span className="symbol">/</span>
              <span className="bottom">
                المتوقع + السدادات المتأخرة والمقدمة التى تم سداداها بالفعل هذا
                الشهر
              </span>
            </td>
            <td className="frame">
              %{renderValue(monthlyAnalysis1.paidPercentage)}
            </td>
          </tr>
          <tr>
            <th>نسبة سداد الشهر الحالى</th>
            <td>=</td>
            <td className="frac">
              <span>اجمالى السدادات للأقساط المستحقة هذا الشهر</span>
              <span className="symbol">/</span>
              <span className="bottom">القيمة المتوقعة هذا الشهر</span>
            </td>
            <td className="frame">
              %{renderValue(monthlyAnalysis1.currentMonthPaidPercentage)}
            </td>
          </tr>

          <tr>
            <th>نسبة المتأخرات</th>
            <td>=</td>
            <td className="frac">
              <span>بقايا الديون المستحقة</span>
              <span className="symbol">/</span>
              <span className="bottom">
                اجمالى القيمة المستحقة عند هذا الشهر
              </span>
            </td>
            <td className="frame">
              %{renderValue(monthlyAnalysis1.latePercentage)}
            </td>
          </tr>

          <tr>
            <th>نسبة نمو القروض - عدد</th>
            <td>=</td>
            <td className="frac">
              <span>
                عدد القروض المصدرة هذا الشهر - عدد القروض المصدرة الشهر السابق
              </span>
              <span className="symbol">/</span>
              <span className="bottom">عدد القروض المصدرة الشهر السابق</span>
            </td>
            <td className="frame">
              %{renderValue(monthlyAnalysis1.issuedLoanGrowth)}
            </td>
          </tr>

          <tr>
            <th>نسبة نمو القروض - قيمة</th>
            <td>=</td>
            <td className="frac">
              <span>
                قيمة القروض المصدرة هذا الشهر - قيمة القروض المصدرة الشهر السابق
              </span>
              <span className="symbol">/</span>
              <span className="bottom">قيمة القروض المصدرة الشهر السابق</span>
            </td>
            <td className="frame">
              %{renderValue(monthlyAnalysis1.issuedLoanGrowthPrincipal)}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table5">
        <tbody>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
          <tr>
            <th />
            <th>الوصف</th>
            <th>عدد</th>
            <th>نسبة</th>
            <th>قيمة</th>
            <th>نسبة</th>
            <th>متوسط حجم القرض</th>
            <th>عدد</th>
            <th>نسبة</th>
            <th>قيمة</th>
            <th>نسبة</th>
            <th>متوسط حجم القرض</th>
          </tr>
          <tr>
            <th colSpan={100} className="border" />
          </tr>
          <tr>
            <td>حجم القرض</td>
            <td>٣٠٠٠ - ٠</td>

            <td>{renderValue(monthlyAnalysis2.principal0to3kCount)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.principal0to3kCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.principal0to3kPrincipal)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.principal0to3kPrincipalPercentage)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.principal0to3kPrincipal /
                  monthlyAnalysis2.principal0to3kCount
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.principal0to3kCount)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal0to3kCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.principal0to3kPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal0to3kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principal0to3kPrincipal /
                  monthlyAnalysis2Members.principal0to3kCount
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>٥٠٠٠ - ٣٠٠٠</td>
            <td>{renderValue(monthlyAnalysis2.principal3kto5kCount)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.principal3kto5kCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.principal3kto5kPrincipal)}</td>
            <td>
              %
              {renderValue(monthlyAnalysis2.principal3kto5kPrincipalPercentage)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.principal3kto5kPrincipal /
                  monthlyAnalysis2.principal3kto5kCount
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.principal3kto5kCount)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal3kto5kCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.principal3kto5kPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal3kto5kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principal3kto5kPrincipal /
                  monthlyAnalysis2Members.principal3kto5kCount
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>٥٠٠٠ - ١٠٠٠٠</td>
            <td>{renderValue(monthlyAnalysis2.principal5kto10kCount)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.principal5kto10kCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.principal5kto10kPrincipal)}</td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.principal5kto10kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.principal5kto10kPrincipal /
                  monthlyAnalysis2.principal5kto10kCount
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.principal5kto10kCount)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal5kto10kCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.principal5kto10kPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal5kto10kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principal5kto10kPrincipal /
                  monthlyAnalysis2Members.principal5kto10kCount
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>٥٠٠٠٠ - ١٠٠٠٠</td>
            <td>{renderValue(monthlyAnalysis2.principal10kto50kCount)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.principal10kto50kCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.principal10kto50kPrincipal)}</td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.principal10kto50kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.principal10kto50kPrincipal /
                  monthlyAnalysis2.principal10kto50kCount
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.principal10kto50kCount)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal10kto50kCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.principal10kto50kPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principal10kto50kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principal10kto50kPrincipal /
                  monthlyAnalysis2Members.principal10kto50kCount
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>٥٠٠٠٠ &gt;</td>
            <td>
              {renderValue(monthlyAnalysis2.principalGreaterThan50kCount)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.principalGreaterThan50kCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2.principalGreaterThan50kPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.principalGreaterThan50kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.principalGreaterThan50kPrincipal /
                  monthlyAnalysis2.principalGreaterThan50kCount
              )}
            </td>

            <td className="borderright">
              {renderValue(
                monthlyAnalysis2Members.principalGreaterThan50kCount
              )}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principalGreaterThan50kCountPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principalGreaterThan50kPrincipal
              )}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.principalGreaterThan50kPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.principalGreaterThan50kPrincipal /
                  monthlyAnalysis2Members.principalGreaterThan50kCount
              )}
            </td>
          </tr>
          <tr>
            <td>نوع العميل</td>
            <td>لا ينطبق</td>
            <td>{renderValue(monthlyAnalysis2.genderNotApplicable)}</td>
            <td>
              %
              {renderValue(monthlyAnalysis2.genderNotApplicableCountPercentage)}
            </td>
            <td>
              {renderValue(monthlyAnalysis2.genderNotApplicablePrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.genderNotApplicablePrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.genderNotApplicablePrincipal /
                  monthlyAnalysis2.genderNotApplicable
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.genderNotApplicable)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.genderNotApplicableCountPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.genderNotApplicablePrincipal
              )}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.genderNotApplicablePrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.genderNotApplicablePrincipal /
                  monthlyAnalysis2Members.genderNotApplicable
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>ذكر</td>
            <td>{renderValue(monthlyAnalysis2.male)}</td>
            <td>%{renderValue(monthlyAnalysis2.maleCountPercentage)}</td>
            <td>{renderValue(monthlyAnalysis2.malePrincipal)}</td>
            <td>%{renderValue(monthlyAnalysis2.malePrincipalPercentage)}</td>
            <td>
              {renderValue(
                monthlyAnalysis2.malePrincipal / monthlyAnalysis2.male
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.male)}
            </td>
            <td>%{renderValue(monthlyAnalysis2Members.maleCountPercentage)}</td>
            <td>{renderValue(monthlyAnalysis2Members.malePrincipal)}</td>
            <td>
              %{renderValue(monthlyAnalysis2Members.malePrincipalPercentage)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.malePrincipal /
                  monthlyAnalysis2Members.male
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>أنثى</td>
            <td>{renderValue(monthlyAnalysis2.female)}</td>
            <td>%{renderValue(monthlyAnalysis2.femaleCountPercentage)}</td>
            <td>{renderValue(monthlyAnalysis2.femalePrincipal)}</td>
            <td>%{renderValue(monthlyAnalysis2.femalePrincipalPercentage)}</td>
            <td>
              {renderValue(
                monthlyAnalysis2.femalePrincipal / monthlyAnalysis2.female
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.female)}
            </td>
            <td>
              %{renderValue(monthlyAnalysis2Members.femaleCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2Members.femalePrincipal)}</td>
            <td>
              %{renderValue(monthlyAnalysis2Members.femalePrincipalPercentage)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.femalePrincipal /
                  monthlyAnalysis2Members.female
              )}
            </td>
          </tr>
          <tr>
            <td>قطاع العمل</td>
            <td>لا ينطبق</td>
            <td>{renderValue(monthlyAnalysis2.sectorNotApplicable)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.sectorNotApplicablePecentage)}
            </td>
            <td>
              {renderValue(monthlyAnalysis2.sectorNotApplicablePrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.sectorNotApplicablePrincipalPecentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.sectorNotApplicablePrincipal /
                  monthlyAnalysis2.sectorNotApplicable
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.sectorNotApplicable)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.sectorNotApplicablePecentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.sectorNotApplicablePrincipal
              )}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.sectorNotApplicablePrincipalPecentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.sectorNotApplicablePrincipal /
                  monthlyAnalysis2Members.sectorNotApplicable
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>تجارى</td>
            <td>{renderValue(monthlyAnalysis2.commercialSector)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.commercialSectorCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.commercialSectorPrincipal)}</td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.commercialSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.commercialSectorPrincipal /
                  monthlyAnalysis2.commercialSector
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.commercialSector)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.commercialSectorCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.commercialSectorPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.commercialSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.commercialSectorPrincipal /
                  monthlyAnalysis2Members.commercialSector
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>انتاجى/حرفى</td>
            <td>{renderValue(monthlyAnalysis2.productionSector)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.productionSectorCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.productionSectorPrincipal)}</td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.productionSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.productionSectorPrincipal /
                  monthlyAnalysis2.productionSector
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.productionSector)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.productionSectorCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.productionSectorPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.productionSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.productionSectorPrincipal /
                  monthlyAnalysis2Members.productionSector
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>خدمى</td>
            <td>{renderValue(monthlyAnalysis2.serviceSector)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.serviceSectorCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.serviceSectorPrincipal)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.serviceSectorPrincipalPercentage)}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.serviceSectorPrincipal /
                  monthlyAnalysis2.serviceSector
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.serviceSector)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.serviceSectorCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.serviceSectorPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.serviceSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.serviceSectorPrincipal /
                  monthlyAnalysis2Members.serviceSector
              )}
            </td>
          </tr>
          <tr>
            <td />
            <td>زراعى</td>
            <td>{renderValue(monthlyAnalysis2.agricultureSector)}</td>
            <td>
              %{renderValue(monthlyAnalysis2.agricultureSectorCountPercentage)}
            </td>
            <td>{renderValue(monthlyAnalysis2.agricultureSectorPrincipal)}</td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2.agricultureSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2.agricultureSectorPrincipal /
                  monthlyAnalysis2.agricultureSector
              )}
            </td>

            <td className="borderright">
              {renderValue(monthlyAnalysis2Members.agricultureSector)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.agricultureSectorCountPercentage
              )}
            </td>
            <td>
              {renderValue(monthlyAnalysis2Members.agricultureSectorPrincipal)}
            </td>
            <td>
              %
              {renderValue(
                monthlyAnalysis2Members.agricultureSectorPrincipalPercentage
              )}
            </td>
            <td>
              {renderValue(
                monthlyAnalysis2Members.agricultureSectorPrincipal /
                  monthlyAnalysis2Members.agricultureSector
              )}
            </td>
          </tr>
          <tr>
            <th colSpan={100} className="bordertop" />
          </tr>
        </tbody>
      </table>

      <div>
        * العملة الرئيسية <u>جنيه مصرى</u>
      </div>
      <footer>
        <div className="border" />
        <div className="footer">
          <div>جميع القروض المشطوبة مستبعدة من هذا التحليل *</div>
          <div>
            تم طباعة هذا التقرير لفترة مغلقة بعد إضافة وظيفة نهاية الفترة
            بالنظام
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MonthlyAnalysisReport

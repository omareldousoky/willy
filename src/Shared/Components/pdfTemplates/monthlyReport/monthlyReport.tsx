import React from 'react'
import { MonthReport } from '../../../Services/interfaces'
import './monthlyReport.scss'

const Instructions: React.FC = () => (
  <div className="inputs-desc">
    <h5>تعليمات الإدخال:</h5>
    <h5>
      عند الوقوف على أي خانة من خانات إدخال البيانات - سوف تظهر التعليمات الخاصة
      بملئها في هذا المستطيل
    </h5>
  </div>
)
const PageHeader: React.FC<{ fromDate: string; toDate: string }> = ({
  fromDate,
  toDate,
}) => {
  return (
    <>
      <h4>
        تقرير (ج.م.ص. / 1) الأداء الشهرى لنشاط التمويل متناهى الصغر للجمعية أو
        المؤسسة الأهلية
      </h4>
      <table>
        <tbody>
          <tr>
            <td className="td-head"> الفترة من :</td>
            <td className="td-body">{fromDate}</td>
            <td />
            <td className="td-head pr-3">إلى:</td>
            <td className="td-body">{toDate}</td>
          </tr>
        </tbody>
      </table>
      <Instructions />
    </>
  )
}
const MonthlyReport = (props: MonthReport) => {
  return (
    <div className="monthly-report" lang="ar" dir="rtl">
      {/* page one */}
      <div className="page-one-container">
        <div className="inner-container">
          <div className="header">
            <img
              alt="rekabaLogo1"
              src={require('../../../Assets/rekabaLogo1.jpg')}
            />
            <img
              alt="rekabaLogo2"
              src={require('../../../Assets/rekabaLogo2.jpg')}
            />
          </div>
          <div className="text-list">
            <h4>
              أولاً: تقرير (ج.م.ص. / 1) الأداء الشهرى لنشاط التمويل متناهى الصغر
            </h4>
            <ul>
              <li>
                تلتزم الجمعية أو المؤسسة بناءً على نص المادة &quot; 42 &quot; من
                قواعد ومعايير ممارسة نشاط التمويل متناهي الصغربإعداد التقارير
                الرقابية المبينة فى الملحق (ب) وتسليمها للوحدة فى التوقيتات
                المحددة قرين كل منها
              </li>
              <li>
                على الجمعية أو المؤسسة السعى نحو توافق النماذج المستخدمة وتصميم
                قواعد البيانات وتطبيقات نظم المعلومات بقدر الإمكان مع متطلبات
                إعداد التقارير الرقابية المشار إليها لتسهيل إعدادها
              </li>
              <li>
                يجب على الجمعية أو المؤسسة بذل العناية اللازمة للتأكد من دقة
                التقارير المقدمة للوحدة وسلامة تصويرها
              </li>
              <li>
                وقد تم تصميم النموذج الإلكتروني المرفق لمساعدة الجمعيات و
                المؤسسات الأهلية بإعداد التقارير الشهرية المطلوبة
              </li>
            </ul>
          </div>
          <div className="bottom-text">
            <div className="inner-container">
              التوقيت: خلال أسبوعين من نهاية كل شهر ميلادى
            </div>
          </div>
        </div>
      </div>
      {/* end of page one */}

      {/* page two */}
      <div className="page-two-container-break">
        <div className="page-two-container">
          <div className="inner-container">
            <h4>
              تقرير (ج.م.ص. / 1) الأداء الشهرى لنشاط التمويل متناهى الصغر
              للجمعية أو المؤسسة الأهلية
            </h4>
            <Instructions />
            <h5 className="sub-title">
              بيانات الجمعية / المؤسسة الأهلية و بيانات معد التقرير
            </h5>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> اسم الجمعية/المؤسسة :</td>
                  <td className="td-body"> شركه تساهيل للتمويل متناهي الصغر</td>
                </tr>
                <tr>
                  <td className="td-head"> رقم الترخيص :</td>
                  <td className="td-body">2</td>
                </tr>
              </tbody>
            </table>
            <h5 className="sub-title">اسم وصفة معد التقرير</h5>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> اسم معد التقرير:</td>
                  <td className="td-body"> اسلام حسن</td>
                </tr>
                <tr>
                  <td className="td-head"> صفة معد التقرير:</td>
                  <td className="td-body"> المدير المالي</td>
                </tr>
              </tbody>
            </table>
            <h5 className="sub-title">بيانات التقرير</h5>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة :</td>
                  <td className="label"> من</td>
                  <td className="td-body">{props.fromDate}</td>
                  <td className="label pr-3">الي</td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
                <tr>
                  <td className="td-head"> تاريخ الاعداد:</td>
                  <td />
                  <td className="td-body">{props.createdAt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page two */}

      {/* page three */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <PageHeader fromDate={props.fromDate} toDate={props.toDate} />
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>1. العملاء والتمويل الممنوح</th>
                </tr>
                <tr>
                  <th />
                  <th>بيان</th>
                  <th>عملاء مستمرون</th>
                  <th>عملاء جدد خلال الفترة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1.1</td>
                  <td>إجمالى عدد عملاء تمويل أفراد</td>
                  <td>{props.totalIndividualCount.onGoingCutomer}</td>
                  <td>{props.totalIndividualCount.newCustomer}</td>
                  <td>{props.totalIndividualCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.2</td>
                  <td>منهم عدد العملاء – ذكور</td>
                  <td>{props.maleIndividualCount.onGoingCutomer}</td>
                  <td>{props.maleIndividualCount.newCustomer}</td>
                  <td>{props.maleIndividualCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.3</td>
                  <td>منهم عدد العملاء - إناث</td>
                  <td>{props.femaleIndividualCount.onGoingCutomer}</td>
                  <td>{props.femaleIndividualCount.newCustomer}</td>
                  <td>{props.femaleIndividualCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.4</td>
                  <td>إجمالى قيمة أرصدة تمويل أفراد</td>
                  <td>{props.totalIndividualCredit.onGoingCutomer}</td>
                  <td>{props.totalIndividualCredit.newCustomer}</td>
                  <td>{props.totalIndividualCredit.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.5</td>
                  <td>منها أرصدة تمويل لعملاء – ذكور</td>
                  <td>{props.maleIndividualCredit.onGoingCutomer}</td>
                  <td>{props.maleIndividualCredit.newCustomer}</td>
                  <td>{props.maleIndividualCredit.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.6</td>
                  <td>منها أرصدة تمويل لعملاء - إناث</td>
                  <td>{props.femaleIndividualCredit.onGoingCutomer}</td>
                  <td>{props.femaleIndividualCredit.newCustomer}</td>
                  <td>{props.femaleIndividualCredit.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.7</td>
                  <td>إجمالى عدد عقود تمويل جماعى</td>
                  <td>{props.totalGroupLoansCount.onGoingCutomer}</td>
                  <td>{props.totalGroupLoansCount.newCustomer}</td>
                  <td>{props.totalGroupLoansCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.8</td>
                  <td>إجمالى عدد عملاء عقود تمويل جماعى</td>
                  <td>{props.totalGroupCount.onGoingCutomer}</td>
                  <td>{props.totalGroupCount.newCustomer}</td>
                  <td>{props.totalGroupCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.9</td>
                  <td>منهم عدد العملاء – ذكور</td>
                  <td>{props.maleGroupCount.onGoingCutomer}</td>
                  <td>{props.maleGroupCount.newCustomer}</td>
                  <td>{props.maleGroupCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.10</td>
                  <td>منهم عدد العملاء - إناث</td>
                  <td>{props.femaleGroupCount.onGoingCutomer}</td>
                  <td>{props.femaleGroupCount.newCustomer}</td>
                  <td>{props.femaleGroupCount.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.11</td>
                  <td>إجمالى قيمة أرصدة تمويل جماعى</td>
                  <td>{props.totalGroupCredit.onGoingCutomer}</td>
                  <td>{props.totalGroupCredit.newCustomer}</td>
                  <td>{props.totalGroupCredit.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.12</td>
                  <td>منها أرصدة تمويل لعملاء – ذكور</td>
                  <td>{props.maleGroupCredit.onGoingCutomer}</td>
                  <td>{props.maleGroupCredit.newCustomer}</td>
                  <td>{props.maleGroupCredit.total}</td>
                </tr>
                <tr>
                  <td className="text-center">1.13</td>
                  <td>منها أرصدة تمويل لعملاء - إناث</td>
                  <td>{props.femaleGroupCredit.onGoingCutomer}</td>
                  <td>{props.femaleGroupCredit.newCustomer}</td>
                  <td>{props.femaleGroupCredit.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="inner-container">
            <p className="font-weight-bold">
              <u>بناء على البيانات التي تم إدخالها في الجدول أعلاه</u>
            </p>
            <div className="totals">
              <div className="lines">
                <p>إجمالي قيمة أرصدة التمويل القائمة</p>
                <p>
                  (إجمالي قيمة أرصدة تمويل أفراد + إجمالي قيمة أرصدة تمويل
                  جماعي)
                </p>
              </div>
              <div className="big-number">{props.totalCredit}</div>
            </div>
            <div className="totals">
              <div className="lines">
                <p>عدد العملاء الحاصلون على تمويل</p>
                <p>
                  (إجمالي عدد عملاء تمويل أفراد + إجمالي عدد عملاء عقود تمويل
                  جماعي)
                </p>
              </div>
              <div className="big-number">{props.totalCount}</div>
            </div>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page three */}

      {/* page four */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <PageHeader fromDate={props.fromDate} toDate={props.toDate} />
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>2.1 قيمة أرصدة التمويل القائمة</th>
                </tr>
                <tr>
                  <th rowSpan={2}>المنتج التمويلى</th>
                  <th colSpan={4}>مجال النشاط الممنوح له التمويل</th>
                </tr>
                <tr>
                  <th>تجارى</th>
                  <th>إنتاجى / حرفى</th>
                  <th>خدمى</th>
                  <th>زراعى</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td> قرض</td>
                  <td>{props.commercialCredit}</td>
                  <td>{props.productionCredit}</td>
                  <td>{props.serviceCredit}</td>
                  <td>{props.agriculturalCredit}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="inner-container">
            <p className="font-weight-bold">
              <u> بناء على البيانات التي تم إدخالها في الجدول أعلاه</u>
            </p>
            <div className="totals">
              <div className="lines">
                <p>إجمالي قيمة أرصدة التمويل القائمة</p>
                <p>(إجمالي قيمة أرصدة تمويل تجاري+إنتاجي/حرفي+خدمي+زراعي)</p>
              </div>
              <div className="big-number">
                {props.fundingWalletAnalysisSheetCredit}
              </div>
            </div>
            <div className="totals">
              <div className="lines">
                <p>
                  مدى مطابقة &quot;إجمالي قيمة أرصدة التمويل القائمة&quot;
                  بالجدول أعلاه ل&quot;إجمالي قيمة أرصدة
                </p>
                <p>
                  التمويل القائمة&quot; بالجدول رقم &quot;1&quot; الخاص بالعملاء
                  و التمويل الممنوح بالصفحة السابقة
                </p>
              </div>
              <div className="big-number">
                {props.fundingWalletAnalysisCreditValidation === 'matching'
                  ? 'مطابق'
                  : 'غير مطابق'}
              </div>
            </div>
          </div>
          <div className="inner-container">
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>2.2 عدد العملاء الحاصلين على التمويل</th>
                </tr>
                <tr>
                  <th rowSpan={2}>المنتج التمويلى</th>
                  <th colSpan={4}>مجال النشاط الممنوح له التمويل</th>
                </tr>
                <tr>
                  <th>تجارى</th>
                  <th>إنتاجى / حرفى</th>
                  <th>خدمى</th>
                  <th>زراعى</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td> قرض</td>
                  <td>{props.commercialCount}</td>
                  <td>{props.productionCount}</td>
                  <td>{props.serviceCount}</td>
                  <td>{props.agriculturalCount}</td>
                </tr>
                <tr className="text-center">
                  <td> إجمالى</td>
                  <td>{props.commercialCount}</td>
                  <td>{props.productionCount}</td>
                  <td>{props.serviceCount}</td>
                  <td>{props.agriculturalCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="inner-container">
            <p className="font-weight-bold">
              <u> بناء على البيانات التي تم إدخالها في الجدول أعلاه</u>
            </p>
            <div className="totals">
              <div className="lines">
                <p>إجمالي عدد العملاء الحاصلين على التمويل</p>
                <p>
                  جمالي عدد العملاء الحاصلين على (تمويل
                  تجاري+إنتاجي/حرفي+خدمي+زراعي)
                </p>
              </div>
              <div className="big-number">
                {props.fundingWalletAnalysisSheetCount}
              </div>
            </div>
            <div className="totals">
              <div className="lines">
                <p>
                  مدى مطابقة &quot;إجمالي قيمة أرصدة التمويل القائمة&quot;
                  بالجدول أعلاه ل&quot;إجمالي قيمة أرصدة
                </p>
                <p>
                  التمويل القائمة&quot; بالجدول رقم &quot;1&quot; الخاص بالعملاء
                  و التمويل الممنوح بالصفحة السابقة
                </p>
              </div>
              <div className="big-number">
                {props.fundingWalletAnalysisCountValidation === 'matching'
                  ? 'مطابق'
                  : 'غير مطابق'}
              </div>
            </div>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page four */}

      {/* page five */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <PageHeader fromDate={props.fromDate} toDate={props.toDate} />
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={7}>3- إنتظام السداد وجدول المتأخرات</th>
                </tr>
                <tr>
                  <th />
                  <th>بيان</th>
                  <th>عدد عملاء (عقود)</th>
                  <th>إجمالى أرصدة مستحقة</th>
                  <th>أصل الأرصدة بدون أعباء تمويل</th>
                  <th>نسبة مخصص ديون مشكوك فى تحصيلها</th>
                  <th>قيمة مخصص ديون مشكوك فى تحصيلها</th>
                </tr>
              </thead>
              <tbody>
                {props.arrears.map((arrear, index) => {
                  return (
                    <tr key={index} className="text-center">
                      {arrear.tier === '0-7' && (
                        <>
                          <td>3.1</td>
                          <td>
                            أرصدة تمويل منتظمة (أو بتأخير لا يتجاوز أسبوع)
                          </td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>2%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}

                      {arrear.tier === '8-30' && (
                        <>
                          <td>3.2</td>
                          <td>تأخير حتى 30 يوم</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>10%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}
                      {arrear.tier === '31-60' && (
                        <>
                          <td>3.3</td>
                          <td>تأخير حتى 60 يوم</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>25%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}
                      {arrear.tier === '61-90' && (
                        <>
                          <td>3.4</td>
                          <td>تأخير حتى 90 يوم</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>50%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}
                      {arrear.tier === '91-120' && (
                        <>
                          <td>3.5</td>
                          <td>تأخير حتى 120 يوم</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>70%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}

                      {arrear.tier === '120+' && (
                        <>
                          <td>3.6</td>
                          <td>تأخير يتجاوز 120 يوم</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>100%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}
                      {arrear.tier === 'Rescheduled Loans' && (
                        <>
                          <td>3.7</td>
                          <td>أرصدة تمويل – أقساط مرحلة</td>
                          <td>{arrear.customers}</td>
                          <td>{arrear.arrears}</td>
                          <td>{arrear.wallet}</td>
                          <td>2%</td>
                          <td>{arrear.provision}</td>
                        </>
                      )}
                    </tr>
                  )
                })}
                <tr className="text-center">
                  <td>3.8</td>
                  <td>أرصدة تمويل معاد جدولتها</td>
                  <td />
                  <td />
                  <td />
                  <td>50%</td>
                  <td />
                </tr>
                <tr className="text-center">
                  <td>3.9</td>
                  <td>إجمالى أرصدة التمويل</td>
                  <td>{props.totalCustomers}</td>
                  <td>{props.totalArrears}</td>
                  <td>{props.totalWallet}</td>
                  <td />
                  <td>{props.totalProvision}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="inner-container">
            <p className="font-weight-bold">
              <u>x بناء على البيانات التي تم إدخالها في الجدول أعلاه</u>
            </p>
            <div className="totals">
              <div className="lines">
                <p>
                  إجمالي عدد العملاء الذين لهم أرصدة تمويل منتظمة أو بتأخير (لا
                  يتجاوز أسبوع + حتى 30 يوم
                </p>
                <p>
                  + حتى 60 يوم + حتى 90 يوم + حتى 120 يوم + أكثر من 120 يوم )+
                  أقساط (مرحلة + معاد جدولتها)
                </p>
              </div>
              <div className="big-number">{props.totalCustomers}</div>
            </div>
            <div className="totals">
              <div className="lines">
                <p>
                  مدى مطابقة &quot;إجمالي عدد العملاء &quot; بالجدول أعلاه
                  ل&quot;إجمالي عدد العملاء الحاصلين على التمويل
                </p>
                <p>
                  &quot; بالجدول رقم &quot;1&quot; الخاص بالعملاء و التمويل
                  الممنوح بالصفحة السابقة
                </p>
              </div>
              <div className="big-number">
                {props.arrearsCountValidation === 'matching'
                  ? 'مطابق'
                  : 'غير مطابق'}
              </div>
            </div>
          </div>
          <div className="inner-container">
            <p className="font-weight-bold">
              <u>بناء على البيانات التي تم إدخالها في الجدول أعلاه</u>
            </p>
            <div className="totals">
              <div className="lines">
                <p>
                  إجمالي قيمة أرصدة التمويل القائمة منتظمة أو بتأخير (لا يتجاوز
                  أسبوع + حتى 30 يوم
                </p>
                <p>
                  + حتى 60 يوم + حتى 90 يوم + حتى 120 يوم + أكثر من 120 يوم )+
                  أقساط (مرحلة + معاد جدولتها)
                </p>
              </div>
              <div className="big-number">{props.totalArrears}</div>
            </div>
            <div className="totals">
              <div className="lines">
                <p>
                  مدى مطابقة &quot;إجمالي قيمة أرصدة التمويل المستحقة&quot;
                  بالجدول أعلاه ل&quot;إجمالي قيمة أرصدة
                </p>
                <p>
                  التمويل القائمة&quot; بالجدول رقم &quot;1&quot; الخاص بالعملاء
                  و التمويل الممنوح بالصفحة السابقة
                </p>
              </div>
              <div className="big-number">
                {props.arrearsCreditValidation === 'matching'
                  ? 'مطابق'
                  : 'غير مطابق'}
              </div>
            </div>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page five */}

      {/* page six */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <PageHeader fromDate={props.fromDate} toDate={props.toDate} />
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>4. ديون معدومة</th>
                </tr>
                <tr>
                  <th>م</th>
                  <th>بيان</th>
                  <th>الشهر</th>
                  <th>من بداية العام</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>4.1</td>
                  <td>إجمالى عدد أرصدة معدومة عملاء تمويل أفراد</td>
                  <td>{props.individualWrittenOffLoansCount.month}</td>
                  <td>{props.individualWrittenOffLoansCount.year}</td>
                </tr>
                <tr className="text-center">
                  <td>4.2</td>
                  <td>إجمالى قيمة أرصدة تمويل معدومة لعملاء أفراد</td>
                  <td>{props.individualWrittenOffLoansCredit.month}</td>
                  <td>{props.individualWrittenOffLoansCredit.year}</td>
                </tr>
                <tr className="text-center">
                  <td>4.3</td>
                  <td>إجمالى عدد أرصدة معدومة تمويل جماعى</td>
                  <td>{props.groupWrittenOffLoansCount.month}</td>
                  <td>{props.groupWrittenOffLoansCount.year}</td>
                </tr>
                <tr className="text-center">
                  <td>4.4</td>
                  <td>إجمالى قيمة أرصدة معدومة تمويل جماعى</td>
                  <td>{props.groupWrittenOffLoansCredit.month}</td>
                  <td>{props.groupWrittenOffLoansCredit.year}</td>
                </tr>
                <tr className="text-center">
                  <td>4.5</td>
                  <td>إجمالى عدد أرصدة معدومة لكافة أنواع العملاء</td>
                  <td>{props.writtenOffLoansCount.month}</td>
                  <td>{props.writtenOffLoansCount.year}</td>
                </tr>
                <tr className="text-center">
                  <td>4.6</td>
                  <td>إجمالى قيمة أرصدة معدومة لكافة أنواع العملاء</td>
                  <td>{props.writtenOffLoansCredit.month}</td>
                  <td>{props.writtenOffLoansCredit.year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page six */}
      {/* page seven */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <PageHeader fromDate={props.fromDate} toDate={props.toDate} />
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>5. تحصيلات لأرصدة سبق إعدامها</th>
                </tr>
                <tr>
                  <th>م</th>
                  <th>بيان</th>
                  <th>الشهر</th>
                  <th>من بداية العام</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>5.1</td>
                  <td>إجمالى عدد أرصدة تمويل لكافة أنواع العملاء </td>
                  <td>{props.collectedWrittenOffLoansCount.month}</td>
                  <td>{props.collectedWrittenOffLoansCount.year}</td>
                </tr>
                <tr className="text-center">
                  <td>5.2</td>
                  <td>إجمالى قيمة أرصدة تمويل لكافة أنواع العملاء </td>
                  <td>{props.collectedWrittenOffLoansCredit.month}</td>
                  <td>{props.collectedWrittenOffLoansCredit.year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page seven */}
    </div>
  )
}

export default MonthlyReport

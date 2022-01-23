import React from 'react'
import './quarterlyReport.scss'

interface Props {
  fundingWalletTrends: {
    individualAverageLoan: number
    individualAverageWallet: number
    groupAverageLoan: number
    groupAverageWallet: number
    averageDaysToFinishIndividualLoans: number
    averageDaysToFinishGroupLoans: number
    collectionExpectations1To30: number
    collectionExpectations31To90: number
    collectionExpectations91To180: number
    collectionExpectations181To270: number
    collectionExpectations271To365: number
    collectionExpectationsAfterYear: number
    walletGrowthRate: number
  }
  fundingWalletQuality: {
    writtenOffLoansRate: number
    riskCoverageRate: number
    committedCustomersWalletRate: number
    lateCustomersWalletTo30DaysRate: number
    lateCustomersWalletTo60DaysRate: number
    lateCustomersWalletTo90DaysRate: number
    lateCustomersWalletTo120DaysRate: number
    lateCustomersWalletAfter120DaysRate: number
    carryOverInstallmentsCustomersWalletRate: number
    rescheduledCustomerWalletRate: number
  }
  fromDate: string
  toDate: string
  createdAt: string
}
const QuarterlyReport = (props: Props) => {
  return (
    <div className="quarterly-report" lang="ar" dir="rtl">
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
              التوقيت: خلال ستة أسابيع من نهاية كل ربع سنة مالية
            </div>
          </div>
          <p style={{ textAlign: 'center' }}>
            التقرير ربع السنوى يعد على أساس تراكمى (ثلاثة أشهر، ستة أشهر، تسعة
            أشهر، وسنة)
          </p>
        </div>
      </div>
      {/* end of page one */}

      {/* page two */}
      <div className="page-two-container-break">
        <div className="page-two-container">
          <div className="inner-container">
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <div className="inputs-desc">
              <h5>نهاية الفترة:</h5>
              <h5>
                تاريخ نهاية الفترة التي يغطيها التقرير (يوم - شهر - سنة) مثال:
              </h5>
              <h5 style={{ textAlign: 'center' }}>31-07-2015</h5>
            </div>
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
                  <td className="td-body"> {props.fromDate}</td>
                  <td className="label" style={{ paddingRight: 10 }}>
                    الي
                  </td>
                  <td className="td-body"> {props.toDate}</td>
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
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة من :</td>
                  <td className="td-body"> {props.fromDate}</td>
                  <td />
                  <td className="td-head" style={{ paddingRight: 10 }}>
                    إلى:
                  </td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
              </tbody>
            </table>
            <div className="inputs-desc">
              <h5>1.9/ القيمة</h5>
              <h5>
                مجموع قيم الأقساط (أصل فقط) المتوقع تحصيلها خلال فترة من 31 يوم
                إلى 90 يوم (بدءاً من أول أيام الشهر التالي لتاريخ نهاية الفترة
                التي يغطيها التقرير)
              </h5>
            </div>
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>1. مؤشرات محفظة التمويل</th>
                </tr>
                <tr>
                  <th />
                  <th>المؤشر</th>
                  <th>القيمة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.1</td>
                  <td>معدل نمو المحفظة</td>
                  <td>
                    {props.fundingWalletTrends.walletGrowthRate
                      ? props.fundingWalletTrends.walletGrowthRate
                      : 0.0}
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.2</td>
                  <td>متوسط قيمة التمويل للعميل عند المنح (تمويل فردي)</td>
                  <td>{props.fundingWalletTrends.individualAverageLoan}%</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.3</td>
                  <td>
                    متوسط قيمة رصيد التمويل للعميل بنهاية الفترة (تمويل فردي)
                  </td>
                  <td>{props.fundingWalletTrends.individualAverageWallet}%</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.4</td>
                  <td>متوسط قيمة التمويل للعميل عند المنح (تمويل جماعي)</td>
                  <td>{props.fundingWalletTrends.groupAverageLoan}%</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.5</td>
                  <td>
                    متوسط قيمة رصيد التمويل للعميل بنهاية الفترة (تمويل جماعي)
                  </td>
                  <td>{props.fundingWalletTrends.groupAverageWallet}%</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.6</td>
                  <td>متوسط أجل محفظة التمويل (باليوم)</td>
                  <td>
                    {
                      props.fundingWalletTrends
                        .averageDaysToFinishIndividualLoans
                    }
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.7</td>
                  <td>متوسط أجل محفظة التمويل الجماعي (باليوم)</td>
                  <td>
                    {props.fundingWalletTrends.averageDaysToFinishGroupLoans}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.8</td>
                  <td>قيمة ما يتوقع تحصيله خلال 30 يوم أو أقل</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectations1To30}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.9</td>
                  <td>قيمة ما يتوقع تحصيله بين 31 يوم إلى 90 يوم</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectations31To90}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.10</td>
                  <td>قيمة ما يتوقع تحصيله بين 91 يوم إلى 180 يوم</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectations91To180}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.11</td>
                  <td>قيمة ما يتوقع تحصيله بين 181 يوم إلى 270 يوم</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectations181To270}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.12</td>
                  <td>قيمة ما يتوقع تحصيله بين 271 يوم إلى 365 يوم</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectations271To365}%
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1.13</td>
                  <td>قيمة ما يتوقع تحصيله بعد أكثر من سنة</td>
                  <td>
                    {props.fundingWalletTrends.collectionExpectationsAfterYear}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page three */}

      {/* page four */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة من :</td>
                  <td className="td-body">{props.fromDate}</td>
                  <td />
                  <td className="td-head" style={{ paddingRight: 10 }}>
                    إلى:
                  </td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
              </tbody>
            </table>
            <div className="inputs-desc">
              <h5>2.1/ القيمة</h5>
              <h5>الديون المعدومة / إجمالي محفظة التمويل</h5>
            </div>
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>2. مؤشرات جودة محفظة التمويل</th>
                </tr>
                <tr>
                  <th />
                  <th>المؤشر</th>
                  <th>القيمة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.1</td>
                  <td>معدل الديون المعدومة</td>
                  <td>{props.fundingWalletQuality.writtenOffLoansRate}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.2</td>
                  <td>معدل تغطية المخاطر</td>
                  <td>{props.fundingWalletQuality.riskCoverageRate}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.3</td>
                  <td>نسبة أرصدة العملاء المنتظمة</td>
                  <td>
                    {props.fundingWalletQuality.committedCustomersWalletRate}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.4</td>
                  <td>نسبة أرصدة العملاء بتأخير حتى 30 يوم</td>
                  <td>
                    {props.fundingWalletQuality.lateCustomersWalletTo30DaysRate}
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.5</td>
                  <td>نسبة أرصدة العملاء بتأخير حتى 60 يوم</td>
                  <td>
                    {props.fundingWalletQuality.lateCustomersWalletTo60DaysRate}
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.6</td>
                  <td>نسبة أرصدة العملاء بتأخير حتى 90 يوم</td>
                  <td>
                    {props.fundingWalletQuality.lateCustomersWalletTo90DaysRate}
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.7</td>
                  <td>نسبة أرصدة العملاء بتأخير حتى 120 يوم</td>
                  <td>
                    {
                      props.fundingWalletQuality
                        .lateCustomersWalletTo120DaysRate
                    }
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.8</td>
                  <td>نسبة أرصدة العملاء بتأخير يتجاوز 120 يوم</td>
                  <td>
                    {
                      props.fundingWalletQuality
                        .lateCustomersWalletAfter120DaysRate
                    }
                    %
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.9</td>
                  <td>نسبة أرصدة العملاء بترحيل أقساط – 3 أقساط</td>
                  <td>{`${
                    props.fundingWalletQuality
                      .carryOverInstallmentsCustomersWalletRate
                      ? props.fundingWalletQuality
                          .carryOverInstallmentsCustomersWalletRate
                      : 0.0
                  } %`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>2.10</td>
                  <td>نسبة أرصدة العملاء المعاد جدولتها</td>
                  <td>{`${
                    props.fundingWalletQuality.rescheduledCustomerWalletRate
                      ? props.fundingWalletQuality.rescheduledCustomerWalletRate
                      : 0.0
                  } %`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page four */}

      {/* page five */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة من :</td>
                  <td className="td-body">{props.fromDate}</td>
                  <td />
                  <td className="td-head" style={{ paddingRight: 10 }}>
                    إلى:
                  </td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
              </tbody>
            </table>
            <div className="inputs-desc">
              <h5>3.1/ القيمة</h5>
              <h5>
                (الأرصدة النقدية بالخزينة والبنوك وأذون الخزانة وغيرها من
                الأوراق المالية عالية السيولة)/ الالتزامات قصيرة الأجل أقل من
                عام
              </h5>
            </div>
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>3- مؤشرات مالية</th>
                </tr>
                <tr>
                  <th />
                  <th>المؤشر</th>
                  <th>القيمة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>3.1</td>
                  <td>معدل السيولة السريعة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>3.2</td>
                  <td>معدل السيولة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>3.3</td>
                  <td>
                    معدل استحقاقات القروض الممنوحة للجمعية/ المؤسسة الأهلية
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="perpared">إعداد: اسلام حسن</p>
      </div>
      {/* end of page five */}

      {/* page six */}
      <div className="page-three-container-break">
        <div className="page-three-container">
          <div className="inner-container">
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة من :</td>
                  <td className="td-body">{props.fromDate}</td>
                  <td />
                  <td className="td-head" style={{ paddingRight: 10 }}>
                    إلى:
                  </td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
              </tbody>
            </table>
            <div className="inputs-desc">
              <h5>4.1/ القيمة</h5>
              <h5>
                إجمالي التكاليف المرتبطة بالمحفظة (غير متضمنة المخصصات) خلال
                الفترة/ متوسط إجمالي أرصدة المحفظة
              </h5>
            </div>
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>4. مؤشرات تشغيلية</th>
                </tr>
                <tr>
                  <th>م</th>
                  <th>بيان</th>
                  <th>من بداية العام</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>4.1</td>
                  <td>متوسط تكلفة الجنيه تمويل للمحفظة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>4.2</td>
                  <td>نسبة تكلفة التمويل إلى إجمالى المصروفات</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>4.3</td>
                  <td>متوسط تكلفة التشغيل لكل عميل</td>
                  <td />
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
            <h4>
              تقرير (ج.م.ص. / 2) الأداء الربع سنوي لنشاط التمويل متناهى الصغر
            </h4>
            <table>
              <tbody>
                <tr>
                  <td className="td-head"> الفترة من :</td>
                  <td className="td-body">{props.fromDate}</td>
                  <td />
                  <td className="td-head" style={{ paddingRight: 10 }}>
                    إلى:
                  </td>
                  <td className="td-body">{props.toDate}</td>
                </tr>
              </tbody>
            </table>
            <div className="inputs-desc">
              <h5>5.1/ القيمة</h5>
              <h5>
                عدد العاملين بالجمعية أو المؤسسة الأهلية بنهاية فترة تقديم
                التقرير
              </h5>
            </div>
            <table className="details">
              <thead>
                <tr>
                  <th colSpan={5}>5. مؤشرات العمالة و الانتاجية</th>
                </tr>
                <tr>
                  <th />
                  <th>بيان</th>
                  <th>القيمة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>5.1</td>
                  <td>عدد العاملين بنهاية الفترة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>5.2</td>
                  <td>عدد مسئولى التمويل بنهاية الفترة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>5.3</td>
                  <td>نسبة عدد العملاء إلى عدد العاملين بنهاية الفترة</td>
                  <td />
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>5.4</td>
                  <td>نسبة عدد العملاء إلى مسئولى التمويل بنهاية الفترة</td>
                  <td />
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

export default QuarterlyReport

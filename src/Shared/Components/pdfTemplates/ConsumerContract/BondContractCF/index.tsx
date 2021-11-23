import React from 'react'
import './styles.scss'
import Tafgeet from 'tafgeetjs'
import {
  numbersToArabic,
  timeToArabicDate,
  dayToArabic,
} from '../../../../Services/utils'
import { BondContractProps } from '../../../../Models/consumerContract'
import { Header } from '../../pdfTemplateCommon/header'

export const BondContract: React.FC<BondContractProps> = (props) => {
  return (
    <>
      <div className="loan-contract" dir="rtl" lang="ar">
        <table className="report-container">
          <Header
            title=""
            showCurrentUser={false}
            showCurrentTime={false}
            cf={props.isCF}
          />
          <tbody className="report-content">
            <tr>
              <td
                className="report-content-cell"
                style={{ textAlign: 'right' }}
              >
                <div className="main">
                  <div className="headtitle textcenter">
                    <u>عقد وديعة</u>
                  </div>
                  <div>
                    انه في يوم &nbsp;
                    {dayToArabic(
                      new Date(props.customerCreationDate).getDay()
                    )}{' '}
                    &nbsp; الموافق &nbsp;
                    {timeToArabicDate(props.customerCreationDate, false)}
                  </div>
                  <div>تم الاتفاق بين كل من :-</div>
                  <table className="stakeholders">
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div>
                            <b>أولا:</b> شركة حالا للتمويل الاستهلاكي ومركزها
                            الرئيسي في الدور 12 بالعقار رقم 2 شارع لبنان –
                            المهندسين - الجيزة سجل تجاري رقم 250331 لسنة 2021
                            ومرخص لها بمزاولة نشاط التمويل الاستهلاكي من الهيئة
                            العامة للرقابة المالية تحت رقم 23 لسنة 2021
                          </div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>
                          (طرف اول ويشار اليه في هذا العقد باسم
                          &quot;المودع&quot;)
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div>
                            <b>ثانيا:- السيد :-&nbsp;</b>
                            <span>{props.customerName}</span>
                          </div>
                        </td>
                        <td style={{ width: '30%' }}>
                          <div>
                            <b>المقيم:&nbsp;</b>
                            <span>{props.customerHomeAddress}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <b className="word-break">و يحمل بطاقة رقم قومي</b>
                            <span>{numbersToArabic(props.nationalId)}</span>
                          </div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>
                          (طرف ثاني ويشار اليه في هذا العقد باسم &quot;المودع
                          له&quot;)
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <section>
                    <div>
                      و بعد ان اقر طرفي العقد بكامل اهليتهم للتعاقد اتفقا على
                      الاتي:
                    </div>
                    <div className="title">التمهيد</div>
                    <div>
                      حيث ان الطرف الاول المودع قد اودع للطرف الثاني المودع له
                      مبلغ وقدره{' '}
                      {`${numbersToArabic(
                        props.initialConsumerFinanceLimit
                      )} جنيه (${new Tafgeet(
                        props.initialConsumerFinanceLimit,
                        'EGP'
                      ).parse()})`}{' '}
                      بحسابه والتي تستخدم في منح التمويل الاستهلاكي بشراء سلع /
                      خدمات وفقا قانون التمويل الاستهلاكي رقم 18 لسنة 2020
                      واحكام المواد 718 وما بعدها رقم 131 لسنة 1984 باصدار
                      القانون المدني المصري .
                    </div>
                    <div>
                      وحيث ان الطرف الثاني وبموجب هذا العقد قد تسلم الوديعة التي
                      تم ايداعها بحسابه من قبل الطرف الاوول المودع وما يلزم برد
                      الوديعة ووفقا للشروط والاحكام الوارده بهذا العقد.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الأول</div>
                    <div>
                      يعتبر التمهيد السابق وكافة ملاحق هذا العقد الموقعة من
                      طرفية جزء لا يتجزأ منه مكملة ومتممة لبنوده ومفسره لشروطه
                      واحكامه.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثاني</div>
                    <div>
                      بموجب معاملة تجارية غير مصرفية صادرة من الطرف الاول لصالح
                      الطرف الثاني لاستخدامها في منح تمويل استهلاكي يحصل بموجبه
                      الطرف الثاني على تمويل للمعاملات شراء سلع / خدمات وارده
                      باحكام قانون التمويل الاستهلاكي رقم 18 لسنة 2020 اودع
                      الطرف الاول المودع لحساب الطرف الثاني المودع له مبلغ وقدره
                      &nbsp;
                      {`${numbersToArabic(
                        props.initialConsumerFinanceLimit
                      )} جنيه (${new Tafgeet(
                        props.initialConsumerFinanceLimit,
                        'EGP'
                      ).parse()})`}
                      &nbsp; على ان يلتزم المودع له برد قيمه الوديعة على اقساط
                      شهرية اعتبارا من تاريخ شراء السلع/ الخدمات ووفقا للشروط
                      عند اتمام الشراء واستخدام الوديعة.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثالث</div>
                    <div>
                      من المتفق عليه بين الطرفين ان قيمة الوديعة المودعة لحسابه
                      الصادرة لصالح المودع له والتي تستخدم في منح التمويل
                      الاستهلاكي لشراء سلع / خدمات بقيمة المبلغ المودع يتم
                      استعمالها واستخدامها وفقا للضوابط والشروط الواردة بالعقد
                      المبرم بين الطرفين والمعنون اتفاقية تمويل شراء سلع/ خدمات.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الرابع</div>
                    <div>
                      اذا تأخر المودع له في الوفاء بسداد الدفعات الواردة بالبند
                      الثاني من هذا العقد في مواعيد استحقاقها يحل اجل رد الوديعة
                      ويلتزم المودع له بتسليم المبالغ المودعه له او قيمتها حال
                      استخدامه للتمويل الاستهلاكي لشراء سلع او خدمات على النحو
                      الوارد بهذا العقد فاذا امتنع المودع له عن رد الوديعة
                      وقيمتها يعتبر مبددا لمال المودع (الطرف الاول) وللاخير الحق
                      في اتخاذ الاجراءات الجنائية ضده اعمالا لنص المادة 341 من
                      قانون العقوبات رقم 58 لسنة 1973 وتعديلاته .
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الخامس</div>
                    <div>
                      يحق للطرف الاول ان يحيل كافة حقوقه الناشئة عن هذا العقد او
                      جزء منها الى الغير ويحق له الافصاح للجهة المحال اليها عن
                      اسم الطرف الثاني المدين بالحقوق التي تمت حوالتها وبالضمان
                      المقدم منه وبما قام بوفائه من اقساط ومواعيد الوفاء وحالات
                      الامتناع عنه وكافة البيانات والمعلومات الاخري ويعد توقيع
                      الطرف الثاني على هذا العقد قبولا منه على قيام الطرف الاول
                      بحوالة تلك الحقوق او جزء منها الى الغير على ان يشمل ذلك
                      ولا يقتصر على كلا من شركات التمويل العقاري والاستهلاكي او
                      اعادة التمويل او شركات التخصيم او البنوك او الجهات التي
                      تباشر نشاط التوريق والشركات والمؤسسات التي تباشر انشطة
                      مالية غير مصرفية وغيرها من الانشطة المتعلقة بسوق المال.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند السادس</div>
                    <div>
                      تحرر هذا العقد من نسختين وتم التوقيع عليهم من كلا الطرفيين
                      في التاريخ المسطر اعلاه وتسلم الطرف الاول نسخه والطرف
                      الثاني نسخة للعمل بموجبها للعمل بموجبها عند اللزوم.
                    </div>
                  </section>

                  <table className="signature_space">
                    <tbody>
                      <tr>
                        <td>
                          <div>
                            <b>الطرف الأول ( المودع )</b>
                          </div>
                          <div style={{ marginBottom: 30 }}>
                            شركة حالا للتمويل الاستهلاكي ش. م. م.
                          </div>
                        </td>
                        <td>
                          <div>
                            <b>الطرف الثاني ( المودع له )</b>
                          </div>
                          <div>
                            <b>الأسم: {props.customerName}</b>
                          </div>
                          <div>
                            <b>التوقيع:</b>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

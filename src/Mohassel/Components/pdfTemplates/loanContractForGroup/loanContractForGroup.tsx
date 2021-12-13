import React from 'react'
import './loanContractForGroup.scss'
import * as Barcode from 'react-barcode'
import Tafgeet from 'tafgeetjs'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  numbersToArabic,
  timeToArabicDate,
  dayToArabic,
} from '../../../../Shared/Services/utils'

const LoanContractForGroup = (props) => {
  const installments = props.data.installmentsObject.installments?.filter(
    (installment) => installment.id !== 0
  )

  const getAge = (birthDate: number) => {
    const diff = Date.now() - birthDate
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diff / day)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)
    return years
  }
  const leaderName = props.data.group.individualsInGroup.find(
    (individualInGroup) => individualInGroup.type === 'leader'
  ).customer.customerName
  return (
    <>
      <div className="loan-contract" dir="rtl" lang="ar">
        <table className="report-container">
          <thead className="report-header">
            <tr>
              <th className="report-header-cell">
                <div className="header-info">
                  <table className="textcenter bottomborder">
                    <tbody>
                      <tr>
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
                            <th colSpan={6}>
                              <div className="logo-print-tb" />
                            </th>
                            <th colSpan={6}>
                              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2)
                              لسنه 2015
                            </th>
                          </tr>
                          <tr style={{ height: '10px' }} />
                        </table>
                        <td>
                          <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                          <div>Tasaheel Microfinance S.A.E</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="report-content">
            <tr>
              <td
                className="report-content-cell"
                style={{ textAlign: 'right' }}
              >
                <div className="main">
                  <div className="headtitle textcenter">
                    عقد تمويل متناهي الصغر (جماعي)
                  </div>
                  <div className="headtitle textcenter">
                    <u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u>
                  </div>
                  <div>
                    انه في يوم &nbsp;{' '}
                    {dayToArabic(new Date(props.data.creationDate).getDay())}{' '}
                    &nbsp; الموافق &nbsp;
                    {timeToArabicDate(props.data.creationDate, false)}
                  </div>
                  <div>
                    حرر هذا العقد في فرع {props.branchDetails.name} الكائن في:
                    {props.branchDetails.address} بين كلا من :-
                  </div>
                  <table className="stakeholders">
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div>
                            <b>أولا:</b> شركة تساهيل للتمويل متناهي الصغر - شركه
                            مساهمه مصريه - مقيده بسجل تجاري استثمار القاهره تحت
                            رقم ٨٤٢٠٩ والكائن مقرها 3 شارع الزهور - المهندسين -
                            الجيزه والمقيده تحت رقم ٢ بهيئة الرقابه الماليه
                            ويمثلها في هذا العقد السيد/
                            _______________________________ بصفته مدير الفرع
                            بموجب تفويض صادر له من السيد/ منير اكرام نخله - رئيس
                            مجلس الإداره بتاريخ ٢٠١٦/٠٥/١٠
                          </div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف أول - مقرض&quot;</td>
                      </tr>
                      <tr>
                        <td>
                          <div>
                            <b> ثانيا:- مجموعة السيدات/السادة :-</b>
                          </div>
                        </td>
                      </tr>
                      {props.data.group.individualsInGroup.map(
                        (individualInGroup, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div>
                                  <span>
                                    السيدة&nbsp;
                                    {individualInGroup.customer.customerName}
                                    {individualInGroup.type === 'leader'
                                      ? ' (رئيس المجموعة)'
                                      : ''}
                                  </span>
                                </div>
                              </td>
                              <td>
                                السن:
                                {getAge(individualInGroup.customer.birthDate)}
                              </td>
                              <td style={{ width: '30%' }}>
                                <div>
                                  <b>عنوان المنزل:&nbsp;</b>
                                  <span>
                                    {
                                      individualInGroup.customer
                                        .customerHomeAddress
                                    }
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b className="word-break">رقم قومي</b>
                                  <span>
                                    {numbersToArabic(
                                      individualInGroup.customer.nationalId
                                    )}
                                  </span>
                                </div>
                              </td>
                              {/* <td>
                              <div>
                                <b>تليفون</b>
                                <div style={{ display: 'inline-block', width: '80px' }}>{numbersToArabic(individualInGroup.customer.mobilePhoneNumber) + "-" + numbersToArabic(individualInGroup.customer.homePhoneNumber) + "-" + numbersToArabic(individualInGroup.customer.businessPhoneNumber)}</div>
                              </div>
                            </td> */}
                            </tr>
                          )
                        }
                      )}

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف ثان - مقترضين&quot;</td>
                      </tr>
                    </tbody>
                  </table>

                  <section>
                    <div className="title">تمهيد</div>
                    <div>
                      لما كانت الشركه الطرف الأول (المقرض) مرخصا لها بممارسة
                      نشاط التمويل متناهي الصغر والمقيده لدي الهيئه العامه
                      للرقابه الماليه تحت رقم ٢ وذلك اعمالا لاحكام القانون رقم
                      ١٤١ لسنه ٢٠١٤ الخاص بالتمويل متناهي الصغر ..
                    </div>
                    <div>
                      وقد تقدم افراد الطرف الثاني بطلب للحصول علي قرض من فرع
                      &nbsp; {props.branchDetails.name} الكائن &nbsp;{' '}
                      {props.branchDetails.address} لحاجتهم للسيوله النقديه يخصص
                      استخدامه في تمويل {props.loanUsage} لنشاط كل عضوه وذلك
                      وفقا لاحكام القانون رقم ١٤١ لسنة ٢٠١٤ المشار اليه وقد
                      وافقهم الطرف الأول علي ذلك وفقا للشروط والضوابط الوارده
                      بهذا العقد وبعد ان اقر الطرفان بأهليتهم القانونيه للتصرف
                      والتعاقد فقد اتفقوا علي بنود العقد التاليه
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الأول</div>
                    <div>
                      يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه
                      مرفقات أو ملاحق موقعه من الطرفين ان وجدت
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثاني</div>
                    <div>
                      يقر أفراد الطرف الثاني (المقترضين) باستلامهم من الطرف
                      الاول (المقرض) مبلغ وقدره
                      {`${numbersToArabic(
                        props.data.principal
                      )} جنيه = (${new Tafgeet(
                        props.data.principal,
                        'EGP'
                      ).parse()})`}
                      نقداً موزع بينهم على النحو التالي:
                    </div>
                    <table className="stakeholders">
                      <tbody>
                        {props.data.group.individualsInGroup.map(
                          (individualInGroup, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div>
                                    <span>
                                      السيدة&nbsp;
                                      {individualInGroup.customer.customerName}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ width: '30%' }}>
                                  <div>
                                    <b>مبلغ التمويل: </b>
                                    <span>
                                      {numbersToArabic(
                                        individualInGroup.amount
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td />
                                <td>
                                  {new Tafgeet(
                                    individualInGroup.amount,
                                    'EGP'
                                  ).parse()}
                                </td>
                                <td>
                                  <div>
                                    <b className="word-break"> و ذلك لنشاط </b>
                                    <span>
                                      {individualInGroup.customer
                                        .businessSector +
                                        '-' +
                                        individualInGroup.customer
                                          .businessActivity +
                                        '-' +
                                        individualInGroup.customer
                                          .businessSpeciality}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        )}
                      </tbody>
                    </table>
                  </section>

                  <section>
                    <div className="title">البند الثالث</div>
                    <div>
                      يلتزم الطرف الثاني ضامنين متضامنين فيما بينهم بسداد اجمالي
                      قيمة القرض البالغة {numbersToArabic(props.data.principal)}
                      جنيه وكافة المصروفات الإداريه البالغه
                      {numbersToArabic(props.data.applicationFeesRequired)} جنيه
                      بواقع
                      {numbersToArabic(
                        props.data.applicationFeesRequired /
                          props.data.group.individualsInGroup.length
                      )}
                      جنيه لكل عضو وتكاليف التمويل البالغه
                      {numbersToArabic(
                        props.data.installmentsObject.totalInstallments.feesSum
                      )}
                      جنيه الي الطرف الأول وذلك بواقع مبلغ قدره
                      {`${numbersToArabic(
                        props.data.installmentsObject.totalInstallments
                          .installmentSum +
                          (props.data.applicationFeesRequired
                            ? props.data.applicationFeesRequired
                            : 0)
                      )} جنيه (${new Tafgeet(
                        props.data.installmentsObject.totalInstallments
                          .installmentSum +
                          (props.data.applicationFeesRequired
                            ? props.data.applicationFeesRequired
                            : 0),
                        'EGP'
                      ).parse()})`}
                      &nbsp; ، يتم سداده علي
                      {numbersToArabic(installments.length)}
                      قسط كل &nbsp;{' '}
                      {numbersToArabic(props.data.product.periodLength)}
                      {props.data.product.periodType === 'days'
                        ? local.day
                        : local.month}
                      &nbsp; قيمة كل قسط
                      {`${numbersToArabic(
                        installments[0].installmentResponse
                      )} جنيه (${new Tafgeet(
                        installments[0].installmentResponse,
                        'EGP'
                      ).parse()})`}
                      ، تبدأ في
                      {timeToArabicDate(installments[0].dateOfPayment, false)}
                      وينتهي في
                      {timeToArabicDate(
                        installments[installments.length - 1].dateOfPayment,
                        false
                      )}
                      علي ان يتم السداد النقدي بمقر فرع الطرف الأول الكائن في
                      &nbsp; {props.branchDetails.name} طرف الأول وذلك &nbsp;{' '}
                      {props.branchDetails.address} أو بأحدي وسائل الدفع
                      الإلكتروني المعتمده من هيئه الرقابه الماليه
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الرابع</div>
                    <div>
                      يقر افراد الطرف الثاني بأنهم ضامنين متضامنين فيما بينهم
                      بسداد كافة المبالغ الوارده بالبند السابق وفقا للمواعيد
                      المذكوره به وان هذه المبالغ تعد قيمة القرض وكافة مصروفاته
                      و تكاليف تمويله
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الخامس</div>
                    <div>
                      يلتزم افراد الطرف الثاني ضامنين متضامنين فيما بينهم بسداد
                      اقساط القرض وفقا لما هو وارد بالبند الثالث من هذا العقد
                      وفي حالة تأخير أي منهم في سداد قيمه أي قسط في تاريخ
                      استحقاقه تلتزم الأعضاء بسداد غرامة تأخير قدرها ٣% من قيمة
                      القسط في اليوم التالي لتاريخ الأستحقاق القسط وابتداء من
                      اليوم الذي يليه كالتالي :-
                    </div>
                    <div>
                      يتم تحصيل ٢ ج لكل عضوة عن كل يوم تأخير اذا كان مبلغ
                      التمويل للمجموعة أقل من ١٠٠٠٠ ج
                    </div>
                    <div>
                      يتم تحصيل ٣ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ
                      التمويل للمجموعة يتراوح من ١٠٠٠٠ ج حتي أقل من ١٥٠٠٠ ج
                    </div>
                    <div>
                      يتم تحصيل ٤ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ
                      التمويل للمجموعة يتراوح من ١٥٠٠٠ ج حتي أقل من ٢٠٠٠٠ ج
                    </div>
                    <div>
                      يتم تحصيل ٥ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ
                      التمويل للمجموعة يتراوح من ٢٠٠٠٠ ج حتي أقل من ٥٠٠٠٠ ج
                    </div>
                    <div>
                      يتم تحصيل ١٠ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ
                      التمويل للمجموعة يتراوح من ٥٠٠٠٠ ج حتي أقل من ١٠٠٠٠٠ ج
                    </div>
                    <div>
                      يتم تحصيل ١٥ ج لكل عضوة عن كل يوم تأخير إذا كان مبلغ
                      التمويل للمجموعة يساوي ١٠٠٠٠٠ ج
                    </div>
                  </section>

                  <section>
                    <div className="title">البند السادس</div>
                    <div>
                      تلتزم الشركه بقبول طلب العميل بالسداد المعجل، ويحق للشركه
                      خصم تكلفة التمويل للشهر الذى تم فيه السداد ويجوز لها إضافة
                      عمولة سداد معجل بما لا يزيد عن
                      {numbersToArabic(props.data.product.earlyPaymentFees)}% من
                      باقي المبلغ المستحق (أصل) المراد تعجيل الوفاء به
                    </div>
                  </section>

                  <section>
                    <div className="title">البند السابع</div>
                    <div>
                      في حالة عدم التزام ايا من المقترضين بأي من التزاماته
                      التعاقديه او القانونيه الوارده بهذا العقد وملحقاته
                      ومرفقاته الموقعه (ان وجدت) وبالقوانين الساريه في اي وقت من
                      الأوقات يعد جميع افراد الطرف الثانى مخفقين في الوفاء
                      بالتزماتهم التعاقديه اوالقانونيه ويعتبر هذا العقد مفسوخا
                      من تلقاء نفسه دون حاجه الي اعذار او اتخاذ اجراءات قضائيه
                      ويحق للطرف الاول فورا مطالبة افراد الطرف الثاني ضامنين
                      متضامنين فيما بينهم بباقي قيمة القرض وكافة مصروفاته و
                      تكاليف تمويله
                    </div>
                    <div>
                      ومن حالات الاخفاق علي سبيل المثال وليس الحصر ما يلي:-
                    </div>
                    <div>
                      ٧/١ عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط
                      الوارده بهذا العقد
                    </div>
                    <div>
                      ٧/٢ في حالة إستخدام مبلغ القرض في غير الغرض الممنوح من
                      أجله الوارد بهذا العقد
                    </div>
                    <div>
                      ٧/٣ في حالة تقديم ايا من اطراف الطرف الثاني بيانات أو
                      معلومات مخالفه للواقع او غير سليمه وذلك الي المقرض.
                    </div>
                    <div>
                      ٧/٤ في حاله فقد ايا من افراد الطرف الثاني اهليته أو اشهار
                      افلاسه او اعساره او وفاته او وضعه تحت الحراسه او توقيع
                      الحجز علي امواله او وضع امواله تحت التحفظ ومنعه من التصرف
                      فيها او انقضائه او اندماجه او وضعه تحت التصفيه
                    </div>
                    <div>
                      ٧/٥ اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز
                      الادارى او البيع الجبري علي المشروع الممول بالقرض كله او
                      بعضه، او اذا تم التصرف في جزء او كل من المشروع الممول او
                      اذا تم تأجيره للغير.
                    </div>
                    <div>
                      ٧/٦ في حالة عدم قدرة ايا من افراد الطرف الثاني علي سداد
                      الاقساط في مواعيدها او توقف اعمال المشروع الممول لاي سبب
                      من الاسباب
                    </div>
                    <div>
                      ٧/٧ يلتزم الطرف الثاني بسداد كافة المصروفات و المصاريف
                      القضائية بكافة انواعها
                    </div>
                  </section>

                  <section style={{ pageBreakAfter: 'always' }}>
                    <div className="title">البند الثامن</div>
                    <div>
                      يلتزم كل طرف من أطراف هذا العقد بسداد الضريبه المستحقه
                      عليه وفقا لاحكام القانون
                    </div>
                  </section>

                  <section>
                    <div className="title">البند التاسع</div>
                    <div>
                      تسري أحكام القانون رقم ١٤١ لسنة ٢٠١٤ بشأن تمويل منتناهي
                      الصغر و لائحته التنفيذية وتعديلاته (إن وجد) على هذا العقد
                      وتعتبر مكمله له وتختص المحاكم الإقتصادية بالفصل في أي نزاع
                      قد ينشأ بخصوص تفسير أو تنفيذ أي بند من بنود هذا العقد كما
                      تطبق أحكام القوانين السارية بجمهورية مصر العربية في حالة
                      خلو القانون المشار إليه من تنظيم النزاع المطروح على
                      المحكمة
                    </div>
                  </section>

                  <section>
                    <div className="title">البند العاشر</div>
                    <div>
                      من المتفق بين الطرفين ان الشركة ( الطرف الاول ) يحق لها
                      توريق محفظة ديونها لدى الغير او خصمها - كما يحق للطرف
                      الاول ان يحيل كافة حقوقه الناشئة عن هذا العقد او جزء منها
                      الى الغير . ويحق له الافصاح للجهة المحال اليها عن كافة
                      بيانات الطرف الثانى ويعد توقيع الطرف الثانى وضامنية على
                      هذا العقد موافقتهم على قيام الطرف الاول بحوالة تلك الحقوق
                      او جزء منها الى الغير وذلك يشمل كافة الجهات وشركات التمويل
                      والبنوك والمؤسسات التى تباشر نشاط التوريق والمباشرة
                      للانشطة المالية غير المصرفية وغيرها من كافة الانشطة
                      المتعلقة بسوق المال
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الحادي عشر</div>
                    <div>
                      اطلع العميل علي كافة الشروط الوارده بالعقد وتم شرحها له،
                      وتم تسليمه نسخه من بيان شروط التمويل موضحا به كافة الشروط.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثاني عشر</div>
                    <div>
                      اتخد كل طرف العنوان المبين قرين كل منهما بصدر هذا العقد
                      محلاً مختار له وفي حالة تغيير أياً منهم لعنوانه يلتزم
                      بأخطار الطرف الاخر بموجب خطاب مسجل بعلم الوصول وإلا اعتبر
                      إعلانه على العنوان الاول صحيحاً ونافذاً ومنتجاً لكافة
                      اثاره القانونية.
                    </div>
                  </section>

                  <table className="signature_space">
                    <tbody>
                      <tr>
                        <td style={{ paddingBottom: 100 }}>
                          <div>
                            <b>الطرف الأول</b>
                          </div>
                          <div>
                            <b>الأسم:</b>
                          </div>
                          <div>
                            <b>التوقيع:</b>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div>
                            <b>افراد الطرف الثاني</b>
                          </div>
                        </td>
                      </tr>
                      {props.data.group.individualsInGroup.map(
                        (individualInGroup, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ paddingBottom: 100 }}>
                                <div>
                                  <b>
                                    الأسم:
                                    {individualInGroup.customer.customerName}
                                  </b>
                                </div>
                                <div>
                                  <b>التوقيع:</b>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="main">
                  <div className="headtitle textcenter">
                    <u>إقرار وتعهد</u>
                  </div>
                  <div>
                    نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا بسداد وتسليم قيمة
                    الاقساط المستحقه في مواعيدها المحدده بموجب عقد القرض المؤرخ
                    في {timeToArabicDate(props.data.creationDate, false)} وحتي
                    تمام سدادها بالكامل، وأن يكون السداد عن طريق احد الأعضاء او
                    بواسطة من ينوب عن المجموعة الي شركة تساهيل للتمويل متناهي
                    الصغر ذاتها وبمقر خزينة فرع الشركة المتعامل معه أو بأحدي
                    وسائل الدفع الالكتروني المعتمده من هيئة الرقابة المالية ولا
                    يحق لنا بأى حال من الاحوال سداد قيمة أي قسط من الاقساط الي
                    شخص اخر غير خزينة فرع الشركة طبقا لما سبق ذكره، وأيا كان هذا
                    الصدد وتكون مسئوليتنا كاملة ويعتبر السداد المخالف لذلك لم
                    يتم ويحق للشركة الرجوع علي الاعضاء بالمجموعة في أي وقت من
                    الاوقات بقيمة مالم يتم سداده لخزينة فرع الشركة ودون أدني
                    اعتراض مننا علي ذلك وهذا اقرار منا بذلك ولا يحق لنا الرجوع
                    فيه حاليا او مستقبلا.
                  </div>
                  <div>
                    ونقر بأن الغرض من التمويل هو تطوير وزيادة رأس مال النشاط، و
                    اننا غير متضررين من الظروف الحالية والتي لها تأثير عام على
                    جميع الأنشطة الإقتصادية والمشروعات وقد ينتج عن هذه الأحداث
                    ركود في حركات البيع و الشراء
                  </div>
                  <div>
                    لذا و بناءً على رغبتنا جميعاً نرفض عمل أي جدولة للتمويل أو
                    تأجيل للاقساط أو الحصول على فترة سماح لأي اقساط مستحقة طوال
                    فترة التمويل وبأننا ملتزمون جميعاً بسداد الأقساط طبقاً لجدول
                    الأقساط المسلم لي من الشركة
                  </div>
                  <div>
                    تحريرا في {timeToArabicDate(props.data.creationDate, false)}
                  </div>

                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <div>المقرون بما فيه:</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {props.data.group.individualsInGroup.map(
                    (individualInGroup, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: 20,
                            marginBottom: 100,
                          }}
                        >
                          <div>
                            الاسم/ {individualInGroup.customer.customerName}
                          </div>
                          <div>
                            التوقيع:----------------------------------------------
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>

                <div className="main">
                  <div>
                    <div className="title_last">
                      <Barcode value={props.data.loanApplicationKey} />
                      <div>{props.data.loanApplicationKey}</div>
                      <div>
                        {timeToArabicDate(props.data.creationDate, false)}
                      </div>
                      <div>{leaderName}</div>

                      <div
                        style={{ margin: '2em', borderTop: '2px solid black' }}
                      />
                    </div>
                  </div>

                  <h2 className="textcenter">اقرار تم التوقيع امامي</h2>

                  <div>نقر نحن الموقعون ادناه:</div>
                  <div>
                    الاسم
                    <div style={{ display: 'inline-block', width: '150px' }} />
                    الموظف بشركة تساهيل للتمويل المتناهي الصغر فرع:
                    {props.branchDetails.name} -
                    {
                      props.data.group.individualsInGroup[0].customer
                        .governorate
                    }
                  </div>
                  <div>بوظيفة</div>
                  <div>
                    الاسم
                    <div style={{ display: 'inline-block', width: '150px' }} />
                    الموظف بشركة تساهيل للتمويل المتناهي الصغر فرع:
                    {props.branchDetails.name} -
                    {
                      props.data.group.individualsInGroup[0].customer
                        .governorate
                    }
                  </div>
                  <div>بوظيفة</div>
                  <div>
                    بأن توقيع كل من عضوة من اعضاء المجموعة المدرجين بالجدول تم
                    امامي وان جميع بيانات ايصالات الامانه الخاصه بهم صحيحة وتحت
                    مسئوليتي وانني قمت بمطابقة اصول بطاقات الرقم القومي لجميع
                    اعضاء المجموعه مع الصور المرفقه بطلب التمويل (وش وضهر) وانني
                    قمت بمطابقتها مع الاشخاص الحقيقيين والتأكد منهم واتحمل
                    مسئولية ذلك.
                  </div>

                  <table className="endorsement_table">
                    <thead>
                      <tr>
                        <th>
                          <b>م</b>
                        </th>
                        <th>
                          <b>اسم العضو</b>
                        </th>
                        <th>
                          <b>الكود</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data.group.individualsInGroup.map(
                        (individualInGroup, index) => {
                          return (
                            <tr key={index}>
                              <td>{numbersToArabic(index + 1)}</td>
                              <td>{individualInGroup.customer.customerName}</td>
                              <td>
                                {numbersToArabic(
                                  individualInGroup.customer.key
                                )}
                              </td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  </table>

                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <div style={{ marginBottom: 30 }}>
                            القائم بالمراجعه
                          </div>
                          <div style={{ marginBottom: 100 }}>
                            الاسم: --------------------------
                          </div>
                          <div style={{ marginBottom: 100 }}>
                            التوقيع: -------------------------
                          </div>
                        </td>
                        <td>
                          <div style={{ marginBottom: 30 }}>القائم بالصرف</div>
                          <div style={{ marginBottom: 100 }}>
                            الاسم: --------------------------
                          </div>
                          <div style={{ marginBottom: 100 }}>
                            التوقيع: -------------------------
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="main">
                  <div className="last">
                    <div className="title_last">
                      <Barcode value={props.data.loanApplicationKey} />
                      <div>{props.data.loanApplicationKey}</div>
                      <div>
                        {timeToArabicDate(props.data.creationDate, false)}
                      </div>
                      <div>{leaderName}</div>

                      <div
                        style={{ margin: '2em', borderTop: '2px solid black' }}
                      />
                      <Barcode value={props.data.loanApplicationKey} />
                      <div>{props.data.loanApplicationKey}</div>
                      <div>
                        {timeToArabicDate(props.data.creationDate, false)}
                      </div>
                      <div>{leaderName}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LoanContractForGroup

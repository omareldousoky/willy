import React from 'react';
import './loanContract.scss';
import * as Barcode from 'react-barcode';
import * as local from '../../../../Shared/Assets/ar.json';
import { numbersToArabic, timeToArabicDate, dayToArabic, timeToArabicDateNow } from "../../../../Shared/Services/utils";
import Tafgeet from 'tafgeetjs';

const LoanContract = (props) => {
  function getNumbersOfGuarantor(str: string) {
    if (str === 'and') str = 'و'
    else str = 'او'
    switch (props.data.guarantors.length) {
      case 1: return ` الثالث`;
      case 2: return ` الثالث ${str} الرابع`;
      case 3: return ` الثالث ${str} الرابع ${str} الخامس`;
      case 4: return `الثالث ${str} الرابع ${str} الخامس ${str} السادس `;
      case 5: return `الثالث ${str} الرابع ${str} الخامس ${str} السادس ${str} السابع `;
      case 6: return `الثالث ${str} الرابع ${str} الخامس ${str} السادس ${str} السابع ${str} الثامن `;
      default: return '';
    }
  }
  function getIndexOfGuarantorInAr(index: number) {
    switch (index) {
      case -2: return 'الأول';
      case -1: return 'الثاني';
      case 0: return 'الثالث';
      case 1: return 'الرابع';
      case 2: return 'الخامس';
      case 3: return 'السادس';
      case 4: return 'السابع';
      case 5: return 'الثامن';
      default: return '';
    }
  }
  function getIndexInArabic(index: number) {
    switch (index) {
      case 0: return ['ثالثا', 'ثالث'];
      case 1: return ['رابعا', 'رابع'];
      case 2: return ['خامسا', 'خامس'];
      case 3: return ['سادسا', 'سادس'];
      case 4: return ['سابعا', 'سابع'];
      case 5: return ['ثامنا', 'ثامن'];
      default: return ['', '']
    }
  }
  return (
    <>
      <div className="loan-contract" dir="rtl" lang="ar">
        <table className="report-container">
          <thead className="report-header">
            <tr>
              <th className="report-header-cell">
                <div className="header-info">
                  <table className="textcenter bottomborder">
                    <thead>
                      <tr>
                        <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                          <thead>
                            <tr style={{ height: "10px" }}></tr>
                            <tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><th colSpan={6}><div className={"logo-print"}></div></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                            <tr style={{ height: "10px" }}></tr>
                          </thead>
                        </table>
                        <th>
                          <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                          <div>Tasaheel Microfinance S.A.E</div>
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="report-content">
            <tr>
              <td className="report-content-cell" style={{ textAlign: 'right' }}>
                <div className="main">

                  <div className="headtitle textcenter">عقد تمويل متناهي الصغر (فردي)</div>
                  <div className="headtitle textcenter"><u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u></div>
                  <div>انه في يوم {dayToArabic(new Date(props.data.creationDate).getDay())} الموافق {timeToArabicDate(props.data.creationDate, false)}</div>
                  <div>حرر هذا العقد في فرع {props.branchDetails.name} الكائن في:{props.branchDetails.address} بين كلا من:-</div>
                  <table className="stakeholders">
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div>
                            <b>أولا:</b> شركة تساهيل للتمويل متناهي الصغر - شركه مساهمه مصريه - مقيده
                                                    بسجل
                                                    تجاري استثمار
                                                    القاهره تحت رقم ٨٤٢٠٩ والكائن مقرها 3 شارع الزهور - المهندسين - الجيزه
                                                    والمقيده تحت رقم ٢
                                                    بهيئة الرقابه الماليه ويمثلها في هذا العقد السيد/ _______________________________ بصفته مدير الفرع بموجب
                                                    تفويض صادر له من
                                                    السيد/ منير اكرام نخله - رئيس مجلس الإداره بتاريخ ٢٠١٦/٠٥/١٠
										</div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف أول - مقرض&quot;</td>
                      </tr>

                      <tr>
                        <td>
                          <div>
                            <b>ثانيا:- السيد :-</b>
                            <span>{props.data.customer.customerName}</span>
                          </div>
                        </td>
                        <td style={{ width: '30%' }}>
                          <div>
                            <b>الكائن:</b>
                            <span>
                              {props.data.customer.customerHomeAddress}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <b className="word-break">رقم قومي</b>
                            <span>
                              {numbersToArabic(props.data.customer.nationalId)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <b>تليفون</b>
                            <div style={{ display: 'inline-block', width: '80px' }}>{numbersToArabic(props.data.customer.mobilePhoneNumber) + "-" + numbersToArabic(props.data.customer.homePhoneNumber) + "-" + numbersToArabic(props.data.customer.businessPhoneNumber)}</div>
                          </div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف ثان - مقترض&quot;</td>
                      </tr>
                      {props.data.guarantors.map((guarantor, index) => {
                        return (
                          <>
                            <tr>
                              <td>
                                <div>
                                  <b>{getIndexInArabic(index)[0]}:- السيد :-</b>
                                  <span>{guarantor.customerName}</span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b>الكائن:</b>
                                  <span>
                                    {guarantor.customerHomeAddress}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b className="word-break">رقم قومي</b>
                                  <span>
                                    {numbersToArabic(guarantor.nationalId)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b>تليفون</b>
                                  <span>
                                    {numbersToArabic(guarantor.mobilePhoneNumber) + "-" + numbersToArabic(guarantor.homePhoneNumber) + "-" + numbersToArabic(guarantor.businessPhoneNumber)}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                              <td colSpan={4}>&quot;طرف {getIndexInArabic(index)[1]} - ضامن متضامن&quot;</td>
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </table>


                  <section>
                    <div className="title">تمهيد</div>
                    <div>لما كانت الشركه الطرف الأول (المقرض) مرخصا لها بممارسة نشاط التمويل متناهي الصغر
                    والمقيده لدي الهيئه العامه
                    للرقابه الماليه تحت رقم ٢ وذلك اعمالا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤ الخاص
                    بالتمويل
								متناهي الصغر ..</div>
                    <div>
                      وقد تقدم الطرف الثاني صاحب نشاط {props.data.customer.businessSector} - {props.data.customer.businessActivity} بطلب للحصول علي قرض من فرع
                    {props.branchDetails.name} الكائن
                    {props.branchDetails.address} لحاجته للسيوله النقديه يخصص
                    استخدامه في
                    تمويل رأس المال
                    العامل وذلك وفقا لاحكام القانون رقم ١٤١ لسنة ٢٠١٤ المشار اليه وذلك بضمان وتضامن
                    الطرف
                    {getNumbersOfGuarantor('and')} وقد
                    وافقه الطرف الأول علي ذلك وفقا للشروط والضوابط الوارده بهذا العقد وبعد ان اقر
                    الأطراف
                    بأهليتهم القانونيه
                    للتصرف والتعاقد فقد اتفقوا علي بنود العقد التاليه
							</div>
                  </section>

                  <section>
                    <div className="title">
                      البند الأول
							</div>
                    <div>
                      يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه مرفقات أو ملاحق موقعه من
                      الطرفين ان وجدت
							</div>
                  </section>

                  <section>
                    <div className="title">البند الثاني</div>
                    <div>بموجب هذا العقد وافق الطرف الأول علي منح الطرف الثاني قرضا بمبلغ {`${numbersToArabic(props.data.principal)} جنيه (${new Tafgeet(props.data.principal, 'EGP').parse()})`} ويقر
                  الطرف الثاني بأن هذا المبلغ يمثل قرضا عليه يلتزم بسداده للطرف الأول وفقا لما هو وارد
                  بالبند الثالث من هذا
                  العقد
							</div>
                  </section>

                  <section>
                    <div className="title">البند الثالث</div>
                    <div>يلتزم الطرفان الثاني و{getNumbersOfGuarantor('and')} ضامنين متضامنين فيما بينهم بسداد اجمالي قيمة
                  القرض
                  البالغة {`${numbersToArabic(props.data.principal)} جنيه (${new Tafgeet(props.data.principal, 'EGP').parse()})`}
                  وكافة المصروفات الادارية البالغه {numbersToArabic(props.data.applicationFeesRequired)} جنيه وتكاليف التمويل البالغه {numbersToArabic(props.data.installmentsObject.totalInstallments.feesSum)} جنيه الي الطرف
                  الأول وذلك بواقع مبلغ
                  قدره {`${numbersToArabic(props.data.installmentsObject.totalInstallments.installmentSum + (props.data.applicationFeesRequired ? props.data.applicationFeesRequired : 0))} جنيه (${new Tafgeet((props.data.installmentsObject.totalInstallments.installmentSum + (props.data.applicationFeesRequired ? props.data.applicationFeesRequired : 0)), 'EGP').parse()})`}، يتم
                  سداده
                   علي عدد {numbersToArabic(props.data.installmentsObject.installments.length)} قسط كل {numbersToArabic(props.data.product.periodLength)} {props.data.product.periodType === 'days' ? local.day : local.month}
                  قيمة كل قسط {`${numbersToArabic(props.data.installmentsObject.installments[0].installmentResponse)} جنيه (${new Tafgeet(props.data.installmentsObject.installments[0].installmentResponse, 'EGP').parse()})`} ، تبدأ في
                  {timeToArabicDate(props.data.installmentsObject.installments[0].dateOfPayment, false)} وينتهي في
                  {timeToArabicDate(props.data.installmentsObject.installments[props.data.installmentsObject.installments.length - 1].dateOfPayment, false)} علي ان يتم السداد النقدي بمقر فرع الطرف الأول الكائن في {props.branchDetails.name} {props.branchDetails.address} أو
                  بأحدي وسائل الدفع
								الإلكتروني المعتمده من هيئه الرقابه الماليه</div>
                  </section>

                  <section>
                    <div className="title">البند الرابع</div>
                    <div>يقر الطرفان الثاني و{getNumbersOfGuarantor('and')} متضامنين فيما بينهم بسداد كافة المبالغ الوارده
                  بالبند السابق وفقا
                  للمواعيد المذكوره به وان هذه المبالغ تعد قيمة القرض وكافة مصروفاته و تكاليف تمويله
							</div>
                  </section>

                  <section>
                    <div className="title">البند الخامس</div>
                    <div>يلتزم الأطراف الثاني و{getNumbersOfGuarantor('and')}  متضامنين فيما بينهم بسداد اقساط القرض وفقا لما
                  هو
                  وارد بالبند الثالث
                  من هذا العقد وفي حالة تأخرهم في سداد قيمة اي قسط في تاريخ استحقاقه يلتزموا بسداد
                  غرامة
                  تأخير ٥% من قيمة
                  القسط في اليوم التالي لتاريخ الأستحقاق للقسط وابتداء من اليوم الذي يليه كالتالي :-
							</div>
                    <div>يتم تحصيل ٥ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أقل من ٢٠٠٠ جنيها</div>
                    <div>يتم تحصيل ٧.٥ جنيهات عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠ جنيها حتي ٣٠٠٠ جنيها</div>
                    <div>يتم تحصيل ١٠ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أكبر من ٣٠٠٠ جنيها</div>
                  </section>

                  <section>
                    <div className="title">البند السادس</div>
                    <div>تلتزم الشركه بقبول طلب العميل بالسداد المعجل، ويحق للشركه خصم تكلفة التمويل للشهر
                    الذى
                    تم فيه السداد ويجوز
                  لها إضافة عمولة سداد معجل بما لا يزيد عن {numbersToArabic(props.data.product.earlyPaymentFees)}% من باقي المبلغ المستحق (أصل) المراد
                  تعجيل
								الوفاء به</div>
                  </section>

                  <section>
                    <div className="title">البند السابع</div>
                    <div>في حالة عدم التزام المقترض او الضامنين بأي من التزاماتهم التعاقديه او القانونيه
                    الوارده بهذا العقد
                    وملحقاته ومرفقاته الموقعه (ان وجدت) وبالقوانين الساريه في اي وقت من الأوقات يعد
                    الأطراف
                   الثاني و{getNumbersOfGuarantor('and')} مخفقين في الوفاء بالتزاماتهم التعاقديه والقانونيه ويعتبر هذا العقد مفسوخا من
                  تلقاء نفسه دون الحاجه
                  للرجوع الي اعذار او اتخاذ اجراءات قضائيه ويحق للطرف الاول فورا مطالبة أى من الطرفين
                  الثاني أو {getNumbersOfGuarantor('and')} أو جميعهم بباقي قيمة القرض وكافة مصروفاته و تكاليف تمويله </div>
                    <div>ومن حالات الاخفاق علي سبيل المثال وليس الحصر ما يلي:-</div>
                    <div>٧/١ عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط الوارده بهذا العقد</div>
                    <div>٧/٢ في حالة إستخدام مبلغ القرض في غير الغرض الممنوح من أجله الوارد بهذا العقد</div>
                    <div>٧/٣ في حالة تقديم الطرف الثاني أو {getNumbersOfGuarantor('or')} بيانات أو معلومات مخالفه للواقع
                  او
                  غير سليمه وذلك الي
								المقرض.</div>
                    <div>٧/٤ في حاله فقد الطرف الثاني أو {getNumbersOfGuarantor('or')} اهليته أو اشهار افلاسه او اعساره
                  او
                  وفاته او وضعه تحت
                  الحراسه او توقيع الحجز علي امواله او وضع امواله تحت التحفظ ومنعه من التصرف فيها او
                  انقضائه او اندماجه او
								وضعه تحت التصفيه</div>
                    <div>٧/٥ اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز الادارى او البيع الجبري علي
                    المشروع
                    الممول بالقرض كله
                    او بعضه، او اذا تم التصرف في جزء او كل من المشروع الممول او اذا تم تأجيره للغير.
							</div>
                    <div>٧/٦ في حالة عدم قدرة الطرف الثاني أو {getNumbersOfGuarantor('or')} علي سداد الاقساط في مواعيدها
                  او
                  توقف اعمال المشروع
								الممول لاي سبب من الاسباب</div>
                  </section>

                  <section style={{ pageBreakAfter: "always" }}>
                    <div className="title">البند الثامن</div>
                    <div>يلتزم كل طرف من أطراف هذا العقد بسداد الضريبه المستحقه عليه وفقا لاحكام القانون
							</div>
                  </section>
                  <tbody>
                    <section>
                      <div className="title">البند التاسع</div>
                      <div>يقر الطرف {getNumbersOfGuarantor('and')} الضامنين المتضامنين بأنها يكفلا علي سبيل التضامن الطرف
                  الثاني
                  لقيمة هذا القرض من
                  اصل وعوائد وعمولات وكافة المصروفات المستحقة بموجب هذا العقد وايا من ملحقاته، ويحق
                  للمقرض
                  الرجوع عليه بكامل
                  قيمة المديونيات المستحقه علي هذا القرض، ولا يحق للطرف {getNumbersOfGuarantor('or')} الدفع
                  بالتجريد أو
                  التقسيم أو اي دفوع
                  اخرى في مواجهة المقرض ويحق للمقرض الرجوع عليه وحده او الرجوع عليه وعلي المقترض
                  منفردا او
                  مجتمعين معا بكامل
								قيمة المديونيات المستحقه له.</div>
                    </section>

                    <section>
                      <div className="title">البند العاشر</div>
                      <div>اطلع العميل علي كافة الشروط الوارده بالعقد وتم شرحها له، وتم تسليمه نسخه من بيان
                      شروط
                      التمويل موضحا به كافة
								الشروط.</div>
                    </section>

                    <section>
                      <div className="title">البند الحادي عشر</div>
                      <div>تسرى احكام القانون رقم ١٤١ لسنة ٢٠١٤ بشأن التمويل متناهي الصغر ولائحته التنفيذيه
                      وتعديلاته (ان وجد) علي هذا
                      العقد وتعتبر مكمله له وتختص المحاكم الإقتصاديه بالفصل في اي نزاع قد ينشأ بخصوص تفسير
                      أو
                      تنفيذ اي بند من بنود
								هذا العقد</div>
                      <div>كما تطبق أحكام القوانين الساريه بجمهورية مصر العربيه في حالة خلو القانون المشار
                      إليه من
                      تنظيم النزاع
								المطروح علي المحكمه.</div>
                    </section>

                    <section>
                      <div className="title">البند الثاني عشر</div>
                      <div>اتخذ كل طرف العنوان المبين قرين كل منهما بصدر هذا العقد محلا مختار له وفي حالة
                      تغيير
                      ايا منهم لعنوانه يلتزم
                      بأخطار الطرف الاخر بموجب خطاب مسجل بعلم الوصول والا اعتبر اعلانه علي العنوان الاول
                      صحيحا
                      ونافذا ومنتجا لكافه
								اثاره القانونيه.</div>
                    </section>

                    <table className="signature_space">

                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: 70 }}>
                            <div><b>الطرف الأول</b></div>
                            <div style={{ marginBottom: 30 }}><b>الأسم:</b></div>
                            <div><b>التوقيع:</b></div>
                          </td>
                          <td style={{ paddingBottom: 70 }}>
                            <div><b>الطرف الثاني</b></div>
                            <div style={{ marginBottom: 30 }}><b>الأسم:</b></div>
                            <div><b>التوقيع:</b></div>
                          </td>
                        </tr>
                        <tr>

                          {props.data.guarantors.map((_guarantor, index) => {
                            return (
                              <td key={index} style={{ paddingBottom: 70 }}>
                                <div><b>الطرف {getIndexOfGuarantorInAr(index)}</b></div>
                                <div style={{ marginBottom: 20 }}><b>الأسم:</b></div>
                                <div><b>التوقيع:</b></div>
                              </td>
                            )
                          })}
                        </tr>

                      </tbody>
                    </table>

                  </tbody>
                </div>

                <div className="main">
                  <tbody>

                    <div className="headtitle textcenter"><u>إقرار وتعهد</u></div>
                    <div>نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا بسداد وتسليم قيمة الاقساط المستحقه في مواعيدها
                    المحدده بموجب عقد
                 القرض المؤرخ في {timeToArabicDateNow(false)} وحتي تمام سدادها بالكامل، وأن يكون السداد عن طريق العميل او من
                ينوب عنه الي شركة
                تساهيل للتمويل متناهي الصغر ذاتها وبمقر خزينة فرع الشركة المتعامل معه أو عبر وسائل الدفع
                الالكتروني المعتمده
                من هيئة الرقابة المالية ولا يحق لنا بأى حال من الاحوال سداد قيمة أي قسط من الاقساط الي
                شخص اخر غير خزينة فرع
                الشركة طبقا لما سبق ذكره، وأيا كان هذا الصدد وتكون مسئوليتنا كاملة ويعتبر السداد المخالف
                لذلك لم يتم ويحق
                للشركة الرجوع علي العميل والضامنين في أي وقت من الاوقات بقيمة مالم يتم سداده لخزينة فرع
                الشركة ودون أدني
							اعتراض مننا علي ذلك وهذا اقرار منا بذلك ولا يحق لنا الرجوع فيه حاليا او مستقبلا.</div>
                    <div>تحريرا في {timeToArabicDateNow(false)}</div>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <div>المقرون بما فيه:</div>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: 80 }}>
                            <div>الاسم/ {props.data.customer.customerName}</div>
                          </td>
                          <td style={{ paddingBottom: 80 }}>
                            <div>التوقيع:-----------------------</div>
                          </td>
                        </tr>
                        {props.data.guarantors.map((guarantor, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ paddingBottom: 80 }}>
                                <div>الاسم/ {guarantor.customerName}</div>
                              </td>
                              <td style={{ paddingBottom: 80 }}>
                                <div>التوقيع:-----------------------</div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </tbody>
                </div>

                <div className="main">
                  <tbody>

                    <div>
                      <div className="title_last">
                        <Barcode value={props.data.applicationKey} />
                        <div>{props.data.applicationKey}</div>
                        <div>{timeToArabicDate(props.data.creationDate, false)}</div>
                        <div>{props.data.customer.customerName}</div>

                        <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                      </div>
                    </div>

                    <h2 className="textcenter">اقرار تم التوقيع امامي</h2>

                    <div>نقر نحن الموقعون ادناه:</div>
                    <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:{props.branchDetails.name} - {props.data.customer.governorate}</div>
                    <div>بوظيفة</div>
                    <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:{props.branchDetails.name} - {props.data.customer.governorate}</div>
                    <div>بوظيفة</div>
                    <div>بأن توقيع كل من العميل والضامن المدرجين بالجدول تم امامي وان جميع بيانات ايصالات
                    الامانه الخاصه بهم صحيحة
                    وتحت مسئوليتي وانني قمت بمطابقة اصول بطاقات الرقم القومي لجميع اعضاء المجموعه مع الصور
                    المرفقه بطلب التمويل
                    (وش وضهر) وانني قمت بمطابقتها مع الاشخاص الحقيقيين والتأكد منهم واتحمل مسئولية ذلك.
						</div>

                    <table className="endorsement_table">
                      <thead>
                        <tr>
                          <th><b>م</b></th>
                          <th><b>اسم العميل / الضامن</b></th>
                          <th><b>الكود</b></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>١</td>
                          <td>{props.data.customer.customerName}</td>
                          <td>{numbersToArabic(props.data.customer.key)}</td>
                        </tr>
                        {props.data.guarantors.map((guarantor, index) => {
                          return (
                            <tr key={index}>
                              <td>{numbersToArabic(index + 2)}</td>
                              <td>{guarantor.customerName}</td>
                              <td>{numbersToArabic(guarantor.key)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                    <table>

                      <tbody>
                        <tr>
                          <td>
                            <div style={{ marginBottom: 30 }}>القائم بالمراجعه</div>
                            <div style={{ marginBottom: 100 }}>الاسم: --------------------------</div>
                            <div style={{ marginBottom: 100 }}>التوقيع: -------------------------</div>
                          </td>
                          <td>
                            <div style={{ marginBottom: 30 }}>القائم بالصرف</div>
                            <div style={{ marginBottom: 100 }}>الاسم: --------------------------</div>
                            <div style={{ marginBottom: 100 }}>التوقيع: -------------------------</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </tbody>
                </div>

                <div className="main">
                  <tbody>
                    <div className="title">إقرار بإلتزام</div>

                    <table>

                      <tbody>
                        <tr>
                          <td>
                            <div>أقر انا العميل/ {props.data.customer.customerName}</div>
                          </td>
                          <td>
                            <div><b>الكود</b> &emsp; {numbersToArabic(props.data.customer.key)}</div>
                          </td>
                        </tr>
                        <tr>
                          {props.data.guarantors.map((guarantor, index) => {
                            return (
                              <td key={index}>
                                <div>ضامن {getIndexOfGuarantorInAr(index - 2).slice(2)}/ {guarantor.customerName}</div>
                              </td>
                            )
                          })}
                        </tr>
                        <tr>
                          <td>
                            <div>نوع النشاط/ {props.data.customer.businessActivity}</div>
                          </td>
                          <td>
                            <div>الفرع/ {props.branchDetails.name} - {props.data.customer.governorate}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>بأنني قد استلمت تمويل قدره: {`${numbersToArabic(props.data.principal)} جنيه `} من شركة تساهيل للتمويل متناهي الصغر بتاريخ:
							{timeToArabicDateNow(false)}</div>
                    <div>وذلك بهدف تطوير وزيادة رأس مال النشاط، وأنني غير متضرر من الظروف الحالية والتي لها
                    تأثير عام علي جميع الأنشطة الأقتصاديه والمشروعات وقد ينتج عن هذه الاحداث ركود في حركات
							البيع والشراء.</div>
                    <div>لذا وبناء علي رغبتي ارفض عمل اي جدولة للتمويل او تأجيل للاقساط أو الحصول علي فترة سماح
							لأي اقساط مستحقه طوال فترة التمويل وبأنني ملتزم بسداد الاقساط طبقا لجدول الاقساط المسلم لي من الشركه.</div>


                    <table className="sign">
                      <tbody>
                        <tr>
                          <td colSpan={2}>
                            <b>المقر بما فيه</b>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div>العميل /</div>
                          </td>
                          <td style={{ width: "100px" }}></td>
                        </tr>
                        {props.data.guarantors.map((_guarantor, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div>الضامن {getIndexOfGuarantorInAr(index - 2)}/</div>
                              </td>
                              <td style={{ width: "100px" }}></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </tbody>
                </div>
                <div className="main">
                  <div className="last">
                    <div className="title_last">
                      <Barcode value={props.data.applicationKey} />
                      <div>{props.data.applicationKey}</div>
                      <div>{timeToArabicDate(props.data.creationDate, false)}</div>
                      <div>{props.data.customer.customerName}</div>

                      <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                      <Barcode value={props.data.applicationKey} />
                      <div>{props.data.applicationKey}</div>
                      <div>{timeToArabicDate(props.data.creationDate, false)}</div>
                      <div>{props.data.customer.customerName}</div>
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

export default LoanContract;
import React from 'react';
import './loanContract.scss';
import * as Barcode from 'react-barcode';
import * as local from '../../../../Shared/Assets/ar.json';
import { numbersToArabic, timeToArabicDate, dayToArabic } from '../../../Services/utils';
import Tafgeet from 'tafgeetjs';

const LoanContract = (props) => {
  function getNumbersOfGuarantor() {
    switch (props.data.guarantors.length) {
      case 1: return ' الثالث';
      case 2: return ' الثالث و الرابع';
      case 3: return ' الثالث و الرابع و الخامس';
      case 4: return 'الثالث و الرابع و الخامس و السادس ';
      case 5: return 'الثالث و الرابع و الخامس و السادس و السابع ';
      case 6: return 'الثالث و الرابع و الخامس و السادس و السابع و الثامن ';
      default: return '';
    }
  }
  function getIndexOfGuarantorInAr(index: number) {
    switch (index) {
      case -2: return 'الأول';
      case -1: return 'الثاني';
      case 0: return ' الثالث';
      case 1: return ' الرابع';
      case 2: return ' الخامس';
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
    <div className="loan-contract" dir="rtl" lang="ar">
      <table className="report-container">
        <thead className="report-header">
          <tr>
            <th className="report-header-cell">
              <div className="header-info">
                <table className="textcenter bottomborder">

                  <tbody>
                    <tr>
                      <td>
                        <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                        <div>Tasaheel Microfinance S.A.E</div>
                        <div>ترخيص ممارسة نشاط التمويل متناهي الصغر رقم (٢) لسنة ٢٠١٥</div>
                      </td>
                      <td>
                        <img width="150px"
                          src="data:image/jpeg;base64,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fTt1B3G5IIv12XdJsZG9hhfUVr4S0NyOnfaw4dY0CkWbNwClbRZXcixuVozHMLag5t9weKt1amhGT0+I00WZlVTTCNt8ssLo3Oa0XsZA86245V7rtoJXRUnINYJa0sDTKCWx80vcSBbNYA2Gl1sfsgx4LH1Na+NwALHzuLSOg9IXfieAxVETInNLWxFrozGSxzC3RpY4atIGijcFU26hrG0Upmq6dzOZzRTFhOosA4yHVd3lBaDT0oOo+m0niumo2JhmblqJqudt7hss7iAeBy9I6VMYng8dS1jJQ60ckcjcriOcz0STxU3LwNO1bfsVUOimm/8AUqu7SuthtK64GWSjJL2GUNs4auZxCuNbRtmjfE8HLIxzXWNjY6Gx4LU/C43Q/R3NzRZMhDtbi1telRjloQtZhVdLG6N1bTZHsLT9jO4ixt53Teora+ilhpKGNkwtDVUrZJHtuLBwDXFt92bLxUs3Y2LLyZnrHRAAcm6oeW2G4dJGm5TNVhkcsRgewOjc3KW9XAJLoQOJYNW1EUkMldTcnIwtNqUjQ9fKrl2ypTFR0kRdm5Opom5t18rmi5Fyu8bHRWDHT1j4m5bRvneWabgRxHUpfEMJjnhMD2nk7NsGmxGUggg8CLDVN9xIIuTDaHkWBnKSvsSbzPMjteGYrrVAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//Z" />
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
            <td className="report-content-cell" style={{ textAlign: 'right' }}>
              <div className="main">

                <div className="headtitle textcenter">عقد تمويل متناهي الصغر (فردي)</div>
                <div className="headtitle textcenter"><u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u></div>
                <div>انه في يوم {dayToArabic(new Date().getDay())} الموافق {timeToArabicDate(0, false)}</div>
                <div>حرر هذا العقد في فرع {props.branchDetails.name} - {props.data.customer.governorate} الكائن في:{props.branchDetails.address} بين كلا من
							:-</div>
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
                    {props.branchDetails.name} - {props.data.customer.governorate} الكائن
                    {props.branchDetails.address} لحاجته للسيوله النقديه يخصص
                    استخدامه في
                    تمويل رأس المال
                    العامل وذلك وفقا لاحكام القانون رقم ١٤١ لسنة ٢٠١٤ المشار اليه وذلك بضمان وتضامن
                    الطرف
                    {getNumbersOfGuarantor()} وقد
                    وافقه الطرف الأول علي ذلك وفقا للشروط والضوابط الوارده بهذا العقد وبعد ان اقر
                    الأطراف
                    بأهليتهم القانونيه
                    للتصرف والتعاقد فقط اتفقوا علي بنود العقد التاليه
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
                  <div>بموجب هذا العقد وافق الطرف الأول علي منح الطرف الثاني مبلغ {`${numbersToArabic(props.data.principal)} جنيه (${new Tafgeet(props.data.principal, 'EGP').parse()})`} ويقر
                  الطرف الثاني بأن هذا المبلغ يمثل قرضا عليه يلتزم بسداده للطرف الأول وفقا لما هو وارد
                  بالبند الثالث من هذا
                  العقد
							</div>
                </section>

                <section>
                  <div className="title">البند الثالث</div>
                  <div>يلتزم الطرفان الثاني و{getNumbersOfGuarantor()} ضامنين متضامنين فيما بينهم بسداد اجمالي قيمة
                  القرض
                  البالغة {`${numbersToArabic(props.data.principal)} جنيه (${new Tafgeet(props.data.principal, 'EGP').parse()})`} 
                  وكافة المصروفات الإداريه البالغه {numbersToArabic(props.data.applicationFeesRequired)} جنيه وتكاليف التمويل البالغه {numbersToArabic(props.data.installmentsObject.totalInstallments.feesSum)} جنيه الي الطرف
                  الأول وذلك بواقع مبلغ
                  قدره {`${numbersToArabic(props.data.installmentsObject.totalInstallments.installmentSum + props.data.applicationFeesRequired)} جنيه (${new Tafgeet(props.data.installmentsObject.totalInstallments.installmentSum, 'EGP').parse()})`}، يتم
                  سداده
                   علي عدد {numbersToArabic(props.data.installmentsObject.installments.length)} قسط كل {numbersToArabic(props.data.product.periodLength)} {props.data.product.periodType === 'days' ? local.day : local.month}
                  قيمة كل قسط {`${numbersToArabic(props.data.installmentsObject.installments[0].installmentResponse)} جنيه (${new Tafgeet(props.data.installmentsObject.installments[0].installmentResponse, 'EGP').parse()})`} ، تبدأ في
                  {timeToArabicDate(props.data.installmentsObject.installments[0].dateOfPayment, false)} وينتهي في
                  {timeToArabicDate(props.data.installmentsObject.installments[props.data.installmentsObject.installments.length - 1].dateOfPayment, false)} علي ان يتم السداد النقدي بمقر فرع الطرف الأول الكائن في {props.branchDetails.name} - {props.data.customer.governorate} الكائن
                    {props.branchDetails.address} أو
                  بأحدي وسائل الدفع
								الإلكتروني المعتمده من هيئه الرقابه الماليه</div>
                </section>

                <section>
                  <div className="title">البند الرابع</div>
                  <div>يقر الطرفان الثاني و{getNumbersOfGuarantor()} بسداد كافة المبالغ الوارده
                  بالبند السابق وفقا
                  للمواعيد المذكوره به وان هذه المبالغ تعد قيمة القرض وكافة مصروفاته وتكاليف تمويله
							</div>
                </section>

                <section>
                  <div className="title">البند الخامس</div>
                  <div>يلتزم الأطراف الثاني و{getNumbersOfGuarantor()} ضامنين متضامنين فيما بينهم بسداد اقساط القرض وفقا لما
                  هو
                  وارد بالبند الثالث
                  من هذا العقد وفي حالة تأخرهم في سداد قيمة اي قسط في تاريخ استحقاقه يلتزموا بسداد
                  غرامة
                  تأخير ٥% من قيمة
                  القسط في اليوم التالي لتاريخ الأستحقاق للقسط وابتداء من اليوم الذي يليه كالتالي :-
							</div>
                  <div>يتم تحصيل ٥ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أقل من ٢٠٠٠ جنيها</div>
                  <div>يتم تحصيل ٧.٥ جنيهات عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠ جنيها حتي أقل من ٣٠٠٠ جنيها</div>
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
                   الثاني و{getNumbersOfGuarantor()} مخفقين في الوفاء بالتزاماتهم التعاقديه والقانونيه ويعتبر هذا العقد مفسوخا من
                  تلقاء نفسه دون الحاجه
                  للرجوع الي اعذار او اتخاذ اجراءات قضائيه ويحق للطرف الاول فورا مطالبة أى من الطرفين
                  الثاني أو {getNumbersOfGuarantor()} أو جميعهم بباقي قيمة القرض وكافة مصروفاته وتكاليف تمويله</div>
                  <div>ومن حالات الاخفاق علي سبيل المثال وليس الحصر مما يلي:-</div>
                  <div>٧/١ عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط الوارده بهذا العقد</div>
                  <div>٧/٢ في حالة إستخدام مبلغ القرض في غير الغرض الممنوح من أجله الوارد بهذا العقد</div>
                  <div>٧/٣ في حالة تقديم الطرف الثاني أو {getNumbersOfGuarantor()} بيانات أو معلومات مخالفه للواقع
                  او
                  غير سليمه وذلك الي
								المقرض.</div>
                  <div>٧/٤ في حاله فقد الطرف الثاني أو {getNumbersOfGuarantor()} اهليته أو اشهار افلاسه او اعساره
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
                  <div>٧/٦ في حالة عدم قدرة الطرف الثاني أو {getNumbersOfGuarantor()} علي سداد الاقساط في مواعيدها
                  او
                  توقف اعمال المشروع
								الممول لاي سبب من الاسباب</div>
                </section>

                <section>
                  <div className="title">البند الثامن</div>
                  <div>يلتزم كل طرف من أطراف هذا العقد بسداد الضريبه المستحقه عليه وفقا لاحكام القانون
							</div>
                </section>

                <section>
                  <div className="title">البند التاسع</div>
                  <div>يقر الطرف {getNumbersOfGuarantor()} الضامنين المتضامنين بأنها يكفلا علي سبيل التضامن الطرف
                  الثاني
                  لقيمة هذا القرض من
                  اصل وعوائد وعمولات وكافة المصروفات المستحقه بموجب هذا العقد وايا من ملحقاته، ويحق
                  للمقرض
                  الرجوع عليه بكامل
                  قيمة المديونيات المستحقه علي هذا القرض، ولا يحق للطرف {getNumbersOfGuarantor()} الدفع
                  بالتجريد أو
                  التقسيم أو اي دوافع
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
                      <td>
                        <div><b>الطرف الأول</b></div>
                        <div><b>الأسم:</b></div>
                        <div><b>التوقيع:</b></div>
                      </td>
                      <td>
                        <div><b>الطرف الثاني</b></div>
                        <div><b>الأسم:</b></div>
                        <div><b>التوقيع:</b></div>
                      </td>
                    </tr>
                    <tr>

                      {props.data.guarantors.map((_guarantor, index) => {
                        return (
                          <td key={index}>
                            <div><b>الطرف {getIndexOfGuarantorInAr(index)}</b></div>
                            <div><b>الأسم:</b></div>
                            <div><b>التوقيع:</b></div>
                          </td>
                        )
                      })}
                    </tr>

                  </tbody>
                </table>

              </div>


              <div className="main">

                <div className="headtitle textcenter"><u>إقرار وتعهد</u></div>
                <div>نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا بسداد وتسليم قيمة الاقساط المستحقه في مواعيدها
                المحدده بموجب عقد
                القرض المؤرخ {timeToArabicDate(0, false)} وحتي تمام سدادها بالكامل، وأن يكون السداد عن طريق العميل او من
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
                <div>تحريرا في {timeToArabicDate(0, false)}</div>

                <table>

                  <tbody>
                    <tr>
                      <td>
                        <div>المقرون بما فيه:</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div>الاسم/ {props.data.customer.customerName}</div>
                      </td>
                      <td>
                        <div>التوقيع:-----------------------</div>
                      </td>
                    </tr>
                    {props.data.guarantors.map((guarantor, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div>الاسم/ {guarantor.customerName}</div>
                          </td>
                          <td>
                            <div>التوقيع:-----------------------</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>


              <div className="main">

                <div>
                  <div className="title_last">
                    <Barcode value={props.data.applicationKey} />
                    <div>{props.data.applicationKey}</div>
                    <div>{timeToArabicDate(0, false)}</div>
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
                        <div>القائم بالمراجعه</div>
                        <div>الاسم: --------------------------</div>
                        <div>التوقيع: -------------------------</div>
                      </td>
                      <td>
                        <div>القائم بالصرف</div>
                        <div>الاسم: --------------------------</div>
                        <div>التوقيع: -------------------------</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>


              <div className="main">
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
                            <div>ضامن/ {guarantor.customerName}</div>
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
                <div>بأنني قد استلمت تمويل قدره: {`${numbersToArabic(props.data.principal)} = (${new Tafgeet(props.data.principal, 'EGP').parse()})`} جنيه من شركة تساهيل للتمويل متناهي الصغر بتاريخ:
							{timeToArabicDate(0, false)}</div>
                <div>وذلك بهدف تطوير وزيادة رأس مال النشاط، وأنني غير متضرر من الظروف الحالية والتي لها
                تأثير عام علي جميع الأنشطة الأقتصاديه والمشروعات وقد ينتج عن هذه الاحداث ركود في حركات
							البيع والشراء.</div>
                <div>لذا وبناء علي رغبتي ارفض عمل اي جدولة للتمويل او تأجيل للاقساط أو الحصول علي فترة سماح
							لأي اقساط مستحقه طوال فترة التمويل وبأنني ملتزم بسداد الاقساط المسلم لي من الشركه.</div>


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
                            <div>الضامن {getIndexOfGuarantorInAr(index-2)}/</div>
                          </td>
                          <td style={{ width: "100px" }}></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="main">
                <div className="last">
                  <div className="title_last">
                    <Barcode value={props.data.applicationKey} />
                    <div>{props.data.applicationKey}</div>
                    <div>{timeToArabicDate(0, false)}</div>
                    <div>{props.data.customer.customerName}</div>

                    <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                    <Barcode value={props.data.applicationKey} />
                    <div>{props.data.applicationKey}</div>
                    <div>{timeToArabicDate(0, false)}</div>
                    <div>{props.data.customer.customerName}</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default LoanContract;
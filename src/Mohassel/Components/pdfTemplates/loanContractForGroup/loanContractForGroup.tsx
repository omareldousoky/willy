import React from 'react';
import './loanContractForGroup.scss';
import * as Barcode from 'react-barcode';
import * as local from '../../../../Shared/Assets/ar.json';
import { numbersToArabic, timeToArabicDate, dayToArabic } from "../../../../Shared/Services/utils";
import Tafgeet from 'tafgeetjs';

const LoanContractForGroup = (props) => {
  const leaderName = props.data.group.individualsInGroup.find(individualInGroup => individualInGroup.type === "leader").customer.customerName;
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
                      <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                          <tr style={{ height: "10px" }}></tr>
                          <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                          <tr style={{ height: "10px" }}></tr>
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
              <td className="report-content-cell" style={{ textAlign: 'right' }}>
                <div className="main">

                  <div className="headtitle textcenter">عقد تمويل متناهي الصغر (جماعي)</div>
                  <div className="headtitle textcenter"><u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u></div>
                  <div>انه في يوم {dayToArabic(new Date().getDay())} الموافق {timeToArabicDate(0, false)}</div>
                  <div>حرر هذا العقد في فرع {props.branchDetails.name} - {props.data.group.individualsInGroup[0].customer.governorate} الكائن في:{props.branchDetails.address} بين كلا من
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
                            <b>ثانيا:- مجموعة :-</b>
                          </div>
                        </td>
                      </tr>
                      {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div>
                                <span>{individualInGroup.customer.customerName} {individualInGroup.type === "leader" ? '(رئيس المجموعة)' : ''}</span>
                              </div>
                            </td>
                            <td style={{ width: '30%' }}>
                              <div>
                                <b>الكائن:</b>
                                <span>
                                  {individualInGroup.customer.customerHomeAddress}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <b className="word-break">رقم قومي</b>
                                <span>
                                  {numbersToArabic(individualInGroup.customer.nationalId)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <b>تليفون</b>
                                <div style={{ display: 'inline-block', width: '80px' }}>{numbersToArabic(individualInGroup.customer.mobilePhoneNumber) + "-" + numbersToArabic(individualInGroup.customer.homePhoneNumber) + "-" + numbersToArabic(individualInGroup.customer.businessPhoneNumber)}</div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف ثان - مقترضين&quot;</td>
                      </tr>
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
                      وقد تقدم افراد الطرف الثاني بطلب للحصول علي قرض من بطلب للحصول علي قرض من فرع
                    {props.branchDetails.name} - {props.data.group.individualsInGroup[0].customer.governorate} الكائن
                    {props.branchDetails.address} لحاجتهم للسيوله النقديه يخصص
                    استخدامه في
                    تمويل رأس المال
                    العامل وذلك وفقا لاحكام القانون رقم ١٤١ لسنة ٢٠١٤ المشار اليه
                    وقد
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
                    <div>
                      يقر أفراد الطرف الثاني (المقترضين) باستلامهم من الطرف الاول (المقرض) مبلغ وقدره {`${numbersToArabic(props.data.principal)} جنيه = (${new Tafgeet(props.data.principal, 'EGP').parse()})`} نقداً موزع بينهم على النحو التالي:
                  </div>
                    <table className="stakeholders">
                      <tbody>
                        {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div>
                                  <span>{individualInGroup.customer.customerName} </span>
                                </div>
                              </td>
                              <td style={{ width: '30%' }}>
                                <div>
                                  <b>مبلغ التمويل:</b>
                                  <span>
                                    {`${numbersToArabic(individualInGroup.amount)} = (${new Tafgeet(individualInGroup.amount, 'EGP').parse()})`}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b className="word-break">و ذلك لنشاط</b>
                                  <span>
                                    {individualInGroup.customer.businessSector + "-" + individualInGroup.customer.businessActivity + "-" + individualInGroup.customer.businessSpeciality}
                                  </span>
                                </div>
                              </td>

                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </section>

                  <section>
                    <div className="title">البند الثالث</div>
                    <div>يلتزم الطرف الثاني ضامنين متضامنين فيما بينهم بسداد اجمالي قيمة
                    القرض
                  البالغة {`${numbersToArabic(props.data.principal)} جنيه = (${new Tafgeet(props.data.principal, 'EGP').parse()})`}
                  وكافة المصروفات الإداريه البالغه {numbersToArabic(props.data.applicationFeesRequired)} جنيه بواقع {numbersToArabic(props.data.applicationFeesRequired / props.data.group.individualsInGroup.length)} جنيه لكل عضو وتكاليف التمويل البالغه {numbersToArabic(props.data.installmentsObject.totalInstallments.feesSum)} جنيه الي الطرف
                  الأول وذلك بواقع مبلغ
                  قدره {`${numbersToArabic(props.data.installmentsObject.totalInstallments.installmentSum + props.data.applicationFeesRequired)} جنيه = (${new Tafgeet(props.data.installmentsObject.totalInstallments.installmentSum, 'EGP').parse()})`} ، يتم
                  سداده
                  علي {numbersToArabic(props.data.installmentsObject.installments.length)} قسط كل {numbersToArabic(props.data.product.periodLength)} {props.data.product.periodType === 'days' ? local.day : local.month}
                  قيمة كل قسط {`${numbersToArabic(props.data.installmentsObject.installments[0].installmentResponse)} جنيه = (${new Tafgeet(props.data.installmentsObject.installments[0].installmentResponse, 'EGP').parse()})`} جنيه فقط لا غير، تبدأ في
                  {timeToArabicDate(props.data.installmentsObject.installments[0].dateOfPayment, false)} وينتهي في
                  {timeToArabicDate(props.data.installmentsObject.installments[props.data.installmentsObject.installments.length - 1].dateOfPayment, false)} علي ان يتم السداد النقدي بمقر فرع الطرف الأول الكائن في {props.branchDetails.name} - {props.data.group.individualsInGroup[0].customer.governorate} الكائن
                    {props.branchDetails.address} أو
                  بأحدي وسائل الدفع
								الإلكتروني المعتمده من هيئه الرقابه الماليه</div>
                  </section>

                  <section>
                    <div className="title">البند الرابع</div>
                    <div>يقر افراد الطرف الثاني بأنهم ضامنين متضامنين فيما بينهم بسداد كافة المبالغ الوارده
                    بالبند السابق وفقا
                    للمواعيد المذكوره به وان هذه المبالغ تعد قيمة القرض وكافة مصروفاته وتكاليف تمويله
							</div>
                  </section>

                  <section>
                    <div className="title">البند الخامس</div>
                    <div>يلتزم افراد الطرف الثاني ضامنين متضامنين فيما بينهم بسداد اقساط القرض وفقا لما
                    هو
                    وارد بالبند الثالث
                    من هذا العقد وفي حالة تأخير أي منهم في سداد قيمه أي قسط في تاريخ استحقاقه تلتزم الأعضاء بسداد
                    غرامة
                    تأخير ٥% من قيمة
                    القسط في اليوم التالي لتاريخ الأستحقاق للقسط وابتداء من اليوم الذي يليه كالتالي :-
							</div>
                    <div>يتم تحصيل ٢ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أقل من ١٥٠٠ جنيها</div>
                    <div> يتم تحصيل ٣ جنيهات عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ١٥٠٠ جنيها حتي أقل من ٢٠٠٠ جنيها</div>
                    <div>يتم تحصيل ٤ جنيهات عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠ جنيها حتي أقل من ٢٥٠٠ جنيها</div>
                    <div>يتم تحصيل ٥ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أكبر من ٢٥٠٠ جنيها</div>
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
                    <div>في حالة عدم التزام ايا من المقترضين بأي من التزاماته التعاقديه او القانونيه
                    الوارده بهذا العقد
                    وملحقاته ومرفقاته الموقعه (ان وجدت) وبالقوانين الساريه في اي وقت من الأوقات يعد جميع افراد الطرف الثانى ضامنين مخفقين
                    في الوفاء بالتزماتهم التعاقديه والقانونيه ويعتبر هذا العقد مفسوخا من
                    تلقاء نفسه دون الحاجه
                    للرجوع الي اعذار او اتخاذ اجراءات قضائيه ويحق للطرف الاول فورا مطالبة افراد الطرف
                  الثاني بباقي قيمة القرض وكافة مصروفاته وتكاليف تمويله</div>
                    <div>ومن حالات الاخفاق علي سبيل المثال وليس الحصر مما يلي:-</div>
                    <div>٧/١ عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط الوارده بهذا العقد</div>
                    <div>٧/٢ في حالة إستخدام مبلغ القرض في غير الغرض الممنوح من أجله الوارد بهذا العقد</div>
                    <div>٧/٣ في حالة تقديم ايا من اطراف الطرف الثاني بيانات أو معلومات مخالفه للواقع
                    او
                    غير سليمه وذلك الي
								المقرض.</div>
                    <div>٧/٤ في حاله فقد ايا من اطراف الطرف الثاني اهليته أو اشهار افلاسه او اعساره
                    او
                    وفاته او وضعه تحت
                    الحراسه او توقيع الحجز علي امواله او وضع امواله تحت التحفظ ومنعه من التصرف فيها او
                    انقضائه او اندماجه او
								وضعه تحت التصفيه</div>
                    <div>٧/٥ اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز الادارى او البيع الجبري علي
                    المشروع
                    الممول بالقرض كله
                    او بعضه، او اذا تم التصرف في جزء او كل من المشروعالممول او اذا تم تأجيره للغير.
							</div>
                    <div>٧/٦ في حالة عدم قدرة ايا من اطراف الطرف الثاني علي سداد الاقساط في مواعيدها
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
                    <div>تسري أحكام القانون رقم ١٤١ لسنة ٢٠١٤ بشأن تمويل منتناهي الصغر و لائحته التنفيذية وتعديلاته (إن وجد) على هذا العقد وتعتبر مكمله له وتختص المحاكم الإقتصادية بالفصل في أي نزاع قد ينشأ بخصوص تفسير أو تنفيذ أي بند من بنود هذا العقد
                    كما تطبق أحكام القوانين السارية بجمهورية مصر العربية في حالة خلو القانون المشار إليه من تنظيم النزاع المطروح على المحكمة
                  </div>
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
                    <div>اتخد كل طرف العنوان المبين قرين كل منهما يصدر هذا العقد محلاً مختار له وفي حالة تغيير أياً منهم لعنوانه يلتزم بأخطار الطرف الاخر بموجب الخطاب مسجل بعلم الوصول وإلا اعتبر إعلانه على العنوان الاول صحيحاً ونافذاً ومنتجاً لكافة اثاره القانونية.</div>
                  </section>

                  <table className="signature_space">

                    <tbody>
                      <tr>
                        <td>
                          <div><b>الطرف الأول</b></div>
                          <div><b>الأسم:</b></div>
                          <div><b>التوقيع:</b></div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div><b>افراد الطرف الثاني</b></div>
                        </td>
                      </tr>
                      {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                        return (
                          <tr key={index}>
                            <td >
                              <div><b>الأسم: {individualInGroup.customer.customerName}</b></div>
                              <div><b>التوقيع:</b></div>
                            </td>
                          </tr>
                        )
                      })}

                    </tbody>
                  </table>

                </div>


                <div className="main">

                  <div className="headtitle textcenter"><u>إقرار وتعهد</u></div>
                  <div>نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا بسداد وتسليم قيمة الاقساط المستحقه في مواعيدها
                  المحدده بموجب عقد
                القرض المؤرخ {timeToArabicDate(0, false)} وحتي تمام سدادها بالكامل، وأن يكون السداد عن طريق احد الأعضاء او بواسطة من ينوب عن المجموعة الي شركة تساهيل للتمويل متناهي الصغر ذاتها وبمقر خزينة فرع الشركة المتعامل معه أو عبر وسائل الدفع
                الالكتروني المعتمده
                من هيئة الرقابة المالية ولا يحق لنا بأى حال من الاحوال سداد قيمة أي قسط من الاقساط الي
                شخص اخر غير خزينة فرع
                الشركة طبقا لما سبق ذكره، وأيا كان هذا الصدد وتكون مسئوليتنا كاملة ويعتبر السداد المخالف
                لذلك لم يتم ويحق
                للشركة الرجوع علي الاعضاء بالمجموعة في أي وقت من الاوقات بقيمة مالم يتم سداده لخزينة فرع
                الشركة ودون أدني
							اعتراض مننا علي ذلك وهذا اقرار منا بذلك ولا يحق لنا الرجوع فيه حاليا او مستقبلا.</div>
                  <div>
                    ونقر بأن الغرض من التمويل هو تطوير وزيادة رأس مال النشاط، و اننا غير متضررين من الظروف الحالية والتي لها تأثير عام على جميع الأنشطة الإقتصادية والمشروعات وقد ينتج عن هذه الأحداث ركود في حركات البيع و الشراء
              </div>
                  <div>
                    لذا و بناءً على رغبتنا جميعاً نرفض عمل أي جدولة للتمويل أو تأجيل للاقساط أو الحصول على فترة سماح لأي اقساط مستحقة طوال فترة التمويل وبأننا ملتزمون جميعاً بسداد الأقساط طبقاً لجدول الأقساط المسلم لي من الشركة
              </div>
                  <div>تحريرا في {timeToArabicDate(0, false)}</div>

                  <table>

                    <tbody>
                      <tr>
                        <td>
                          <div>المقرون بما فيه:</div>
                        </td>
                      </tr>
                      {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div>الاسم/ {individualInGroup.customer.customerName}</div>
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
                      <div>{leaderName}</div>

                      <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                    </div>
                  </div>

                  <h2 className="textcenter">اقرار تم التوقيع امامي</h2>

                  <div>نقر نحن الموقعون ادناه:</div>
                  <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:{props.branchDetails.name} - {props.data.group.individualsInGroup[0].customer.governorate}</div>
                  <div>بوظيفة</div>
                  <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:{props.branchDetails.name} - {props.data.group.individualsInGroup[0].customer.governorate}</div>
                  <div>بوظيفة</div>
                  <div>بأن توقيع كل من عضوة من اعضاء المجموعة المدرجين بالجدول تم امامي وان جميع بيانات ايصالات
                  الامانه الخاصه بهم صحيحة
                  وتحت مسئوليتي وانني قمت بمطابقة اصول بطاقات الرقم القومي لجميع اعضاء المجموعه مع الصور
                  المرفقه بطلب التمويل
                  (وش وضهر) وانني قمت بمطابقتها مع الاشخاص الحقيقيين والتأكد منهم واتحمل مسئولية ذلك.
						</div>

                  <table className="endorsement_table">
                    <thead>
                      <tr>
                        <th><b>م</b></th>
                        <th><b>اسم العضو</b></th>
                        <th><b>الكود</b></th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.data.group.individualsInGroup.map((individualInGroup, index) => {
                        return (
                          <tr key={index}>
                            <td>{numbersToArabic(index + 1)}</td>
                            <td>{individualInGroup.customer.customerName}</td>
                            <td>{numbersToArabic(individualInGroup.customer.key)}</td>
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
                  <div className="last">
                    <div className="title_last">
                      <Barcode value={props.data.applicationKey} />
                      <div>{props.data.applicationKey}</div>
                      <div>{timeToArabicDate(0, false)}</div>
                      <div>{leaderName}</div>

                      <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                      <Barcode value={props.data.applicationKey} />
                      <div>{props.data.applicationKey}</div>
                      <div>{timeToArabicDate(0, false)}</div>
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

export default LoanContractForGroup;
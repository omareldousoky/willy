import React from 'react';
import './loanContract.scss';
import * as local from '../../../../Shared/Assets/ar.json';

const LoanContract = (props) => {
    console.log('props', props)
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
                                <div>انه في يوم الثلاثاء الموافق ٢٠٢٠/٠٥/٠٥</div>
                                <div>حرر هذا العقد في فرع الغربيه - زفتي الكائن في: شارع الموافي من شارع الجمهوريه أمام
                                    مدرسه النهضه بين كلا من
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
                                                    بهيئة الرقابه الماليه ويمثلها في هذا العقد السيد/ بصفته مدير الفرع بموجب
                                                    تفويض صادر له من
                                                    السيد/ منير اكرام نخله - رئيس مجلس الإداره بتاريخ ٢٠١٦/٠٥/١٠
										</div>
                                            </td>
                                        </tr>

                                        <tr style={{ textAlign: 'left' }}>
                                            <td colSpan={4}>"طرف أول - مقرض"</td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <div>
                                                    <b>ثانيا:- السيد :-</b>
                                                    <span>نجلاء محمد فتحي محمود عفيفي</span>
                                                </div>
                                            </td>
                                            <td style={{ width: '30%' }}>
                                                <div>
                                                    <b>الكائن:</b>
                                                    <span>
                                                        ش الموافي جوار جامع الفخراني - منزل فتحي عفيفي - مركز زفتي - الغربيه
											</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b className="word-break">رقم قومي</b>
                                                    <span>
                                                        ٢٧٨٠١٣٠١٦١٤٦٢
											</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b>تليفون</b>
                                                    <div style={{ display: 'inline-block', width: '80px' }}></div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr style={{ textAlign: 'left' }}>
                                            <td colSpan={4}>"طرف ثان - مقترض"</td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <div>
                                                    <b>ثالثا:- السيد :-</b>
                                                    <span>محمد عبدالعال حواش العدس</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b>الكائن:</b>
                                                    <span>
                                                        كفر عنان جوار جامع سيدى خالد منزل عبد العال حواش - مركز زفتي -
												الغربيه </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b className="word-break">رقم قومي</b>
                                                    <span>
                                                        ٢٧٥١٠٢٨١٦٠١٣٩٣
											</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b>تليفون</b>
                                                    <span>

                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr style={{ textAlign: 'left' }}>
                                            <td colSpan={4}>"طرف ثالث - ضامن متضامن"</td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <div>
                                                    <b>رابعا:- السيد :-</b>
                                                    <span>مصطفي محمد لبيب حسن عمايم</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b>الكائن:</b>
                                                    <span>
                                                        ش احمد منصور - فاقوس - ميت غمر - الدقهليه
											</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b className="word-break">رقم قومي</b>
                                                    <span>
                                                        ٢٦٣٠٦٢٥١٦٠١٤٩٦
											</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <b>تليفون</b>
                                                    <span>

                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr style={{ textAlign: 'left' }}>
                                            <td colSpan={4}>"طرف رابع - ضامن متضامن"</td>
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
                                        وقد تقدم الطرف الثاني صاحب نشاط خدمي - خدمات شخصيه مختلفه بطلب للحصول علي قرض من فرع
                                        الغربيه - زفتي الكائن
                                        شارع الموافي من شارع الجمهوريه أمام مدرسة النهضه لحاجته للسيوله النقديه يخصص
                                        استخدامه في
                                        تمويل رأس المال
                                        العامل وذلك وفقا لاحكام القانون رقم ١٤١ لسنة ٢٠١٤ المشار اليه وذلك بضمان وتضامن
                                        الطرف
                                        الثالث والرابع وقد
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
                                    <div>بموجب هذا العقد وافق الطرف الأول علي منح الطرف الثاني مبلغ ٤٠٠٠٠ جنيه فقط أربعون
                                        ألف
                                        جنيه مصري لا غير ويقر
                                        الطرف الثاني بأن هذا المبلغ يمثل قرضا عليه يلتزم بسداده للطرف الأول وفقا لما هو وارد
                                        بالبند الثالث من هذا
                                        العقد
							</div>
                                </section>

                                <section>
                                    <div className="title">البند الثالث</div>
                                    <div>يلتزم الطرفان الثاني والثالث والرابع ضامنين متضامنين فيما بينهم بسداد اجمالي قيمة
                                        القرض
                                        البالغة ٤٠٠٠٠ جنيه
                                        وكافة المصروفات الإداريه البالغه ٠ جنيه وتكاليف التمويل البالغه ١٨٢٢٤ جنيه الي الطرف
                                        الأول وذلك بواقع مبلغ
                                        قدره ٥٨٢٢٤ جنيه فقط ثمانية وخمسون ألف ومائتان وأربعة وعشرون جنيه مصري لاغير، يتم
                                        سداده
                                        علي ٢٤ قسط كل ١ شهر
                                        قيمة كل قسط ٢٤٢٦ جنيه فقط ألفان وأربعمائه وسته وعشرون جنيه مصري فقط لا غير، تبدأ في
                                        ٢٠٢٠/٠٦/٠٥ وينتهي في
                                        ٢٠٢٢/٠٥/٠٥ علي ان يتم السداد النقدي بمقر فرع الطرف الأول الكائن في الغربيه - زفتي أو
                                        بأحدي وسائل الدفع
								الإلكتروني المعتمده من هيئه الرقابه الماليه</div>
                                </section>

                                <section>
                                    <div className="title">البند الرابع</div>
                                    <div>يقر الطرفان الثاني والثالث والرابع متضامنين فيما بينهم بسداد كافة المبالغ الوارده
                                        بالبند السابق وفقا
                                        للمواعيد المذكوره به وان هذه المبالغ تعد قيمة القرض وكافة مصروفاته وتكاليف تمويله
							</div>
                                </section>

                                <section>
                                    <div className="title">البند الخامس</div>
                                    <div>يلتزم الأطراف الثاني والثالث والرابع متضامنين فيما بينهم بسداد اقساط القرض وفقا لما
                                        هو
                                        وارد بالبند الثالث
                                        من هذا العقد وفي حالة تأخرهم في سداد قيمة اي قسط في تاريخ استحقاقع يلتزموا بسداد
                                        غرامة
                                        تأخير ٥% من قيمة
                                        القسط في اليوم التالي لتاريخ الأستحقاق للقسط وابتداء من اليوم الذي يليه كالتالي :-
							</div>
                                    <div>يتم تحصيل ٥ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أقل من ٢٠٠٠ جنيها</div>
                                    <div>يتم تحصيل ٧.٥ جنيهات عن كل يوم تأخير إذا كان قيمة القسط يتراوح من ٢٠٠٠ جنيها حتي
                                        ٣٠٠٠
								جنيها</div>
                                    <div>يتم تحصيل ١٠ جنيهات عن كل يوم تأخير اذا كان قيمة القسط أكبر من ٣٠٠٠ جنيها</div>
                                </section>

                                <section>
                                    <div className="title">البند السادس</div>
                                    <div>تلتزم الشركه بقبول طلب العميل بالسداد المعجل، ويحق للشركه خصم تكلفة التمويل للشهر
                                        الذى
                                        تم فيه السداد ويجوز
                                        لها إضافة عمولة سداد معجل بما لا يزيد عن ٥% من باقي المبلغ المستحق (أصل) المراد
                                        تعجيل
								الوفاء به</div>
                                </section>

                                <section>
                                    <div className="title">البند السابع</div>
                                    <div>في حالة عدم التزام المقترض او الضامنين بأي من التزامتاتهم التعاقديه او القانونيه
                                        الوارده بهذا العقد
                                        وملحقاته ومرفقاته الموقعه (ان وجدت) وبالقوانين الساريه في اي وقت من الأوقات يعد
                                        الأطراف
                                        الثاني والثالث
                                        والرابع مخفقين في الوفاء بالتزماتهم التعاقديه والقانونيه ويعتبر هذا العقد مفسوخا من
                                        تلقاء نفسه دون الحاجه
                                        للرجوع الي اعذار او اتخاذ اجراءات قضائيه ويحق للطرف الاول فورا مطالبة أى من الأطراف
                                        الثاني أو الثالث أو
								الرابع أو جميعهم بباقي قيمة القرض وكافة مصروفاته وتكاليف تمويله</div>
                                    <div>ومن حالات الاخفاق علي سبيل المثال وليس الحصر مما يلي:-</div>
                                    <div>٧/١ عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط الوارده بهذا العقد</div>
                                    <div>٧/٢ في حالة إستخدام مبلغ القرض في غير الغرض الممنوح من أجله الوارد بهذا العقد</div>
                                    <div>٧/٣ في حالة تقديم الطرف الثاني أو الثالث أو الرابع بيانات أو معلومات مخالفه للواقع
                                        او
                                        غير سليمه وذلك الي
								المقرض.</div>
                                    <div>٧/٤ في حاله فقد الطرف الثاني أو الثالث أو الرابع اهليته أو اشهار افلاسه او اعساره
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
                                    <div>٧/٦ في حالة عدم قدرة الطرف الثاني أو الثالث أو الرابع علي سداد الاقساط في مواعيدها
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
                                    <div>يقر الطرف الثالث والرابع الضامنين المتضامنين بأنها يكفلا علي سبيل التضامن الطرف
                                        الثاني
                                        لقيمة هذا القرض من
                                        اصل وعوائد وعمولات وكافة المصروفات المستحقه بموجب هذا العقد وايا من ملحقاته، ويحق
                                        للمقرض
                                        الرجوع عليه بكامل
                                        قيمة المديونيات المستحقه علي هذا القرض، ولا يحق للطرف الثالث او الرابع الدفع
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
                                            <td>
                                                <div><b>الطرف الثالث</b></div>
                                                <div><b>الأسم:</b></div>
                                                <div><b>التوقيع:</b></div>
                                            </td>
                                            <td>
                                                <div><b>الطرف الرابع</b></div>
                                                <div><b>الأسم:</b></div>
                                                <div><b>التوقيع:</b></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>


                            <div className="main">

                                <div className="headtitle textcenter"><u>إقرار وتعهد</u></div>
                                <div>نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا بسداد وتسليم قيمة الاقساط المستحقه في مواعيدها
                                    المحدده بموجب عقد
                                    القرض المؤرخ ٢٠٢٠/٠٥/٠٥ وحتي تمام سدادها بالكامل، وأن يكون السداد عن طريق العميل او من
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
                                <div>تحريرا في ٢٠٢٠/٠٥/٠٥</div>

                                <table>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>المقرون بما فيه:</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>الاسم/ نجلاء محمد فتحي محمود عفيفي</div>
                                            </td>
                                            <td>
                                                <div>التوقيع:-----------------------</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>الاسم/ محمد عبدالعال حواش العدس</div>
                                            </td>
                                            <td>
                                                <div>التوقيع:-----------------------</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>الاسم/ مصطفي محمد لبيب حسن عمايم</div>
                                            </td>
                                            <td>
                                                <div>التوقيع:-----------------------</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>


                            <div className="main">

                                <div>
                                    <div className="title_last">
                                        <img
                                            src="data:image/gif;base64,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" />
                                        <div>110610002452001</div>
                                        <div>2020/05/05</div>
                                        <div>نجلاء محمد فتحي محمود عفيفي</div>

                                        <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>
                                    </div>
                                </div>

                                <h2 className="textcenter">اقرار تم التوقيع امامي</h2>

                                <div>نقر نحن الموقعون ادناه:</div>
                                <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:الغربيه - زفتي</div>
                                <div>بوظيفة</div>
                                <div>الاسم <div style={{ display: 'inline-block', width: '150px' }}></div> الموظف بشركة تساهيل للتمويل
							المتناهي الصغر فرع:الغربيه - زفتي</div>
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
                                            <td>نجلاء محمد فتحي محمود عفيفي</td>
                                            <td>٦١/٢٤٥٢</td>
                                        </tr>
                                        <tr>
                                            <td>٢</td>
                                            <td>محمد عبدالعال حواش العدس</td>
                                            <td>٦١/١٣٨٠٤</td>
                                        </tr>
                                        <tr>
                                            <td>٣</td>
                                            <td>مصطفي محمد لبيب حسن عمايم</td>
                                            <td>٦١/١٣٨٢١</td>
                                        </tr>
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
                                                <div>أقر انا العميل/ نجلاء محمد فتحي محمود عفيفي</div>
                                            </td>
                                            <td>
                                                <div><b>الكود</b> &emsp; ٦١/٢٤٥٢</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>ضامن أول/ محمد عبدالعال حواش العدس</div>
                                            </td>
                                            <td>
                                                <div>ضامن ثان/ مصطفي محمد لبيب حسن عمايم</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>نوع النشاط/ خدمي - خدمات شخصيه مختلفه</div>
                                            </td>
                                            <td>
                                                <div>الفرع/ الغربيه - زفتي</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div>بأنني قد استلمت تمويل قدره: ٤٠٠٠٠ جنيه من شركة تساهيل للتمويل متناهي الصغر بتاريخ:
							٢٠٢٠/٠٥/٠٥</div>
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
                                        <tr>
                                            <td>
                                                <div>الضامن الأول /</div>
                                            </td>
                                            <td style={{ width: "100px" }}></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>الضامن الثاني /</div>
                                            </td>
                                            <td style={{ width: "100px" }}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="main">
                                <div className="last">
                                    <div className="title_last">
                                        <img
                                            src="data:image/gif;base64,R0lGODlhTgFkAPcAAAAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAACH5BAEAAPwALAAAAABOAWQAAAj/AAEIBLBvn8CCBQ8iXDiQIEKFDB0mlGiwIcWGEydirGjR4caMCytGhCgyJMiNHzleHDhypcKXFjVSlBmxJUySKFk+9NiRZ06cM0vKzDnUZ9COJ3uCXBoyJUmmQJ3qvDlVqcqaTV2uNJmUasuvO6PyLEozK1CbRsFKLUrV606TYomqdIu2a0yheMEyhapVrN22Vc9m1Zv37dXDZRMjPgxYseK4acNG/hu4MtbLc6uSXbwZMEzMhJ/ihazWqOfJhf0ahhtZqurHmjM7XkyatmXDPU2jFg35s2zOv0/z5WqbNWakkimz3X1UK2jct2G/Zqx79lrJdKkLzt1Z597RVhsD/0cuHDzx68f7Oi9JPrz31Ou/25Ue37bv9rzf13bNfHl3wem1919zcnFnHlforQYef8plll1+oQU1n331McjeXSnBVheFGjpYXXGDYRcbfgSO6N5zHaa3YVniGZggXwCG+FOF+tV4H4bvpRicjf15OOBzvY21Y34FnqhghMYpiByLH7pYY5I6YjVjhNMVOaVZW4lIX4dOXvldkA1muKN/B7IW43BaJnfhjF7ChySCrfFI5Xot5gjij2pe12V0bop4Y5vdkXmmml9muRmTA7YJIaGFTWjhlnk2aWeCJJa2nXuKNofWn3wG6mOZWAJp6G+IDonjoFVKuCZzqapWJ5GjVv8a6aUkPqipn0LKumF5g0YJ6pLUJcrnor46KiejFr5aYoDDNivoqaPCiCOeu+rmm3x3KqleacLaCmW2UjbbKp2Swsqsrd5+qmufz1KbJq/RInurtK6WC62obyaZ6bjcmmpmrPfOmuWe6Z5rIqBjqhuvrzECa2VlmX77InTo0livuzquG7HCGxvMaXaeOokiuL/eVWqtzoZY7KqQthysv6Fqu2+PBPfoca4BV9vukfJKvG2k3dos88IscyjvxTDnm7R2A2Oa8s1hTjqtwiNP3LDJL6Nc8NBVx8nv0TgjTGnOTIeLMsPqfYxayEZiazXAydrbMdc8G/s1pMr+azDeT3L//PTQD4OcsMh1k3x13EGjrbTZrFpMLsbZapxyzYrjGjWsal/bqOFwH6vs3NJ2zeTdRucdM72Nc+n01qirbd3UhLvdt4ppngwt6AsS7dajRtsu9uxLb0w555uG3engbW/+9t5Am4p7qud57ficly8LeOogDr+85asKLiDVhW+Per9aCx16+NJTD3b1el/PN623m5974Gsj/73sqHaOdPmVr7z7sS6j3+sOJy6arU5+YOpe/b4XO+UBD02Hylr8WJc70ZVtfRg0ndIkly7tPXB+BzseA5Mnmv6BkHwTRCCNoje66WXQXu0bX+n65sH8FY99WMqckPAXLwLuL4UmnJjdvFzIN8iNbWaqOxvxuKfBd1lrhw60ofuax78l+i99GCzi0jJGNuEdMIhGWhfb7hfFHurvcc772/lk10L1aVGMkevi5L5oRfDBcYRkLGEda+M7iKmxguhrYxZnaETgcdCAShSfHck2xqnxEF9T7CO8pHhFQQbQczA83QlnCD82qfCGChxgCOXySJ75EI1VVKQQi8a7Vo5ygYaUYwfpqMowMtJ+jiwjJGUoySeCsVesBGDvJPi7U76vaYn8YAKb/9hIUurSlGdEoScpCD04WXKYiNtiHJGYPVoqM23G8x7sSKiqWq6ImH6k5gqtecFL/rCY0eQkMuP3y3HCU4cQ1CSxNtnLZ1GSZEN0IyG1ecQCJpGee7TlPcMZm1IWinn99NsuARpM0mXzjrHkpp68+U/CYZR+mtOjOWuHzkmacXEUw547GSpK5sWtk36spwDHY89civSbEC2pLxMKzP9ZFJOFNKY8GedJmb5SlPgEFUqFGtE9TXSVPiXiQD8az5fOs6g8rak4QQrFm3b0Z0112lM/GNBBXvSWBa3YQbFaSzyKUKsNfeZDI6lTf560Z+zk5kpxuEFZIhKhbYUrUhka0v9y4pSuM3UqNFFa1r1SEa0ZNWg3k/lVt271lYWN3lfPmVixLhav+pKsY5m5TclulLJ33RlVk9rTw/KyrhL9bCXbiU2gEjSyap0sYF27yIVSJrNw2ixJOys5n7X2mq5851uFalWixjSrxC0Ra3XHWz7CVrFzna1ea+s6mjIXkzBt4j49Clmu5nOp8QxrcVVG0agK9KzwdCl4r/rcwEb3X9PtmnAjGN3nrTO0uR1tJvuqURpyNLW9XS5mu2rY/ZLqup7Nbnux6Fj1Wk+GzU0pW6urUAXnF30OdthRYythqFKYu6gsb1Xn61zxzivBl/2wQ9nFTwivl1kW3G5yWerdFdf/K7wDpjF5fatA4MZQyGC1sRyNS13kChO+Cpbvj+nrYibfN4eEZbBmEWzd/v6xmgBWKYr5CtrgzRG1Y7UsLM2r1DLnU8TdxS6Sj0vbHUszylPM8G+DPN4OxzjL53VzyaBs0jQ3uc5Pti1VpUwuILurz2oe7J4DDUbOjljOkD60jhMdZ6l9d8ot5vOLh+xhQLe50sO9dITnrGnRjjmUPWa0pagsaiurGnOmbm2IseZldTK2olIl9Jp93GhaP3rUfh62jOWKZEt3+sZ0YyOif/rsC29Sz0WuNXtJ/edJnzqhzuYxppFN501/jbRpxd5pd1tZwfZ42V7lcpJ7/UlBN/bVohY+8n5YrOH6cjjS7841dXctbLsaOseutjOsxZTuY4b62LauNn4Frl95h7t6/v21e82qaBXLWmAPN3PExe3pBVMa3KmudsbtDez3djy+eea3t6HdOpLjeuYDt3jKbb7kbZO15RxX7mU/7mS7+pqJQW5mXOM91osvfNWZRniAX41u3KrbwGiWLYyVTXEQ65y/t+45jgM57WCHXd8/w7ZJj65aFf/Du8FffzC96yl1MSu86p8udshpDkKJYxnnFW/6zjH+5f/KKOGc5jnaqwXqflfZ5wBnOFyNrE9kO/1zhdf4iRWe78ozXu+O1zbUnn7zbJ98pGBXeeZZvvEKK3nxTmw8zlfediLDK/Ba73LYaT9hJ1Nb8Z6PPehnv/ralxrwXhd86nnOexP73ux+J7Bpsc5ueUe+5Jwijva3z/3ue//74A+/+MdP/vKb//zoT7/618/+9rv//fCPv/znT//62//++M+//vfP//77//8AGIACOIAEWIAGGBK0kADRQBzBIAALyIAOaBLDoAUCgQCaIIFbIBABoAYPaBIN2IEIMYEVeIH/ISGCAGCBEkiBJ0iCCKEPtaACAnEAcLB9tBAAobAQ7NARNtiCLxiDM1iCKoiCQDiC2veBJpGAIHiASth+yrAPwZAA+0APSSgMABCBXEGFVogQwdARRrAQW2gRUGgSWJiEX9gQXaiFXOiFHXEECEEPVNAREMCAALCDaGgRdOiGcKiGFnGGBVGGA8GGYliFINiETxiFSbiEiFh+86ACAQADDQADAAAELbgLAiEAp2AS+kCJVXiJCLGIAPCDVEiHixgAP6gPbxgHC5GJlciJBeGJoDiHN7gPrlgQoRiLs7gPtVgQtAAAOrAMBYEMMIiKIZGDsLgQNRiLR8iLvrgPwAgA/8J4i7koizD4inRYEKq4iZ3IiI4IiXyYiN5IfvQwDIwIB03YihToAFqQheYIAOiojlvYjVsYBLrojDgIAHG4ju0Igu+ohvK4D5QIjwDQj/+ohpJoig8QEuUAABYQEouIAGBQjfpACOrYglRwkAuRkAvpjwAAkAK5kQTZieeYjiAYjuNYjt94kuNHCA+gCNVYg3AADRLJirpIijBpiS1ICNUojQgQDQZ5iMZIkzF5kzm5iAoYkUOpAkWJk8gojQpIHPmgAhZpjRIZDUpJkff4fU95kEa5lETJk1WZjU25Dy5ZkzK5DyrJkkuJkmrJffOwBaegD4UgjPsADQsYkRNJl//7YJcdqJepSAUOuIgQoA+LoIEcuBB4yZdSqY6m6ID6oAiK6Zc86ZgguJg+qZHdWINviZOsmIM/0IMbWJkFQYlsiJjWCJmN+ZhWeJhTuRBt+ZZxuZawmX6OWZYLMZsUGZaJeQo5WARv2BA7yRW2WZq4mZcxaYrDaZdvSQXHGZQmsYhZuIWouJV1CIaV6Zx1qZyTWZzYmYrMWZs2GZvg2X6kGRKk2ZPc6YDEGAAkKI4eSZ6rWZoPkJ0OmA/beZPzWZ+JeYieKJc5eI/SOY858IDs2Y3ZSI/7QJ/xeZ7RQJ/LOZHjGZ4Qan7ISRwTWhAMmoSSmYM5+ZTDSZzfeaD4WRD/s2mcGGqJJBoSwYkQwjCNYNmBaLl9HDqFLCqcJZqcHZqiuRmhOiqh74mJPWqW6kiflhijCuqe6vijQuqVQWqaSAqZPDiHcumEuYGNXFGetQClRYoQSTqeSWqkoLmjYKp9OIqiH9qYRwmFXXmetJmiZsqVSBmZZwqnbhqWEXmCSZiQuTGR9smJdfqbqfiiLdqmrPmmJjGmYXqoFPqjWRqa7cmoXVindzCoYbiolqmGZziQaHipjSqlZ1inQPClUkmHlFmPYeipPompfdieqMqpPqqniPqqe5qoHyqNn0iLxbgPGvqD7BmlOVqg1GiLMxqN0HirWyiJ3weoYnmCsbiinwZarNo3rKIYrLeqprBarV4qq2SYhghxpRZxlZQqpXuoh2YorgNhrKaYGx1KnBCpguOal73ZEWHphwIBkBZhrNdqrfi6D4aKEIZqgkK4EMgAiQDQAD8InLNaEP7KgiEYhAqLsCroACxIjD2Rrv9pjT3IjhE7pbiZsCkoEBArpgebryI7siRbsiZ7siibsiq7sizbsi77sjAbszI7s+EXEAA7" />
                                        <div>110610002452001</div>
                                        <div>2020/05/05</div>
                                        <div>نجلاء محمد فتحي محمود عفيفي</div>

                                        <div style={{ margin: '2em', borderTop: '2px solid black' }}></div>

                                        <img
                                            src="data:image/gif;base64,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" />
                                        <div>110610002452001</div>
                                        <div>2020/05/05</div>
                                        <div>نجلاء محمد فتحي محمود عفيفي</div>
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
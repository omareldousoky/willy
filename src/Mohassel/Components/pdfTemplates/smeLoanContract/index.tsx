import React from 'react'
import './style.scss'
import Tafgeet from 'tafgeetjs'
import {
  numbersToArabic,
  timeToArabicDate,
  dayToArabic,
} from '../../../../Shared/Services/utils'

const SmeLoanContract = (props) => {
  console.log(props)
  return (
    <>
      <div className="loan-contract" dir="rtl" lang="ar">
        <div className="report-container">
          <table>
            <thead className="report-header">
              <tr>
                <th className="report-header-cell">
                  <div className="header-info">
                    <table className="textcenter bottomborder">
                      <thead>
                        <tr>
                          <td>
                            <table
                              style={{
                                fontSize: '12px',
                                margin: '10px 0px',
                                textAlign: 'center',
                                width: '100%',
                              }}
                            >
                              <thead>
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
                                    <div className="logo-print" />
                                  </th>
                                  <th colSpan={6}>
                                    ترخيص ممارسه نشاط التمويل متناهي الصغر رقم
                                    (2) لسنه 2015
                                  </th>
                                </tr>
                                <tr style={{ height: '10px' }} />
                              </thead>
                            </table>
                          </td>

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
                <td
                  className="report-content-cell"
                  style={{ textAlign: 'right' }}
                >
                  <div className="main">
                    <div className="headtitle textcenter">مرفق رقم (2) </div>

                    <div className="headtitle textcenter">عقد قرض</div>
                    <div className="headtitle textcenter">
                      <u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u>
                    </div>
                    <div>
                      انه في يوم{' '}
                      {dayToArabic(new Date(props.data.creationDate).getDay())}{' '}
                      الموافق {timeToArabicDate(props.data.creationDate, false)}
                    </div>
                    <div>
                      حرر هذا العقد في فرع {props.branchDetails.name} الكائن في:
                      &nbsp;&nbsp;
                      {props.branchDetails.address}
                      <br />
                      بين كلا من:-
                    </div>
                    <table className="stakeholders">
                      <tbody>
                        <tr>
                          <td colSpan={4}>
                            <div>
                              <b>أولا:</b> شركة تساهيل للتمويل متناهي الصغر -
                              شركه مساهمه مصريه - مقيده بسجل تجاري استثمار
                              القاهره تحت رقم ٨٤٢٠٩ والكائن مقرها 3 شارع الزهور
                              - المهندسين - الجيزه والمقيده تحت رقم ٢ بهيئة
                              الرقابه الماليه ويمثلها في هذا العقد السيد/
                              ___________________________ بصفته مدير الفرع بموجب
                              تفويض صادر له من السيد/ منير اكرام نخله - رئيس
                              مجلس الإداره بتاريخ ٢٠١٦/٠٥/١٠
                            </div>
                          </td>
                        </tr>

                        <tr style={{ textAlign: 'left', lineHeight: '5' }}>
                          <td colSpan={4}>&quot;طرف أول - مقرض&quot;</td>
                        </tr>

                        <tr style={{ margin: '5px 0' }}>
                          <td>
                            <div>
                              <b>ثانيا:- السادة/شركة :-</b>
                              <span>{`  ${props.data.customer.businessName}`}</span>
                            </div>
                          </td>
                          <td style={{ width: '30%' }}>
                            <div>
                              <b> سجل تجاري رقم :</b>
                              <span>
                                {props.data.customer.commercialRegisterNumber}
                              </span>
                            </div>
                          </td>
                          <td style={{ width: '30%' }}>
                            <div>
                              <b>والكائن مقرها الرئيسي في:</b>
                              <span>{props.data.customer.businessAddress}</span>
                            </div>
                          </td>
                        </tr>
                        {props.data.entitledToSign.map(
                          (entitledToSign, index) => (
                            <tr key={index}>
                              <td>
                                <div>
                                  <b className="word-break">
                                    ويمثلها في التوقيع السيد :
                                  </b>
                                  <span>{entitledToSign.customerName}</span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b className="word-break">
                                    {' '}
                                    ويحمل بطاقه رقم قومى{' '}
                                  </b>
                                  <span>
                                    {entitledToSign.nationalId &&
                                      numbersToArabic(
                                        entitledToSign.nationalId
                                      )}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                        <tr style={{ textAlign: 'left', lineHeight: '5' }}>
                          <td colSpan={4}>&quot;طرف ثان - مقترض&quot;</td>
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
                        وقد تقدم الطرف الثانى بطلب للحصول على قرض من فرع الطرف
                        الاول الكائن {'_______________________________________'}{' '}
                        لحاجته للسيوله النقديه يخصص استخدامه فى تمويل نشاطه
                        الجاري وذلك وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤ المشار
                        اليه .
                      </div>
                      <div>
                        وقد وافق الطرف الاول على ذلك وفقا للشروط والضوابط
                        الوارده بهذا العقد .
                      </div>
                      <div>
                        وبعد ان اقر الأطراف باهليتهما القانونيه للتصرف والتعاقد
                        فقد اتفقا على بنود العقد التاليه .
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الأول</div>
                      <div>
                        يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه
                        مرفقات او ملاحق موقعه من الأطراف ان وجدت .
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الثاني</div>
                      <div>
                        يقر الطرف الثانى ( المقترض ) باستلامه من الطرف الاول (
                        المقرض ) مبلغ وقدره{' '}
                        {`${numbersToArabic(
                          props.data.principal
                        )} جنيه (${new Tafgeet(
                          props.data.principal,
                          'EGP'
                        ).parse()})`}
                        نقدا . ويعتبر توقيع الطرف الثانى على هذا العقد بمثابه
                        اقرارا نهائيا منه باستلام كامل مبلغ القرض.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الثالث</div>
                      <div>
                        يلتزم ويتعهد الطرف الثاني بإستخدام هذا القرض في الغرض
                        المخصص له وفي حالة مخالفة ذلك يعتبر حالة من حالات
                        الاخلال المنصوص عليها بهذا العقد .
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الرابع</div>
                      <div>
                        يلتزم الطرفان الثانى والضامنين متضامنين فيما بينهم بسداد
                        اجمالى قيمه القرض وكافه المصروفات وتكاليف التمويل الى
                        الطرف الاول وذلك بواقع مبلغ اجمالي قدره
                        {`${numbersToArabic(
                          props.data.principal
                        )} جنيه (${new Tafgeet(
                          props.data.principal,
                          'EGP'
                        ).parse()})`}{' '}
                        يتم سداده علي ( مدة السداد ) وذلك علي النحو التالي : ـ
                        بواقع {' _____________________________'} قسط ( اسبوعيه
                        او كل خمسة عشر يوما او كل شهر ) قيمة كل قسط
                        {'____________________________ '}
                        يبدأ في{' '}
                        {timeToArabicDate(
                          props.data.installmentsObject.installments[0]
                            .dateOfPayment,
                          false
                        )}{' '}
                        وينتهي في
                        {timeToArabicDate(
                          props.data.installmentsObject.installments[
                            props.data.installmentsObject.installments.length -
                              1
                          ].dateOfPayment,
                          false
                        )}{' '}
                        علي ان يتم السداد نقدي بمقر فرع الطرف الاول الكائن في{' '}
                        {'____________________________ '}
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الخامس</div>
                      <div>
                        يقر الاطراف الثانى والضمنين بسداد كافه المبالغ الوارده
                        بالبند السابق وفقا للمواعيد المذكوره به وان هذه المبالغ
                        تعد قيمه القرض وكافه مصروفانه وتكاليف تمويله , ولا يحق
                        لأي منهما المنازعه فى ذلك اعمالا للماده ( ١٦ ) من
                        القانون رقم ١٤١ لسنه ٢٠١٤ الخاص بتمويل المشروعات
                        المتوسطة والصغيرة ومتناهية الصغر
                      </div>
                    </section>

                    <section>
                      <div className="title">البند السادس</div>
                      <div>
                        يلتزم الاطراف الثانى والضامنين متضامنين فيما بينهما
                        بسداد اقساط القرض وفقا لما هو وارد بالبند الثالث من هذا
                        العقد وفى حاله تأخرهما فى سداد قيمه اى قسط فى تاريخ
                        استحقاقه يلتزما بسداد غرامه تأخير بواقع واحد جنيه عن كل
                        ألف جنيه عن كل يوم تأخير تبدأ من اليوم التالى للاستحقاق
                        القسط وحتى تمام السداد.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند السابع</div>
                      <div>
                        يلتزم الطرف الثاني بدفع كافة مصاريف هذا العقد والرسوم
                        والدمغات المستحقة قانونا
                      </div>
                    </section>

                    <section style={{ pageBreakAfter: 'always' }}>
                      <div className="title">البند الثامن</div>
                      <div>
                        فى حاله عدم التزام المقترض باى من التزاماتهما التعاقديه
                        او القانونيه الوارده بهذا العقد وملاحقاته ومرفقاته
                        الموقعه ( ان وجدت ) وبالقوانين الساريه فى اى وقت من
                        الاوقات يعد الطرف الثانى مخفقا فى الوفاء بالتزاماته
                        التعاقديه او القانونيه ويعتبر هذا العقد مفسوخا من تلقاء
                        نفسه دون حاجه الى اعذار او اتخاذ اجراءات قضائيه ويحق
                        للطرف الاول فورا مطالبته أو الضامنين أو هم معا بباقى
                        قيمه القرض وكافه مصروفاته وتكاليف تمويله ومن حالات
                        الاخفاق على سبيل المثال وليس الحصر ما يلى :-
                        <ul>
                          <li>
                            عدم سداد اى قسط من الاقساط طبقا للشروط والضوابط
                            الوارده بهذا العقد .
                          </li>
                          <li>
                            فى حاله استخدام مبلغ التمويل فى غير الغرض الممنوح من
                            اجله الوارد بهذا العقد ,
                          </li>
                          <li>
                            فى حاله تقديم الطرف الثاني أو ضامنيه بيانات او
                            معلومات مخالفه للواقع او غير سليمه وذلك الى المقرض .
                          </li>
                          <li>
                            فى حاله فقد الطرف الثانى أو الضامنين اهليته او اشهار
                            افلاسه اواعساره او وفاته او وضعه تحت الحراسه او
                            توقيع الحجز على امواله او وضع امواله تحت التحفظ
                            ومنعه من التصرف فيها او انقضائه او ادماجه او وضعه
                            تحت التصفيه .
                          </li>
                          <li>
                            اذا تاخر الطرف الثانى فى سداد اية ضرائب او رسوم
                            مقرره على المشروع الممول موضوع هذا العقد .
                          </li>
                          <li>
                            اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز
                            الادارى او البيع الجبرى على المشروع الممول كله او
                            بعضه , او اذا تم التصرف فى جزء او كل من المشروع
                            الممول او اذا تم تاجيره للغير
                          </li>
                          <li>
                            فى حاله عدم قدره الطرف الثانى أو الضامنين عن سداد
                            التمويل او توقف اعمال المشروع الممول لاى سبب من
                            الاسباب.
                          </li>
                        </ul>
                      </div>
                    </section>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <section>
                              <div className="title">البند التاسع</div>
                              <div>
                                يلتزم كل طرف من اطراف هذا العقد بسداد الضريبه
                                المستحقه عليه وفقا لاحكام القانونا.
                              </div>
                            </section>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <section>
                              <div className="title">البند العاشر</div>
                              <div>
                                تسرى احكام القانون رقم 141 لسنه 2014 بشأن تمويل
                                المشروعات المتوسطة والصغيرة ومتناهية الصغر
                                ولائحته التنفيذيه وتعدلاته ( ان وجد ) على هذا
                                العقد وتعتبر مكمله له
                              </div>
                            </section>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <section>
                              <div className="title">البند الحادي عشر</div>
                              <div>
                                اتخد كل طرف العنوان المبين قرين كل منهما بصدر
                                هذا العقد محلا مختار له وفى حاله تغيير ايا منهم
                                لعنوانه يلتزم بأخطار الطرف الاخر بموجب خطاب مسجل
                                بعلم الوصول والا اعتبر اعلانه على العنوان الاول
                                صحيحا ونافذا ومنتجا لكافه اثاره القانونيه. وقد
                                تحرر هذا العقد من عدد {'( ________ '} نسخه تسلم
                                لكل طرف نسخه للعمل بمقتضاها عند اللزوم.
                              </div>
                            </section>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <section>
                              <div className="title">البند الثاني عشر</div>
                              <div>
                                في حالة الرجوع الي المحاكم بشأن هذا العقد أو
                                بسبب أي نزاع أو إدعاء ينشأ فإن الطرف الثاني
                                وضمنيه يوافقو مقدما علي أن تكون محاكم جمهورية
                                مصر العربية بكافة درجاتها وأنواعها وفقا لقواعد
                                الاختصاص القضائي هي المحاكم ذات الصلاحية
                                والاختصاص للفصل في أي نزاع أو إدعاء ينشأ عن هذا
                                العقد ويسقط حقه بالاعتراض علي صلاحية واختصاص
                                المحكمة التي وافق عليها مقدما .
                              </div>
                              <div>
                                تحريرا في{' '}
                                {timeToArabicDate(
                                  props.data.creationDate,
                                  false
                                )}{' '}
                              </div>
                            </section>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table className="signature_space">
                              <tbody>
                                <tr>
                                  <td style={{ paddingBottom: 70 }}>
                                    <div>
                                      <b>الطرف الأول</b>
                                    </div>
                                    <div style={{ marginBottom: 30 }}>
                                      <b>الأسم:</b>
                                    </div>
                                    <div>
                                      <b>التوقيع:</b>
                                    </div>
                                  </td>
                                  <td style={{ paddingBottom: 70 }}>
                                    <div>
                                      <b>الطرف الثاني</b>
                                    </div>
                                    <div>
                                      <b>الأسم:</b>
                                    </div>
                                    <div>
                                      <b>التوقيع:</b>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td className="headtitle textcenter">
                            <u>إقرار وتعهد الكفالة التضامنية</u>
                          </td>
                        </tr>

                        <tr>
                          <td style={{ paddingBottom: 10 }}>
                            <div>
                              أقر وأتعهد أنا السيد/ {`                   `}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: 10 }}>
                            <div>المقيم في/ {`                   `}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: 10 }}>
                            <div>بطاقة رقم قومي/ {`                   `}</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            لشركة تساهيل للتمويل – مصر إقرار وتعهد نهائيا لا
                            رجعة فيهما بموجب توقيعي على هذة الكفالة التضامنية
                            وبموجب عقد التمويل الشخصي المشار إلية بعالية بأنني
                            أضمن وأكفل الطرف الثاني من عقد التمويل الشخصي.
                            السادة شركة
                            {`  ${props.data.customer.businessName} `} في سداد
                            أقساط التمويل الممنوح لها من الطرف الأول بموجب عقد
                            التمويل الشخصي المشار إلية بعالية وكل مايستحق علية
                            من عوائد وعمولات ومصاريف وذلك طول فترة سداد التمويل
                            وحتى تمام سداده وذالك وفقا للأتي:
                            <ol>
                              <li>
                                أقر بأنني قد أطلعت على كافة بنود وشروط عقد
                                التمويل الشخصي المشار إلية بعالية وأن توقيعي على
                                الكفالة التضامنية بمثابة توقيعي على هذا العقد
                                كطرف ثالث كفيل وضامن لسداد التمويل الممنوح من
                                الطرف الاول للسادة شركة{' '}
                                {`  ${props.data.customer.businessName} `}
                              </li>
                              <li>
                                أصرح للطرف الأول بالأستعلام والأطلاع على حساباتي
                                والمعلومات والبيانات الخاصة بي لدى الشركة ولدى
                                البنك المركزي المصري أو أي من البنوك العاملة في
                                جمهورية مصر العربية ,كما أصرح للشركة بتقديم
                                البيانات أو الأوراق الخاصة بي مع باقي البنوك
                                وذالك دون أدنى أعتراض منى ودون أدنى مسئولية على
                                البنك.
                              </li>
                              <li>
                                أقر بأنة يحق للطرف الأول دون الرجوع لي مطالبتي
                                بسداد الدين المستحق لصالحة والناتج عن التمويل
                                الممنوح للسادة شركة{' '}
                                {`  ${props.data.customer.businessName} `}
                                وذالك بموجب توقيعي على هذة الكفالة التضامنية
                                وذالك دون أعتراض مني على ذلك .
                              </li>
                              <li>
                                أقر بأن التزامي بموجب هذة الكفالة التضامنية غير
                                قابل للرجوع فية بأي وجه ولأي سبب ولا يجوز لي
                                إلغائها إلا بعد إستيفائه لكافة مستحقاته دون أي
                                معارضه مني أو من الغير ولا يحق لي مطالبة الشركه
                                بأي تعويض مع حق الشركه في إتخاذ ما يلزم من
                                إجراءات ضدي وبما في ذالك الإجراءات القضائيه في
                                حالة عدم إلتزامي بشروط هذه الكفاله التضامنيه
                                وكذا شروط التمويل الممنوح.
                              </li>
                            </ol>
                          </td>
                        </tr>
                        <tr>
                          <td>وهذا إقرار مني بذالك</td>
                        </tr>

                        <tr>
                          <td>
                            <table>
                              <tbody>
                                <tr>
                                  <td>
                                    <div> المقر بما فيه المقر بما فيه:</div>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ paddingBottom: 80 }}>
                                    <div>
                                      الاسم/ {'                              '}
                                    </div>
                                  </td>
                                  <td style={{ paddingBottom: 80 }}>
                                    <div>التوقيع:-----------------------</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
      </div>
    </>
  )
}

export default SmeLoanContract

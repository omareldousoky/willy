import React from 'react'

import './style.scss'

import Tafgeet from 'tafgeetjs'

import {
  dayToArabic,
  getAge,
  getIndexInArabic,
  numbersToArabic,
  orderLocal,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import local from '../../../../Shared/Assets/ar.json'

export const SmeLoanContract = ({ data, branchDetails }) => {
  return (
    <>
      <div className="loan-contract" dir="rtl" lang="ar">
        <div className="report-container">
          <table>
            <thead className="report-header">
              <tr>
                <th className="report-header-cell">
                  <div className="header-info">
                    <table className="text-center bottomborder">
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
                                    <div className="logo-print-tb" />
                                  </th>
                                  <th colSpan={6}>
                                    ترخيص ممارسة نشاط تمويل المشروعات المتوسطة
                                    والصغيرة رقم ١ لسنه ٢٠٢١
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

                    <div className="headtitle textcenter">
                      عقد تمويل المشروعات المتوسطة والصغيرة
                    </div>
                    <div className="headtitle textcenter">
                      <u>وفقا لاحكام القانون رقم ١٤١ لسنه ٢٠١٤</u>
                    </div>
                    <div>
                      انه في يوم
                      {dayToArabic(new Date(data.creationDate).getDay())}
                      الموافق {timeToArabicDate(data.creationDate, false)}
                    </div>

                    <div>
                      حرر هذا العقد في فرع {branchDetails.name} الكائن في:
                      {branchDetails.address}
                      <br />
                      بين كلا من:-
                    </div>
                    <section className="stakeholders">
                      <p>
                        <b>أولا:</b> شركة تساهيل للتمويل متناهي الصغر - شركه
                        مساهمه مصريه - مقيده بسجل تجاري استثمار القاهره تحت رقم
                        ___________________ والكائن مقرها ٣ شارع الزهور
                        بالمهندسين والمقيده تحت رقم (1) بهيئة الرقابه الماليه
                        ويمثلها في هذا العقد السيد/ ___________________________
                        بصفته ________________________________
                      </p>

                      <p className="d-flex justify-content-end my-3">
                        &quot;طرف أول - مقرض&quot;
                      </p>

                      <div className="d-flex justify-content-between ">
                        <div>
                          <b>ثانيا:- السادة/شركة :-</b>
                          <span>{data.customer.customerName} </span>
                        </div>
                        <div>
                          <b> سجل تجاري رقم :</b>
                          <span>{data.customer.commercialRegisterNumber}</span>
                        </div>
                        <div>
                          <b>والكائن مقرها الرئيسي في:</b>
                          <span>{data.customer.businessAddress}</span>
                        </div>
                      </div>
                      <div>
                        {data.entitledToSign.map((entitledToSign, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between "
                          >
                            <div>
                              <b className="word-break">
                                ويمثلها في التوقيع السيد :
                              </b>
                              <span>
                                {entitledToSign.customer.customerName}
                              </span>
                            </div>
                            <div>
                              <b className="word-break">
                                ويحمل بطاقه رقم قومى:
                              </b>
                              <span>{entitledToSign.customer.nationalId}</span>
                            </div>
                            <div>
                              <b className="word-break">تليفون: </b>
                              <span>
                                {entitledToSign.customer.homePhoneNumber ||
                                  entitledToSign.customer.businessPhoneNumber}
                              </span>
                            </div>
                            <div>
                              <b>السن: </b>
                              <span>
                                {getAge(entitledToSign.customer.birthDate)} عام
                              </span>
                            </div>
                            <div>
                              <b> المهنه : </b>
                              <span>
                                {local[entitledToSign.position] ||
                                  entitledToSign.position}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="d-flex justify-content-end my-3 pt-4">
                        &quot;طرف ثان - مقترض&quot;
                      </p>

                      <div>
                        {data.guarantors.map((guarantor, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between "
                          >
                            <p>
                              <b> {getIndexInArabic(index)[0]}:-</b>
                            </p>
                            <div>
                              <b className="word-break">السيد: </b>
                              <span>{guarantor.customerName}</span>
                            </div>
                            <div>
                              <b className="word-break">
                                ويحمل بطاقه رقم قومى:
                              </b>
                              <span>{guarantor.nationalId}</span>
                            </div>
                            <div>
                              <b className="word-break">تليفون: </b>
                              <span>
                                {guarantor.homePhoneNumber ||
                                  guarantor.businessPhoneNumber}
                              </span>
                            </div>
                            <div>
                              <b>العنوان: </b>
                              <span>{guarantor.customerHomeAddress} </span>
                            </div>
                            <div>
                              <b>السن: </b>
                              <span>{getAge(guarantor.birthDate)} عام</span>
                            </div>
                            <div>
                              <b> المهنه : </b>
                            </div>
                            <p className="d-flex justify-content-end my-3 pt-4">
                              &quot;طرف {getIndexInArabic(index)[1]} ضامن
                              متضامن&quot;
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <div className="title">تمهيد</div>
                      <div>
                        لما كانت الشركه الطرف الاول ( المقرض ) مرخصا لها بممارسه
                        نشاط تمويل المشروعات المتوسطة والصغيرة ومتناهية الصغر
                        والمقيده لدى الهيئه العامه للرقابه الماليه تحت رقم 1
                        لسنة 2021 وذلك اعمالا لاحكام القانون رقم 141 لسنه 2014
                        الخاص بتمويل المشروعات المتوسطة والصغيرة ومتناهية الصغر
                      </div>
                      <div>
                        وقد تقدم الطرف الثانى بطلب للحصول على قرض من فرع الطرف
                        الاول الكائن ٣ شارع الزهور المهندسين لحاجته للسيوله
                        النقديه يخصص استخدامه فى &nbsp;{' '}
                        {data.customer.businessSector} &nbsp; وذلك وفقا لاحكام
                        القانون رقم ١٤١ لسنه ٢٠١٤ وتعديلاته المشار اليه. وذلك
                        بضمان وتضامن الطرف الثالث.
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
                      <p>
                        يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه
                        مرفقات او ملاحق موقعه من الأطراف ان وجدت .
                      </p>
                    </section>

                    <section>
                      <div className="title">البند الثاني</div>
                      <div>
                        يقر الطرف الثانى ( المقترض ) باستلامه من الطرف الاول (
                        المقرض ) مبلغ وقدره
                        {`${numbersToArabic(
                          data.principal
                        )} جنيه (${new Tafgeet(
                          data.principal,
                          'EGP'
                        ).parse()})`}
                        نقدا او تحويل بنكي . ويعتبر توقيع الطرف الثانى على هذا
                        العقد بمثابه اقرارا نهائيا منه باستلام كامل مبلغ القرض.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الثالث</div>
                      <div>
                        يلتزم الطرفان الثاني والثالث ضامنين متضامنين فيما بينهم
                        بسداد اجمالي قيمة القرض البالغة
                        {`${numbersToArabic(
                          data.principal
                        )} جنيه (${new Tafgeet(
                          data.principal,
                          'EGP'
                        ).parse()})`}
                        وكافة المصروفات الادارية البالغه
                        {`${numbersToArabic(
                          data.applicationFeesRequired
                        )} جنيه (${new Tafgeet(
                          data.applicationFeesRequired,
                          'EGP'
                        ).parse()})`}
                        وتكاليف التمويل البالغه
                        {`${numbersToArabic(
                          data.installmentsObject.totalInstallments.feesSum
                        )}
                        جنيه (${new Tafgeet(
                          data.installmentsObject.totalInstallments.feesSum,
                          'EGP'
                        ).parse()}) الي الطرف الأول وذلك بواقع اجمالي مبلغ تكلفة التمويل قدره`}
                        {`${numbersToArabic(
                          data.installmentsObject.totalInstallments
                            .installmentSum +
                            (data.applicationFeesRequired
                              ? data.applicationFeesRequired
                              : 0)
                        )} جنيه (${new Tafgeet(
                          data.installmentsObject.totalInstallments
                            .installmentSum +
                            (data.applicationFeesRequired
                              ? data.applicationFeesRequired
                              : 0),
                          'EGP'
                        ).parse()})`}
                        ، يتم سداده علي عدد
                        {numbersToArabic(
                          data.installmentsObject.installments.length
                        )}
                        قسط كل {numbersToArabic(data.product.periodLength)}
                        {data.product.periodType === 'days'
                          ? local.day
                          : local.month}
                        قيمة كل قسط
                        {`${numbersToArabic(
                          data.installmentsObject.installments[0]
                            .installmentResponse
                        )} جنيه (${new Tafgeet(
                          data.installmentsObject.installments[0].installmentResponse,
                          'EGP'
                        ).parse()})`}
                        ، تبدأ في
                        {timeToArabicDate(
                          data.installmentsObject.installments[0].dateOfPayment,
                          false
                        )}
                        وينتهي في
                        {timeToArabicDate(
                          data.installmentsObject.installments[
                            data.installmentsObject.installments.length - 1
                          ].dateOfPayment,
                          false
                        )}
                        علي ان يتم السداد نقدي بمقر فرع الطرف الاول الكائن في
                        {branchDetails.address} او بايداع بنكي
                        <p>
                          وفي حاله رغبه الطرف الثاني في جدوله او ترحيل القرض
                          يقوم بتقديم طلب الي الطرف الاول وعند الموافقه عليه يتم
                          فرض تكاليف خاصه بهذه العمليه وفق نفس سعر العائد
                          الممنوح به القرض وتكون الجدوله بحد اقصي ضعف المده
                          المتبقيه للعميل عند طلب الجدوله
                        </p>
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الرابع</div>
                      <p>
                        يقر الطرفان الثانى والثالث ضامنين متضامنين بسداد كافه
                        المبالغ الوارده بالبند السابق وفقا للمواعيد المذكوره به
                        وان هذه المبالغ تعد قيمه القرض وكافه مصروفاته وتكاليف
                        تمويله , ولا يحق لأي منهما المنازعه فى ذلك اعمالا للماده
                        ( 16 ) من القانون رقم 141 لسنه 2014 الخاص بتمويل
                        المشروعات المتوسطة والصغيرة ومتناهية الصغر
                      </p>
                    </section>

                    <section>
                      <div className="title">البند الخامس</div>
                      <div>
                        يلتزم الطرفان الثانى والثالث ضامنين متضامنين فيما بينهما
                        بسداد اقساط القرض وفقا لما هو وارد بالبند الثالث من هذا
                        العقد وفى حاله تأخرهما فى سداد قيمه اى قسط فى تاريخ
                        استحقاقه يلتزما بسداد غرامه تأخير بواقع واحد جنيه عن كل
                        الف عن كل يوم تاخير تبدأ من اليوم التالى للاستحقاق القسط
                        وحتى تمام السداد ولا توجد فتره سماح عن تاريخ الاستحقاق
                        وذلك بحد اقصي 90 يوم من تاريخ الاستحقاق المتاخر حتي
                        اتخاذ الاجراءات القانونيه ضده مع ملاحظه انه لابد من
                        انذار الطرف الاول للطرف الثاني قبل اتخاذ اي اجراء قانوني
                        ضده
                      </div>
                    </section>

                    <section>
                      <div className="title">البند السادس</div>
                      <div>
                        فى حاله عدم التزام المقترض أو الضامن باى من التزاماتهما
                        التعاقديه او القانونيه الوارده بهذا العقد وملاحقاته
                        ومرفقاته الموقعه ( ان وجدت ) وبالقوانين الساريه فى اى
                        وقت من الاوقات يعد الطرفان الثانى والثالث مخفقان فى
                        الوفاء بالتزاماتهما التعاقديه او القانونيه ويعتبر هذا
                        العقد مفسوخا من تلقاء نفسه دون حاجه الى اعذار او اتخاذ
                        اجراءات قضائيه ويحق للطرف الاول فورا مطالبه أي من
                        الطرفان الثاني أو الثالث أو الإثنين معا بباقى قيمه القرض
                        وكافه مصروفاته وتكاليف تمويله ومن حالات الاخفاق على سبيل
                        المثال وليس الحصر ما يلى :-
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
                          <li>
                            يلتزم الطرف الثاني بسداد كافه المصروفات والمصاريف
                            القضائيه بكل انواعها
                          </li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <div className="title">البند السابع</div>
                      <div>
                        يلتزم كل طرف من اطراف هذا العقد بسداد الضريبه المستحقه
                        عليه وفقا لاحكام القانون
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الثامن</div>
                      <p>
                        يقر الطرف الثالث الضامن المتضامن بانه يكفل علي سبيل (
                        الضمان والتضامن ) الطرف الثاني لقيمه هذا القرض من اصل
                        وعوائد وعمولات وكافة المصروفات ، ويحق للمقرض(الطرف
                        الأول) الرجوع عليه بكامل قيمه المديونيات المستحقه علي
                        هذا القرض ، ولايحق للطرف الثالث الدفع بالتجريد او
                        التقسيم او اي دفوع اخري في مواجهة المقرض ويحق للمقرض
                        الرجوع عليه وحده او الرجوع عليه وعلي المقترض منفردا او
                        مجتمعين معا بكامل قيمه المديونيات المستحقه له .{' '}
                      </p>
                    </section>
                    <section>
                      <div className="title">البند التاسع</div>
                      <div>
                        يلتزم الطرف الاول بالحفاظ علي خصوصيه بيانات ومعلومات
                        الطرف الثاني والثالث وضمان عدم استخدامها من قبل الطرف
                        الاول او احد موظفيه او وكلائه او مشاركتها مع اخرين دون
                        الحصول علي موافقه صريحه من الطرف الثاني والثالث وفي حدود
                        هذه الموافقه كما يلتزم الطرف الاول بالاحتفاظ بالمستندات
                        الخاصه بالعملاء لمده 5 سنوات من تاريخ اخر معامله وفق
                        متطلبات قانون غسل الاموال وتمويل الارهاب
                      </div>
                    </section>
                    <section>
                      <div className="title">البند العاشر</div>
                      <div>
                        من المتفق بين الطرفين ان الشركة ( الطرف الاول ) يحق لها
                        توريق محفظة ديونها لدى الغير او خصمها - كما يحق للطرف
                        الاول ان يحيل كافة حقوقه الناشئة عن هذا العقد او جزء
                        منها الى الغير . ويحق له الافصاح للجهة المحال اليها عن
                        كافة بيانات الطرف الثانى ويعد توقيع الطرف الثانى وضامنية
                        على هذا العقد موافقتهم على قيام الطرف الاول بحوالة تلك
                        الحقوق او جزء منها الى الغير وذلك يشمل كافة الجهات
                        وشركات التمويل والبنوك والمؤسسات التى تباشر نشاط التوريق
                        والمباشرة للانشطة المالية غير المصرفية وغيرها من كافة
                        الانشطة المتعلقة بسوق المال
                      </div>
                    </section>
                    <section>
                      <div className="title">البند الحادي عشر</div>
                      <div>
                        يلتزم الطرف الاول بقبول طلب الطرف الثاني بالسداد المعجل
                        ويحق للطرف الاول خصم تكلفه التمويل الذي تم فيه السداد
                        ويجوز لها اضافه عموله سداد معجل بما لا يزيد عن 5% من
                        باقي المستحق ( اصل ) المراد تعجيل الوفاء به
                      </div>
                    </section>
                    <section>
                      <div className="title">البند الثاني عشر</div>
                      <div>
                        تسرى احكام القانون رقم 141 لسنه 2014 بشأن تمويل
                        المشروعات المتوسطة والصغيرة ومتناهية الصغر ولائحته
                        التنفيذيه وتعدلاته ( ان وجد ) على هذا العقد وتعتبر مكمله
                        له وتختص المحاكم الاقتصاديه بالفصل فى اى نزاع قد ينشأ
                        بخصوص تفسير او تنفيذ اى بند من بنود هذا العقد. كما تطبق
                        احكام القوانين الساريه بجمهوريه مصر العربيه فى حاله خلو
                        القانون المشار اليه من تنظيم النزاع المطروح على المحكمه.
                      </div>
                    </section>
                    <section>
                      <div className="title"> البند الثالث عشر</div>
                      <div>
                        اتخد كل طرف العنوان المبين قرين كل منهما بصدر هذا العقد
                        محلا مختار له وفى حاله تغيير ايا منهم لعنوانه يلتزم
                        بأخطار الطرف الاخر بموجب خطاب مسجل بعلم الوصول والا
                        اعتبر اعلانه على العنوان الاول صحيحا ونافذا ومنتجا لكافه
                        اثاره القانونيه. وقد تحرر هذا العقد من عدد (___________)
                        نسخه تسلم لكل طرف نسخه للعمل بمقتضاها عند اللزوم.
                      </div>
                    </section>
                    <div className="d-flex flex-wrap">
                      <div className="mt-5 w-50">
                        <div>
                          <b> الطرف الاول ( الدائن ) </b>
                        </div>
                        <div style={{ marginBottom: 30 }}>
                          <b>الأسم:</b>
                        </div>
                        <div>
                          <b>التوقيع:</b>
                        </div>
                      </div>
                      <div className="mt-5 w-50">
                        <div>
                          <b>الطرف الثانى ( المدين )</b>
                        </div>
                        <div>
                          <b>
                            الأسم:{' '}
                            {data.entitledToSign[0].customer.customerName}
                          </b>
                        </div>
                        <div>
                          <b>التوقيع:</b>
                        </div>
                      </div>
                      {data.guarantors.map((guarantor, index) => (
                        <div
                          style={{ paddingBottom: 70 }}
                          key={index}
                          className="mt-5 w-50"
                        >
                          <div>
                            <b>
                              {' '}
                              الطرف {orderLocal[index + 2]}( الضامن المتضامن )
                            </b>
                          </div>
                          <div>
                            <b>الأسم: {guarantor.customerName}</b>
                          </div>
                          <div>
                            <b>التوقيع:</b>
                          </div>
                        </div>
                      ))}
                    </div>
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

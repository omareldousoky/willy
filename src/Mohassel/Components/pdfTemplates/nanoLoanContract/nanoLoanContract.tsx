import React from 'react'
import './nanoLoanContract.scss'
import * as Barcode from 'react-barcode'
import Tafgeet from 'tafgeetjs'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  numbersToArabic,
  timeToArabicDate,
  dayToArabic,
  getIndexInArabic,
  getNumbersOfGuarantor,
  getIndexOfGuarantorInAr,
} from '../../../../Shared/Services/utils'

const NanoLoanContract = (props) => {
  const {
    data: { installmentsObject, guarantors, customer },
    branchDetails,
    loanUsage,
  } = props

  const installments = installmentsObject?.installments?.filter(
    (installment) => installment.id !== 0
  )
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
                                ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2)
                                لسنه 2015
                              </th>
                            </tr>
                            <tr style={{ height: '10px' }} />
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
              <td
                className="report-content-cell"
                style={{ textAlign: 'right' }}
              >
                <div className="main">
                  <div className="headtitle textcenter">
                    عقد تمويل متناهي الصغر (فردي{' '}
                    {guarantors.length
                      ? `${numbersToArabic(guarantors.length)} ضامن`
                      : ''}
                    ) {local.nano}
                  </div>
                  <div className="headtitle textcenter">
                    <u>وفقا لاحكام القانون رقم ١٤٢ لسنه ٢٠١٩</u>
                  </div>
                  <div>
                    انه في يوم{' '}
                    {dayToArabic(new Date(props.data.creationDate).getDay())}{' '}
                    الموافق {timeToArabicDate(props.data.creationDate, false)}
                  </div>
                  <div>
                    حرر هذا العقد في فرع {branchDetails.name} الكائن في:{' '}
                    {branchDetails.address} بين كلا من:-
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
                            <b>ثانيا:- السيد :-&nbsp;</b>
                            <span>{props.data.customer.customerName}</span>
                          </div>
                        </td>
                        <td style={{ width: '30%' }}>
                          <div>
                            <b>الكائن:&nbsp;</b>
                            <span>
                              {props.data.customer.customerHomeAddress}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <b className="word-break">رقم قومي</b>{' '}
                            <span>
                              {numbersToArabic(props.data.customer.nationalId)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <b>تليفون</b>{' '}
                            <div
                              style={{ display: 'inline-block', width: '80px' }}
                            >
                              {numbersToArabic(
                                props.data.customer.mobilePhoneNumber
                              ) +
                                '-' +
                                numbersToArabic(
                                  props.data.customer.homePhoneNumber
                                ) +
                                '-' +
                                numbersToArabic(
                                  props.data.customer.businessPhoneNumber
                                )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={4}>&quot;طرف ثان - مقترض&quot;</td>
                      </tr>
                      {guarantors.map((guarantor, index) => {
                        return (
                          <>
                            <tr>
                              <td>
                                <div>
                                  <b>
                                    {getIndexInArabic(index)[0]}:- السيد
                                    :-&nbsp;
                                  </b>
                                  <span>{guarantor.customerName}</span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <b>الكائن:&nbsp;</b>
                                  <span>{guarantor.customerHomeAddress}</span>
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
                                    {numbersToArabic(
                                      guarantor.mobilePhoneNumber
                                    ) +
                                      '-' +
                                      numbersToArabic(
                                        guarantor.homePhoneNumber
                                      ) +
                                      '-' +
                                      numbersToArabic(
                                        guarantor.businessPhoneNumber
                                      )}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr style={{ textAlign: 'left' }}>
                              <td colSpan={4}>
                                &quot;طرف {getIndexInArabic(index)[1]} - ضامن
                                متضامن&quot;
                              </td>
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </table>

                  <section>
                    <div className="title">تمهيد</div>
                    <div>
                      لما كانت الشركه الطرف الأول (المقرض) مرخصا لها بممارسة
                      نشاط التمويل متناهي الصغر والمقيده لدي الهيئه العامه
                      للرقابه الماليه تحت رقم ٢ وذلك اعمالا لاحكام القانون رقم
                      ١٤١ لسنه ٢٠١٤ واعمالا للقرار رقم ١٤٢ الخاص بتمويل النانو
                    </div>

                    <div>
                      وقد تقدم الطرف الثاني صاحب نشاط{' '}
                      {props.data.customer.businessSector} -{' '}
                      {props.data.customer.businessActivity} بطلب للحصول علي قرض{' '}
                      {local.nano} من فرع {branchDetails.name} الكائن{' '}
                      {branchDetails.address} لحاجته للسيوله النقديه يخصص
                      استخدامه في تمويل {loanUsage} وذلك وفقا لاحكام القانون رقم
                      ١٤١ لسنة ٢٠١٤ وقرار الهيئة رقم ١٤٢ لسنة ٢٠١٩ المشار اليه.
                      وقد وافقه الطرف الاول على ذلك وفقا للشروط والضوابط الوارده
                      بهذا العقد وبعد أن اقر الأطراف بأهليتهم القانونية للتصرف
                      والتعاقد فقد اتفقوا على بنود العقد التالية.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الأول</div>
                    <div>
                      يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه
                      مرفقات أو ملاحق موقعه من الطرفين ان وجدت.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثاني</div>

                    <div>
                      بموجب هذا العقد وافق الطرف الأول علي منح الطرف الثاني قرضا
                      بمبلغ
                      {`${numbersToArabic(
                        props.data.principal
                      )} جنيه (${new Tafgeet(
                        props.data.principal,
                        'EGP'
                      ).parse()})`}{' '}
                      ويقر الطرف الثاني بأن هذا المبلغ يمثل قرضا عليه يلتزم
                      بسداده للطرف الأول وفقا لما هو وارد بالبند الثالث من هذا
                      العقد.
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الثالث</div>
                    <div>
                      يلتزم{' '}
                      <span>{guarantors.length ? 'الطرفان' : 'الطرف'}</span>{' '}
                      الثاني{' '}
                      {guarantors.length
                        ? `و ${getNumbersOfGuarantor(
                            'and',
                            guarantors.length
                          )} ضامنين متضامنين فيما بينهم `
                        : ' '}
                      بسداد اجمالي قيمة القرض البالغة{' '}
                      {`${numbersToArabic(
                        props.data.principal
                      )} جنيه (${new Tafgeet(
                        props.data.principal,
                        'EGP'
                      ).parse()})`}{' '}
                      <span>
                        وكافة المصروفات الادارية البالغه{' '}
                        {`${numbersToArabic(
                          props.data.applicationFeesRequired
                        )} جنيه ${
                          props.data.applicationFeesRequired
                            ? `(${new Tafgeet(
                                props.data.applicationFeesRequired,
                                'EGP'
                              ).parse()})`
                            : ''
                        }`}{' '}
                        وتكاليف التمويل البالغه{' '}
                        {`${numbersToArabic(
                          installmentsObject.totalInstallments.feesSum
                        )} جنيه ${
                          installmentsObject.totalInstallments.feesSum
                            ? `(${new Tafgeet(
                                installmentsObject.totalInstallments.feesSum,
                                'EGP'
                              ).parse()})`
                            : ''
                        }`}{' '}
                        الي الطرف الأول وذلك بواقع اجمالي مبلغ تكلفه التمويل{' '}
                        مبلغ قدره{' '}
                        {`${numbersToArabic(
                          installmentsObject.totalInstallments.installmentSum +
                            (props.data.applicationFeesRequired
                              ? props.data.applicationFeesRequired
                              : 0)
                        )} جنيه (${new Tafgeet(
                          installmentsObject.totalInstallments.installmentSum +
                            (props.data.applicationFeesRequired
                              ? props.data.applicationFeesRequired
                              : 0),
                          'EGP'
                        ).parse()})`}
                      </span>
                      ، يتم سداده علي عدد {numbersToArabic(installments.length)}{' '}
                      قسط كل {numbersToArabic(props.data.product.periodLength)}{' '}
                      {props.data.product.periodType === 'days'
                        ? local.day
                        : local.month}{' '}
                      قيمة كل قسط{' '}
                      {`${numbersToArabic(
                        installments[0].installmentResponse
                      )} جنيه (${new Tafgeet(
                        installments[0].installmentResponse,
                        'EGP'
                      ).parse()})`}
                      ، تبدأ في{' '}
                      {timeToArabicDate(installments[0].dateOfPayment, false)}{' '}
                      وينتهي في{' '}
                      {timeToArabicDate(
                        installments[installments.length - 1].dateOfPayment,
                        false
                      )}{' '}
                      علي ان يتم السداد النقدي بأحدي وسائل الدفع الإلكتروني
                      المعتمده من هيئه الرقابه الماليه.
                      <p>
                        نشير الى ان حد الائتمان الاقصى{' '}
                        {numbersToArabic(customer.nanoLoansLimit)} جم وفقاً
                        للمواد عاليه ويكون السماح للتمويل للطرف الثانى فى حدود
                        هذا المبلغ ووفقاً لطلب الطرف الثانى والدراسة الائتمانية
                        من الطرف الثانى
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الرابع</div>
                    <div>
                      يقر <span>{guarantors.length ? 'الطرفان' : 'الطرف'}</span>{' '}
                      الثاني{' '}
                      {guarantors.length
                        ? `و ${getNumbersOfGuarantor(
                            'and',
                            guarantors.length
                          )} ضامنين متضامنين `
                        : ' '}{' '}
                      بسداد كافه المبالغ الوارده بالبند السابق وفقا للمواعيد
                      المذكوره به وان هذه المبالغ تعد قيمه القرض وكافه مصروفاته
                      وتكاليف تمويله
                    </div>
                  </section>

                  <section>
                    <div className="title">البند الخامس</div>
                    <div>
                      يلتزم{' '}
                      <span>{guarantors.length ? 'الطرفان' : 'الطرف'}</span>{' '}
                      الثاني{' '}
                      {guarantors.length
                        ? `و ${getNumbersOfGuarantor(
                            'and',
                            guarantors.length
                          )} ضامنين متضامنين فيما بينهم `
                        : ' '}{' '}
                      بسداد اقساط القرض وفقا لما هو وارد بالبند الثالث من هذا
                      العقد وفى حاله تأخرهم فى سداد قيمه اى قسط فى تاريخ
                      استحقاقه :
                    </div>
                    <div>
                      يتم تحصيل {numbersToArabic(2)} جنيهات عن كل يوم تأخير
                      ابتدأ من اليوم التالي لتاريخ استحقاق القسط
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
                      في حالة عدم التزام المقترض{' '}
                      <span>
                        {guarantors.length
                          ? `او الضامنين بأي من التزاماتهم `
                          : 'بأي من التزاماته '}
                      </span>
                      التعاقديه او القانونيه الوارده بهذا العقد وملحقاته
                      ومرفقاته الموقعه (ان وجدت) وبالقوانين الساريه في اي وقت من
                      الأوقات يعد{' '}
                      <span>{guarantors.length ? 'الطرفان' : 'الطرف'}</span>{' '}
                      الثاني
                      {guarantors.length
                        ? `و ${getNumbersOfGuarantor('and', guarantors.length)}`
                        : ''}
                      <span>{guarantors.length ? 'مخفقان' : 'مخفق'}</span> في
                      الوفاء بالتزاماتهم التعاقديه والقانونيه ويعتبر هذا العقد
                      مفسوخا من تلقاء نفسه دون الحاجه للرجوع الي اعذار او اتخاذ
                      اجراءات قضائيه ويحق للطرف الاول فورا مطالبة{' '}
                      <span>
                        {guarantors.length
                          ? `أى من الطرفين
                      الثاني أو ${getNumbersOfGuarantor(
                        'and',
                        guarantors.length
                      )} أو الاثنين معا
                      جميعهم`
                          : 'الطرف الثاني'}
                      </span>{' '}
                      بباقي قيمة القرض وكافة مصروفاته و تكاليف تمويله
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
                      ٧/٣ في حالة تقديم الطرف الثاني{' '}
                      <span>
                        {guarantors.length
                          ? `أو ${getNumbersOfGuarantor(
                              'or',
                              guarantors.length
                            )}`
                          : ''}
                      </span>{' '}
                      بيانات أو معلومات مخالفه للواقع او غير سليمه وذلك الي
                      المقرض.
                    </div>
                    <div>
                      ٧/٤ في حاله فقد الطرف الثاني{' '}
                      <span>
                        {guarantors.length
                          ? `أو ${getNumbersOfGuarantor(
                              'or',
                              guarantors.length
                            )}`
                          : ''}
                      </span>{' '}
                      اهليته أو اشهار افلاسه او اعساره او وفاته او وضعه تحت
                      الحراسه او توقيع الحجز علي امواله او وضع امواله تحت التحفظ
                      ومنعه من التصرف فيها او انقضائه او اندماجه او وضعه تحت
                      التصفيه
                    </div>
                    <div>
                      ٧/٥ اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز
                      الادارى او البيع الجبري علي المشروع الممول بالقرض كله او
                      بعضه، او اذا تم التصرف في جزء او كل من المشروع الممول او
                      اذا تم تأجيره للغير.
                    </div>
                    <div>
                      ٧/٦ في حالة عدم قدرة الطرف الثاني{' '}
                      <span>
                        {guarantors.length
                          ? `أو ${getNumbersOfGuarantor(
                              'or',
                              guarantors.length
                            )}`
                          : ''}
                      </span>{' '}
                      عن سداد الاقساط في مواعيدها او توقف اعمال المشروع الممول
                      لاي سبب من الاسباب
                    </div>
                    <div>
                      ٧/٧ يلتزم{' '}
                      {guarantors.length > 0
                        ? `الاطراف الثاني و${getNumbersOfGuarantor(
                            'and',
                            guarantors.length
                          )} `
                        : 'الطرف الثاني '}
                      بسداد كافة المصروفات و المصاريف القضائية بكافة انواعها
                    </div>
                  </section>

                  <section style={{ pageBreakAfter: 'always' }}>
                    <div className="title">البند الثامن</div>
                    <div>
                      يلتزم كل طرف من أطراف هذا العقد بسداد الضريبه المستحقه
                      عليه وفقا لاحكام القانون
                    </div>
                  </section>
                  <tbody>
                    <section>
                      <div className="title">البند التاسع</div>
                      <div>
                        اطلع العميل على كافة الشروط الوارده بالعقد وتم شرحها له،
                        وتم تسليمه نسخه من بيان شروط التمويل موضحا به كافة
                        الشروط.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند العاشر</div>
                      <div>
                        تسرى احكام القانون رقم ١٤١ لسنة ٢٠١٤ وقرار رقم ١٤٢ لسنة
                        ٢٠١٩ بشأن تمويل النانو ولائحته التنفيذيه وتعديلاته (ان
                        وجد) علي هذا العقد وتعتبر مكمله له وتختص المحاكم
                        الإقتصاديه بالفصل في اي نزاع قد ينشأ بخصوص تفسير أو
                        تنفيذ اي بند من بنود هذا العقد.
                      </div>
                      <div>
                        كما تطبق أحكام القوانين الساريه بجمهورية مصر العربيه في
                        حالة خلو القانون المشار إليه من تنظيم النزاع المطروح علي
                        المحكمه.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الحادي عشر</div>
                      <div>
                        يجوز للطرف الثانى تجديد عقد التمويل بناءاً على طلب كتابى
                        منه أو من خلال التطبيق الإلكتروني يوضح مبلغ التمويل
                        الجديد ويسري هذا الطلب حال الموافقة عليه من قبل الطرف
                        الأول بكافة شروط عقد التمويل الحالي على ان يتم هذا
                        الاخطار قبل انتهاء العقد بعشرة ايام على الاقل.
                      </div>
                    </section>

                    <section>
                      <div className="title">البند الثاني عشر</div>
                      <div>
                        اتخذ كل طرف العنوان المبين قرين كل منهما بصدر العقد محلا
                        مختار له وفي حالة تغيير ايا منهم لعنوانه يلتزم بأخطار
                        الطرف الأخر بموجب خطاب مسجل بعلم الوصول والا اعتبر
                        اعلانه على العنوان الاول صحيحا ونافذا ومنتجا لكافه اثاره
                        القانونية.
                      </div>
                    </section>

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
                            <div style={{ marginBottom: 30 }}>
                              <b>الأسم:</b>
                            </div>
                            <div>
                              <b>التوقيع:</b>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          {guarantors.map((_guarantor, index) => {
                            return (
                              <td key={index} style={{ paddingBottom: 70 }}>
                                <div>
                                  <b>الطرف {getIndexOfGuarantorInAr(index)}</b>
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                  <b>الأسم:</b>
                                </div>
                                <div>
                                  <b>التوقيع:</b>
                                </div>
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
                    <div className="headtitle textcenter">
                      <u>إقرار وتعهد</u>
                    </div>
                    <div>
                      <span>
                        {guarantors.length
                          ? 'نقر نحن الموقعين أدناه بإلتزامنا وتعهدنا'
                          : 'اقر انا الموقع ادناه بالتزامي واتعهد'}{' '}
                      </span>
                      بسداد وتسليم قيمة الاقساط المستحقه في مواعيدها المحدده
                      بموجب عقد القرض المؤرخ في
                      {timeToArabicDate(props.data.creationDate, false)} وحتي
                      تمام سدادها بالكامل، وأن يكون السداد عن طريق العميل او من
                      ينوب عنه الي شركة تساهيل للتمويل متناهي الصغر ذاتها وبمقر
                      خزينة فرع الشركة المتعامل معه أو عبر وسائل الدفع
                      الالكتروني المعتمده من هيئة الرقابة المالية ولا يحق{' '}
                      <span>{guarantors.length ? 'لنا' : 'لي'}</span>
                      بأى حال من الاحوال سداد قيمة أي قسط من الاقساط الي شخص اخر
                      غير خزينة فرع الشركة طبقا لما سبق ذكره، وأيا كان هذا الصدد
                      وتكون{' '}
                      <span>
                        {guarantors.length ? 'مسئوليتنا' : 'مسئوليتي'}
                      </span>{' '}
                      كاملة ويعتبر السداد المخالف لذلك لم يتم ويحق للشركة الرجوع
                      علي العميل{' '}
                      <span>{guarantors.length ? 'والضامنين' : ''}</span> في أي
                      وقت من الاوقات بقيمة مالم يتم سداده لخزينة فرع الشركة ودون
                      أدني اعتراض{' '}
                      <span>{guarantors.length ? 'مننا' : 'مني'}</span> علي ذلك
                      وهذا اقرار{' '}
                      <span>{guarantors.length ? 'منا' : 'مني'}</span> بذلك ولا
                      يحق لنا الرجوع فيه حاليا او مستقبلا.
                    </div>
                    <div>
                      تحريرا في
                      {timeToArabicDate(props.data.creationDate, false)}
                    </div>

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
                        {guarantors.map((guarantor, index) => {
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
                        <Barcode value={'' + props.data.loanApplicationKey} />
                        <div>{props.data.loanApplicationKey}</div>
                        <div>
                          {timeToArabicDate(props.data.creationDate, false)}
                        </div>
                        <div>{props.data.customer.customerName}</div>

                        <div
                          style={{
                            margin: '2em',
                            borderTop: '2px solid black',
                          }}
                        />
                      </div>
                    </div>

                    <h2 className="textcenter">اقرار تم التوقيع امامي</h2>

                    <div>نقر نحن الموقعون ادناه:</div>
                    <div>
                      الاسم
                      <div
                        style={{ display: 'inline-block', width: '150px' }}
                      />
                      الموظف بشركة تساهيل للتمويل المتناهي الصغر فرع:
                      {branchDetails.name} -{props.data.customer.governorate}
                    </div>
                    <div>بوظيفة</div>
                    <div>
                      الاسم
                      <div
                        style={{ display: 'inline-block', width: '150px' }}
                      />
                      الموظف بشركة تساهيل للتمويل المتناهي الصغر فرع:
                      {branchDetails.name} -{props.data.customer.governorate}
                    </div>
                    <div>بوظيفة</div>
                    <div>
                      بأن توقيع <span>{guarantors.length ? 'كل من' : ''}</span>{' '}
                      العميل{' '}
                      <span>
                        {guarantors.length ? 'والضامن المدرجين' : 'المدرج'}
                      </span>{' '}
                      بالجدول تم امامي وان جميع بيانات ايصالات الامانه والسندات
                      لامر وأذن الخاصه{' '}
                      <span>{guarantors.length ? 'بهم' : 'به'}</span> صحيحة وتحت
                      مسئوليتي وانني قمت بمطابقة{' '}
                      <span>
                        {guarantors.length ? 'أصول بطاقات' : 'أصل بطاقة'}
                      </span>{' '}
                      الرقم القومي{' '}
                      <span>
                        {guarantors.length ? 'لجميع اعضاء المجموعه' : 'للعميل'}
                      </span>{' '}
                      مع <span>{guarantors.length ? 'الصور' : 'الصورة'}</span>{' '}
                      المرفقه بطلب التمويل (وش وضهر) وانني قمت بمطابقتها مع
                      <span>
                        {guarantors.length
                          ? 'الاشخاص الحقيقيين'
                          : 'الشخص الحقيقي'}
                      </span>{' '}
                      والتأكد <span>{guarantors.length ? 'منهم' : 'منه'}</span>{' '}
                      واتحمل مسئولية ذلك.
                    </div>

                    <table className="endorsement_table">
                      <thead>
                        <tr>
                          <th>
                            <b>م</b>
                          </th>
                          <th>
                            <b>اسم العميل / الضامن</b>
                          </th>
                          <th>
                            <b>الكود</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>١</td>
                          <td>{props.data.customer.customerName}</td>
                          <td>{numbersToArabic(props.data.customer.key)}</td>
                        </tr>
                        {guarantors.map((guarantor, index) => {
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
                            <div style={{ marginBottom: 30 }}>
                              القائم بالصرف
                            </div>
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
                  </tbody>
                </div>

                <div className="main">
                  <tbody>
                    <div className="title">إقرار بإلتزام</div>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <div>
                              أقر انا العميل/ {props.data.customer.customerName}
                            </div>
                          </td>
                          <td>
                            <div>
                              <b>الكود</b> &emsp;
                              {numbersToArabic(props.data.customer.key)}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          {guarantors.map((guarantor, index) => {
                            return (
                              <td key={index}>
                                <div>
                                  ضامن
                                  {getIndexOfGuarantorInAr(index - 2).slice(2)}/
                                  {guarantor.customerName}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                        <tr>
                          <td>
                            <div>
                              نوع النشاط/ {props.data.customer.businessActivity}
                            </div>
                          </td>
                          <td>
                            <div>
                              الفرع/ {branchDetails.name} -
                              {props.data.customer.governorate}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      بأنني قد استلمت تمويل قدره:
                      {`${numbersToArabic(props.data.principal)} جنيه `} من شركة
                      تساهيل للتمويل متناهي الصغر بتاريخ:
                      {timeToArabicDate(props.data.creationDate, false)}
                    </div>
                    <div>
                      وذلك بهدف تطوير وزيادة رأس مال النشاط، وأنني غير متضرر من
                      الظروف الحالية والتي لها تأثير عام علي جميع الأنشطة
                      الأقتصاديه والمشروعات وقد ينتج عن هذه الاحداث ركود في
                      حركات البيع والشراء.
                    </div>
                    <div>
                      لذا وبناء علي رغبتي ارفض عمل اي جدولة للتمويل او تأجيل
                      للاقساط أو الحصول علي فترة سماح لأي اقساط مستحقه طوال فترة
                      التمويل وبأنني ملتزم بسداد الاقساط طبقا لجدول الاقساط
                      المسلم لي من الشركه. <br />
                      <span>وهذا اقرار مني بذلك</span>
                    </div>

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
                          <td style={{ width: '100px' }} />
                        </tr>
                        {guarantors.map((_guarantor, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div>
                                  الضامن {getIndexOfGuarantorInAr(index - 2)}/
                                </div>
                              </td>
                              <td style={{ width: '100px' }} />
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
                      <Barcode value={props.data.loanApplicationKey} />
                      <div>{props.data.loanApplicationKey}</div>
                      <div>
                        {timeToArabicDate(props.data.creationDate, false)}
                      </div>
                      <div>{props.data.customer.customerName}</div>

                      <div
                        style={{ margin: '2em', borderTop: '2px solid black' }}
                      />
                      <Barcode value={props.data.loanApplicationKey} />
                      <div>{props.data.loanApplicationKey}</div>
                      <div>
                        {timeToArabicDate(props.data.creationDate, false)}
                      </div>
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

export default NanoLoanContract

import React from 'react'
import Tafgeet from 'tafgeetjs'

import { ConsumerFinanceContractData } from '../../../../Shared/Models/consumerContract'
import local from '../../../../Shared/Assets/ar.json'

import {
  addYearToTimeStamp,
  calculateAge,
  dayToArabic,
  getNumbersOfGuarantor,
  numbersToArabic,
  orderLocal,
  promissoryNoteGuarantorOrderLocal,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import './styles.scss'

export const MicroCFContract = ({
  sme,
  contractData,
  merchantName = 'امكاي فودز',
  merchantCreationDate = '13/10/2021',
}: {
  sme: boolean
  contractData: ConsumerFinanceContractData
  merchantName?: string
  merchantCreationDate?: string
}) => {
  const noOfGuarantors = contractData.customerGuarantors?.length as number
  const entitledToSignCustomer = contractData.entitledToSignCustomers?.length
    ? contractData.entitledToSignCustomers[0]
    : {}

  const guarantorsOrder = (guarantorsLength: number) => {
    switch (guarantorsLength) {
      case 0:
        return 'الطرف الثاني'
      case 1:
        return 'الطرفان الثاني و الثالت'
      default:
        return ` الاطراف الثاني و ${getNumbersOfGuarantor(
          'and',
          guarantorsLength
        )}`
    }
  }
  const term8Condition = (guarantorsLength: number) => {
    switch (guarantorsLength) {
      case 0:
      case 1:
        return 'الطرف الثالث'
      case 2:
        return 'الطرفان الثالث و الرابع'
      default:
        return `الاطراف ${getNumbersOfGuarantor('and', guarantorsLength)}`
    }
  }
  return (
    <table className="micro-cf-contract" dir="rtl" lang="ar">
      <Header title="" />
      <div>
        <p>عقد تمويل صغير او متوسط ( فردي )</p>
        <p>وفقا لاحكام القانون رقم 141 لسنه 2014</p>
      </div>
      <p>
        انه في يوم &nbsp;
        {dayToArabic(new Date().getDay())}
        &nbsp; &nbsp; الموافق &nbsp;
        {timeToArabicDateNow(false)}
      </p>
      <p>
        <span>
          {' '}
          &nbsp; حرر هذا العقد في فرع {contractData.branchName} &nbsp;
        </span>
      </p>
      <p>بين كلا من :-</p>
      <p>
        اولا : شركه تساهيل للتمويل متناهي الصغر – شركه مساهمه مصريه – مقيد بسجل
        تجاري استثمار القاهره تحت رقم 84209 والكائن مقرها 3 شارع الزهور –
        المهندسين – الجيزه والمقيده تحت رقم 2 بهيئه الرقابه الماليه ويمثلها في
        هذا العقد السيد
        ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
        بصفته مدير الفرع بموجب تفويض صادر له من السيد / منير اكرام نخله رئيس
        مجلس الاداره بتاريخ 10/5/2016 طرف اول – مقرض
      </p>
      <div>
        {sme ? (
          <p>
            <span>
              ثانيا: شركه &nbsp;/ {contractData.customerName || ' '}&nbsp;
            </span>
            <span>
              {' '}
              &nbsp; سجل تجاري : {contractData.commercialRegisterNumber || ' '}
              &nbsp;
            </span>
            <span>
              <span>
                &nbsp; والكائن مقرها الرئيسي :{' '}
                {contractData.businessAddress || ' '}
                &nbsp;
              </span>
              <sub>&quot;يشار إليه فيما بعد بالطرف الثاني&quot;</sub>
            </span>
            <span>
              &nbsp;ويمثلها في التوقيع السيد{' '}
              {entitledToSignCustomer.customerName}
            </span>{' '}
            <br />
            &nbsp;
            <span>
              ويحمل الرقم القومي &nbsp;{entitledToSignCustomer.nationalId}
            </span>
            <span>
              {' '}
              التليفون &nbsp;{entitledToSignCustomer.mobilePhoneNumber}
            </span>
            &nbsp;
            <span>
              السن &nbsp;
              {calculateAge(
                new Date(entitledToSignCustomer.birthDate as number).valueOf()
              )}
              &nbsp;
            </span>
            &nbsp;
            <span>
              المهنة: &nbsp;
              {local[entitledToSignCustomer?.position || '']}
              &nbsp;
            </span>
          </p>
        ) : (
          <p>
            <span>ثانيا: السيد/ &nbsp;{contractData.customerName || ' '}</span>
            <span>
              {' '}
              الكائن في: &nbsp;{contractData.customerHomeAddress || ' '}
            </span>
            <span>
              يحمل بطاقة رقم قومي: &nbsp;
              {numbersToArabic(contractData.nationalId) || ' '}
            </span>
          </p>
        )}
      </div>
      {contractData.customerGuarantors?.map((guarantor, index) => {
        return (
          <div key={index}>
            <p>
              {index === 0 ? 'ثالثا' : 'رابعا'} : السيد/{' '}
              {guarantor.customerName}
              الكائن في: {guarantor.customerHomeAddress}
              {numbersToArabic(guarantor.nationalId)} يحمل بطاقة رقم قومي:
              <sub>
                &quot;يشار إليه فيما بعد بالطرف {orderLocal[index + 2]} (
                {promissoryNoteGuarantorOrderLocal[index]}
                )&quot;
              </sub>
            </p>
          </div>
        )
      })}
      <div title="terms">
        <p className="head-title">تمهيد</p>
        <p>
          لما كانت الشركه الطرف الاول (المقرض ) مرخصا لها بممارسه نشاط تمويل
          المشروعات الصغيره والمتوسطه المقيده لدي الهيئه العامه للرقابه الماليه
          تحت رقم 1 لسنه 2021 وذلك اعمالا لاحكام القانون رقم 141 لسنه 2014 الخاص
          بتمويل المشروعات المتوسطه والصغيره ومتناهيه الصغر وقد تقدم الطرف
          الثاني صاحب نشاط تجاري – تجاره مواد غذائيه بطلب الحصول على تمويل من
          فرع {contractData.branchName}
          وذلك وفقا لاحكام القانون رقم 141 لسنه 2014 المشار اليه طرف ثاني مقترض
          وذلك بضمان وتضامن الطرف الثالث وقد وافقه الطرف الاول علي ذلك وفقا
          للشروط والضوابط الوارده بهذا العقد وبعد ان اقر الاطراف باهليتهم
          القانونيه للتصرف والتعاقد فقد اتفقوا علي بنود العقد التاليه
        </p>
      </div>
      <section className="term-container" title="first-term">
        <p className="head-title"> البند الأول</p>
        <p>
          يعتبر التمهيد المتقدم جزء لا يتجزأ من هذا العقد وكذا ايه مرفقات او
          ملاحق موقعه من الطرفين ان وجدت{' '}
        </p>
      </section>
      <section className="term-container" title="second-term">
        <p className="head-title">البند الثاني</p>
        <p>
          بموجب هذا العقد وافق الطرف الاول علي منح الطرف الثاني تمويلاُ من
          الشركة ( الطرف الاول ) نظير تقديم بضاعه من شركه {merchantName} بناء
          علي طلب الطرف الثاني علي ان يتم تحويل هذا التمويل لشركه {merchantName}{' '}
          نظير تقديم البضاعه المسلمه للطرف الثاني استناداً الي العقد المورخ
          بتاريخ {merchantCreationDate} بين الطرف الاول وشركه {merchantName}{' '}
          وذلك تمويلا للبضاعه المقدمه منها للعميل ( الطرف الثاني ) وفقا للوارد
          تفصيلا بالبند التمهيدي
        </p>
        <p>
          كما يقرر ويقر الطرف الثاني بان مبلغ التمويل موضوع هذا العقد يتم تحويله
          لحساب شركه {merchantName} والتزام الطرف الثاني بضمانه وتضامن الطرف
          الثالث بسداد كامل هذا التمويل
        </p>
        <p>
          ويقر الطرف الثاني بان هذا المبلغ يمثل تمويلاُ له علي ان يلتزم الطرف
          الثاني بسداد هذا التمويل للطرف الاول وفقا لما هو وارد بالبند الثالث من
          هذا العقد{' '}
        </p>
      </section>
      <section className="term-container" title="third-term">
        <p className="head-title">البند الثالث</p>
        <p>
          يلتزم {guarantorsOrder(noOfGuarantors)} ضامنين متضامنين فيما بينهم
          بسداد اجمالي قيمه التمويل البالغ الحد الاقصي لها{' '}
          {contractData.initialConsumerFinanceLimit}{' '}
          {contractData.initialConsumerFinanceLimit
            ? `(${new Tafgeet(
                contractData.initialConsumerFinanceLimit,
                'EGP'
              ).parse()}))`
            : ''}{' '}
          وكافه المصروفات الاخري
        </p>
        <p>
          مدة هذا العقد سنة تبدأ من&nbsp;
          {timeToArabicDateNow(false)}
          وتنتهي في
          {addYearToTimeStamp(new Date().valueOf())}علي ان يتم السداد النقدي
          بمقر فرع الطرف الاول او باحدي وسائل الدفع الالكتروني المعتمده من هيئه
          الرقابه الماليه
        </p>
        <p>
          اتفق الطرفين الاول والثاني بان تكاليف التمويل سوف تتحملها شركه امكاي
          وفودز وفقا للعقد المبرم بينه وبين الطرف الاول ولا يحق لاي منهما
          المنازعة في ذلك إعمالا للمادة ١٦ من القانون رقم ١٤١ لسنة ٢٠١٤ الخاص
          بتمويل المشروعات المتوسطة و الصغيرة و متناهية الصغر.
        </p>
      </section>
      <section className="term-container" title="fourth-term">
        <p className="head-title">البند الرابع</p>
        <p>
          {' '}
          يقر {guarantorsOrder(noOfGuarantors)} متضامنين فيما بينهم بسداد كافه
          المبالغ الوارده بالبند السابق وفقا للمواعيد المذكوره وان هذه المبالغ
          تعد قيمه القرض وكافه مصروفاته{' '}
        </p>
      </section>
      <section className="term-container" title="fifth-term">
        <p className="head-title">البند الخامس</p>
        {sme ? (
          <>
            <p>
              يلتزم {guarantorsOrder(noOfGuarantors)} متضامنين فيما بينهم بسداد
              اقساط القرض وفقا لما هو وارد بالبند الثالث من هذا العقد وفي حاله
              تاخرهم في سداد قيمه اي قسط في تاريخ استحقاقه يلتزموا بسداد غرامه
              تاخير واحد جنيه عن كل الف عن كل يوم تاخير تبدا من اليوم التالي
              لاستحقاق القسط وحتي تمام السداد ولا توجد فتره سماح عن تاريخ
              الاستحقاق وذلك بحد اقصي 90 يوم من تاريخ الاستحقاق المتاخر حتي
              اتخاذ الاجراءات القانونيه ضده مع ملاحظه انه لابد من انذار الطرف
              الاول للطرف الثاني قبل اتخاذ اي اجراء قانوني ضده
            </p>
          </>
        ) : (
          <>
            <p>
              يلتزم الاطراف الثاني والثالث متضامنين فيما بينهم بسداد اقساط القرض
              وفقا لما هو وارد بالبند الثالث من هذا العقد وفي حاله تاخرهم في
              سداد قيمه اي قسط في تاريخ استحقاقه يلتزموا بسداد غرامه تاخير 3%
            </p>
            <p>
              من قيمه القسط في اليوم التالي لتاريخ الاستحقاق وابتداءا من اليوم
              الذي يليه كالتالي :-
            </p>
            <ul>
              <li>
                يتم تحصيل 2 ج عن كل يوم تاخير اذا كان مبلغ التمويل اقل من 10000ج
              </li>
              <li>
                يتم تحصيل 3ج عن كل يوم تاخير اذا كان مبلغ التمويل يتراوح من
                10000ج حتي اقل من 15000ج
              </li>
              <li>
                يتم تحصيل 4ج عن كل يوم تاخير اذا كان مبلغ التمويل يتراوح من
                15000ج حتي اقل من 20000ج
              </li>
              <li>
                يتم تحصيل 5ج عن كل يوم تاخير اذا كان مبلغ التمويل يتراوح من
                20000ج حتي اقل من 50000ج
              </li>
              <li>
                يتم تحصيل 10ج عن كل يوم تاخير اذا كان مبلغ التمويل يتراوح من
                50000ج حتي اقل من 100000ج
              </li>
              <li>
                يتم تحصيل 15ج عن كل يوم تاخير اذا كان مبلغ التمويل يتراوح من
                100000ج حتي اقل من 200000ج
              </li>
            </ul>
          </>
        )}
      </section>
      <section className="term-container" title="sixth-term">
        <p className="head-title">البند السادس</p>
        <p>
          في حاله عدم التزام المقترض او الضامنين بأي من التزاماتهم التعاقديه او
          القانونيه الوارده بهذا العقد وملحقاته ومرفقاته الموقعه ( ان وجدت )
          وبالقوانين الساريه في اي وقت يعد الاطراف الثاني والثالث مخفقين في
          الوفاء بالتزاماتهم التعاقديه والقانونيه ويعتبر هذا العقد مفسوخا من
          تلقاء نفسه دون الحاجه للرجوع الي اعذار او اتخاذ اجراءات قضائيه ويحق
          للطرف الاول فورا مطالبه اي من الطرفين الثاني اوالثالث او جميعهم بباقي
          قيمه القرض وكافه مصروفاته ومن حالات الاخفاق علي سبيل المثال وليس الحصر
          ما يلي :-
        </p>
        <ul>
          <li>
            عدم سداد اي قسط من الاقساط طبقا للشروط والضوابط الوارده بهذا العقد .
          </li>
          <li>
            في حاله استخدام مبلغ القرض في غير الغرض الممنوح من اجله الوارد بهذا
            العقد.
          </li>
          <li>
            {' '}
            في حاله تقديم الطرف الثاني او الثالث بيانات او معلومات مخالفه للواقع
            او غير سليمه للطرف الاول (المقرض).
          </li>
          <li>
            في حاله فقد الطرف الثاني او الثالث اهليته او اشهار افلاسه او اعساره
            او وفاته او وضعه تحت الحراسه او توقيع الحجز علي امواله او وضع امواله
            تحت التحفظ ومنعه من التصرف فيها او انقضائه او اندماجه او وضعه تحت
            التصفيه .
          </li>
          <li>
            اذا تم اتخاذ اجراءات نزع الملكيه او توقيع الحجز الاداري او البيع
            الجبري علي المشروع الممول بالقرض كله او بعضه او اذا تم التصرف في جزء
            او كل من المشروع الممول او اذا تم تأجيره للغير .
          </li>
          <li>
            {' '}
            في حاله عدم قدره الطرف الثاني او الثالث علي سداد الاقساط في مواعيدها
            او توقف اعمال المشروع الممول لاي سبب من الاسباب
          </li>
          <li>
            {' '}
            يلتزم {guarantorsOrder(noOfGuarantors)} بسداد كافه المصروفات
            والمصاريف القضائيه بكافة انواعها .
          </li>
        </ul>
      </section>
      <section className="term-container" title="seventh-term">
        <p className="head-title">البند السابع</p>
        <p>
          يلتزم كل طرف من اطراف هذا العقد بسداد الضريبه المستحقه عليه وفقا
          لاحكام القانون{' '}
        </p>
      </section>
      <section className="term-container" title="eighth-term">
        <p className="head-title">البند الثامن</p>
        <p>
          يقر {term8Condition(noOfGuarantors)} الضامن المتضامن بانه يكفل علي
          سبيل التضامن الطرف الثاني لقيمه هذا القرض من اصل وكافه المصروفات
          المستحقه بموجب هذا العقد وايا من ملحقاته ويحق للمقرض الرجوع عليه بكامل
          قيمه المديونيات المستحقه علي هذا القرض ولايحق للطرف الثاني والثالث
          الدفع بالتجريد او التقسيم او اي دفوع اخري في مواجهه المقرض ويحق للمقرض
          الرجوع عليه وحده او الرجوع وعلي المقترض منفردا او مجتمعين معا بكامل
          قيمه المديونيات المستحقه موضوع العقد.{' '}
        </p>
      </section>
      <section className="term-container" title="ninth-term">
        <p className="head-title">البند التاسع</p>
        <p>
          اطلع العميل علي كافه الشروط الوارده بالعقد وتم شرحها له . وتم تسليمه
          نسخه من بيان شروط التمويل موضحا به كافه الشروط .
        </p>
      </section>
      <section className="term-container" title="tenth-term">
        <p className="head-title">البند العاشر</p>
        <p>
          تسرى احكام القانون رقم 141 لسنه 2014 بشأن التمويل متناهي الصغر ولائحته
          التنفيذيه وتعديلاته ( ان وجد ) علي هذا العقد وتعتبر مكمله له وتختص
          المحاكم الاقتصاديه بالفصل في اي نزاع قد ينشأ بخصوص تفسير او تنفيذ اي
          بند من هذا العقد . كما تطبيق احكام القانون الساريه بجمهوريه مصر
          العربيه في حاله خلو القانون المشار اليه من تنظيم النزاع المطروح علي
          المحكمه .
        </p>
      </section>
      <section className="term-container" title="eleventh-term">
        <p className="head-title"> البند الحادي عشر</p>
        <p>
          اتخذ كل طرف العنوان المبين قرين كل منهما بصدر هذا العقد محلا مختار له
          وفي حاله تغيير ايا منهم لعنوانه يلتزم بأخطار الطرف الاخر بموجب خطاب
          مسجل بعلم الوصول والا اعتبر اعلانه علي العنوان الاول صحيحا ونافذا
          ومنتجا لكافه اثاره القانونيه .
        </p>
        <div className="d-flex justify-content-between">
          <div>
            <p>الطرف الاول</p>
            <p>الاسم/ شركه تساهيل للتمويل متناهي الصغر</p>
            <p> التوقيع/ ..........................</p>
          </div>
          <div>
            <p>الطرف الثاني</p>
            <p>الأسم/ {entitledToSignCustomer.customerName}</p>
            <p> التوقيع/ ..........................</p>
          </div>
        </div>
        <br />
        {noOfGuarantors ? (
          <div className="d-flex  justify-content-between">
            {contractData.customerGuarantors?.map((guarnator, index) => {
              return (
                <div key={index}>
                  <p>الطرف {orderLocal[index + 2]}</p>
                  <p> الأسم/ {guarnator.customerName}</p>
                  <p> التوقيع/ ..........................</p>
                </div>
              )
            })}
          </div>
        ) : (
          ''
        )}
      </section>
    </table>
  )
}

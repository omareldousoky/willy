import React, { useState, useEffect } from 'react'
import Tafgeet from 'tafgeetjs'
import {
  dayToArabic,
  guarantorOrderLocal,
  orderLocal,
  timeToArabicDate,
  addYearToTimeStamp,
  getNumbersOfGuarantor,
} from '../../../../Shared/Services/utils'
import { ConsumerFinanceContractData } from '../../../Models/contract'
import './styles.scss'

interface ConsumerFinanceContractProps {
  contractData: ConsumerFinanceContractData
}
export const ConsumerFinanceContract: React.FC<ConsumerFinanceContractProps> = (
  props
) => {
  const [noOfGuarantors, setNoOfGuarantors] = useState<number>(0)
  useEffect(() => {
    if (props.contractData.customerGuarantors?.length)
      setNoOfGuarantors(props.contractData.customerGuarantors?.length)
  }, [props])
  const term19Condition = (guarantorsLength: number) => {
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
  return (
    <div className="cf-contract-container">
      <div>
        <p className="head-title">عقد تمويل استهلاكي</p>
        <p className="head-title">
          طبقا لأحكام القانون رقم 18 لسنة 2020 بشأن تنظيم نشاط التمويل
          الاستهلاكي
        </p>
      </div>
      <p>
        انه في يوم &nbsp;
        {dayToArabic(
          new Date(props.contractData.customerCreationDate).getDay()
        )}{' '}
        &nbsp; الموافق &nbsp;
        {timeToArabicDate(props.contractData.customerCreationDate, false)}
      </p>
      <p>حرر هذا العقد بين كلا من:</p>
      <div>
        <p>
          أولا: شركة حالا للتمويل الاستهلاكي ش. م. م. – مقيدة بسجل تجاري إستثمار
          القاهرة تحت رقم 250331 والكائن مقرها الرئيسي في الدور الثاني عشر
          بالعقار رقم 2 شارع لبنان – المهندسين – الجيزة ، والمقيدة تحت رقم 23
          بهيئة الرقابة المالية والنشاط المرخص به التمويل الإستهلاكي
          <sub>&quot;يشار إليه فيما بعد بالطرف الأول&quot;</sub>
        </p>
      </div>
      <div>
        <p>
          ثانيا: السيد/ {props.contractData.customerName} الكائن في:{' '}
          {props.contractData.customerHomeAddress}. يحمل بطاقة رقم قومي:{' '}
          {props.contractData.nationalId}
          <sub>&quot;يشار إليه فيما بعد بالطرف الثاني&quot;</sub>
        </p>
      </div>
      <div />
      {props.contractData.customerGuarantors?.map((guarantor, index) => {
        return (
          <div key={index}>
            <p>
              {index === 0 ? 'ثالثا' : 'رابعا'} : السيد/ {guarantor.name}
              الكائن في: {guarantor.address}
              {guarantor.nationalId} يحمل بطاقة رقم قومي:
              <sub>
                &quot;يشار إليه فيما بعد بالطرف {orderLocal[index + 2]} (
                {guarantorOrderLocal[index]}
                )&quot;
              </sub>
            </p>
          </div>
        )
      })}
      <div title="terms">
        <p className="head-title">تمهيد</p>
        <p>
          حيث أن الشركة (الطرف الاول) من الشركات المرخص لها بمزاولة نشاط التمويل
          الاستهلاكي داخل جمهورية مصر العربية والصادر لها ترخيص رقم (23) لسنة
          2021 بتاريخ 31/05/2021 من الهيئة العامة للرقابة المالية. ولما كان
          الطرف الثاني (العميل) يرغب في الاستفادة مما تقدمه الشركة من خدمات
          تمويلية لشراء السلع والخدمات الجائز تمويلها وفقا لأحكام قانون التمويل
          الاستهلاكي رقم 18 لسنة 2020 .
        </p>
      </div>
      <div>
        <p>
          وبعد ايجاب وقبول طرفي التعاقد وبعد ان أقر أطراف التعاقد باهليتهم
          القانونية للتعاقد والتصرف فقد اتفقا على ابرام هذا العقد فيما بينهما
          وفقا للشروط والاحكام و البنود التالية :
        </p>
        <section className="term-container" title="first-term">
          <div className="head-title">
            <p> البند الأول</p>
            <p>تعريفات</p>
          </div>
          <p>يقصد بالعبارات الاتية أينما وردت بالعقد وملحقاته ما يلي:</p>
          <p>الشركة: الطرف الاول للعقد، شركة حالا للتمويل الاستهلاكي.</p>
          <p>
            العميل: الطرف الثاني لهذا العقد، وهو الراغب في الحصول علي التمويل
            لأغراض إستهلاكية وفقا لأحكام قانون التمويل الاستهلاكي
          </p>
          <p>الهيئة: الهيئة العامة للرقابة المالية.</p>
          <p>
            السلع والخدمات: هي كافة السلع والخدمات الواردة بالقانون رقم 18 بشأن
            تنظيم نشاط التمويل الإستهلاكي والصادر بشأنها قرارات من الهيئة لسنة
            2020
          </p>
          <p>
            شبكة مقدمي السلع والخدمات: بائعي السلع والخدمات المتعاقد معهم بتوفير
            السلع والخدمات الجائز تمويلها وفقا لاحكام القانون.
          </p>
          <p>
            القانون: القانون رقم 18 لسنة 2020 ولائحته التنفيذية، وقرارات مجلس
            إدارة الهيئة الصادرة تنفيذا او تفسيرا له.
          </p>
          <p>
            المنصات الالكترونية: الموقع او التطبيق الالكتروني الخاص بالشركة.
          </p>
          <p>
            الوسيط الالكتروني: جهاز الهاتف الذكي النقال/الجوال الخاص بالعميل
            القابل للحفظ والتخزين وتعتبر شريحة الاتصال الخاصة بالعميل وكذا
            البريد الالكتروني او اي منصات الكترونية او مواقع او تطبيق خاص
            بالشركة والمدرج بيانها أعلاه جزء لا يتجزأ من الوسيط الالكتروني.
          </p>
          <p>
            كود التأكيد: الرقم المتغير بحسب كل عملية لتأكيد العميل لطلب تمويله
            شراء السلع/الخدمات والذي يتم ارساله برسالة نصية على الوسيط
            الالكتروني.
          </p>
          <p>
            البيان التكميلي: بيان بالسلع/الخدمات محل التمويل يكون بشكل محرر
            الكتروني يرد إلى الوسيط الالكتروني يوافق ويقر العميل على أحكامه.
          </p>
          <p>
            العملية/المعاملة: كل أمر/إجراء يقوم به العميل لتنفيذ طلب تمويل شراءه
            سلع/خدمات بتمويل من الشركة ضمن الحد الائتماني.
          </p>
        </section>
        <section className="term-container" title="second-term">
          <div className="head-title">
            <p>البند الثاني</p>
            <p>حكم التمهيد والملاحق والمرفقات والمراسلات</p>
          </div>
          <p>
            يعتبر التمهيد السابق جزءا لا يتجزأ من هذا العقد، ومكملا ومتمما لكل
            شروطه، كما تعتبر احكام القانون رقم 18 لسنة 2020 والقرارات الصادرة من
            الهيئة العامة للرقابة المالية تنفيذا او تفسيرا له جزءا ومتمما ومكملا
            لهذا العقد، وتسري احكامها فيما لم يرد بشأنه نص خاص فيه، كما يكون
            للقانون والقرارات الصادرة عن الهيئة اولوية في التطبيق عند التعارض مع
            غيرها من الشروط التعاقدية، وتعد كافة ملاحق هذا العقد، وكذا المخاطبات
            الرسمية بين الطرفين جزءا لا يتجزأ من هذا العقد وشرطا من شروطه
            المكملة والمتممة له.
          </p>
        </section>
        <section className="term-container" title="third-term">
          <p className="head-title">البند الثالث</p>
          <p>موضوع العقد</p>
          <p className="head-title">
            تقوم الشركة بتوفير التمويل اللازم لشراء السلع او الخدمات الاستهلاكية
            والجائز تمويلها وفقا لأحكام قانون التمويل الاستهلاكي والقرارات
            الصادرة عن الهيئة وذلك بناء علي طلب العميل.
          </p>
        </section>
        <section className="term-container" title="fourth-term">
          <div className="head-title">
            <p>البند الرابع</p>
            <p>قيمة التمويل وسعر العائد</p>
          </div>
          <p>
            4/1 الحد الاقصى لمبلغ التمويل :{' '}
            {props.contractData.initialConsumerFinanceLimit} حم (
            {new Tafgeet(
              props.contractData.initialConsumerFinanceLimit,
              'EGP'
            ).parse()}{' '}
            )
          </p>
          <p>4/2 متوسط سعر العائد: 23% (ثابت/سنويا)</p>
          <p>
            4/3 تلتزم الشركة عند قبول كل عملية تمويل موافاة العميل ببيان موضحا
            به قيمة مبلغ التمويل وعدد الاقساط وقيمة كل قسط وموعد استحقاقه، او
            بفروع الشركة بالإيصال الدال علي ذلك.
          </p>
          <p>
            4/4 يلتزم العميل بسداد اقساط التمويل في المواعيد المتفق عليها للشركة
            من خلال بطاقات المدفوعات التجارية او احدي وسائل الدفع التي يقرها
            البنك المركزي.
          </p>
          {noOfGuarantors && (
            <p>
              4/5 يلتزم {noOfGuarantors > 1 ? 'الاطراف' : 'الطرفان'} الثاني و{' '}
              {getNumbersOfGuarantor('and', noOfGuarantors)} بصفتهم ضامنين
              متضامنين فيما بينهم بسداد إجمالي قيمة وأقساط التمويل وكافة
              المصروفات وتكاليف التمويل إلي الطرف الأول علي النحو السالف ذكره،
              او خصما من رصيده بأي محفظة ويعد التوقيع علي هذا العقد تفويض منه
              للشركة بذلك.
            </p>
          )}
        </section>
        <section className="term-container" title="fifth-term">
          <div className="head-title">
            <p>البند الخامس</p>
            <p>مدة العقد</p>
          </div>
          <p>
            5/1 مدة هذا العقد سنة تبدأ من{' '}
            {timeToArabicDate(props.contractData.customerCreationDate, false)}م
            وتنتهي في
            {addYearToTimeStamp(props.contractData.customerCreationDate)}
            م، ويجدد تلقائياً لمدة أو لمدد أخرى متساوية ما لم يخطر أحد الطرفين
            الآخر كتابياً بعدم رغبته في التجديد قبل نهاية مدة العقد أو أي مدة
            أخرى مجددة بشهرين على الأقل. 5/2 في كافة الأحوال لا يتم إنهاء
            التعاقد إلا بعد تسوية المديونية المترتبة علي هذا العقد، وتسليم الطرف
            الثاني مخالصة نهائية بسداد كامل الاقساط.
          </p>
        </section>
        <section className="term-container" title="sixth-term">
          <div className="head-title">
            <p>البند السادس</p>
            <p>محل التمويل وشبكة مقدمي السلع والخدمات</p>
          </div>
          <p>
            6/1 تلتزم الشركة عند قبول كل عملية تمويل موافاة العميل ببيان موضحا
            بيان السلعة / الخدمة محددة تحديدا نافيا للجهالة وسعرها وما سدده
            العميل مقدما من السعر.
          </p>
          <p>
            6/2 تلتزم الشركة باخطار العميل بما يطرأ من تعديل على شبكة مقدمي
            السلع والخدمات طوال فترة سريان هذا العقد.
          </p>
        </section>
        <section className="term-container" title="seventh-term">
          <div className="head-title">
            <p>البند السابع</p>
            <p>تعديل العقد</p>
          </div>
          <p>
            7/1 يحق للشركة في اى وقت ان تخطر العميل برغبتها في تعديل شروط العقد
            او اي ملحق خاص به بموجب كتاب مسجل موصي عليه بعلم الوصول، وفي حالة
            عدم اعتراض العميل خلال (15) يوم من تاريخ الاستلام يعد ذلك قبولا لهذه
            التعديلات.
          </p>
          <p>
            7/2 في حالة اعتراض العميل علي التعديلات يجب ان يتم الاعتراض بالوسائل
            المتفق عليها بين العميل والشركة ، وفي هذه الحالة يتم وقف اية طلبات
            لعمليات تمويل جديدة دون ان يؤثر ذلك على عمليات التمويل القائمة،
            وينتهي العقد بانتهاء اخر عملية تمويل قائمة ، وبعدها يحق للشركة انهاء
            التعاقد وتصفية حساب العميل دون ادني مسئولية على الشركة مع التزام
            العميل بسداد المديونية ان وجدت فورا ويتحمل العميل ايه نفقات مترتبة
            على اقفال الحساب.
          </p>
        </section>
        <section className="term-container" title="eighth-term">
          <p className="head-title">البند الثامن</p>
          <p className="head-title">ضمانات التمويل</p>
          <p>
            8/1 يلتزم الطرف الثاني بالمنع وبعدم التصرف في أي من المنتجات
            والبضائع المسلمة له والممولة موضوع هذا العقد من الطرف الاول بموجب
            هذا الحق محفوظا ملكيتها للطرف الأول لحين تمام سداد كافة مبلغ التمويل
            وسداد كامل الاقساط وكافة المصروفات وفي حالة مخالفة ذلك يحق للطرف
            الأول إتخاذ كافة الإجراءات القانونية اتجاهه، وفي جميع الاحوال يمتنع
            علي الطرف الثاني التصرف فيها الا بعد الحصول على مخالصة نهائية من
            الشركة.
          </p>
          <p>
            8/2 وافق الطرف الثاني على رهن السلع والمنتجات الممولة محل هذا العقد
            والوارد بيانها تفصيلاً بالبند (الثاني) أعلاه رهناً من الدرجة الأولى
            لصالح الطرف الأول وفقاً للقانون رقم 15 لسنة 2015 بإصدار قانون تنظيم
            الضمانات المنقولة ضماناً وتأميناً لسداد المديونية والوفاء بكافة
            التزاماته الواردة بهذا العقد ، ويقر الطرف الثاني بأحقية الشركة الطرف
            الأول في اتخاذ كافة الاجراءات اللازمة لشهر حق الضمان المنشأ / المقرر
            لصالحها على السلع / الخدمات محل التمويل ويوافق على قيام الشركة الطرف
            الاول برهنها وانشاء حق ضمان عليها بشهرها بسجل الضمانات المنقولة
            المنشأ وفقاً لاحكام القانون رقم 15 لسنة 2015 ضمانا للوفاء بقيمة
            التمويل المستحق للشركة الطرف الاول على ان يقوم العميل الطرف الثاني
            بابلاغ الشركة كتابياً حال قيام الغير بالتعدي بأى نوع على السلع /
            الخدمات موضوع عقد التمويل.
          </p>
          <p>
            8/3 يتحمل الطرف الثاني تكلفة الشهر على المنقولات والسلع والمنتجات
            محل التمويل بهذا العقد.
          </p>
          <p>
            8/4 للممول ان يطلب من الطرف الثاني تحرير اى من الضمانات الاتية: (
            سندات إذنيه/ كمبيالات / شيكات ) مستحقة الاداء ( شهريا / ربع سنوي /
            سنوي ) ومقسمة على مدار مدة العقد، ويلتزم الطرف الاول بتسليم الضمانة
            للطرف الثاني فور سداد القسط.
          </p>
        </section>
        <section className="term-container" title="ninth-term">
          <div className="head-title">
            <p>البند التاسع</p>
            <p>السداد المعجل</p>
          </div>
          <p>
            9/1 في حالة طلب الطرف الثاني في أي وقت من الأوقات خلال مدة هذا العقد
            سداد باقي المديونية المستحقة عليه سداداً معجلاً، يحق للشركة الطرف
            الاول إضافة عمولة سداد معجل بما لا يزيد عن 5% تحتسب على باقي أصل
            مبلغ التمويل المستحق والمراد تعجيل الوفاء به، ولا يجوز في جميع
            الاحوال أن يطلب الطرف الثاني تعجيل الوفاء بالمديونية خلال الاربعة
            اشهر الاولي من التمويل وابداء تلك الرغبة كتابة قبل ميعاد السداد
            المستهدف بمدة لا تقل عن ثلاثون يوما.
          </p>
          <p>
            9/2 ولا يعتبر سداداً معجلاً الا في حالة طلبه بسداد كامل المديونية.
          </p>
        </section>
        <section className="term-container" title="tenth-term">
          <div className="head-title">
            <p>البند العاشر</p>
            <p>بيع الديون المستحقة او خصمها</p>
          </div>
          <p>
            10/ 1 من المتفق عليه بين الطرفين ان الشركة ( الطرف الاول ) يحق لها
            توريق محفظة ديونها لدى الغير او خصمها وفقا لاحكام القوانين والقرارات
            الصادرة من مجلس ادارة الهيئة ، وذلك دون معارضة من الطرف الثاني.
          </p>
          <p>
            10/2 كما يحق للشركة (الطرف الاول) ان يحيل كافة حقوقه الناشئة عن هذا
            العقد او جزء منها الي الغير، ويحق له الافصاح للجهة المحال اليها عن
            كافة بيانات الطرف الثاني ويعد توقيع الطرف الثاني وضامنيه علي هذا
            العقد موافقتهم علي قيام الطرف الاول بحوالة تلك الحقوق او جزء منها
            الي الغير وذلك يشمل كافة الجهات وشركات التمويل والبنوك والمؤسسات
            التي تباشر نشاط التوريق والمباشرة للأنشطة المالية غير المصرفية
            وغيرها من كافة الانشطة المتعلقة بسوق المال.
          </p>
        </section>
        <section className="term-container" title="eleventh-term">
          <div className="head-title">
            <p>البند الحادي عشر</p>
            <p>المصروفات الادارية وغرامات التأخير</p>
          </div>

          <p>
            {noOfGuarantors ? (
              <>
                11/1 يلتزم الاطراف الثاني و
                {getNumbersOfGuarantor('and', noOfGuarantors)} ضامنين متضامنين
                فيما بينهم بسداد أقساط التمويل وفقا لما هو وارد بالبند الثالث من
                هذا العقد وفي حالة تأخرهم في سداد قيمة أي قسط في تاريخ إستحقاقه
                يلتزموا بسداد غرامة تأخير كما يلي:
              </>
            ) : (
              <>
                11/1 يلتزم الطرف الثاني بسداد أقساط التمويل وفقا لما هو وارد
                بالبند الثالث من هذا العقد وفي حالة تأخره في سداد قيمة أي قسط في
                تاريخ إستحقاقه يلتزم بسداد غرامة تأخير كما يلي:
              </>
            )}
            <ul>
              <li>
                5% من قيمة القسط المستحق في اليوم التالي لتاريخ الاستحقاق.
              </li>
              <li>
                1% يوميا من قيمة القسط المستحق بداية من اليوم بعد التالي لتاريخ
                الاستحقاق.
              </li>
              <li>
                5% من قيمة القسط المستحق بنهاية كل شهر من تاريخ استحقاق القسط
              </li>
            </ul>
          </p>
          {noOfGuarantors ? (
            noOfGuarantors === 2 ? (
              <>
                <p>
                  11/2 يقر الاطراف الثاني والثالث والرابع ضامنين متضامنين فيما
                  بينهم بسداد كافة المبالغ موضوع هذا العقد والموضحة ببنوده وفقا
                  للمواعيد المذكورة به وأن هذه المبالغ تعد قيمة التمويل وكافة
                  مصروفاته وتكاليف تمويله، ويضاف إليها اي مصاريف أو غرامات تأخير
                  أخري ولا يحق لأي منهما المنازعة أو الاعتراض علي ذلك، وذلك
                  إعمالا لنصوص القانون رقم 18 لسنة 2020 الخاص بالتمويل
                  الإستهلاكي.
                </p>
                <p>
                  11/3 يقر الطرفان الثالث والرابع بصفتهم ضامنين متضامنين فيما
                  بينهم بأنهم يكفلوا علي سبيل التضامن الطرف الثاني لقيمة هذا
                  التمويل من أصل ومصاريف التمويل ويحق للممول (الطرف الأول)
                  الرجوع عليهم بكامل قيمة وعوائد وعمولات وكافة المديونيات
                  المستحقة علي هذا التمويل ولا يحق للاطراف الثالث او الرابع
                  الدفع بالتجريد أو التقسيم أو أي دفوع أخري في مواجهة الممول
                  (الطرف الأول) ويحق للطرف الأول الرجوع عليه وحده وعلي الضامنين
                  المتضامنين (الثالث والرابع) منفردين او مجتمعين معا بكامل قيمة
                  المديونيات المستحقة له.
                </p>
                <p>
                  11/4 ويقر كل من الاطراف الثاني والثالث والرابع بصفتهم ضامنين
                  متضامنين فيما بينهما بقيمة تلك المديونيات المستحقة للطرف
                  الأول، كما يقر الطرفان الثالث والرابع بعدم أحقيتهم في الدفع
                  أمام الطرف الثاني بالمقاصة أو مطالبته بالوفاء بأي التزامات
                  فيما بينهم قبل الوفاء التام بالمديونية المستحقة للطرف الأول.
                </p>
                <p>
                  11/5 يتحمل العميل بضمانة الاطراف الثالث والرابع، كافة
                  المصروفات الادارية البالغة (..... % من قيمة التمويل الاستهلاكي
                  ) ومصاريف الاجراءات القانونية بكل انواعها وفقا لنوع الدعاوي
                  المقامة امام كافة المحاكم ودرجات التقاضي بها.
                </p>
              </>
            ) : (
              <>
                <p>
                  11/2 يقر الطرفان الثاني والثالث ضامنين متضامنين فيما بينهم
                  بسداد كافة المبالغ موضوع هذا العقد والموضحة ببنوده وفقا
                  للمواعيد المذكورة به وأن هذه المبالغ تعد قيمة التمويل وكافة
                  مصروفاته وتكاليف تمويله، ويضاف إليها اي مصاريف أو غرامات تأخير
                  أخري ولا يحق لأي منهما المنازعة أو الاعتراض علي ذلك، وذلك
                  إعمالا لنصوص القانون رقم 18 لسنة 2020 الخاص بالتمويل
                  الإستهلاكي.
                </p>
                <p>
                  11/3 يقر الطرف الثالث بصفته ضامن متضامن بأنه يكفل علي سبيل
                  التضامن الطرف الثاني لقيمة هذا التمويل من أصل ومصاريف التمويل
                  ويحق للممول (الطرف الأول) الرجوع عليه بكامل قيمة وعوائد
                  وعمولات وكافة المديونيات المستحقة علي هذا التمويل ولا يحق
                  للطرف الثالث الدفع بالتجريد أو التقسيم أو أي دفوع أخري في
                  مواجهة الممول (الطرف الأول) ويحق للطرف الأول الرجوع عليه وحده
                  وعلي الضامن المتضامن (الثالث) منفردين او مجتمعين معا بكامل
                  قيمة المديونيات المستحقة له.
                </p>
                <p>
                  11/4 ويقر كل من الطرفان الثاني والثالث بصفتهما ضامنين متضامنين
                  فيما بينهما بقيمة تلك المديونيات المستحقة للطرف الأول، كما يقر
                  الطرف الثالث بعدم أحقيته في الدفع أمام الطرف الثاني بالمقاصة
                  أو مطالبته بالوفاء بأي التزامات فيما بينهم قبل الوفاء التام
                  بالمديونية المستحقة للطرف الأول.
                </p>
                <p>
                  11/5 يتحمل العميل بضمانة الطرف الثالث ، كافة المصروفات
                  الادارية البالغة (..... % من قيمة التمويل الاستهلاكي ) ومصاريف
                  الاجراءات القانونية بكل انواعها وفقا لنوع الدعاوي المقامة امام
                  كافة المحاكم ودرجات التقاضي بها.
                </p>
              </>
            )
          ) : (
            <>
              <p>
                11/2 يقر الطرف الثاني بسداد كافة المبالغ موضوع هذا العقد
                والموضحة ببنوده وفقا للمواعيد المذكورة به وأن هذه المبالغ تعد
                قيمة التمويل وكافة مصروفاته وتكاليف تمويله، ويضاف إليها اي
                مصاريف أو غرامات تأخير أخري ولا يحق له المنازعة أو الاعتراض علي
                ذلك، وذلك إعمالا لنصوص القانون رقم 18 لسنة 2020 الخاص بالتمويل
                الإستهلاكي.
              </p>
              <p>
                11/3 يقر الطرف الثاني بقيمة تلك المديونيات المستحقة للطرف الاول.
              </p>
              <p>
                11/4 يتحمل العميل ، كافة المصروفات الادارية البالغة (..... % من
                قيمة التمويل الاستهلاكي ) ومصاريف الاجراءات القانونية بكل
                انواعها وفقا لنوع الدعاوي المقامة امام كافة المحاكم ودرجات
                التقاضي بها.
              </p>
              <p>
                11/5 يتحمل العميل بضمانة الاطراف الثالث والرابع، كافة المصروفات
                الادارية البالغة (..... % من قيمة التمويل الاستهلاكي ) ومصاريف
                الاجراءات القانونية بكل انواعها وفقا لنوع الدعاوي المقامة امام
                كافة المحاكم ودرجات التقاضي بها.
              </p>
            </>
          )}
        </section>
        <section className="term-container" title="twelfth-term">
          <div className="head-title">
            <p>البند الثاني عشر</p>
            <p>مراحل عملية تمويل شراء السلع/الخدمات</p>
          </div>
          <p>
            أتفق طرفي هذا العقد على أن تتم عملية تقسيط العميل للسلع/الخدمات من
            خلال الوسيط الالكتروني وفقا للخطوات الوارد بيانها بالشروط والاحكام
            الثابتة على التطبيق الالكتروني والتي منها على سبيل المثال لا الحصر
          </p>
          <p>
            12/1 يقوم العميل باستقبال رسالة نصية على الوسيط الالكتروني تحتوي على
            كود تأكيد طلب شراءه السلع/الخدمات بالتقسيط يقوم بإبلاغه للمورد لتمام
            عملية التمويل وتحتوي تلك الرسالة أيضا على رابط الكتروني يتضمن – طبقا
            للشروط والاحكام الخاصة الثابتة على الموقع الالكتروني للشركة – بيانا
            تفصيليا بكافة الشروط والاحكام العامة والخاصة بتمويل شراء
            السلع/الخدمات وكذا أحكام إنشاء حق الضمان عليها ويعتبر موافقه وإقرار
            منه على كافة بنوده وأحكامه بمجرد قيامه بإبلاغ المورد بكود التأكيد.
          </p>
          <p>
            12/2 يتم تسجيل العملية وإرسال بيان تكميلي ضمن رابط الكتروني يرسل إلى
            العميل في صورة رسالة نصية على الوسيط الكتروني كمحرر إلكتروني بإتمام
            إنشاء حق الضمان على السلع/الخدمات بكونه عقد ضمان قد وافق وأقر على
            كافة بنوده وأحكامه ويتضمن أيضا البيانات الاساسية والتكميلية
            للسلع/الخدمات بما في ذلك الثمن وقيمة كل الاقساط ومدة التقسيط ونسبة
            العائد وذلك على ضوء اختيار العميل لمدة التقسيط المتاحة والتي قد
            تتغير من معاملة إلى أخرى وفقا لنظم السداد المعلنة من الشركة من وقت
            إلى آخر.
          </p>
          <p>
            12/3 للشركة الحق في تعليق/ايقاف تنفيذ العميل لاي عملية عن كل أو بعض
            المنتجات دون اخطاره أو إبداء أسباب.
          </p>
        </section>
        <section className="term-container" title="thirteenth-term">
          <div className="head-title">
            <p>البند الثالث عشر</p>
            <p>الاحكام والشروط والالتزامات للتمويل</p>
          </div>
          <p>
            يحق للعميل تنفيذ أي من العمليات التمويلية لشراء أيا من المنتجات التي
            يرغب في الحصول عليها من المورد أو عبر المنصات الالكترونية المتاحة
            وفقا للحد الائتماني الصادر لصالحه من الشركة وطبقا للشروط والاحكام
            الخاصة بكل منتج والمعلنة من الاخيرة وقت تنفيذه للعملية.
          </p>
        </section>
        <section className="term-container" title="fourteenth-term">
          <div className="head-title">
            <p>البند الرابع عشر</p>
            <p>فسخ العقد</p>
          </div>
          <p>
            {noOfGuarantors ? (
              <>
                في حالة عدم إلتزام الطرف الثاني أو{' '}
                {noOfGuarantors > 1 ? 'الضامنين' : 'الضامن المتضامن'} بأي من
                إلتزاماتهم التعاقدية أو القانونية الواردة بهذا العقد وملحقاته
                ومرفقاته الموقعة (إن وجدت) وبالقوانين السارية في أي وقت من
                الأوقات يعد الأطراف الثاني و
                {getNumbersOfGuarantor('and', noOfGuarantors)} مخفقين في الوفاء
                بإلتزاماتهم التعاقدية أو القانونية ويعتبر هذا العقد مفسوخا من
                تلقاء نفسه دون حاجة إلي اعذار أو اتخاذ إجراءات قضائية ويحق للطرف
                الأول فورا مطالبة أي من الاطراف الثاني و
                {getNumbersOfGuarantor('and', noOfGuarantors)} مجتمعين معا او
                منفردين بباقي قيمة التمويل وكافة مصروفاته وتكاليف تمويله ومن
                حالات الإخفاق علي سبيل المثال وليس الحصرعلي ما يلي:
              </>
            ) : (
              <>
                فسخ العقد في حالة عدم إلتزام الطرف الثاني بأي من إلتزاماته
                التعاقدية أو القانونية الواردة بهذا العقد وملحقاته ومرفقاته
                الموقعة (إن وجدت) وبالقوانين السارية في أي وقت من الأوقات يعد
                الطرف الثاني مخفق في الوفاء بإلتزاماته التعاقدية أو القانونية
                ويعتبر هذا العقد مفسوخا من تلقاء نفسه دون حاجة إلي اعذار أو
                اتخاذ إجراءات قضائية ويحق للطرف الأول فورا مطالبة الطرف الثاني
                بباقي قيمة التمويل وكافة مصروفاته وتكاليف تمويله ومن حالات
                الإخفاق علي سبيل المثال وليس الحصرعلي ما يلي:
              </>
            )}{' '}
          </p>
          <p>
            14/1 عدم سداد أي قسط من الأقساط طبقا للشروط والضوابط الواردة بهذا
            العقد.
          </p>
          <p>
            14/2 في حالة تقديم أي من الاطراف الثاني أو{' '}
            {getNumbersOfGuarantor('or', noOfGuarantors)} بيانات أو معلومات
            مخالفة للواقع أو غير سليمة للطرف الأول.
          </p>
          <p>
            {noOfGuarantors > 1 ? (
              <>
                14/3 في حالة فقد أي من الاطراف الثاني أو{' '}
                {getNumbersOfGuarantor('or', noOfGuarantors)} أهليتهم أو إشهار
                إفلاسهم أو إعسارهم أو وفاتهم أو وضعهم تحت الحراسة أو توقيع الحجز
                علي أموالهم أو وضع أموالهم تحت التحفظ ومنعهم من التصرف فيها أو
                إنقضائها أو إدماجها أو وضعها تحت التصفية.
              </>
            ) : (
              <>
                14/3 في حالة فقد أي من الاطراف الثاني أو الثالث أهليتهما أو
                إشهار إفلاسهما أو إعسارهما أو وفاتهما أو وضعهما تحت الحراسة أو
                توقيع الحجز علي أموالهما أو وضع أموالهما تحت التحفظ ومنعهما من
                التصرف فيها أو إنقضائها أو إدماجها أو وضعها تحت التصفية.
              </>
            )}
          </p>
          <p>
            14/4 إذا تم التصرف في المنتج الممول موضوع العقد قبل الوفاء بكامل
            قيمة التمويل.
          </p>
          <p>
            {noOfGuarantors > 1 ? (
              <>
                14/5 في حالة إخلال الأطراف الثاني أو{' '}
                {getNumbersOfGuarantor('or', noOfGuarantors)} بأي من التزاماتهم
                الأخرى الواردة بهذا العقد.
              </>
            ) : (
              <>
                14/5 في حالة إخلال الطرفان الثاني أو الثالث بأي من التزاماتهم
                الأخرى الواردة بهذا العقد.
              </>
            )}
          </p>
        </section>
        <section className="term-container" title="fifteenth-term">
          <div className="head-title">
            <p>البند الخامس عشر</p>
            <p>التزامات العميل</p>
          </div>
          <p>
            15/1 إبلاغ الشركة فور ضياع أو سرقة الوسيط الالكتروني على الخط الساخن
            ويكون ملتزما بسداد أي معاملة تتم من خلال الوسيط الالكتروني خلال فترة
            فقدانه وحتى ابلاغ الشركة.
          </p>
          <p>
            15/2 ويقر ويلتزم باستخدامه الشخصي للوسيط الالكتروني وعدم السماح
            للغير باستخدامه أو التحويل/التنازل عن حقه فيه للغير ويتحمل كافة
            النتائج المترتبة على السماح للغير باستخدام الوسيط الالكتروني وفي
            جميع الاحوال وعند المخالفة فإنه يكون ملتزما بالنتائج المترتبة على أي
            معاملة تم/يتم تنفيذها ولو عن طريق غيره ويكون ملتزما بسداد قيمة ما
            تم/يتم إجراءه من عمليات وفقا للعقد والمعاملة ً التي تم/يتم تنفيذها
            فيما بعد ويكون مسئولا جنائيا ومدنيا واعتباره ملتزما بأداء جميع
            الاقساط الناشئة عن تلك العمليات مع عدم الاخلال بحق الشركة في
            المطالبة بتوقيع العقوبات المقررة قانونا ولحين سداد إجمالي أقساط
            التمويل.{' '}
          </p>
          <p>
            15/3 يلتزم العميل بإبلاغ المورد بالبيانات التكميلية للسلع/الخدمات
            والتي تشمل قيمة الدفعة المقدمة وطريقة سدادها وفترة التمويل وعدد
            الاقساط والاطلاع على البيانات التفصيلية للسلع/الخدمات محل التمويل
            لدى المورد وفقا لاحكام القانون
          </p>
          <p>
            15/4 يقر العميل بأن رقم المحمول الذي يرغب في التعامل عليه هو
            {props.contractData.mobilePhoneNumber}
            على أن يقوم بابلاغ الشركة كتابة حال تغييره دون أدنى مسئولية على
            الشركة مع التزامه الكامل بكافة المعاملات التي تمت من خلال هذا الرقم.
          </p>
          <p>
            15/5 يلتزم العميل بكل ما جاء بالشروط والاحكام الخاصة باتفاقية تمويل
            شراء سلع/خدمات بالرسالة النصية على رقم الهاتف سالف الذكر او اي منصات
            الكترونية خاصة بالشركة وفقا للوارد تفصيلا بالبند الثاني عشر.
          </p>
        </section>
        <section className="term-container" title="seventeenth-term">
          <div className="head-title">
            <p>البند السادس عشر</p>
            <p>الرسوم و الضرائب</p>
          </div>
          <p>
            يلتزم كل من الاطراف بدفع الضرائب والرسوم المستحقة بكافة أنواعها كل
            طرف فيما يخصه وفقاً للقوانين المنظمة لذلك.
          </p>
        </section>
        <section className="term-container" title="sixteenth-term">
          <div className="head-title">
            <p>البند السابع عشر</p>
            <p>ضمان ضد عيوب الصناعة</p>
          </div>
          <p>
            تنتفي مسئولية الطرف الاول عن السلع / الخدمات محل التمويل إذ ان
            العميل قد قام بإختيارها من المورد بذاتها وإقراره بعلمه التام
            بمواصفاتها وحالتها / ومعاينته لها المعاينة التامة النافية للجهالة
            وموافقته علي إشتراطات المورد دون ادني مسئولية علي الشركة الطرف الاول
            عن اي عيب قد يظهر بها من حيث تصميمها / إنشائها / تصنيعها / حالتها أو
            اي عيوب ظاهرة / خفية او تلفيات قد تتصل بها وبما لا يجوز معه للعميل
            الدفع بالجهل بالعيب الظاهر / الخفي او الغلط في إختيارها ولا يجوز
            للعميل التوقف او الامتناع عن اداءه للإلتزامات المالية المستحقة عليه
            لأي سبب كان ويكون إستلامه لها علي مسئوليته وبمعرفة المورد و دون ادني
            مسئولية للشركة الطرف الاول إذ يقتصر دورها علي التمويل فقط.
          </p>
        </section>
        <section className="term-container" title="eighteenth-term">
          <div className="head-title">
            <p>البند الثامن عشر</p>
            <p>الإجراءات التحفظية</p>
          </div>
          {noOfGuarantors ? (
            <p>
              {noOfGuarantors > 1 ? (
                <>
                  يتعهد الاطراف الثاني و
                  {getNumbersOfGuarantor('and', noOfGuarantors)} بصفتهم ضامنين
                  متضامنين فيما بينهم بأن يمنعوا الغير من إتخاذ أي إجراءات
                  تحفظية أو تنفيذية علي المنتجات أو البضائع او السلع أو الخدمات
                  موضوع هذا العقد او ملحقاته المبيعة من الطرف الأول وعلي الطرف
                  الثاني إخطار الطرف الأول بأي إجراء من هذا القبيل أو أي إجراءات
                  تمس كافة الوارد سابقا ويحق للطرف الأول فسخ العقد فورا ويجب علي
                  الطرف الثاني إتخاذ كافة الإجراءات بكافة السبل للإعتراض علي تلك
                  الإجراءات وإخطار الغير بأنها ممولة من الطرف الاول.
                </>
              ) : (
                <>
                  يتعهد الطرفان الثاني والثالث بصفتهما ضامنين متضامنين فيما
                  بينهما بأن يمنعوا الغير من إتخاذ أي إجراءات تحفظية أو تنفيذية
                  علي المنتجات أو البضائع او السلع أو الخدمات موضوع هذا العقد او
                  ملحقاته المبيعة من الطرف الأول وعلي الطرف الثاني إخطار الطرف
                  الأول بأي إجراء من هذا القبيل أو أي إجراءات تمس كافة الوارد
                  سابقا ويحق للطرف الأول فسخ العقد فورا ويجب علي الطرف الثاني
                  إتخاذ كافة الإجراءات بكافة السبل للإعتراض علي تلك الإجراءات
                  وإخطار الغير بأنها ممولة من الطرف الاول.
                </>
              )}
            </p>
          ) : (
            <p>
              يتعهد الطرف الثاني بأن يمنع الغير من إتخاذ أي إجراءات تحفظية أو
              تنفيذية علي المنتجات أو البضائع او السلع أو الخدمات موضوع هذا
              العقد او ملحقاته المبيعة من الطرف الأول وعلي الطرف الثاني إخطار
              الطرف الأول بأي إجراء من هذا القبيل أو أي إجراءات تمس كافة الوارد
              سابقا ويحق للطرف الأول فسخ العقد فورا ويجب علي الطرف الثاني إتخاذ
              كافة الإجراءات بكافة السبل للإعتراض علي تلك الإجراءات وإخطار الغير
              بأنها ممولة من الطرف الاول.
            </p>
          )}
        </section>
        <section className="term-container" title="nineteenth-term">
          <div className="head-title">
            <p>البند التاسع عشر</p>
            <p> الإستعلام الإئتماني</p>
          </div>
          <p>
            يفوض ويأذن ويوافق {term19Condition(noOfGuarantors)} بأحقية الشركة
            الطرف الاول بإجراء الإستعلام الإئتماني عنهم من كافة الجهات الحكومية
            والغير الحكومية وكافة شركات التصنيف الإئتماني والبنوك والبنك المركزي
            المصري كما يقبل إتاحة بيانات هذا العقد وملاحقه وما قد يطرأ عليه من
            تعديلات وغير ذلك من بيانات/ معلومات اخري للجهات سالفة الذكر ولأي جهة
            اخري وللهيئة العامة للرقابة المالية سواء حالا او مستقبلا ويعتبر
            التوقيع علي هذا تصريحا وتفويضا منهم بذلك.
          </p>
        </section>
        <section className="term-container" title="twentieth-term">
          <div className="head-title">
            <p>البند العشرون</p>
            <p>السرية</p>
          </div>
          <p>
            20/1 تلتزم الشركة باحترام السرية لكامل تعاملات العميل ، ولايسري هذا
            الالتزام بالسرية على المعلومات التي قد تكون متاحة للغير بصفة عامة او
            بفعل العميل او مطلوب نشرها او الافصاح عنها بمقتضي القانون او امر
            قضائي او امر حكومي .
          </p>
          <p>
            20/2 يلتزم العميل بالافصاح للشركة عن بيانات دخله وايه ضمانات قد تكون
            لابرام عقد التمويل.
          </p>
          <p>
            20/3 من المتفق عليه بين الطرفين ان الشركة تتمتع بصلاحيات الافصاح عن
            بيانات التمويل وحجمه ومدته الى الهيئة وشركات الاستعلام الائتماني ولا
            يعد ذلك اخلالا باحترام بمبدأ السرية الخاص بالعميل .
          </p>
        </section>
        <section className="term-container" title="twenty-second-term">
          <div className="head-title">
            <p>البند الواحد والعشرون</p>
            <p>المراسلات والانذارات والاعلانات</p>
          </div>
          <p>
            21/1 العناوين الواردة قرين مسمي كل طرف في صدر هذا العقد موطنا يصح
            قانونا مخاطبته عليه ومن ثم كافة الاعلانات القضائية والمراسلات
            والانذارات والاخطارات التي تتم عليها وفقا لهذا العقد صحيحة ومنتجة
            لاثارها القانونية ويلتزم كل من طرفي العقد في حالة حدوث اي تغيير
            عليها باخطار الطرف الاخر كتابة.
          </p>
          <p>
            21/2 ومن المعلوم ان ارقام التليفون والفاكس وعنواين البريد الالكتروني
            والوارد النص عليها في نموذج بيانات العميل المرفق بهذا العقد موثقة
            لدى الشركة ومن ثم يحق للشركة ان ترسل عليها كافة الرسائل الترويجية
            واشعارات التنفيذ والاخطارات التي تتم وفقا لهذا العقد ويلتزم العميل
            في حالة حدوث اى تغيير عليه باخطار الشركة كتابة.
          </p>
        </section>
        <section className="term-container" title="twenty-first-term">
          <div className="head-title">
            <p>البند الثاني والعشرون</p>
            <p>القانون الواجب التطبيق وتسوية المنازعات</p>
          </div>
          <p>
            22/1 تسري على هذا العقد احكام القوانين المعمول بها في جمهورية مصر
            العربية والقرارات المنفذة لهذه القوانين لاسيما قانون رقم (18) لسنة
            2020 باصدار قانون تنظيم نشاط التمويل الاستهلاكي، وكذلك القرارات،
            والكتب الدورية، والتعليمات الصادرة عن الهيئة العامة للرقابة المالية
            .
          </p>
          <p>
            22/2 تختص محكمة .......... الاقتصادية ( حسب الاختصاص القيمي والنوعي
            لها ) بالفصل في المنازعات الناشئة عن تنفيذ او تفسير هذا العقد
            وملحقاته.
          </p>
          <p className="head-title">أو/</p>
          <p>
            الاتفاق على تسوية النزاع بطريقة التحكيم على ان يكون في هذه الحالة
            اختصاصا حصريا وينص عليه صراحة بين الاطراف بموجب اتفاق تحكيم مستقل (
            مشارطة تحكيم )، ذلك وفقا للقوانين المعمول بها في جمهورية مصر
            العربية.
          </p>
          <p>
            ويحق للطرف الاول منفردا في كل الاحوال اختيار جهة التقاضي او التحكيم
            دون اعتراض الطرف الثاني مع تحمل الطرف الثاني للمصروفات والاتعاب
            والرسوم القانونية.
          </p>
        </section>
        <section className="term-container" title="twenty-third-term">
          <div className="head-title">
            <p>البند الثالث والعشرون</p>
            <p>نسخ العقد</p>
          </div>
          <p>
            حرر هذا العقد من عدد ( ) نسخة تسلم لكل طرف نسخة للعمل بمقتضاها عند
            اللزوم.
          </p>
          <div className="d-flex justify-content-between">
            <div>
              <p>الطرف الاول</p>
              <p>حالا للتمويل الاستهلاكي </p>
            </div>
            <div>
              <p>الطرف الثاني</p>
              <p> الأسم/ {props.contractData.customerName}</p>
              <p> التوقيع/ .......................</p>
            </div>
          </div>
          {props.contractData.customerGuarantors?.map((guarnator, index) => {
            return (
              <div className="d-flex justify-content-between" key={index}>
                <div>
                  <p>الطرف {orderLocal[index + 2]}</p>
                  <p> الأسم/ {guarnator.name}</p>
                  <p> التوقيع/ .......................</p>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

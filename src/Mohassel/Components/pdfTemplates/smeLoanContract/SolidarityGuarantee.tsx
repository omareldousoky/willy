import React from 'react'
import Tafgeet from 'tafgeetjs'
import {
  numbersToArabic,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'

import { Header } from '../pdfTemplateCommon/header'
import { SolidarityGuaranteeProps } from './types'

export const SolidarityGuarantee = ({
  application,
}: SolidarityGuaranteeProps) => (
  <>
    <div className="contract-container mb-0 pb-0" dir="rtl" lang="ar">
      <Header
        title="كفالة تضامنية "
        showCurrentUser={false}
        showCurrentTime={false}
        sme
      />
      <p>التاريخ : {timeToArabicDate(application.creationDate, false)} </p>
      <p>
        بالاشارة الى التسهيلات الائتمانية الممنوحة من شركة تساهيل للتمويل متناهي
        الصغر الى {application.customer?.customerName} البالغ قيمتها الاجمالية
        {`${numbersToArabic(
          application.installmentsObject?.totalInstallments?.installmentSum
        )} جنيه (${new Tafgeet(
          application.installmentsObject?.totalInstallments?.installmentSum,
          'EGP'
        ).parse()})`}
      </p>
      <p>
        ضماناَ وتأميناً للتسهيلات الائتمانية الممنوحة للمدين والمشار اليه بعاليه
        ، نضمن بالتضامن والتكافل ونقر نحن الموقعين ادناه اقرارا نهائيا غير قابل
        للالغاء او التعديل ونتعهد ونلتزم بما يلى :
      </p>
      <ol>
        <li>
          أقر بأنني قد أطلعت على كافة بنود وشروط عقد التمويل الممنوح من شركة
          تساهيل للتمويل لشركة اسم الشركة وأن توقيعي على الكفالة التضامنية
          بمثابة توقيعي على هذا العقد كطرف ثالث كفيل وضامن متضامن لسداد التمويل
          الممنوح من اسم الشركة من شركة تساهيل للتمويل متناهي الصغر لسادة شركة{' '}
        </li>
        <li>
          - نلتزم اعتباراً من تاريخ هذه الكفالة ، دون قيد او شرط وبشكل لا رجعة
          فيه ، كملتزم رئيسى بأن نسدد لشركة تساهيل للتمويل متناهي الصغر بناءاً
          على اول طلب له وبغض النظر عن اى اعتراض من جانب اى طرف ثالث :-
          <ol>
            <li> اى مبالغ غير مسددة من الالتزامات المضمونة او ملحقاتها</li>
            <li>
              كافة المصاريف والرسوم والنفقات ( بما فى ذلك المصاريف القانونية )
              التى تدفعها شركة تساهيل للتمويل متناهي الصغر لاسترداد او محاولة
              استرداد الالتزامات المضمونة او اى جزء منها على اساس التعويض الكلى
            </li>
          </ol>
        </li>
        <li>
          يكون التزامنا بموجب هذه الكفالة اضافة وليس استبدال لأى من الضمانات
          الاخرى التى تحتفظ بها شركة تساهيل للتمويل متناهي الصغر حالياً او قد
          يحتفظ بها فيما بعد بشأن الالتزامات المضمونة او اى جزء منها
        </li>
        <li>
          ان التزاماتنا بموجب هذه الكفالة لا تسقط ولا تخفض ولا تتأثر بأى من
          الاحوال الاتية :
          <ol>
            <li>
              افلاس او تصفية او حل او اعادة تنظيم السداد للمدين او اى تغيير فى
              موقفنا او ادارتنا او تحكم او ملكيتنا أو المدين
            </li>
            <li>
              اذا اصبحت اى من مسئولياتنا او التزاماتنا أو المدين او اى طرف اخر
              بموجب اى من الضمانات الاخرى المتعلقة بالالتزامات المضمونة او اى
              جزء منها غير قانونية او باطلة او غير قابلة للتنفيذ بأى حال من
              الاحوال.
            </li>
            <li>
              اية مهلة او فترة سماح اخرى منحت او اتفق على منحها من قبل الشركة
              المدين او لنا او اى شخص اخر بشأن اى ضمان اخر.
            </li>
            <li>
              وجود اى اختلاف فى شروط التسهيلات الائتمانية او اى ضمانات اخرى
            </li>
            <li>
              اى اخفاق حالى او لاحق من جانب شركة تساهيل للتمويل متناهي الصغر
              سواء عن قصد او غير قصد فى اتمام الضمانات او تفعيل اتخاذ اجراء بها.
            </li>
            <li>
              اى فعل او حدث او اغفال كان سيؤدى لولا هذه البند الى اسقاط او اضعاف
              او التأثير على التزامنا بموجب هذه الكفالة
            </li>
          </ol>
        </li>
        <li>
          لن تكون شركة تساهيل للتمويل متناهي الصغر ملزمه قبل ممارسة اى من حقوقه
          او سلطاته او معالجته وفقاً لهذه الكفالة بالاتى :
          <ol>
            <li>ارسال مطالبة للمدين لاستيفاء حقوقها .</li>
            <li>
              اتخاذ اى اجراء او الحصول على اى حكم قضائى فى اى محكمة ضد المدين
            </li>
            <li>
              اجراء اى مطالبة او ادعاء وجود حالة افلاس او الحصول على حكم بإفلاس
              او تصفية او حل المدين
            </li>
            <li>
              تنفيذ او محاولة تنفيذ اى من الضمانات الممنوحة للشركة فيما يتعلق
              بالالتزامات المضمونة او اى جزء فيها
            </li>
          </ol>
        </li>
        <li>
          نلتزم بسداد جميع المبالغ بموجب هذه الكفالة بنفس العملة الواجب على
          المدين سداداها دون اقتطاع او خصم ما لم يكن ذلك الاقتطاع او الخصم
          مطلوباً بموجب القوانين والانظمة الواجبة التطبيق ، وفى هذه الحالة يتعين
          على الكفيل المتضامن ان يسدد تلك المبالغ الاضافية حسبما تكون لازمة لكى
          يكون صافى المبالغ التى يتسلمها الشركة وفقاً لهذه الكفالة مساوياً
          للمبالغ المعينة المستحقة للشركة قبل الاقتطاع او الخصم.
        </li>
        <li>
          لشركة تساهيل للتمويل متناهي الصغر فقط الحق فى التنازل عن او حوالة ولا
          يجوز لنا حوالة الكفالة او التنازل عنها بدون الموافقة الكتابية المسبقة
          من شركة تساهيل للتمويل متناهي الصغر.
        </li>
        <li>
          تبقى هذه الكفالة مستمرة ونافذة حتى تمام سداد كافة الالتزامات المضمونة
          وملحقاتها ، كما ان الكفالة لا تتأثر بأى تقصير من جانب المدين او شركة.
          تساهيل للتمويل .
        </li>
        <li>
          يجب ان يكون اى تعديل لهذه الكفالة بموافقة شركة تساهيل للتمويل متناهي
          الصغر ولا يكون نافذا الا فى الحالة بعينها فقط وللغرض المعين الذى اعطى
          من اجله.
        </li>
        <li>
          التزاماتنا فى ظل هذه الكفالة (1) لاتخضع لقانونية عقد التسهيل او صحته
          او اثره الملزم او قابلية تنفيذه ، و (2) لا تتأثر او تخفض بالنظر لأى
          وقائع او ظروف او احوال الأ كانت طبيعيا ، فعلية ام قانونية
        </li>
        <li>
          نقر بتنازلنا عن حقنا فى طلب تجريد المدين اولا قبل مطالبتنا بكامل
          المبلغ المكفول.
        </li>
        <li>
          اذا اصبح اى بند من بنود هذه الكفالة باطلاً او مخالفاً للقانون او غير
          قابل للتنفيذ بأى شكل وبموجب أى قانون، فإن ذلك لن يؤثر على صلاحية
          وقانونية وسريان باقى البنود للتنفيذ.
        </li>
        <li>
          يكون اى طلب من قبل شركة تساهيل للتمويل متناهي الصغر بموجب هذه الكفالة
          خطياً ويرسل الى عنواننا المذكور ادناه ( او الى اى عنوان اخر يتم إخطار
          الشركة به كتابياً من وقت لاخر ) ويعتبر اثره نافذا قانوناً عند ارساله
          على العنوان الموضح بالكفالة.
        </li>
        <li>
          نتعهد بإخطار شركة تساهيل للتمويل متناهي الصغر فور ظهور /حدوث اى مؤشرات
          تفيد تعسر او اخلال المدين بالتزاماته تجاه الشركة
        </li>
        <li>
          نتعهد بالحفاظ على سرية اية معلومات وبيانات خاصة بالمدين او التسهيلات
          او الكفالة وعدم الافصاح عن أى من تلك المعلومات لاى طرف ثالث
        </li>
        <li>
          نصرح لشركة تساهيل للتمويل متناهي الصغر بالكشف والحصول على كل او بعض
          البيانات الخاصة بمعاملاتنا سواء بشركة تساهيل او الشركات او البنوك
          الاخرى فى الحال والاستقبال ، كما نصرح لشركة تساهيل او من يفوضه او من
          ينوب عنه فى الافصاح/ التداول للبيانات الخاصة بنا طرف الشركة للكيانات
          والبنوك والشركات المالكة والتابعة لشركة تساهيل وكافة الجهات الرقابية ،
          ويمتد ذلك التصريح لما يتعلق ببعض الخدمات والعمليات المصرفية والتعامل
          مع مقدميها ( كالخدمات البريدية لكشوف الحسابات ، خدمات الصراف الالى
          والخدمات المصرفية الالكترونية ، والاستعلام ، والتصنيف الائتمانى ،
          الهيئة العامة للاستثمار والمناطق الحرة والمدين ... الخ ) وفى حدود ما
          يتطلب اداء تلك الخدمات لجهات التعامل ، وذلك كله بالاضافة الى الحالات
          المحددة لكشف سرية الحسابات وفقا للقانون المصرى
        </li>
        <li>
          تخضع هذه الكفالة لقوانين جمهورية مصر العربية وتختص المحاكم المصرية بحل
          اى نزاع ينشأ عن هذه الكفالة او فيما يتصل بها ، وبغض النظر عن البند
          اعلاه ، يكون للبنك الحق فى – ولا يجوز منعه من – اتخاذ اى اجراءات فيما
          يتعلق بأى نزاع فى اى اختصاص قضائى آخر.
        </li>
      </ol>
      <p className="font-weight-bolder">الكفيل المتضامن</p>
      {application.guarantors?.map((person, index) => (
        <div key={index}>
          <p>الاسم : {person.customerName ?? ''}</p>
          <p>بطاقة الرقم القومى: {person.nationalId ?? ''}</p>
          <p>الصفة :</p>
          <p>التاريخ: {timeToArabicDate(application.creationDate, false)}</p>
          <p>العنوان : {person.customerHomeAddress ?? ''}</p>
          <p>التوقيع :</p>
        </div>
      ))}
    </div>
  </>
)

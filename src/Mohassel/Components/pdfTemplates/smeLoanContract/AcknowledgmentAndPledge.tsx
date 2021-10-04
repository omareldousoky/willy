import React from 'react'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import { AcknowledgmentAndPledgeProps } from './types'

export const AcknowledgmentAndPledge = ({
  entitledToSign,
  application,
}: AcknowledgmentAndPledgeProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار وتعهد"
          showCurrentUser={false}
          showCurrentTime={false}
          sme
        />
        <p>
          نقر نحن الموقعين أدناه بالتزامنا وتعهدنا بسداد قيمة الاقساط المستحقة
          في مواعيدها المحددة بموجب عقد القرض المؤرخ في &emsp;
          {timeToArabicDate(application.creationDate, false)} &emsp; وحتي تمام
          سدادها بالكامل وأن يكون السداد عن طريق شركة تساهيل للتمويل متناهي
          الصغر أو من تنيبة الي حساب شركة تساهيل للتمويل متناهي الصغر بموجب
          إيداع نقدي أو تحويل بنكي أو عن طريق أي وسيلة دفع الكتروني معتمدة من
          هيئة الرقابة المالية مع موافاة فرع التعامل بصورة من مستند سداد القسط
          ولا يحق لنا بأي حال من الاحوال سداد قيمة أي قسط من الاقساط الي أي شخص
          بشركة تساهيل للتمويل متناهي الصغر وتكون مسئولياتنا كاملة ويعتبر السداد
          المخالف لذلك لم يتم ويحق لشركة تساهيل للتمويل متناهي الصغر الرجوع علي
          الشركة المدينة والضامنين في أي وقت من الاوقات بقيمة ما لم يتم سداده
          لحساب شركة تساهيل للتمويل متناهي الصغر ودون أدني إعتراض منا علي ذلك .
          وهذا إقرار منا بذلك ولا يحق لنا الرجوع فيه حاليا أو مستقبلا .
        </p>
        <p>
          تحريرا في &emsp; {timeToArabicDate(application.creationDate, false)}{' '}
          &emsp;
        </p>
        <p className="text-center">المقرون بما فيه</p>
        {entitledToSign.map((person, index) => (
          <div key={index}>
            <p className="py-2">
              الأسم : {person.customer.customerName ?? ''}{' '}
            </p>
            <p className="py-2"> التوقيع :</p>
          </div>
        ))}
      </div>
    </>
  )
}
AcknowledgmentAndPledge.defaultProps = {
  entitledToSign: [],
}

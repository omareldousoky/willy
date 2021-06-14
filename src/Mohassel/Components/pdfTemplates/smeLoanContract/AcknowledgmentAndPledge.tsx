import React from 'react'
import { Header } from '../pdfTemplateCommon/header'
import { AcknowledgmentAndPledgeProps } from './types'

export const AcknowledgmentAndPledge = ({
  entitledToSign,
}: AcknowledgmentAndPledgeProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار وتعهد"
          showCurrentUser={false}
          showCurrentTime={false}
        />
        <p>
          نقر نحن الموقعين أدناه بالتزامنا وتعهدنا بسداد قيمة الاقساط المستحقة
          في مواعيدها المحددة بموجب عقد القرض المؤرخ في &emsp;/&emsp;/ &emsp;
          &emsp; &emsp; وحتي تمام سدادها بالكامل وأن يكون السداد عن طريق شركة
          تساهيل للتمويل أو من تنيبة الي حساب شركة تساهيل للتمويل بموجب إيداع
          نقدي أو تحويل بنكي أو عن طريق أي وسيلة دفع الكتروني معتمدة من هيئة
          الرقابة المالية مع موافاة فرع التعامل بصورة من مستند سداد القسط ولا
          يحق لنا بأي حال من الاحوال سداد قيمة أي قسط من الاقساط الي أي شخص
          بشركة تساهيل للتمويل وتكون مسئولياتنا كاملة ويعتبر السداد المخالف لذلك
          لم يتم ويحق لشركة تساهيل للتمويل الرجوع علي الشركة المدينة والضامنين
          في أي وقت من الاوقات بقيمة ما لم يتم سداده لحساب شركة تساهيل للتمويل
          ودون أدني إعتراض منا علي ذلك . وهذا إقرار منا بذلك ولا يحق لنا الرجوع
          فيه حاليا أو مستقبلا .
        </p>
        <p>تحربرا في &emsp;/&emsp;/ &emsp; &emsp; &emsp; </p>
        <p className="text-center">المقرون بما فيه</p>
        {entitledToSign.map((person, index) => (
          <div key={index} className="d-flex justify-content-between">
            <span>الأسم / {person.customerName ?? ''} </span>
            <span> التوقيع :</span>
          </div>
        ))}
      </div>
    </>
  )
}
AcknowledgmentAndPledge.defaultProps = {
  entitledToSign: [],
}

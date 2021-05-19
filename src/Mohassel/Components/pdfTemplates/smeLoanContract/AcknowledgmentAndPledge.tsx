import React from "react";
import { Header } from "../pdfTemplateCommon/header";

export const AcknowledgmentAndPledge = ({ entitledToSign }) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="إقرار وتعهد"
          showCurrentUser={false}
          showCurrentTime={false}
        />
        <p>
          نقر نحن الموقعبن أدناه بالتزامنا وتعهدنا بسداد قيمة الاقساط المستحقة
          في مواعيدها المحددة بموجب عقد القرض المؤرخ في &emsp;/&emsp;/ &emsp;
          &emsp; &emsp; وحتي تمام سدادها بالكامل وأن يكون السداد عن طريق الشركة
          أو من تنيبة الي حساب شركة تساهيل للتمويل بموجب إيداع نقدي أو تحويل
          بنكي أو عن طريق أي وسيلة دفع الكتروني معتمدة من هيئة الرقابة المالية
          مع موافاة فرع التعامل بصورة من مستند سداد القسط ولا يحق لنا بأي حال من
          الاحوال سداد قيمة أي قسط من الاقساط الي أي شخص بالشركة وتكون
          مسئولياتنا كاملة ويعتبر السداد المخالف لذلك لم يتم ويحق للشركة الرجوع
          علي الشركة المدينة والضامنين في أي وقت من الاوقات بقيمة ما لم يتم
          سداده لحساب الشركة ودون أدني إعتراض منا علي ذلك . وهذا إقرار منا بذلك
          ولا يحق لنا الرجوع فيه حاليا أو مستقبلا .
        </p>
        <p>تحربرا في &emsp;/&emsp;/ &emsp; &emsp; &emsp; </p>
        <p className="text-center">المقرون بما فيه</p>
        {entitledToSign.map((entitledToSign, index) => (
          <div key={index} className="d-flex justify-content-between">
            <span>الأسم / {entitledToSign.customerName ?? ''} </span>
            <span> التوقيع :</span>
          </div>
        ))}
      </div>
    </>
  );
};
AcknowledgmentAndPledge.defaultProps = {
  entitledToSign: [],
};

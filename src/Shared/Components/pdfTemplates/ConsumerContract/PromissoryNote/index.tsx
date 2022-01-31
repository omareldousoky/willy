import React from 'react'
import Tafgeet from 'tafgeetjs'
import { PromissoryNoteProps } from '../../../../Models/consumerContract'
import {
  timeToArabicDate,
  numbersToArabic,
  promissoryNoteGuarantorOrderLocal,
} from '../../../../Services/utils'
import { Header } from '../../pdfTemplateCommon/header'

import './styles.scss'

export const PromissoryNote = ({
  customerCreationDate,
  customerName,
  customerHomeAddress,
  initialConsumerFinanceLimit,
  customerGuarantors,
  nationalId,
  isCF,
  CFUserContract,
}: PromissoryNoteProps) => (
  <div
    className={`promissory-note ${CFUserContract && 'reposition'}`}
    dir="rtl"
    lang="ar"
  >
    <table>
      <Header
        title=""
        showCurrentUser={false}
        showCurrentTime={false}
        cf={isCF}
      />
      <div>
        <p className="head-title">سند لأمر</p>
      </div>
      <p>
        تاريخ الاصدار : &nbsp;
        {timeToArabicDate(customerCreationDate, false)}
      </p>
      <p>مكان الاصدار:</p>
      <p>تاريخ الاستحقاق : &nbsp; / &nbsp; / &nbsp; &nbsp;</p>
      <p>
        المبلغ :&nbsp;
        {numbersToArabic(initialConsumerFinanceLimit)} جنيها
      </p>
      <p>
        {customerGuarantors && customerGuarantors.length > 0
          ? 'نتعهد نحن الموقعين'
          : 'اتعهد انا الموقع'}
        &nbsp; ادناه تعهداً نهائيا وبدون اى قيد او شرط بأن ندفع فى تاريخ
        الاستحقاق لأمر واذن شركة حالا للتمويل الاستهلاكي مبلغ وقدره &nbsp;
        {numbersToArabic(initialConsumerFinanceLimit)}
        &nbsp;جنيه ({new Tafgeet(initialConsumerFinanceLimit, 'EGP').parse()})
        &nbsp; والقيمة وصلتنا نقداً على ان يتم الوفاء بمبلغ السند بمقر الشركة
        الكائن في الدور الثاني عشر بالعقار رقم 2 – شارع لبنان – المهندسين –
        الجيزة.
      </p>
      <p>
        ويستحق علينا عوائد من تاريخ تحرير السند وحتى تاريخ السداد بواقع .... %
        سنوياً ، كما يستحق علينا عوائد تأخير بواقع ......... % من تاريخ
        الاستحقاق حتى تمام السداد وذلك بدون حاجة الى تنبيه او انذار.
      </p>
      <p>
        ويحق لحامل هذا السند الرجوع علينا بدون مصروفات او اخطار او عمل احتجاج
        لعدم الوفاء، ونفوض الشركة فى ملء أية بيانات او مبالغ طالما ان السند موقع
        منا ونلتزم بما ورد فى السند ولا يجوز لنا الاعتراض.
      </p>
      <p>
        ولا تبرأ ذمتنا من هذا المبلغ الا باستلامنا هذا السند مؤشرا عليه من شركة
        حالا للتمويل الاستهلاكي بتمام السداد.
      </p>
      <p>
        يخضع هذا السند لاحكام القانون المصري ويكون اي نزاع ينشأ عنه او يتصل به
        الفصل فيه والتقاضي يكون من اختصاص وامام محاكم ( الجيزة ) على اختلاف
        درجاتها وانواعها.
      </p>
      <p>
        <u>المدين</u>
      </p>
      <p>الاسم : {customerName}</p>
      <p>بطاقة الرقم القومى : {numbersToArabic(nationalId)}</p>
      <p>العنوان: {customerHomeAddress}</p>
      <p>التوقيع :</p>
      {customerGuarantors && customerGuarantors.length > 0 && (
        <div className="d-flex justify-content-between flex-wrap">
          {customerGuarantors.map((guarantor, i) => (
            <div className="mt-5">
              <p>
                <u>
                  {
                    promissoryNoteGuarantorOrderLocal[
                      (i && i > 10) || customerGuarantors.length === 1
                        ? 'default'
                        : i
                    ]
                  }
                </u>
              </p>
              <p>الاسم : {guarantor.customerName}</p>
              <p>
                بطاقة الرقم القومى : {numbersToArabic(guarantor.nationalId)}
              </p>
              <p>العنوان: {guarantor.customerHomeAddress}</p>
              <p>التوقيع :</p>
            </div>
          ))}
        </div>
      )}
    </table>
  </div>
)

import React from 'react'
import Tafgeet from 'tafgeetjs'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import {
  numbersToArabic,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'

import { PromissoryNoteProps } from './types'

export const PromissoryNote = ({
  noteKind,
  application,
  branchDetails,
  person,
  personPosition,
}: PromissoryNoteProps) => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <Header
        title="سند لأمر"
        showCurrentUser={false}
        showCurrentTime={false}
        sme
      />
      <p>
        تاريخ الاصدار : {timeToArabicDate(application.creationDate, false)}{' '}
      </p>
      <p>مكان الاصدار: {branchDetails?.address}</p>
      <p>تاريخ الاستحقاق : &nbsp; / &nbsp; / &nbsp; &nbsp;</p>
      <p>
        المبلغ :{' '}
        {`${numbersToArabic(
          application.installmentsObject?.totalInstallments?.installmentSum
        )} جنيه `}{' '}
      </p>
      <p>
        نتعهد نحن الموقعين ادناه تعهداً نهائيا وبدون اى قيد او شرط بأن ندفع فى
        تاريخ الاستحقاق لأمر واذن شركة تساهيل للتمويل متناهي الصغر مبلغ وقدره
        {`${numbersToArabic(
          application.installmentsObject?.totalInstallments?.installmentSum
        )} جنيه (${new Tafgeet(
          application.installmentsObject?.totalInstallments?.installmentSum,
          'EGP'
        ).parse()})`}
        على ان يتم الوفاء بمبلغ السند بحساب الشركة رقم ................... بنك
        ................. فرع ........................ والقيمة وصلتنا نقداً
        ويستحق علينا عوائد من تاريخ تحرير السند وحتى تاريخ السداد بواقع .... %
        سنوياً ، كما يستحق علينا عوائد تأخير بواقع ......... % علاوة على سعر
        العائد المطبق من تاريخ الاستحقاق حتى تمام السداد وذلك بدون حاجة الى
        تنبيه او انذار.
      </p>
      <p>
        ويحق لحامل هذا السند الرجوع علينا بدون مصروفات او اخطار او عمل احتجاج
        لعدم الوفاء، ونفوض الشركة فى ملء أية بيانات او مبالغ طالما ان السند موقع
        منا ونلتزم بما ورد فى السند ولا يجوز لنا الاعتراض.
      </p>
      <p>
        ولا تبرأ ذمتنا من هذا المبلغ الا باستلامنا أصل هذا السند مؤشرا عليه من
        شركة تساهيل للتمويل متناهي الصغر بتمام السداد
      </p>
      <p>
        يخضع هذا السند لاحكام القانون المصري ويكون اي نزاع ينشأ عنه او يتصل به
        الفصل فيه والتقاضي يكون من اختصاص وامام محاكم ( الجيزة ) على اختلاف
        درجاتها وانواعها.
      </p>
      <section>
        <p>
          {noteKind === 'sme'
            ? ` الشركة: ${application.customer?.customerName} `
            : `الأسم: ${person?.customerName} `}
        </p>
        {noteKind === 'sme' && (
          <p>من له حق التوقيع عن الشركة : {person?.customerName}</p>
        )}
        {personPosition && <p>الصفة : {personPosition}</p>}
        <p>
          {noteKind === 'sme'
            ? ` السجل التجاري: ${application.customer?.commercialRegisterNumber} `
            : `بطاقة الرقم القومى: ${person?.nationalId} `}
        </p>
        <p>
          العنوان:{' '}
          {noteKind === 'sme'
            ? application.customer?.businessAddress
            : person?.customerHomeAddress}
        </p>
        <p>التوقيع :</p>
      </section>
    </div>
  </>
)

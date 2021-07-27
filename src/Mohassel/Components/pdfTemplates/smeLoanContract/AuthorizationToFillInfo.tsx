import React from 'react'

import { Header } from '../pdfTemplateCommon/header'
import { AuthorizationToFillInfoProps } from './types'

export const AuthorizationToFillInfo = ({
  application,
}: AuthorizationToFillInfoProps) => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <Header
        title="تفويض بملء بيانات"
        showCurrentUser={false}
        showCurrentTime={false}
        sme
      />
      <p>
        نقر نحن الموقعين ادناه بأننا نفوض شركة تساهيل للتمويل متناهى الصغر بموجب
        تفويضاً غير مشروط وغير قابل للالغاء فى ملء كافة الفراغات و / أو اضافة
        كافة البيانات بالاوراق و / او المستندات و/ أو العقود الموقعة منى وكافة
        الاوراق المالية والكفالة التضامنية الموقعة منى
      </p>
      <p>
        ونتعهد بموجب هذا بقبول ما تقوم به الشركة بملئه نيابة عنى كدليل قاطع على
        ما جاء به من مديونيات والتزامات دون اى منازعة منا فى صحة تلك البيانات
      </p>
      <p>وهذا تفويض منى بذلك ،،،،</p>
      {application.guarantors?.map((person, index) => (
        <div key={index}>
          <p>الاسم : {person.customerName ?? ''}</p>
          <p>العنوان : {person.customerHomeAddress ?? ''}</p>
          <p>التوقيع :</p>
        </div>
      ))}
    </div>
  </>
)

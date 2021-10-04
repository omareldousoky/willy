import React from 'react'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import { timeToArabicDate } from '../../../../Shared/Services/utils'

import { AuthorizationToFillCheckProps } from './types'

export const AuthorizationToFillCheck = ({
  application,
}: AuthorizationToFillCheckProps) => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <Header
        title="تفويض بملء بيانات الشيكات"
        showCurrentUser={false}
        showCurrentTime={false}
        sme
      />
      <p>التاريخ : {timeToArabicDate(application.creationDate, false)} </p>
      <p>
        نقر نحن الموقعين ادناه بأننا نفوض شركة تساهيل للتمويل متناهى الصغر بموجب
        تفويضاً غير مشروط وغير قابل للالغاء فى ملء اى او كل البيانات الخاصة
        بالشيكات الموقعة منى لأمر شركة تساهيل للتمويل متناهي الصغر والصادرة
        لصالح الشركة لوفاء أية التزامات مستحقة علينا ، ومن المتفق عليه ان الشركة
        سيقوم بملء البيانات وفقا لدفاتره التى نقبلها كدليل قاطع على التزاماتنا
        دون اى منازعة فى الحال والاستقبال.
      </p>
      <p>وهذا تفويض منى بذلك ،،،،</p>
      {application.entitledToSign?.map((person, index) => (
        <div key={index}>
          <p>الاسم : {person.customer.customerName ?? ''}</p>
          <p>العنوان : {person.customer.customerHomeAddress ?? ''}</p>
          <p>التوقيع :</p>
        </div>
      ))}
    </div>
  </>
)

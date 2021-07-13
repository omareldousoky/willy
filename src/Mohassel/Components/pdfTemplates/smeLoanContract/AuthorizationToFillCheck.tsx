import React from 'react'

import { Header } from '../pdfTemplateCommon/header'
import { AuthorizationToFillCheckProps } from './types'

export const AuthorizationToFillCheck = ({
  application,
}: AuthorizationToFillCheckProps) => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <Header
        title="تفويض بملء بيانات  "
        showCurrentUser={false}
        showCurrentTime={false}
        sme
      />
      <p>
        نقر نحن الموقعين ادناه بأننا نفوض شركة تساهيل بموجب تفويضاً غير مشروط
        وغير قابل للالغاء فى ملء اى او كل البيانات الخاصة بالشيكات او ايصالات
        الأمانة او السندات الأذنية الموقعة منى لأمر شركة تساهيل والصادرة لصالح
        الشركة لوفاء أية التزامات مستحقة علينا ، ومن المتفق عليه ان الشركة سيقوم
        بملء البيانات وفقا لدفاتره التى نقبلها كدليل قاطع على التزاماتنا دون اى
        منازعة فى الحال والاستقبال.
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

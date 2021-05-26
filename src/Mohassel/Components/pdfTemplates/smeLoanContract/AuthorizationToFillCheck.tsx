import React from "react";

import { Header } from "../pdfTemplateCommon/header";

export const AuthorizationToFillCheck = () => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <Header
        title="تفويض بملء بيانات الشيك "
        showCurrentUser={false}
        showCurrentTime={false}
      />
      <p>
        نقر نحن الموقعين ادناه بأننا نفوض شركة تساهيل بموجب تفويضاً غير مشروط
        وغير قابل للالغاء فى ملء اى او كل البيانات الخاصة بالشيكات الموقعة منى
        لأمر شركة تساهيل والصادرة لصالح الشركة لوفاء أية التزامات مستحقة علينا ،
        ومن المتفق عليه ان الشركة سيقوم بملء البيانات وفقا لدفاتره التى نقبلها
        كدليل قاطع على التزاماتنا دون اى منازعة فى الحال والاستقبال.
      </p>
      <p>وهذا تفويض منى بذلك ،،،،</p>
      <p>الاسم</p>
      <p>التوقيع</p>
      <p>العنوان</p>
    </div>
  </>
);

import React from 'react'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import { AuthorizationToFillInfoProps } from '../../../Models/contract'
import './styles.scss'

export const AuthorizationToFillInfo = ({
  customerCreationDate,
  customerHomeAddress,
  customerName,
  customerGuarantors,
}: AuthorizationToFillInfoProps) => (
  <>
    <div className="contract-container" dir="rtl" lang="ar">
      <table>
        <Header title="" showCurrentUser={false} showCurrentTime={false} cf />
        <div>
          <p className="head-title">تفويض بملء بيانات</p>
        </div>
        <p>التاريخ : {timeToArabicDate(customerCreationDate, false)} </p>
        <p>
          {customerGuarantors && customerGuarantors.length > 0
            ? 'نقر نحن الموقعين'
            : 'أقر أنا الموقع'}
          &nbsp; ادناه بأننا نفوض شركة حالا للتمويل الاستهلاكي بموجب تفويضاً غير
          مشروط وغير قابل للالغاء فى ملء كافة الفراغات و / أو اضافة كافة
          البيانات بالاوراق و / او المستندات و/ أو العقود والسندات لامر واذن
          والموقعة منا لصالح الشركة.
        </p>
        <p>
          و&nbsp;
          {customerGuarantors && customerGuarantors.length > 0
            ? 'نتعهد'
            : 'اتعهد'}
          &nbsp;بموجب هذا بقبول ما تقوم به الشركة بملئه نيابة&nbsp;
          {customerGuarantors && customerGuarantors.length > 0 ? 'عنا' : 'عنى'}
          &nbsp;كدليل قاطع على ما جاء به من مديونيات والتزامات دون اى منازعة منا
          فى صحة تلك البيانات.
        </p>
        <p>وهذا تفويض منى بذلك ،،،،</p>
        {(!customerGuarantors || customerGuarantors.length !== 2) && (
          <p>
            <u>المدين :</u>
          </p>
        )}
        <p>الاسم : {customerName}</p>
        <p>التوقيع :</p>
        <p>العنوان: {customerHomeAddress}</p>
        {customerGuarantors?.map((person, index) => (
          <div key={index} className="my-4">
            {customerGuarantors && customerGuarantors.length === 1 && (
              <p>
                <u>ضامن متضامن :</u>
              </p>
            )}
            <p>الاسم : {person.customerName ?? ''}</p>
            <p>التوقيع :</p>
            <p>العنوان : {person.customerHomeAddress ?? ''}</p>
          </div>
        ))}
      </table>
    </div>
  </>
)

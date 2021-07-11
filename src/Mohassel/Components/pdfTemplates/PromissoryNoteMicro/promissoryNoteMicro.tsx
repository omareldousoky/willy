import React from 'react'
import Tafgeet from 'tafgeetjs'
import {
  guarantorOrderLocal,
  numbersToArabic,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import { ApplicationResponse } from '../../../Models/Application'
import { BranchDetails } from '../../../Services/APIs/Branch/getBranch'
import { Header } from '../pdfTemplateCommon/header'
import './promissoryNoteMicro.scss'

interface PromissoryNoteProps {
  application: ApplicationResponse
  branchDetails: BranchDetails
  nanoForm?: boolean
}
const template = (customer, application, branchDetails, nanoFlag) => (
  <div className="promissory-note-micro" dir="rtl" lang="ar">
    <Header title="سند لأمر" showCurrentUser={false} showCurrentTime={false} />
    <p>
      تاريخ الاصدار : &nbsp;
      {timeToArabicDate(
        nanoFlag ? new Date().valueOf() : application.creationDate,
        false
      )}
    </p>
    <p>مكان الاصدار: {branchDetails.address}</p>
    <p>
      تاريخ الاستحقاق : &nbsp;
      {timeToArabicDate(
        nanoFlag
          ? new Date(new Date().setFullYear(new Date().getFullYear() + 2))
          : application.installmentsObject?.installments[
              application.installmentsObject.installments.length - 1
            ].dateOfPayment || 0,
        false
      )}
    </p>
    <p>المبلغ : {numbersToArabic(nanoFlag ? 3000 : application.principal)}</p>
    <p>
      نتعهد نحن الموقعين ادناه تعهداً نهائيا وبدون اى قيد او شرط بأن ندفع فى
      تاريخ الاستحقاق لأمر واذن شركة تساهيل للتمويل مبلغ وقدره &nbsp;
      {new Tafgeet(nanoFlag ? 3000 : application.principal, 'EGP').parse()}
      &nbsp; والقيمة وصلتنا نقداً ويستحق علينا عوائد من تاريخ تحرير السند وحتى
      تاريخ السداد بواقع .... % سنوياً ، كما يستحق علينا عوائد تأخير بواقع
      ......... % علاوة على سعر العائد المطبق من تاريخ الاستحقاق حتى تمام السداد
      وذلك بدون حاجة الى تنبيه او انذار.
    </p>
    <p>
      وعلى ان يتم الوفاء بمبلغ السند بمقر الشركة الكانن فى&nbsp;
      {branchDetails.address}
    </p>
    <p>
      ويحق لحامل هذا السند الرجوع علينا بدون مصروفات او اخطار او عمل احتجاج لعدم
      الوفاء، ونفوض الشركة فى ملء أية بيانات او مبالغ طالما ان السند موقع منا
      ونلتزم بما ورد فى السند ولا يجوز لنا الاعتراض.
    </p>
    <p>
      ولا تبرأ ذمتنا من هذا المبلغ الا باستلامنا هذا السند مؤشرا عليه من شركة
      تساهيل للتمويل متناهي الصفر بتمام السداد
    </p>
    <p>
      يخضع هذا السند لاحكام القانون المصري ويكون اي نزاع ينشأ عنه او يتصل به
      الغصل فيه والتقاضي يكون من اختصاصى وامام محاكم ( الجيزة ) على اختلاف
      درجاتها وانواعها.
    </p>
    <p>
      <u>المدين</u>
    </p>
    <p>الاسم : {customer.customerName}</p>
    <p>بطاقة الرقم القومى : {customer.nationalId}</p>
    <p>العنوان: {customer.customerHomeAddress}</p>
    <p>التوقيع :</p>
    {application.product.type === 'micro' && application.guarantors.length > 0 && (
      <div className="d-flex justify-content-between flex-wrap">
        {application.guarantors.map((guarantor, i) => (
          <div className="mt-5">
            <p>
              <u>{guarantorOrderLocal[i && i > 10 ? 'default' : i]}</u>
            </p>
            <p>الاسم : {guarantor.customerName}</p>
            <p>بطاقة الرقم القومى : {guarantor.nationalId}</p>
            <p>العنوان: {guarantor.customerHomeAddress}</p>
            <p>التوقيع :</p>
          </div>
        ))}
      </div>
    )}
  </div>
)
export const PromissoryNoteMicro = ({
  application,
  branchDetails,
  nanoForm,
}: PromissoryNoteProps) => (
  <>
    {application.product?.beneficiaryType === 'group'
      ? application.group?.individualsInGroup.map((member) =>
          template(member.customer, application, branchDetails, false)
        )
      : template(application.customer, application, branchDetails, nanoForm)}
  </>
)

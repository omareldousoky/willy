import React from 'react'
import Tafgeet from 'tafgeetjs'
import {
  numbersToArabic,
  promissoryNoteGuarantorOrderLocal,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import { ApplicationResponse } from '../../../../Shared/Models/Application'
import { Customer } from '../../../../Shared/Models/Customer'
import { BranchDetails } from '../../../../Shared/Services/APIs/Branch/getBranch'
import './promissoryNoteMicro.scss'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'

interface PromissoryNoteProps {
  customer: Customer
  branchDetails: BranchDetails
  application?: ApplicationResponse
}
const template = (
  customer: Customer,
  branchDetails,
  application?: ApplicationResponse,
  last?: boolean
) => {
  const hasGuarantors = application && application.guarantors?.length > 0
  return (
    <div
      className={last ? 'promissory-note-micro-last' : 'promissory-note-micro'}
      dir="rtl"
      lang="ar"
    >
      <Header
        title="سند لأمر"
        showCurrentUser={false}
        showCurrentTime={false}
      />
      <p>
        تاريخ الاصدار : &nbsp;
        {timeToArabicDate(
          application ? application.creationDate : new Date().valueOf(),
          false
        )}
      </p>
      <p>
        مكان الاصدار: {branchDetails.name} - {branchDetails.address}
      </p>
      <p>تاريخ الاستحقاق : &nbsp; / &nbsp; / &nbsp; &nbsp;</p>
      <p>
        المبلغ :&nbsp;
        {numbersToArabic(
          application
            ? application.installmentsObject?.totalInstallments.installmentSum
            : customer.nanoLoansLimit
        )}
      </p>
      <p>
        <span>{hasGuarantors ? 'نتعهد نحن الموقعين' : 'اتعهد انا الموقع'}</span>{' '}
        ادناه تعهداً نهائيا وبدون اى قيد او شرط بأن{' '}
        <span>{hasGuarantors ? 'ندفع' : 'ادفع'}</span> فى تاريخ الاستحقاق لأمر
        واذن شركة تساهيل للتمويل متناهي الصغر مبلغ وقدره &nbsp;
        {numbersToArabic(
          application
            ? application.installmentsObject?.totalInstallments.installmentSum
            : customer.nanoLoansLimit
        )}
        &nbsp;جنيه (
        {new Tafgeet(
          application
            ? application.installmentsObject?.totalInstallments.installmentSum
            : customer.nanoLoansLimit,
          'EGP'
        ).parse()}
        ) &nbsp; والقيمة <span>{hasGuarantors ? 'وصلتنا' : 'وصلتني'}</span>{' '}
        نقداً ويستحق علينا عوائد من تاريخ تحرير السند وحتى تاريخ السداد بواقع
        .... % سنوياً ، كما يستحق علينا عوائد تأخير بواقع ......... % علاوة على
        سعر العائد المطبق من تاريخ الاستحقاق حتى تمام السداد وذلك بدون حاجة الى
        تنبيه او انذار.
      </p>
      <p>
        وعلى ان يتم الوفاء بمبلغ السند بمقر الشركة الكائن فى&nbsp;
        {branchDetails.name} - {branchDetails.address}
      </p>
      <p>
        ويحق لحامل هذا السند الرجوع علينا بدون مصروفات او اخطار او عمل احتجاج
        لعدم الوفاء، ونفوض الشركة فى ملء أية بيانات او مبالغ طالما ان السند موقع
        منا ونلتزم بما ورد فى السند ولا يجوز{' '}
        <span>{hasGuarantors ? 'لنا' : 'لي'}</span> الاعتراض.
      </p>
      <p>
        ولا تبرأ <span>{hasGuarantors ? 'ذمتنا' : 'ذمتي'}</span> من هذا المبلغ
        الا <span>{hasGuarantors ? 'باستلامنا' : 'باستلامي'}</span> أصل هذا
        السند مؤشرا عليه من شركة تساهيل للتمويل متناهي الصغر بتمام السداد
      </p>
      <p>
        يخضع هذا السند لاحكام القانون المصري ويكون اي نزاع ينشأ عنه او يتصل به
        الفصل فيه والتقاضي يكون من اختصاص وامام محاكم ( الجيزة ) على اختلاف
        درجاتها وانواعها.
      </p>
      <p>
        <u>المدين</u>
      </p>
      <p>الاسم : {customer.customerName}</p>
      <p>بطاقة الرقم القومى : {customer.nationalId}</p>
      <p>العنوان: {customer.customerHomeAddress}</p>
      <p>التوقيع :</p>
      {application?.product.type === 'micro' && hasGuarantors && (
        <div className="d-flex justify-content-between flex-wrap">
          {application.guarantors.map((guarantor, i) => (
            <div className="mt-5">
              <p>
                <u>
                  {
                    promissoryNoteGuarantorOrderLocal[
                      i && i > 10 ? 'default' : i
                    ]
                  }
                </u>
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
}
export const PromissoryNoteMicro = ({
  application,
  branchDetails,
  customer,
}: PromissoryNoteProps) => (
  <>
    {application
      ? application.product?.beneficiaryType === 'group'
        ? application.group?.individualsInGroup.map((member, i) =>
            template(
              member.customer,
              branchDetails,
              application,
              i === (application.group?.individualsInGroup.length ?? 0) - 1
            )
          )
        : template(application?.customer, branchDetails, application)
      : template(customer, branchDetails)}
  </>
)

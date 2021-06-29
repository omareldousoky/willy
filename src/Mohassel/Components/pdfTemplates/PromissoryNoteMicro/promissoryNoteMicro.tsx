import React from 'react'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import { ApplicationResponse } from '../../../Models/Application'
import { BranchDetails } from '../../../Services/APIs/Branch/getBranch'
import { Header } from '../pdfTemplateCommon/header'
import './promissoryNoteMicro.scss'

interface PromissoryNoteProps {
  application: ApplicationResponse
  branchDetails: BranchDetails
}

export const PromissoryNoteMicro = ({
  application,
  branchDetails,
}: PromissoryNoteProps) => (
  <>
    <div className="promissory-note-micro" dir="rtl" lang="ar">
      <Header
        title="سند لأمر"
        showCurrentUser={false}
        showCurrentTime={false}
      />
      <p>تاريخ الاصدار : {timeToArabicDate(application.creationDate, false)}</p>
      <p>مكان الاصدار: {branchDetails.address}</p>
      <p>
        تاريخ الاستحقاق : &nbsp;
        {timeToArabicDate(
          application.installmentsObject?.installments[
            application.installmentsObject.installments.length - 1
          ].dateOfPayment || 0,
          false
        )}
      </p>
      <p>المبلغ : {application.principal}</p>
      <p>
        نتعهد نحن الموقعين ادناه تعهداً نهائيا وبدون اى قيد او شرط بأن ندفع فى
        تاريخ الاستحقاق لأمر واذن شركة تساهيل للتمويل مبلغ وقدره
        ............................................................................
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
        والدفع والتقاضى يكون امام محاكم ( الجيزه ) على اختلاف درجاتها وانواعها.
      </p>
      {/* <p>{noteKind === 'شركات' ? 'الشركة :' : 'الاسم :'}</p>
      {noteKind === 'شركات' && <p>من له حق التوقيع عن الشركة :</p>} */}
      <p>الصفة : </p>
      <p>بطاقة الرقم القومى :</p>
      <p>العنوان:</p>
      <p>التوقيع :</p>
    </div>
  </>
)

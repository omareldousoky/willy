import React from 'react'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import local from '../../../../Shared/Assets/ar.json'

import {
  guarantorOrderLocal,
  orderLocal,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'

import { KnowYourCustomerProps } from './types'

export const KnowYourCustomer = ({
  application,
  loanUsage,
}: KnowYourCustomerProps) => {
  return (
    <>
      <div className="contract-container p-0" dir="rtl" lang="ar">
        <Header
          title="اعرف عميلك"
          showCurrentUser={false}
          showCurrentTime={false}
          sme
        />
        <p className="font-weight-bolder border-bottom w-25">بيانات الشركة:-</p>
        <p>
          اســـــــــــم الشــــركـــــــــة :-
          {application.customer?.businessName ?? ''}
        </p>
        <p>
          السمــــــــــة التجاريـــــــــة :-
          {application.customer?.businessCharacteristic ?? ''}
        </p>
        <p>
          الشكـــــــــل القانونــــــــــي :-
          {application.customer?.legalStructure
            ? local[application.customer.legalStructure]
            : ''}
        </p>
        <p>
          رقــــــم السجــــــل التجاري :-
          {application.customer?.commercialRegisterNumber ?? ''}
        </p>
        <p>
          رقــــم البطاقــــة الضريبيـــة :-
          {application.customer?.taxCardNumber ?? ''}
        </p>
        <p>
          ترخيــص مزاولـــة النشـــاط :-
          {application.customer?.businessLicenseNumber ?? ''}
        </p>
        <p>
          نشـــــــــــاط الشــركـــــــــــة :-
          {application.customer?.businessSector ?? ''}
        </p>
        <p>
          عنــوان النشــاط تفصيلـــــي :-
          {application.customer?.businessAddress ?? ''}
        </p>
        <p>
          حجــم التمويــل المطلــــــوب :-
          {application.principal ?? ''}
        </p>
        <p>
          الغـــرض مـــن التمــويـــــل :-
          {loanUsage}
        </p>
        <p className="font-weight-bolder border-bottom w-25">
          من له حق التوقيع والاقتراض :-
        </p>
        {application.entitledToSign?.map((person, index) => (
          <div key={index}>
            <p className="font-weight-bold border-bottom w-25">
              الشخص {orderLocal[index]}
            </p>
            <p>
              الاســـــــــــــــــــم :-
              {person.customer.customerName ?? ''}
            </p>
            <p>
              بطاقة رقم قومــي :-
              {person.customer.nationalId ?? ''}
            </p>
            <p>
              صادرة بتاريــــــخ :-
              {(person.customer.nationalIdIssueDate &&
                timeToArabicDate(person.customer.nationalIdIssueDate, false)) ??
                ''}
            </p>
            <p>
              عنوان سكنــــــــه :-
              {person.customer.customerHomeAddress ?? ''}
            </p>
            <p>
              رقــم التليفــــــون :-
              {person.customer.homePhoneNumber
                ? person.customer.homePhoneNumber
                : person.customer.businessPhoneNumber || ''}
            </p>
            <p>الصفة في النشاط :- {person.position}</p>
          </div>
        ))}
        {application.guarantors?.map((person, index) => (
          <div key={index}>
            <p className="font-weight-bold border-bottom w-25">
              بيانات {guarantorOrderLocal[index]}
            </p>
            <p>
              اسم الضامـــــــــــن :-
              {person.customerName ?? ''}
            </p>
            <p>
              بطاقة رقم قومــي :-
              {person.nationalId ?? ''}
            </p>
            <p>
              صادرة بتاريــــــخ :-
              {(person.nationalIdIssueDate &&
                timeToArabicDate(person.nationalIdIssueDate, false)) ??
                ''}
            </p>
            <p>
              عنوان سكنــــــــه :-
              {person.customerHomeAddress ?? ''}
            </p>
            <p>
              تليفون المنــــــــزل :-
              {person.homePhoneNumber ?? ''}
            </p>
            <p>
              تليفون محمـــــــول :-
              {person.businessPhoneNumber ?? ''}
            </p>
            <p>الوظيفة الحاليــــــة :-</p>
            <p>
              عنوان جهة العمـل :-
              {person.currentHomeAddress ?? ''}
            </p>
          </div>
        ))}

        <h3 className="text-center my-2">إقرار بصحة البيانات</h3>
        <p>
          أقر أنا الموقع أدناه بتحمل المسئوليه القانونية عن صحة البيانات في
          النموذج عاليه والمستندات ( وصورها ) المقدمة لشركة تساهيل للتمويل
          متناهي الصغر إقر بحق الشركة في الاتصال بالسلطات المختصة للتحقق منها في
          أي وقت . كما أتعهد بأنني المستفيد الحقيقي من التعامل كما أتعهد بتحديث
          البيانات فور حدوث أي تغيرات بها أو عند طلب الشركة ذلك .
        </p>
        <p>
          اسم الشركة المدينة :-
          {application.customer?.businessName ?? ''}
        </p>
        {application.entitledToSign?.map((person, index) => (
          <div key={index}>
            <p>
              اسم من له حق التوقيع والاقتراض :-
              {person.customer.customerName ?? ''}
            </p>
            <p>التوقيع /</p>
            <p>
              التاريخ &emsp; {timeToArabicDate(application.creationDate, false)}
            </p>
          </div>
        ))}
        <p>
          من له حق التوقيع والاقتراض عن الشركة وقع أمامي وتحققت من شخصيته وتم
          التأكد من عدم إدراجه في القوائم السلبيه .
        </p>
        <div className="d-flex justify-content-between">
          <span>أسم عضو الرقابة</span>
          <span>توقيع عضو الرقابة</span>
          <span>
            التاريخ &emsp; {timeToArabicDate(application.creationDate, false)}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span>اسم مدير الفرع </span>
          <span>توقيع مدير الفرع</span>
          <span>
            التاريخ &emsp; {timeToArabicDate(application.creationDate, false)}
          </span>
        </div>
      </div>
    </>
  )
}
KnowYourCustomer.defaultProps = {
  application: {},
}

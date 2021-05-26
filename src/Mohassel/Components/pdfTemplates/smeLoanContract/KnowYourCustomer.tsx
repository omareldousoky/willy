import React from "react";

import { Header } from "../pdfTemplateCommon/header";

import {
  guarantorOrderLocal,
  orderLocal,
  timeToArabicDate,
} from "../../../../Shared/Services/utils";

import { KnowYourCustomerProps } from "./types";

export const KnowYourCustomer = ({
  application,
  loanUsage,
}: KnowYourCustomerProps) => {
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="أعرف عميلك"
          showCurrentUser={false}
          showCurrentTime={false}
        />
        <p className="font-weight-bolder border-bottom w-25">بيانات الشركة:-</p>
        <p>
          إســـــــــــم الشــــركـــــــــة :-
          {application.customer?.businessName ?? ""}
        </p>
        <p>
          السمــــــــــه التجاريـــــــــه :-
          {application.customer?.businessCharacteristic ?? ""}
        </p>
        <p>
          الشكـــــــــل القانونــــــــــي :-
          {application.customer?.legalStructure ?? ""}
        </p>
        <p>
          رقــــــم السجــــــل التجاري :-
          {application.customer?.commercialRegisterNumber ?? ""}
        </p>
        <p>
          رقــــم البطاقــــة الضريبيـــة :-
          {application.customer?.taxCardNumber ?? ""}
        </p>
        <p>
          ترخيــص مزاولـــة النشـــاط :-
          {application.customer?.businessLicenseNumber ?? ""}
        </p>
        <p>
          نشـــــــــــاط الشــركـــــــــــة :-
          {application.customer?.businessActivity ?? ""}
        </p>
        <p>
          عنــوان النشــاط تفصيلـــــي :-
          {application.customer?.businessAddress ?? ""}
        </p>
        <p>
          حجــم التمويــل المطلــــــوب :-
          {application.principal ?? ""}
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
              الأســـــــــــــــــــم :-
              {person.customerName ?? ""}
            </p>
            <p>
              بطاقة رقم قومــي :-
              {person.nationalId ?? ""}
            </p>
            <p>
              صادرة بتاريــــــخ :-
              {(person.nationalIdIssueDate &&
                timeToArabicDate(person.nationalIdIssueDate, false)) ??
                ""}
            </p>
            <p>
              عنوان سكنــــــــه :-
              {person.customerHomeAddress ?? ""}
            </p>
            <p>
              رقــم التليفــــــون :-
              {person.homePhoneNumber ?? ""}
            </p>
            <p>الصفة في النشاط :-</p>
          </div>
        ))}
        {application.guarantors?.map((person, index) => (
          <div key={index}>
            <p className="font-weight-bold border-bottom w-25">
              بيانات {guarantorOrderLocal[index]}
            </p>
            <p>
              إسم الضامـــــــــــن :-
              {person.customerName ?? ""}
            </p>
            <p>
              بطاقة رقم قومــي :-
              {person.nationalId ?? ""}
            </p>
            <p>
              صادرة بتاريــــــخ :-
              {(person.nationalIdIssueDate &&
                timeToArabicDate(person.nationalIdIssueDate, false)) ??
                ""}
            </p>
            <p>
              عنوان سكنــــــــه :-
              {person.customerHomeAddress ?? ""}
            </p>
            <p>
              تليفون المنــــــــزل :-
              {person.homePhoneNumber ?? ""}
            </p>
            <p>
              تليفون محمـــــــول :-
              {person.businessPhoneNumber ?? ""}
            </p>
            <p>الوظيفة الحاليــــــة :-</p>
            <p>
              عنوان جهة العمـل :-
              {person.businessAddress ?? ""}
            </p>
          </div>
        ))}

        <h3 className="text-center my-5">إقرار بصحة البيانات</h3>
        <p>
          أقر أنا الموقع أدناه بتحمل المسئوليه القانونية عن صحة البيانات في
          النموذج عاليه والمستندات ( وصورها ) المقدمة للشركة إقر بحق الشركة في
          الاتصال بالسلطات المختصة للتحقق منها في أي وقت . كما أتعهد بأنني
          النستفيد الحقيقي من التعامل كما أتعهد بتحديث البيانات فور حدوث أي
          تغيرات بها أو عند طلب الشركة ذلك .
        </p>
        <p>
          أسم الشركة المدينة :-
          {application.customer?.businessName ?? ""}
        </p>
        {application.entitledToSign?.map((person, index) => (
          <div key={index}>
            <p>
              إسم من له حق التوقيع والاقتراض :-
              {person.customerName ?? ""}
            </p>
            <p>التوقيع /</p>
            <p>التاريخ &emsp;/&emsp;/ &emsp; &emsp; &emsp;</p>
          </div>
        ))}
        <p>
          من له حق التوقيع والاقتراض عن الشركة وقع أمامي وتحققت من شخصيته وتم
          التأكد من عدم إدراجه في القوائم السلبيه .
        </p>
        <div className="d-flex justify-content-between">
          <span>أسم عضو الرقابة</span>
          <span>توقيع عضو الرقابة</span>
          <span>التاريخ</span>
        </div>
        <p>توقيع مدير الفرع :-</p>
      </div>
    </>
  );
};
KnowYourCustomer.defaultProps = {
  application: {},
};

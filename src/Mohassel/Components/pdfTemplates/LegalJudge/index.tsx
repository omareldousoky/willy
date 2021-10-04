import React, { ReactNode } from 'react'

import local from '../../../../Shared/Assets/ar.json'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import { DefaultedCustomer } from '../../ManageLegalAffairs/defaultingCustomersList'
import {
  LegalActionsForm,
  SettledCustomer,
  SettlementFormValues,
} from '../../ManageLegalAffairs/types'

import './style.scss'

const LegalJudge = ({
  actor,
  customers,
  policeStation,
  governorate,
}: {
  actor: string
  customers: DefaultedCustomer[]
  policeStation: string
  governorate: string
}) => {
  const customersTableMapper: {
    key: string
    title: string
    render?: (data: any) => ReactNode
  }[] = [
    {
      key: 'customerName',
      title: local.accusedName,
    },
    {
      key: 'caseNumber',
      title: local.courtCaseNumber,
      render: (customer: SettledCustomer & SettlementFormValues) =>
        customer.caseNumber,
    },
    {
      key: 'finalVerdict',
      title: local.theVerdict,
    },
    {
      key: 'finalConfinementNumber',
      title: local.theConfinement,
      render: (customer: SettledCustomer & LegalActionsForm) =>
        customer.finalConfinementNumber,
    },
    {
      key: 'customerAddress',
      title: local.address,
    },
  ]

  return (
    <div className="min-vh-100 w-75 mx-auto p-2 font-weight-bold legal-judge-container">
      <header>
        <Header title="" showCurrentUser={false} showCurrentTime={false} />
        <h1 className="mb-4 font-weight-bold">
          <u>السيد / {actor}</u>
        </h1>
      </header>

      <main className="mb-4">
        <section className="mb-4">
          <p className="text-center font-weight-bold mb-1">بعد التحية ,,,</p>
          <p>
            مقدمه لسيادتكم / شركة تساهيل للتمويل المتناهي الصغر ( ش . م . م )
            ويمثلها رئيس مجلس الاداره ومحله المختار القطاع القانوني للشركة
            الكائن في :- 2 شارع لبنان – المهندسين – الجيزة .
          </p>
        </section>

        <section>
          <p className="text-center font-weight-bold mb-1">
            اتشرف بعرض الاتي ,,,
          </p>
          <p>
            اقامت الشركه عدة بلاغات قسم شرطة {policeStation} – محافظة{' '}
            {governorate} بشأن قيام المشكو في حقهم الاتي اسماءهم بارتكابهم جريمه
            خيانه الامانه وتم الحصول على عده احكام ضد المشكو في حقهم وبياناتها
            كالاتي :-
          </p>
        </section>

        <section>
          <table className="border border-secondary w-100">
            <tr>
              <th className="border border-secondary">م</th>
              {customersTableMapper.map((itemMapper) => (
                <th className="border border-secondary">{itemMapper.title}</th>
              ))}
            </tr>

            {customers.map((customer, index) => (
              <tr>
                <td className="border border-secondary">{index + 1}</td>
                {customersTableMapper.map((itemMapper) => (
                  <td className="border border-secondary">
                    {itemMapper.render
                      ? itemMapper.render(customer)
                      : customer[itemMapper.key]}
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </section>
      </main>

      <footer className="text-center">
        <p>
          لذلك <br />
          نلتمس من سيادتكم بإصدار تعليماتكم نحو اتخاذ اللازم وسرعة تنفيذ الأحكام
          سالفة الذكر بما يحفظ حقوق الشركة مع العلم بان الشركة ( شركة مساهمة
          مصرية ) واموالها في حكم الاموال العامة .
          <br />
          ولسيادتكم جزيل الشكر
        </p>

        <div className="d-flex flex-row-reverse">
          <p>
            القطاع القانوني
            <br />ا / حازم فؤاد 01229550016
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LegalJudge

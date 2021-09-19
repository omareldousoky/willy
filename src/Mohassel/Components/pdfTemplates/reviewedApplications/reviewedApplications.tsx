import React from 'react'
import './reviewedApplications.scss'
import {
  beneficiaryType,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import store from '../../../../Shared/redux/store'
import { loanStatusLocal } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/reportLocal'

const ReviewedApplicationsPDF = (props) => {
  const { isSme, data, branchDetails } = props
  function getTotal() {
    let sum = 0
    data.forEach(
      // eslint-disable-next-line no-return-assign
      (application) =>
        (sum += application.principal ? application.principal : 0)
    )
    return sum
  }
  return (
    <div
      className="reviewed-applications-print"
      style={{ direction: 'rtl' }}
      lang="ar"
    >
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <tr style={{ height: '10px' }} />
        <tr
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <th colSpan={6} style={{ backgroundColor: 'white' }}>
            <div className="logo-print-tb" />
          </th>
          <th style={{ backgroundColor: 'white' }} colSpan={6}>
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </table>
      <table>
        <tbody>
          <tr>
            <td className="title titleborder titlebackground">
              شركة تساهيل للتمويل متناهي الصغر
            </td>
            <td style={{ width: '30%' }} />
            <td className="title">{branchDetails.name}</td>
          </tr>
          <tr>
            <td>{timeToArabicDateNow(true)}</td>
            <td />
            <td style={{ fontSize: '8px' }}>{store.getState().auth.name}</td>
          </tr>
          <tr>
            <td />
            <td />
          </tr>
        </tbody>
      </table>

      <div className="title titleborder titlebackground titlestyle">
        قرارات الموافقه على صرف التمويلات
        {/* - فردى - لدفعة ( &emsp; / &emsp; / &emsp; ) */}
      </div>
      <table className="tablestyle" style={{ border: '1px black solid' }}>
        <tbody>
          <tr>
            <th>مسلسل</th>
            <th>نوع {isSme ? 'الشركة' : 'العميل'}</th>
            <th>الكود</th>
            <th>اسم {isSme ? 'الشركة' : 'العميل'}</th>
            {!isSme && <th>السن</th>}
            <th>النشاط</th>
            {!isSme ? (
              <>
                <th>التخصص</th>
                <th>قطاع العمل</th>
                <th>اسم الاخصائى</th>
                <th>الرقم القومى</th>
              </>
            ) : (
              <th>اسم الاخصائى</th>
            )}
            <th>المبلغ الحالى</th>
            <th>المدة</th>
            <th>حالة طلب القرض</th>
          </tr>
          {data.map((application) => (
            <tr key={application.id}>
              <td>{application.serialNumber}</td>
              <td>{beneficiaryType(application.beneficiaryType)}</td>
              <td>{application.customerKey}</td>
              <td>{application.customerName}</td>
              {!isSme && (
                <>
                  <td>{application.customerAge}</td>
                  <td>{application.businessActivity}</td>
                  <td>{application.businessSpeciality}</td>
                </>
              )}
              <td>{application.businessSector}</td>
              {!isSme && (
                <>
                  <td>{application.representativeName}</td>
                  <td>{application.nationalId}</td>
                </>
              )}
              {isSme && <td>{application.representativeName}</td>}
              <td>{application.principal}</td>
              <td>{application.noOfInstallments}</td>
              <td>{loanStatusLocal[application.loanStatus]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="overall">
        <tbody>
          <tr>
            <td className="titleborder">اجمالى عام</td>
            <td className="titleborder">{getTotal()}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>المراجعة:</td>
            <td>مدير الفرع:</td>
            <td>مدير المنطقة:</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default ReviewedApplicationsPDF

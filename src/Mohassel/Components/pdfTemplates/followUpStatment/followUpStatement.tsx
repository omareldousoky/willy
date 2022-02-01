import React from 'react'
import './followUpStatment.scss'
import * as local from 'Shared/Assets/ar.json'
import {
  timeToArabicDate,
  numbersToArabic,
  dayToArabic,
} from '../../../../Shared/Services/utils'
import store from '../../../../Shared/redux/store'
import { roundTo2 } from '../customerCard/customerCard'
import { IndividualWithInstallments } from '../../LoanProfile/loanProfile'

interface Props {
  data: any
  branchDetails: any
  members: IndividualWithInstallments
}

const FollowUpStatementPDF = (props: Props) => {
  function getCustomerData(key: string) {
    if (props.data.product.beneficiaryType === 'individual')
      return props.data.customer[key]
    return props.data.group.individualsInGroup.find(
      (customer) => customer.type === 'leader'
    ).customer[key]
  }
  return (
    <div className="follow-up-statment" dir="rtl" lang="ar">
      <table className="margin">
        <tbody>
          <tr>
            <td>
              {props.branchDetails.name} - {props.branchDetails.governorate}
            </td>
            <td />
            <td>{store.getState().auth.name}</td>
          </tr>
          <tr>
            <td>{timeToArabicDate(props.data.creationDate, false)}</td>
            <td />
            <td>{dayToArabic(new Date(props.data.creationDate).getDay())}</td>
          </tr>
          <tr>
            <td />
            <td className="title2 bold">
              <u>بيان متابعه</u>
            </td>
            <td />
          </tr>
        </tbody>
      </table>

      <table className="titleborder">
        <tbody>
          <tr>
            <td style={{ textAlign: 'right' }}>
              العميل
              <div className="frame">
                {numbersToArabic(getCustomerData('key'))}
              </div>
              <div className="frame">
                {getCustomerData(
                  props.data.product.type === 'sme'
                    ? 'businessName'
                    : 'customerName'
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table-content" style={{ width: '50%' }}>
        <tbody>
          <tr>
            <th>القسط</th>
            <th>تاريخ الآستحقاق</th>
            <th>القيمه</th>
            <th style={{ width: '40%' }}>ملاحظات</th>
          </tr>
          {props.members.installmentTable.map((installment, index) => {
            return (
              <tr key={index}>
                <td>
                  {numbersToArabic(props.data.applicationKey) +
                    '/' +
                    numbersToArabic(installment.id)}
                </td>
                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                <td>
                  {numbersToArabic(roundTo2(installment.installmentResponse))}
                </td>
                <td />
              </tr>
            )
          })}
        </tbody>
      </table>
      {props.data.product.beneficiaryType !== 'individual' &&
      props.members.customerTable ? (
        <table className="table-content" style={{ width: '50%' }}>
          <tbody>
            <tr>
              <th>كود العضوه</th>
              <th>اسم العضو</th>
              <th>التمويل</th>
              <th>القسط</th>
              <th>النشاط</th>
              <th>المنطقه</th>
            </tr>
            {props.members.customerTable.map((individualInGroup, index) => {
              return (
                <tr key={index}>
                  <td>{numbersToArabic(individualInGroup.customer.key)}</td>
                  <td>{individualInGroup.customer.customerName}</td>
                  <td>{numbersToArabic(individualInGroup.amount)}</td>
                  <td>
                    {numbersToArabic(individualInGroup.installmentAmount)}
                  </td>
                  <td>
                    {individualInGroup.customer.businessSector +
                      '-' +
                      individualInGroup.customer.businessActivity +
                      '-' +
                      (individualInGroup.customer.businessSpeciality ||
                        local.notApplicable)}
                  </td>
                  <td>{individualInGroup.customer.district}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default FollowUpStatementPDF

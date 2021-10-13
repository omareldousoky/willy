import React from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { Customer } from './interfaces'

import * as local from '../Assets/ar.json'
import ability from '../config/ability'
import {
  arabicGender,
  downloadFile,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
  timeToDateyyymmdd,
  getDateAndTime,
  numbersToArabic,
} from './utils'
import Can from '../config/Can'
import { FieldProps } from '../Components/Profile/types'
import { Score } from '../Models/Customer'
import { LtsIcon } from '../Components/LtsIcon'

interface IscoreInfo {
  score?: Score
  getIscore?(customer: Customer): void
  applicationStatus?: any
}
interface CustomerInfo extends IscoreInfo {
  isLeader?: boolean
  customerDetails: Customer
  productType?: string
  isCF?: boolean
}
interface CompanyInfo extends IscoreInfo {
  company: Customer
}
const iscoreField = ({
  score,
  getIscore,
  applicationStatus,
  customerDetails,
  productType = '',
}) => {
  return (
    <>
      <Form.Label style={{ color: iscoreStatusColor(score?.iscore).color }}>
        {score?.iscore}
      </Form.Label>
      <Form.Label>{iscoreStatusColor(score?.iscore).status} </Form.Label>
      {score?.bankCodes &&
        score?.bankCodes.map((code, index) => (
          <Form.Label key={index}>{iscoreBank(code)}</Form.Label>
        ))}
      {score?.url && (
        <Col>
          <span
            style={{ cursor: 'pointer', padding: 10 }}
            onClick={() => downloadFile(score?.url)}
          >
            <span
              className="fa fa-file-pdf-o"
              style={{ margin: '0px 0px 0px 5px' }}
            />
            iScore
          </span>
        </Col>
      )}
      {applicationStatus &&
        ability.can('viewIscore', 'customer') &&
        (productType === 'nano' ||
          ![
            'approved',
            'created',
            'issued',
            'rejected',
            'paid',
            'pending',
            'canceled',
          ].includes(applicationStatus)) &&
        getIscore && (
          <Col>
            <Can I="getIscore" a="customer">
              <span
                style={{ cursor: 'pointer', padding: 10 }}
                onClick={() => getIscore(customerDetails)}
              >
                iscore
                {/* <span style={{ margin: '0px 0px 0px 5px' }} /> */}
                <LtsIcon
                  name="refresh"
                  color="#000000"
                  size="16px"
                  className="mr-1"
                />
              </span>
            </Can>
          </Col>
        )}
    </>
  )
}
export const getCompanyInfo = ({
  company,
  score,
  getIscore,
  applicationStatus,
}: CompanyInfo) => {
  return [
    {
      fieldTitle: local.companyName,
      fieldData: company.businessName || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.companyCode,
      fieldData: company.key || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.oneBranch,
      fieldData: company.branchName || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: 'iScore',
      fieldData: iscoreField({
        score,
        getIscore,
        applicationStatus,
        customerDetails: company,
      }),
      showFieldCondition: !!score,
    },
    {
      fieldTitle: local.taxCardNumber,
      fieldData: company.taxCardNumber || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.commercialRegisterNumber,
      fieldData: company.commercialRegisterNumber || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.creationDate,
      fieldData:
        (company.created?.at && getDateAndTime(company.created?.at)) || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessSector,
      fieldData: company.businessSector || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.loanOfficer,
      fieldData: company.representativeName || '',
      showFieldCondition: true,
    },
  ]
}
export const getCustomerInfo = ({
  customerDetails,
  score,
  isLeader,
  isCF,
  getIscore,
  applicationStatus,
  productType,
}: CustomerInfo) => {
  const {
    customerName,
    key,
    nationalId,
    birthDate,
    gender,
    nationalIdIssueDate,
    businessSector,
    businessActivity,
    businessSpeciality,
    permanentEmployeeCount,
    partTimeEmployeeCount,
    created,
    homePostalCode,
    customerHomeAddress,
    homePhoneNumber,
    faxNumber,
    mobilePhoneNumber,
    branchName,
    representativeName,
    monthlyIncome,
    initialConsumerFinanceLimit,
  } = customerDetails
  const info: FieldProps[] = [
    {
      fieldTitle: isLeader ? local.groupLeaderName : local.name,
      fieldData: customerName || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.customerCode,
      fieldData: key || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.oneBranch,
      fieldData: branchName || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: 'iScore',
      fieldData: iscoreField({
        score,
        getIscore,
        applicationStatus,
        customerDetails,
        productType,
      }),
      showFieldCondition: !!score,
    },
    {
      fieldTitle: local.nationalId,
      fieldData: nationalId || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.birthDate,
      fieldData: (birthDate && timeToArabicDate(birthDate, false)) || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.creationDate,
      fieldData: created?.at ? timeToDateyyymmdd(created.at) : '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.gender,
      fieldData: (gender && arabicGender(gender)) || '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.nationalIdIssueDate,
      fieldData:
        (nationalIdIssueDate && timeToArabicDate(nationalIdIssueDate, false)) ||
        '',
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessSector,
      fieldData: businessSector || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessActivity,
      fieldData: businessActivity || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessSpeciality,
      fieldData: businessSpeciality || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.permanentEmployeeCount,
      fieldData: permanentEmployeeCount || 0,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.partTimeEmployeeCount,
      fieldData: partTimeEmployeeCount || 0,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.customerHomeAddress,
      fieldData: customerHomeAddress || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.postalCode,
      fieldData: homePostalCode || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.homePhoneNumber,
      fieldData: homePhoneNumber || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.faxNumber,
      fieldData: faxNumber || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.mobilePhoneNumber,
      fieldData: mobilePhoneNumber || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.loanOfficer,
      fieldData: representativeName || '',
      showFieldCondition: true,
    },
  ]

  // monthlyIncome && initialConsumerFinanceLimit
  const cfFields: FieldProps[] = [
    // hidden field to display both fields in a new row
    // TODO: make a better way
    {
      fieldTitle: 'empty dummy field',
      fieldData: 0,
      showFieldCondition: false,
    },
    {
      fieldTitle: local.monthlyIncome,
      fieldData: numbersToArabic(monthlyIncome || 0),
      showFieldCondition: true,
    },
    {
      fieldTitle: local.initialConsumerFinanceLimit,
      fieldData: numbersToArabic(initialConsumerFinanceLimit || 0),
      showFieldCondition: true,
    },
  ]

  if (isCF) return [...info, ...cfFields]

  return info
}

import React from 'react'

// Components
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import { Loader } from '../Loader'
import BackButton from '../BackButton/back-button'
import { CardNavBar } from '../HeaderWithCards/cardNavbar'

import { CustomerCategorization } from '../Customer/customerCategorization'
import { ProfileActions } from '../ProfileActions'
import { ProfileProps } from './types'
import {
  CustomerReportsTab,
  DeathCertificate,
  DocumentsUpload,
  GuarantorDetails,
} from '../Customer'
import {
  CFEntitledToSignDetailsProps,
  CFGuarantorDetailsProps,
  CompanyOtpCustomersProps,
} from '../../Models/Customer'
import { EntitledToSignDetails } from '../Customer/EntitledToSignDetails'
import { CompanyOtpPhoneNumbers } from '../Customer/companyOtpCustomers/companyOtpPhoneNumbers'

export const Profile = ({
  source,
  loading,
  backButtonText,
  editText,
  editPermission,
  editOnClick,
  tabs,
  activeTab,
  setActiveTab,
  tabsData,
}: ProfileProps) => {
  return (
    <>
      <Loader open={loading} type="fullscreen" />
      <div className="rowContainer print-none" style={{ paddingLeft: 30 }}>
        {backButtonText && (
          <BackButton title={backButtonText} className="print-none" />
        )}
        <ProfileActions
          actions={[
            {
              icon: 'edit',
              title: editText || '',
              permission: Boolean(editPermission && editText),
              onActionClick: () => editOnClick,
            },
          ]}
        />
      </div>
      <Card style={{ marginTop: 10 }} className="print-none">
        <CardNavBar
          array={tabs}
          active={activeTab}
          selectTab={(stringKey: string) => setActiveTab(stringKey)}
        />
        <Card.Body>
          {(activeTab === 'mainInfo' ||
            activeTab === 'workInfo' ||
            activeTab === 'differentInfo') && (
            <Table
              striped
              bordered
              style={{ textAlign: 'right' }}
              className="horizontal-table"
            >
              <tbody>
                {tabsData[activeTab].map((field, index) => {
                  const { fieldTitle, fieldData, showFieldCondition } = field
                  return (
                    showFieldCondition && (
                      <tr key={index}>
                        <td
                          style={field.fieldTitleStyle ?? field.fieldTitleStyle}
                        >
                          {fieldTitle}
                        </td>
                        <td
                          style={field.fieldDataStyle ?? field.fieldDataStyle}
                        >
                          {fieldData}
                        </td>
                      </tr>
                    )
                  )
                })}
              </tbody>
            </Table>
          )}
          {activeTab === 'customerScore' &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData, showFieldCondition } = field
              return (
                Array.isArray(fieldData) &&
                showFieldCondition && (
                  <CustomerCategorization key={index} ratings={fieldData} />
                )
              )
            })}
          {activeTab === 'documents' &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData, showFieldCondition } = field
              return (
                typeof fieldData === 'string' &&
                showFieldCondition && (
                  <DocumentsUpload
                    key={index}
                    customerId={fieldData}
                    edit={false}
                    view
                    isCompany={source === 'company'}
                  />
                )
              )
            })}
          {activeTab === 'reports' &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData, showFieldCondition } = field
              return (
                showFieldCondition && (
                  <CustomerReportsTab
                    customerKey={fieldData as string}
                    key={index}
                  />
                )
              )
            })}
          {activeTab === 'deathCertificate' &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData, showFieldCondition } = field
              return (
                typeof fieldData === 'string' &&
                showFieldCondition && (
                  <DeathCertificate
                    key={index}
                    edit
                    view={false}
                    customerId={fieldData}
                  />
                )
              )
            })}
          {activeTab === 'cfGuarantors' &&
            tabsData[activeTab].map((field, index) => {
              const fieldData = field.fieldData as CFGuarantorDetailsProps
              return (
                Object.keys(fieldData).length > 0 && (
                  <GuarantorDetails
                    key={index}
                    customerId={fieldData.customerId}
                    customerBranch={fieldData.customerBranch}
                    guarantors={fieldData.guarantors}
                    isBlocked={fieldData.isBlocked}
                    getIscore={fieldData.getIscore}
                    iscores={fieldData.iscores}
                    limitStatus={fieldData.limitStatus}
                  />
                )
              )
            })}
          {activeTab === 'cfEntitledToSign' &&
            tabsData[activeTab].map((field, index) => {
              const fieldData = field.fieldData as CFEntitledToSignDetailsProps
              return (
                Object.keys(fieldData).length > 0 && (
                  <EntitledToSignDetails
                    key={index}
                    customerId={fieldData.customerId}
                    customerBranch={fieldData.customerBranch}
                    entitledToSignCustomers={fieldData.entitledToSignCustomers}
                    isBlocked={fieldData.isBlocked}
                    getIscore={fieldData.getIscore}
                    iscores={fieldData.iscores}
                    limitStatus={fieldData.limitStatus}
                  />
                )
              )
            })}
          {activeTab === 'otpCustomers' &&
            tabsData[activeTab].map((field, index) => {
              const fieldData = field.fieldData as {
                reload: () => void
              } & CompanyOtpCustomersProps
              return (
                <CompanyOtpPhoneNumbers
                  key={index}
                  customerId={fieldData.customerId}
                  otpCustomers={fieldData.otpCustomers}
                  reload={fieldData.reload}
                />
              )
            })}
        </Card.Body>
      </Card>
    </>
  )
}

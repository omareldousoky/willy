import React from 'react'

// Components
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import { Loader } from '../Loader'
import BackButton from '../BackButton/back-button'
import { CardNavBar } from '../HeaderWithCards/cardNavbar'

import { CustomerCategorization } from '../Customer/customerCategorization'
import { ProfileActions } from '../ProfileActions'
import { ProfileProps, TabDataProps } from './types'
import {
  CustomerReportsTab,
  DeathCertificate,
  DocumentsUpload,
  GuarantorDetails,
} from '../Customer'
import {
  CFEntitledToSignDetailsProps,
  CFGuarantorDetailsProps,
  OtpCustomersProps,
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
  const renderTab = (currentTab: keyof TabDataProps) => {
    switch (currentTab) {
      case 'mainInfo':
      case 'workInfo':
      case 'differentInfo':
        return (
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
                      <td style={field.fieldDataStyle ?? field.fieldDataStyle}>
                        {fieldData}
                      </td>
                    </tr>
                  )
                )
              })}
            </tbody>
          </Table>
        )
      case 'customerScore':
        return tabsData[activeTab].map((field, index) => {
          const { fieldData, showFieldCondition } = field
          return (
            Array.isArray(fieldData) &&
            showFieldCondition && (
              <CustomerCategorization key={index} ratings={fieldData} />
            )
          )
        })
      case 'documents':
        return tabsData[activeTab].map((field, index) => {
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
        })
      case 'reports':
        return (
          activeTab === 'reports' &&
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
          })
        )

      case 'deathCertificate':
        return tabsData[activeTab].map((field, index) => {
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
        })
      case 'cfGuarantors':
        return tabsData[activeTab].map((field, index) => {
          const fieldData = field.fieldData as CFGuarantorDetailsProps
          return (
            Object.keys(fieldData).length > 0 && (
              <GuarantorDetails key={index} {...fieldData} />
            )
          )
        })
      case 'cfEntitledToSign':
        return tabsData[activeTab].map((field, index) => {
          const fieldData = field.fieldData as CFEntitledToSignDetailsProps
          return (
            Object.keys(fieldData).length > 0 && (
              <EntitledToSignDetails key={index} {...fieldData} />
            )
          )
        })
      case 'otpCustomers':
        return tabsData[activeTab].map((field, index) => {
          const fieldData = field.fieldData as {
            reload: () => void
          } & OtpCustomersProps
          return <CompanyOtpPhoneNumbers key={index} {...fieldData} />
        })
      default:
        return tabsData[activeTab].map((field, index) => {
          const { fieldData } = field
          return (
            Object.keys(fieldData).length > 0 && (
              <div key={index}>{fieldData}</div>
            )
          )
        })
    }
  }
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
      <Card className="mt-3 print-none">
        <CardNavBar
          array={tabs}
          active={activeTab}
          selectTab={(stringKey) => setActiveTab(stringKey)}
        />
        <Card.Body>{renderTab(activeTab)}</Card.Body>
      </Card>
    </>
  )
}

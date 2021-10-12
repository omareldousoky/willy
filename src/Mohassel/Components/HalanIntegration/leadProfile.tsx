import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'
import {
  CardNavBar,
  Tab,
} from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import { Lead } from '../../../Shared/Models/common'

const tabs: Array<Tab> = [
  {
    header: local.mainInfo,
    stringKey: 'mainInfo',
  },
  {
    header: local.workInfo,
    stringKey: 'workInfo',
  },
]
const LeadProfile = (
  props: RouteComponentProps<{}, {}, { leadDetails: Lead }>
) => {
  const [activeTab, changeActiveTab] = useState('mainInfo')
  const { leadDetails } = props.location.state
  function getPeriod(maxDate: number) {
    if (maxDate < 6) {
      return `${local.lessThan} 6 ${local.months}`
    }
    if (maxDate > 12) {
      return `${local.moreThan} 1 ${local.year}`
    }
    return `${local.from} ${leadDetails.minBusinessDate} ${local.to} ${leadDetails.maxBusinessDate} ${local.months}`
  }
  function getSector(businessSector) {
    switch (businessSector) {
      case '1':
        return local.industrialProjects
      case '2':
        return local.commercialProjects
      case '3':
        return local.agriculturalProjects
      case '4':
        return local.serviceProjects
      default:
        return ''
    }
  }
  return (
    <>
      <div className="rowContainer print-none" style={{ paddingLeft: 30 }}>
        <BackButton title={local.viewCustomerLead} className="print-none" />
      </div>
      <Card style={{ marginTop: 10 }} className="print-none">
        <CardNavBar
          array={tabs}
          active={activeTab}
          selectTab={(stringKey: string) => changeActiveTab(stringKey)}
        />
        <Card.Body>
          {activeTab === 'mainInfo' && (
            <Table
              striped
              bordered
              style={{ textAlign: 'right' }}
              className="horizontal-table"
            >
              <tbody>
                <tr>
                  <td>{local.name}</td>
                  <td>{leadDetails.customerName}</td>
                </tr>
                <tr>
                  <td>{local.age}</td>
                  <td>{`${local.from} ${
                    leadDetails.minAge ? leadDetails.minAge : 1
                  } ${local.to} ${leadDetails.maxAge} ${local.year}`}</td>
                </tr>
                <tr>
                  <td>{local.mobilePhoneNumber}</td>
                  <td>{leadDetails.phoneNumber}</td>
                </tr>
                <tr>
                  <td>{local.nationalId}</td>
                  <td>{leadDetails.customerNationalId}</td>
                </tr>
                <tr>
                  <td>{local.creationDate}</td>
                  <td>
                    {leadDetails.createdAt
                      ? timeToDateyyymmdd(leadDetails.createdAt)
                      : ''}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
          {activeTab === 'workInfo' && (
            <Table
              striped
              bordered
              style={{ textAlign: 'right' }}
              className="horizontal-table"
            >
              <tbody>
                <tr>
                  <td>{local.businessSector}</td>
                  <td>{getSector(leadDetails.businessSector)}</td>
                </tr>
                <tr>
                  <td>{local.activityPeriod}</td>
                  <td>
                    {leadDetails.maxBusinessDate
                      ? getPeriod(leadDetails.maxBusinessDate)
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td>{local.businessAddress}</td>
                  <td>{`${
                    leadDetails.businessStreet ? leadDetails.businessStreet : ''
                  }, ${leadDetails.businessArea}, ${
                    leadDetails.businessCity
                  }, ${leadDetails.businessGovernate}`}</td>
                </tr>
                <tr>
                  <td>{local.addressDescription}</td>
                  <td>{leadDetails.businessAddressDescription}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default withRouter(LeadProfile)

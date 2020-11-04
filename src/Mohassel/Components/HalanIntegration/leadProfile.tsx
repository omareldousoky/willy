import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { timeToDateyyymmdd } from '../../Services/utils';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import BackButton from '../BackButton/back-button';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
  history: {
    location: {
      state: {
        leadDetails: any;
      };
    };
  };
};
const tabs: Array<Tab> = [
  {
    header: local.mainInfo,
    stringKey: 'mainInfo'
  },
  {
    header: local.workInfo,
    stringKey: 'workInfo'
  },
]
const LeadProfile = (props: Props) => {
  const [activeTab, changeActiveTab] = useState('mainInfo');
  const leadDetails = props.history.location.state.leadDetails;
  return (
    <>
      <div className="rowContainer print-none" style={{ paddingLeft: 30 }}>
        <BackButton title={local.viewCustomer} className="print-none" />
      </div>
      <Card style={{ marginTop: 10 }} className="print-none">
        <CardNavBar
          header={'here'}
          array={tabs}
          active={activeTab}
          selectTab={(stringKey: string) => changeActiveTab(stringKey)}
        />
        <Card.Body>
          {activeTab === 'mainInfo' && <Table striped bordered style={{ textAlign: 'right' }} className="horizontal-table">
            <tbody>
              <tr>
                <td>{local.name}</td>
                <td>{leadDetails.customerName}</td>
              </tr>
              <tr>
                <td>{local.customerType}</td>
                <td>{}</td>
              </tr>
              <tr>
                <td>{local.age}</td>
                <td>{`${local.from} ${leadDetails.minAge} ${local.to} ${leadDetails.maxAge} سنة` }</td>
              </tr>
              <tr>
                <td>{local.mobilePhoneNumber}</td>
                <td>{leadDetails.phoneNumber}</td>
              </tr>
              <tr>
                <td>{local.nationalId}</td>
                <td>{leadDetails.nationalId}</td>
              </tr>
              <tr>
                <td>{local.creationDate}</td>
                <td>{timeToDateyyymmdd(leadDetails.createdAt)}</td>
              </tr>
            </tbody>
          </Table>}
          {activeTab === 'workInfo' && <Table striped bordered style={{ textAlign: 'right' }} className="horizontal-table">
            <tbody>
              <tr>
                <td>{local.businessSector}</td>
                <td>{leadDetails.businessSector}</td>
              </tr>
              <tr>
                <td>{local.activityPeriod}</td>
                <td>{`${local.from} ${leadDetails.minBusinessDate} ${local.to} ${leadDetails.maxBusinessDate} ${local.months}` }</td>
              </tr>
              <tr>
                <td>{local.businessName}</td>
                <td>{leadDetails.businessName}</td>
              </tr>
              <tr>
                <td>{local.businessAddress}</td>
                <td>{`${leadDetails.businessAddress}, ${leadDetails.businessArea}, ${leadDetails.businessCity}, ${leadDetails.businessGovernate}`}</td>
              </tr>
              <tr>
                <td>{local.addressDescription}</td>
                <td>{leadDetails.businessAddressDescription}</td>
              </tr>
            </tbody>
          </Table>}
        </Card.Body>
      </Card>
    </>
  )
}

export default withRouter(LeadProfile);
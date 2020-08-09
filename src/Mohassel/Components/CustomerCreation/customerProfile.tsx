import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Customer } from '../../Services/interfaces';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { timeToDateyyymmdd } from '../../Services/utils';
import { Loader } from '../../../Shared/Components/Loader';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import BackButton from '../BackButton/back-button';
import * as local from '../../../Shared/Assets/ar.json';
import DocumentsUpload from './documentsUpload';

interface Props {
  history: Array<string | { id: string }>;
  location: {
    state: {
      id: string;
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
  {
    header: local.differentInfo,
    stringKey: 'differentInfo'
  },
  {
    header: local.documents,
    stringKey: 'documents'
  }
]
const CustomerProfile = (props: Props) => {
  const [loading, changeLoading] = useState(false);
  const [customerDetails, changeCustomerDetails] = useState<Customer>();
  const [activeTab, changeActiveTab] = useState('mainInfo');

  async function getCustomerDetails() {
    changeLoading(true);
    const res = await getCustomerByID(props.location.state.id)
    if (res.status === 'success') {
      changeCustomerDetails(res.body);
      changeLoading(false);
    } else {
      changeLoading(false);
      console.log("failed to get customer data")
    }
  }

  useEffect(() => {
    getCustomerDetails();
  }, []);
  function getArGender(gender: string | undefined) {
    if (gender === 'male') return local.male;
    else return local.female;
  }
  function getArRuralUrban(ruralUrban: string | undefined) {
    if (ruralUrban === 'rural') return local.rural;
    else return local.urban;
  }
  return (
    <>
      <Loader open={loading} type="fullscreen" />
      <div className="rowContainer" style={{ paddingLeft: 30 }}>
        <BackButton title={local.viewCustomer} />
        <div style={{cursor: 'pointer'}} onClick={() => { props.history.push("/customers/edit-customer", { id: props.location.state.id }) }}>
          <img className={'iconImage'} alt={"edit"} src={require('../../Assets/editIcon.svg')} />
          {local.edit}</div>
      </div>
      <Card style={{ marginTop: 10 }}>
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
              <td>{local.customerName}</td>
              <td>{customerDetails?.customerName}</td>
            </tr>
            <tr>
              <td>{local.customerCode}</td>
              <td>{customerDetails?.code}</td>
            </tr>
            <tr>
              <td>{local.creationDate}</td>
              <td>{customerDetails?.created?.at ? timeToDateyyymmdd(customerDetails.created.at) : ''}</td>
            </tr>
            <tr>
              <td>{local.nationalId}</td>
              <td>{customerDetails?.nationalId}</td>
            </tr>
            <tr>
              <td>{local.birthDate}</td>
              <td>{customerDetails?.birthDate ? timeToDateyyymmdd(customerDetails.birthDate) : ''}</td>
            </tr>
            <tr>
              <td>{local.gender}</td>
              <td>{getArGender(customerDetails?.gender)}</td>
            </tr>
            <tr>
              <td>{local.customerHomeAddress}</td>
              <td>{customerDetails?.customerHomeAddress}</td>
            </tr>
            <tr>
              <td>{local.postalCode}</td>
              <td>{customerDetails?.homePostalCode}</td>
            </tr>
            <tr>
              <td>{local.homePhoneNumber}</td>
              <td>{customerDetails?.homePhoneNumber}</td>
            </tr>
            <tr>
              <td>{local.faxNumber}</td>
              <td>{customerDetails?.faxNumber}</td>
            </tr>
            <tr>
              <td>{local.mobilePhoneNumber}</td>
              <td>{customerDetails?.mobilePhoneNumber}</td>
            </tr>
          </tbody>
        </Table>}
        {activeTab === 'workInfo' && <Table striped bordered style={{ textAlign: 'right' }} className="horizontal-table">
          <tbody>
            <tr>
              <td>{local.businessName}</td>
              <td>{customerDetails?.businessName}</td>
            </tr>
            <tr>
              <td>{local.businessAddress}</td>
              <td>{customerDetails?.businessAddress}</td>
            </tr>
            <tr>
              <td>{local.governorate}</td>
              <td>{customerDetails?.governorate}</td>
            </tr>
            <tr>
              <td>{local.district}</td>
              <td>{customerDetails?.district}</td>
            </tr>
            <tr>
              <td>{local.village}</td>
              <td>{customerDetails?.village}</td>
            </tr>
            <tr>
              <td>{local.ruralUrban}</td>
              <td>{getArRuralUrban(customerDetails?.ruralUrban)}</td>
            </tr>
            <tr>
              <td>{local.businessPhoneNumber}</td>
              <td>{customerDetails?.businessPhoneNumber}</td>
            </tr>
            <tr>
              <td>{local.businessPostalCode}</td>
              <td>{customerDetails?.businessPostalCode}</td>
            </tr>
            <tr>
              <td>{local.businessSector}</td>
              <td>{customerDetails?.businessSector}</td>
            </tr>
            <tr>
              <td>{local.businessActivity}</td>
              <td>{customerDetails?.businessActivity}</td>
            </tr>
            <tr>
              <td>{local.businessSpeciality}</td>
              <td>{customerDetails?.businessSpeciality}</td>
            </tr>
            <tr>
              <td>{local.businessLicenseNumber}</td>
              <td>{customerDetails?.businessLicenseNumber}</td>
            </tr>
            <tr>
              <td>{local.businessLicenseIssuePlace}</td>
              <td>{customerDetails?.businessLicenseIssuePlace}</td>
            </tr>
            <tr>
              <td>{local.businessLicenseIssueDate}</td>
              <td>{customerDetails?.businessLicenseIssueDate ? timeToDateyyymmdd(customerDetails.businessLicenseIssueDate) : ''}</td>
            </tr>
            <tr>
              <td>{local.commercialRegisterNumber}</td>
              <td>{customerDetails?.commercialRegisterNumber}</td>
            </tr>
            <tr>
              <td>{local.industryRegisterNumber}</td>
              <td>{customerDetails?.industryRegisterNumber}</td>
            </tr>
            <tr>
              <td>{local.taxCardNumber}</td>
              <td>{customerDetails?.taxCardNumber}</td>
            </tr>
          </tbody>
        </Table>}
        {activeTab === 'differentInfo' && <Table striped bordered style={{ textAlign: 'right' }} className="horizontal-table">
          <tbody>
            <tr>
              <td>{local.geographicalDistribution}</td>
              <td>{customerDetails?.geographicalDistribution}</td>
            </tr>
            <tr>
              <td>{local.representative}</td>
              <td>{customerDetails?.representativeName}</td>
            </tr>
            <tr>
              <td>{local.applicationDate}</td>
              <td>{customerDetails?.applicationDate ? timeToDateyyymmdd(customerDetails.applicationDate) : ''}</td>
            </tr>
            <tr>
              <td>{local.permanentEmployeeCount}</td>
              <td>{customerDetails?.permanentEmployeeCount}</td>
            </tr>
            <tr>
              <td>{local.partTimeEmployeeCount}</td>
              <td>{customerDetails?.partTimeEmployeeCount}</td>
            </tr>
            <tr>
              <td>{local.allowMultiLoans}</td>
              <td>{customerDetails?.allowMultiLoans ? <span className="fa fa-check"></span> : <span className="fa fa-times"></span>}</td>
            </tr>
            <tr>
              <td>{local.allowGuarantorLoan}</td>
              <td>{customerDetails?.allowGuarantorLoan ? <span className="fa fa-check"></span> : <span className="fa fa-times"></span>}</td>
            </tr>
            <tr>
              <td>{local.guarantorMaxLoans}</td>
              <td>{customerDetails.guarantorMaxLoans? customerDetails.guarantorMaxLoans : "-"}</td>
            </tr>
            <tr>
              <td>{local.comments}</td>
              <td>{customerDetails?.comments}</td>
            </tr>
          </tbody>
        </Table>}
        {activeTab === 'documents' &&
        <DocumentsUpload
        customerId = {props.location.state.id}
        edit={false}
        view={true}
         />
        }
        </Card.Body>
      </Card>
    </>
  )
}

export default withRouter(CustomerProfile);
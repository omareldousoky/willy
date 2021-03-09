import React, { useState, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import { Customer, GuaranteedLoans } from '../../../Shared/Services/interfaces'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer'
import {
  timeToDateyyymmdd,
  downloadFile,
  iscoreStatusColor,
  getErrorMessage,
  iscoreBank,
} from '../../../Shared/Services/utils'
import { Loader } from '../../../Shared/Components/Loader'
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import BackButton from '../BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import DocumentsUpload from './documentsUpload'
import { getIscoreCached } from '../../Services/APIs/iScore/iScore'
import { guaranteed } from '../../Services/APIs/Reports'
import { CustomerReportsTab } from './customerReportsTab'
import ClientGuaranteedLoans from '../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans'
import ability from '../../config/ability'
import { getGeoAreasByBranch } from '../../Services/APIs/GeoAreas/getGeoAreas'
import DeathCertificate from './deathCertificate'
import Can from '../../config/Can'
import { CustomerCategorization } from './customerCategorization'
import {
  CustomerScore,
  getCustomerCategorization,
} from '../../Services/APIs/Customer-Creation/customerCategorization'

export interface Score {
  customerName?: string
  activeLoans?: string
  iscore: string
  nationalId: string
  url?: string
  bankCodes?: string[]
}
const tabs: Array<Tab> = [
  {
    header: local.mainInfo,
    stringKey: 'mainInfo',
  },
  {
    header: local.workInfo,
    stringKey: 'workInfo',
  },
  {
    header: local.differentInfo,
    stringKey: 'differentInfo',
  },
  {
    header: local.customerCategorization,
    stringKey: 'customerScore',
  },
  {
    header: local.documents,
    stringKey: 'documents',
  },
]

const getCustomerCategorizationRating = async (
  id: string,
  setRating: (rating: Array<CustomerScore>) => void
) => {
  const res = await getCustomerCategorization({ customerId: id })
  if (res.status === 'success' && res.body?.customerScores !== undefined) {
    setRating(res.body?.customerScores)
  } else {
    Swal.fire(
      'Error !',
      getErrorMessage(res.error ? res.error.error : ''),
      'error'
    )
  }
}

const CustomerProfile = (
  props: RouteComponentProps<{}, {}, { id: string }>
) => {
  const [loading, changeLoading] = useState(false)
  const [customerDetails, changeCustomerDetails] = useState<Customer>()
  const [iScoreDetails, changeiScoreDetails] = useState<Score>()
  const [activeTab, changeActiveTab] = useState('mainInfo')
  const [ratings, setRatings] = useState<Array<CustomerScore>>([])

  async function getCachediScores(id) {
    changeLoading(true)
    const iScores = await getIscoreCached({ nationalIds: [id] })
    if (iScores.status === 'success') {
      changeiScoreDetails(iScores.body.data[0])
      changeLoading(false)
    } else {
      changeLoading(false)
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    }
  }
  const [print, _changePrint] = useState<any>()
  const [dataToBePrinted, changeDataToBePrinted] = useState<any>()
  const [
    guaranteeedLoansData,
    changeGuaranteeedLoansData,
  ] = useState<GuaranteedLoans>()
  const [geoArea, setgeoArea] = useState<any>()
  const getGuaranteeedLoans = async (customer) => {
    changeLoading(true)
    const res = await guaranteed(customer?.key)
    if (res.status === 'success') {
      await changeGuaranteeedLoansData(res.body)
      changeLoading(false)
    } else {
      changeLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  const getGeoArea = async (geoAreaId, branch) => {
    changeLoading(true)
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      changeLoading(false)
      const geoAreaObject = resGeo.body.data.filter(
        (area) => area._id === geoAreaId
      )
      if (geoAreaObject.length === 1) {
        setgeoArea(geoAreaObject[0])
      } else setgeoArea({ name: '-', active: false })
    } else {
      changeLoading(false)
      Swal.fire('Error !', getErrorMessage(resGeo.error.error), 'error')
    }
  }
  async function getCustomerDetails() {
    changeLoading(true)
    const res = await getCustomerByID(props.location.state.id)
    if (res.status === 'success') {
      await changeCustomerDetails(res.body)
      if (ability.can('viewIscore', 'customer'))
        await getCachediScores(res.body.nationalId)
      await getGuaranteeedLoans(res.body)
      await getGeoArea(res.body.geoAreaId, res.body.branchId)
    } else {
      changeLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  useEffect(() => {
    getCustomerDetails()
    if (ability.can('deathCertificate', 'customer')) {
      // eslint-disable-next-line no-empty
      if (tabs.some((tab) => tab.stringKey === 'deathCertificate')) {
      } else {
        tabs.push({
          header: local.deathCertificate,
          stringKey: 'deathCertificate',
        })
      }
    }
    if (ability.can('guaranteed', 'report')) {
      // eslint-disable-next-line no-empty
      if (tabs.some((tab) => tab.stringKey === 'reports')) {
      } else {
        tabs.push({
          header: local.reports,
          stringKey: 'reports',
        })
      }
    }
    getCustomerCategorizationRating(props.location.state.id, setRatings)
  }, [])
  function getArGender(gender: string | undefined) {
    if (gender === 'male') return local.male
    return local.female
  }
  function getArRuralUrban(ruralUrban: string | undefined) {
    if (ruralUrban === 'rural') return local.rural
    return local.urban
  }
  return (
    <>
      <Loader open={loading} type="fullscreen" />
      <div className="rowContainer print-none" style={{ paddingLeft: 30 }}>
        <BackButton title={local.viewCustomer} className="print-none" />
        {(ability.can('updateCustomer', 'customer') ||
          ability.can('updateNationalId', 'customer')) && (
          <div
            className="print-none"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              props.history.push('/customers/edit-customer', {
                id: props.location.state.id,
              })
            }}
          >
            <img
              className="iconImage"
              alt="edit"
              src={require('../../Assets/editIcon.svg')}
            />
            {local.edit}
          </div>
        )}
      </div>
      <Card style={{ marginTop: 10 }} className="print-none">
        <CardNavBar
          header="here"
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
                  <td>{local.customerName}</td>
                  <td>{customerDetails?.customerName}</td>
                </tr>
                <tr>
                  <td>{local.branchName}</td>
                  <td>{customerDetails?.branchName}</td>
                </tr>
                {ability.can('viewIscore', 'customer') && (
                  <tr>
                    <td>iScore</td>
                    <td>
                      <span
                        style={{
                          color: iscoreStatusColor(iScoreDetails?.iscore).color,
                        }}
                      >
                        {iScoreDetails?.iscore}
                      </span>
                      <span style={{ margin: '0px 10px' }}>
                        {iscoreStatusColor(iScoreDetails?.iscore).status}
                      </span>
                      {iScoreDetails?.bankCodes &&
                        iScoreDetails.bankCodes.map(
                          (code) => `${iscoreBank(code)} `
                        )}
                      {iScoreDetails?.url && (
                        <span
                          style={{ cursor: 'pointer', padding: 10 }}
                          onClick={() => downloadFile(iScoreDetails?.url)}
                        >
                          {' '}
                          <span
                            className="fa fa-file-pdf-o"
                            style={{ margin: '0px 0px 0px 5px' }}
                          />
                          iScore
                        </span>
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>{local.customerCode}</td>
                  <td>{customerDetails?.code}</td>
                </tr>
                <tr>
                  <td>{local.creationDate}</td>
                  <td>
                    {customerDetails?.created?.at
                      ? timeToDateyyymmdd(customerDetails.created.at)
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td>{local.nationalId}</td>
                  <td>{customerDetails?.nationalId}</td>
                </tr>
                <tr>
                  <td>{local.birthDate}</td>
                  <td>
                    {customerDetails?.birthDate !== undefined
                      ? timeToDateyyymmdd(customerDetails.birthDate)
                      : ''}
                  </td>
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
                  <td>
                    {customerDetails?.businessLicenseIssueDate
                      ? timeToDateyyymmdd(
                          customerDetails.businessLicenseIssueDate
                        )
                      : ''}
                  </td>
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
            </Table>
          )}
          {activeTab === 'differentInfo' && (
            <Table
              striped
              bordered
              style={{ textAlign: 'right' }}
              className="horizontal-table"
            >
              <tbody>
                <tr>
                  <td>{local.geographicalDistribution}</td>
                  <td
                    style={{
                      color:
                        !geoArea.active && geoArea.name !== '-'
                          ? 'red'
                          : 'black',
                    }}
                  >
                    {geoArea.name}
                  </td>
                </tr>
                <tr>
                  <td>{local.representative}</td>
                  <td>{customerDetails?.representativeName}</td>
                </tr>
                <tr>
                  <td>{local.applicationDate}</td>
                  <td>
                    {customerDetails?.applicationDate
                      ? timeToDateyyymmdd(customerDetails.applicationDate)
                      : ''}
                  </td>
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
                  <td>{local.maxLoansAllowed}</td>
                  <td>
                    {customerDetails?.maxLoansAllowed
                      ? customerDetails.maxLoansAllowed
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td>{local.allowGuarantorLoan}</td>
                  <td>
                    {customerDetails?.allowGuarantorLoan ? (
                      <span className="fa fa-check" />
                    ) : (
                      <span className="fa fa-times" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{local.guarantorMaxLoans}</td>
                  <td>
                    {customerDetails?.guarantorMaxLoans
                      ? customerDetails.guarantorMaxLoans
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td>{local.maxCustomerPrincipal}</td>
                  <td>
                    {customerDetails?.maxPrincipal
                      ? customerDetails.maxPrincipal
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td>{local.comments}</td>
                  <td>{customerDetails?.comments}</td>
                </tr>
                {customerDetails?.blocked &&
                  customerDetails?.blocked?.isBlocked && (
                    <tr>
                      <td>{local.blockReason}</td>
                      <td>{customerDetails.blocked.reason || ''}</td>
                    </tr>
                  )}
                {customerDetails?.blocked &&
                  !customerDetails?.blocked?.isBlocked &&
                  customerDetails?.blocked?.reason && (
                    <tr>
                      <td>{local.unblockReason}</td>
                      <td>{customerDetails.blocked.reason || ''}</td>
                    </tr>
                  )}
              </tbody>
            </Table>
          )}
          {activeTab === 'customerScore' && customerDetails?.hasLoan && (
            <Can I="customerCategorization" a="customer">
              <CustomerCategorization ratings={ratings} />
            </Can>
          )}
          {activeTab === 'documents' && (
            <DocumentsUpload
              customerId={props.location.state.id}
              edit={false}
              view
            />
          )}
          {activeTab === 'reports' && (
            <CustomerReportsTab
              changePrint={async (pdf) => {
                await changeDataToBePrinted(pdf.data)
                await _changePrint(pdf.key)
                window.print()
              }}
              PDFsArray={[
                {
                  key: 'ClientGuaranteedLoans',
                  local: local.ClientGuaranteedLoans,
                  //   inputs: ["dateFromTo", "branches"],
                  data: guaranteeedLoansData,
                  permission: 'guaranteed',
                },
              ]}
            />
          )}
          {activeTab === 'deathCertificate' && (
            <Can I="deathCertificate" a="customer">
              <DeathCertificate
                edit
                view={false}
                customerId={props.location.state.id}
              />
            </Can>
          )}
        </Card.Body>
      </Card>
      {print === 'ClientGuaranteedLoans' && dataToBePrinted && (
        <ClientGuaranteedLoans data={dataToBePrinted} />
      )}
    </>
  )
}

export default withRouter(CustomerProfile)

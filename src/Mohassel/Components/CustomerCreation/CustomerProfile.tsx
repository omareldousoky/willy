import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from 'react-bootstrap/Container'
import { getErrorMessage, iscoreDate } from '../../../Shared/Services/utils'
import { Tab } from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Profile, InfoBox, ProfileActions } from '../../../Shared/Components'
import { TabDataProps } from '../../../Shared/Components/Profile/types'
import HalanLinkageModal from './HalanLinkageModal'
import { getCustomerInfo } from '../../../Shared/Services/formatCustomersInfo'
import LoanLimitModal from './LoanLimitModal'
import {
  CustomerScore,
  getCustomerCategorization,
} from '../../../Shared/Services/APIs/customer/customerCategorization'
import { getCustomerByID } from '../../../Shared/Services/APIs/customer/getCustomer'
import { getGeoAreasByBranch } from '../../../Shared/Services/APIs/geoAreas/getGeoAreas'
import {
  getIscore,
  getIscoreCached,
} from '../../../Shared/Services/APIs/iScore'
import { blockCustomer } from '../../../Shared/Services/APIs/customer/blockCustomer'
import { Score, Customer } from '../../../Shared/Models/Customer'

interface LocationState {
  id: string
}
const tabs: Array<Tab> = [
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
  {
    header: local.deathCertificate,
    stringKey: 'deathCertificate',
    permission: 'deathCertificate',
    permissionKey: 'customer',
  },
  {
    header: local.reports,
    stringKey: 'reports',
    permission: 'guaranteed',
    permissionKey: 'report',
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
    setRating([])
  }
}

export const CustomerProfile = () => {
  const [loading, setLoading] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<Customer>()
  const [iScoreDetails, setIScoreDetails] = useState<Score>()
  const [activeTab, setActiveTab] = useState('workInfo')
  const [ratings, setRatings] = useState<Array<CustomerScore>>([])
  const [showHalanLinkageModal, setShowHalanLinkageModal] = useState<boolean>(
    false
  )
  const [showLoanLimitModal, setShowLoanLimitModal] = useState(false)
  const location = useLocation<LocationState>()
  const history = useHistory()

  async function getCachediScores(id) {
    setLoading(true)
    const iScores = await getIscoreCached({ nationalIds: [id] })
    if (iScores.status === 'success') {
      setIScoreDetails(iScores.body.data[0])
      setLoading(false)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    }
  }
  const [geoArea, setGeoArea] = useState<any>()
  const getGeoArea = async (geoAreaId, branch) => {
    setLoading(true)
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      setLoading(false)
      const geoAreaObject = resGeo.body.data.filter(
        (area) => area._id === geoAreaId
      )
      if (geoAreaObject.length === 1) {
        setGeoArea(geoAreaObject[0])
      } else setGeoArea({ name: '-', active: false })
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(resGeo.error.error), 'error')
    }
  }
  async function getCustomerDetails() {
    setLoading(true)
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      await setCustomerDetails(res.body)
      if (ability.can('viewIscore', 'customer'))
        await getCachediScores(res.body.nationalId)
      await getGeoArea(res.body.geoAreaId, res.body.branchId)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  useEffect(() => {
    getCustomerDetails()
    getCustomerCategorizationRating(location.state.id, setRatings)
  }, [])
  function getArRuralUrban(ruralUrban: string | undefined) {
    if (ruralUrban === 'rural') return local.rural
    return local.urban
  }
  const handleActivationClick = async ({ id, blocked }) => {
    const { value: text } = await Swal.fire({
      title:
        blocked?.isBlocked === true ? local.unblockReason : local.blockReason,
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        blocked?.isBlocked === true
          ? local.unblockCustomer
          : local.blockCustomer,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required
        }
        return ''
      },
    })
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        text:
          blocked?.isBlocked === true
            ? local.customerWillBeUnblocked
            : local.customerWillBeBlocked,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:
          blocked?.isBlocked === true
            ? local.unblockCustomer
            : local.blockCustomer,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          setLoading(true)
          const res = await blockCustomer(id, {
            toBeBlocked: blocked?.isBlocked !== true,
            reason: text,
          })
          if (res.status === 'success') {
            setLoading(false)
            Swal.fire(
              '',
              blocked?.isBlocked === true
                ? local.customerUnblockedSuccessfully
                : local.customerBlockedSuccessfully,
              'success'
            ).then(() => window.location.reload())
          } else {
            setLoading(false)
            Swal.fire('', local.searchError, 'error')
          }
        }
      })
    }
  }
  const getCustomerIscore = async (data) => {
    setLoading(true)
    const obj = {
      requestNumber: '148',
      reportId: '3004',
      product: '023',
      loanAccountNumber: `${data.key}`,
      number: '1703943',
      date: '02/12/2014',
      amount: `${1000}`, // TODO
      lastName: `${data.customerName}`,
      idSource: '003',
      idValue: `${data.nationalId}`,
      gender: data.gender === 'male' ? '001' : '002',
      dateOfBirth: iscoreDate(data.birthDate),
    }
    const iScore = await getIscore(obj)
    if (iScore.status === 'success') {
      getCachediScores(data.nationalId)
      setLoading(false)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(iScore.error.error), 'error')
    }
  }
  const mainInfo = customerDetails && [
    getCustomerInfo({
      customerDetails,
      getIscore: (data) => getCustomerIscore(data),
      score: iScoreDetails,
      applicationStatus: 'reviewed',
      isLeader: false,
    }),
  ]

  const tabsData: TabDataProps = {
    workInfo: [
      {
        fieldTitle: local.businessName,
        fieldData: customerDetails?.businessName || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessAddress,
        fieldData: customerDetails?.businessAddress || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.customerCode,
        fieldData: customerDetails?.code || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.governorate,
        fieldData: customerDetails?.governorate || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.district,
        fieldData: customerDetails?.district || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.village,
        fieldData: customerDetails?.village || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.ruralUrban,
        fieldData: getArRuralUrban(customerDetails?.ruralUrban) || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessPhoneNumber,
        fieldData: customerDetails?.businessPhoneNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessPostalCode,
        fieldData: customerDetails?.businessPostalCode || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessSector,
        fieldData: customerDetails?.businessSector || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessActivity,
        fieldData: customerDetails?.businessActivity || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessSpeciality,
        fieldData: customerDetails?.businessSpeciality || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseNumber,
        fieldData: customerDetails?.businessLicenseNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssuePlace,
        fieldData: customerDetails?.businessLicenseIssuePlace || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssueDate,
        fieldData: customerDetails?.businessLicenseIssueDate || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.commercialRegisterNumber,
        fieldData: customerDetails?.commercialRegisterNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.industryRegisterNumber,
        fieldData: customerDetails?.industryRegisterNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.taxCardNumber,
        fieldData: customerDetails?.taxCardNumber || '',
        showFieldCondition: true,
      },
    ],
    differentInfo: [
      {
        fieldTitle: local.geographicalDistribution,
        fieldData: geoArea?.name,
        fieldDataStyle: {
          color: !geoArea?.active && geoArea?.name !== '-' ? 'red' : 'black',
        },
        showFieldCondition: true,
      },
      {
        fieldTitle: local.representative,
        fieldData: customerDetails?.representativeName || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.applicationDate,
        fieldData: customerDetails?.applicationDate || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.permanentEmployeeCount,
        fieldData: customerDetails?.permanentEmployeeCount || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.partTimeEmployeeCount,
        fieldData: customerDetails?.partTimeEmployeeCount || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.maxLoansAllowed,
        fieldData: customerDetails?.maxLoansAllowed
          ? customerDetails.maxLoansAllowed
          : '-',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.allowGuarantorLoan,
        fieldData: customerDetails?.allowGuarantorLoan ? (
          <span className="fa fa-check" />
        ) : (
          <span className="fa fa-times" />
        ),
        showFieldCondition: true,
      },
      {
        fieldTitle: local.guarantorMaxLoans,
        fieldData: customerDetails?.guarantorMaxLoans
          ? customerDetails.guarantorMaxLoans
          : '-',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.maxCustomerPrincipal,
        fieldData: customerDetails?.maxPrincipal
          ? customerDetails.maxPrincipal
          : '-',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.comments,
        fieldData: customerDetails?.comments || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.blockReason,
        fieldData: customerDetails?.blocked?.reason || '',
        showFieldCondition: Boolean(
          customerDetails?.blocked && customerDetails?.blocked?.isBlocked
        ),
      },
      {
        fieldTitle: local.unblockReason,
        fieldData: customerDetails?.blocked?.reason || '',
        showFieldCondition: Boolean(
          customerDetails?.blocked &&
            !customerDetails?.blocked?.isBlocked &&
            customerDetails?.blocked?.reason
        ),
      },
      {
        fieldTitle: local.businessLicenseNumber,
        fieldData: customerDetails?.businessLicenseNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssuePlace,
        fieldData: customerDetails?.businessLicenseIssuePlace || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssueDate,
        fieldData: customerDetails?.businessLicenseIssueDate || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.commercialRegisterNumber,
        fieldData: customerDetails?.commercialRegisterNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.industryRegisterNumber,
        fieldData: customerDetails?.industryRegisterNumber || '',
        showFieldCondition: true,
      },
      {
        fieldTitle: local.taxCardNumber,
        fieldData: customerDetails?.taxCardNumber || '',
        showFieldCondition: true,
      },
    ],
    customerScore: [
      {
        fieldTitle: 'ratings',
        fieldData: ratings,
        showFieldCondition: Boolean(
          ability.can('customerCategorization', 'customer')
        ),
      },
    ],
    documents: [
      {
        fieldTitle: 'customer id',
        fieldData: location.state.id,
        showFieldCondition: true,
      },
    ],
    reports: [
      {
        fieldTitle: 'reports',
        fieldData: customerDetails?.key?.toString() || '',
        showFieldCondition: ability.can('guaranteed', 'report'),
      },
    ],
    deathCertificate: [
      {
        fieldTitle: 'deathCertificate',
        fieldData: location.state.id,
        showFieldCondition: ability.can('deathCertificate', 'customer'),
      },
    ],
  }
  const getProfileActions = () => {
    const isBlocked = customerDetails?.blocked?.isBlocked
    return [
      {
        icon: 'edit',
        title: local.edit,
        permission:
          ability.can('updateCustomer', 'customer') ||
          ability.can('updateNationalId', 'customer'),
        onActionClick: () =>
          history.push('/customers/edit-customer', {
            id: location.state.id,
          }),
      },
      {
        icon: 'applications',
        title: local.createClearance,
        permission: !isBlocked && ability.can('newClearance', 'application'),
        onActionClick: () =>
          history.push('/customers/create-clearance', {
            customerId: location.state.id,
          }),
      },
      {
        icon: 'deactivate-user',
        title: customerDetails?.blocked?.isBlocked
          ? local.unblockCustomer
          : local.blockCustomer,
        permission: ability.can('blockAndUnblockCustomer', 'customer'),
        onActionClick: () =>
          handleActivationClick({
            id: location.state.id,
            blocked: customerDetails?.blocked,
          }),
      },
      {
        icon: 'business-activities',
        title: local.halanLinkage,
        permission: true,
        onActionClick: () => setShowHalanLinkageModal(true),
      },
      {
        title: local.nanoCustomerLimit,
        icon: 'principal-range',
        permission:
          !isBlocked &&
          ability.can('editCustomerNanoLoansLimit', 'customer') &&
          ability.can('getMaximumNanoLoansLimit', 'application') &&
          ability.can('getCustomerNanoLoansLimitDocument', 'customer'),
        onActionClick: () => {
          setShowLoanLimitModal(true)
        },
      },
    ]
  }
  return (
    <>
      <Container className="print-none">
        <div style={{ margin: 15 }}>
          <div className="d-flex flex-row justify-content-between">
            <h3> {local.viewCustomer}</h3>
            <ProfileActions actions={getProfileActions()} />
          </div>
          {mainInfo && <InfoBox info={mainInfo} />}
        </div>
        <Profile
          source="individual"
          loading={loading}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(stringKey) => setActiveTab(stringKey)}
          tabsData={tabsData}
        />
        {showHalanLinkageModal && (
          <HalanLinkageModal
            show={showHalanLinkageModal}
            hideModal={() => setShowHalanLinkageModal(false)}
            customer={customerDetails}
          />
        )}

        {showLoanLimitModal && customerDetails && (
          <LoanLimitModal
            show={showLoanLimitModal}
            hideModal={() => setShowLoanLimitModal(false)}
            customer={customerDetails}
            loanLimit={customerDetails?.nanoLoansLimit ?? 0}
            onSuccess={() => getCustomerDetails()}
          />
        )}
      </Container>
    </>
  )
}

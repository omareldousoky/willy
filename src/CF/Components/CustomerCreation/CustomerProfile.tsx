import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from 'react-bootstrap/Container'
import { Customer } from '../../../Shared/Services/interfaces'
import {
  cfLimitStatusLocale,
  getErrorMessage,
  iscoreDate,
} from '../../../Shared/Services/utils'
import { Tab } from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../../Shared/config/ability'
import { Profile, InfoBox, ProfileActions } from '../../../Shared/Components'
import {
  CFGuarantorTableViewProp,
  TabDataProps,
} from '../../../Shared/Components/Profile/types'
import { getCustomerInfo } from '../../../Shared/Services/formatCustomersInfo'
import {
  getIscoreCached,
  getIscore,
} from '../../../Shared/Services/APIs/iScore'
import { getGeoAreasByBranch } from '../../../Shared/Services/APIs/geoAreas/getGeoAreas'
import { blockCustomer } from '../../../Shared/Services/APIs/customer/blockCustomer'
import { getCustomerByID } from '../../../Shared/Services/APIs/customer/getCustomer'
import { BondContract } from '../PdfTemplates/BondContractCF'
import { ConsumerFinanceContract } from '../PdfTemplates/ConsumerFinanceContract'
import { ConsumerFinanceContractData } from '../../Models/contract'
import { AcknowledgmentWasSignedInFront } from '../PdfTemplates/AcknowledgmentWasSignedInFront'
import { PromissoryNote } from '../PdfTemplates/PromissoryNote'
import { AuthorizationToFillInfo } from '../PdfTemplates/AuthorizationToFillInfo'
import CFLimitModal from './CFLimitModal'
import { getCFLimits } from '../../Services/APIs/config'
import {
  GlobalCFLimits,
  globalCfLimitsInitialValues,
} from '../../Models/globalLimits'
import { Score } from '../../../Shared/Models/Customer'

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
    header: local.documents,
    stringKey: 'documents',
  },
  {
    header: local.guarantorInfo,
    stringKey: 'cfGuarantors',
  },
  {
    header: local.deathCertificate,
    stringKey: 'deathCertificate',
    permission: 'deathCertificate',
    permissionKey: 'customer',
  },
]

export const CustomerProfile = () => {
  const [loading, setLoading] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<Customer>()
  const [
    customerCFContract,
    setCustomerCFContract,
  ] = useState<ConsumerFinanceContractData>()
  const [iScoreDetails, setIScoreDetails] = useState<Score[]>()
  const [activeTab, setActiveTab] = useState('workInfo')
  const [print, setPrint] = useState('')
  const [showCFLimitModal, setShowCFLimitModal] = useState(false)
  const [cfModalAction, setCFModalAction] = useState('')
  const [globalLimits, setGlobalLimits] = useState<GlobalCFLimits>(
    globalCfLimitsInitialValues
  )
  const [customerGuarantors, setCustomerGuarantors] = useState<Customer[]>([])

  const location = useLocation<LocationState>()
  const history = useHistory()

  useEffect(() => {
    if (print.length > 0) {
      window.print()
    }
    window.onafterprint = () => {
      setPrint('')
    }
  }, [print])

  async function getCachediScores(array: string[]) {
    setLoading(true)
    const iScores = await getIscoreCached({
      nationalIds: array,
    })
    if (iScores.status === 'success') {
      setIScoreDetails(iScores.body.data)
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
  function setCustomerContractData(customer: Customer) {
    setCustomerCFContract({
      customerCreationDate: customer.created?.at || 0,
      customerName: customer.customerName || '',
      nationalId: customer.nationalId || '',
      customerHomeAddress: customer.customerHomeAddress || '',
      mobilePhoneNumber: customer.mobilePhoneNumber || '',
      initialConsumerFinanceLimit: customer.initialConsumerFinanceLimit || 0,
      customerGuarantors: customerGuarantors || [],
    })
  }
  async function getGlobalCfLimits() {
    setLoading(true)
    const limitsRes = await getCFLimits()
    if (limitsRes.status === 'success') {
      setLoading(false)
      setGlobalLimits(limitsRes.body)
    }
    setLoading(false)
    Swal.fire('Error !', getErrorMessage(limitsRes.error.error), 'error')
  }
  async function getCustomerDetails() {
    setLoading(true)
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      await setCustomerDetails(res.body.customer)
      await setCustomerGuarantors(res.body.guarantors)
      if (ability.can('viewIscore', 'customer')) {
        const guarIds = res.body.guarantors.map((guar) => guar.nationalId)
        await getCachediScores([res.body.customer.nationalId, ...guarIds])
      }
      await getGeoArea(res.body.customer.geoAreaId, res.body.customer.branchId)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  useEffect(() => {
    getCustomerDetails()
    getGlobalCfLimits()
  }, [])
  function getArRuralUrban(ruralUrban: string | undefined) {
    if (ruralUrban === 'rural') return local.rural
    return local.urban
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
      const guarIds = customerGuarantors.map((guar) => guar.nationalId)
      getCachediScores([data.nationalId, ...guarIds])
      setLoading(false)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(iScore.error.error), 'error')
    }
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

  function setModalData(type) {
    setCFModalAction(type)
    setShowCFLimitModal(true)
  }

  const mainInfo = customerDetails && [
    getCustomerInfo({
      customerDetails,
      score: iScoreDetails?.filter(
        (score) => score.nationalId === customerDetails.nationalId
      )[0],
      isLeader: false,
      isCF: true,
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
    cfGuarantors: [
      {
        fieldTitle: 'cfGuarantors',
        fieldData: {
          customerId: customerDetails?._id,
          customerGuarantors,
          getIscore: (data) => getCustomerIscore(data),
          iscores: iScoreDetails,
        } as CFGuarantorTableViewProp,
        showFieldCondition: true,
      },
    ],
  }
  const getProfileActions = () => {
    return [
      {
        icon: 'download',
        title: local.downloadPDF,
        permission: ['initialization-reviewed', 'update-reviewed'].includes(
          customerDetails?.consumerFinanceLimitStatus ?? ''
        ),
        onActionClick: () => {
          setCustomerContractData(customerDetails as Customer)
          setPrint('all')
        },
      },
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
        permission: ability.can('newClearance', 'application'),
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
        icon: 'bulk-loan-applications-review',
        title: local.reviewCFCustomerLimit,
        permission:
          ['pending-initialization', 'pending-update'].includes(
            customerDetails?.consumerFinanceLimitStatus ?? ''
          ) &&
          ((ability.can('reviewCFLimit', 'customer') &&
            (customerDetails?.initialConsumerFinanceLimit ?? 0) <
              globalLimits.CFHQMinimumApprovalLimit) ||
            ability.can('reviewCFLimitHQ', 'customer')) &&
          !customerDetails?.blocked?.isBlocked,
        onActionClick: () => setModalData('review'),
      },
      {
        icon: 'bulk-loan-applications-review',
        title: local.approveCFCustomerLimit,
        permission:
          ['initialization-reviewed', 'update-reviewed'].includes(
            customerDetails?.consumerFinanceLimitStatus ?? ''
          ) &&
          ability.can('approveCFLimit', 'customer') &&
          !customerDetails?.blocked?.isBlocked,
        onActionClick: () => setModalData('approve'),
      },
    ]
  }
  return (
    <>
      <Container className="print-none">
        <div>
          <div className="d-flex flex-row justify-content-between m-2">
            <div
              className="d-flex justify-content-start align-items-center"
              style={{ width: '45%' }}
            >
              <h4> {local.viewCustomer}</h4>
              <span
                style={{
                  display: 'flex',
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 30,
                  border: `1px solid ${
                    cfLimitStatusLocale[
                      customerDetails?.consumerFinanceLimitStatus || 'default'
                    ].color
                  }`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: `${
                      cfLimitStatusLocale[
                        customerDetails?.consumerFinanceLimitStatus || 'default'
                      ].color
                    }`,
                    fontSize: '.8rem',
                  }}
                >
                  {
                    cfLimitStatusLocale[
                      customerDetails?.consumerFinanceLimitStatus || 'default'
                    ].text
                  }
                </p>
              </span>
            </div>
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
        {showCFLimitModal && customerDetails && (
          <CFLimitModal
            show={showCFLimitModal}
            hideModal={() => {
              setShowCFLimitModal(false)
              setCFModalAction('')
            }}
            customer={customerDetails}
            onSuccess={() => getCustomerDetails()}
            action={cfModalAction}
          />
        )}
      </Container>
      {print === 'all' && (
        <>
          <ConsumerFinanceContract
            contractData={customerCFContract as ConsumerFinanceContractData}
          />
          <BondContract
            customerCreationDate={customerDetails?.created?.at || 0}
            customerName={customerDetails?.customerName || ''}
            customerHomeAddress={customerDetails?.customerHomeAddress || ''}
            nationalId={customerDetails?.nationalId || ''}
            initialConsumerFinanceLimit={
              customerDetails?.initialConsumerFinanceLimit || 0
            }
          />
          {customerGuarantors?.length > 0 &&
            customerGuarantors.map((guarantor) => (
              <BondContract
                customerCreationDate={customerDetails?.created?.at || 0}
                customerName={guarantor?.customerName || ''}
                customerHomeAddress={guarantor?.customerHomeAddress || ''}
                nationalId={guarantor?.nationalId || ''}
                initialConsumerFinanceLimit={
                  customerDetails?.initialConsumerFinanceLimit || 0
                }
              />
            ))}
          <PromissoryNote
            customerCreationDate={customerDetails?.created?.at || 0}
            customerName={customerDetails?.customerName || ''}
            customerHomeAddress={customerDetails?.customerHomeAddress || ''}
            nationalId={customerDetails?.nationalId || ''}
            initialConsumerFinanceLimit={
              customerDetails?.initialConsumerFinanceLimit || 0
            }
            customerGuarantors={customerGuarantors}
          />
          <AuthorizationToFillInfo
            customerCreationDate={customerDetails?.created?.at || 0}
            customerName={customerDetails?.customerName || ''}
            customerHomeAddress={customerDetails?.customerHomeAddress || ''}
            customerGuarantors={customerGuarantors}
          />
          <AcknowledgmentWasSignedInFront
            customerCreationDate={customerDetails?.created?.at || 0}
            customerName={customerDetails?.customerName || ''}
            nationalId={customerDetails?.nationalId || ''}
            customerGuarantors={customerGuarantors}
          />
        </>
      )}
    </>
  )
}

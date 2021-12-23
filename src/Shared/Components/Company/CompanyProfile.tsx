import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { useHistory, useLocation } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import { cfLimitStatusLocale, getErrorMessage } from '../../Services/utils'

import { TabDataProps } from '../Profile/types'
import { Tab } from '../HeaderWithCards/cardNavbar'
import { Company } from '../../Services/interfaces'
import { getCompanyInfo } from '../../Services/formatCustomersInfo'
import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
import {
  getIscoreCached,
  getSMECachedIscore,
  getSMEIscore,
} from '../../Services/APIs/iScore'
import { blockCustomer } from '../../Services/APIs/customer/blockCustomer'
import {
  CFEntitledToSignDetailsProps,
  CFGuarantorDetailsProps,
  OtpCustomersProps,
  Customer,
  EntitledToSign,
  Score,
} from '../../Models/Customer'
import { ProfileActions } from '../ProfileActions'
import { Profile } from '../Profile'
import { InfoBox } from '../InfoBox'
import { ConsumerFinanceContractData } from '../../Models/consumerContract'
import CFLimitModal from '../CFLimitModal/CFLimitModal'
import { MicroCFContract } from '../../../Mohassel/Components/Reports/microCFContract'

export interface CompanyProfileProps {
  data: any
}
export const CompanyProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, changeActiveTab] = useState<keyof TabDataProps>('documents')
  const [company, setCompany] = useState<Company>()
  const [
    customerCFContract,
    setCustomerCFContract,
  ] = useState<ConsumerFinanceContractData>()
  const [print, setPrint] = useState('')
  const [showCFLimitModal, setShowCFLimitModal] = useState(false)
  const [cfModalAction, setCFModalAction] = useState('')
  const [customerGuarantors, setCustomerGuarantors] = useState<Customer[]>([])
  const [entitledToSignCustomers, setEntitledToSignCustomers] = useState<
    EntitledToSign[]
  >([])
  const [score, setScore] = useState<Score>()
  const [iScoreDetails, setIScoreDetails] = useState<Score[]>()
  const location = useLocation<{ id: string }>()
  const history = useHistory()

  useEffect(() => {
    if (print.length > 0) {
      window.print()
    }
    window.onafterprint = () => {
      setPrint('')
    }
  }, [print])
  const getIScores = async (companyObj) => {
    setIsLoading(true)
    const iScores = await getSMECachedIscore({
      ids: [companyObj.cbeCode],
    })
    if (iScores.status === 'success') {
      setScore(iScores?.body?.data[0])
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    }
  }
  const getCachediScores = async (array: string[]) => {
    setIsLoading(true)
    const iScores = await getIscoreCached({
      nationalIds: array,
    })
    if (iScores.status === 'success') {
      setIScoreDetails(iScores.body.data)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    }
  }
  const getCustomerIscore = async (data) => {
    setIsLoading(true)
    const obj = {
      productId: '104',
      amount: `${1000}`,
      name: `${data.businessName}`,
      idSource: '031',
      idValue: `${data.cbeCode}`,
    }
    const iScore = await getSMEIscore(obj)
    if (iScore.status === 'success') {
      const guarIds: string[] = []
      customerGuarantors.forEach(
        (guar) => guar.nationalId && guarIds.push(guar.nationalId)
      )

      const entitledToSignIds: string[] = []
      entitledToSignCustomers.forEach(
        (customer) =>
          customer.nationalId && entitledToSignIds.push(customer.nationalId)
      )
      const idArray = guarIds.concat(entitledToSignIds)
      await getIScores(company)
      await getCachediScores(idArray)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(iScore.error.error), 'error')
    }
  }
  function mapEntitledToSignToCustomer({
    customer,
    position,
  }: {
    customer: Customer
    position: string
  }) {
    return {
      ...customer,
      position,
    }
  }
  const getCompanyDetails = async () => {
    setIsLoading(true)
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      setCompany(res.body.customer)
      setCustomerGuarantors(res.body.guarantors)
      setEntitledToSignCustomers(
        res.body.entitledToSign.map(mapEntitledToSignToCustomer)
      )
      if (ability.can('viewIscore', 'customer')) {
        await getIScores(res.body.customer)
        const guarIds = res.body.guarantors.map((guar) => guar.nationalId)
        const entitledToSignIds = res.body.entitledToSign.map(
          (customer) => customer.nationalId
        )
        await getCachediScores([
          ...guarIds,
          ...entitledToSignIds,
        ] as Array<string>)
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  useEffect(() => {
    getCompanyDetails()
  }, [])

  const tabsData: TabDataProps = {
    documents: [
      {
        fieldTitle: 'company id',
        fieldData: location.state.id,
        showFieldCondition: true,
      },
    ],
    cfGuarantors: [
      {
        fieldTitle: 'cfGuarantors',
        fieldData: {
          customerId: company?._id,
          customerBranch: company?.branchId,
          hasLoan: !!company?.hasLoan,
          guarantors: customerGuarantors,
          getIscore: (data) => getCustomerIscore(data),
          iscores: iScoreDetails,
          isBlocked: !!company?.blocked?.isBlocked,
          limitStatus: company?.consumerFinanceLimitStatus,
        } as CFGuarantorDetailsProps,
        showFieldCondition: true,
      },
    ],
    cfEntitledToSign: [
      {
        fieldTitle: 'cfEntitledToSign',
        fieldData: {
          customerId: company?._id,
          customerBranch: company?.branchId,
          entitledToSignCustomers,
          getIscore: (data) => getCustomerIscore(data),
          iscores: iScoreDetails,
          isBlocked: !!company?.blocked?.isBlocked,
          limitStatus: company?.consumerFinanceLimitStatus,
        } as CFEntitledToSignDetailsProps,
        showFieldCondition: true,
      },
    ],
    otpCustomers: [
      {
        fieldTitle: 'otpCustomers',
        fieldData: {
          customerId: location.state.id,
          otpCustomers: company?.otpCustomer ?? [],
          reload: () => getCompanyDetails(),
        } as OtpCustomersProps,
        showFieldCondition: true,
      },
    ],
  }
  function setModalData(type) {
    setCFModalAction(type)
    setShowCFLimitModal(true)
  }
  function setCustomerContractData(customer: Customer) {
    setCustomerCFContract({
      customerCreationDate: customer.created?.at || 0,
      customerName: customer.customerName || '',
      nationalId: customer.nationalId || '',
      customerHomeAddress: customer.customerHomeAddress || '',
      mobilePhoneNumber: customer.mobilePhoneNumber || '',
      initialConsumerFinanceLimit: customer.initialConsumerFinanceLimit || 0,
      branchName: customer.branchName || '',
      commercialRegisterNumber: customer.commercialRegisterNumber || '',
      businessAddress: customer.businessAddress || '',
      customerGuarantors: customerGuarantors || [],
      entitledToSignCustomers: entitledToSignCustomers || [],
    })
  }
  const mainInfo = company && [
    getCompanyInfo({
      company,
      score,
      getIscore: (data) => getCustomerIscore(data),
      applicationStatus: 'reviewed',
    }),
  ]
  const tabs: Array<Tab> = [
    {
      header: local.documents,
      stringKey: 'documents',
    },
    {
      header: local.guarantorInfo,
      stringKey: 'cfGuarantors',
    },
    {
      header: local.entitledToSign,
      stringKey: 'cfEntitledToSign',
    },
    {
      header: local.otpCustomers,
      stringKey: 'otpCustomers',
    },
  ]
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
          setIsLoading(true)
          const res = await blockCustomer(id, {
            toBeBlocked: blocked?.isBlocked !== true,
            reason: text,
          })
          if (res.status === 'success') {
            setIsLoading(false)
            Swal.fire(
              '',
              blocked?.isBlocked === true
                ? local.customerUnblockedSuccessfully
                : local.customerBlockedSuccessfully,
              'success'
            ).then(() => window.location.reload())
          } else {
            setIsLoading(false)
            Swal.fire('', local.searchError, 'error')
          }
        }
      })
    }
  }
  const getProfileActions = () => {
    return [
      {
        icon: 'download',
        title: local.downloadPDF,
        permission: ['initialization-reviewed', 'update-reviewed'].includes(
          company?.consumerFinanceLimitStatus ?? ''
        ),
        onActionClick: () => {
          setCustomerContractData(company as Customer)
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
          history.push('/company/edit-company', {
            id: location.state.id,
          }),
      },
      {
        title: local.createClearance,
        permission: ability.can('newClearance', 'application'),
        onActionClick: () =>
          history.push('/company/create-clearance', {
            customerId: location.state.id,
          }),
      },
      {
        icon: 'deactivate-user',
        title: company?.blocked?.isBlocked
          ? local.unblockCompany
          : local.blockCompany,
        permission: ability.can('blockAndUnblockCustomer', 'customer'),
        onActionClick: () =>
          handleActivationClick({
            id: location.state.id,
            blocked: company?.blocked,
          }),
      },
      {
        icon: 'bulk-loan-applications-review',
        title: local.reviewCFCustomerLimit,
        permission:
          !company?.blocked?.isBlocked &&
          ['pending-initialization', 'pending-update'].includes(
            company?.consumerFinanceLimitStatus ?? ''
          ) &&
          (ability.can('reviewCFLimit', 'customer') ||
            ability.can('reviewCFLimitHQ', 'customer')),
        onActionClick: () => setModalData('review'),
      },
      {
        icon: 'bulk-loan-applications-review',
        title: local.approveCFCustomerLimit,
        permission:
          !company?.blocked?.isBlocked &&
          ['initialization-reviewed', 'update-reviewed'].includes(
            company?.consumerFinanceLimitStatus ?? ''
          ) &&
          ability.can('approveCFLimit', 'customer'),
        onActionClick: () => setModalData('approve'),
      },
    ]
  }
  return (
    <>
      <Container className="print-none" fluid>
        <div style={{ margin: 15 }}>
          <div className="d-flex flex-row justify-content-between m-2">
            <div className="d-flex flex-row justify-content-start align-items-center text-nowrap mx-2">
              <h4>{local.viewCompany}</h4>
              {company?.consumerFinanceLimitStatus && (
                <span
                  style={{
                    display: 'flex',
                    padding: 10,
                    marginRight: 10,
                    borderRadius: 30,
                    border: `1px solid ${
                      cfLimitStatusLocale[
                        company?.consumerFinanceLimitStatus || 'default'
                      ].color
                    }`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: `${
                        cfLimitStatusLocale[
                          company?.consumerFinanceLimitStatus || 'default'
                        ].color
                      }`,
                      fontSize: '.8rem',
                    }}
                  >
                    {
                      cfLimitStatusLocale[
                        company?.consumerFinanceLimitStatus || 'default'
                      ].text
                    }
                  </p>
                </span>
              )}
            </div>
            <ProfileActions actions={getProfileActions()} />
          </div>
          {mainInfo && <InfoBox info={mainInfo} />}
        </div>
        <Profile
          source="company"
          loading={isLoading}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(stringKey) => changeActiveTab(stringKey)}
          tabsData={tabsData}
        />
        {showCFLimitModal && company && (
          <CFLimitModal
            show={showCFLimitModal}
            hideModal={() => {
              setShowCFLimitModal(false)
              setCFModalAction('')
            }}
            customer={company}
            onSuccess={() => getCompanyDetails()}
            action={cfModalAction}
          />
        )}
      </Container>
      {print === 'all' && (
        <MicroCFContract
          contractData={customerCFContract as ConsumerFinanceContractData}
          sme
        />
      )}
    </>
  )
}

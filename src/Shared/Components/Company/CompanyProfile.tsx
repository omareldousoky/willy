import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { useHistory, useLocation } from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import {
  cfLimitStatusLocale,
  getErrorMessage,
  iscoreDate,
} from '../../Services/utils'

import { TabDataProps } from '../Profile/types'
import { Tab } from '../HeaderWithCards/cardNavbar'
import { Company } from '../../Services/interfaces'
import { getCompanyInfo } from '../../Services/formatCustomersInfo'
import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
import {
  getIscore,
  getIscoreCached,
  getSMECachedIscore,
} from '../../Services/APIs/iScore'
import { blockCustomer } from '../../Services/APIs/customer/blockCustomer'
import { CFGuarantorDetailsProps, Customer, Score } from '../../Models/Customer'
import { ProfileActions } from '../ProfileActions'
import { Profile } from '../Profile'
import { InfoBox } from '../InfoBox'
import {
  AcknowledgmentWasSignedInFront,
  AuthorizationToFillInfo,
  BondContract,
  PromissoryNote,
  ConsumerFinanceContract,
} from '../pdfTemplates/ConsumerContract'
import { ConsumerFinanceContractData } from '../../Models/consumerContract'
import CFLimitModal from '../CFLimitModal/CFLimitModal'

export interface CompanyProfileProps {
  data: any
}
export const CompanyProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, changeActiveTab] = useState('documents')
  const [company, setCompany] = useState<Company>()
  const [
    customerCFContract,
    setCustomerCFContract,
  ] = useState<ConsumerFinanceContractData>()
  const [print, setPrint] = useState('')
  const [showCFLimitModal, setShowCFLimitModal] = useState(false)
  const [cfModalAction, setCFModalAction] = useState('')
  const [customerGuarantors, setCustomerGuarantors] = useState<Customer[]>([])
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
      ids: [`${companyObj.governorate}-${companyObj.commercialRegisterNumber}`],
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
      await getCachediScores([data.nationalId, ...guarIds])
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(iScore.error.error), 'error')
    }
  }
  const getCompanyDetails = async () => {
    setIsLoading(true)
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      setCompany(res.body.customer)
      setCustomerGuarantors(res.body.guarantors)
      if (ability.can('viewIscore', 'customer')) {
        await getIScores(res.body.customer)
        const guarIds = res.body.guarantors.map((guar) => guar.nationalId)
        await getCachediScores(guarIds as Array<string>)
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
          hasLoan: !!company?.hasLoan,
          guarantors: customerGuarantors,
          getIscore: (data) => getCustomerIscore(data),
          iscores: iScoreDetails,
          isBlocked: !!company?.blocked?.isBlocked,
        } as CFGuarantorDetailsProps,
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
      customerGuarantors: customerGuarantors || [],
    })
  }
  const mainInfo = company && [getCompanyInfo({ company, score })]
  const tabs: Array<Tab> = [
    {
      header: local.documents,
      stringKey: 'documents',
    },
    {
      header: local.guarantorInfo,
      stringKey: 'cfGuarantors',
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
        <>
          <ConsumerFinanceContract
            contractData={customerCFContract as ConsumerFinanceContractData}
          />
          <BondContract
            customerCreationDate={company?.created?.at || 0}
            customerName={company?.customerName || ''}
            customerHomeAddress={company?.customerHomeAddress || ''}
            nationalId={company?.nationalId || ''}
            initialConsumerFinanceLimit={
              company?.initialConsumerFinanceLimit || 0
            }
          />
          {customerGuarantors?.length > 0 &&
            customerGuarantors.map((guarantor) => (
              <BondContract
                customerCreationDate={company?.created?.at || 0}
                customerName={guarantor?.customerName || ''}
                customerHomeAddress={guarantor?.customerHomeAddress || ''}
                nationalId={guarantor?.nationalId || ''}
                initialConsumerFinanceLimit={
                  company?.initialConsumerFinanceLimit || 0
                }
              />
            ))}
          <PromissoryNote
            customerCreationDate={company?.created?.at || 0}
            customerName={company?.customerName || ''}
            customerHomeAddress={company?.customerHomeAddress || ''}
            nationalId={company?.nationalId || ''}
            initialConsumerFinanceLimit={
              company?.initialConsumerFinanceLimit || 0
            }
            customerGuarantors={customerGuarantors}
          />
          <AuthorizationToFillInfo
            customerCreationDate={company?.created?.at || 0}
            customerName={company?.customerName || ''}
            customerHomeAddress={company?.customerHomeAddress || ''}
            customerGuarantors={customerGuarantors}
          />
          <AcknowledgmentWasSignedInFront
            customerCreationDate={company?.created?.at || 0}
            customerName={company?.customerName || ''}
            nationalId={company?.nationalId || ''}
            customerGuarantors={customerGuarantors}
          />
        </>
      )}
    </>
  )
}

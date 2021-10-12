import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { useHistory, useLocation } from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import { InfoBox, Profile, ProfileActions } from '..'

import local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import { getErrorMessage } from '../../Services/utils'

import { TabDataProps } from '../Profile/types'
import { Tab } from '../HeaderWithCards/cardNavbar'
import { getCompanyInfo } from '../../Services/formatCustomersInfo'
import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
import { getSMECachedIscore } from '../../Services/APIs/iScore'
import { blockCustomer } from '../../Services/APIs/customer/blockCustomer'
import { Score, Customer } from '../../Models/Customer'

export interface CompanyProfileProps {
  data: any
}
export const CompanyProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, changeActiveTab] = useState('documents')
  const [company, setCompany] = useState<Customer>()
  const [score, setScore] = useState<Score>()
  const location = useLocation<{ id: string }>()
  const history = useHistory()

  const getiScores = async (companyObj) => {
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

  const getCompanyDetails = async () => {
    setIsLoading(true)
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      await setCompany(res.body)
      setIsLoading(false)
      if (ability.can('viewIscore', 'customer')) await getiScores(res.body)
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
  }
  const mainInfo = company && [getCompanyInfo({ company, score })]
  const tabs: Array<Tab> = [
    {
      header: local.documents,
      stringKey: 'documents',
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
    ]
  }
  return (
    <Container className="print-none">
      <div style={{ margin: 15 }}>
        <div className="d-flex flex-row justify-content-between">
          <h3>{local.viewCompany}</h3>
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
    </Container>
  )
}

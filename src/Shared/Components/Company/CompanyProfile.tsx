import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { Container } from 'react-bootstrap'

import { InfoBox, Profile, ProfileActions } from '..'

import * as local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import { getCustomerByID } from '../../../Mohassel/Services/APIs/Customer-Creation/getCustomer'
import { getIscoreSME } from '../../../Mohassel/Services/APIs/iScore/iScore'
import { getErrorMessage } from '../../Services/utils'

import { FieldProps, TabDataProps } from '../Profile/types'
import { Tab } from '../../../Mohassel/Components/HeaderWithCards/cardNavbar'
import { Customer } from '../../Services/interfaces'
import { Score } from '../../../Mohassel/Components/CustomerCreation/customerProfile'
import { getCompanyInfo } from '../../Services/formatCustomersInfo'
import { blockCustomer } from '../../../Mohassel/Services/APIs/blockCustomer/blockCustomer'

export interface CompanyProfileProps {
  data: any
}
export const Company = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, changeActiveTab] = useState('documents')
  const [company, setCompany] = useState<Customer>()
  const [score, setScore] = useState<Score>()
  const [mainInfo, setMainInfo] = useState<FieldProps[][]>([])
  const location = useLocation<{ id: string }>()
  const history = useHistory()

  const { viewCompany, documents } = local
  const getiScores = async (id) => {
    setIsLoading(true)
    const iScores = await getIscoreSME({
      idValue: id,
      name: company?.customerName,
      productId: '002',
      idSource: '901',
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
      if (ability.can('viewIscore', 'customer'))
        await getiScores(res.body.taxCardNumber)
      // await getGuaranteeedLoans(res.body)
      // await getGeoArea(res.body.geoAreaId, res.body.branchId)
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  const setCompanyFields = () =>
    company && setMainInfo([getCompanyInfo({ company, score })])
  useEffect(() => {
    getCompanyDetails()
  }, [])
  useEffect(() => {
    company && setCompanyFields()
    company && getiScores(company.taxCardNumber)
  }, [company])

  const tabsData: TabDataProps = {
    documents: [
      {
        fieldTitle: 'company id',
        fieldData: location.state.id,
        showFieldCondition: true,
      },
    ],
  }
  const tabs: Array<Tab> = [
    {
      header: documents,
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
        icon: 'editIcon',
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
          <h3>{viewCompany}</h3>
          <ProfileActions actions={getProfileActions()} />
        </div>
        {mainInfo.length > 0 && <InfoBox info={mainInfo} />}
      </div>
      <Profile
        source="company"
        loading={isLoading}
        // backButtonText={viewCompany}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(stringKey) => changeActiveTab(stringKey)}
        tabsData={tabsData}
      />
    </Container>
  )
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
  }
}

export const CompanyProfile = connect(mapStateToProps)(Company)

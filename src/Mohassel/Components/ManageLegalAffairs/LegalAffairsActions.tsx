import React, { useEffect, useState } from 'react'
import { Card, Button, FormCheck } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import {
  getErrorMessage,
  getFullCustomerKey,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import { getDateAndTime } from '../../Services/getRenderDate'
import { manageCustomersArray } from '../CustomerCreation/manageCustomersInitial'
import Can from '../../config/Can'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'

import local from '../../../Shared/Assets/ar.json'
import { Card as CardType } from '../../../Mohassel/Components/ManageAccounts/manageAccountsInitials'

import Search from '../../../Shared/Components/Search/search'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from './manageLegalAffairsInitials'

export interface ActionsIconGroupProps {
  currentCustomerId: string
  actions: Actions[]
}
export interface Actions {
  actionTitle: string
  actionPermission: boolean
  actionIcon: string
  actionOnClick(currentCustomerId: string): void
}

interface SearchFilters {
  governorate?: string
  name?: string
  nationalId?: string
  key?: number
  code?: number
  customerShortenedCode?: string // For FE only
}

interface CompanyListProps {
  branchId: string
  currentSearchFilters: SearchFilters
  data: any
  error: string
  history: any
  loading: boolean
  totalCount: number
}

export interface TableMapperItem {
  title: string | (() => JSX.Element)
  key: string
  sortable?: boolean
  render: (data: any) => void
}

const LegalAffairsActions = ({
  branchId,
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
}: CompanyListProps) => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const history = useHistory()
  const dispatch = useDispatch()

  const {
    actions,
    commercialRegisterNumber,
    creationDate,
    governorate,
    noOfUsers,
    taxCardNumber,
    legalAffairs,
  } = local

  const tabs = manageLegalAffairsArray()
  // TODO will need to replace url with blocked customers
  const url = 'defaultingCustomers'

  console.log({
    branchId,
    currentSearchFilters,
    data,
    error,
    loading,
    totalCount,
  })

  useEffect(() => {
    dispatch(
      search({
        size,
        from,
        url,
        branchId,
      })
    )

    if (error) Swal.fire('error', getErrorMessage(error), 'error')
  }, [branchId, dispatch, error, from, size])

  useEffect(() => {
    return () => {
      dispatch(searchFilters({}))
    }
  }, [])

  const companyActions: Actions[] = [
    {
      actionTitle: 'Edit',
      actionIcon: 'editIcon',
      actionPermission:
        ability.can('updateCustomer', 'customer') ||
        ability.can('updateNationalId', 'customer'),
      actionOnClick: (id) => history.push('/company/edit-company', { id }),
    },
    {
      actionTitle: 'view',
      actionIcon: 'view',

      actionPermission: ability.can('getCustomer', 'customer'),
      actionOnClick: (id) => history.push('/company/view-company', { id }),
    },
  ]

  const tableMapper: TableMapperItem[] = [
    {
      title: local.code,
      key: 'customerKey',
      render: (data) =>
        ability.can('getCustomer', 'customer') ? (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() =>
              history.push('/customers/view-customer', {
                id: data.customerId,
              })
            }
          >
            {data.customerKey}
          </span>
        ) : (
          data.customerKey
        ),
    },
    {
      title: local.customerName,
      key: 'customerName',
      render: (data) => data.customerName,
    },
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) => local[data.customerType],
    },
    {
      title: local.loanCode,
      key: 'loanId',
      render: (data) =>
        ability.can('getIssuedLoan', 'application') ||
        ability.can('branchIssuedLoan', 'application') ? (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() =>
              history.push('/loans/loan-profile', {
                id: data.loanId,
              })
            }
          >
            {data.loanKey}
          </span>
        ) : (
          data.loanKey
        ),
    },
    {
      title: local.date,
      key: 'creationDate',
      render: (data) =>
        data.created.at ? timeToArabicDate(data.created.at, true) : '',
    },
    {
      title: local.status,
      key: 'status',
      render: (data) => local[data.status],
    },
    {
      title: '',
      key: 'actions',
      render: (data) => <>Actions</>,
    },
  ]

  const getCompanies = async () => {
    const { customerShortenedCode, key } = currentSearchFilters

    dispatch(
      search({
        ...currentSearchFilters,
        key: customerShortenedCode
          ? getFullCustomerKey(customerShortenedCode)
          : key || undefined,
        size,
        from,
        url,
        branchId,
      })
    )

    if (error) Swal.fire('error', getErrorMessage(error), 'error')
  }

  return (
    <>
      <HeaderWithCards
        header={legalAffairs}
        array={tabs}
        active={tabs.map((item) => item.icon).indexOf('legal-actions')}
      />
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                Title
              </Card.Title>
              <span className="text-muted">
                {noOfUsers + ` (${totalCount || 0})`}
              </span>
            </div>
          </div>

          <hr className="dashed-line" />

          <Search
            searchKeys={['keyword', 'dateFromTo', 'governorate']}
            dropDownKeys={[
              'name',
              'TaxCardNumber',
              'CommercialRegisterNumber',
              'key',
              'code',
              'customerShortenedCode',
            ]}
            searchPlaceholder="searchPlaceholder"
            url={url}
            from={from}
            size={size}
            setFrom={(newFrom) => setFrom(newFrom)}
            hqBranchIdRequest={branchId}
          />

          {data && (
            <DynamicTable
              from={from}
              size={size}
              totalCount={totalCount}
              mappers={tableMapper}
              pagination
              data={data}
              url={url}
              changeNumber={(key: string, number: number) => {
                if (key === 'size') setSize(number)
                if (key === 'from') setFrom(number)
                getCompanies()
              }}
            />
          )}
        </Card.Body>
      </Card>
    </>
  )
}

const mapStateToProps = (state) => ({
  data: state.search.data,
  error: state.search.error,
  totalCount: state.search.totalCount,
  loading: state.loading,
  currentSearchFilters: state.searchFilters,
})

export default connect(mapStateToProps)(LegalAffairsActions)

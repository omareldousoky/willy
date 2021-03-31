import React, { FunctionComponent, useEffect, useState } from 'react'

import { Card } from 'react-bootstrap'
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
import Can from '../../config/Can'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import local from '../../../Shared/Assets/ar.json'
import { Card as CardType } from '../ManageAccounts/manageAccountsInitials'
import Search from '../../../Shared/Components/Search/search'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from './manageLegalAffairsInitials'

// TODO:
// - change permissions
// - change url
// - extract interfaces and types to new files

interface SearchFilters {
  governorate?: string
  name?: string
  nationalId?: string
  key?: number
  code?: number
  customerShortenedCode?: string // For FE only
}

type CustomerListProps = {
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

const LegalAffairsActions: FunctionComponent<CustomerListProps> = ({
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
}) => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const history = useHistory()
  const dispatch = useDispatch()

  const {
    noOfUsers,
    legalAffairs,
    searchByBranchNameOrNationalIdOrCode,
    lateCustomers,
  } = local

  const tabs = manageLegalAffairsArray()
  const url = 'legal-affairs'

  useEffect(() => {
    dispatch(
      search({
        size,
        from,
        url,
      })
    )

    if (error) Swal.fire('error', getErrorMessage(error), 'error')
  }, [dispatch, error, from, size])

  useEffect(() => {
    return () => {
      dispatch(searchFilters({}))
    }
  }, [])

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
      render: (data) => (
        <Can I="createBranch" a="branch">
          {console.log({ data })}
          <img
            style={{ cursor: 'pointer' }}
            alt="edit"
            src={require('../../Assets/editIcon.svg')}
            onClick={() => {
              history.push({
                pathname: '/legal-affairs/customer-actions' + '/' + data._id,
                state: { customer: data },
              })
            }}
          />
        </Can>
      ),
    },
  ]

  const getCustomers = async () => {
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
                {lateCustomers}
              </Card.Title>
              <span className="text-muted">
                {noOfUsers + ` (${totalCount || 0})`}
              </span>
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'defaultingCustomerStatus']}
            dropDownKeys={[
              'name',
              'key',
              'customerKey',
              'customerShortenedCode',
            ]}
            searchPlaceholder={searchByBranchNameOrNationalIdOrCode}
            url={url}
            from={from}
            size={size}
            setFrom={(newFrom) => setFrom(newFrom)}
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
                getCustomers()
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

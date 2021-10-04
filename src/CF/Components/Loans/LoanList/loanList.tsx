import React, { FunctionComponent, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../../Shared/Components/Loader'
import local from '../../../../Shared/Assets/ar.json'
import Search from '../../../../Shared/Components/Search/search'
import {
  issuedLoansSearchFilters as issuedLoansSearchFiltersAction,
  search as searchAction,
} from '../../../../Shared/redux/search/actions'
import {
  beneficiaryType,
  getErrorMessage,
  getFullCustomerKey,
  removeEmptyArg,
  loanChipStatusClass,
  getFormattedLocalDate,
} from '../../../../Shared/Services/utils'
import { manageLoansArray } from './manageLoansInitials'
import HeaderWithCards from '../../../../Shared/Components/HeaderWithCards/headerWithCards'
import { ActionsIconGroup } from '../../../../Shared/Components'
import { LoanListHistoryState, LoanListProps } from './types'
import { TableMapperItem } from '../../../../Shared/Components/DynamicTable/types'

const LoanList: FunctionComponent<LoanListProps> = (props: LoanListProps) => {
  const [from, setFrom] = useState(0)
  const [size, setSize] = useState(10)

  const history = useHistory<LoanListHistoryState>()

  const dispatch = useDispatch()

  const { search, setIssuedLoansSearchFilters } = {
    search: (data) => dispatch(searchAction(data)),
    setIssuedLoansSearchFilters: (data: Record<string, any>) =>
      dispatch(issuedLoansSearchFiltersAction(data)),
  }

  const {
    loans,
    error,
    totalCount,
    loading,
    issuedLoansSearchFilters,
  } = useSelector((state: any) => ({
    loans: state.search.applications,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    issuedLoansSearchFilters: state.issuedLoansSearchFilters,
  }))

  useEffect(() => {
    const previousLoanType = issuedLoansSearchFilters.type
    const currentLoanType = 'consumerFinance'

    if (!previousLoanType)
      setIssuedLoansSearchFilters({ type: currentLoanType })

    let query = {
      ...issuedLoansSearchFilters,
      keyword: undefined, // to prevent sending key to BE
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
      type: currentLoanType,
    }
    query = removeEmptyArg(query)
    search(query)
  }, [])

  useEffect(() => {
    if (error) Swal.fire('Error !', getErrorMessage(error), 'error')
  }, [error])

  const getLoans = async () => {
    const { fromBranch, branchId } = props
    const { customerShortenedCode, customerKey } = issuedLoansSearchFilters
    const modifiedSearchFilters = {
      ...issuedLoansSearchFilters,
      customerKey: customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : customerKey || undefined,
    }
    let query = {
      ...modifiedSearchFilters,
      ...issuedLoansSearchFilters,
      branchId: fromBranch ? branchId : issuedLoansSearchFilters.branchId,
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
    }

    query = removeEmptyArg(query)
    search(query)
  }

  useEffect(() => {
    // avoid trigger when from == 0
    if (from) getLoans()
  }, [from, size])

  const renderActions = (data) => {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',
        actionPermission: true,
        actionOnClick: () =>
          history.push('/loans/loan-profile', {
            id: data.application._id,
          }),
      },
    ]
  }

  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) =>
        beneficiaryType(data.application.product.beneficiaryType),
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (data) => data.application.loanApplicationKey,
    },
    {
      title: local.customerName,
      key: 'name',
      sortable: true,
      render: (data) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() =>
            history.push('/loans/loan-profile', {
              id: data.application._id,
            })
          }
        >
          {data.application.customer.customerName}
        </div>
      ),
    },
    {
      title: local.nationalId,
      key: 'nationalId',
      render: (data) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() =>
            history.push('/loans/loan-profile', {
              id: data.application._id,
            })
          }
        >
          {data.application.customer.nationalId}
        </div>
      ),
    },
    {
      title: local.productName,
      key: 'productName',
      render: (data) => data.application.product.productName,
    },
    {
      title: local.loanIssuanceDate,
      key: 'issueDate',
      sortable: true,
      render: (data) =>
        data.application.issueDate
          ? getFormattedLocalDate(data.application.issueDate)
          : '',
    },
    {
      title: local.status,
      key: 'status',
      sortable: true,
      render: (data) => {
        const status = loanChipStatusClass[data.application.status || 'default']
        const isCancelled = status === 'canceled'
        return (
          <div className={`status-chip ${status}`}>
            {isCancelled ? local.cancelled : local[status]}
          </div>
        )
      },
    },
    {
      title: '',
      key: 'action',
      render: (data) => (
        <ActionsIconGroup currentId={data._id} actions={renderActions(data)} />
      ),
    },
  ]

  const searchKeys = [
    'keyword',
    'dateFromTo',
    'status',
    'branch',
    'doubtful',
    'writtenOff',
  ]

  const dropDownKeys = [
    'name',
    'key',
    'customerKey',
    'customerCode',
    'customerShortenedCode',
    'nationalId',
  ]

  const manageLoansTabs = manageLoansArray()

  return (
    <>
      <HeaderWithCards
        header={local.issuedLoans}
        array={manageLoansTabs}
        active={manageLoansTabs
          .map((item) => {
            return item.icon
          })
          .indexOf('issued-loans')}
      />
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.issuedLoans}
              </Card.Title>
              <span className="text-muted">
                {local.noOfIssuedLoans + ` (${totalCount ?? 0})`}
              </span>
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            cf
            searchKeys={searchKeys}
            dropDownKeys={dropDownKeys}
            searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
            setFrom={(fromValue) => setFrom(fromValue)}
            datePlaceholder={local.issuanceDate}
            url="loan"
            from={from}
            size={size}
            hqBranchIdRequest={props.branchId}
          />
          <DynamicTable
            pagination
            from={from}
            size={size}
            url="loan"
            totalCount={totalCount}
            mappers={tableMappers}
            data={loans}
            changeNumber={(key: string, number: number) => {
              if (key === 'from') {
                if (!number) getLoans()
                else setFrom(number)
              } else setSize(number)
            }}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default LoanList

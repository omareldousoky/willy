import React, { FunctionComponent, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import {
  issuedLoansSearchFilters as issuedLoansSearchFiltersAction,
  search as searchAction,
} from '../../../Shared/redux/search/actions'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  getErrorMessage,
  getFullCustomerKey,
  removeEmptyArg,
  loanChipStatusClass,
} from '../../../Shared/Services/utils'
import { manageLoansArray, manageSMELoansArray } from './manageLoansInitials'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { ActionsIconGroup } from '../../../Shared/Components'
import {
  LoanListLocationState,
  LoanListHistoryState,
  LoanListProps,
} from './types'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'

const LoanList: FunctionComponent<LoanListProps> = (props: LoanListProps) => {
  const [from, setFrom] = useState(0)
  const [size, setSize] = useState(10)

  const location = useLocation<LoanListLocationState>()
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

  const previousLoanType = issuedLoansSearchFilters.type
  const currentLoanType = location.state?.sme
    ? 'sme'
    : previousLoanType && previousLoanType !== 'sme'
    ? previousLoanType
    : 'micro'

  useEffect(() => {
    let searchFiltersQuery = {}

    if (previousLoanType === currentLoanType) {
      searchFiltersQuery = issuedLoansSearchFilters
    } else {
      setIssuedLoansSearchFilters({ type: currentLoanType })
    }

    let query = {
      ...searchFiltersQuery,
      keyword: undefined, // prevent sending key to BE
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
      branchId: props.branchId,
      type: currentLoanType,
      customerType: 'individual',
    }

    query = removeEmptyArg(query)
    search(query)
  }, [location.state?.sme])

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
            sme: currentLoanType === 'sme',
          }),
      },
    ]
  }

  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) =>
        beneficiaryType(
          data.application.customer.customerType === 'company'
            ? 'company'
            : data.application.product.beneficiaryType
        ),
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
              sme: currentLoanType === 'sme',
            })
          }
        >
          {data.application.product.beneficiaryType === 'individual' &&
          ['micro', 'nano', 'consumerFinance'].includes(
            data.application.product.type
          ) ? (
            data.application.customer.customerName
          ) : data.application.product.beneficiaryType === 'individual' &&
            data.application.product.type === 'sme' ? (
            data.application.customer.businessName
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup?.map((member) =>
                member.type === 'leader' ? (
                  <span key={member.customer._id}>
                    {member.customer.customerName}
                  </span>
                ) : null
              )}
            </div>
          )}
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
              sme: currentLoanType === 'sme',
            })
          }
        >
          {data.application.product.beneficiaryType === 'individual' ? (
            data.application.customer.nationalId
          ) : (
            <div className="d-flex flex-column">
              {data.application.group?.individualsInGroup.map((member) =>
                member.type === 'leader' ? (
                  <span key={member.customer._id}>
                    {member.customer.nationalId}
                  </span>
                ) : null
              )}
            </div>
          )}
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
          ? timeToDateyyymmdd(data.application.issueDate)
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

  const smePermission = !!location.state?.sme

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
  ]

  const manageLoansTabs = smePermission
    ? manageSMELoansArray()
    : manageLoansArray()
  const filteredMappers = smePermission
    ? tableMappers.filter((mapper) => mapper.key !== 'nationalId')
    : tableMappers
  if (smePermission) {
    filteredMappers.splice(3, 0, {
      title: local.commercialRegisterNumber,
      key: 'commercialRegisterNumber',
      render: (data) => data.application.customer.commercialRegisterNumber,
    })
    filteredMappers.splice(4, 0, {
      title: local.taxCardNumber,
      key: 'taxCardNumber',
      render: (data) => data.application.customer.taxCardNumber,
    })
    dropDownKeys.push('taxCardNumber', 'commercialRegisterNumber')
  } else {
    dropDownKeys.push('nationalId')
    searchKeys.splice(4, 0, 'loanType')
  }

  return (
    <>
      {!props.hideTabs && (
        <HeaderWithCards
          header={local.issuedLoans}
          array={manageLoansTabs}
          active={manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('issued-loans')}
        />
      )}
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
          {currentLoanType === previousLoanType && (
            <Search
              searchKeys={searchKeys}
              dropDownKeys={dropDownKeys}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              setFrom={(fromValue) => setFrom(fromValue)}
              datePlaceholder={local.issuanceDate}
              url="loan"
              from={from}
              size={size}
              submitClassName="mt-0"
              hqBranchIdRequest={props.branchId}
              sme={location.state?.sme}
            />
          )}
          <DynamicTable
            pagination
            from={from}
            size={size}
            url="loan"
            totalCount={totalCount}
            mappers={filteredMappers}
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

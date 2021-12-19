import React, { useEffect } from 'react'
import local from 'Shared/Assets/ar.json'
import {
  beneficiaryType,
  getErrorMessage,
  getFormattedLocalDate,
  getFullCustomerKey,
  loanChipStatusClass,
  removeEmptyArg,
} from 'Shared/Services/utils'
import { useHistory } from 'react-router-dom'
import { TableMapperItem } from 'Shared/Components/DynamicTable/types'
import { ActionsIconGroup } from 'Shared/Components'
import { useDispatch, useSelector } from 'react-redux'
import {
  issuedLoansSearchFilters as issuedLoansSearchFiltersAction,
  search as searchAction,
} from 'Shared/redux/search/actions'
import Swal from 'sweetalert2'

export default function useLoan(
  fromBranch,
  branchId,
  from,
  size,
  loanType,
  incomingCustomerKey: string | undefined = undefined
) {
  const history = useHistory()
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
    if (error) Swal.fire(local.error, getErrorMessage(error), 'error')
  }, [error])

  const getLoans = () => {
    const { customerShortenedCode, customerKey } = issuedLoansSearchFilters

    if (incomingCustomerKey)
      setIssuedLoansSearchFilters({ customerKey: incomingCustomerKey })

    const modifiedSearchFilters = {
      ...issuedLoansSearchFilters,
      customerKey: customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : customerKey || undefined,
    }
    let query = {
      ...modifiedSearchFilters,
      ...issuedLoansSearchFilters,
      customerKey: Number(incomingCustomerKey),
      branchId: fromBranch ? branchId : issuedLoansSearchFilters.branchId,
      type: loanType,
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
    }

    query = removeEmptyArg(query)
    search(query)
  }

  useEffect(() => {
    getLoans()
  }, [from, size, incomingCustomerKey])

  // loan table actions
  const loansRenderActions = (incomingData) => [
    {
      actionTitle: local.view,
      actionIcon: 'view',
      actionPermission: true,
      actionOnClick: () =>
        history.push('/loans/loan-profile', {
          id: incomingData.application._id,
        }),
    },
  ]
  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (incomingData) =>
        beneficiaryType(incomingData.application.product.beneficiaryType),
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (incomingData) => incomingData.application.loanApplicationKey,
    },
    {
      title: local.customerName,
      key: 'name',
      sortable: true,
      render: (incomingData) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() =>
            history.push('/loans/loan-profile', {
              id: incomingData.application._id,
            })
          }
        >
          {incomingData.application.customer.customerName}
        </div>
      ),
    },
    {
      title: local.nationalId,
      key: 'nationalId',
      render: (incomingData) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() =>
            history.push('/loans/loan-profile', {
              id: incomingData.application._id,
            })
          }
        >
          {incomingData.application.customer.nationalId}
        </div>
      ),
    },
    {
      title: local.productName,
      key: 'productName',
      render: (incomingData) => incomingData.application.product.productName,
    },
    {
      title: local.loanIssuanceDate,
      key: 'issueDate',
      sortable: true,
      render: (incomingData) =>
        incomingData.application.issueDate
          ? getFormattedLocalDate(incomingData.application.issueDate)
          : '',
    },
    {
      title: local.status,
      key: 'status',
      sortable: true,
      render: (incomingData) => {
        const status =
          loanChipStatusClass[incomingData.application.status || 'default']
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
      render: (incomingData) => (
        <div className="p-2">
          <ActionsIconGroup
            currentId={incomingData._id}
            actions={loansRenderActions(incomingData)}
          />
        </div>
      ),
    },
  ]
  const loanSearchKeys = [
    'keyword',
    'dateFromTo',
    'status',
    'branch',
    'doubtful',
    'writtenOff',
  ]

  const loanDropDownKeys = [
    'name',
    'key',
    'customerKey',
    'customerCode',
    'customerShortenedCode',
    'nationalId',
  ]

  const loanUtilities = {
    tableMappers,
    loanSearchKeys,
    loanDropDownKeys,
    loans,
    loading,
    totalCount,
    getLoans,
  }

  return [loanUtilities]
}

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
import Search from '../../../Shared/Components/Search/search'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from './manageLegalAffairsInitials'
import { CustomerListProps, IPrintAction, TableMapperItem } from './types'
import { DefaultedCustomer } from './defaultingCustomersList'
import LegalPrintActionsCell from './LegalPrintActionsCell'
import LegalSettlement from '../pdfTemplates/LegalSettlement'

const LegalCustomersList: FunctionComponent<CustomerListProps> = ({
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
}) => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [
    showActionsCustomer,
    setShowActionsCustomer,
  ] = useState<DefaultedCustomer | null>(null)

  const [slectedPrintAction, setSlectedPrintAction] = useState<
    IPrintAction | undefined
  >(undefined)

  const toggleShowActions = (customer: DefaultedCustomer) => {
    setShowActionsCustomer((previousValue) =>
      previousValue?._id === customer._id ? null : customer
    )
  }

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

  const printActions: IPrintAction[] = [
    {
      name: 'settleByCompanyLawyer',
      label: local.settleByCompanyLawyer,
    },
    {
      name: 'settleByCustomerLawyer',
      label: local.settleByCustomerLawyer,
    },
    {
      name: 'settleByGeneralLawyer',
      label: local.settleByGeneralLawyer,
    },
    {
      name: 'stopLegalAffairs',
      label: local.stopLegalAffairs,
    },
  ]

  useEffect(() => {
    return () => {
      dispatch(searchFilters({}))
    }
  }, [])

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
    if (slectedPrintAction) {
      window.print()
    }
  }, [slectedPrintAction])

  const hasCourtSession = (data: DefaultedCustomer) =>
    data.status !== 'financialManagerReview' && data[data.status]

  const renderCourtField = (customer: DefaultedCustomer, name: string) => {
    if (!hasCourtSession(customer)) {
      return ''
    }

    return customer[customer.status][name]
  }

  const handleActionClick = (actionName: string) => {
    const action = printActions.find(
      (printAction) => printAction.name === actionName
    )

    setSlectedPrintAction(action)
  }

  const tableMapper: TableMapperItem[] = [
    {
      title: local.customerId,
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
      title: local.caseNumber,
      key: 'caseNumber',
      render: (data) => data.caseNumber,
    },
    {
      title: local.court,
      key: 'court',
      render: (data) => data.court,
    },
    {
      title: local.confinementNumber,
      key: 'confinementNumber',
      render: (data) => renderCourtField(data, 'confinementNumber'),
    },
    {
      title: local.courtSessionType,
      key: '',
      render: (data) => (hasCourtSession(data) ? local[data.status] : ''),
    },
    {
      title: local.courtSessionDate,
      key: '',
      render: (data) =>
        hasCourtSession(data)
          ? timeToArabicDate(data[data.status].date, true)
          : '',
    },
    {
      title: local.theDecision,
      key: '',
      render: (data) => renderCourtField(data, 'decision'),
    },
    {
      title: local.caseStatusSummary,
      key: 'caseStatusSummary',
      render: (data) => data.caseStatusSummary,
    },
    {
      title: '',
      key: 'printActions',
      render: (data) => (
        <LegalPrintActionsCell
          isOpen={showActionsCustomer?._id === data._id}
          onClick={() => toggleShowActions(data)}
          actions={printActions}
          onActionClick={handleActionClick}
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (data) => (
        <Can I="updateDefaultingCustomer" a="legal">
          <img
            style={{ cursor: 'pointer' }}
            alt="edit"
            src={require('../../Assets/editIcon.svg')}
            onClick={() => {
              history.push({
                pathname: '/legal-affairs/customer-actions',
                state: { customer: data },
              })
            }}
          />
        </Can>
      ),
    },
  ]

  const getCustomers = () => {
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
      <div className="print-none">
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
              searchKeys={['keyword', 'legal-status', 'dateFromTo']}
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
                }}
              />
            )}
          </Card.Body>
        </Card>
      </div>

      {slectedPrintAction && showActionsCustomer && (
        <LegalSettlement
          action={slectedPrintAction}
          customer={showActionsCustomer}
        />
      )}
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

export default connect(mapStateToProps)(LegalCustomersList)

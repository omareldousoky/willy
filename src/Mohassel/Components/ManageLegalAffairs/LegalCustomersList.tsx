import React, { FunctionComponent, useEffect, useState } from 'react'

import { Button, Card, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Loader } from '../../../Shared/Components/Loader'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import {
  getErrorMessage,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import Can from '../../config/Can'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from './manageLegalAffairsInitials'
import { IPrintAction, TableMapperItem } from './types'
import { DefaultedCustomer } from './defaultingCustomersList'
import LegalPrintActionsCell from './LegalPrintActionsCell'
import LegalSettlementPdfTemp from '../pdfTemplates/LegalSettlement'
import LegalSettlementForm from './LegalSettlementForm'
import { getSettlementFees } from '../../Services/APIs/LegalAffairs/defaultingCustomers'

interface ISettlementFees {
  penaltyFees: number
  courtFees: number
}

const LegalCustomersList: FunctionComponent = () => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const [
    settlementCustomer,
    setSettlementCustomer,
  ] = useState<DefaultedCustomer | null>(null)

  const [settlementFees, setSettlementFees] = useState<ISettlementFees | null>(
    null
  )
  const [isSettlementLoading, setIsSettlementLoading] = useState(false)

  const data = useSelector((state: any) => state.search.data)
  const error = useSelector((state: any) => state.search.error)
  const loading = useSelector((state: any) => state.search.loading)
  const totalCount = useSelector((state: any) => state.search.totalCount)

  const history = useHistory()
  const dispatch = useDispatch()

  const tabs = manageLegalAffairsArray()
  const url = 'legal-affairs'

  useEffect(() => {
    return () => {
      dispatch(searchFilters({}))
    }
  }, [])

  const getFees = async () => {
    if (!settlementCustomer) {
      return
    }

    setIsSettlementLoading(true)

    const settlementFeesRes = await getSettlementFees(settlementCustomer.loanId)
    if (settlementFeesRes.status === 'success') {
      setSettlementFees({
        penaltyFees: settlementFeesRes.body?.penaltyFees ?? 0,
        courtFees: settlementFeesRes.body?.courtFees ?? 0,
      })
    } else {
      Swal.fire('error', getErrorMessage(error), 'error')
    }

    setIsSettlementLoading(false)
  }

  useEffect(() => {
    getFees()
  }, [settlementCustomer])

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

  const hasCourtSession = (data: DefaultedCustomer) =>
    data.status !== 'financialManagerReview' && data[data.status]

  const renderCourtField = (customer: DefaultedCustomer, name: string) => {
    if (!hasCourtSession(customer)) {
      return ''
    }

    return customer[customer.status][name]
  }

  const toggleShowActions = (customer: DefaultedCustomer) => {
    setSettlementCustomer((previousValue) =>
      previousValue?._id === customer._id ? null : customer
    )
  }

  const hideSettlementModal = () => {
    setSettlementCustomer(null)
    setSettlementFees(null)
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
    {
      title: '',
      key: 'legalSettlement',
      render: (data) => (
        <button
          className="btn clickable-action rounded-0 border-right"
          onClick={() => toggleShowActions(data)}
        >
          {local.registerSettlement}
        </button>
      ),
    },
  ]

  return (
    <>
      <div className="print-none">
        <HeaderWithCards
          header={local.legalAffairs}
          array={tabs}
          active={tabs.map((item) => item.icon).indexOf('legal-actions')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={loading || isSettlementLoading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.lateCustomers}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfUsers + ` (${totalCount || 0})`}
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
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
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

      {/* {
        <LegalSettlementPdfTemp/>
      } */}

      {settlementCustomer && settlementFees && (
        <Modal
          show={!!settlementCustomer && !!settlementFees}
          onHide={hideSettlementModal}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.legalSettlement}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LegalSettlementForm
              settlementFees={settlementFees}
              customerId={settlementCustomer._id}
              onSubmit={hideSettlementModal}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideSettlementModal}>
              {local.cancel}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default LegalCustomersList

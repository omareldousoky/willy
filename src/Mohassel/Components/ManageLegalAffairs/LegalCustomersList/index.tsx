import React, {
  FunctionComponent,
  useEffect,
  useState,
  ChangeEvent,
} from 'react'

import { Button, Card, Form, FormCheck, Modal, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Loader } from '../../../../Shared/Components/Loader'
import { search, searchFilters } from '../../../../Shared/redux/search/actions'
import {
  getErrorMessage,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import ability from '../../../config/ability'
import Can from '../../../config/Can'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import local from '../../../../Shared/Assets/ar.json'
import Search from '../../../../Shared/Components/Search/search'
import HeaderWithCards from '../../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from '../manageLegalAffairsInitials'
import { TableMapperItem } from '../types'
import { DefaultedCustomer } from '../defaultingCustomersList'
import LegalSettlementForm, {
  ISettlementFormValues,
} from './LegalSettlementForm'
import {
  getSettlementFees,
  reviewLegalCustomer,
} from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import { IFormField } from '../../../../Shared/Components/Form/types'
import { defaultValidationSchema } from '../../../../Shared/validations'
import AppForm from '../../../../Shared/Components/Form'
import UploadLegalCustomers from './UploadCustomersForm'

interface ISettlementFees {
  penaltyFees: number
  courtFees: number
}

type AdminType =
  | 'branchManagerReview'
  | 'areaSupervisorReview'
  | 'areaManagerReview'
  | 'financialManagerReview'

export interface ReviewReqBody {
  type: AdminType
  notes: string
  ids: string[]
}

export interface SettlementCustomer extends DefaultedCustomer {
  settlement: ISettlementFormValues
}

const adminTypes = [
  {
    value: 'branchManagerReview',
    text: local.branchManagerReview,
    permission: 'branchManagerReview',
    key: 'legal',
  },
  {
    value: 'areaManagerReview',
    text: local.areaManagerReview,
    permission: 'areaManagerReview',
    key: 'legal',
  },
  {
    value: 'areaSupervisorReview',
    text: local.areaSupervisorReview,
    permission: 'areaSupervisorReview',
    key: 'legal',
  },
  {
    value: 'financialManagerReview',
    text: local.financialManagerReview,
    permission: 'financialManagerReview',
    key: 'legal',
  },
]

const LegalCustomersList: FunctionComponent = () => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const [
    customerForSettlement,
    setCustomerForSettlement,
  ] = useState<SettlementCustomer | null>(null)

  const [
    customerForView,
    setCustomerForView,
  ] = useState<DefaultedCustomer | null>(null)

  const [customerIdsForBulkAction, setCustomerIdsForBulkAction] = useState<
    string[]
  >([])

  const [customerIdForReview, setCustomerIdForReview] = useState<string | null>(
    null
  )

  const [settlementFees, setSettlementFees] = useState<ISettlementFees | null>(
    null
  )

  const [isSettlementLoading, setIsSettlementLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const data = useSelector((state: any) => state.search.data) || []
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
    if (!customerForSettlement) {
      return
    }

    setIsSettlementLoading(true)

    const settlementFeesRes = await getSettlementFees(
      customerForSettlement.loanId
    )
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
  }, [customerForSettlement])

  const getLegalCustomers = () =>
    dispatch(
      search({
        size,
        from,
        url,
      })
    )

  useEffect(() => {
    getLegalCustomers()

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

  const toggleShowActions = (customer: SettlementCustomer) => {
    setCustomerForSettlement((previousValue) =>
      previousValue?._id === customer._id ? null : customer
    )
  }

  const hideSettlementModal = () => {
    setCustomerForSettlement(null)
    setSettlementFees(null)
  }

  const toggleSelectAllCustomers = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      const allCustomerIds = data.map(
        (customer: DefaultedCustomer) => customer._id
      )

      setCustomerIdsForBulkAction(allCustomerIds)
    } else {
      setCustomerIdsForBulkAction([])
    }
  }

  const toggleSelectCustomer = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      setCustomerIdsForBulkAction((previousValue) => [...previousValue, id])
    } else {
      setCustomerIdsForBulkAction((previousValue) =>
        previousValue.filter((prevId) => prevId !== id)
      )
    }
  }

  const reviewFormFields: IFormField[] = [
    {
      name: 'type',
      type: 'select',
      label: local.roleType,
      options: adminTypes
        .filter((type) => ability.can(type.permission, type.key))
        .map((type) => ({
          value: type.value,
          label: type.text,
        })),
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'notes',
      type: 'textarea',
      label: local.addNotes,
      validation: defaultValidationSchema,
    },
  ]

  const handleReviewCustomerSubmit = async (values: {
    type: AdminType
    notes: string
  }) => {
    if (!customerIdForReview?.length) {
      return
    }

    const reviewReqBody: ReviewReqBody = {
      ids: [customerIdForReview],
      ...values,
    }

    const response = await reviewLegalCustomer(reviewReqBody)

    if (response.status === 'success') {
      Swal.fire({
        title: `${local.done} ${local.review}`,
        icon: 'success',
        confirmButtonText: local.end,
      })
      getLegalCustomers()
    } else {
      Swal.fire(local.error, getErrorMessage(response.error.error), 'error')
    }

    setCustomerIdForReview(null)
  }

  const selectFieldMapper: TableMapperItem = {
    title: () => (
      <FormCheck
        type="checkbox"
        onChange={toggleSelectAllCustomers}
        checked={
          !!customerIdsForBulkAction.length &&
          customerIdsForBulkAction.length === data.length
        }
      />
    ),
    key: 'selected',
    render: (data) => (
      <FormCheck
        type="checkbox"
        checked={!!customerIdsForBulkAction.find((id) => id === data._id)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          toggleSelectCustomer(e, data._id)
        }
      />
    ),
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
      key: 'courtSessionType',
      render: (data) => (hasCourtSession(data) ? local[data.status] : ''),
    },
    {
      title: local.caseStatusSummary,
      key: 'caseStatusSummary',
      render: (data) => data.caseStatusSummary,
    },
    {
      title: local.settlementStatus,
      key: 'settlementStatus',
      render: (data) =>
        data.settlement
          ? local[data.settlement.settlementStatus]
          : local.notDone,
    },
  ]

  const tableActionsMapper: TableMapperItem[] = [
    {
      title: '',
      key: 'view',
      render: (data) =>
        (data.branchManagerReview ||
          data.areaManagerReview ||
          data.areaSupervisorReview ||
          data.financialManagerReview) && (
          <img
            style={{ cursor: 'pointer' }}
            title={local.logs}
            src={require('../../../Assets/view.svg')}
            onClick={() => {
              setCustomerForView(data)
            }}
          />
        ),
    },
    {
      title: '',
      key: 'actions',
      render: (data) => (
        <Can I="updateDefaultingCustomer" a="legal">
          <button
            className="btn clickable-action rounded-0 p-0 font-weight-normal"
            style={{ color: '#2f2f2f', fontSize: '.9rem' }}
            onClick={() =>
              history.push({
                pathname: '/legal-affairs/customer-actions',
                state: { customer: data },
              })
            }
          >
            {local.registerLegalAction}
          </button>
        </Can>
      ),
    },
    {
      title: '',
      key: 'legalSettlement',
      render: (data) => (
        <Can I="updateSettlement" a="legal">
          <div className="d-flex align-items-center p-1">
            <button
              className="btn clickable-action rounded-0 p-0 font-weight-normal mr-2"
              style={{ color: '#2f2f2f', fontSize: '.9rem' }}
              onClick={() => toggleShowActions(data)}
            >
              {local.registerSettlement}
            </button>

            {data.settlement && (
              <img
                title={local.read}
                className="clickable"
                src={require('../../../Assets/check-circle.svg')}
                onClick={() => {
                  setCustomerIdForReview(data._id)
                }}
              />
            )}
          </div>
        </Can>
      ),
    },
  ]

  const renderLogRow = (key: string) =>
    !!customerForView &&
    !!customerForView[key] && (
      <tr>
        <td>{timeToArabicDate(customerForView[key].at, true)}</td>
        <td>{local[key]}</td>
        <td>{customerForView[key]?.userName}</td>
        <td style={{ wordBreak: 'break-word' }}>
          {customerForView[key]?.notes}
        </td>
      </tr>
    )

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
                  {local.legalAffairs}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfUsers + ` (${totalCount || 0})`}
                </span>
              </div>

              <div>
                <Button
                  className="big-button ml-2"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  {local.uploadDefaultingCustomers}
                </Button>
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
                mappers={[
                  selectFieldMapper,
                  ...tableMapper,
                  ...tableActionsMapper,
                ]}
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

      {customerForSettlement && settlementFees && (
        <Modal
          show={!!customerForSettlement && !!settlementFees}
          onHide={hideSettlementModal}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.legalSettlement}</Modal.Title>
          </Modal.Header>
          <div className="px-5 py-4">
            <Modal.Body className="p-0">
              <LegalSettlementForm
                settlementFees={settlementFees}
                onSubmit={() => {
                  getLegalCustomers()
                  hideSettlementModal()
                }}
                customerId={customerForSettlement._id}
                customerSettlement={customerForSettlement.settlement}
              />
            </Modal.Body>
          </div>
        </Modal>
      )}

      {customerForView && (
        <Modal
          show={!!customerForView}
          onHide={() => setCustomerForView(null)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.logs}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <thead>
                <tr>
                  <th>{local.reviewDate}</th>
                  <th>{local.reviewStatus}</th>
                  <th>{local.doneBy}</th>
                  <th>{local.comments}</th>
                </tr>
              </thead>
              <tbody>
                {adminTypes.map((adminType) =>
                  customerForView ? renderLogRow(adminType.value) : undefined
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setCustomerForView(null)}
            >
              {local.cancel}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {customerIdForReview && (
        <Modal
          show={!!customerIdForReview}
          onHide={() => setCustomerIdForReview(null)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.settlementTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AppForm
              formFields={reviewFormFields}
              onSubmit={(values) => handleReviewCustomerSubmit(values)}
              onCancel={() => setCustomerIdForReview(null)}
              options={{
                wideBtns: true,
                submitBtnText: local.reviewSettlement,
              }}
            />
          </Modal.Body>
        </Modal>
      )}

      <Modal
        show={isUploadModalOpen}
        onHide={() => setIsUploadModalOpen(false)}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{local.uploadDefaultingCustomers}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadLegalCustomers
            onCancel={() => setIsUploadModalOpen(false)}
            onSubmit={(response) => {
              setIsUploadModalOpen(false)
              getLegalCustomers()
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default LegalCustomersList

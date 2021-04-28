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
import {
  search,
  searchFilters as searchFiltersAction,
} from '../../../../Shared/redux/search/actions'
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
import { AdminType, ReviewReqBody, SettledCustomer, SettlementFormValues, SettlementInfo, TableMapperItem } from '../types'
import { DefaultedCustomer, ManagerReviews } from '../defaultingCustomersList'
import LegalSettlementForm, {
} from './LegalSettlementForm'
import {
  getSettlementFees,
  reviewLegalCustomer,
} from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import { FormField } from '../../../../Shared/Components/Form/types'
import { defaultValidationSchema } from '../../../../Shared/validations'
import AppForm from '../../../../Shared/Components/Form'
import UploadLegalCustomers from './UploadCustomersForm'
import LegalSettlementPdfTemp from '../../pdfTemplates/LegalSettlement'
import { Branch } from '../../../../Shared/Services/interfaces'
import { getBranch } from '../../../Services/APIs/Branch/getBranch'
import { getManagerHierarchy } from '../../../Services/APIs/ManagerHierarchy/getManagerHierarchy'
import { Managers } from '../../managerHierarchy/branchBasicsCard'
import managerTypes from '../configs/managerTypes'


const LegalCustomersList: FunctionComponent = () => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const [
    customerForSettlement,
    setCustomerForSettlement,
  ] = useState<SettledCustomer | null>(null)
  const [settlementInfo, setSettlementInfo] = useState<SettlementInfo | null>(
    null
  )

  const [
    customerForView,
    setCustomerForView,
  ] = useState<SettledCustomer | null>(null)

  const [customersForBulkAction, setCustomersForBulkAction] = useState<
    SettledCustomer[]
  >([])

  const [customersForReview, setCustomersForReview] = useState<
    SettledCustomer[] | null
  >(null)

  const [
    customerForPrint,
    setCustomerForPrint,
  ] = useState<SettledCustomer | null>(null)
  const [branchForPrint, setBranchForPrint] = useState<Branch | null>(null)
  const [managersForPrint, setManagersForPrint] = useState<Managers | null>(
    null
  )

  const [isSettlementLoading, setIsSettlementLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const data: SettledCustomer[] =
    useSelector((state: any) => state.search.data) || []
  const error: string = useSelector((state: any) => state.search.error)
  const loading: boolean = useSelector((state: any) => state.loading)
  const totalCount = useSelector((state: any) => state.search.totalCount)
  const searchFilters = useSelector((state: any) => state.searchFilters)

  const history = useHistory()
  const dispatch = useDispatch()

  const tabs = manageLegalAffairsArray()
  const url = 'legal-affairs'

  const canReview = managerTypes.some((type) =>
    ability.can(type.permission, type.key)
  )

  useEffect(() => {
    return () => {
      dispatch(searchFiltersAction({}))
    }
  }, [])

  useEffect(() => {
    const fetchBranch = async () => {
      if (!customerForPrint?.customerBranchId) {
        return
      }

      const response = (await getBranch(
        customerForPrint.customerBranchId
      )) as any

      if (response.status === 'success') {
        setBranchForPrint(response.body?.data as Branch)
      } else {
        Swal.fire('error', getErrorMessage(response.error.error), 'error')
      }
    }

    const fetchManagerHierarchy = async () => {
      if (!customerForPrint?.customerBranchId) {
        return
      }

      const response = await getManagerHierarchy(
        customerForPrint.customerBranchId
      )

      if (response.status === 'success') {
        setManagersForPrint(response.body?.data as Managers)
      } else {
        Swal.fire('error', getErrorMessage(response.error.error), 'error')
      }
    }

    if (customerForPrint) {
      fetchBranch()
      fetchManagerHierarchy()
    }
  }, [customerForPrint])

  useEffect(() => {
    if (branchForPrint && managersForPrint) {
      window.print()
    }
  }, [branchForPrint, managersForPrint])

  useEffect(() => {
    const fetchSettlementFees = async () => {
      if (!customerForSettlement) {
        return
      }

      setIsSettlementLoading(true)

      const response = await getSettlementFees(customerForSettlement._id)

      if (response.status === 'success') {
        setSettlementInfo({
          penaltyFees: response.body?.penaltyFees ?? 0,
          courtFees: response.body?.courtFees ?? 0,
          lawyerCardURL: response.body?.lawyerCardURL,
          criminalScheduleURL: response.body?.criminalScheduleURL,
          caseDataAcknowledgmentURL: response.body?.caseDataAcknowledgmentURL,
          decreePhotoCopyURL: response.body?.decreePhotoCopyURL,
        })
      } else {
        Swal.fire('error', getErrorMessage(response.error.error), 'error')
      }

      setIsSettlementLoading(false)
    }

    fetchSettlementFees()
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
  }, [dispatch, from, size])

  useEffect(() => {
    if (error) {
      Swal.fire('error', getErrorMessage(error), 'error')
    }
  }, [error])

  const hasCourtSession = (data: DefaultedCustomer) =>
    data.status !== 'financialManagerReview' && data[data.status]

  const renderCourtField = (customer: DefaultedCustomer, name: string) => {
    if (!hasCourtSession(customer)) {
      return ''
    }

    return customer[customer.status][name]
  }

  const toggleCustomerForSettlement = (customer: SettledCustomer) => {
    setCustomerForSettlement((previousValue) =>
      previousValue?._id === customer._id ? null : customer
    )
  }

  const hideSettlementModal = () => {
    setCustomerForSettlement(null)
    setSettlementInfo(null)
  }

  const toggleSelectAllCustomers = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      setCustomersForBulkAction([...data])
    } else {
      setCustomersForBulkAction([])
    }
  }

  const toggleSelectCustomer = (
    e: ChangeEvent<HTMLInputElement>,
    customer: SettledCustomer
  ) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      setCustomersForBulkAction((previousValue) => [...previousValue, customer])
    } else {
      setCustomersForBulkAction((previousValue) =>
        previousValue.filter(
          (prevCustomer) => prevCustomer?._id !== customer._id
        )
      )
    }
  }

  const availableManagerReview = (customers: SettledCustomer[] | null) =>
    managerTypes.filter(
      (type) =>
        ability.can(type.permission, type.key) &&
        !customers?.find(
          (customer) => customer.settlement && customer.settlement[type.value]
        )
    )
  const reviewFormFields: FormField[] = [
    {
      name: 'type',
      type: 'select',
      label: local.roleType,
      options: availableManagerReview(customersForReview).map((type) => ({
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
    if (!customersForReview?.length) {
      return
    }

    const reviewReqBody: ReviewReqBody = {
      ids: customersForReview.map((customer) => customer._id),
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
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }

    setCustomersForReview(null)
  }

  const selectFieldMapper: TableMapperItem = {
    title: () => (
      <FormCheck
        type="checkbox"
        onChange={toggleSelectAllCustomers}
        checked={
          !!customersForBulkAction.length &&
          customersForBulkAction.length === data.length
        }
        disabled={!searchFilters.reviewer}
      />
    ),
    key: 'selected',
    render: (data: SettledCustomer) => (
      <FormCheck
        type="checkbox"
        checked={
          !!customersForBulkAction.find((customer) => customer._id === data._id)
        }
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          toggleSelectCustomer(e, data)
        }
        disabled={!searchFilters.reviewer}
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
            className="clickable"
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
      title: local.creationDate,
      key: 'creationDate',
      render: (data) =>
        data.created.at ? timeToArabicDate(data.created.at, true) : '',
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
      title: local.settlementStatus,
      key: 'settlementStatus',
      render: (data) =>
        data.settlement
          ? local[data.settlement.settlementStatus]
          : local.notDone,
    },
  ]

  const hasReviews = (settlement: SettlementFormValues & ManagerReviews) =>
    settlement.branchManagerReview ||
    settlement.areaManagerReview ||
    settlement.areaSupervisorReview ||
    settlement.financialManagerReview

  const tableActionsMapper: TableMapperItem[] = [
    {
      title: '',
      key: 'view',
      render: (data: SettledCustomer) =>
        data.settlement &&
        hasReviews(data.settlement) && (
          <img
            title={local.logs}
            className="clickable"
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
      render: (data: SettledCustomer) => (
        <div className="d-flex align-items-center p-1">
          <Can I="updateSettlement" a="legal">
            <button
              className="btn clickable-action rounded-0 p-0 font-weight-normal mr-2"
              style={{ color: '#2f2f2f', fontSize: '.9rem' }}
              onClick={() => toggleCustomerForSettlement(data)}
            >
              {local.registerSettlement}
            </button>
          </Can>

          {canReview &&
            data.settlement &&
            !!availableManagerReview([data]).length && (
              <img
                title={local.read}
                className="clickable mr-2"
                src={require('../../../Assets/check-circle.svg')}
                onClick={() => {
                  setCustomersForReview([data])
                }}
              />
            )}

          {data.settlement?.settlementStatus === 'reviewed' && (
            <img
              title={local.print}
              className="clickable"
              style={{ maxWidth: 18 }}
              src={require('../../../Assets/green-download.svg')}
              onClick={() => {
                setCustomerForPrint(data)
              }}
            />
          )}
        </div>
      ),
    },
  ]

  const renderLogRow = (key: string) =>
    !!customerForView?.settlement &&
    !!customerForView.settlement[key] && (
      <tr>
        <td>{timeToArabicDate(customerForView.settlement[key].at, true)}</td>
        <td>{local[key]}</td>
        <td>{customerForView.settlement[key]?.userName}</td>
        <td style={{ wordBreak: 'break-word' }}>
          {customerForView.settlement[key]?.notes}
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
                {canReview && (
                  <Button
                    className="big-button ml-2"
                    onClick={() =>
                      setCustomersForReview([...customersForBulkAction])
                    }
                    disabled={!customersForBulkAction?.length}
                  >
                    {local.read}
                  </Button>
                )}

                <Can I="updateSettlement" a="legal">
                  <Button
                    className="big-button ml-2"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    {local.uploadDefaultingCustomers}
                  </Button>
                </Can>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={[
                'keyword',
                'dateFromTo',
                'legal-status',
                'defaultingCustomerStatus',
              ]}
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
                data={data}
                url={url}
                changeNumber={(key: string, number: number) => {
                  if (key === 'size') setSize(number)
                  if (key === 'from') setFrom(number)
                }}
                pagination
              />
            )}
          </Card.Body>
        </Card>

        {customerForSettlement && settlementInfo && (
          <Modal
            show={!!customerForSettlement && !!settlementInfo}
            onHide={hideSettlementModal}
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>{local.legalSettlement}</Modal.Title>
            </Modal.Header>
            <div className="px-5 py-4">
              <Modal.Body className="p-0">
                <LegalSettlementForm
                  settlementInfo={settlementInfo}
                  onSubmit={() => {
                    getLegalCustomers()
                    hideSettlementModal()
                  }}
                  onCancel={hideSettlementModal}
                  customer={customerForSettlement}
                />
              </Modal.Body>
            </div>
          </Modal>
        )}

        {!!customerForView && (
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
                  {managerTypes.map((adminType) =>
                    renderLogRow(adminType.value)
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

        {!!customersForReview?.length && (
          <Modal
            show={!!customersForReview?.length}
            onHide={() => setCustomersForReview(null)}
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>{local.settlementTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AppForm
                formFields={reviewFormFields}
                onSubmit={(values) => handleReviewCustomerSubmit(values)}
                onCancel={() => setCustomersForReview(null)}
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
      </div>

      {customerForPrint && branchForPrint && managersForPrint && (
        <LegalSettlementPdfTemp
          branchName={branchForPrint.name}
          customer={customerForPrint}
          managers={managersForPrint}
        />
      )}
    </>
  )
}

export default LegalCustomersList

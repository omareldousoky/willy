import React, {
  FunctionComponent,
  useEffect,
  useState,
  ChangeEvent,
} from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import FormCheck from 'react-bootstrap/FormCheck'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

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
import {
  ConvictedReportReqBody,
  JudgeCustomersFormValues,
  ManagerReviewEnum,
  ReviewReqBody,
  SettledCustomer,
  SettlementFormValues,
  SettlementInfo,
  TableMapperItem,
} from '../types'
import { DefaultedCustomer, ManagerReviews } from '../defaultingCustomersList'
import LegalSettlementForm from './LegalSettlementForm'
import {
  getSettlementFees,
  reviewLegalCustomer,
} from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import { FormField } from '../Form/types'
import { defaultValidationSchema } from '../validations'
import AppForm from '../Form'
import UploadLegalCustomers from './UploadCustomersForm'
import LegalSettlementPdfTemp from '../../pdfTemplates/LegalSettlement'
import { Branch } from '../../../../Shared/Services/interfaces'
import { getBranch } from '../../../Services/APIs/Branch/getBranch'
import managerTypes from '../configs/managerTypes'
import {
  handleUpdateSuccess,
  hasCourtSession,
  renderCourtField,
} from '../utils'
import JudgeLegalCustomersForm from '../JudgeLegalCustomersForm'
import LegalJudgePdfTemp from '../../pdfTemplates/LegalJudge.tsx'
import { getConvictedReport } from '../../../Services/APIs/Reports/legal'

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

  const [
    customersForConvictedReport,
    setCustomersForConvictedReport,
  ] = useState<DefaultedCustomer[] | null>(null)

  const [convictedReportInfo, setConvictedReportInfo] = useState({
    policeStation: '',
    governorate: '',
  })

  const [isSettlementLoading, setIsSettlementLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false)

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

  const isCurrentUserManager = managerTypes.some((type) =>
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

    if (customerForPrint) {
      fetchBranch()
    }
  }, [customerForPrint])

  useEffect(() => {
    if (branchForPrint || !!customersForConvictedReport) {
      window.print()
    }

    window.onafterprint = () => {
      setCustomerForPrint(null)
      setBranchForPrint(null)
      setCustomersForConvictedReport(null)
      setConvictedReportInfo({ policeStation: '', governorate: '' })
    }
  }, [branchForPrint, customersForConvictedReport])

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
        ...searchFilters,
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

  const handleUpdateCustomerSuccess = (label = '') => {
    handleUpdateSuccess(getLegalCustomers, label)
  }

  const handleReviewCustomerSubmit = async (values: {
    type: ManagerReviewEnum
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
      handleUpdateCustomerSuccess(local.review)
    } else {
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }

    setCustomersForReview(null)
  }

  const handleJudgeReport = async (values: JudgeCustomersFormValues) => {
    setConvictedReportInfo({
      governorate: values.governorate,
      policeStation: values.policeStation,
    })

    const {
      governorate,
      policeStation,
      dateRange: { from: startDate, to: endDate },
    } = values

    const reqBody: ConvictedReportReqBody = {
      governorate,
      policeStation,
      startDate: startDate ? new Date(startDate).valueOf() : 0,
      endDate: endDate ? new Date(endDate).valueOf() : 0,
    }

    const response = await getConvictedReport(reqBody)

    if (response.status === 'success') {
      setIsJudgeModalOpen(false)
      setCustomersForConvictedReport(response.body?.result ?? [])
    } else {
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }
  }

  const tableMapper: TableMapperItem[] = [
    {
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
      render: (customer: SettledCustomer) => (
        <FormCheck
          type="checkbox"
          checked={
            !!customersForBulkAction.find(
              (selectedCustomer) => selectedCustomer._id === customer._id
            )
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            toggleSelectCustomer(e, customer)
          }
          disabled={!searchFilters.reviewer}
        />
      ),
    },
    {
      title: local.customerId,
      key: 'customerKey',
      render: (customer: SettledCustomer) =>
        ability.can('getCustomer', 'customer') ? (
          <Button
            type="button"
            variant="default"
            title={local.customerId}
            className="p-0"
            onClick={() =>
              history.push('/customers/view-customer', {
                id: customer.customerId,
              })
            }
          >
            {customer.customerKey}
          </Button>
        ) : (
          customer.customerKey
        ),
    },
    {
      title: local.customerName,
      key: 'customerName',
      render: (customer: SettledCustomer) => customer.customerName,
    },
    {
      title: local.creationDate,
      key: 'creationDate',
      render: (customer: SettledCustomer) =>
        customer.created?.at ? timeToArabicDate(customer.created.at, true) : '',
    },
    {
      title: local.caseNumber,
      key: 'caseNumber',
      render: (customer: SettledCustomer & SettlementFormValues) =>
        customer.caseNumber,
    },
    {
      title: local.court,
      key: 'court',
      render: (customer: SettledCustomer & SettlementFormValues) =>
        customer.court,
    },
    {
      title: local.confinementNumber,
      key: 'confinementNumber',
      render: (customer: SettledCustomer) =>
        renderCourtField(customer, 'confinementNumber'),
    },
    {
      title: local.judgementStatus,
      key: 'courtSessionType',
      render: (customer: SettledCustomer) =>
        hasCourtSession(customer) ? local[customer.status] : '',
    },
    {
      title: local.settlementStatus,
      key: 'settlementStatus',
      render: (customer: SettledCustomer) =>
        customer.settlement
          ? local[customer.settlement.settlementStatus]
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
      render: (customer: SettledCustomer) =>
        customer.settlement &&
        hasReviews(customer.settlement) && (
          <Button
            type="button"
            variant="default"
            onClick={() => setCustomerForView(customer)}
            className="p-0"
            title={local.logs}
          >
            <img alt={local.logs} src={require('../../../Assets/view.svg')} />
          </Button>
        ),
    },
    {
      title: '',
      key: 'actions',
      render: (customer: SettledCustomer) => (
        <Can I="updateDefaultingCustomer" a="legal">
          <button
            className="btn clickable-action rounded-0 p-0 font-weight-normal"
            style={{ color: '#2f2f2f', fontSize: '.9rem' }}
            type="button"
            onClick={() =>
              history.push({
                pathname: '/legal-affairs/customer-actions',
                state: { customer },
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
      render: (customer: SettledCustomer) => (
        <div className="d-flex align-items-center p-1">
          <Can I="updateSettlement" a="legal">
            <button
              className="btn clickable-action rounded-0 p-0 font-weight-normal mr-2"
              style={{ color: '#2f2f2f', fontSize: '.9rem' }}
              onClick={() => toggleCustomerForSettlement(customer)}
              type="button"
            >
              {local.registerSettlement}
            </button>
          </Can>

          {isCurrentUserManager &&
            customer.settlement?.settlementStatus === 'reviewed' &&
            !!availableManagerReview([customer]).length && (
              <Button
                type="button"
                variant="default"
                className="mr-2 p-0"
                onClick={() => setCustomersForReview([customer])}
                title={local.read}
              >
                <img
                  alt={local.read}
                  src={require('../../../Assets/check-circle.svg')}
                />
              </Button>
            )}

          {customer.settlement?.financialManagerReview && (
            <Button
              type="button"
              variant="default"
              className="mr-2 p-0"
              onClick={() => setCustomerForPrint(customer)}
              title={local.print}
            >
              <img
                alt={local.print}
                style={{ maxWidth: 18 }}
                src={require('../../../Assets/green-download.svg')}
              />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const judgeActors = [
    'مدير الادارة العامة لتنفيذ الاحكام – قطاع الامن العام',
    'مدير الادارة العامة لتنفيذ الاحكام – مديرية امن القاهرة',
    `رئيس مباحث قسم شرطة ${convictedReportInfo.policeStation} – وحدة تنفيذ الاحكام`,
    'مدير المكتب الفني لوزير الداخلية',
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
                {isCurrentUserManager && (
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

                <Can I="convictedClients" a="report">
                  <Button
                    className="big-button ml-2"
                    onClick={() => setIsJudgeModalOpen(true)}
                  >
                    {local.judgeList}
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
                mappers={[...tableMapper, ...tableActionsMapper]}
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
                    hideSettlementModal()
                    handleUpdateCustomerSuccess()
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
          onHide={() => {
            setIsUploadModalOpen(false)
            getLegalCustomers()
          }}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.uploadDefaultingCustomers}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UploadLegalCustomers
              onCancel={() => {
                setIsUploadModalOpen(false)
                getLegalCustomers()
              }}
              onSubmit={(areAllSucceeded) => {
                if (areAllSucceeded) {
                  setIsUploadModalOpen(false)
                  handleUpdateCustomerSuccess()
                }
              }}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={isJudgeModalOpen}
          onHide={() => setIsJudgeModalOpen(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{local.judgeList}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JudgeLegalCustomersForm
              onSubmit={(values) => {
                handleJudgeReport(values)
              }}
              onCancel={() => {
                setIsJudgeModalOpen(false)
              }}
            />
          </Modal.Body>
        </Modal>
      </div>

      {customerForPrint && branchForPrint && (
        <LegalSettlementPdfTemp
          branchName={branchForPrint.name}
          customer={customerForPrint}
        />
      )}

      {!!customersForConvictedReport &&
        !!convictedReportInfo.governorate &&
        !!convictedReportInfo.policeStation &&
        judgeActors.map((actor, index) => (
          <LegalJudgePdfTemp
            key={index}
            actor={actor}
            customers={customersForConvictedReport}
            governorate={convictedReportInfo.governorate}
            policeStation={convictedReportInfo.policeStation}
          />
        ))}
    </>
  )
}

export default LegalCustomersList

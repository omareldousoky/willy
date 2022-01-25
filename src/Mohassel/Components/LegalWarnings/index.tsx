import React, { useState, useEffect, ChangeEvent } from 'react'
import FormCheck from 'react-bootstrap/FormCheck'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from '../ManageLegalAffairs/manageLegalAffairsInitials'
import local from '../../../Shared/Assets/ar.json'
import {
  ChangeNumberType,
  TableMapperItem,
} from '../../../Shared/Components/DynamicTable/types'
import {
  LegalWarningResponse,
  LegalWarningsSearchRequest,
  LegalWarningType,
  WarningExtraDetailsRespose,
} from '../../../Shared/Models/LegalAffairs'
import {
  getErrorMessage,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import { search as searchAction } from '../../../Shared/redux/search/actions'
import { Loader } from '../../../Shared/Components/Loader'
import SearchForm from '../../../Shared/Components/Search/search'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { LegalWarning } from '../pdfTemplates/LegalWarning'
import { PdfPortal } from '../../../Shared/Components/Common/PdfPortal'
import {
  getWarningExtraDetails,
  setPrintWarningFlag,
} from '../../../Shared/Services/APIs/LegalAffairs/warning'
import { WarningCreationModal } from './WarningCreationModal'
import { loading as loadingAction } from '../../../Shared/redux/loading/actions'
import { LtsIcon } from '../../../Shared/Components'
import { WarningExtraDetailsModal } from './WarningExtraDetailsModal'

export const LegalWarnings = () => {
  const [from, setFrom] = useState(0)
  const [size, setSize] = useState(10)
  const [selectedWarnings, setSelectedWarnings] = useState<
    LegalWarningResponse[]
  >()
  const [
    validSelectedWarningsLength,
    setValidSelectedWarningsLength,
  ] = useState(0)
  const [printWarningType, setPrintWarningType] = useState<LegalWarningType>()
  const [printWarnings, setPrintWarnings] = useState<LegalWarningResponse[]>()
  const [showModal, setShowModal] = useState(false)
  const [showExtraDetailsModal, setExtraDetailsModalView] = useState(false)

  const [
    warningExtraDetails,
    setWarningExtraDetails,
  ] = useState<WarningExtraDetailsRespose>({})

  const history = useHistory<{ id?: string; sme?: boolean }>()
  const dispatch = useDispatch()

  const dispatchActions = {
    search: (data) => dispatch(searchAction(data)),
    setLoading: (data) => dispatch(loadingAction(data)),
  }

  const selectedProps = useSelector((state: any) => ({
    data: state.search.data,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }))

  const { data, totalCount, loading, searchFilters } = selectedProps
  const { search, setLoading } = dispatchActions

  const LEGAL_WARNING_URL = 'legal-warning'

  const hasAddWarningPermission = ability.can('addLegalWarning', 'legal')
  const hasMultiPrintWarningPermission = ability.can(
    'multiPrintLegalWarning',
    'legal'
  )

  const canPrint = (
    target: LegalWarningResponse | LegalWarningResponse[]
  ): boolean => {
    if (hasMultiPrintWarningPermission) return true
    if (!ability.can('printLegalWarning', 'legal')) return false
    // they're all printed and user only has single print permission
    return Array.isArray(target)
      ? target.filter((warning) => warning.printed).length < data.length
      : !target?.printed || false
  }

  const getLegalWarnings = (
    resetFrom?: boolean,
    newSearchFilters?: Record<string, string>
  ) => {
    if (resetFrom) setFrom(0)
    const filters = newSearchFilters
      ? { ...newSearchFilters }
      : { ...searchFilters }

    const request = {
      ...filters,
      from: resetFrom ? 0 : from,
      size,
      url: LEGAL_WARNING_URL,
    }
    setSelectedWarnings(undefined)
    search(request as LegalWarningsSearchRequest)
  }

  const getWarningDetails = async (loanId: string) => {
    setLoading(true)
    const res = await getWarningExtraDetails(loanId)
    if (res.status === 'success') {
      setWarningExtraDetails(res.body)
      setExtraDetailsModalView(true)
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    getLegalWarnings(false, {})
  }, [])

  useEffect(() => {
    // avoid trigger when from == 0
    if (from) getLegalWarnings()
  }, [from, size])

  useEffect(() => {
    if (searchFilters.warningType)
      setPrintWarningType(searchFilters.warningType)
    else setPrintWarningType(undefined)
  }, [searchFilters.warningType])

  useEffect(() => {
    if (printWarnings) window.print()
  }, [printWarnings])

  const print = (warning: LegalWarningResponse) => {
    setPrintWarningType(warning.warningType)
    setPrintWarnings([warning])
  }

  window.onafterprint = async () => {
    if (printWarnings && !searchFilters.printed) {
      const setPrintFlag = await setPrintWarningFlag(
        printWarnings?.map((warning) => warning._id)
      )
      if (setPrintFlag.status === 'success') {
        setLoading(true)
        setTimeout(() => {
          getLegalWarnings(true)
        }, 3500) // wait so print is properly reflected
      }
    }
    setPrintWarnings(undefined)
  }

  const toggleSelectAllValidWarnings = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      const validSelectedWarnings = hasMultiPrintWarningPermission
        ? [...data]
        : data.filter((warning) => canPrint(warning))
      setSelectedWarnings(validSelectedWarnings)
      setValidSelectedWarningsLength(validSelectedWarnings.length)
    } else {
      setSelectedWarnings(undefined)
    }
  }

  const toggleSelectWarning = (
    e: ChangeEvent<HTMLInputElement>,
    warning: LegalWarningResponse
  ) => {
    const isChecked = e.currentTarget.checked

    if (isChecked) {
      setSelectedWarnings([...(selectedWarnings || []), warning])
    } else {
      setSelectedWarnings(
        selectedWarnings?.filter((item) => item._id !== warning._id)
      )
    }
  }

  const manageLegalAffairsTabs = manageLegalAffairsArray()
  const tableMappers: TableMapperItem<LegalWarningResponse>[] = [
    {
      title: () => (
        <FormCheck
          type="checkbox"
          checked={
            !!selectedWarnings?.length &&
            selectedWarnings.length === validSelectedWarningsLength
          }
          onChange={toggleSelectAllValidWarnings}
          disabled={
            !searchFilters?.warningType ||
            !(
              searchFilters?.warningType &&
              printWarningType &&
              (hasMultiPrintWarningPermission || canPrint(data))
            )
          }
        />
      ),
      key: 'selected',
      render: (warning) => (
        <FormCheck
          type="checkbox"
          checked={
            !!selectedWarnings &&
            !!selectedWarnings.find(
              (selectedWarning) => selectedWarning._id === warning._id
            )
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            toggleSelectWarning(e, warning)
          }
          disabled={
            !searchFilters?.warningType ||
            !(
              searchFilters?.warningType &&
              printWarningType &&
              (hasMultiPrintWarningPermission || canPrint(warning))
            )
          }
        />
      ),
    },
    {
      title: local.customerCode,
      key: 'customerCode',
      render: (warning) =>
        ability.can('getCustomer', 'customer') ? (
          <Button
            variant="default"
            className="px-0"
            title={`${local.view} ${local.viewCustomer}`}
            onClick={() =>
              history.push(
                warning.customerType === 'company' ||
                  warning.customerType === 'companyGuarantor'
                  ? '/company/view-company'
                  : '/customers/view-customer',
                {
                  id: warning.customerId,
                }
              )
            }
          >
            {warning.customerKey}
          </Button>
        ) : (
          warning.customerKey
        ),
    },
    {
      title: local.customerName,
      key: 'customerName',
      render: (warning) => warning.customerName,
    },
    {
      title: local.nationalId,
      key: 'nationalId',
      render: (warning) => warning.nationalId || local.notApplicable,
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (warning) =>
        ability.can('getIssuedLoan', 'application') ||
        ability.can('branchIssuedLoan', 'application') ? (
          <Button
            variant="default"
            className="px-0"
            title={`${local.view} ${local.loanDetails}`}
            onClick={() =>
              history.push('/loans/loan-profile', {
                id: warning.loanId,
                sme:
                  warning.customerType === 'company' ||
                  warning.customerType === 'companyGuarantor' ||
                  warning.customerType === 'entitledToSign',
              })
            }
          >
            {warning.loanKey}
          </Button>
        ) : (
          warning.loanKey
        ),
    },
    {
      title: local.creationDate,
      key: 'creationDate',
      render: (warning) =>
        warning.created?.at ? timeToArabicDate(warning.created.at, true) : '',
    },
    {
      title: local.warningType,
      key: 'warningType',
      render: (warning) => local[warning.warningType],
    },
    {
      title: local.actions,
      key: 'actions',
      render: (warning) => {
        const canPrintWarning = canPrint(warning)
        return (
          <>
            <Button
              variant="default"
              onClick={() =>
                warning.loanId && getWarningDetails(warning.loanId)
              }
            >
              <LtsIcon
                name="encoding-files"
                size="25px"
                color="#7dc356"
                tooltipText={local.moreInfo}
              />
            </Button>
            <Button
              variant="default"
              onClick={() => (canPrintWarning ? print(warning) : undefined)}
              disabled={!canPrintWarning}
            >
              <LtsIcon
                name="printer"
                size="25px"
                color={canPrintWarning ? '#7dc356' : '#6c757d'}
              />
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <>
      <HeaderWithCards
        header={local.legalAffairs}
        array={manageLegalAffairsTabs}
        active={manageLegalAffairsTabs
          .map((item) => {
            return item.icon
          })
          .indexOf('warning')}
      />
      <Card className="main-card">
        <Loader type="fullscreen" open={loading} />
        <Card.Body className="p-0">
          <div className="custom-card-header">
            <div className="d-flex align-items-center">
              <Card.Title className="mb-0 mr-3">
                {local.legalWarningsList}
              </Card.Title>
              <span className="font-weight-bold mr-3">
                {local.noOfSelectedWarnings}
                <span
                  className="font-weight-bold"
                  style={{ color: '#7dc356' }}
                >{` (${selectedWarnings?.length || 0})`}</span>
              </span>
            </div>
            <div className="d-flex">
              <Button
                className="big-button mr-3"
                disabled={!hasAddWarningPermission}
                onClick={() =>
                  hasAddWarningPermission ? setShowModal(true) : undefined
                }
              >
                {local.add}&nbsp;{local.warningForCustomer}
              </Button>

              <Button
                onClick={() => {
                  if (selectedWarnings) setPrintWarnings(selectedWarnings)
                }}
                disabled={!selectedWarnings?.length}
                className="big-button"
              >
                {local.downloadPDF}
              </Button>
            </div>
          </div>
          <hr className="dashed-line" />

          <SearchForm
            searchKeys={['keyword', 'warningType', 'branch', 'printed']}
            dropDownKeys={['name', 'key', 'customerKey', 'nationalId']}
            url={LEGAL_WARNING_URL}
            from={from}
            size={size}
            setFrom={(newState: number) => setFrom(newState)}
            resetSelectedItems={() => setSelectedWarnings(undefined)}
          />
          <DynamicTable
            pagination
            url={LEGAL_WARNING_URL}
            from={from}
            size={size}
            totalCount={totalCount}
            mappers={tableMappers}
            data={data}
            changeNumber={(key: ChangeNumberType, number: number) => {
              if (key === 'from') {
                if (!number) getLegalWarnings(true)
                else setFrom(number)
              } else setSize(number)
            }}
          />
        </Card.Body>
      </Card>
      {showModal && (
        <WarningCreationModal
          setShowModal={setShowModal}
          showModal={showModal}
          getLegalWarnings={getLegalWarnings}
        />
      )}
      {showExtraDetailsModal && (
        <WarningExtraDetailsModal
          setShowModal={setExtraDetailsModalView}
          showModal={showExtraDetailsModal}
          resetData={() => setWarningExtraDetails({})}
          extraWarningDetails={warningExtraDetails}
        />
      )}
      {printWarningType && printWarnings && (
        <PdfPortal
          component={
            <LegalWarning type={printWarningType} warnings={printWarnings} />
          }
        />
      )}
    </>
  )
}

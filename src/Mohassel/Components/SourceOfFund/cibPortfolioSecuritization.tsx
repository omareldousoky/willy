import React, { useState, ReactNode, useEffect, FC } from 'react'
import Card from 'react-bootstrap/Card'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import { TableMapperItem } from 'Shared/Components/DynamicTable/types'
import { changeSourceFundCibPortfolio } from 'Shared/Services/APIs/loanApplication/changeSourceFund'
import { loading as loadingAction } from 'Shared/redux/loading/actions'
import { cibExtractions } from 'Shared/Services/APIs/loanApplication/cibExtractions'
import { ActionsIconGroup, LtsIcon } from 'Shared/Components'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import Search from 'Shared/Components/Search/search'

import {
  searchFilters as searchFiltersAction,
  search as searchAction,
} from 'Shared/redux/search/actions'
import { timeToDateyyymmdd, getErrorMessage } from 'Shared/Services/utils'
import { downloadTxtFile } from '../CIB/textFiles'

interface Props {
  branchId?: string
  fromBranch?: boolean
  source: string
}

const CibPortfolioSecuritization: FC<Props> = (props) => {
  const [size, setSize] = useState<number>(10)
  const [from, setFrom] = useState<number>(0)
  const [openModal, setOpenModal] = useState<string>('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedFund, setSelectedFund] = useState<string>('')
  const [oldFilesDate, setOldFilesDate] = useState<string>('')
  const [selectedAll, setSelectedAll] = useState<boolean>(false)
  const dispatch = useDispatch()
  const history = useHistory()

  const { searchFilters, loading, totalCount, loans } = useSelector(
    (state: any) => ({
      searchFilters: state.searchFilters,
      loading: state.loading,
      totalCount: state.search.totalCount,
      loans: state.search.applications,
    })
  )

  const { search, setSearchFilters, setLoading } = {
    search: (data) => dispatch(searchAction(data)),
    setSearchFilters: (data) => dispatch(searchFiltersAction(data)),
    setLoading: (data) => dispatch(loadingAction(data)),
  }

  const addRemoveItemFromChecked = (customerId: string) => {
    if (
      selectedCustomers.findIndex(
        (selectedCustomerId) => selectedCustomerId === customerId
      ) > -1
    ) {
      setSelectedCustomers((prevCustomers) =>
        prevCustomers.filter((el) => el !== customerId)
      )
    } else {
      setSelectedCustomers((prevCustomers) => [...prevCustomers, customerId])
    }
  }

  const getSourceOfFund = (sourceOfFund: string): string => {
    switch (sourceOfFund) {
      case 'tasaheel':
        return local.tasaheel
      case 'cibPortfolioSecuritization':
        return local.cib
      default:
        return ''
    }
  }

  const renderActions = (data) => {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',

        actionPermission: true,
        actionOnClick: () =>
          history.push('/track-loan-applications/loan-profile', {
            id: data.application._id,
          }),
      },
    ]
  }

  const getLoans = async (): Promise<void> => {
    let query = {
      ...searchFilters,
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
      status: 'issued',
      fundSource: props.source,
      type: 'micro',
    }
    if (props.fromBranch) {
      query = { ...query, branchId: props.branchId }
    }
    search(query)
  }

  const getStatus = (status: string): ReactNode => {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      case 'canceled':
        return <div className="status-chip canceled">{local.cancelled}</div>
      default:
        return null
    }
  }

  const mappers: TableMapperItem[] = [
    {
      title: () => (
        <FormCheck
          type="checkbox"
          checked={selectedAll}
          onChange={() => {
            if (selectedAll) {
              setSelectedCustomers([])
              setSelectedAll(false)
            } else {
              setSelectedCustomers([...loans.map((l) => l.id).slice(0, size)])
              setSelectedAll(true)
            }
          }}
        />
      ),
      key: 'selected',
      render: (data) => (
        <FormCheck
          type="checkbox"
          checked={selectedCustomers.includes(data.id)}
          onChange={() => addRemoveItemFromChecked(data.id)}
        />
      ),
    },
    {
      title: local.customerCode,
      key: 'customerCode',
      render: (data) =>
        data.application.product.beneficiaryType === 'individual'
          ? data.application.customer.key
          : data.application.group?.individualsInGroup.map((member) =>
              member.type === 'leader' ? member.customer.key : null
            ),
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
          {data.application.product.beneficiaryType === 'individual' ? (
            data.application.customer.customerName
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map((member) =>
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
      title: local.fundSource,
      key: 'fundSource',
      render: (data) => getSourceOfFund(data.application.fundSource),
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
      title: local.principal,
      key: 'principal',
      render: (data) => data.application.principal,
    },
    {
      title: local.status,
      key: 'status',
      sortable: true,
      render: (data) => getStatus(data.application.status),
    },
    {
      title: '',
      key: 'action',
      render: (data) => (
        <ActionsIconGroup currentId={data._id} actions={renderActions(data)} />
      ),
    },
  ]

  useEffect(() => {
    search({
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
      status: 'issued',
      fundSource: props.source,
      type: 'micro',
    })
    return () => {
      setSearchFilters({})
    }
  }, [])

  useEffect(() => {
    if (from) getLoans()
  }, [from, size])

  useEffect(() => {
    setSearchFilters({})
    getLoans()
    setSelectedCustomers([])
    setSelectedAll(false)
  }, [props.source])

  const getOldFiles = async (): Promise<void> => {
    setOpenModal('')
    setOldFilesDate('')
    setLoading(true)
    const date = new Date(oldFilesDate).valueOf()
    const res = await cibExtractions(date)
    if (res.status === 'success') {
      setLoading(false)
      downloadTxtFile(res.body.loans, false, date)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  const submit = async (): Promise<void> => {
    setOpenModal('')
    setSelectedFund('')
    setSelectedCustomers([])
    setSelectedAll(false)
    setLoading(true)
    const obj = {
      sourceOfFund:
        props.source === 'tasaheel' ? 'cibPortfolioSecuritization' : 'tasaheel',
      loanIds: selectedCustomers,
    }
    const res = await changeSourceFundCibPortfolio(obj)
    if (res.status === 'success') {
      setLoading(false)
      Swal.fire('', local.changeSourceFundSuccess, 'success').then(() =>
        getLoans()
      )
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  return (
    <>
      <Card style={{ margin: '20px 50px' }}>
        <Loader type="fullscreen" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {`${local.from} ${
                  props.source === 'tasaheel'
                    ? local.tasaheel
                    : local.cibPortfolioSecuritization
                } ${local.to} ${
                  props.source === 'tasaheel'
                    ? local.cibPortfolioSecuritization
                    : local.tasaheel
                }`}
              </Card.Title>
              <span className="text-muted">
                {local.noOfSelectedLoans + ` (${selectedCustomers.length})`}
              </span>
            </div>
            <div>
              <Button
                onClick={() => {
                  setOpenModal('changeFund')
                }}
                disabled={!selectedCustomers.length}
                className="big-button"
              >
                {local.changeFund}
                <LtsIcon
                  name="exchange"
                  color={`#${selectedCustomers.length ? 'fff' : '343a40'}`}
                  className="pl-2 align-bottom"
                />
              </Button>
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'dateFromTo', 'branch']}
            dropDownKeys={['name', 'nationalId', 'key', 'code', 'customerKey']}
            searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
            datePlaceholder={local.issuanceDate}
            url="loan"
            from={from}
            size={size}
            status="issued"
            fundSource={props.source}
            hqBranchIdRequest={props.branchId}
          />
          <DynamicTable
            from={from}
            size={size}
            url="loan"
            totalCount={totalCount}
            mappers={mappers}
            pagination
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
      <Modal show={openModal === 'changeFund'} backdrop="static">
        <Modal.Header style={{ padding: '20px 30px' }}>
          <Modal.Title>{local.chooseSourceOfFund}</Modal.Title>
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('')}>
            X
          </div>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px 60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Form.Control
              as="select"
              data-qc="change-fund"
              style={{ marginLeft: 20 }}
              onChange={(e) => setSelectedFund(e.currentTarget.value)}
              value={selectedFund}
            >
              <option value="" data-qc="" />
              <option value={props.source} data-qc={props.source}>
                {props.source === 'tasaheel'
                  ? local.cibPortfolioSecuritization
                  : local.tasaheel}
              </option>
            </Form.Control>
            <Button
              className="big-button"
              data-qc="submit"
              onClick={() => submit()}
              disabled={selectedFund === ''}
            >
              {local.submit}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={openModal === 'downloadOldFiles'} backdrop="static">
        <Modal.Header style={{ padding: '20px 30px' }}>
          <Modal.Title>{local.dateOfFile}</Modal.Title>
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('')}>
            X
          </div>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px 60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Form.Control
              type="date"
              data-qc="download-old-files"
              style={{ marginLeft: 20 }}
              onChange={(e) => setOldFilesDate(e.currentTarget.value)}
            />
            <Button
              className="big-button"
              data-qc="submit"
              onClick={() => getOldFiles()}
              disabled={oldFilesDate === ''}
            >
              {local.submit}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CibPortfolioSecuritization

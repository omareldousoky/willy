import React, { useCallback, useState } from 'react'
import HeaderWithCards from 'Shared/Components/HeaderWithCards/headerWithCards'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'
import * as local from 'Shared/Assets/ar.json'
import Card from 'react-bootstrap/esm/Card'
import { Loader } from 'Shared/Components/Loader'
import Form from 'react-bootstrap/esm/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Branch, LoanOfficer } from 'Shared/Services/interfaces'
import {
  searchLoanOfficer,
  searchLoanOfficerLogs,
} from 'Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import Swal from 'sweetalert2'
import {
  getBranchFromCookie,
  getDateAndTime,
  getErrorMessage,
} from 'Shared/Services/utils'
import Button from 'react-bootstrap/esm/Button'
import { manageAccountsArray } from 'Mohassel/Components/ManageAccounts/manageAccountsInitials'
import { searchBranches } from 'Shared/Services/APIs/Branch/searchBranches'
import { LogsInput } from './types'
import { CustomizedAsyncSelect } from './CustomizedAsyncSelect'

export const LoanOfficersTransfers = () => {
  const branchId = getBranchFromCookie()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [logsInput, setLogsInput] = useState<LogsInput>({
    oldRepresentativeId: '',
    newRepresentativeId: '',
    oldCustomerBranchId: '',
    newCustomerBranchId: '',
    customerKey: null,
    from: 0,
    size: 10,
  })
  const [logsData, setLogsData] = useState({ totalCount: 0, data: [] })

  const getLogs = async (newInput) => {
    setIsLoading(true)
    const res = await searchLoanOfficerLogs(newInput)
    if (res.status === 'success') {
      setLogsData({ ...res.body })
    } else Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    setIsLoading(false)
  }

  const getLoanOfficers = async (inputValue: string) => {
    const res = await searchLoanOfficer({
      from: 0,
      size: 100,
      name: inputValue,
      status: 'active',
      branchId: branchId === 'hq' ? '' : branchId,
    })
    if (res.status === 'success') {
      setLoanOfficers([...res.body.data])
      return res.body.data
    }
    setLoanOfficers([])
    Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    return []
  }
  const getBranches = async (inputValue: string) => {
    const res = await searchBranches({ from: 0, size: 1000, name: inputValue })

    if (res.status === 'success') {
      setBranches([...res.body.data])
      return res.body.data
    }
    setBranches([])
    Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    return []
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      getLogs(logsInput)
    },
    [logsInput]
  )

  const mappers = [
    {
      title: local.customerName,
      key: 'name',
      render: (data) => data.customerName,
    },
    {
      title: local.oldRepresentativeName,
      key: 'oldRepresentativeName',
      render: (data) => data.oldRepresentativeName || local.noDataAvaliable,
    },
    {
      title: local.newRepresentativeName,
      key: 'newRepresentativeName',
      render: (data) => data.newRepresentativeName || local.noDataAvaliable,
    },
    {
      title: local.oldCustomerBranch,
      key: 'oldCustomerBranchId',
      render: (data) => data.oldCustomerBranchName || local.noDataAvaliable,
    },
    {
      title: local.newCustomerBranch,
      key: 'newCustomerBranchId',
      render: (data) => data.newCustomerBranchName || local.noDataAvaliable,
    },
    {
      title: local.actionDate,
      key: 'updatedAt',
      render: (data) =>
        data.updated?.at
          ? getDateAndTime(data.updated?.at)
          : local.noDataAvaliable,
    },
    {
      title: local.updatedBy,
      key: 'userName',
      render: (data) => data.updated.userName || local.noDataAvaliable,
    },
  ]
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="print-none">
        <HeaderWithCards
          header={local.manageAccounts}
          array={manageAccountsArray()}
          active={manageAccountsArray().findIndex(
            (item) => item.header === local.loanOfficersTransfers
          )}
        />
      </div>
      <Card className="p-3">
        <Loader type="fullsection" open={isLoading} />
        <Card.Body>
          <div className="d-flex justify-content-between">
            <Card.Title>{local.loanOfficersTransfers}</Card.Title>
            <Button className="print-none" onClick={handlePrint}>
              {local.print}
            </Button>
          </div>
          <hr className="dashed-line" />
          <Form className="mb-3">
            <Row>
              <Col sm={4}>
                <CustomizedAsyncSelect
                  name="oldRepresentativeId"
                  label={local.oldRepresentativeName}
                  value={loanOfficers.find(
                    (lo) => lo._id === logsInput.oldRepresentativeId
                  )}
                  onChange={(selectedLoanOfficer) => {
                    const loanOfficer = selectedLoanOfficer as LoanOfficer
                    setLogsInput({
                      ...logsInput,
                      oldRepresentativeId: loanOfficer?._id || '',
                    })
                  }}
                  loadOptions={getLoanOfficers}
                />
              </Col>
              <Col sm={4}>
                <CustomizedAsyncSelect
                  name="newRepresentativeId"
                  label={local.newRepresentativeName}
                  value={loanOfficers.find(
                    (lo) => lo._id === logsInput.newRepresentativeId
                  )}
                  onChange={(selectedLoanOfficer) => {
                    const loanOfficer = selectedLoanOfficer as LoanOfficer
                    setLogsInput({
                      ...logsInput,
                      newRepresentativeId: loanOfficer?._id || '',
                    })
                  }}
                  loadOptions={getLoanOfficers}
                />
              </Col>
              <Col sm={4}>
                <Form.Group controlId="customerKey">
                  <Form.Label className="text-primary font-weight-bolder">
                    {local.customerCode}
                  </Form.Label>
                  <Form.Control
                    placeholder={local.customerCode}
                    onChange={(event) =>
                      setLogsInput({
                        ...logsInput,
                        customerKey: Number(event.currentTarget.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <CustomizedAsyncSelect
                  name="oldCustomerBranchId"
                  label={local.oldCustomerBranch}
                  value={branches.find(
                    (branch) => branch._id === logsInput.oldCustomerBranchId
                  )}
                  onChange={(branch) => {
                    const { _id } = branch as Branch
                    setLogsInput({
                      ...logsInput,
                      oldCustomerBranchId: _id || '',
                    })
                  }}
                  loadOptions={getBranches}
                />
              </Col>
              <Col sm={6}>
                <CustomizedAsyncSelect
                  name="newCustomerBranchId"
                  label={local.newCustomerBranch}
                  value={branches.find(
                    (branch) => branch._id === logsInput.newCustomerBranchId
                  )}
                  onChange={(branch) => {
                    const { _id } = branch as Branch
                    setLogsInput({
                      ...logsInput,
                      newCustomerBranchId: _id || '',
                    })
                  }}
                  loadOptions={getBranches}
                />
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button type="submit" onClick={handleSubmit}>
                  {local.search}
                </Button>
              </Col>
            </Row>
          </Form>
          <DynamicTable
            pagination
            totalCount={logsData.totalCount}
            mappers={mappers}
            data={logsData.data}
            changeNumber={(key: string, number: number) => {
              getLogs({ ...logsInput, [key]: number })
            }}
          />
        </Card.Body>
      </Card>
    </>
  )
}

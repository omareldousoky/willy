import React, { useState } from 'react'
import HeaderWithCards from 'Shared/Components/HeaderWithCards/headerWithCards'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'
import * as local from 'Shared/Assets/ar.json'
import Card from 'react-bootstrap/esm/Card'
import { Loader } from 'Shared/Components/Loader'
import Form from 'react-bootstrap/esm/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { theme } from 'Shared/theme'
import { LoanOfficer } from 'Shared/Services/interfaces'
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
import AsyncSelect from 'react-select/async'
import Button from 'react-bootstrap/esm/Button'
import { manageAccountsArray } from 'Mohassel/Components/ManageAccounts/manageAccountsInitials'
import useApi from 'Shared/hooks/useApi'
import { LogsInput } from './types'

export const LoanOfficersTransfers = () => {
  const branchId = getBranchFromCookie()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([])
  const [size, setSize] = useState<number>(10)
  const [from, setFrom] = useState<number>(0)

  const [logsInput, setLogsInput] = useState<LogsInput>({
    oldRepresentativeId: '',
    newRepresentativeId: '',
    customerKey: null,
    branchId: branchId === 'hq' ? '' : branchId,
    from,
    size,
  })
  const [logsData, logsApi] = useApi(searchLoanOfficerLogs, logsInput)

  const getLoanOfficers = async (inputValue: string) => {
    const res = await searchLoanOfficer({
      from: 0,
      size: 100,
      name: inputValue,
      status: 'active',
    })
    if (res.status === 'success') {
      setLoanOfficers([...res.body.data])
      return res.body.data
    }
    setLoanOfficers([])
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return []
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    logsApi.get()
    setIsLoading(false)
  }
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

  return (
    <>
      <HeaderWithCards
        header={local.manageAccounts}
        array={manageAccountsArray()}
        active={manageAccountsArray().findIndex(
          (item) => item.header === local.loanOfficersTransfers
        )}
      />
      <Card className="p-3">
        <Loader type="fullsection" open={isLoading} />
        <Card.Body>
          <Card.Title>{local.loanOfficersTransfers}</Card.Title>
          <hr className="dashed-line" />
          <Form className="mb-3">
            <Row>
              <Col sm={4}>
                <Form.Group controlId="oldRepresentativeId">
                  <Form.Label className="text-primary font-weight-bolder">
                    {local.oldRepresentativeName}
                  </Form.Label>
                  <AsyncSelect
                    name="oldRepresentativeId"
                    data-qc="oldRepresentativeId"
                    styles={theme.selectStyleWithBorder}
                    theme={theme.selectTheme}
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
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option._id}
                    loadOptions={getLoanOfficers}
                    cacheOptions
                    defaultOptions
                    placeholder={local.selectFromDropDown}
                    isClearable
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="newRepresentativeId">
                  <Form.Label className="text-primary font-weight-bolder">
                    {local.newRepresentativeName}
                  </Form.Label>
                  <AsyncSelect
                    name="newRepresentativeId"
                    data-qc="newRepresentativeId"
                    styles={theme.selectStyleWithBorder}
                    theme={theme.selectTheme}
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
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option._id}
                    loadOptions={getLoanOfficers}
                    cacheOptions
                    defaultOptions
                    placeholder={local.selectFromDropDown}
                    isClearable
                  />
                </Form.Group>
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
              <Col className="d-flex justify-content-end">
                <Button type="submit" onClick={handleSubmit}>
                  {local.search}
                </Button>
              </Col>
            </Row>
          </Form>
          <DynamicTable
            from={from}
            size={size}
            pagination
            totalCount={logsData.totalCount}
            mappers={mappers}
            data={logsData.data}
            changeNumber={(key: string, number: number) => {
              key === 'size' && setSize(number)
              key === 'from' && setFrom(number)
            }}
          />
        </Card.Body>
      </Card>
    </>
  )
}

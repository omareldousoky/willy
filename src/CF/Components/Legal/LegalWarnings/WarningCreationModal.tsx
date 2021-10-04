import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import Swal from 'sweetalert2'
import local from '../../../../Shared/Assets/ar.json'
import { TableMapperItem } from '../../../../Shared/Components/DynamicTable/types'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import { WarningCreationModalProps, WarningCreationStepEnum } from './types'
import { Loader } from '../../../../Shared/Components/Loader'

import { WarningTypeDropDown } from '../../../../Shared/Components/dropDowns/WarningTypeDropDown'
import { addeddSuccessfully } from '../../../../Shared/localUtils'
import { searchCustomer } from '../../../../Shared/Services/APIs/customer/searchCustomer'
import { Application } from '../../../../Shared/Services/interfaces'
import {
  LegalWarningRequest,
  LegalWarningType,
} from '../../../../Shared/Models/LegalAffairs'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { searchLoan } from '../../../../Mohassel/Services/APIs/Loan/searchLoan'
import {
  createWarning,
  fetchWarning,
} from '../../../../Shared/Services/APIs/LegalAffairs/warning'
import { Customer } from '../../../../Shared/Models/Customer'
import CustomerSearch, {
  Results,
} from '../../../../Shared/Components/CustomerSearch'

export const WarningCreationModal = ({
  showModal,
  setShowModal,
  getLegalWarnings,
}: WarningCreationModalProps) => {
  const [step, setStep] = useState<WarningCreationStepEnum>(
    WarningCreationStepEnum.SelectCustomer
  )
  const [isLoading, setIsLoading] = useState(false)
  const [customer, setCustomer] = useState<Customer>()
  const [loan, setLoan] = useState<any>()
  const [warningType, setWarningType] = useState<LegalWarningType>()

  const [customerSearchResults, setCustomerSearchResults] = useState<Results>({
    results: [],
    empty: false,
  })
  const [loanSearchResults, setLoanSearchResults] = useState<
    { application: Application; id: string }[]
  >()

  const loanMappers: TableMapperItem[] = [
    {
      title: local.customerCode,
      key: 'customerCode',
      render: () => customer?.key ?? '',
    },
    {
      title: local.loanCode,
      key: 'LoanKey',
      render: (data) => data.application.loanApplicationKey || '',
    },
    {
      title: local.principal,
      key: 'principal',
      render: (data) => data.application.principal || 0,
    },
    {
      title: '',
      key: 'action',
      render: (data) => (
        <Button
          onClick={() => {
            setLoan(data)
            setStep(WarningCreationStepEnum.SelectWarning)
          }}
        >
          {local.choose}
        </Button>
      ),
    },
  ]

  const resetState = () => {
    setLoan(undefined)
    setCustomer(undefined)
    setWarningType(undefined)
    setLoanSearchResults(undefined)
    setCustomerSearchResults({ results: [], empty: true })
    setShowModal(false)
  }

  const handleCustomerSearch = async (key, query) => {
    setIsLoading(true)
    const results = await searchCustomer({
      from: 0,
      size: 1000,
      [key]: query,
      customerType: 'individual',
    })
    if (results.status === 'success') {
      setIsLoading(false)
      setCustomerSearchResults({
        results: results.body.data,
        empty: !results.body.data.length,
      })
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
    }
  }

  const findCustomerLoans = async (selectedCustomer: Customer) => {
    setIsLoading(true)
    const results = await searchLoan({
      from: 0,
      size: 1000,
      customerKey: selectedCustomer.key,
      type: 'consumerFinance',
    })
    if (results.status === 'success') {
      setIsLoading(false)
      setLoanSearchResults(
        results.body.applications.filter(
          (customerLoan) =>
            customerLoan.application.status &&
            ['pending', 'issued'].includes(customerLoan.application.status)
        )
      )
    } else {
      setIsLoading(false)
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
    }
  }

  const addWarning = async (warningRequest: LegalWarningRequest) => {
    const createWarningResponse = await createWarning(warningRequest)
    if (createWarningResponse.status === 'success') {
      Swal.fire('', addeddSuccessfully('customer'), 'success')
      getLegalWarnings(true)
    } else
      Swal.fire(
        'Error !',
        getErrorMessage(
          (createWarningResponse.error as Record<string, string>).error
        ),
        'error'
      )
  }

  const getWarningDetails = async () => {
    if (loan && customer && warningType) {
      const warningRequest: LegalWarningRequest = {
        loanId: loan.id,
        customerId: customer._id,
        warningType,
      }
      setIsLoading(true)
      const fetchWarningResponse = await fetchWarning(warningRequest)

      if (fetchWarningResponse.status === 'success') {
        setIsLoading(false)
        if (
          fetchWarningResponse?.body &&
          Object.keys(fetchWarningResponse.body).length > 0 &&
          fetchWarningResponse?.body?.warningType
        ) {
          Swal.fire({
            title: local.areYouSure,
            text: `${local.customerHas} ${
              local[fetchWarningResponse.body.warningType]
            } ${local.theSameLoan}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7dc356',
            cancelButtonColor: '#6c757d',
            confirmButtonText: local.create,
            cancelButtonText: local.cancel,
          }).then(async (result) => {
            const creatWarning = result.value
            resetState()
            if (creatWarning) addWarning(warningRequest)
          })
        } else {
          resetState()
          addWarning(warningRequest)
        }
      } else
        Swal.fire(
          'Error !',
          getErrorMessage(
            (fetchWarningResponse.error as Record<string, string>).error
          ),
          'error'
        )
    }
  }

  return (
    <Modal show={showModal} size="lg">
      <Modal.Header>
        <Modal.Title>
          {local.add}&nbsp;{local.warningForCustomer}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Loader type="fullsection" open={isLoading} />
        {step === WarningCreationStepEnum.SelectCustomer && (
          <CustomerSearch
            source="loanApplication"
            className="w-100"
            handleSearch={(key, query) => handleCustomerSearch(key, query)}
            selectedCustomer={customer}
            searchResults={customerSearchResults}
            selectCustomer={(cust) => {
              setCustomer(cust)
              setStep(WarningCreationStepEnum.SelectLoan)
              findCustomerLoans(cust)
            }}
          />
        )}
        {step === WarningCreationStepEnum.SelectLoan && loanSearchResults && (
          <DynamicTable
            totalCount={0}
            pagination={false}
            data={loanSearchResults}
            mappers={loanMappers}
          />
        )}
        {step === WarningCreationStepEnum.SelectWarning && (
          <div className="d-flex">
            <WarningTypeDropDown
              omitAllOption
              colSize={11}
              onChange={(option) =>
                setWarningType(option?.value as LegalWarningType)
              }
            />
            <Button
              onClick={() => {
                getWarningDetails()
              }}
            >
              {local.choose}
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => resetState()}>
          {local.cancel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

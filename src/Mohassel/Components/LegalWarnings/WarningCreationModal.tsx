import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import local from '../../../Shared/Assets/ar.json'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import {
  WarningCreationModalProps,
  WarningCreationStepEnum,
  ProductType,
} from './types'
import { Loader } from '../../../Shared/Components/Loader'
import { Customer } from '../../../Shared/Models/Customer'
import {
  LegalWarningRequest,
  LegalWarningType,
} from '../../../Shared/Models/LegalAffairs'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { searchLoan } from '../../Services/APIs/Loan/searchLoan'
import { Application } from '../LoanApplication/loanApplicationStates'
import { WarningTypeDropDown } from '../../../Shared/Components/dropDowns/WarningTypeDropDown'
import {
  fetchWarning,
  createWarning,
} from '../../../Shared/Services/APIs/LegalAffairs/warning'
import { addeddSuccessfully } from '../../../Shared/localUtils'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import CustomerSearch, {
  Results,
} from '../../../Shared/Components/CustomerSearch'

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
  const [productType, setProductType] = useState<ProductType>('micro')

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
      customerType: productType === 'sme' ? 'company' : 'individual',
    })
    if (results.status === 'success') {
      setIsLoading(false)
      setCustomerSearchResults({
        results: results.body.data,
        empty: !results.body.data.length,
      })
    } else {
      setIsLoading(false)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(results.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  const findCustomerLoans = async (selectedCustomer: Customer) => {
    setIsLoading(true)
    const results = await searchLoan({
      from: 0,
      size: 1000,
      customerKey: selectedCustomer.key,
      type: productType === 'smeIndividual' ? 'sme' : productType,
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
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(results.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  const addWarning = async (warningRequest: LegalWarningRequest) => {
    const createWarningResponse = await createWarning(warningRequest)
    if (createWarningResponse.status === 'success') {
      Swal.fire({
        text: addeddSuccessfully('customer'),
        icon: 'success',
        confirmButtonText: local.confirmationText,
      })
      getLegalWarnings(true)
    } else
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(
          (createWarningResponse.error as Record<string, string>).error
        ),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
  }

  const getWarningDetails = async () => {
    if (loan && customer && warningType) {
      const warningRequest: LegalWarningRequest = {
        loanId: loan.id,
        customerId: customer?._id ?? '',
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
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(
            (fetchWarningResponse.error as Record<string, string>).error
          ),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
          <>
            <Form.Label>{local.productName}</Form.Label>
            <Form.Control
              as="select"
              type="select"
              value={productType}
              onChange={(event) =>
                setProductType(event.target.value as ProductType)
              }
            >
              <option value="micro">
                قرض فردي - جماعي - ضمان | لقروض ميكرو
              </option>
              <option value="nano"> قرض و ضمان لقروض نانو</option>
              <option value="sme">شركات او ضمان من نوع شركات</option>
              <option value="smeIndividual">
                من لهم حق التوقيع او ضمان فردي للشركات
              </option>
            </Form.Control>
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
              sme={productType === 'sme'}
            />
          </>
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

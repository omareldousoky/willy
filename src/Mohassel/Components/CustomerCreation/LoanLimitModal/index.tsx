import React, { FunctionComponent, useEffect, useState } from 'react'

import * as Yup from 'yup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import Swal from 'sweetalert2'

import local from '../../../../Shared/Assets/ar.json'

import { Loader } from '../../../../Shared/Components/Loader'
import { LtsIcon } from '../../../../Shared/Components'
import { maxValue, minValue } from '../../../../Shared/localUtils'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { Customer as CustomerModel } from '../../../../Shared/Models/Customer'
import { PromissoryNoteMicro } from '../../pdfTemplates/PromissoryNoteMicro/promissoryNoteMicro'
import { LoanLimitModalProps, LoanLimitForm } from './types'
import { getCustomerMaxNanoLoan } from '../../../../Shared/Services/APIs/customer/getCustomer'
import { setNanoLoanLimit } from '../../../../Shared/Services/APIs/customer/setNanoLoanLimit'
import {
  BranchDetails,
  getBranch,
} from '../../../../Shared/Services/APIs/Branch/getBranch'
import { PdfPortal } from '../../../../Shared/Components/Common/PdfPortal'
import AppForm from '../../../../Shared/Components/Form'
import { FormField } from '../../../../Shared/Components/Form/types'
import { mapFormFieldsToFormData } from '../../../../Shared/Components/Form/utils'

const LoanLimitModal: FunctionComponent<LoanLimitModalProps> = ({
  show,
  hideModal,
  customer,
  loanLimit,
  onSuccess,
}) => {
  const defaultValues: LoanLimitForm = {
    limit: loanLimit,
  }

  const customerId = customer._id + ''

  const [loanLimitMax, setLoanLimitMax] = useState(0)
  const [customerBranch, setCustomerBranch] = useState<
    BranchDetails | undefined
  >()

  useEffect(() => {
    const fetchCustomerMaxNanoLoan = async () => {
      const response = await getCustomerMaxNanoLoan()

      if (response.status === 'success') {
        setLoanLimitMax(response.body?.maximumNanoLoansLimit)
      }
    }

    const getCustomerBranch = async () => {
      if (customer.branchId) {
        const response = await getBranch(customer.branchId)

        if (response.status === 'success') {
          setCustomerBranch(response.body?.data)
        }
      }
    }

    fetchCustomerMaxNanoLoan()
    getCustomerBranch()
  }, [])

  const LOAN_LIMIT_MIN = 100

  const [currentLoanLimit, setCurrentLoanLimitValue] = useState<number | null>(
    defaultValues.limit
  )

  const isDocumentDisabled =
    currentLoanLimit === null ||
    (currentLoanLimit !== null &&
      (currentLoanLimit < LOAN_LIMIT_MIN || currentLoanLimit > loanLimitMax))

  const [isLoading, setIsLoading] = useState(false)

  const formFields: FormField[] = [
    {
      name: 'limit',
      type: 'number',
      label: local.loanLimit,
      validation: Yup.number()
        .min(LOAN_LIMIT_MIN, minValue(LOAN_LIMIT_MIN))
        .max(loanLimitMax, maxValue(loanLimitMax))
        .required(local.required),
      disabled: loanLimitMax === 0,
      clearFieldOnChange: 'nanoLimitDocument',
    },
    {
      name: 'nanoLimitDocument',
      label: local.nanoLimitDocument,
      type: 'document',
      documentType: {
        pages: 1,
        type: 'nanoLimitDocument', // for redux actions
        paperType: 'A4',
        name: 'nanoLimitDocument',
        updatable: false,
        customerType: 'individual',
        active: true,
      },
      keyName: 'customerId', // entity key to be updated by
      keyId: customerId, // entity key value
      header: (
        <Button
          className="mx-auto mb-1 py-2 d-flex align-items-center justify-content-center"
          variant="link"
          onClick={() => window.print()}
          disabled={isDocumentDisabled || !customerBranch}
        >
          <span className="mr-2">{local.downloadTemplate}</span>
          <LtsIcon name="download" color="#7dc356" />
        </Button>
      ),
      disabled: isDocumentDisabled,
    },
  ]

  const handleSubmit = async (values: LoanLimitForm) => {
    const nanoLimitFile = values.nanoLimitDocument?.find(
      (document) => document?.file
    )?.file

    const nanoLimitRequestBody = {
      customerId,
      docName: 'nanoLimitDocument',
      limit: values.limit,
      file: nanoLimitFile,
    }

    const formData = mapFormFieldsToFormData(nanoLimitRequestBody)

    setIsLoading(true)

    const result = await setNanoLoanLimit(formData)

    setIsLoading(false)

    if (result.status === 'success') {
      hideModal()
      await Swal.fire('', local.success, 'success')
      onSuccess()
    } else {
      Swal.fire(local.error, getErrorMessage(result.error.error), 'error')
    }
  }

  return (
    <>
      <Modal className="print-none" size="lg" show={show} onHide={hideModal}>
        <Loader type="fullsection" open={isLoading} />
        <Modal.Header closeButton>
          <Modal.Title className="text-mixed-lang">
            {local.nanoCustomerLimit}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppForm
            formFields={formFields}
            defaultValues={defaultValues}
            onSubmit={(values: LoanLimitForm) => handleSubmit(values)}
            onCancel={hideModal}
            options={{ wideBtns: true }}
            onChange={({
              currentTarget: {
                limit: { value },
              },
            }) =>
              value === ''
                ? setCurrentLoanLimitValue(null)
                : setCurrentLoanLimitValue(value)
            }
          />
        </Modal.Body>
      </Modal>
      {customerBranch && currentLoanLimit && (
        <PdfPortal
          component={
            <PromissoryNoteMicro
              customer={
                {
                  ...customer,
                  nanoLoansLimit: currentLoanLimit,
                } as CustomerModel
              }
              branchDetails={customerBranch}
            />
          }
        />
      )}
    </>
  )
}

export default LoanLimitModal

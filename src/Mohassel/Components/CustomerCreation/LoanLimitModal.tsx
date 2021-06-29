import React, { useEffect, useState } from 'react'

import * as Yup from 'yup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'

import local from '../../../Shared/Assets/ar.json'

import { Loader } from '../../../Shared/Components/Loader'
import { LtsIcon } from '../../../Shared/Components'
import AppForm from '../ManageLegalAffairs/Form'
import { FormField } from '../ManageLegalAffairs/Form/types'
import { PdfPortal } from '../Common/PdfPortal'
import ClientGuaranteedLoans from '../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans'
import { mapFormFieldsToFormData } from '../ManageLegalAffairs/Form/utils'
import { maxValue, minValue } from '../../localUtils'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments } from '../../../Shared/redux/document/actions'

interface LoanLimitForm {
  // TODO: replace actual keys [backend]
  loanLimit: number
  data?: File
}

const LoanLimitModal = ({ show, hideModal, customerId }) => {
  const defaultValues: LoanLimitForm = {
    // TODO: get default value from the customer [backend]
    loanLimit: 0,
  }

  // TODO: Move to parent
  const dispatch = useDispatch()
  const documents: any[] = useSelector((state: any) => state.document)
  useEffect(() => {
    dispatch(
      getDocuments({
        customerId: customerId,
        docType: 'deathCertificate',
      })
    )
  }, [documents])
  // TODO: Move to parent END

  const LOAN_LIMIT_MIN = 1000
  const LOAN_LIMIT_MAX = 3000

  const [currentLoanLimit, setCurrentLoanLimitValue] = useState<number | null>(
    defaultValues.loanLimit
  )
  const isTemplateDisabled =
    currentLoanLimit === null ||
    (currentLoanLimit !== null && currentLoanLimit < LOAN_LIMIT_MIN)

  const [isLoading, setIsLoading] = useState(false)

  const formFields: FormField[] = [
    {
      name: 'loanLimit', // TODO: replace actual key [backend]
      type: 'number',
      label: local.loanLimit,
      validation: Yup.number()
        .min(LOAN_LIMIT_MIN, minValue(LOAN_LIMIT_MIN))
        .max(LOAN_LIMIT_MAX, maxValue(LOAN_LIMIT_MAX))
        .required(local.required),
    },
    {
      name: 'data', // TODO: replace actual key [backend]
      label: local.loanLimitInsurance,
      type: 'document',
      documentType: {
        pages: 1,
        type: 'deathCertificate', // for redux actions
        paperType: 'A4',
        name: 'deathCertificate', // TODO: replace actual key [backend]
        updatable: false,
        customerType: 'individual',
        active: true, // What is this for?
      },
      keyName: 'customerId', // entity key to be updated by
      keyId: customerId, // entity key value
      header: (
        <Button
          className="mx-auto mb-1 py-2 d-flex align-items-center justify-content-center"
          variant="link"
          onClick={() => window.print()}
          disabled={isTemplateDisabled}
        >
          <span className="mr-2">{local.downloadTemplate}</span>
          <LtsIcon name="download" color="#7dc356" />
        </Button>
      ),
      disabled: isTemplateDisabled,
    },
  ]

  const handleSubmit = (values: LoanLimitForm) => {
    console.log('submit values', values)

    const formData = mapFormFieldsToFormData(values)
    console.log('submit formData', formData)
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
                loanLimit: { value },
              },
            }) =>
              value === ''
                ? setCurrentLoanLimitValue(null)
                : setCurrentLoanLimitValue(value)
            }
          />
        </Modal.Body>
      </Modal>
      <PdfPortal
        component={
          // TODO: replace with limit receipt [business]
          <PdfPortal component={<ClientGuaranteedLoans data={{}} />} />
        }
      />
    </>
  )
}

export default LoanLimitModal

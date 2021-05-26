import React, { useState } from 'react'

import * as Yup from 'yup'

import local from '../../../../Shared/Assets/ar.json'
import { uploadDefaultingCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import {
  UploadLegalCustomerResponse,
  UploadLegalCustomersProps,
} from '../types'
import AppForm from '../Form'
import { FileField } from '../Form/types'

const UploadLegalCustomers = ({
  onSubmit,
  onCancel,
}: UploadLegalCustomersProps) => {
  const [failedCustomerURI, setfailedCustomerURI] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  const SUPPORTED_FORMATS = ['xlsx', 'xls', 'xlsm', 'csv']

  const formFields: [FileField] = [
    {
      name: 'data',
      label: local.chooseFile,
      type: 'file',
      accepts: SUPPORTED_FORMATS.map((format) => '.' + format).join(','),
      validation: Yup.mixed().required(local.required),
    },
  ]

  const generateFailedCSV = (rows: UploadLegalCustomerResponse[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `${local.nationalId},${local.reason}\n` +
      rows.map((row: UploadLegalCustomerResponse[]) =>
        row
          .map(
            (failedCustomer: UploadLegalCustomerResponse) =>
              `${failedCustomer.nationalId},${getErrorMessage(
                failedCustomer.reason
              )}`
          )
          .join('\n')
      )

    const encodedUri = encodeURI(csvContent)
    setfailedCustomerURI(encodedUri)
  }

  const handleSubmit = async (values: { data }) => {
    setIsDisabled(true)

    const formData = new FormData()
    formData.append('data', values.data[0])

    const response = await uploadDefaultingCustomer(formData)

    if (response.status === 'success') {
      if (response.body?.failedNationalIds?.length) {
        generateFailedCSV([response.body.failedNationalIds])
        onSubmit(false)
      } else {
        Swal.fire({
          title: local.success,
          icon: 'success',
          confirmButtonText: local.end,
        })
        onSubmit(true)
      }
    } else {
      Swal.fire(local.error, getErrorMessage(response.error.error), 'error')
    }
  }

  return (
    <>
      <div className="text-center">
        <a
          href={require('../../../Assets/sheets/defaulted-customers-template.xlsx')}
          download={local.defaultedCustomersTemplate}
          role="button"
        >
          {local.downloadTemplate}
          <img
            alt={local.print}
            style={{ maxWidth: 18 }}
            src={require('../../../Assets/green-download.svg')}
            className="ml-2"
          />
        </a>
      </div>

      <AppForm
        formFields={formFields}
        onSubmit={(values) => handleSubmit(values)}
        onCancel={onCancel}
        onChange={() => {
          setIsDisabled(false)
          setfailedCustomerURI('')
        }}
        options={{
          wideBtns: true,
          disabled: isDisabled,
          footer: failedCustomerURI && (
            <div className="swal2-validation-message d-flex">
              <span>{local.uploadCustomersError}</span>
              <a
                className="btn"
                href={failedCustomerURI}
                download={local.customersFailedToUpload}
                role="button"
              >
                <img
                  alt={local.print}
                  style={{ maxWidth: 18 }}
                  src={require('../../../Assets/green-download.svg')}
                />
              </a>
            </div>
          ),
        }}
      />
    </>
  )
}

export default UploadLegalCustomers

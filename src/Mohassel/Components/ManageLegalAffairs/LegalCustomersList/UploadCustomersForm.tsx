import React, { useState } from 'react'

import * as Yup from 'yup'

import AppForm from '../../../../Shared/Components/Form'
import { FileField } from '../../../../Shared/Components/Form/types'
import local from '../../../../Shared/Assets/ar.json'
import { uploadDefaultingCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { UploadLegalCustomerResponse } from '../types'

const UploadLegalCustomers = ({ onCancel, onSubmit }) => {
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
    console.log({ values })

    setIsDisabled(true)

    const formData = new FormData()
    formData.append('data', values.data[0])

    const response = await uploadDefaultingCustomer(formData)

    if (response.status === 'success') {
      if (response.body?.failedNationalIds?.length) {
        generateFailedCSV([response.body.failedNationalIds])
      } else {
        Swal.fire({
          title: local.success,
          icon: 'success',
          confirmButtonText: local.end,
        })
        onSubmit(response)
      }
    } else {
      Swal.fire(local.error, getErrorMessage(response.error.error), 'error')
    }
  }

  return (
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
          <a
            className="btn btn-outline-danger"
            href={failedCustomerURI}
            download={local.customersFailedToUpload}
            role="button"
          >
            {local.customersFailedToUpload}
          </a>
        ),
      }}
    />
  )
}

export default UploadLegalCustomers

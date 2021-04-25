import React from 'react'

import * as Yup from 'yup'

import AppForm from '../../../../Shared/Components/Form'
import { FileField } from '../../../../Shared/Components/Form/types'
import local from '../../../../Shared/Assets/ar.json'
import { uploadDefaultingCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../../Shared/Services/utils'

const UploadLegalCustomers = ({ onCancel, onSubmit }) => {
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

  const handleSubmit = async (values: { data }) => {
    const formData = new FormData()
    formData.append('data', values.data[0])

    const response = await uploadDefaultingCustomer(formData)

    if (response.status === 'success') {
      Swal.fire({
        title: local.success,
        icon: 'success',
        confirmButtonText: local.end,
      })
      onSubmit(response)
    } else {
      Swal.fire(local.error, getErrorMessage(response.error.error), 'error')
    }
  }

  return (
    <AppForm
      formFields={formFields}
      onSubmit={(values) => handleSubmit(values)}
      onCancel={onCancel}
      options={{
        wideBtns: true,
      }}
    />
  )
}

export default UploadLegalCustomers

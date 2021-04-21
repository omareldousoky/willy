import React from 'react'

import * as Yup from 'yup'

import AppForm from '../../../../Shared/Components/Form'
import { FileField, IFormField } from '../../../../Shared/Components/Form/types'
import { defaultValidationSchema } from '../../../../Shared/validations'
import local from '../../../../Shared/Assets/ar.json'
import { uploadDefaultingCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'

const UploadLegalCustomers = ({ onCancel }) => {
  const SUPPORTED_FORMATS = ['xlsx', 'xls', 'xlsm', 'csv']
  const formFields: IFormField[] = [
    {
      name: 'data',
      label: local.chooseFile,
      type: 'file',
      accepts: SUPPORTED_FORMATS.map((format) => '.' + format).join(','),
      // validation: Yup.mixed().test(
      //   'fileFormat',
      //   'Unsupported Format',
      //   (value) => {
      //     console.log(value.type)
      //     return value && SUPPORTED_FORMATS.includes(value.type)
      //   }
      // ),
    },
  ]

  const handleSubmit = async (values: { data }) => {
    console.log(typeof values.data)
    
    const formData = new FormData()
    formData.append('data', values.data)
    
    console.log({ formData, values })

    const response = await uploadDefaultingCustomer({data: formData})
    console.log({response});
    
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

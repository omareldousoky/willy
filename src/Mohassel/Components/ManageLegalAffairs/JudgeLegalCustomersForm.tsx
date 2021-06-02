import React, { FormEvent, useEffect, useState } from 'react'

import Swal from 'sweetalert2'
import * as Yup from 'yup'

import local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { getGovernorates } from '../../Services/APIs/configApis/config'
import { District, Governorate } from '../CustomerCreation/StepTwoForm'
import AppForm from './Form'
import { FormField } from './Form/types'
import { defaultValidationSchema } from './validations'

interface JudgeCustomersFormValues {
  gov: string
  policeStation: string
  dateRange: {
    from: string
    to: string
  }
}

const JudgeLegalCustomersForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: JudgeCustomersFormValues) => void
  onCancel: () => void
}) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<
    Governorate | undefined
  >(undefined)

  const [governorates, setGovernorates] = useState<Governorate[]>([])

  const policeStations: District[] =
    governorates.find(
      (governorate) =>
        governorate.governorateLegacyCode ===
        selectedGovernorate?.governorateLegacyCode
    )?.districts || []

  useEffect(() => {
    fetchGovernorates()
  }, [])

  const formFields: FormField[] = [
    {
      type: 'select',
      name: 'gov',
      label: local.currHomeAddressGov,
      validation: defaultValidationSchema.required(local.required),
      options: governorates.map((governorate) => ({
        label: governorate.governorateName.ar,
        value: governorate.governorateLegacyCode,
      })),
      disabled: governorates.length === 0,
      clearFieldOnChange: 'policeStation',
    },
    {
      type: 'select',
      name: 'policeStation',
      label: local.legalPoliceStation,
      validation: defaultValidationSchema.required(local.required),
      options: policeStations.map((policeStation) => ({
        label: policeStation.districtName.ar,
        value: policeStation.districtLegacyCode,
      })),
      disabled: policeStations.length === 0 || !selectedGovernorate,
    },
    {
      type: 'group',
      name: 'dateRange',
      fields: [
        {
          type: 'date',
          name: 'from',
          label: local.from,
          validation: Yup.date()
            .required(local.required)
            .when(
              'to',
              (to: Date, schema: Yup.DateSchema) =>
                to && schema.max(to, local.dateRangeErrorMessage)
            ),
        },
        {
          type: 'date',
          name: 'to',
          label: local.to,
          validation: Yup.date()
            .required(local.required)
            .when(
              'from',
              (from: Date, schema: Yup.DateSchema) =>
                from && schema.min(from, local.dateRangeErrorMessage)
            ),
        },
      ],
    },
  ]

  const fetchGovernorates = async () => {
    const response = await getGovernorates()

    if (response.status === 'success') {
      setGovernorates(response.body.governorates)
    } else {
      Swal.fire(local.error, getErrorMessage(response.error.error), 'error')
    }
  }

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    const value = +e.currentTarget.gov.value

    if (value === selectedGovernorate?.governorateLegacyCode) return

    const currentSelectedGov = governorates.find(
      (governorate) => governorate.governorateLegacyCode === value
    )

    setSelectedGovernorate(currentSelectedGov)
  }

  const handleSubmit = (values: JudgeCustomersFormValues) => {
    console.log({ submit: values })
    onSubmit(values)
  }

  return (
    <AppForm
      formFields={formFields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onChange={handleChange}
      options={{
        wideBtns: true,
        validationSort: [['from', 'to']],
      }}
    />
  )
}

export default JudgeLegalCustomersForm

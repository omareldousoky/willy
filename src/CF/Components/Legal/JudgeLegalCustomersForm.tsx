import React, { FormEvent, useEffect, useState } from 'react'

import Swal from 'sweetalert2'
import * as Yup from 'yup'

import local from '../../../Shared/Assets/ar.json'
import { getGovernorates } from '../../../Shared/Services/APIs/config'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { District, Governorate } from '../../../Shared/Models/Governorate'
import AppForm from '../../../Shared/Components/Form'
import { FormField } from '../../../Shared/Components/Form/types'
import { JudgeCustomersFormValues } from './types'
import { defaultValidationSchema } from './validations'

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
        governorate.governorateName.ar ===
        selectedGovernorate?.governorateName.ar
    )?.districts || []

  useEffect(() => {
    const fetchGovernorates = async () => {
      const response = await getGovernorates()

      if (response.status === 'success') {
        setGovernorates(response.body.governorates)
      } else {
        Swal.fire({
          title: local.error,
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(response.error.error),
          icon: 'error',
        })
      }
    }

    fetchGovernorates()
  }, [])

  const formFields: FormField[] = [
    {
      type: 'select',
      name: 'governorate',
      label: local.currHomeAddressGov,
      validation: defaultValidationSchema.required(local.required),
      options: governorates.map((governorate) => ({
        label: governorate.governorateName.ar,
        value: governorate.governorateName.ar,
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
        value: policeStation.districtName.ar,
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
          label: `${local.from} ${local.finalVerdictDate}`,
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
          label: `${local.to} ${local.finalVerdictDate}`,
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

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    const {
      currentTarget: {
        governorate: { value },
      },
    } = e

    if (value === selectedGovernorate?.governorateName.ar) return

    const currentSelectedGov = governorates.find(
      (governorate) => governorate.governorateName.ar === value
    )

    setSelectedGovernorate(currentSelectedGov)
  }

  const handleSubmit = (values: JudgeCustomersFormValues) => {
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

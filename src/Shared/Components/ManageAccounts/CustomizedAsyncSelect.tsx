import React from 'react'
import Form from 'react-bootstrap/esm/Form'
import AsyncSelect from 'react-select/async'
import { theme } from 'Shared/theme'
import * as local from 'Shared/Assets/ar.json'

export const CustomizedAsyncSelect = ({
  name,
  label,
  value,
  onChange,
  loadOptions,
}) => (
  <Form.Group controlId={name}>
    <Form.Label className="text-primary font-weight-bolder">{label}</Form.Label>
    <AsyncSelect
      name="name"
      data-qc="name"
      styles={theme.selectStyleWithBorder}
      theme={theme.selectTheme}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option._id}
      loadOptions={loadOptions}
      cacheOptions
      defaultOptions
      placeholder={local.selectFromDropDown}
      isClearable
    />
  </Form.Group>
)

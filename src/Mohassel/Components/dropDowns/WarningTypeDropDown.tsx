import React from 'react'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import { theme } from '../../../Shared/theme'
import local from '../../../Shared/Assets/ar.json'
import { OptionType, WarningTypeDropDownProps } from './types'

const ALL_OPTION = { value: '', label: local.all }

const WARNING_TYPE_OPTIONS = [
  { value: 'quickRefundWarning', label: local.quickRefundWarning },
  { value: 'legalActionWarning', label: local.legalActionWarning },
  {
    value: 'misdemeanorNumberWarning',
    label: local.misdemeanorNumberWarning,
  },
  { value: 'verdictNoticeWarning', label: local.verdictNoticeWarning },
]

const OPTIONS_WITH_ALL = [ALL_OPTION, ...WARNING_TYPE_OPTIONS]

export const WarningTypeDropDown = ({
  onChange,
  defaultValue,
  omitAllOption,
  colSize,
}: WarningTypeDropDownProps) => {
  return (
    <Col sm={colSize || 6}>
      <div className="dropdown-container">
        <p className="dropdown-label">{local.warningType}</p>
        <Select<OptionType>
          isSearchable
          placeholder={`${local.choose} ${local.warningType}`}
          name="warningType"
          data-qc="warningType"
          className="full-width"
          styles={theme.selectStyleWithoutBorder}
          theme={theme.selectTheme}
          defaultValue={
            OPTIONS_WITH_ALL.find((option) => option.value === defaultValue) ||
            OPTIONS_WITH_ALL[0]
          }
          onChange={(option) => {
            onChange(option as OptionType)
          }}
          options={omitAllOption ? WARNING_TYPE_OPTIONS : OPTIONS_WITH_ALL}
        />
      </div>
    </Col>
  )
}

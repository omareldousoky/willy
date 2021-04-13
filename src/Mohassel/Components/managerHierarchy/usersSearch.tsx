import React, { FunctionComponent, useState } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Select from 'react-select'
import { theme } from '../../../Shared/theme'
import * as local from '../../../Shared/Assets/ar.json'
import { UsersSearchProps } from './types'

const dropDownKeys = ['name', 'hrCode', 'nationalId']

export const UsersSearch: FunctionComponent<UsersSearchProps> = ({
  objectKey,
  item,
  updateItem,
  usersInitial,
  isClearable,
}) => {
  const [dropDownValue, setDropDownValue] = useState('name')
  // const [showError, setShowError] = useState(false)

  const dropDownArValue = {
    name: local.name,
    nationalId: local.nationalId,
    hrCode: local.hrCode,
    default: '',
  }

  const selectUser = (user) => {
    if (user) {
      const { id, name } = user
      updateItem({ id, name })
    } else {
      updateItem(undefined)
    }
  }

  return (
    <InputGroup className="row-nowrap">
      {dropDownKeys && dropDownKeys.length ? (
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={dropDownArValue[dropDownValue || 'default']}
          id={`${dropDownValue}-${Math.floor(Math.random() * 20)}`}
          data-qc="search-dropdown"
        >
          {dropDownKeys.map((key, index) => (
            <Dropdown.Item
              key={index}
              data-qc={key}
              onClick={() => {
                setDropDownValue(key)
              }}
            >
              {dropDownArValue[key || 'default']}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      ) : null}
      <InputGroup.Append>
        <InputGroup.Text style={{ background: '#fff' }}>
          <span className="fa fa-search fa-rotate-90" />
        </InputGroup.Text>
      </InputGroup.Append>
      <div style={{ margin: 0, width: '60%' }}>
        <Select
          cacheOptions
          defaultOptions
          key={objectKey}
          // onBlur={checkError}
          name="users"
          data-qc="users"
          styles={theme.selectStyleWithBorder}
          theme={theme.selectTheme}
          getOptionValue={(option) => option[dropDownValue]}
          getOptionLabel={(option) => option.name}
          options={usersInitial.map((user) => ({
            name: user.name,
            id: user._id,
          }))}
          onChange={selectUser}
          value={item}
          isClearable={isClearable}
        />
      </div>
    </InputGroup>
  )
}

export default UsersSearch

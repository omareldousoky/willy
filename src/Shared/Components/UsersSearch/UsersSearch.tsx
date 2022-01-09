import React, { FC, useEffect, useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import InputGroup from 'react-bootstrap/InputGroup'

import Select from 'react-select'
import { theme } from '../../theme'
import * as local from '../../Assets/ar.json'
import { UsersSearchProps } from './types'
// import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer'
// import { searchUsers } from '../../Services/APIs/Users/searchUsers'
import { searchUserByAction } from '../../Services/APIs/UserByAction/searchUserByAction'
import { LoanOfficer, ManagerHierarchyUser } from '../../Services/interfaces'
import { LtsIcon } from '..'

const dropDownKeys = ['name', 'hrCode', 'nationalId']

export const UsersSearch: FC<UsersSearchProps> = ({
  objectKey,
  item,
  updateItem,
  usersInitial,
  isClearable,
  // isLoanOfficer,
  // branchId,
}) => {
  const [dropDownValue, setDropDownValue] = useState('name')
  const [options, setOptions] = useState<LoanOfficer[]>(usersInitial)
  const managers = [
    'branchManager',
    'operationsManager',
    'districtManager',
    'districtSupervisor',
    'centerManager',
  ]
  const dropDownArValue = {
    name: local.name,
    nationalId: local.nationalId,
    hrCode: local.hrCode,
    default: '',
  }

  useEffect(() => {
    setOptions(usersInitial)
  }, [usersInitial])

  const selectUser = (user) => {
    if (user) {
      const { id, name } = user
      updateItem({ id, name })
    } else {
      updateItem(undefined)
    }
  }

  // const getUsers = async (keyword: string) => {
  //   const query = {
  //     from: 0,
  //     size: 500,
  //     hrCode: '',
  //     name: '',
  //     nationalId: '',
  //     branchId: objectKey === 'leader' ? branchId : '',
  //   }
  //   query[dropDownValue] = keyword

  //   if (isLoanOfficer) {
  //     const officerQuery = { ...query, branchId }
  //     const res = await searchLoanOfficer(officerQuery)
  //     if (res.status === 'success' && res.body.data) {
  //       setOptions(res.body.data)
  //     } else {
  //       setOptions([])
  //     }
  //   } else {
  //     const res = await searchUsers({ ...query, status: 'active' })
  //     if (res.status === 'success' && res.body.data) {
  //       setOptions(res.body.data)
  //     } else {
  //       setOptions([])
  //     }
  //   }
  // }
  const getUsersByAction = async (input: string, actionKey: string) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey: 'halan.com/managerHierarchy',
      action: actionKey,
      name: input,
    }
    const res = await searchUserByAction(obj)
    if (res.status === 'success') {
      setOptions(res.body.data)
      return res.body.data
    }
    setOptions([])
    return []
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
        <InputGroup.Text className="bg-white rounded-0">
          <LtsIcon name="search" />
        </InputGroup.Text>
      </InputGroup.Append>
      <div style={{ margin: 0, width: '60%' }}>
        <Select<ManagerHierarchyUser>
          cacheOptions
          defaultOptions
          key={objectKey}
          name="users"
          data-qc="users"
          styles={theme.selectStyleWithBorderWithSearchDropDown}
          theme={theme.selectTheme}
          getOptionValue={(option) => option[dropDownValue]}
          getOptionLabel={(option) => option.name}
          options={options.map((user) => ({
            name: user.name,
            id: user._id,
          }))}
          onChange={selectUser}
          value={item}
          isClearable={isClearable}
          onFocus={() => {
            typeof objectKey === 'string' &&
              managers.includes(objectKey) &&
              getUsersByAction('', objectKey)
          }}
          onInputChange={(keyword) => {
            typeof objectKey === 'string' &&
              managers.includes(objectKey) &&
              getUsersByAction(keyword, objectKey)
          }}
          s
        />
      </div>
    </InputGroup>
  )
}

export default UsersSearch

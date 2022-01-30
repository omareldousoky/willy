import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'

import './styles.scss'
import Swal from 'sweetalert2'
import * as local from '../../Assets/ar.json'
import { LtsIcon } from '..'

interface Props {
  options: any
  vertical?: boolean
  selected: any
  labelKey: string
  onChange: any
  rightHeader?: string
  leftHeader?: string
  search?: Function
  dropDownKeys?: Array<string>
  viewSelected?: Function
  disabled?: Function
  disabledMessage?: Function
  oneWay?: boolean
  className?: string
}

const DualBox = (props: Props) => {
  const [options, setOptions] = useState<Array<any>>(props.options)
  const [selectedOptions, setSelectedOptions] = useState<Array<any>>(
    props.selected
  )
  const [selectionArray, setSelectionArray] = useState<Array<any>>([])
  const [dropDownValue, setDropDownValue] = useState<string>('name')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [searchSelectedKeyWord, setSearchSelectedKeyWord] = useState<string>('')
  const [checkAll, setCheckAll] = useState<boolean>(false)

  useEffect(() => {
    if (props.selected && props.selected.length) {
      const selectedIds = props.selected.map((item) => item._id)
      setOptions(
        props.options.filter((item) => !selectedIds.includes(item._id))
      )
      setSelectedOptions(props.selected)
    } else {
      setOptions(props.options)
      setSelectedOptions([])
    }
  }, [props.options, props.selected])

  const selectItem = (option) => {
    setSelectionArray(
      !selectionArray.find((element) => option._id === element._id)
        ? selectionArray.concat(option)
        : selectionArray.filter((item) => item._id !== option._id)
    )
  }
  const addToSelectedList = () => {
    setCheckAll(false)
    const newSelectedOptions = [...selectedOptions, ...selectionArray]
    setSelectionArray([])
    props.onChange(newSelectedOptions)
  }

  const removeItemFromList = (option) => {
    const newList = selectedOptions.filter((item) => item._id !== option._id)
    props.onChange(newList)
  }

  const selectAllOptions = () => {
    if (checkAll) {
      setSelectionArray([])
      setCheckAll(false)
    } else {
      setSelectionArray(
        props.disabled
          ? options.filter(
              (option) => props.disabled && props.disabled(option) === false
            )
          : [...options]
      )
      setCheckAll(true)
    }
  }

  const removeAllFromList = () => {
    props.onChange([])
  }

  const handleSearch = (e) => {
    if (
      props.search &&
      props.dropDownKeys &&
      props.dropDownKeys.length > 0 &&
      e &&
      ['code', 'key', 'nationalId'].includes(dropDownValue) &&
      Number.isNaN(Number(e))
    ) {
      Swal.fire({
        title: local.warningTitle,
        text: local.onlyNumbers,
        icon: 'warning',
        confirmButtonText: local.confirmationText,
      })
    } else {
      setSearchKeyword(e)
      if (props.search && props.dropDownKeys && props.dropDownKeys.length > 0) {
        props.search(searchKeyword, dropDownValue)
      }
    }
  }

  const viewSelected = (id) => {
    if (props.viewSelected) {
      props.viewSelected(id)
    }
  }

  const getArValue = {
    name: local.name,
    nationalId: local.nationalId,
    key: local.code,
    code: local.partialCode,
    customerShortenedCode: local.customerShortenedCode,
    default: '',
  }

  return (
    <Container className={props.className || ''} style={{ marginTop: 20 }}>
      <div
        className={
          !props.vertical
            ? 'row-nowrap'
            : 'd-flex flex-column justify-content-center'
        }
      >
        <div
          className={
            !props.vertical
              ? 'dual-list list-left col-md-5'
              : 'dual-list list-left'
          }
        >
          <div className="well">
            <h6>{props.rightHeader}</h6>
            <ul className="list-group">
              <InputGroup>
                {props.dropDownKeys && props.dropDownKeys.length ? (
                  <DropdownButton
                    as={InputGroup.Append}
                    variant="outline-secondary"
                    title={getArValue[dropDownValue || 'default']}
                    id="input-group-dropdown-2"
                    data-qc="search-dropdown"
                  >
                    {props.dropDownKeys.map((key, index) => (
                      <Dropdown.Item
                        key={index}
                        data-qc={key}
                        onClick={() => {
                          setDropDownValue(key)
                          handleSearch(searchKeyword)
                        }}
                      >
                        {getArValue[key || 'default']}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                ) : null}
                <InputGroup.Append>
                  <InputGroup.Text className="bg-white rounded-0 border-bottom-0">
                    <LtsIcon name="search" />
                  </InputGroup.Text>
                </InputGroup.Append>
                <Form.Control
                  type="text"
                  name="searchKeyWord"
                  data-qc="searchKeyWord"
                  onChange={(e) => handleSearch(e.currentTarget.value)}
                  style={{ padding: 22 }}
                  className="border-bottom-0 rounded-0"
                  placeholder={local.search}
                />
              </InputGroup>
              {(options.length > 0 || selectedOptions.length > 0) && (
                <>
                  <div
                    className="list-group-item"
                    style={{ background: '#FAFAFA' }}
                    onClick={selectAllOptions}
                  >
                    <Form.Check
                      type="checkbox"
                      readOnly
                      id="check-all"
                      label={local.checkAll}
                      checked={checkAll}
                    />
                  </div>
                  <div className="scrollable-list">
                    {!props.search && !props.dropDownKeys
                      ? options
                          .filter((option) =>
                            option[props.labelKey]
                              .toLocaleLowerCase()
                              .includes(searchKeyword.toLocaleLowerCase())
                          )
                          .map((option) => {
                            return (
                              <div
                                key={option._id}
                                className={`list-group-item d-flex ${
                                  selectionArray.find(
                                    (item) => item._id === option._id
                                  )
                                    ? 'selected'
                                    : ''
                                }`}
                              >
                                <Form.Check
                                  type="checkbox"
                                  id={option._id}
                                  onChange={() => selectItem(option)}
                                  label={option[props.labelKey]}
                                  checked={selectionArray.find(
                                    (item) => item._id === option._id
                                  )}
                                  disabled={
                                    props.disabled && props.disabled(option)
                                  }
                                />
                                {props.disabled &&
                                  props.disabledMessage &&
                                  props.disabled(option) && (
                                    <span>{props.disabledMessage(option)}</span>
                                  )}
                              </div>
                            )
                          })
                      : options.map((option) => {
                          return (
                            <div
                              key={option._id}
                              className={`list-group-item d-flex ${
                                selectionArray.find(
                                  (item) => item._id === option._id
                                )
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              <Form.Check
                                type="checkbox"
                                id={option._id}
                                onChange={() => selectItem(option)}
                                label={option[props.labelKey]}
                                checked={selectionArray.find(
                                  (item) => item._id === option._id
                                )}
                                disabled={
                                  props.disabled && props.disabled(option)
                                }
                              />
                              {props.disabled &&
                                props.disabledMessage &&
                                props.disabled(option) && (
                                  <span>{props.disabledMessage(option)}</span>
                                )}
                            </div>
                          )
                        })}
                  </div>
                </>
              )}
            </ul>
          </div>
        </div>
        {(options.length > 0 || selectedOptions.length > 0) && (
          <div className="list-button">
            <Button
              className="btn btn-default btn-md"
              style={{ height: 45, width: 95, margin: '20px 0px' }}
              disabled={selectionArray.length < 1}
              onClick={addToSelectedList}
            >
              {local.add}
              <span
                className={
                  !props.vertical ? 'fa fa-arrow-left' : 'fa fa-arrow-down'
                }
              />
            </Button>
          </div>
        )}
        {(options.length > 0 || selectedOptions.length > 0) && (
          <div
            className={
              !props.vertical
                ? 'dual-list list-right col-md-5'
                : 'dual-list list-right'
            }
          >
            <div className="well">
              <h6 className="text-muted">{props.leftHeader}</h6>
              <ul className="list-group">
                <InputGroup>
                  <InputGroup.Append>
                    <InputGroup.Text className="bg-white rounded-0 border-bottom-0">
                      <LtsIcon name="search" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                  <Form.Control
                    type="text"
                    name="searchSelectedKeyWord"
                    data-qc="searchSelectedKeyWord"
                    onChange={(e) =>
                      setSearchSelectedKeyWord(e.currentTarget.value)
                    }
                    style={{ padding: 22 }}
                    className="border-bottom-0 rounded-0"
                    placeholder={local.search}
                  />
                </InputGroup>
                <div
                  className="list-group-item delete-all-row"
                  style={{ background: '#FAFAFA' }}
                >
                  <span className="text-muted">
                    {local.count}({selectedOptions.length})
                  </span>
                  {!props.oneWay && (
                    <div onClick={removeAllFromList}>
                      <span>
                        <img
                          alt="delete"
                          src={require('../../Assets/deleteIcon.svg')}
                        />
                      </span>
                      <span>{local.deleteAll}</span>
                    </div>
                  )}
                </div>
                <div className="scrollable-list">
                  {selectedOptions
                    .filter((option) =>
                      option[props.labelKey]
                        .toLocaleLowerCase()
                        .includes(searchSelectedKeyWord.toLocaleLowerCase())
                    )
                    .map((option) => (
                      <li key={option._id} className="list-group-item">
                        {!props.oneWay && (
                          <span onClick={() => removeItemFromList(option)}>
                            <LtsIcon name="close" size="20px" />
                          </span>
                        )}
                        <span>{option[props.labelKey]}</span>
                        {props.viewSelected && (
                          <span
                            onClick={() => viewSelected(option._id)}
                            className="fa fa-eye icon"
                            style={{ float: 'left' }}
                          />
                        )}
                      </li>
                    ))}
                </div>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default DualBox

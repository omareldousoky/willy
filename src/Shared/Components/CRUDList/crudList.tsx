import React, { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import * as local from '../../Assets/ar.json'
import { LtsIcon } from '../LtsIcon'

export interface CrudOption {
  name: string
  disabledUi: boolean
  id: string
  activated: boolean
}
interface Props {
  source: string
  options: Array<CrudOption>
  newOption: Function
  updateOption: Function
  disableNameEdit?: boolean
  canCreate?: boolean
  canEdit?: boolean
  noMaxLength?: boolean
}

export const CRUDList = (props: Props) => {
  const [options, setOptions] = useState<Array<CrudOption>>(props.options)
  const [filterOptions, setFilterOptions] = useState('')
  const [temp, setTemp] = useState<Array<CrudOption>>(props.options)

  useEffect(() => {
    setOptions(props.options)
    setTemp(props.options)
  }, [props.options])

  function addOption() {
    if (!options.some((option) => option.name === '')) {
      setOptions([
        { name: '', disabledUi: false, id: '', activated: true },
        ...options,
      ])
      setFilterOptions('')
      setTemp([
        { name: '', disabledUi: false, id: '', activated: true },
        ...temp,
      ])
    }
  }

  function handleChangeInput(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setOptions(
      options.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, name: event.currentTarget.value }
          : option
      )
    )
  }

  function toggleClick(option, submit: boolean) {
    if (option.disabledUi === false && option.name.trim() !== '' && submit) {
      if (option.id === '') {
        // New
        props.newOption(option.name, option.activated)
      } else {
        // Edit
        props.updateOption(option.id, option.name, option.activated)
      }
    } else if (!submit) {
      setOptions(
        options.map((optiontmp) =>
          optiontmp.id === option.id
            ? { ...optiontmp, disabledUi: !optiontmp.disabledUi }
            : optiontmp
        )
      )
    }
  }

  function reset(option: CrudOption) {
    if (option.id === '') {
      const optionsTemp = options.filter((item) => item.id !== '')
      setOptions(optionsTemp)
    } else {
      const resetTo = temp.filter((tmp) => tmp.id === option.id)[0]
      const optionsTemp = options.map((optionTmp) =>
        optionTmp.id === option.id ? resetTo : optionTmp
      )
      setOptions(optionsTemp)
    }
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Form.Control
          type="text"
          data-qc="filterOptions"
          placeholder={local.search}
          maxLength={100}
          value={filterOptions}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterOptions(e.currentTarget.value)
          }
        />
        {props.canCreate && (
          <span
            onClick={() => addOption()}
            style={{ margin: 'auto 20px', color: '#7dc356', cursor: 'pointer' }}
          >
            <LtsIcon name="plus" color="#7dc356" />
          </span>
        )}
      </div>
      <ListGroup
        style={{
          textAlign: 'right',
          width: '40%',
          marginBottom: 30,
          maxHeight: 500,
          overflow: 'scroll',
        }}
      >
        {options
          .filter((option) =>
            option.name
              .toLocaleLowerCase()
              .includes(filterOptions.toLocaleLowerCase())
          )
          .map((option, index) => {
            return (
              <ListGroup.Item
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Form.Group style={{ margin: '0px 0px 0px 20px' }}>
                  <Form.Control
                    type="text"
                    data-qc="loanUsageInput"
                    maxLength={props.noMaxLength ? undefined : 100}
                    title={option.name}
                    value={option.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeInput(e, index)
                    }
                    disabled={
                      option.disabledUi ||
                      (props.disableNameEdit && option.id !== '')
                    }
                    style={
                      option.disabledUi
                        ? { background: 'none', border: 'none' }
                        : {}
                    }
                    isInvalid={option.name.trim() === ''}
                  />
                  <Form.Control.Feedback type="invalid">
                    {local.required}
                  </Form.Control.Feedback>
                </Form.Group>
                {option.disabledUi ? (
                  <span
                    style={
                      option.activated
                        ? { color: '#7dc356', marginLeft: 20 }
                        : { color: '#d51b1b', marginLeft: 20 }
                    }
                    className={
                      option.activated
                        ? 'fa fa-check-circle fa-lg'
                        : 'fa fa-times-circle fa-lg'
                    }
                  />
                ) : (
                  <>
                    <Form.Check
                      type="checkbox"
                      data-qc={`activate${option.id}`}
                      label={local.active}
                      className="checkbox-label"
                      checked={option.activated}
                      onChange={() =>
                        setOptions(
                          options.map((optiontmp) =>
                            optiontmp.id === option.id
                              ? { ...optiontmp, activated: !option.activated }
                              : optiontmp
                          )
                        )
                      }
                      disabled={props.disableNameEdit && option.id === ''}
                    />
                    <span
                      className="fa fa-undo fa-lg"
                      style={{
                        color: '#7dc356',
                        cursor: 'pointer',
                        marginLeft: 20,
                      }}
                      onClick={() => {
                        reset(option)
                      }}
                    />
                  </>
                )}
                {props.canEdit && (
                  <span
                    onClick={() =>
                      option.disabledUi
                        ? toggleClick(option, false)
                        : toggleClick(option, true)
                    }
                    style={{
                      color: '#7dc356',
                      cursor: 'pointer',
                      marginLeft: 20,
                    }}
                    data-qc="editSaveIcon"
                  >
                    <LtsIcon name={option.disabledUi ? 'edit' : 'save'} />
                  </span>
                )}
              </ListGroup.Item>
            )
          })}
      </ListGroup>
    </Container>
  )
}

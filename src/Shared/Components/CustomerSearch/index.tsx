import React, { Component } from 'react'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import * as local from '../../Assets/ar.json'

import { getFullCustomerKey, getRenderDate } from '../../Services/utils'
import { InfoBox, LtsIcon } from '..'
import {
  getCompanyInfo,
  getCustomerInfo,
} from '../../Services/formatCustomersInfo'
import { Company } from '../../Services/interfaces'
import { Customer } from '../../Models/Customer'

export interface Results {
  results: Array<object>
  empty: boolean
}
interface Props {
  source: string
  searchResults: Results
  handleSearch: Function
  selectCustomer: Function
  removeCustomer?: Function
  selectedCustomer?: Customer | Company
  style?: object
  header?: string
  className?: string
  sme?: boolean
}

interface State {
  searchKey: string
  dropDownValue: string
}
class CustomerSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchKey: '',
      dropDownValue: 'name',
    }
  }

  handleSearchChange(event) {
    const fieldVal = event.target.value
    this.setState({
      searchKey: fieldVal,
    })
  }

  getArValue(key: string) {
    switch (key) {
      case 'name':
        return local.name
      case 'nationalId':
        return local.nationalId
      case 'key':
        return local.code
      case 'code':
        return local.partialCode
      case 'customerShortenedCode':
        return local.customerShortenedCode
      case 'taxCardNumber':
        return local.taxCardNumber
      case 'commercialRegisterNumber':
        return local.commercialRegisterNumber
      default:
        return ''
    }
  }

  _handleKeyDown = (event) => {
    if (event.key === 'Enter' && this.state.searchKey.trim().length > 0) {
      this.handleSubmit(event)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { handleSearch } = this.props
    const { dropDownValue, searchKey } = this.state
    const isKey = dropDownValue === 'key'
    const isCode = dropDownValue === 'code'

    if (
      (['nationalId', 'taxCardNumber', 'commercialRegisterNumber'].includes(
        dropDownValue
      ) ||
        isKey ||
        isCode) &&
      Number.isNaN(Number(searchKey))
    ) {
      Swal.fire('', local.SearchOnlyNumbers, 'error')
    } else {
      const isCustomerShortenedCode = dropDownValue === 'customerShortenedCode'
      const modifiedSearchKey = isCustomerShortenedCode
        ? getFullCustomerKey(searchKey)
        : searchKey
      handleSearch(
        isCustomerShortenedCode ? 'key' : dropDownValue,
        isCode || isKey ? Number(modifiedSearchKey) : modifiedSearchKey
      )
    }
  }

  render() {
    const dropDownArray: string[] = this.props.sme
      ? [
          'key',
          'code',
          'customerShortenedCode',
          'name',
          'taxCardNumber',
          'commercialRegisterNumber',
        ]
      : ['name', 'key', 'nationalId', 'code', 'customerShortenedCode']
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...this.props.style,
        }}
        className={this.props.className || ''}
      >
        {(!this.props.selectedCustomer ||
          Object.keys(this.props.selectedCustomer).length === 0) && (
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <p style={{ margin: 'auto 20px' }}>
                {this.props.header ? this.props.header : local.search}
              </p>
              <InputGroup>
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={this.getArValue(this.state.dropDownValue)}
                  id="input-group-dropdown-2"
                  data-qc="search-dropdown"
                >
                  {dropDownArray.map((key, index) => (
                    <Dropdown.Item
                      key={index}
                      data-qc={key}
                      onClick={() =>
                        this.setState({ dropDownValue: key, searchKey: '' })
                      }
                    >
                      {this.getArValue(key)}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <InputGroup.Append>
                  <InputGroup.Text className="bg-white rounded-0">
                    <LtsIcon name="search" />
                  </InputGroup.Text>
                </InputGroup.Append>
                <FormControl
                  type="text"
                  name="searchKey"
                  data-qc="searchKey"
                  value={this.state.searchKey}
                  placeholder={local.search}
                  onChange={(e) => this.handleSearchChange(e)}
                  onKeyDown={this._handleKeyDown}
                  style={{ width: '50%' }}
                />
              </InputGroup>
              <Button
                type="button"
                disabled={this.state.searchKey.trim().length === 0}
                onClick={this.handleSubmit}
                style={{ margin: 10 }}
              >
                {local.search}
              </Button>
            </div>
          </div>
        )}
        {(!this.props.selectedCustomer ||
          Object.keys(this.props.selectedCustomer).length === 0) &&
          this.props.searchResults.results.length > 0 && (
            <div
              style={{
                width: '50%',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                textAlign: 'right',
                overflow: 'scroll',
                padding: 10,
              }}
            >
              {this.props.searchResults.results.map((element: any) => (
                <div
                  style={{
                    width: '100%',
                    borderBottom: '0.5px solid black',
                    cursor: 'all-scroll',
                  }}
                  key={element._id}
                  onClick={() => this.props.selectCustomer(element)}
                >
                  <p>
                    {this.props.sme
                      ? element.businessName
                      : element.customerName}
                  </p>
                </div>
              ))}
            </div>
          )}
        {(!this.props.selectedCustomer ||
          Object.keys(this.props.selectedCustomer).length === 0) &&
          this.props.searchResults.results.length === 0 &&
          this.props.searchResults.empty && (
            <div
              className="d-flex flex-row justify-content-center align-items-center"
              style={{ width: '50%' }}
            >
              <h4>{local.noResults}</h4>
            </div>
          )}
        {this.props.selectedCustomer &&
          Object.keys(this.props.selectedCustomer).length > 0 &&
          this.props.source !== 'loanApplication' && (
            <div style={{ textAlign: 'right', width: '100%' }}>
              <div className="d-flex flex-row justify-content-between">
                <h5>{this.props.source}</h5>
                <Button
                  variant="danger"
                  onClick={() =>
                    this.props.removeCustomer &&
                    this.props.removeCustomer(this.props.selectedCustomer)
                  }
                >
                  ×
                </Button>
              </div>
              {this.props.selectedCustomer.customerType === 'individual' ? (
                <>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.name}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.customerName}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.nationalId}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.nationalId}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.birthDate}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.birthDate &&
                        getRenderDate(this.props.selectedCustomer.birthDate)}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">
                      {local.nationalIdIssueDate}
                    </p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.nationalIdIssueDate &&
                        getRenderDate(
                          this.props.selectedCustomer.nationalIdIssueDate
                        )}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">
                      {local.customerHomeAddress}
                    </p>
                    <p
                      style={{
                        width: '60%',
                        margin: '0 10px 0 0',
                        wordBreak: 'break-all',
                      }}
                    >
                      {this.props.selectedCustomer.customerHomeAddress}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.companyName}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.businessName}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.companyCode}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.key}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.taxCardNumber}</p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.taxCardNumber}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">
                      {local.commercialRegisterNumber}
                    </p>
                    <p
                      style={{
                        marginRight: '10px',
                        whiteSpace: 'normal',
                        maxWidth: '400px',
                      }}
                    >
                      {this.props.selectedCustomer.commercialRegisterNumber}
                    </p>
                  </div>
                  <div className="d-flex flex-row my-2">
                    <p className="font-weight-bold">{local.companyAddress}</p>
                    <p
                      style={{
                        width: '60%',
                        margin: '0 10px 0 0',
                        wordBreak: 'break-all',
                      }}
                    >
                      {this.props.selectedCustomer.businessAddress}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        {this.props.selectedCustomer &&
          Object.keys(this.props.selectedCustomer).length > 0 &&
          this.props.source === 'loanApplication' && (
            <InfoBox
              info={
                this.props.sme
                  ? [
                      getCompanyInfo({
                        company: this.props.selectedCustomer as Company,
                      }),
                    ]
                  : [
                      getCustomerInfo({
                        customerDetails: this.props.selectedCustomer,
                      }),
                    ]
              }
            />
          )}
      </div>
    )
  }
}
export default CustomerSearch

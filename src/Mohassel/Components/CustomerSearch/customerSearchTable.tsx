import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import InfoBox from '../userInfoBox'
import { getRenderDate } from '../../Services/getRenderDate'
import * as local from '../../../Shared/Assets/ar.json'
import { getFullCustomerKey } from '../../../Shared/Services/utils'

interface Customer {
  birthDate?: any
  customerName?: string
  nationalIdIssueDate?: any
  homePostalCode?: number
  nationalId?: string
  customerHomeAddress?: string
  customerAddressLatLong?: string
  customerAddressLatLongNumber?: {
    lat: number
    lng: number
  }
  businessAddressLatLong?: string
  businessAddressLatLongNumber?: {
    lat: number
    lng: number
  }
  businessPostalCode?: any
  businessLicenseIssueDate?: any
  applicationDate?: any
  permanentEmployeeCount?: any
  partTimeEmployeeCount?: any
  customerID?: string
  customerCode?: string
  gender?: string
  businessSector?: string
  businessActivity?: string
  businessSpeciality?: string
}
interface Results {
  results: Array<object>
  empty: boolean
}
interface Props {
  source: string
  searchResults: Results
  handleSearch: Function
  selectCustomer: Function
  removeCustomer?: Function
  selectedCustomer: Customer
  style?: object
  header?: string
  className?: string
}

interface State {
  searchKey: string
  dropDownArray: Array<string>
  dropDownValue: string
}
class CustomerSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchKey: '',
      dropDownArray: [
        'name',
        'key',
        'nationalId',
        'code',
        'customerShortenedCode',
      ],
      dropDownValue: 'name',
    }
  }

  handleSearchChange(event) {
    const fleldVal = event.target.value
    this.setState({
      searchKey: fleldVal,
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
      (dropDownValue === 'nationalId' || isKey || isCode) &&
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
                  {this.state.dropDownArray.map((key, index) => (
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
                    <span className="fa fa-search fa-rotate-90" />
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
                  <p>{element.customerName}</p>
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
                  onClick={() =>
                    this.props.removeCustomer &&
                    this.props.removeCustomer(this.props.selectedCustomer)
                  }
                >
                  ×
                </Button>
              </div>
              <div className="d-flex flex-row">
                <p>{local.name}</p>
                <p style={{ margin: '0 10px 0 0' }}>
                  {this.props.selectedCustomer.customerName}
                </p>
              </div>
              <div className="d-flex flex-row">
                <p>{local.nationalId}</p>
                <p style={{ margin: '0 10px 0 0' }}>
                  {this.props.selectedCustomer.nationalId}
                </p>
              </div>
              <div className="d-flex flex-row">
                <p>{local.birthDate}</p>
                <p style={{ margin: '0 10px 0 0' }}>
                  {getRenderDate(this.props.selectedCustomer.birthDate)}
                </p>
              </div>
              <div className="d-flex flex-row">
                <p>{local.nationalIdIssueDate}</p>
                <p style={{ margin: '0 10px 0 0' }}>
                  {getRenderDate(
                    this.props.selectedCustomer.nationalIdIssueDate
                  )}
                </p>
              </div>
              <div className="d-flex flex-row">
                <p>{local.customerHomeAddress}</p>
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
            </div>
          )}
        {this.props.selectedCustomer &&
          Object.keys(this.props.selectedCustomer).length > 0 &&
          this.props.source === 'loanApplication' && (
            <InfoBox values={this.props.selectedCustomer} />
          )}
      </div>
    )
  }
}
export default CustomerSearch

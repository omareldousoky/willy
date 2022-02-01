import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Formik } from 'formik'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'
import Modal from 'react-bootstrap/Modal'

import Search from '../../../Shared/Components/Search/search'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import { Loader } from '../../../Shared/Components/Loader'
import { bulkApproval } from '../../../Shared/Services/APIs/loanApplication/bulkApproval'
import { bulkApplicationApprovalValidation } from './bulkApplicationApprovalValidation'
import {
  timeToDateyyymmdd,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import local from '../../../Shared/Assets/ar.json'
import {
  manageApplicationsArray,
  manageSMEApplicationsArray,
} from '../TrackLoanApplications/manageApplicationInitials'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'

interface Product {
  productName: string
  loanNature: string
  beneficiaryType: string
}
interface Customer {
  customerName: string
  nationalId: string
  birthDate: number
  nationalIdIssueDate: number
  gender: string
}
interface Application {
  product: Product
  customer: Customer
  entryDate: number
  principal: number
  status: string
  group: Group
}
interface IndividualsInGroup {
  type: string
  customer: Customer
}
interface Group {
  _id: string
  individualsInGroup: Array<IndividualsInGroup>
}
interface LoanItem {
  id: string
  branchId: string
  application: Application
}
interface State {
  selectedReviewedLoans: Array<LoanItem>
  showModal: boolean
  checkAll: boolean
  from: number
  size: number
}
interface Props
  extends RouteComponentProps<{}, {}, { sme?: boolean; id?: string }> {
  loading: boolean
  totalCount: number
  data: any
  error: string
  searchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
  setLoading: (data) => void
}
class BulkApplicationApproval extends Component<Props, State> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props) {
    super(props)
    this.state = {
      selectedReviewedLoans: [],
      showModal: false,
      checkAll: false,
      from: 0,
      size: 10,
    }
    this.mappers = [
      {
        title: () => (
          <FormCheck
            type="checkbox"
            onChange={(e) => this.checkAll(e)}
            checked={this.state.checkAll}
          />
        ),
        key: 'selected',
        render: (data) => (
          <FormCheck
            type="checkbox"
            checked={Boolean(
              this.state.selectedReviewedLoans.find(
                (application) => application.id === data.id
              )
            )}
            onChange={() => this.addRemoveItemFromChecked(data)}
          />
        ),
      },
      {
        title: local.applicationCode,
        key: 'applicationCode',
        render: (data) => data.application.applicationKey,
      },
      {
        title: local.customerName,
        key: 'name',
        render: (data) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              this.props.history.push('/loans/loan-profile', {
                id: data.application._id,
              })
            }
          >
            {data.application.product.beneficiaryType === 'individual' ? (
              data.application.customer.customerName ||
              data.application.customer.businessName
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.application.group?.individualsInGroup.map((member) =>
                  member.type === 'leader' ? (
                    <span key={member.customer._id}>
                      {member.customer.customerName}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        title: local.productName,
        key: 'productName',
        render: (data) => data.application.product.productName,
      },
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) =>
          local[
            data.application.customer.customerType === 'company'
              ? 'company'
              : data.application.product.beneficiaryType
          ],
      },
      {
        title: local.principal,
        key: 'principal',
        render: (data) => data.application.principal,
      },
      {
        title: local.thirdReviewDate,
        key: 'thirdReviewDate',
        render: (data) => timeToDateyyymmdd(data.application.thirdReviewDate),
      },
    ]
  }

  componentDidMount() {
    if (this.props.data?.length > 0) {
      this.props.search({ url: 'clearData' })
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getApplications() {
    const query = {
      ...this.props.searchFilters,
      size: this.state.size,
      from: this.state.from,
      url: 'application',
      status: 'thirdReview',
      type:
        this.props.location.state && this.props.location.state.sme
          ? 'sme'
          : 'micro',
    }
    this.props.search(query).then(() => {
      if (this.props.error)
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(this.props.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
    })
  }

  handleSubmit = async (values) => {
    this.props.setLoading(true)
    this.setState({ showModal: false })
    const obj = {
      approvalDate: new Date(values.approvalDate).valueOf(),
      fundSource: values.fundSource,
      applicationIds: this.state.selectedReviewedLoans.map((loan) => loan.id),
    }
    const res = await bulkApproval(obj)
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ selectedReviewedLoans: [], checkAll: false })
      Swal.fire({
        text: local.bulkLoanApproved,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => this.getApplications())
    } else {
      this.props.setLoading(false)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedReviewedLoans: this.props.data })
    } else this.setState({ checkAll: false, selectedReviewedLoans: [] })
  }

  addRemoveItemFromChecked(loan: LoanItem) {
    if (
      this.state.selectedReviewedLoans.findIndex(
        (loanItem) => loanItem.id === loan.id
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedReviewedLoans: prevState.selectedReviewedLoans.filter(
          (el) => el.id !== loan.id
        ),
      }))
    } else {
      this.setState((prevState) => ({
        selectedReviewedLoans: [...prevState.selectedReviewedLoans, loan],
      }))
    }
  }

  dateSlice(date) {
    if (!date) {
      return timeToDateyyymmdd(-1)
    }
    return timeToDateyyymmdd(date)
  }

  render() {
    const searchKey = ['keyword', 'dateFromTo', 'branch']
    const dropDownKeys = [
      'name',
      'key',
      'customerKey',
      'customerCode',
      'customerShortenedCode',
    ]
    const smePermission =
      (this.props.location.state && this.props.location.state.sme) || false
    const filteredMappers = [...this.mappers]
    if (smePermission) {
      filteredMappers.splice(3, 0, {
        title: local.commercialRegisterNumber,
        key: 'commercialRegisterNumber',
        render: (data) => data.application.customer.commercialRegisterNumber,
      })
      filteredMappers.splice(4, 0, {
        title: local.taxCardNumber,
        key: 'taxCardNumber',
        render: (data) => data.application.customer.taxCardNumber,
      })
      dropDownKeys.push('taxCardNumber', 'commercialRegisterNumber')
    } else {
      dropDownKeys.push('nationalId')
    }
    const manageApplicationsTabs = smePermission
      ? manageSMEApplicationsArray()
      : manageApplicationsArray()
    return (
      <>
        <HeaderWithCards
          header={local.bulkLoanApplicationsApproval}
          array={manageApplicationsTabs}
          active={manageApplicationsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('bulk-loan-applications-approval')}
        />
        <Card className="main-card">
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.signedApplications}
                </Card.Title>
                <span className="text-muted" style={{ marginLeft: 10 }}>
                  {local.maxLoansAllowed + ` (${this.props.totalCount || 0})`}
                </span>
                <span className="text-muted">
                  {local.noOfSelectedLoans +
                    ` (${this.state.selectedReviewedLoans.length})`}
                </span>
              </div>
              <Button
                onClick={() => {
                  this.setState({ showModal: true })
                }}
                disabled={!this.state.selectedReviewedLoans.length}
                className="big-button"
                style={{ height: 70 }}
              >
                {local.bulkLoanApplicationsApproval}
              </Button>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={searchKey}
              dropDownKeys={dropDownKeys}
              url="application"
              from={this.state.from}
              size={this.state.size}
              status="thirdReview"
              sme={this.props.location.state && this.props.location.state.sme}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="application"
              totalCount={this.props.totalCount}
              mappers={filteredMappers}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number, checkAll: false } as any, () =>
                  this.getApplications()
                )
              }}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <Formik
              initialValues={{
                approvalDate: this.dateSlice(null),
                fundSource: '',
                selectedReviewedLoans: this.state.selectedReviewedLoans,
              }}
              onSubmit={this.handleSubmit}
              validationSchema={bulkApplicationApprovalValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.bulkLoanApplicationsApproval}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="approvalDate">
                      <Form.Label
                        column
                        sm={3}
                      >{`${local.entryDate}*`}</Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="date"
                          name="approvalDate"
                          data-qc="approvalDate"
                          value={formikProps.values.approvalDate}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            Boolean(formikProps.errors.approvalDate) &&
                            Boolean(formikProps.touched.approvalDate)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.approvalDate}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="fundSource">
                      <Form.Label
                        column
                        sm={3}
                        className="text-nowrap"
                      >{`${local.fundSource}*`}</Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          as="select"
                          name="fundSource"
                          data-qc="fundSource"
                          value={formikProps.values.fundSource}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            Boolean(formikProps.errors.fundSource) &&
                            Boolean(formikProps.touched.fundSource)
                          }
                        >
                          <option value="" disabled />
                          <option value="tasaheel">{local.tasaheel}</option>
                          {this.props.searchFilters.type === 'micro' && (
                            <option value="cib">CIB</option>
                          )}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.fundSource}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      {local.cancel}
                    </Button>
                    <Button type="submit" variant="primary">
                      {local.submit}
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
      </>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.applications,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(BulkApplicationApproval))

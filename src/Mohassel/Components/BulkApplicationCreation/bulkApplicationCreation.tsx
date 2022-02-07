import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Formik } from 'formik'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormCheck from 'react-bootstrap/FormCheck'
import Modal from 'react-bootstrap/Modal'

import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import {
  timeToDateyyymmdd,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { bulkCreation } from '../../../Shared/Services/APIs/loanApplication/bulkCreation'
import { bulkApplicationCreationValidation } from './bulkApplicationCreationValidation'
import Search from '../../../Shared/Components/Search/search'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import {
  manageApplicationsArray,
  manageSMEApplicationsArray,
} from '../TrackLoanApplications/manageApplicationInitials'

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
  selectedApplications: Array<LoanItem>
  showModal: boolean
  size: number
  from: number
  checkAll: boolean
}
interface Props
  extends RouteComponentProps<{}, {}, { sme?: boolean; id?: string }> {
  data: any
  error: string
  branchId: string
  fromBranch?: boolean
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
  setLoading: (data) => void
}
class BulkApplicationCreation extends Component<Props, State> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props) {
    super(props)
    this.state = {
      selectedApplications: [],
      showModal: false,
      size: 10,
      from: 0,
      checkAll: false,
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
              this.state.selectedApplications.find(
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
        title: local.principal,
        key: 'principal',
        render: (data) => data.application.principal,
      },
      {
        title: local.currency,
        key: 'currency',
        render: (data) => local[data.application.product.currency],
      },
      {
        title: local.noOfInstallments,
        key: 'noOfInstallments',
        render: (data) => data.application.product.noOfInstallments,
      },
      {
        title: local.periodLength,
        key: 'periodLength',
        render: (data) => data.application.product.periodLength,
      },
      {
        title: local.every,
        key: 'every',
        render: (data) => local[data.application.product.periodType],
      },
      {
        title: local.entryDate,
        key: 'entryDate',
        render: (data) => timeToDateyyymmdd(data.application.entryDate),
      },
      {
        title: local.approvalDate,
        key: 'approvalDate',
        render: (data) => timeToDateyyymmdd(data.application.approvalDate),
      },
    ]
  }

  componentDidMount() {
    this.props.setSearchFilters({
      type:
        this.props.location.state && this.props.location.state.sme
          ? 'sme'
          : 'micro',
    })
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'application',
        status: 'approved',
        type:
          this.props.location.state && this.props.location.state.sme
            ? 'sme'
            : 'micro',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire({
            title: local.errorTitle,
            text: getErrorMessage(this.props.error),
            icon: 'error',
            confirmButtonText: local.confirmationText,
          })
      })
  }

  getApplications() {
    const query = {
      ...this.props.searchFilters,
      size: this.state.size,
      from: this.state.from,
      url: 'application',
      status: 'approved',
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
      creationDate: new Date(values.creationDate).valueOf(),
      applicationIds: this.state.selectedApplications.map(
        (application) => application.id
      ),
    }
    const res = await bulkCreation(obj)
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ selectedApplications: [], checkAll: false })
      Swal.fire({
        text: local.bulkLoanCreated,
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

  addRemoveItemFromChecked(selectedApplication: LoanItem) {
    if (
      this.state.selectedApplications.findIndex(
        (application) => application.id === selectedApplication.id
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedApplications: prevState.selectedApplications.filter(
          (application) => application.id !== selectedApplication.id
        ),
      }))
    } else {
      this.setState((prevState) => ({
        selectedApplications: [
          ...prevState.selectedApplications,
          selectedApplication,
        ],
      }))
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedApplications: this.props.data })
    } else this.setState({ checkAll: false, selectedApplications: [] })
  }

  dateSlice(date) {
    if (!date) {
      return timeToDateyyymmdd(-1)
    }
    return timeToDateyyymmdd(date)
  }

  render() {
    const smePermission =
      (this.props.location.state && this.props.location.state.sme) || false
    const manageApplicationsTabs = smePermission
      ? manageSMEApplicationsArray()
      : manageApplicationsArray()
    return (
      <>
        <HeaderWithCards
          header={local.bulkApplicationCreation}
          array={manageApplicationsTabs}
          active={manageApplicationsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('bulk-application-creation')}
        />
        <Card className="main-card">
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.approvedLoans}
                </Card.Title>
                <span className="text-muted" style={{ marginLeft: 10 }}>
                  {local.maxLoansAllowed + ` (${this.props.totalCount})`}
                </span>
                <span className="text-muted">
                  {local.noOfSelectedLoans +
                    ` (${this.state.selectedApplications.length})`}
                </span>
              </div>
              <Button
                onClick={() => {
                  this.setState({ showModal: true })
                }}
                disabled={!this.state.selectedApplications.length}
                className="big-button"
              >
                {local.bulkApplicationCreation}
              </Button>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['dateFromTo', 'financialLeasingCheckTypeless']}
              datePlaceholder={local.entryDate}
              url="application"
              from={this.state.from}
              size={this.state.size}
              status="approved"
              submitClassName="mt-0"
              hqBranchIdRequest={this.props.branchId}
              sme={this.props.location.state && this.props.location.state.sme}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="application"
              totalCount={this.props.totalCount}
              mappers={this.mappers}
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
                creationDate: this.dateSlice(null),
                selectedApplications: this.state.selectedApplications,
              }}
              onSubmit={this.handleSubmit}
              validationSchema={bulkApplicationCreationValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.bulkApplicationCreation}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group
                      as={Row}
                      controlId="creationDate"
                      className="mb-0"
                    >
                      <Form.Label
                        column
                        sm={3}
                      >{`${local.creationDate}*`}</Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="date"
                          name="creationDate"
                          data-qc="creationDate"
                          value={formikProps.values.creationDate}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            Boolean(formikProps.errors.creationDate) &&
                            Boolean(formikProps.touched.creationDate)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.creationDate}
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
)(withRouter(BulkApplicationCreation))

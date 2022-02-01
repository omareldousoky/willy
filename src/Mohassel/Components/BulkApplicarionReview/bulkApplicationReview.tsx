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
import { bulkReview } from '../../../Shared/Services/APIs/loanApplication/bulkReview'
import { bulkApplicationReviewValidation } from './bulkApplicationReviewValidation'
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
import Can from '../../config/Can'
import { getCookie } from '../../../Shared/Services/getCookie'

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
  branchId: string
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
class BulkApplicationReview extends Component<Props, State> {
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
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
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
                {data.application?.group?.individualsInGroup?.map((member) =>
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
        title: local.age,
        key: 'age',
        render: (data) =>
          data.application?.customer?.birthDate
            ? this.calculateAge(data.application.customer.birthDate || 1)
            : this.calculateAge(
                data.application?.group?.individualsInGroup?.find(
                  (member) => member.type === 'leader'
                ).customer.birthDate || 1
              ),
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) =>
          data.application?.customer?.nationalId
            ? data.application.customer.nationalId
            : data.application?.group?.individualsInGroup?.map((member) =>
                member.type === 'leader' ? member.customer.nationalId : null
              ),
      },
      {
        title: local.noOfInstallments,
        key: 'noOfInstallments',
        render: (data) => data.application.product.noOfInstallments,
      },
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) => local[data.application.product.beneficiaryType],
      },
      {
        title: local.principal,
        key: 'principal',
        render: (data) => data.application.principal,
      },
      {
        title: local.businessActivity,
        key: 'businessActivity',
        render: (data) =>
          data.application?.customer?.businessActivity
            ? data.application.customer.businessActivity
            : data.application?.group?.individualsInGroup?.map((member) =>
                member.type === 'leader'
                  ? member.customer?.businessActivity
                  : null
              ),
      },
      {
        title: local.loanStatus,
        key: 'status',
        render: (data) => this.getStatus(data.application.status),
      },
      {
        title: local.reviewDate,
        key: 'reviewDate',

        render: (data) => timeToDateyyymmdd(data.application.reviewedDate),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'application',
        status: 'reviewed',
        branchId: this.state.branchId !== 'hq' ? this.state.branchId : '',
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
    this.props.setSearchFilters({
      size: this.state.size,
      from: this.state.from,
      url: 'application',
      status: 'reviewed',
      branchId: this.state.branchId !== 'hq' ? this.state.branchId : '',
      type:
        this.props.location.state && this.props.location.state.sme
          ? 'sme'
          : 'micro',
    })
  }

  componentDidUpdate() {
    if (this.props.searchFilters.status === 'secondReview') {
      if (!this.mappers.find((item) => item.key === 'secondReviewDate')) {
        const index = this.mappers.findIndex(
          (item) => item.key === 'reviewDate'
        )
        this.mappers.splice(index, 1)
        this.mappers.push({
          title: local.secondReviewDate,
          key: 'secondReviewDate',
          render: (data) =>
            timeToDateyyymmdd(data.application.secondReviewDate),
        })
      }
    } else if (!this.mappers.find((item) => item.key === 'reviewDate')) {
      const index = this.mappers.findIndex(
        (item) => item.key === 'secondReviewDate'
      )
      if (index > -1) {
        this.mappers.splice(index, 1)
        this.mappers.push({
          title: local.reviewDate,
          key: 'reviewDate',
          render: (data) => timeToDateyyymmdd(data.application.reviewedDate),
        })
      }
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getApplications() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'application',
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

  handleSubmit = async (values) => {
    this.props.setLoading(true)
    this.setState({ showModal: false })
    const obj = {
      date: new Date(values.date).valueOf(),
      action: values.action,
      ids: this.state.selectedReviewedLoans.map((loan) => loan.id),
    }
    const res = await bulkReview(obj)
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ selectedReviewedLoans: [], checkAll: false })
      Swal.fire({
        text:
          obj.action === 'secondReview'
            ? local.secondReviewSuccess
            : local.thirdReviewSuccess,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => this.getApplications())
    } else {
      this.props.setLoading(false)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  getStatus(status: string) {
    switch (status) {
      case 'underReview':
        return (
          <div className="status-chip outline under-review">
            {local.underReview}
          </div>
        )
      case 'created':
        return (
          <div className="status-chip outline created">{local.created}</div>
        )
      case 'reviewed':
        return (
          <div className="status-chip outline reviewed">{local.reviewed}</div>
        )
      case 'secondReview':
        return (
          <div className="status-chip outline second-review">
            {local.secondReviewed}
          </div>
        )
      case 'thirdReview':
        return (
          <div className="status-chip outline third-review">
            {local.thirdReviewed}
          </div>
        )
      case 'approved':
        return (
          <div className="status-chip outline approved">{local.approved}</div>
        )
      case 'rejected':
        return (
          <div className="status-chip outline rejected">{local.rejected}</div>
        )
      case 'canceled':
        return (
          <div className="status-chip outline canceled">{local.cancelled}</div>
        )
      default:
        return null
    }
  }

  dateSlice(date) {
    if (!date) {
      return timeToDateyyymmdd(-1)
    }
    return timeToDateyyymmdd(date)
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

  calculateAge(dateOfBirth: number) {
    if (dateOfBirth) {
      const diff = Date.now().valueOf() - dateOfBirth
      const age = new Date(diff)
      return Math.abs(age.getUTCFullYear() - 1970)
    }
    return 0
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedReviewedLoans: this.props.data })
    } else this.setState({ checkAll: false, selectedReviewedLoans: [] })
  }

  render() {
    const searchKey = ['keyword', 'dateFromTo', 'review-application']
    const smePermission =
      (this.props.location.state && this.props.location.state.sme) || false
    const filteredMappers = smePermission
      ? this.mappers.filter(
          (mapper) =>
            !['nationalId', 'age', 'businessActivity'].includes(mapper.key)
        )
      : this.mappers
    const dropDownKeys = [
      'name',
      'key',
      'customerKey',
      'customerCode',
      'customerShortenedCode',
    ]
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
      filteredMappers.splice(7, 0, {
        title: local.businessSector,
        key: 'businessSector',
        render: (data) => data.application.customer.businessSector,
      })
      dropDownKeys.push('taxCardNumber', 'commercialRegisterNumber')
    } else {
      dropDownKeys.push('nationalId')
    }
    this.state.branchId === 'hq' && searchKey.push('branch')
    const manageApplicationsTabs = smePermission
      ? manageSMEApplicationsArray()
      : manageApplicationsArray()

    return (
      <>
        <HeaderWithCards
          header={local.bulkLoanApplicationReviews}
          array={manageApplicationsTabs}
          active={manageApplicationsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('bulk-loan-applications-review')}
        />
        <Card className="main-card">
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.reviewedApplications}
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
                {local.bulkLoanApplicationReviews}
              </Button>
            </div>
            <hr className="dashed-line" />

            {this.state.branchId === 'hq' ? (
              <Search
                searchKeys={searchKey}
                dropDownKeys={dropDownKeys}
                url="application"
                from={this.state.from}
                size={this.state.size}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                sme={this.props.location.state && this.props.location.state.sme}
              />
            ) : (
              <Search
                searchKeys={searchKey}
                dropDownKeys={dropDownKeys}
                url="application"
                from={this.state.from}
                size={this.state.size}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                hqBranchIdRequest={this.state.branchId}
                sme={this.props.location.state && this.props.location.state.sme}
              />
            )}
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
                date: this.dateSlice(null),
                action: '',
                selectedReviewedLoans: this.state.selectedReviewedLoans,
              }}
              onSubmit={this.handleSubmit}
              validationSchema={bulkApplicationReviewValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.bulkLoanApplicationReviews}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="date">
                      <Form.Label
                        column
                        sm={3}
                      >{`${local.entryDate}*`}</Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="date"
                          name="date"
                          data-qc="date"
                          value={formikProps.values.date}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            Boolean(formikProps.errors.date) &&
                            Boolean(formikProps.touched.date)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.date}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="action">
                      <Form.Label
                        style={{ textAlign: 'right' }}
                        column
                        sm={3}
                      >{`${local.action}*`}</Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          as="select"
                          name="action"
                          data-qc="action"
                          value={formikProps.values.action}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            Boolean(formikProps.errors.action) &&
                            Boolean(formikProps.touched.action)
                          }
                        >
                          <option value="" disabled />
                          {this.state.selectedReviewedLoans[0].application
                            .status !== 'secondReview' && (
                            <Can I="secondReview" a="application">
                              <option value="secondReview">
                                {local.secondReview}
                              </option>
                            </Can>
                          )}
                          <Can I="thirdReview" a="application">
                            <option value="thirdReview">
                              {local.thirdReview}
                            </option>
                          </Can>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.action}
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
)(withRouter(BulkApplicationReview))

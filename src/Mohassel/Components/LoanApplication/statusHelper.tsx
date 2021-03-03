import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Formik } from 'formik'
import Table from 'react-bootstrap/Table'
import * as local from '../../../Shared/Assets/ar.json'
import {
  ReviewLoanValidation,
  UnReviewLoanValidation,
  RejectLoanValidation,
} from './loanApplicationStates'
import GroupInfoBox from '../LoanProfile/groupInfoBox'
import { LoanDetailsTableView } from '../LoanProfile/applicationsDetails'
import InfoBox from '../userInfoBox'
import { getRejectionReasons } from '../../Services/APIs/configApis/config'
import { guarantorOrderLocal } from '../../../Shared/Services/utils'

interface Props {
  status: string
  application: any
  id: string
  handleStatusChange: Function
  getGeoArea: Function
}

interface State {
  selectValues: Array<any>
  decisionValues: Array<any>
  rejectionReasonValues: Array<any>
  loading: boolean
  reviewState: {
    reviewStatus: string
    reviewDate: any
    entryDate: any
  }
  unreviewState: {
    unreviewStatus: string
    unreviewDate: any
    reviewedDate: any
  }
  rejectState: {
    rejectionStatus: string
    rejectionReason: string
    rejectionDate: any
    reviewedDate: any
  }
}
const today = new Date(
  new Date().getTime() - new Date().getTimezoneOffset() * 60000
)
  .toISOString()
  .split('T')[0]
class StatusHelper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectValues: [
        {
          value: 'reviewRequired',
          label: local.notReview,
        },
        {
          value: 'reviewDone',
          label: local.loanReviewed,
        },
      ],
      decisionValues: [
        {
          value: 'rejected',
          label: local.rejected,
        },
      ],
      rejectionReasonValues: [],
      reviewState: {
        reviewStatus: 'reviewRequired',
        reviewDate: today,
        entryDate: this.props.application.entryDate,
      },
      unreviewState: {
        unreviewStatus: 'reviewDone',
        unreviewDate: today,
        reviewedDate: this.props.application.reviewedDate,
      },
      rejectState: {
        rejectionStatus: '',
        rejectionReason: '',
        rejectionDate: today,
        reviewedDate: this.props.application.reviewedDate,
      },
    }
  }

  componentDidMount() {
    if (this.props.status === 'reject') {
      this.getRejectionReasons()
    }
  }

  async getRejectionReasons() {
    const rejectionReasons = await getRejectionReasons()
    if (rejectionReasons.status === 'success') {
      this.setState({
        rejectionReasonValues: rejectionReasons.body.data,
      })
    } else {
      Swal.fire('', local.searchError, 'error')
    }
  }

  handleStatusChange = (values: object) => {
    this.props.handleStatusChange(values, this.props.status)
  }

  getDateString(date) {
    return new Date(
      new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0]
  }

  renderInternalContent() {
    return (
      <div>
        {this.props.application.product.beneficiaryType === 'individual' ? (
          <InfoBox values={this.props.application.customer} />
        ) : (
          <GroupInfoBox group={this.props.application.group} />
        )}
        <LoanDetailsTableView application={this.props.application} />
        {this.props.application.product.beneficiaryType === 'individual' &&
          this.props.application.guarantors.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th />
                  <th>{local.guarantorCode}</th>
                  <th>{local.guarantorName}</th>
                  <th>{local.area}</th>
                  <th>{local.address}</th>
                  <th>{local.telephone}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.application.guarantors.map((guarantor, i) => {
                  const area = this.props.getGeoArea(guarantor.geoAreaId)
                  return (
                    <tr key={guarantor._id}>
                      <td>
                        {guarantorOrderLocal[i && i > 10 ? 'default' : i]}
                      </td>
                      <td>{guarantor.code}</td>
                      <td>{guarantor.customerName}</td>
                      <td
                        style={{
                          color:
                            !area.active && area.name !== '-' ? 'red' : 'black',
                        }}
                      >
                        {area.name}
                      </td>
                      <td>{guarantor.customerHomeAddress}</td>
                      <td>{guarantor.mobilePhoneNumber}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
      </div>
    )
  }

  renderReviewForm() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.reviewState}
        onSubmit={this.handleStatusChange}
        validationSchema={ReviewLoanValidation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="reviewStatus">
                  <Form.Label style={{ textAlign: 'right' }} column sm={5}>
                    {local.reviewStatus}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="reviewStatus"
                    data-qc="reviewStatus"
                    value={formikProps.values.reviewStatus}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      Boolean(formikProps.errors.reviewStatus) &&
                      Boolean(formikProps.touched.reviewStatus)
                    }
                  >
                    <option value="" disabled />
                    {this.state.selectValues.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.reviewStatus}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {formikProps.values.reviewStatus === 'reviewDone' && (
                <Col sm={6}>
                  <Form.Group controlId="productID">
                    <Form.Label style={{ textAlign: 'right' }} column sm={5}>
                      {local.reviewDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="reviewDate"
                      data-qc="reviewDate"
                      value={formikProps.values.reviewDate}
                      // min={this.props.application.entryDate}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={
                        Boolean(formikProps.errors.reviewDate) &&
                        Boolean(formikProps.touched.reviewDate)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.reviewDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {this.renderInternalContent()}
            <Button type="submit">{local.reviewLoan}</Button>
          </Form>
        )}
      </Formik>
    )
  }

  renderUnreviewForm() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.unreviewState}
        onSubmit={this.handleStatusChange}
        validationSchema={UnReviewLoanValidation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="unreviewStatus">
                  <Form.Label style={{ textAlign: 'right' }} column sm={5}>
                    {local.reviewStatus}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="unreviewStatus"
                    data-qc="unreviewStatus"
                    value={formikProps.values.unreviewStatus}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      Boolean(formikProps.errors.unreviewStatus) &&
                      Boolean(formikProps.touched.unreviewStatus)
                    }
                  >
                    <option value="" disabled />
                    {this.state.selectValues.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.unreviewStatus}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {formikProps.values.unreviewStatus === 'reviewRequired' && (
                <Col sm={6}>
                  <Form.Group controlId="productID">
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                      {local.reviewDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="reviewedDate"
                      data-qc="reviewedDate"
                      value={this.getDateString(
                        this.props.application.reviewedDate
                      )}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="unreviewDate">
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                      {local.unreviewDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="unreviewDate"
                      data-qc="unreviewDate"
                      value={formikProps.values.unreviewDate}
                      // min={this.getDateString(this.props.application.reviewedDate)}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={
                        Boolean(formikProps.errors.unreviewDate) &&
                        Boolean(formikProps.touched.unreviewDate)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.unreviewDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {this.renderInternalContent()}
            <Button type="submit">{local.undoLoanReview}</Button>
          </Form>
        )}
      </Formik>
    )
  }

  renderRejectForm() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.rejectState}
        onSubmit={this.handleStatusChange}
        validationSchema={RejectLoanValidation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Row>
              <Col sm={6}>
                <Form.Group controlId="rejectionStatus">
                  <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                    {local.theDecision}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="rejectionStatus"
                    data-qc="rejectionStatus"
                    value={formikProps.values.rejectionStatus}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      Boolean(formikProps.errors.rejectionStatus) &&
                      Boolean(formikProps.touched.rejectionStatus)
                    }
                  >
                    <option value="" disabled />
                    {this.state.decisionValues.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              {formikProps.values.rejectionStatus === 'rejected' && (
                <Col sm={6}>
                  <Form.Group controlId="reviewedDate">
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                      {local.reviewDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="reviewedDate"
                      data-qc="reviewedDate"
                      value={this.getDateString(
                        this.props.application.reviewedDate
                      )}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="productID">
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                      {local.decisionDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="rejectionDate"
                      data-qc="rejectionDate"
                      value={formikProps.values.rejectionDate}
                      onChange={formikProps.handleChange}
                      // min={this.getDateString(this.props.application.reviewedDate)}
                      onBlur={formikProps.handleBlur}
                      isInvalid={
                        Boolean(formikProps.errors.rejectionDate) &&
                        Boolean(formikProps.touched.rejectionDate)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.rejectionDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="rejectionReason">
                    <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                      {local.rejectionReason}
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="rejectionReason"
                      data-qc="rejectionReason"
                      value={formikProps.values.rejectionReason}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={
                        Boolean(formikProps.errors.rejectionReason) &&
                        Boolean(formikProps.touched.rejectionReason)
                      }
                    >
                      <option value="" disabled />
                      {this.state.rejectionReasonValues
                        .filter((option) => option.activated)
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.rejectionReason}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
            {this.renderInternalContent()}
            <Button type="submit">{local.rejectLoan}</Button>
          </Form>
        )}
      </Formik>
    )
  }

  renderContent() {
    switch (this.props.status) {
      case 'review':
        return this.renderReviewForm()
      case 'unreview':
        return this.renderUnreviewForm()
      case 'reject':
        return this.renderRejectForm()
      default:
        return null
    }
  }

  render() {
    return this.renderContent()
  }
}
export default StatusHelper

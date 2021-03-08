import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import BackButton from '../BackButton/back-button'
import { getDateAndTime } from '../../Services/getRenderDate'
import * as local from '../../../Shared/Assets/ar.json'
import {
  getRollableActionsById,
  rollbackActionByID,
} from '../../Services/APIs/loanApplication/rollBack'
import { Loader } from '../../../Shared/Components/Loader'
import {
  timeToDateyyymmdd,
  getDateString,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { rollbackValidation } from '../Payment/paymentValidation'

interface State {
  loading: boolean
  actions: any
  applicationId: string
  showModal: boolean
  actionToRollback: any
}
interface Props {
  history: any
  location: any
}
class LoanRollBack extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      actions: [],
      applicationId: '',
      showModal: false,
      actionToRollback: {},
    }
  }

  componentDidMount() {
    const appId = this.props.history.location.state.id
    this.getAppRollableActionsByID(appId)
  }

  async getAppRollableActionsByID(id) {
    this.setState({ loading: true })
    const application = await getRollableActionsById(id)
    if (application.status === 'success') {
      this.setState({
        actions: application.body.RollbackObjects
          ? this.props.history.location.state.status === 'canceled'
            ? this.filterForCancelled(application.body.RollbackObjects)
            : application.body.RollbackObjects
          : [],
        applicationId: id,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(application.error.error), 'error')
      )
    }
  }

  getMinDate() {
    const minDate = '2021-02-01'
    let compared = ''
    if (
      this.state.actionToRollback.transactions &&
      this.state.actionToRollback.transactions[0]
    ) {
      compared = getDateString(
        this.state.actionToRollback.transactions[0].truthDate
      )
    } else {
      compared = getDateString(this.state.actionToRollback.insertedAt)
    }
    if (new Date(compared).valueOf() > new Date(minDate).valueOf())
      return compared
    return minDate
  }

  rollbackConfirmation = (values) => {
    this.setState({ showModal: false })
    Swal.fire({
      title: local.areYouSure,
      text: `${local.willBeRolledBAck}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.rollBackAction,
    }).then((result) => {
      if (result.value) {
        this.rollbackAction(
          this.state.actionToRollback._id,
          new Date(values.truthDate).setHours(23, 59, 59, 999).valueOf()
        )
      }
    })
  }

  async rollbackAction(id, date) {
    this.setState({ loading: true })
    const application = await rollbackActionByID(
      { actionId: id, truthDate: date },
      this.state.applicationId
    )
    if (application.status === 'success') {
      this.setState({ loading: false })
      Swal.fire('', local.rollbackSuccess, 'success').then(() =>
        this.props.history.goBack()
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(application.error.error), 'error')
      )
    }
  }

  rollbackModal(action) {
    this.setState({
      showModal: true,
      actionToRollback: action,
    })
  }

  sortByKey(array, key) {
    return array.sort((a, b) => {
      const x = a[key]
      const y = b[key]
      return x > y ? -1 : x < y ? 1 : 0
    })
  }

  filterForCancelled(array) {
    const actionList = [
      'manualPayToktokStamp',
      'manualPayTricycleStamp',
      'manualPayClearanceFees',
      'manualPayCollectionCommission',
      'manualPayLegalFees',
      'manualPayPenalties',
      'manualPayReissuingFees',
      'payToktokStamp',
      'payTricycleStamp',
      'payClearanceFees',
      'payCollectionCommission',
      'payLegalFees',
      'payPenalties',
      'payReissuingFees',
      'approveManualRandomPayment',
      'rejectManualRandomPayment',
    ]
    return array.filter((action) => actionList.includes(action.action))
  }

  render() {
    return (
      <>
        <BackButton title={local.previousActions} />
        <Loader type="fullscreen" open={this.state.loading} />
        <Card
          style={{ textAlign: 'right', padding: 20 }}
          className="d-flex align-items-center"
        >
          {this.state.actions.length > 0 ? (
            <div style={{ width: '70%' }}>
              <div
                className="d-flex"
                style={{
                  margin: '20px 0px',
                  padding: 10,
                  borderBottom: '1px solid',
                }}
              >
                <p style={{ width: '40%', margin: 0 }}>{local.actionType}</p>
                <p style={{ width: '40%', margin: 0 }}>{local.actionDate}</p>
                <p style={{ width: '20%', margin: 0 }} />
              </div>
              {this.sortByKey(this.state.actions, 'insertedAt').map(
                (action, i) => (
                  <div
                    key={action._id}
                    className="d-flex"
                    style={{ margin: '10px 0px' }}
                  >
                    <p style={{ width: '40%', margin: 0 }}>{action.action}</p>
                    <p style={{ width: '40%', margin: 0 }}>
                      {getDateAndTime(action.insertedAt)}
                    </p>
                    <div
                      className="d-flex align-items-center"
                      style={{ width: '20%' }}
                    >
                      {i === 0 && (
                        <img
                          alt="rollback"
                          src={require('../../Assets/rollback-icon.svg')}
                          style={{ cursor: 'pointer' }}
                          onClick={() => this.rollbackModal(action)}
                        />
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p>{local.noRollableActions}</p>
          )}
        </Card>
        {this.state.showModal && (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <Formik
              initialValues={{ truthDate: timeToDateyyymmdd(-1) }}
              onSubmit={this.rollbackConfirmation}
              validationSchema={rollbackValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title>{local.rollBackAction}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="truthDate">
                      <Form.Label
                        style={{ textAlign: 'right' }}
                        column
                        sm={3}
                      >{`${local.actionDate}*`}</Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="date"
                          name="truthDate"
                          data-qc="truthDate"
                          value={formikProps.values.truthDate}
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          min={this.getMinDate()}
                          isInvalid={
                            Boolean(formikProps.errors.truthDate) &&
                            Boolean(formikProps.touched.truthDate)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.truthDate}
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
export default withRouter(LoanRollBack)

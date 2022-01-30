import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import BackButton from '../../../../Shared/Components/BackButton/back-button'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  getRollableActionsById,
  rollbackActionByID,
} from '../../../../Shared/Services/APIs/loanApplication/rollBack'
import { Loader } from '../../../../Shared/Components/Loader'
import {
  timeToDateyyymmdd,
  getDateString,
  getErrorMessage,
  getDateAndTime,
} from '../../../../Shared/Services/utils'
import { rollbackValidation } from '../../../../Mohassel/Components/Payment/paymentValidation'
import { LtsIcon } from '../../../../Shared/Components'

interface State {
  loading: boolean
  actions: any
  applicationId: string
  showModal: boolean
  actionToRollback: any
}

interface LoanRollBackRouteState {
  id: string
  status: string
}

class LoanRollBack extends Component<
  RouteComponentProps<{}, {}, LoanRollBackRouteState>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, LoanRollBackRouteState>) {
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
    const appId = this.props.location.state.id
    this.getAppRollableActionsByID(appId)
  }

  async getAppRollableActionsByID(id) {
    this.setState({ loading: true })
    const application = await getRollableActionsById(id)
    if (application.status === 'success') {
      this.setState({
        actions: application.body.RollbackObjects
          ? this.props.location.state.status === 'canceled'
            ? this.filterForCancelled(application.body.RollbackObjects)
            : application.body.RollbackObjects
          : [],
        applicationId: id,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(application.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
      cancelButtonText: local.cancel,
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
      Swal.fire({
        text: local.rollbackSuccess,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => this.props.history.goBack())
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(application.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
                  <div key={action._id} className="d-flex my-3">
                    <p style={{ width: '40%', margin: 0 }}>{action.action}</p>
                    <p style={{ width: '40%', margin: 0 }}>
                      {getDateAndTime(action.insertedAt)}
                    </p>
                    <div className="d-flex align-items-center ">
                      {i === 0 && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => this.rollbackModal(action)}
                        >
                          <LtsIcon
                            name="rollback"
                            size="15px"
                            color="#7dc255"
                          />
                        </Button>
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

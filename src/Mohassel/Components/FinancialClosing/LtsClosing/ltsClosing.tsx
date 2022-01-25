import React, { Component } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import Swal from 'sweetalert2'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { financialClosing } from '../../../../Shared/Services/APIs/loanApplication/financialClosing'
import { Loader } from '../../../../Shared/Components/Loader'
import * as local from '../../../../Shared/Assets/ar.json'
import Can from '../../../config/Can'

interface State {
  loading: boolean
}

const today: Date = new Date()

const ltsClosingValidation = Yup.object().shape({
  closeDate: Yup.string().test(
    'close date cant be in the future',
    local.dateCantBeInFuture,
    (value: string) => {
      return value ? new Date(value).valueOf() <= today.valueOf() : true
    }
  ),
})
class LtsClosing extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  handleSubmit = async (values) => {
    const { closeDate } = values
    const endOfCloseDate = new Date(closeDate)
      .setHours(23, 59, 59, 999)
      .valueOf()
    Swal.fire({
      title: local.areYouSure,
      text: `${local.ltsClosing}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.ltsClosing,
      cancelButtonText: local.cancel,
    }).then(async (isConfirm) => {
      if (isConfirm.value) {
        await this.Close(endOfCloseDate)
      }
    })
  }

  async Close(closeDate: number) {
    this.setState({ loading: true })
    const res = await financialClosing({ closeDate })
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        title: local.success,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => this.props.history.push('/'))
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  render() {
    return (
      <Card className="main-card">
        <Loader type="fullscreen" open={this.state.loading} />
        <Card.Header
          className="custom-card-header"
          style={{ background: 'white', border: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {local.ltsClosing}
            </Card.Title>
          </div>
          <Button
            className="btn-cancel-prev"
            onClick={() => this.props.history.push('/reports')}
          >
            {local.reviewFinancialState}
          </Button>
        </Card.Header>
        <Card.Body className="w-100 d-flex justify-content-center">
          <Formik
            initialValues={{ closeDate: 0 }}
            onSubmit={this.handleSubmit}
            validationSchema={ltsClosingValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps) => (
              <Form
                onSubmit={formikProps.handleSubmit}
                className="w-100 p-2 my-1"
              >
                <Form.Group controlId="closeDate">
                  <Form.Label column sm={6} className="data-label">
                    {local.chooseCloseDate}
                  </Form.Label>
                  <Form.Control
                    style={{ marginLeft: 20 }}
                    type="date"
                    name="closeDate"
                    data-qc="closeDate"
                    value={formikProps.values.closeDate}
                    isInvalid={Boolean(
                      formikProps.errors.closeDate &&
                        formikProps.touched.closeDate
                    )}
                    onBlur={formikProps.handleBlur}
                    onChange={(e) => {
                      formikProps.setFieldValue(
                        'closeDate',
                        e.currentTarget.value
                      )
                      if (e.currentTarget.value === '')
                        formikProps.setFieldValue('closeDate', '')
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.closeDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end py-4 my-4">
                  <Can I="financialClosing" a="application">
                    <Button
                      style={{ width: '10%' }}
                      type="submit"
                      variant="primary"
                    >
                      {local.closing}
                    </Button>
                  </Can>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    )
  }
}
export default withRouter(LtsClosing)

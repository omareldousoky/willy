import React, { Component } from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'

import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { DateField } from '../../../../Shared/Components/Common/FormikFields/dateField'
import * as local from '../../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import {
  financialBlocking,
  FinancialClosingRequest,
} from '../../../../Shared/Services/APIs/loanApplication/financialClosing'
import { Loader } from '../../../../Shared/Components/Loader'

interface Props {
  showModal: boolean
  selectedBranches: string[]
  setShoModal: (showModal: boolean) => void
}
interface State {
  loading: boolean
}
const today: Date = new Date()
const blockingValidationSchema = Yup.object().shape({
  blockDate: Yup.string().test(
    'block date cant be in the future',
    local.dateCantBeInFuture,
    (value: string) => {
      return value ? new Date(value).valueOf() <= today.valueOf() : true
    }
  ),
})
class LtsBlockingModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  handleSubmit = async (values) => {
    this.props.setShoModal(false)
    const endOfBlockDate = new Date(values.blockDate)
      .setHours(23, 59, 59, 999)
      .valueOf()
    Swal.fire({
      title: local.areYouSure,
      text: `${local.ltsBlocking}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.ltsBlocking,
      cancelButtonText: local.cancel,
    }).then(async (isConfirm) => {
      if (isConfirm.value) {
        await this.Block({
          blockDate: endOfBlockDate,
          branchesIds: this.props.selectedBranches,
        })
      }
    })
  }

  async Block(data: FinancialClosingRequest) {
    this.setState({ loading: true })
    const res = await financialBlocking(data)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        title: local.success,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => window.location.reload())
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
      <>
        <Loader open={this.state.loading} type="fullsection" />
        {this.props.showModal && (
          <Modal
            show={this.props.setShoModal}
            onHied={() => this.props.setShoModal(false)}
          >
            <Formik
              className="mx-2 my-0"
              enableReinitialize
              initialValues={{
                blockDate: '',
              }}
              onSubmit={this.handleSubmit}
              validationSchema={blockingValidationSchema}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form
                  className="w-100 py-3 m-2"
                  onSubmit={formikProps.handleSubmit}
                >
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.ltsBlocking}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col sm={12} className="my-5 mx-0 p-0">
                        <Field
                          type="date"
                          name="blockDate"
                          key="blockDate"
                          value={formikProps.values.blockDate}
                          component={DateField}
                          className="m-0"
                          label={local.blockDate}
                          id="blockDate"
                        />
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => this.props.setShoModal(false)}
                    >
                      {local.cancel}
                    </Button>
                    <Button type="submit" variant="primary">
                      {local.ltsBlocking}
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

export default LtsBlockingModal

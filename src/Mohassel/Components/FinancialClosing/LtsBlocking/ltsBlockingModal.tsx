import { Col, Row, Modal, Button} from 'react-bootstrap'
import React, { Component,  } from 'react'
import * as local from '../../../../Shared/Assets/ar.json'
import { Formik, Field,Form } from 'formik'
import * as Yup from 'yup'
import DateField from '../../Common/FormikFields/dateField'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { financialBlocking,FinancialBlockingObj } from '../../../Services/APIs/loanApplication/financialClosing'
interface Props {
    showModal: boolean;
    selectedBranches: string[];
    setShoModal: (showModal: boolean) => void;
}
interface State {
    loading: boolean;
}
const today: Date = new Date();
const blockingValidationSchema = Yup.object().shape({
    blockDate: Yup.string().test('block date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    }),
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
  async Block(data: FinancialBlockingObj) {
    this.setState({ loading: true })
    const res = await financialBlocking(data)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire('Success', '', 'success').then(()=>window.location.reload())
    } else {
      this.setState({ loading: false })
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  render() {
    return (
      this.props.showModal&& <Modal show={this.props.setShoModal} onHied={()=>this.props.setShoModal(false)}>
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
          <Form className="w-100 py-3 m-2" onSubmit={formikProps.handleSubmit}>
            <Modal.Header>
              <Modal.Title className="m-auto">
                {local.bulkLoanApplicationsApproval}
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
    )
  }
}

export default LtsBlockingModal

import React, { FunctionComponent, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Tafgeet from 'tafgeetjs'
import local from '../../Assets/ar.json'
import { Loader } from '../Loader'
import {
  approveCustomerCFLimit,
  getCustomerLimitFromMonthlyIncome,
  reviewCustomerCFLimit,
} from '../../Services/APIs/customer/getCustomerConsumerLimit'
import { Customer } from '../../Models/Customer'
import { getErrorMessage } from '../../Services/utils'

interface CFLimitModalProps {
  show: boolean
  hideModal: () => void
  customer: Customer
  onSuccess: () => void
  action: string
}

const CFLimitModal: FunctionComponent<CFLimitModalProps> = ({
  show,
  hideModal,
  customer,
  onSuccess,
  action,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [
    customerConsumerFinanceMaxLimit,
    seCustomerConsumerFinanceMaxLimit,
  ] = useState(0)
  useEffect(() => {
    const getCustomerLimitFromIncome = async (income) => {
      setIsLoading(true)
      const limitRes = await getCustomerLimitFromMonthlyIncome(income)
      if (limitRes.status === 'success') {
        seCustomerConsumerFinanceMaxLimit(limitRes.body.maximumCFLimit)
        setIsLoading(false)
      } else {
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(limitRes.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
        setIsLoading(false)
      }
    }

    getCustomerLimitFromIncome(customer.monthlyIncome)
  }, [])

  const handleSubmit = async () => {
    const text =
      action === 'approve'
        ? local.approveCFCustomerLimit
        : local.reviewCFCustomerLimit
    Swal.fire({
      title: local.areYouSure,
      text: `${text} ${
        (customer?.initialConsumerFinanceLimit as number) > 0
          ? new Tafgeet(customer.initialConsumerFinanceLimit, 'EGP').parse()
          : ''
      }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: text,
      cancelButtonText: local.cancel,
    }).then(async (res) => {
      if (res.value) {
        if (customer._id) {
          setIsLoading(true)
          const result =
            action === 'approve'
              ? await approveCustomerCFLimit(customer._id)
              : await reviewCustomerCFLimit(customer._id)
          setIsLoading(false)
          if (result.status === 'success') {
            hideModal()
            await Swal.fire({
              text: local.success,
              icon: 'success',
              confirmButtonText: local.confirmationText,
            })
            onSuccess()
          } else {
            Swal.fire({
              title: local.error,
              confirmButtonText: local.confirmationText,
              text: getErrorMessage(result.error.error),
              icon: 'error',
            })
          }
        }
      }
    })
  }

  return (
    <>
      <Modal className="print-none" size="lg" show={show} onHide={hideModal}>
        <Loader type="fullsection" open={isLoading} />
        <Modal.Header closeButton>
          <Modal.Title className="text-mixed-lang">
            {action === 'approve'
              ? local.approveCFCustomerLimit
              : local.reviewCFCustomerLimit}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <>
              {Boolean(
                customer.monthlyIncome && customer.monthlyIncome > 0
              ) && (
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label className="font-weight-bold">
                      {local.monthlyIncome}
                    </Form.Label>
                    <Form.Control
                      name="monthlyIncome"
                      value={customer.monthlyIncome}
                      disabled
                    />
                  </Form.Group>
                </Col>
              )}
            </>
            <>
              {Boolean(
                customerConsumerFinanceMaxLimit &&
                  customerConsumerFinanceMaxLimit > 0
              ) && (
                <Col>
                  <Form.Group controlId="customerConsumerFinanceMaxLimit">
                    <Form.Label className="font-weight-bold">
                      {local.consumerFinanceMaxLimit}
                    </Form.Label>
                    <Form.Control
                      name="customerConsumerFinanceMaxLimit"
                      value={customerConsumerFinanceMaxLimit}
                      disabled
                    />
                  </Form.Group>
                </Col>
              )}
            </>
            <>
              {Boolean(
                (customer?.initialConsumerFinanceLimit as number) >= 0
              ) && (
                <Col>
                  <Form.Group controlId="initialConsumerFinanceLimit">
                    <Form.Label className="font-weight-bold">
                      {local.initialConsumerFinanceLimit}
                    </Form.Label>
                    <Form.Control
                      name="initialConsumerFinanceLimit"
                      value={customer.initialConsumerFinanceLimit}
                      disabled
                    />
                  </Form.Group>
                </Col>
              )}
            </>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={() => handleSubmit()}>
                {local.submit}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CFLimitModal

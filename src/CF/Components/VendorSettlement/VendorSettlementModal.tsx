import React, { FunctionComponent, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { settleVendorOutstandingSettlements } from '../../../Shared/Services/APIs/VendorSettlements/searchSettlements'

interface CFLimitModalProps {
  show: boolean
  hideModal: () => void
  onSuccess: () => void
  vendorOutstandingSettlement: number
  merchantId: string
  settlementDate: number
}

const VendorSettlementModal: FunctionComponent<CFLimitModalProps> = ({
  show,
  hideModal,
  onSuccess,
  vendorOutstandingSettlement,
  merchantId,
  settlementDate,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [bankAccountNumber, setBankAccountNumber] = useState('1204022601')

  const handleSubmit = async () => {
    if (merchantId) {
      setIsLoading(true)
      const result = await settleVendorOutstandingSettlements({
        merchantId,
        settlementDate,
        settlementAmount: vendorOutstandingSettlement,
        bankAccountNumber,
      })
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

  return (
    <>
      <Modal className="print-none" size="lg" show={show} onHide={hideModal}>
        <Loader type="fullsection" open={isLoading} />
        <Modal.Header closeButton>
          <Modal.Title className="text-mixed-lang">
            {local.vendorSettlement}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group controlId="vendorOutstandingSettlement">
                <Form.Label className="font-weight-bold">
                  {local.loansSelectedAmount}
                </Form.Label>
                <Form.Control
                  name="vendorOutstandingSettlement"
                  value={vendorOutstandingSettlement}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="bankAccountNumber">
                <Form.Label className="font-weight-bold">
                  {local.bankAccount}
                </Form.Label>
                <Form.Control
                  as="select"
                  type="select"
                  name="bankAccountNumber"
                  data-qc="merchantId"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.currentTarget.value)}
                >
                  <option value="1204022601">Arab bank</option>
                </Form.Control>
              </Form.Group>
            </Col>
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

export default VendorSettlementModal

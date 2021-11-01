import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import Swal from 'sweetalert2'
import * as local from '../../Assets/ar.json'
import { Loader } from '../Loader'
import {
  CheckLinkageResponse,
  Customer,
  LinkageStatusEnum,
} from '../../Models/Customer'
import { getErrorMessage } from '../../Services/utils'
import {
  checkLinkage,
  confirmLinkage,
  removeLinkage,
} from '../../Services/APIs/Leads/halanLinkage'

interface HalanLinkageModalProps {
  show: boolean
  hideModal: Function
  customer?: Customer
}
export const HalanLinkageModal = (props: HalanLinkageModalProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [checkResponse, setCheckResponse] = useState<CheckLinkageResponse>()
  // confirmation code
  const [confirmationCode, setConfirmationCode] = useState<number>()
  const [phoneNumber, setPhoneNumber] = useState<string>()

  const [phoneNumberError, setPhoneNumberError] = useState<string>()
  const [generalError, setGeneralError] = useState<string>()

  const { customer, hideModal, show } = props

  const checkHalanLinkage = useCallback(async () => {
    if (!customer?._id) {
      hideModal()
      Swal.fire('Error !', getErrorMessage(''))
      return
    }
    const res = await checkLinkage(customer._id)
    if (res.status === 'success') {
      setIsLoading(false)
      const response = res.body as CheckLinkageResponse
      setCheckResponse(response)
    } else {
      hideModal()
      Swal.fire(
        'Error !',
        getErrorMessage((res.error as Record<string, string>).error),
        'error'
      )
    }
  }, [customer, hideModal])

  const handleChange = (
    key: 'phoneNumber' | 'confirmationCode',
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const trimmedValue = e.target.value.trim()
    if (key === 'confirmationCode')
      setConfirmationCode(Number(trimmedValue) || undefined)
    else {
      setPhoneNumber(trimmedValue)
      if (trimmedValue !== checkResponse?.phoneNumber)
        !phoneNumberError
          ? setPhoneNumberError(local.invalidMobilePhoneNumber)
          : null
      else if (phoneNumberError) setPhoneNumberError(undefined)
    }
  }

  const handleConfirmLinkageSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (generalError) setGeneralError(undefined)
    const res = await confirmLinkage({
      customerId: customer?._id || '',
      phoneNumber: checkResponse?.phoneNumber || '',
      customerKey: confirmationCode || 0,
    })
    if (res.status === 'success') {
      hideModal()
      Swal.fire('success', local.userLinkedSuccessfully)
    } else {
      setGeneralError(
        getErrorMessage((res.error as Record<string, string>).error)
      )
    }
  }

  const removeHalanUserLinkage = async () => {
    const res = await removeLinkage(customer?._id || '')
    if (res.status === 'success') {
      hideModal()
      Swal.fire('success', local.userUnlinkedSuccessfully)
    } else {
      setGeneralError(
        getErrorMessage((res.error as Record<string, string>).error)
      )
    }
  }
  useEffect(() => {
    checkHalanLinkage()
  }, [checkHalanLinkage])

  return (
    <Modal size="lg" show={show} onHide={hideModal}>
      <Loader type="fullsection" open={isLoading} />
      <Modal.Header closeButton>
        <Modal.Title className="m-auto">{local.linkUserWithHalan}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Card className="info-box">
            <Row>
              <div className="item">
                <p className="label">{local.customerName}</p>
                <p>{customer?.customerName}</p>
              </div>
              <div className="item">
                <p className="label">{local.nationalId}</p>
                <p>{customer?.nationalId}</p>
              </div>
              <div className="item">
                <p className="label">{local.customerCode}</p>
                <p>{customer?.key}</p>
              </div>
            </Row>
          </Card>
          <Col>
            {checkResponse?.status === LinkageStatusEnum.Pending && (
              <Form
                onSubmit={handleConfirmLinkageSubmit}
                className="d-flex flex-column"
              >
                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="phoneNumber">
                      <Form.Label
                        column
                        sm={6}
                        className="mr-0 pr-0 font-weight-bolder"
                      >
                        {local.mobilePhoneNumber}
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="phoneNumber"
                        data-qc="phoneNumber"
                        value={phoneNumber}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange('phoneNumber', e)
                        }
                        isInvalid={!!phoneNumberError}
                      />
                      <Form.Control.Feedback type="invalid">
                        {phoneNumberError}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="confirmationCode">
                      <Form.Label
                        column
                        sm={6}
                        className="mr-0 pr-0 font-weight-bolder"
                      >
                        {local.code}
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="confirmationCode"
                        data-qc="confirmationCode"
                        value={confirmationCode}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange('confirmationCode', e)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  className="w-25 mx-auto my-3 py-3"
                  disabled={
                    !confirmationCode || !phoneNumber || !!phoneNumberError
                  }
                  type="submit"
                  variant="primary"
                >
                  {local.linkUser}
                </Button>
                <span className="text-danger mx-auto">{generalError}</span>
              </Form>
            )}
            {checkResponse?.status === LinkageStatusEnum.Linked && (
              <div className="d-flex flex-column text-center">
                <p className="font-weight-bolder mx-auto mb-2">
                  العميل مربوط على تطبيق حالاً على رقم
                </p>
                <p className="font-weight-bolder mx-auto">
                  {checkResponse?.phoneNumber}
                </p>
                <Button
                  variant="dark"
                  className="w-25 mx-auto my-3 py-3"
                  onClick={removeHalanUserLinkage}
                >
                  {local.unlinkUser}
                </Button>
                <span className="text-danger mx-auto">{generalError}</span>
              </div>
            )}
            {checkResponse?.status === LinkageStatusEnum.Removed && (
              <div className="d-flex flex-column text-center">
                <p className="font-weight-bolder mx-auto mb-2">
                  تم إلغاء ربط العميل بتطبيق حالاً سابقاً على رقم
                </p>
                <p className="font-weight-bolder mx-auto">
                  {checkResponse?.phoneNumber}
                </p>
              </div>
            )}
          </Col>
        </>
      </Modal.Body>
    </Modal>
  )
}

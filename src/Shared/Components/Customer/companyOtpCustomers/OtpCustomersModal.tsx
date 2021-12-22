import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import Modal from 'react-bootstrap/Modal'
import { OtpCustomer } from 'Shared/Models/Customer'
import local from '../../../Assets/ar.json'
import { OtpCustomersForm } from './OtpCustomersForm'
import { OtpCustomersFormModalProps } from './types'
import { otpCustomersFormValidation } from './validations'

export const OtpCustomersFormModal = (props: OtpCustomersFormModalProps) => {
  const [temp, setTemp] = useState<OtpCustomer[]>(props.otpCustomers)
  useEffect(() => {
    setTemp(props.otpCustomers)
  }, [props.otpCustomers])
  return (
    <Modal
      size="lg"
      show={props.openModal}
      onHide={() => props.setOpenModal(false)}
    >
      <Modal.Header>
        <Modal.Title>
          {local.add} {local.otpCustomers}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            otpCustomers:
              temp.length > 0
                ? temp
                : [
                    {
                      name: '',
                      phoneNumber: '',
                      nationalId: '',
                    },
                  ],
          }}
          onSubmit={(va) => props.save(va.otpCustomers)}
          validationSchema={otpCustomersFormValidation}
          validateOnBlur
          validateOnChange
          enableReinitialize
        >
          {(formikProps) => (
            <OtpCustomersForm
              {...formikProps}
              cancel={() => props.setOpenModal(false)}
              temp={temp}
            />
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}

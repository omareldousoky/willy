import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { OtpCustomersProps } from 'Shared/Models/Customer'
import Swal from 'sweetalert2'
import { addOtpCustomers } from '../../../Services/APIs/customer/addOtpCustomers'
import { Loader } from '../../Loader'
import local from '../../../Assets/ar.json'
import { orderLocal } from '../../../Services/utils'
import ability from '../../../config/ability'
import { OtpCustomersFormModal } from './OtpCustomersModal'

export const CompanyOtpPhoneNumbers = (
  props: { reload: () => void } & OtpCustomersProps
) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function setOtpCustomers(val) {
    setLoading(true)
    const result = await addOtpCustomers({
      customerId: props.customerId,
      otpCustomers: val,
    })
    if (result.status === 'success') {
      Swal.fire({
        text: local.success,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => {
        setOpenModal(false)
        props.reload()
      })
    } else {
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.searchError,
        icon: 'error',
      })
    }
    setLoading(false)
  }
  return (
    <>
      <Loader type="fullscreen" open={loading} />
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addOTPCustomer', 'customer') && (
          <div className="mt-5 mb-5">
            <Button variant="primary" onClick={() => setOpenModal(true)}>
              {local.add} {local.otpCustomers}
            </Button>
          </div>
        )}
        {props.otpCustomers.length ? (
          <Table style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th />
                <th>{local.name}</th>
                <th>{local.nationalId}</th>
                <th>{local.phoneNumber}</th>
              </tr>
            </thead>
            <tbody>
              {props.otpCustomers.length &&
                props.otpCustomers.map((guar, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {orderLocal[index && index > 10 ? 'default' : index]}
                      </td>
                      <td>{guar.name}</td>
                      <td>{guar.nationalId}</td>
                      <td>{guar.phoneNumber}</td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        ) : (
          <p>
            {local.na} {local.otpCustomers}
          </p>
        )}
      </div>
      {openModal && (
        <OtpCustomersFormModal
          openModal={openModal}
          setOpenModal={(bool) => setOpenModal(bool)}
          save={(vals) => setOtpCustomers(vals)}
          otpCustomers={props.otpCustomers}
        />
      )}
    </>
  )
}

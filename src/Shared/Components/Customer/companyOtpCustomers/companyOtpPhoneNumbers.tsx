import React, { useState } from 'react'
// import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { CompanyOtpCustomersProps } from 'Shared/Models/Customer'
import local from '../../../Assets/ar.json'
import { orderLocal } from '../../../Services/utils'
import ability from '../../../config/ability'
import { OtpCustomersFormModal } from './OtpCustomersFormModal'

export const CompanyOtpPhoneNumbers = (props: CompanyOtpCustomersProps) => {
  const [openModal, setOpenModal] = useState(false)
  // const [loading, setLoading] = useState(false)

  // function cancelModal() {
  //   setOpenModal(false)
  //   setLoading(false)
  //   setSelectedEntitledToSignCustomer(undefined)
  //   setSearchResults({ results: [], empty: false })
  // }

  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') && (
          <div className="mt-5 mb-5">
            <Button variant="primary" onClick={() => setOpenModal(true)}>
              {local.addEntitledToSign}
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
                {/* {!props.isBlocked && <th />} */}
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

                      {/* {true && (
                        <td style={{ padding: 10 }}>
                          <Button
                            variant="default"
                            onClick={() => removeGuarantor(guar)}
                            title={local.delete}
                          >
                            <LtsIcon name="trash" />
                          </Button>
                        </td>
                      )} */}
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        ) : (
          <p>{local.noEntitledToSign}</p>
        )}
      </div>
      {openModal && (
        <OtpCustomersFormModal
          openModal={openModal}
          setOpenModal={(bool) => setOpenModal(bool)}
          save={(vals) => console.log('in save', vals)}
          otpCustomers={props.otpCustomers}
        />
      )}
    </>
  )
}

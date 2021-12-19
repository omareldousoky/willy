import React from 'react'
// import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
// import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
// import Form from 'react-bootstrap/Form'
// import Select from 'react-select'
import { CompanyOtpCustomersProps } from 'Shared/Models/Customer'
import local from '../../Assets/ar.json'
import {
  // downloadFile,
  // getErrorMessage,
  orderLocal,
  // iscoreBank,
  // iscoreStatusColor,
  // timeToArabicDate,
  // getBranchFromCookie,
  // entitledToSignPositionOptions,
} from '../../Services/utils'
// import Can from '../../config/Can'
// import { Loader } from '../Loader'
import ability from '../../config/ability'
// import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
// import { searchCustomer } from '../../Services/APIs/customer/searchCustomer'
// import CustomerSearch from '../CustomerSearch'
// import { Customer, CFEntitledToSignDetailsProps, CompanyOtpCustomersProps } from '../../Models/Customer'
// import { LtsIcon } from '../LtsIcon'
// import { addEntitledToSignToCustomer } from '../../Services/APIs/customer/customerEntitledToSign'
// import { OptionType } from '../dropDowns/types'
// import { theme } from '../../theme'

export const CompanyOtpPhoneNumbers = (props: CompanyOtpCustomersProps) => {
  // const [openModal, setOpenModal] = useState(false)
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
            <Button
              variant="primary"
              onClick={
                () => console.log('here')
                // setOpenModal(true)
              }
            >
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
      {/* {openModal && (
        <Modal size="lg" show={openModal} onHide={() => setOpenModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              {local.add}
              {
                orderLocal[
                  props.otpCustomers.length > 10
                    ? 'default'
                    : props.otpCustomers.length
                ]
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CustomerSearch
              source="loanApplication"
              style={{ width: '98%' }}
              handleSearch={(key, query) => handleSearch(key, query)}
              searchResults={searchResults}
              selectCustomer={(guarantor) => {
                selectGuarantor(guarantor)
              }}
              selectedCustomer={selectedEntitledToSignCustomer}
              header={
                orderLocal[
                  props.entitledToSignCustomers.length > 10
                    ? 'default'
                    : props.entitledToSignCustomers.length
                ]
              }
            />
            {selectedEntitledToSignCustomer && (
              <div className="d-flex align-items-center">
                <Form.Label className="font-weight-bold mr-2 mb-0">
                  {`${local.position} *`}
                </Form.Label>
                <Select<OptionType>
                  name="position"
                  data-qc="position"
                  styles={theme.selectStyleWithBorder}
                  theme={theme?.selectTheme}
                  className="full-width"
                  options={entitledToSignPositionOptions}
                  value={entitledToSignPositionOptions.find(
                    (el) => el.value === selectedPosition
                  )}
                  defaultValue={{
                    label: local.other,
                    value: 'other',
                  }}
                  onChange={(event) => {
                    const { value } = event as OptionType
                    setSelectedPosition(value)
                  }}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                cancelModal()
              }}
            >
              {local.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => addGuarantor()}
              disabled={!selectedEntitledToSignCustomer || !selectedPosition}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )} */}
    </>
  )
}

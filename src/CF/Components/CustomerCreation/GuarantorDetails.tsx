import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import local from '../../../Shared/Assets/ar.json'
import {
  downloadFile,
  getBranchFromCookie,
  getErrorMessage,
  guarantorOrderLocal,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import Can from '../../../Shared/config/Can'
import { Loader } from '../../../Shared/Components/Loader'
import ability from '../../../Shared/config/ability'
import { addGuarantorsToCustomer } from '../../Services/APIs/Customer/customerGuarantors'
import { getCustomerByID } from '../../../Shared/Services/APIs/customer/getCustomer'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import { getCustomersBalances } from '../../../Shared/Services/APIs/customer/customerLoans'
import CustomerSearch from '../../../Shared/Components/CustomerSearch'
import { CFGuarantorDetailsProps } from './types'
import { Customer } from '../../../Shared/Models/Customer'

export const GuarantorDetails = (props: CFGuarantorDetailsProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedGuarantor, setSelectedGuarantor] = useState<Customer>()
  const [searchResults, setSearchResults] = useState({
    results: [],
    empty: false,
  })

  function getIscore(data) {
    if (props.getIscore) {
      props.getIscore(data)
    }
  }

  async function handleSearch(key, query, companySearch?: boolean) {
    const obj = {
      [key]: query,
      from: 0,
      size: 1000,
      excludedIds: [
        props.customerId,
        ...props.guarantors.map((guar) => guar._id),
      ],
      customerType: companySearch ? 'company' : 'individual',
    }
    setLoading(true)
    const results = await searchCustomer(obj)
    if (results.status === 'success') {
      if (results.body.data.length > 0) {
        setSearchResults({ results: results.body.data, empty: false })
      } else {
        setSearchResults({ results: results.body.data, empty: true })
      }
      setLoading(false)
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      setLoading(false)
    }
  }

  async function checkCustomersLimits(customers, guarantor) {
    const customerIds: Array<string> = []
    customers.forEach((customer) => customerIds.push(customer._id))
    setLoading(true)
    const res = await getCustomersBalances({ ids: customerIds })
    if (res.status === 'success') {
      setLoading(false)
      const merged: Array<any> = []
      const validationObject: any = {}
      for (let i = 0; i < customers.length; i += 1) {
        const obj = {
          ...customers[i],
          ...(res.body.data
            ? res.body.data.find((itmInner) => itmInner.id === customers[i]._id)
            : { id: customers[i]._id }),
        }
        delete obj.id
        merged.push(obj)
      }
      if (res.body.data && res.body.data.length > 0) {
        merged.forEach((customer) => {
          if (guarantor) {
            if (
              customer.guarantorIds &&
              customer.guarantorIds.length >= customer.guarantorMaxLoans
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ guarantorIds: customer.guarantorIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  guarantorIds: customer.guarantorIds,
                }
              }
            }
          }
        })
      }
      if (Object.keys(validationObject).length > 0) {
        return { flag: false, validationObject }
      }
      return { flag: true, customers: merged }
    }
    setLoading(false)
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return { flag: false }
  }

  async function selectGuarantor(guarantor) {
    setLoading(true)
    const targetGuarantor = await getCustomerByID(guarantor._id)

    if (targetGuarantor.status === 'success') {
      let errorMessage1 = ''
      let errorMessage2 = ''
      if (targetGuarantor.body.customer.blocked.isBlocked === true) {
        errorMessage1 = local.theCustomerIsBlocked
      }
      const check = await checkCustomersLimits(
        [targetGuarantor.body.customer],
        true
      )
      if (
        check.flag === true &&
        check.customers &&
        targetGuarantor.body.customer.blocked.isBlocked !== true
      ) {
        const newGuarantor = {
          ...targetGuarantor.body.customer,
          id: guarantor._id,
        }
        setSelectedGuarantor(newGuarantor)
      } else if (check.flag === false && check.validationObject) {
        errorMessage2 = local.customerInvolvedInAnotherLoan
      }
      if (errorMessage1 || errorMessage2)
        Swal.fire(
          'error',
          `<span>${errorMessage1}  ${
            errorMessage1 ? `<br/>` : ''
          } ${errorMessage2}</span>`,
          'error'
        )
    } else {
      Swal.fire(
        'Error !',
        getErrorMessage(targetGuarantor.error.error),
        'error'
      )
    }
    setLoading(false)
  }

  async function addGuarantor() {
    const currentGuarantors = [
      selectedGuarantor?._id,
      ...props.guarantors.map((guar) => guar._id),
    ] as string[]
    const obj = {
      customerId: props.customerId,
      guarantorIds: currentGuarantors,
    }
    if (currentGuarantors.length > 0) {
      const res = await addGuarantorsToCustomer(obj)
      if (res.status === 'success') {
        setLoading(false)
        Swal.fire('', local.success, 'success').then(() =>
          window.location.reload()
        )
      } else {
        setLoading(false)
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      }
    }
  }

  async function removeGuarantor(guarantor) {
    Swal.fire({
      title: local.areYouSure,
      text: `${guarantor.customerName} ${local.willNotBeAGuarantor}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.removeGuarantor,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      if (result.value) {
        const guarIds = props.guarantors.filter(
          (guar) => guar._id !== guarantor._id
        )
        const ids: string[] = guarIds.map((guar) => guar._id || '')
        setLoading(true)
        const guarantorToRemove = await addGuarantorsToCustomer({
          customerId: props.customerId,
          guarantorIds: ids,
        })
        if (guarantorToRemove.status === 'success') {
          Swal.fire(local.guarantorRemovedSuccessfully, '', 'success').then(
            () => {
              window.location.reload()
            }
          )
        } else {
          Swal.fire(
            'Error !',
            getErrorMessage(guarantorToRemove.error.error),
            'error'
          )
        }
        setLoading(false)
      }
    })
  }

  function cancelModal() {
    setOpenModal(false)
    setLoading(false)
    setSelectedGuarantor(undefined)
    setSearchResults({ results: [], empty: false })
  }

  const iScoresExist = props.iscores && props.iscores.length > 0
  const isHQ = getBranchFromCookie('ltsbranch') === 'hq'
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') &&
          (props.hasLoan ? isHQ : true) &&
          props.guarantors.length < 2 && (
            <div className="mt-5 mb-5">
              <Button variant="primary" onClick={() => setOpenModal(true)}>
                {local.addEditOrRemoveGuarantor}
              </Button>
            </div>
          )}
        {props.guarantors.length ? (
          <Table style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th />
                <th>{local.name}</th>
                <th>{local.nationalId}</th>
                <th>{local.birthDate}</th>
                <th>{local.customerHomeAddress}</th>
                {iScoresExist && (
                  <>
                    <th>iScore</th>
                    <th />
                    <th />
                    <th />
                    <th />
                  </>
                )}
                {props?.guarantors?.length > 2 && <th />}
              </tr>
            </thead>
            <tbody>
              {props.guarantors.length &&
                props.guarantors.map((guar, index) => {
                  const iScore = props?.iscores?.find(
                    (score) => score.nationalId === guar.nationalId
                  )
                  return (
                    <tr key={index}>
                      <td>
                        {
                          guarantorOrderLocal[
                            index && index > 10 ? 'default' : index
                          ]
                        }
                      </td>
                      <td>{guar.customerName}</td>
                      <td>{guar.nationalId}</td>
                      <td>{timeToArabicDate(guar.birthDate ?? 0, false)}</td>
                      <td>{guar.customerHomeAddress}</td>
                      {iScore?.nationalId && iScore.nationalId?.length && (
                        <>
                          <td
                            style={{
                              color: iscoreStatusColor(iScore.iscore).color,
                            }}
                          >
                            {iScore.iscore}
                          </td>
                          <td>{iscoreStatusColor(iScore.iscore).status}</td>
                          <td>
                            {iScore.bankCodes &&
                              iScore.bankCodes.map(
                                (code) => `${iscoreBank(code)} `
                              )}
                          </td>
                        </>
                      )}
                      {iScoresExist && iScore?.url && (
                        <td>
                          <span
                            style={{ cursor: 'pointer', padding: 10 }}
                            onClick={() => downloadFile(iScore.url)}
                          >
                            <span
                              className="fa fa-file-pdf-o"
                              style={{ margin: '0px 0px 0px 5px' }}
                            />
                            iScore
                          </span>
                        </td>
                      )}
                      {iScoresExist && props.getIscore && (
                        <Can I="getIscore" a="customer">
                          <td>
                            <span
                              style={{ cursor: 'pointer', padding: 10 }}
                              onClick={() => getIscore(guar)}
                            >
                              <span
                                className="fa fa-refresh"
                                style={{ margin: '0px 0px 0px 5px' }}
                              />
                              iScore
                            </span>
                          </td>
                        </Can>
                      )}
                      <td style={{ cursor: 'pointer', padding: 10 }}>
                        <img
                          src={require('../../../Shared/Assets/deleteIcon.svg')}
                          alt={local.delete}
                          onClick={() => removeGuarantor(guar)}
                        />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        ) : (
          <p>{local.noGuarantors}</p>
        )}
      </div>
      {openModal && (
        <Modal size="lg" show={openModal} onHide={() => setOpenModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              {local.add}
              {
                guarantorOrderLocal[
                  props.guarantors.length > 10
                    ? 'default'
                    : props.guarantors.length
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
              selectedCustomer={selectedGuarantor}
              header={
                guarantorOrderLocal[
                  props.guarantors.length > 10
                    ? 'default'
                    : props.guarantors.length
                ]
              }
            />
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
              disabled={!selectedGuarantor}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

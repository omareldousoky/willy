import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import local from '../../Assets/ar.json'
import {
  downloadFile,
  getErrorMessage,
  orderLocal,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
  getBranchFromCookie,
} from '../../Services/utils'
import Can from '../../config/Can'
import { Loader } from '../Loader'
import ability from '../../config/ability'
import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
import { searchCustomer } from '../../Services/APIs/customer/searchCustomer'
import CustomerSearch from '../CustomerSearch'
import { Customer, CFEntitledToSignDetailsProps } from '../../Models/Customer'
import { LtsIcon } from '../LtsIcon'
import { addEntitledToSignToCustomer } from '../../Services/APIs/customer/customerEntitledToSign'

export const EntitledToSignDetails = (props: CFEntitledToSignDetailsProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [
    selectedEntitledToSignCustomer,
    setSelectedEntitledToSignCustomer,
  ] = useState<Customer>()
  const [searchResults, setSearchResults] = useState({
    results: [],
    empty: false,
  })

  function getIscore(data) {
    if (props.getIscore) {
      props.getIscore(data)
    }
  }

  async function handleSearch(key, query) {
    const obj = {
      [key]: query,
      from: 0,
      size: 1000,
      excludedIds: [
        props.customerId,
        ...props.entitledToSignCustomers.map((customer) => customer._id),
      ],
      customerType: 'individual',
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

  async function selectGuarantor(guarantor) {
    setLoading(true)
    const targetGuarantor = await getCustomerByID(guarantor._id)

    if (targetGuarantor.status === 'success') {
      let errorMessage1 = ''
      const errorMessage2 = ''
      if (targetGuarantor.body.customer.blocked.isBlocked === true) {
        errorMessage1 = local.theCustomerIsBlocked
        Swal.fire(
          'error',
          `<span>${errorMessage1}  ${
            errorMessage1 ? `<br/>` : ''
          } ${errorMessage2}</span>`,
          'error'
        )
      } else {
        const newGuarantor = {
          ...targetGuarantor.body.customer,
          id: guarantor._id,
        }
        setSelectedEntitledToSignCustomer(newGuarantor)
      }
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
      selectedEntitledToSignCustomer?._id,
      ...props.entitledToSignCustomers.map((guar) => guar._id),
    ] as string[]
    const obj = {
      customerId: props.customerId,
      entitledToSignIds: currentGuarantors,
    }
    if (currentGuarantors.length > 0) {
      const res = await addEntitledToSignToCustomer(obj)
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
      text: `${guarantor.customerName} ${local.willNotBeEntitledToSign}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.removeEntitledToSign,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      if (result.value) {
        const guarIds = props.entitledToSignCustomers.filter(
          (guar) => guar._id !== guarantor._id
        )
        const ids: string[] = guarIds.map((guar) => guar._id || '')
        setLoading(true)
        const guarantorToRemove = await addEntitledToSignToCustomer({
          customerId: props.customerId,
          entitledToSignIds: ids,
        })
        if (guarantorToRemove.status === 'success') {
          Swal.fire(
            local.entitledToSignRemovedSuccessfully,
            '',
            'success'
          ).then(() => {
            window.location.reload()
          })
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
    setSelectedEntitledToSignCustomer(undefined)
    setSearchResults({ results: [], empty: false })
  }

  const iScoresExist = props.iscores && props.iscores.length > 0
  const isHQ = getBranchFromCookie() === 'hq'
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') &&
          !props.isBlocked &&
          (props.limitStatus === 'approved' ? isHQ : true) &&
          props.entitledToSignCustomers.length < 2 && (
            <div className="mt-5 mb-5">
              <Button variant="primary" onClick={() => setOpenModal(true)}>
                {local.addEntitledToSign}
              </Button>
            </div>
          )}
        {props.entitledToSignCustomers.length ? (
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
                {!props.isBlocked && <th />}
              </tr>
            </thead>
            <tbody>
              {props.entitledToSignCustomers.length &&
                props.entitledToSignCustomers.map((guar, index) => {
                  const iScore = props?.iscores?.find(
                    (score) => score.nationalId === guar.nationalId
                  )
                  return (
                    <tr key={index}>
                      <td>
                        {orderLocal[index && index > 10 ? 'default' : index]}
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
                      <td>
                        {iScoresExist && iScore?.url && (
                          <Button
                            variant="default"
                            onClick={() => downloadFile(iScore.url)}
                          >
                            <LtsIcon
                              name="printer"
                              size="16px"
                              className="pl-2"
                            />
                            iScore
                          </Button>
                        )}
                      </td>
                      {iScoresExist && props.getIscore && (
                        <Can I="getIscore" a="customer">
                          <td>
                            <Button
                              variant="default"
                              onClick={() => getIscore(guar)}
                            >
                              <LtsIcon
                                name="refresh"
                                size="16px"
                                className="pl-2"
                              />
                              iScore
                            </Button>
                          </td>
                        </Can>
                      )}

                      {(props.limitStatus === 'approved' ? isHQ : true) && (
                        <td style={{ padding: 10 }}>
                          <Button
                            variant="default"
                            onClick={() => removeGuarantor(guar)}
                            title={local.delete}
                          >
                            <LtsIcon name="trash" />
                          </Button>
                        </td>
                      )}
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
        <Modal size="lg" show={openModal} onHide={() => setOpenModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              {local.add}
              {
                orderLocal[
                  props.entitledToSignCustomers.length > 10
                    ? 'default'
                    : props.entitledToSignCustomers.length
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
              disabled={!selectedEntitledToSignCustomer}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

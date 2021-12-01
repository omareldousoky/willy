import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import local from '../../Assets/ar.json'
import {
  downloadFile,
  getBranchFromCookie,
  getErrorMessage,
  guarantorOrderLocal,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
} from '../../Services/utils'
import Can from '../../config/Can'
import { Loader } from '../Loader'
import ability from '../../config/ability'
import { addGuarantorsToCustomer } from '../../Services/APIs/customer/customerGuarantors'
import { getCustomerByID } from '../../Services/APIs/customer/getCustomer'
import { searchCustomer } from '../../Services/APIs/customer/searchCustomer'
import CustomerSearch from '../CustomerSearch'
import { Customer, CFGuarantorDetailsProps } from '../../Models/Customer'
import { LtsIcon } from '../LtsIcon'

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
      branchId: props.customerBranch,
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
        setSelectedGuarantor(newGuarantor)
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
  const isHQ = getBranchFromCookie() === 'hq'
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') &&
          !props.isBlocked &&
          (props.limitStatus === 'approved' ? isHQ : true) &&
          props.guarantors.length < 3 && (
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
                {(props.hasLoan ? isHQ : true) && <th />}
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

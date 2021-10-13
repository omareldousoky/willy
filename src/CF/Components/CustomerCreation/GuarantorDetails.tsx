import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import * as local from '../../../Shared/Assets/ar.json'
import {
  downloadFile,
  getErrorMessage,
  guarantorOrderLocal,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import Can from '../../../Shared/config/Can'
import { Loader } from '../../../Shared/Components/Loader'
import ability from '../../../Shared/config/ability'
import { Customer } from '../../../Shared/Services/interfaces'
import { addGuarantorsToCustomer } from '../../Services/APIs/Customer/customerGuarantors'
import { getCustomerByID } from '../../../Shared/Services/APIs/customer/getCustomer'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import CustomerSearch from '../../../Shared/Components/CustomerSearch'

interface Props {
  guarantors: Array<Customer>
  iScores?: any
  getIscore?: Function
  customerId: string
}
export const GuarantorTableView = (props: Props) => {
  const [modalView, changeModal] = useState(false)
  const [loading, changeLoading] = useState(false)
  const [selectedGuarantor, changeSelected] = useState<Customer>({})
  const [searchResults, changeResults] = useState({ results: [], empty: false })

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
    changeLoading(true)
    const results = await searchCustomer(obj)
    if (results.status === 'success') {
      if (results.body.data.length > 0) {
        changeResults({ results: results.body.data, empty: false })
      } else {
        changeResults({ results: results.body.data, empty: true })
      }
      changeLoading(false)
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      changeLoading(false)
    }
  }

  async function selectGuarantor(guarantor) {
    changeLoading(true)
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
        changeSelected(newGuarantor)
      }
    } else {
      Swal.fire(
        'Error !',
        getErrorMessage(targetGuarantor.error.error),
        'error'
      )
    }
    changeLoading(false)
  }

  async function addGuarantor() {
    const currentGuarantors = [
      selectedGuarantor._id,
      ...props.guarantors.map((guar) => guar._id),
    ] as string[]
    const obj = {
      customerId: props.customerId,
      guarantorIds: currentGuarantors,
    }
    if (currentGuarantors.length > 0) {
      const res = await addGuarantorsToCustomer(obj)
      if (res.status === 'success') {
        changeLoading(false)
        Swal.fire('', local.success, 'success').then(() =>
          window.location.reload()
        )
      } else {
        changeLoading(false)
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
        changeLoading(true)
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
        changeLoading(false)
      }
    })
  }

  function cancelModal() {
    changeModal(false)
    changeLoading(false)
    changeSelected({})
    changeResults({ results: [], empty: false })
  }
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') &&
          props.guarantors.length < 2 && (
            <div className="mt-5 mb-5">
              <Button variant="primary" onClick={() => changeModal(true)}>
                {local.addEditOrRemoveGuarantor}
              </Button>
            </div>
          )}
        {props.guarantors.length > 0 ? (
          <Table style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th />
                <th>{local.name}</th>
                <th>{local.nationalId}</th>
                <th>{local.birthDate}</th>
                <th>{local.customerHomeAddress}</th>
                {props.iScores && props.iScores.length > 0 && <th>iScore</th>}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.guarantors.length > 2 && <th />}
              </tr>
            </thead>
            <tbody>
              {props.guarantors.length > 0 &&
                props.guarantors.map((guar, index) => {
                  const iScore =
                    props.iScores && props.iScores.length > 0
                      ? props.iScores.filter(
                          (score) => score.nationalId === guar.nationalId
                        )[0]
                      : {}
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
                      {props.iScores &&
                        props.iScores.length > 0 &&
                        iScore.nationalId?.length > 0 && (
                          <td
                            style={{
                              color: iscoreStatusColor(iScore.iscore).color,
                            }}
                          >
                            {iScore.iscore}
                          </td>
                        )}
                      {props.iScores &&
                        props.iScores.length > 0 &&
                        iScore.nationalId.length > 0 && (
                          <td>{iscoreStatusColor(iScore.iscore).status}</td>
                        )}
                      {props.iScores &&
                        props.iScores.length > 0 &&
                        iScore.nationalId.length > 0 && (
                          <td>
                            {iScore.bankCodes &&
                              iScore.bankCodes.map(
                                (code) => `${iscoreBank(code)} `
                              )}
                          </td>
                        )}
                      {props.iScores && props.iScores.length > 0 && iScore.url && (
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
                      {props.iScores &&
                        props.iScores.length > 0 &&
                        props.getIscore && (
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
      {modalView && (
        <Modal size="lg" show={modalView} onHide={() => changeModal(false)}>
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
              disabled={Object.keys(selectedGuarantor).length === 0}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

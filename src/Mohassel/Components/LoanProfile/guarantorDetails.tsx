import React, { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2'
import ModalFooter from 'react-bootstrap/ModalFooter'
import * as local from '../../../Shared/Assets/ar.json'
import { getRenderDate } from '../../Services/getRenderDate'
import {
  downloadFile,
  getErrorMessage,
  guarantorOrderLocal,
  iscoreStatusColor,
  iscoreBank,
} from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import CustomerSearch from '../CustomerSearch/customerSearchTable'
import { Loader } from '../../../Shared/Components/Loader'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer'
import { getCustomersBalances } from '../../Services/APIs/Customer-Creation/customerLoans'
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer'
import { editGuarantors } from '../../Services/APIs/loanApplication/editGuarantors'
import ability from '../../config/ability'

interface Props {
  guarantors: any
  iScores?: any
  getIscore?: Function
  status?: string
  getGeoArea: Function
  customerId?: string
  application: any
}

export const GuarantorView = (props: Props) => {
  return (
    <div className="d-flex flex-wrap">
      {props.guarantors.length > 0 ? (
        props.guarantors.map((guar, i) => (
          <div key={i} style={{ margin: 'auto' }}>
            <div className="d-flex flex-row">
              <p>{local.name}</p>
              <p style={{ margin: '0 10px 0 0' }}>{guar.customerName}</p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.guarantorCode}</p>
              <p style={{ margin: '0 10px 0 0' }}>{guar.key}</p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.nationalId}</p>
              <p style={{ margin: '0 10px 0 0' }}>{guar.nationalId}</p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.birthDate}</p>
              <p style={{ margin: '0 10px 0 0' }}>
                {getRenderDate(guar.birthDate)}
              </p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.nationalIdIssueDate}</p>
              <p style={{ margin: '0 10px 0 0' }}>
                {getRenderDate(guar.nationalIdIssueDate)}
              </p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.customerHomeAddress}</p>
              <p
                style={{
                  width: '50%',
                  margin: '0 10px 0 0',
                  wordBreak: 'break-all',
                }}
              >
                {guar.customerHomeAddress}
              </p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.homePhoneNumber}</p>
              <p style={{ margin: '0 10px 0 0' }}>{guar.homePhoneNumber}</p>
            </div>
            <div className="d-flex flex-row">
              <p>{local.mobilePhoneNumber}</p>
              <p style={{ margin: '0 10px 0 0' }}>{guar.mobilePhoneNumber}</p>
            </div>
          </div>
        ))
      ) : (
        <p>{local.noGuarantors}</p>
      )}
    </div>
  )
}
export const GuarantorTableView = (props: Props) => {
  const [modalView, changeModal] = useState(false)
  const [loading, changeLoading] = useState(false)
  const [searchResults, changeResults] = useState({ results: [], empty: false })
  const [selectedGuarantor, changeSelected] = useState({})
  const [selectedGuarantorId, changeSelectedId] = useState('')
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
        ...props.guarantors.map((guar) => guar._id),
      ],
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
  async function checkCustomersLimits(customers, guarantor) {
    const customerIds: Array<string> = []
    customers.forEach((customer) => customerIds.push(customer._id))
    changeLoading(true)
    const res = await getCustomersBalances({ ids: customerIds })
    if (res.status === 'success') {
      changeLoading(false)
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
              customer.applicationIds &&
              customer.applicationIds.length > 0 &&
              !customer.allowGuarantorLoan
            ) {
              validationObject[customer._id] = {
                customerName: customer.customerName,
                applicationIds: customer.applicationIds,
              }
            }
            if (
              customer.loanIds &&
              customer.loanIds.length > 0 &&
              !customer.allowGuarantorLoan
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ loanIds: customer.loanIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  loanIds: customer.loanIds,
                }
              }
            }
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
    changeLoading(false)
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    return { flag: false }
  }
  async function selectGuarantor(guarantor) {
    changeLoading(true)
    const selectedGuarantor = await getCustomerByID(guarantor._id)

    if (selectedGuarantor.status === 'success') {
      let errorMessage1 = ''
      let errorMessage2 = ''
      if (selectedGuarantor.body.blocked.isBlocked === true) {
        errorMessage1 = local.theCustomerIsBlocked
      }
      const check = await checkCustomersLimits([selectedGuarantor.body], true)
      if (
        check.flag === true &&
        check.customers &&
        selectedGuarantor.body.blocked.isBlocked !== true
      ) {
        const newguarantor = { ...selectedGuarantor.body, id: guarantor._id }
        changeSelected(newguarantor)
        changeSelectedId(guarantor._id)
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
        getErrorMessage(selectedGuarantor.error.error),
        'error'
      )
    }
    changeLoading(false)
  }
  async function addGuarantor() {
    const guarIds = props.guarantors.map((guar) => guar._id)
    guarIds.push(selectedGuarantorId)
    changeLoading(true)
    const guarantorToAdd = await editGuarantors(props.application._id, {
      guarantorIds: guarIds,
    })
    if (guarantorToAdd.status === 'success') {
      Swal.fire(local.guarantorAddedSuccessfully, '', 'success').then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire('Error !', getErrorMessage(guarantorToAdd.error.error), 'error')
    }
    changeLoading(false)
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
        const ids = guarIds.map((guar) => guar._id)
        changeLoading(true)
        const guarantorToRemove = await editGuarantors(props.application._id, {
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
    changeResults({ results: [], empty: false })
    changeSelected({})
    changeSelectedId('')
    changeModal(false)
  }
  const pass =
    props.status &&
    ['reviewed', 'created', 'approved', 'secondReview', 'thirdReview'].includes(
      props.status
    )
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center ">
        {((pass && ability.can('editApplicationGuarantors', 'application')) ||
          (props.status &&
            props.status === 'issued' &&
            ability.can('editIssuedLoanGuarantors', 'application'))) && (
          <Button
            variant="primary"
            style={{ marginBottom: 10 }}
            onClick={() => changeModal(true)}
          >
            {local.addGuarantor}
          </Button>
        )}
        {props.guarantors.length > 0 ? (
          <Table style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th />
                <th>{local.guarantorCode}</th>
                <th>{local.name}</th>
                <th>{local.nationalId}</th>
                <th>{local.area}</th>
                <th>{local.customerHomeAddress}</th>
                <th>{local.telephone}</th>
                {props.iScores && props.iScores.length > 0 && <th>iScore</th>}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {props.iScores && props.iScores.length > 0 && <th />}
                {((pass &&
                  ability.can('editApplicationGuarantors', 'application')) ||
                  (props.status &&
                    props.status === 'issued' &&
                    ability.can(
                      'editIssuedLoanGuarantors',
                      'application'
                    ))) && <th />}
              </tr>
            </thead>
            <tbody>
              {props.guarantors.length > 0 &&
                props.guarantors.map((guar, i) => {
                  const iScore =
                    props.iScores && props.iScores.length > 0
                      ? props.iScores.filter(
                          (score) => score.nationalId === guar.nationalId
                        )[0]
                      : {}
                  const area = props.getGeoArea(guar.geoAreaId)
                  return (
                    <tr key={i}>
                      <td>
                        {guarantorOrderLocal[i && i > 10 ? 'default' : i]}
                      </td>
                      <td>{guar.key}</td>
                      <td>{guar.customerName}</td>
                      <td>{guar.nationalId}</td>
                      <td
                        style={{
                          color:
                            !area.active && area.name !== '-' ? 'red' : 'black',
                        }}
                      >
                        {area.name}
                      </td>
                      <td>{guar.customerHomeAddress}</td>
                      <td>{guar.mobilePhoneNumber}</td>
                      {props.iScores &&
                        props.iScores.length > 0 &&
                        iScore.nationalId.length > 0 && (
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
                            {' '}
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
                        props.getIscore &&
                        props.status &&
                        ![
                          'approved',
                          'created',
                          'issued',
                          'rejected',
                          'paid',
                          'pending',
                          'canceled',
                        ].includes(props.status) && (
                          <Can I="getIscore" a="customer">
                            <td>
                              <span
                                style={{ cursor: 'pointer', padding: 10 }}
                                onClick={() => getIscore(guar)}
                              >
                                {' '}
                                <span
                                  className="fa fa-refresh"
                                  style={{ margin: '0px 0px 0px 5px' }}
                                />
                                iScore
                              </span>
                            </td>
                          </Can>
                        )}
                      {props.guarantors.length >
                        props.application.product.noOfGuarantors &&
                        ((pass &&
                          ability.can(
                            'editApplicationGuarantors',
                            'application'
                          )) ||
                          (props.status &&
                            props.status === 'issued' &&
                            ability.can(
                              'editIssuedLoanGuarantors',
                              'application'
                            ))) && (
                          <td style={{ cursor: 'pointer', padding: 10 }}>
                            <img
                              src={require('../../../Shared/Assets/deleteIcon.svg')}
                              alt="delete"
                              onClick={() => removeGuarantor(guar)}
                            />
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
      {modalView && (
        <Modal size="lg" show={modalView} onHide={() => changeModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              {local.add}{' '}
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
          <ModalFooter>
            <Button variant="secondary" onClick={() => cancelModal()}>
              {local.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => addGuarantor()}
              disabled={selectedGuarantorId.length === 0}
            >
              {local.submit}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

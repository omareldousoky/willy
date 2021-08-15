import React, { useState } from 'react'
// import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

import * as local from '../../../Shared/Assets/ar.json'
import {
  downloadFile,
  // getErrorMessage,
  guarantorOrderLocal,
  iscoreBank,
  iscoreStatusColor,
} from '../../../Shared/Services/utils'
import Can from '../../../Shared/config/Can'
import { Loader } from '../../../Shared/Components/Loader'
// import { editGuarantors } from '../../../Shared/Services/APIs/loanApplication/editGuarantors'
import ability from '../../../Shared/config/ability'
import { Customer } from '../../../Shared/Services/interfaces'

type Guarantor = Customer & { position?: string }
interface Props {
  guarantors: Array<CustomerGuarantor>
  iScores?: any
  getIscore?: Function
  // status?: string
  // getGeoArea: Function
  customerId?: string
  // application: any
}
export interface CustomerGuarantor {
  customerName: string
  birthDate: number
  nationalId: string
  customerHomeAddress: string
}
export const GuarantorTableView = (props: Props) => {
  const [modalView, changeModal] = useState(false)
  const [loading, changeLoading] = useState(false)
  function getIscore(data) {
    if (props.getIscore) {
      props.getIscore(data)
    }
  }
  // async function addGuarantor() {
  //   const guarIds = props.guarantors.map((guar) => guar._id)
  //   guarIds.push(selectedGuarantorId)
  //   changeLoading(true)
  //   const guarantorToAdd = await editGuarantors(props.application._id, {
  //     guarantorIds: guarIds,
  //   })
  //   if (guarantorToAdd.status === 'success') {
  //     Swal.fire(local.guarantorAddedSuccessfully, '', 'success').then(() => {
  //       window.location.reload()
  //     })
  //   } else {
  //     Swal.fire('Error !', getErrorMessage(guarantorToAdd.error.error), 'error')
  //   }
  //   changeLoading(false)
  // }
  // async function removeGuarantor(guarantor) {
  //   Swal.fire({
  //     title: local.areYouSure,
  //     text: `${guarantor.customerName || guarantor.businessName} ${
  //       local.willNotBeAGuarantor
  //     }`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: local.removeGuarantor,
  //     cancelButtonText: local.cancel,
  //   }).then(async (result) => {
  //     if (result.value) {
  //       const guarIds = props.guarantors.filter(
  //         (guar) => guar._id !== guarantor._id
  //       )
  //       const ids = guarIds.map((guar) => guar._id)
  //       changeLoading(true)
  //       const guarantorToRemove = await editGuarantors(props.application._id, {
  //         guarantorIds: ids,
  //       })
  //       if (guarantorToRemove.status === 'success') {
  //         Swal.fire(local.guarantorRemovedSuccessfully, '', 'success').then(
  //           () => {
  //             window.location.reload()
  //           }
  //         )
  //       } else {
  //         Swal.fire(
  //           'Error !',
  //           getErrorMessage(guarantorToRemove.error.error),
  //           'error'
  //         )
  //       }
  //       changeLoading(false)
  //     }
  //   })
  // }
  function cancelModal() {
    changeModal(false)
    changeLoading(false)
  }
  // const pass =
  //   props.status &&
  //   ['reviewed', 'created', 'approved', 'secondReview', 'thirdReview'].includes(
  //     props.status
  //   )
  // const individualGuarantors: { guarantor: Guarantor; index: number }[] = []
  // const companyGuarantors: { guarantor: Guarantor; index: number }[] = []
  // props.guarantors.forEach((guarantor, i) => {
  //   const guarObj = { guarantor, index: i }
  //   guarantor.customerType === 'company'
  //     ? companyGuarantors.push(guarObj)
  //     : individualGuarantors.push(guarObj)
  // })
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {console.log('Here')}
        {ability.can('editApplicationGuarantors', 'application') && (
          <div className="mt-5 mb-5">
            <Button variant="primary" onClick={() => changeModal(true)}>
              {local.addGuarantor}
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
                {ability.can('editApplicationGuarantors', 'application') && (
                  <th />
                )}
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
                      <td>{guar.birthDate}</td>
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
                      {ability.can(
                        'editApplicationGuarantors',
                        'application'
                      ) && (
                        <td style={{ cursor: 'pointer', padding: 10 }}>
                          <img
                            src={require('../../../Shared/Assets/deleteIcon.svg')}
                            alt={local.delete}
                            onClick={() => console.log(guar)}
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
            <div>hey</div>
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
              onClick={() => console.log('add')}
              // disabled={selectedGuarantorId.length === 0}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

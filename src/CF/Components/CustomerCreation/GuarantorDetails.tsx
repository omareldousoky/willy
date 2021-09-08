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
import { getCustomersBalances } from '../../../Shared/Services/APIs/customer/customerLoans'
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
    const targetGuarantor = await getCustomerByID(guarantor._id)

    if (targetGuarantor.status === 'success') {
      let errorMessage1 = ''
      let errorMessage2 = ''
      if (targetGuarantor.body.blocked.isBlocked === true) {
        errorMessage1 = local.theCustomerIsBlocked
      }
      const check = await checkCustomersLimits([targetGuarantor.body], true)
      if (
        check.flag === true &&
        check.customers &&
        targetGuarantor.body.blocked.isBlocked !== true
      ) {
        const newGuarantor = { ...targetGuarantor.body, id: guarantor._id }
        changeSelected(newGuarantor)
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
    changeLoading(false)
  }

  async function addGuarantor() {
    const currentGuarantors = [
      selectedGuarantor._id,
      ...props.guarantors.map((guar) => guar._id),
    ] as string[]
    const obj = {
      customerId: props.customerId,
      customerGuarantors: currentGuarantors,
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
  function cancelModal() {
    changeModal(false)
    changeLoading(false)
    changeSelected({})
  }
  return (
    <>
      <div className="d-flex flex-column align-items-start justify-content-center">
        {ability.can('addCustomerGuarantors', 'customer') && (
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

import React, { useState } from 'react'
import Swal from 'sweetalert2'
import * as Yup from 'yup'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import { Formik } from 'formik'
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
import { CustomerGuarantor } from '../../../Shared/Services/interfaces'
import { CustomerGuarantorsForm } from './GuarantorDetailsForm'
import { addGuarantorsToCustomer } from '../../Services/APIs/Customer/customerGuarantors'
import { CFGuarantorTableViewProp } from '../../../Shared/Components/Profile/types'

interface Props {
  guarantors: Array<CustomerGuarantor>
  iScores?: any
  getIscore?: Function
  customerId?: string
}
export const GuarantorTableView = (props: Props) => {
  const [modalView, changeModal] = useState(false)
  const [loading, changeLoading] = useState(false)
  function getIscore(data) {
    if (props.getIscore) {
      props.getIscore(data)
    }
  }
  async function submit(values) {
    values.guarantors.forEach(function (guar) {
      guar.birthDate = new Date(guar.birthDate).valueOf()
    })
    const obj = {
      customerId: props.customerId,
      customerGuarantors: values.guarantors,
    } as CFGuarantorTableViewProp
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
  function cancelModal() {
    changeModal(false)
    changeLoading(false)
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
                      <td>{guar.name}</td>
                      <td>{guar.nationalId}</td>
                      <td>{timeToArabicDate(guar.birthDate, false)}</td>
                      <td>{guar.address}</td>
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
          <Modal.Body>
            <Formik
              initialValues={{ guarantors: props.guarantors }}
              onSubmit={submit}
              validationSchema={Yup.object().shape({
                guarantors: Yup.array().of(
                  Yup.object().shape({
                    name: Yup.string().required(local.required),
                    address: Yup.string().required(local.required),
                    nationalId: Yup.number()
                      .required()
                      .min(10000000000000, local.nationalIdLengthShouldBe14)
                      .max(99999999999999, local.nationalIdLengthShouldBe14)
                      .required(local.required)
                      .when('birthDate', {
                        is: '1800-01-01',
                        then: Yup.number().test(
                          'error',
                          local.wrongNationalId,
                          () => false
                        ),
                        otherwise: Yup.number()
                          .required()
                          .min(10000000000000, local.nationalIdLengthShouldBe14)
                          .max(99999999999999, local.nationalIdLengthShouldBe14)
                          .required(local.required),
                      }),
                  })
                ),
              })}
              validateOnBlur
              validateOnChange
              enableReinitialize
            >
              {(formikProps) => <CustomerGuarantorsForm {...formikProps} />}
            </Formik>
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
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

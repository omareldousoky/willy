import React, { FunctionComponent, useEffect, useState } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { getHalanVendors } from '../../Services/APIs/Vendor/getHalanVendors'
import { getDateString, getErrorMessage } from '../../../Shared/Services/utils'
import { Loader } from '../../../Shared/Components/Loader'
import { getVendorLastSettlementDate } from '../../../Shared/Services/APIs/VendorSettlements/searchSettlements'

const VendorSettlementSearch: FunctionComponent<{
  datePlaceholder: string
  submit: (data) => void
}> = ({ datePlaceholder, submit }) => {
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<{ arabic_name: string; id: string }[]>(
    []
  )
  const [latestSettledAt, setLatestSettledAt] = useState(0)

  async function getVendors() {
    setLoading(true)
    const res = await getHalanVendors()
    setLoading(false)
    if (res.status === 'success') {
      setVendors(res.body.data)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  async function getLastSettlementDate(merchantId: string) {
    setLoading(true)
    const res = await getVendorLastSettlementDate({ merchantId })
    setLoading(false)
    if (res.status === 'success') {
      setLatestSettledAt(res.body.latestSettlementDate ?? 0)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  useEffect(() => {
    getVendors()
  }, [])
  return (
    <Formik
      enableReinitialize
      initialValues={{
        // fromDate: '',
        toDate: '',
        merchantId: '',
      }}
      onSubmit={submit}
      validateOnBlur
      validateOnChange
    >
      {(formikProps) => (
        <Form
          onSubmit={formikProps.handleSubmit}
          style={{ padding: '10px 30px 26px 30px' }}
        >
          <Loader open={loading} type="fullsection" />
          <Row>
            <Col sm={6}>
              <div className="dropdown-container">
                <p className="dropdown-label">{`${local.vendor}*`}</p>
                <Form.Control
                  as="select"
                  type="select"
                  name="merchantId"
                  data-qc="merchantId"
                  className="border-0"
                  value={formikProps.values.merchantId}
                  onChange={(e) => {
                    const id = e.currentTarget.value
                    getLastSettlementDate(id)
                    formikProps.setFieldValue('merchantId', id)
                  }}
                >
                  <option value="" disabled />
                  {vendors.map((vendor) => (
                    <option value={vendor.id}>{vendor.arabic_name}</option>
                  ))}
                </Form.Control>
              </div>
            </Col>
            <Col sm={6} className="d-flex align-items-center">
              <div
                className="dropdown-container"
                style={{ flex: 1, alignItems: 'center' }}
              >
                <p className="dropdown-label text-nowrap border-0 align-self-stretch mr-2">
                  {datePlaceholder || local.creationDate}
                </p>
                {/* <span>{local.from}</span>
                <Form.Control
                  required
                  className="border-0"
                  type="date"
                  name="fromDate"
                  data-qc="fromDate"
                  value={formikProps.values.fromDate}
                  onChange={(e) => {
                    formikProps.setFieldValue('fromDate', e.currentTarget.value)
                    if (e.currentTarget.value === '')
                      formikProps.setFieldValue('toDate', '')
                  }}
                /> */}
                <span className="mr-1">{local.to}</span>
                <Form.Control
                  required
                  className="border-0"
                  type="date"
                  name="toDate"
                  data-qc="toDate"
                  value={formikProps.values.toDate}
                  min={getDateString(latestSettledAt)}
                  max={getDateString(
                    new Date().setHours(23, 59, 59, 999).valueOf() - 86400000
                  )}
                  onChange={formikProps.handleChange}
                  disabled={formikProps.values.merchantId.length === 0}
                />
              </div>
            </Col>
            <Col className="d-flex">
              <Button
                type="submit"
                className="ml-auto"
                style={{ width: 180, height: 50, marginTop: 20 }}
                disabled={
                  formikProps.values.merchantId.length === 0 ||
                  formikProps.values.toDate.length === 0
                }
              >
                {local.search}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default VendorSettlementSearch

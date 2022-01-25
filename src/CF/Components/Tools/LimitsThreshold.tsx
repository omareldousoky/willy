import React, { FunctionComponent, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageToolsArray } from './manageToolsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { getCFLimits, setCFLimits } from '../../Services/APIs/config'
import {
  GlobalCFLimits,
  globalCfLimitsInitialValues,
} from '../../../Shared/Models/globalLimits'
import { limitThresholdValidationSchema } from './limitThresholdValidation'
import { minValue } from '../../../Shared/localUtils'

const LimitsThreshold: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const [globalLimits, setLimits] = useState<GlobalCFLimits>(
    globalCfLimitsInitialValues
  )
  async function fetchCFLimits() {
    setLoading(true)
    const limits = await getCFLimits()
    if (limits.status === 'success') {
      setLimits(limits.body)
      setLoading(false)
    } else {
      setLoading(false)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(limits.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  useEffect(() => {
    fetchCFLimits()
  }, [])

  async function update(values) {
    Swal.fire({
      title: local.areYouSure,
      text: `${local.principalMaxWillChange}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.edit,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      if (result.value) {
        setLoading(true)
        const res = await setCFLimits(values)
        if (res.status === 'success') {
          setLoading(false)
          Swal.fire({
            text: local.principalMaxChangeSuccess,
            icon: 'success',
            confirmButtonText: local.confirmationText,
          }).then(() => window.location.reload())
        } else {
          setLoading(false)
          Swal.fire({
            title: local.errorTitle,
            text: getErrorMessage(res.error.error),
            icon: 'error',
            confirmButtonText: local.confirmationText,
          })
        }
      }
    })
  }
  const tabsArray = manageToolsArray()
  return (
    <>
      <HeaderWithCards
        header={local.principalRange}
        array={tabsArray}
        active={tabsArray
          .map((item) => {
            return item.icon
          })
          .indexOf('principal-range')}
      />
      <Loader type="fullscreen" open={loading} />
      <Card className="main-card">
        <Formik
          initialValues={globalLimits}
          onSubmit={update}
          validationSchema={limitThresholdValidationSchema}
          validateOnBlur
          validateOnChange
          enableReinitialize
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit} className="data-form">
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="maxTenorInMonths">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.maxInstallmentsLimit}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="maxTenorInMonths"
                        data-qc="maxTenorInMonths"
                        value={formikProps.values.maxTenorInMonths}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.maxTenorInMonths) &&
                          Boolean(formikProps.touched.maxTenorInMonths)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.maxTenorInMonths}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="annualInterestRate">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.maxInterestLimit}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="annualInterestRate"
                        data-qc="annualInterestRate"
                        value={formikProps.values.annualInterestRate}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.annualInterestRate) &&
                          Boolean(formikProps.touched.annualInterestRate)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.annualInterestRate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="globalCFMin">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.globalCFMin}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="globalCFMin"
                        data-qc="globalCFMin"
                        value={formikProps.values.globalCFMin}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.globalCFMin) &&
                          Boolean(formikProps.touched.globalCFMin)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.globalCFMin}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="globalCFMax">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.globalCFMax}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="globalCFMax"
                        data-qc="globalCFMax"
                        value={formikProps.values.globalCFMax}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.globalCFMax) &&
                          Boolean(formikProps.touched.globalCFMax)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.globalCFMax === 'globalCFMaxError'
                          ? minValue(formikProps.values.globalCFMin)
                          : formikProps.errors.globalCFMax}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="CFHQMinimumApprovalLimit">
                    <Form.Label
                      className="data-label"
                      column
                      sm={10}
                    >{`${local.CFHQMinimumApprovalLimit}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="CFHQMinimumApprovalLimit"
                        data-qc="CFHQMinimumApprovalLimit"
                        value={formikProps.values.CFHQMinimumApprovalLimit}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(
                            formikProps.errors.CFHQMinimumApprovalLimit
                          ) &&
                          Boolean(formikProps.touched.CFHQMinimumApprovalLimit)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.CFHQMinimumApprovalLimit}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentLowStart">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentLowStart}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentLowStart"
                        data-qc="DBRPercentLowStart"
                        value={formikProps.values.DBRPercentLowStart}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentLowStart) &&
                          Boolean(formikProps.touched.DBRPercentLowStart)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentLowStart}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentLow">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentLow}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentLow"
                        data-qc="DBRPercentLow"
                        value={formikProps.values.DBRPercentLow}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentLow) &&
                          Boolean(formikProps.touched.DBRPercentLow)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentLow}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentMidStart">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentMidStart}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentMidStart"
                        data-qc="DBRPercentMidStart"
                        value={formikProps.values.DBRPercentMidStart}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentMidStart) &&
                          Boolean(formikProps.touched.DBRPercentMidStart)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentMidStart ===
                        'midStartLimitError'
                          ? minValue(formikProps.values.DBRPercentLowStart)
                          : formikProps.errors.DBRPercentMidStart}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentMid">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentMid}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentMid"
                        data-qc="DBRPercentMid"
                        value={formikProps.values.DBRPercentMid}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentMid) &&
                          Boolean(formikProps.touched.DBRPercentMid)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentMid}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentHighStart">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentHighStart}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentHighStart"
                        data-qc="DBRPercentHighStart"
                        value={formikProps.values.DBRPercentHighStart}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentHighStart) &&
                          Boolean(formikProps.touched.DBRPercentHighStart)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentHighStart ===
                        'highStartLimitError'
                          ? minValue(formikProps.values.DBRPercentMidStart)
                          : formikProps.errors.DBRPercentHighStart}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="DBRPercentHigh">
                    <Form.Label
                      className="data-label"
                      column
                      sm={5}
                    >{`${local.DBRPercentHigh}*`}</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        name="DBRPercentHigh"
                        data-qc="DBRPercentHigh"
                        value={formikProps.values.DBRPercentHigh}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          Boolean(formikProps.errors.DBRPercentHigh) &&
                          Boolean(formikProps.touched.DBRPercentHigh)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.DBRPercentHigh}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mb-4 col-sm-6">
                <Button type="submit" variant="primary big-btn">
                  {local.submit}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  )
}

export default LimitsThreshold

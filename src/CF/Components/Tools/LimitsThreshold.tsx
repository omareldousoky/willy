import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageToolsArray } from './manageToolsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { getCFLimits, setCFLimits } from '../../Services/APIs/config'

interface Limits {
  maxTenorInMonths: number
  annualInterestRate: number
  DBRPercentLowStart: number
  DBRPercentMidStart: number
  DBRPercentHighStart: number
  DBRPercentLow: number
  DBRPercentMid: number
  DBRPercentHigh: number
  globalCFMin: number
  globalCFMax: number
}
interface State {
  loading: boolean
  principals: Limits
  manageToolsTabs: any[]
}

class LimitsThreshold extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loading: false,
      principals: {
        maxTenorInMonths: 0,
        annualInterestRate: 0,
        DBRPercentLowStart: 0,
        DBRPercentMidStart: 0,
        DBRPercentHighStart: 0,
        DBRPercentLow: 0,
        DBRPercentMid: 0,
        DBRPercentHigh: 0,
        globalCFMin: 0,
        globalCFMax: 0,
      },
      manageToolsTabs: [],
    }
  }

  componentDidMount() {
    this.getCFLimits()
    this.setState({ manageToolsTabs: manageToolsArray() })
  }

  async getCFLimits() {
    this.setState({ loading: true })
    const limits = await getCFLimits()
    if (limits.status === 'success') {
      const principals = {
        maxTenorInMonths: limits.body.maxTenorInMonths,
        annualInterestRate: limits.body.annualInterestRate,
        DBRPercentLowStart: limits.body.DBRPercentLowStart,
        DBRPercentMidStart: limits.body.DBRPercentMidStart,
        DBRPercentHighStart: limits.body.DBRPercentHighStart,
        DBRPercentLow: limits.body.DBRPercentLow,
        DBRPercentMid: limits.body.DBRPercentMid,
        DBRPercentHigh: limits.body.DBRPercentHigh,
        globalCFMin: limits.body.globalCFMin,
        globalCFMax: limits.body.globalCFMax,
      }
      this.setState({
        loading: false,
        principals,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(limits.error.error), 'error')
      )
    }
  }

  update = (values) => {
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
        this.setState({ loading: true })
        const res = await setCFLimits(values)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire('', local.principalMaxChangeSuccess, 'success').then(() =>
            window.location.reload()
          )
        } else {
          this.setState({ loading: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    })
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.principalRange}
          array={this.state.manageToolsTabs}
          active={this.state.manageToolsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('principal-range')}
        />
        <Loader type="fullscreen" open={this.state.loading} />
        <Card className="main-card">
          <Formik
            initialValues={this.state.principals}
            onSubmit={this.update}
            validationSchema={Yup.object().shape({
              maxTenorInMonths: Yup.number().integer().required(local.required),
              annualInterestRate: Yup.number()
                .integer()
                .required(local.required),
              DBRPercentLowStart: Yup.number()
                .integer()
                .required(local.required),
              DBRPercentMidStart: Yup.number()
                .integer()
                .required(local.required),
              DBRPercentHighStart: Yup.number()
                .integer()
                .required(local.required),
              DBRPercentLow: Yup.number().integer().required(local.required),
              DBRPercentMid: Yup.number().integer().required(local.required),
              DBRPercentHigh: Yup.number().integer().required(local.required),
              globalCFMin: Yup.number().integer().required(local.required),
              globalCFMax: Yup.number().integer().required(local.required),
            })}
            validateOnBlur
            validateOnChange
            enableReinitialize
          >
            {(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit} className="data-form">
                <Form.Group controlId="maxTenorInMonths">
                  <Form.Label
                    className="data-label"
                    style={{ textAlign: 'right' }}
                    column
                    sm={3}
                  >{`${local.months}*`}</Form.Label>
                  <Col sm={6}>
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
                <Form.Group controlId="annualInterestRate">
                  <Form.Label
                    className="data-label"
                    style={{ textAlign: 'right' }}
                    column
                    sm={3}
                  >{`${local.interest}*`}</Form.Label>
                  <Col sm={6}>
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
                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="globalCFMin">
                      <Form.Label
                        className="data-label"
                        column
                        sm={3}
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
                        sm={3}
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
                          {formikProps.errors.globalCFMax}
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
                        sm={3}
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
                        sm={3}
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
                        style={{ textAlign: 'right' }}
                        column
                        sm={3}
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
                          {formikProps.errors.DBRPercentMidStart}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="DBRPercentMid">
                      <Form.Label
                        className="data-label"
                        column
                        sm={3}
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
                        style={{ textAlign: 'right' }}
                        column
                        sm={3}
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
                          {formikProps.errors.DBRPercentHighStart}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="DBRPercentHigh">
                      <Form.Label
                        className="data-label"
                        column
                        sm={3}
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
}

export default withRouter(LimitsThreshold)

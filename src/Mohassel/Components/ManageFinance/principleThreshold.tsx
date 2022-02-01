import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Col from 'react-bootstrap/Col'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageToolsArray } from '../Tools/manageToolsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import {
  getMaxPrinciples,
  setMaxPrinciples,
} from '../../../Shared/Services/APIs/config'

interface Principals {
  maxIndividualPrincipal: number
  maxGroupIndividualPrincipal: number
  maxGroupPrincipal: number
  maxGroupReturningIndividualPrincipal: number
}
interface State {
  loading: boolean
  principals: Principals
  manageToolsTabs: any[]
}

class PrincipleThreshold extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loading: false,
      principals: {
        maxIndividualPrincipal: 0,
        maxGroupIndividualPrincipal: 0,
        maxGroupPrincipal: 0,
        maxGroupReturningIndividualPrincipal: 0,
      },
      manageToolsTabs: [],
    }
  }

  componentDidMount() {
    this.getMaxPrinciples()
    this.setState({ manageToolsTabs: manageToolsArray() })
  }

  async getMaxPrinciples() {
    this.setState({ loading: true })
    const princples = await getMaxPrinciples()
    if (princples.status === 'success') {
      const principals = {
        maxIndividualPrincipal: princples.body.maxIndividualPrincipal,
        maxGroupIndividualPrincipal: princples.body.maxGroupIndividualPrincipal,
        maxGroupPrincipal: princples.body.maxGroupPrincipal,
        maxGroupReturningIndividualPrincipal:
          princples.body.maxGroupReturningIndividualPrincipal,
      }
      this.setState({
        loading: false,
        principals,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(princples.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
        const res = await setMaxPrinciples(values)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire({
            text: local.principalMaxChangeSuccess,
            icon: 'success',
            confirmButtonText: local.confirmationText,
          }).then(() => window.location.reload())
        } else {
          this.setState({ loading: false }, () =>
            Swal.fire({
              title: local.errorTitle,
              text: getErrorMessage(res.error.error),
              icon: 'error',
              confirmButtonText: local.confirmationText,
            })
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
              maxIndividualPrincipal: Yup.number()
                .integer()
                .required(local.required),
              maxGroupIndividualPrincipal: Yup.number()
                .lessThan(
                  Yup.ref('maxGroupPrincipal'),
                  local.individualInGroupPrincipalMustBeLessThanGroupPrincipal
                )
                .integer()
                .required(local.required),
              maxGroupReturningIndividualPrincipal: Yup.number()
                .lessThan(
                  Yup.ref('maxGroupPrincipal'),
                  local.individualInGroupPrincipalMustBeLessThanGroupPrincipal
                )
                .integer()
                .required(local.required),
              maxGroupPrincipal: Yup.number()
                .integer()
                .required(local.required),
            })}
            validateOnBlur
            validateOnChange
            enableReinitialize
          >
            {(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit} className="data-form">
                <Form.Group controlId="maxIndividualPrincipal">
                  <Form.Label
                    className="data-label"
                    style={{ textAlign: 'right' }}
                    column
                    sm={3}
                  >{`${local.maxIndividualPrincipal}*`}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="maxIndividualPrincipal"
                      data-qc="maxIndividualPrincipal"
                      value={formikProps.values.maxIndividualPrincipal}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.maxIndividualPrincipal) &&
                        Boolean(formikProps.touched.maxIndividualPrincipal)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.maxIndividualPrincipal}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group controlId="maxGroupIndividualPrincipal">
                  <Form.Label
                    className="data-label"
                    style={{ textAlign: 'right' }}
                    column
                    sm={3}
                  >{`${local.maxGroupIndividualPrincipal}*`}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="maxGroupIndividualPrincipal"
                      data-qc="maxGroupIndividualPrincipal"
                      value={formikProps.values.maxGroupIndividualPrincipal}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(
                          formikProps.errors.maxGroupIndividualPrincipal
                        ) &&
                        Boolean(formikProps.touched.maxGroupIndividualPrincipal)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.maxGroupIndividualPrincipal}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group controlId="maxGroupReturningIndividualPrincipal">
                  <Form.Label
                    className="data-label"
                    style={{ textAlign: 'right' }}
                    column
                    sm={3}
                  >{`${local.maxGroupReturningIndividualPrincipal}*`}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="maxGroupReturningIndividualPrincipal"
                      data-qc="maxGroupReturningIndividualPrincipal"
                      value={
                        formikProps.values.maxGroupReturningIndividualPrincipal
                      }
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(
                          formikProps.errors
                            .maxGroupReturningIndividualPrincipal
                        ) &&
                        Boolean(
                          formikProps.touched
                            .maxGroupReturningIndividualPrincipal
                        )
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.maxGroupReturningIndividualPrincipal}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group controlId="maxGroupPrincipal">
                  <Form.Label
                    className="data-label"
                    column
                    sm={3}
                  >{`${local.maxGroupPrincipal}*`}</Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="number"
                      name="maxGroupPrincipal"
                      data-qc="maxGroupPrincipal"
                      value={formikProps.values.maxGroupPrincipal}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={
                        Boolean(formikProps.errors.maxGroupPrincipal) &&
                        Boolean(formikProps.touched.maxGroupPrincipal)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.maxGroupPrincipal}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
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

export default withRouter(PrincipleThreshold)

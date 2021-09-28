import React, { Component } from 'react'
import { Formik } from 'formik'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Swal from 'sweetalert2'
import Wizard from '../../../Shared/Components/wizard/Wizard'
import { Loader } from '../../../Shared/Components/Loader'
import { editLead } from '../../../Shared/Services/APIs/Leads/editLead'
import { Governorate } from '../CustomerCreation/StepTwoForm'
import {
  leadStepOne,
  leadStepTwo,
  leadValidationStepOne,
  leadValidationStepTwo,
} from './editLeadValidation'
import {
  timeToDateyyymmdd,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import local from '../../../Shared/Assets/ar.json'
import './leads.scss'
import { getGovernorates } from '../../../Shared/Services/APIs/config'
import { Lead } from '../../../Shared/Models/common'

export interface LeadStepOne {
  customerName: string
  maxAge: number
  minAge: number
  maxMinAge: string
  phoneNumber: string
  customerNationalId: string
  nationalIdIssueDate: string
}
export interface LeadStepTwo {
  businessSector: string
  businessGovernate: string
  businessCity: string
  businessArea: string
  businessStreet: string
  businessAddressDescription: string
}
interface State {
  step: number
  loading: boolean
  stepOne: LeadStepOne
  stepTwo: LeadStepTwo
  governorates: Array<Governorate>
  uuid: string
}

class EditLead extends Component<
  RouteComponentProps<{}, {}, { leadDetails: Lead }>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, { leadDetails: Lead }>) {
    super(props)
    this.state = {
      step: 1,
      loading: false,
      stepOne: leadStepOne,
      stepTwo: leadStepTwo,
      governorates: [],
      uuid: '',
    }
  }

  componentDidMount() {
    const lead = this.props.location.state.leadDetails
    this.setState({
      stepOne: {
        customerName: lead.customerName,
        maxAge: lead.maxAge as number,
        minAge: lead.minAge as number,
        maxMinAge: `${lead.minAge ? lead.minAge : 0}-${lead.maxAge}`,
        phoneNumber: lead.phoneNumber,
        customerNationalId: lead.customerNationalId || '',
        nationalIdIssueDate:
          timeToDateyyymmdd(Number(lead.nationalIdIssueDate)) || '',
      },
      stepTwo: {
        businessSector: lead.businessSector,
        businessGovernate: lead.businessGovernate,
        businessCity: lead.businessCity,
        businessArea: lead.businessArea,
        businessStreet: lead.businessStreet,
        businessAddressDescription: lead.businessAddressDescription as string,
      },
      loading: true,
      uuid: lead.uuid as string,
    })
    this.getGovernorates()
  }

  async getGovernorates() {
    const res = await getGovernorates()
    if (res.status === 'success') {
      this.setState({ governorates: res.body.governorates, loading: false })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  submit = async (values) => {
    if (this.state.step === 1) {
      this.setState({
        stepOne: { ...values },
        step: 2,
      })
    } else {
      this.setState({ loading: true })
      const obj = { ...this.state.stepOne, ...values, uuid: this.state.uuid }
      obj.minAge = Number(obj.maxMinAge.split('-')[0])
      obj.maxAge = Number(obj.maxMinAge.split('-')[1])
      obj.nationalIdIssueDate = new Date(obj.nationalIdIssueDate).valueOf()
      const res = await editLead(obj)
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire('', local.leadEditSuccess, 'success').then(() =>
          this.props.history.push('/halan-integration/leads')
        )
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    }
  }

  renderStepOne() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.stepOne}
        onSubmit={this.submit}
        validationSchema={leadValidationStepOne}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          return (
            <Form onSubmit={formikProps.handleSubmit}>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="customerName">
                    <Form.Label
                      className="customer-form-label"
                      column
                    >{`${local.name}*`}</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      data-qc="customerName"
                      value={formikProps.values.customerName}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={Boolean(
                        formikProps.errors.customerName &&
                          formikProps.touched.customerName
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.customerName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="maxMinAge">
                    <Form.Label
                      className="customer-form-label"
                      column
                    >{`${local.age}*`}</Form.Label>
                    <div className="age-range-container">
                      <div
                        onClick={() => {
                          this.setState({
                            stepOne: {
                              ...formikProps.values,
                              maxMinAge: '0-21',
                            },
                          })
                        }}
                        className={`item ${
                          this.state.stepOne.maxMinAge === '0-21'
                            ? 'active'
                            : ''
                        }`}
                      >
                        اقل من ٢١ سنه
                      </div>
                      <div
                        onClick={() => {
                          this.setState({
                            stepOne: {
                              ...formikProps.values,
                              maxMinAge: '21-35',
                            },
                          })
                        }}
                        className={`item ${
                          this.state.stepOne.maxMinAge === '21-35'
                            ? 'active'
                            : ''
                        }`}
                      >
                        من ٢١ إلى ٣٥ سنه
                      </div>
                    </div>
                    <div className="age-range-container">
                      <div
                        onClick={() => {
                          this.setState({
                            stepOne: {
                              ...formikProps.values,
                              maxMinAge: '36-50',
                            },
                          })
                        }}
                        className={`item ${
                          this.state.stepOne.maxMinAge === '36-50'
                            ? 'active'
                            : ''
                        }`}
                      >
                        من ٣٦ إلى ٥٠ سنه
                      </div>
                      <div
                        onClick={() => {
                          this.setState({
                            stepOne: {
                              ...formikProps.values,
                              maxMinAge: '51-65',
                            },
                          })
                        }}
                        className={`item ${
                          this.state.stepOne.maxMinAge === '51-65'
                            ? 'active'
                            : ''
                        }`}
                      >
                        من ٥١ إلى ٦٥ سنه
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="phoneNumber">
                    <Form.Label
                      className="customer-form-label"
                      column
                    >{`${local.mobilePhoneNumber}*`}</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      data-qc="phoneNumber"
                      disabled
                      value={formikProps.values.phoneNumber}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={Boolean(
                        formikProps.errors.phoneNumber &&
                          formikProps.touched.phoneNumber
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="customerNationalId">
                    <Form.Label className="customer-form-label" column>
                      {local.nationalId}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="customerNationalId"
                      data-qc="customerNationalId"
                      value={formikProps.values.customerNationalId}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={Boolean(
                        formikProps.errors.customerNationalId &&
                          formikProps.touched.customerNationalId
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.customerNationalId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Form.Group controlId="nationalIdIssueDate">
                    <Form.Label className="customer-form-label" column>
                      {local.nationalIdIssueDate}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="nationalIdIssueDate"
                      data-qc="nationalIdIssueDate"
                      value={formikProps.values.nationalIdIssueDate}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isInvalid={Boolean(
                        formikProps.errors.nationalIdIssueDate &&
                          formikProps.touched.nationalIdIssueDate
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.nationalIdIssueDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group as={Row} className="branch-data-group">
                <Col>
                  <Button
                    variant="secondary"
                    style={{ width: '60%' }}
                    onClick={() => {
                      this.props.history.goBack()
                    }}
                  >
                    {local.cancel}
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="btn-submit-next"
                    style={{ float: 'left', width: '60%' }}
                    type="submit"
                    data-qc="submit"
                  >
                    {local.next}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          )
        }}
      </Formik>
    )
  }

  renderStepTwo() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.stepTwo}
        onSubmit={this.submit}
        validationSchema={leadValidationStepTwo}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          return (
            <Form onSubmit={formikProps.handleSubmit}>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="loanOwner">
                    <Form.Label
                      className="customer-form-label"
                      column
                    >{`${local.businessActivity}*`}</Form.Label>
                    <div className="age-range-container">
                      <div
                        onClick={() => {
                          formikProps.setFieldValue('businessSector', '1')
                        }}
                        className={`item ${
                          formikProps.values.businessSector === '1'
                            ? 'active'
                            : ''
                        }`}
                      >
                        {local.industrialProjects}
                      </div>
                      <div
                        onClick={() => {
                          formikProps.setFieldValue('businessSector', '2')
                        }}
                        className={`item ${
                          formikProps.values.businessSector === '2'
                            ? 'active'
                            : ''
                        }`}
                      >
                        {local.commercialProjects}
                      </div>
                    </div>
                    <div className="age-range-container">
                      <div
                        onClick={() => {
                          formikProps.setFieldValue('businessSector', '3')
                        }}
                        className={`item ${
                          formikProps.values.businessSector === '3'
                            ? 'active'
                            : ''
                        }`}
                      >
                        {local.agriculturalProjects}
                      </div>
                      <div
                        onClick={() => {
                          formikProps.setFieldValue('businessSector', '4')
                        }}
                        className={`item ${
                          formikProps.values.businessSector === '4'
                            ? 'active'
                            : ''
                        }`}
                      >
                        {local.serviceProjects}
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="governorate">
                    <Form.Label className="customer-form-label">
                      {local.governorate}
                    </Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="businessGovernate"
                      data-qc="businessGovernate"
                      value={formikProps.values.businessGovernate}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={Boolean(
                        formikProps.errors.businessGovernate &&
                          formikProps.touched.businessGovernate
                      )}
                    >
                      <option value="" />
                      {this.state.governorates.map((governorate, index) => {
                        return (
                          <option
                            key={index}
                            value={governorate.governorateName.ar}
                          >
                            {governorate.governorateName.ar}
                          </option>
                        )
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="district">
                    <Form.Label className="customer-form-label">
                      {local.district}
                    </Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="businessCity"
                      data-qc="businessCity"
                      value={formikProps.values.businessCity}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={Boolean(
                        formikProps.errors.businessCity &&
                          formikProps.touched.businessCity
                      )}
                      disabled={!formikProps.values.businessGovernate}
                    >
                      <option value="" />
                      {this.state.governorates
                        .find(
                          (gov) =>
                            gov.governorateName.ar ===
                            formikProps.values.businessGovernate
                        )
                        ?.districts.map((district, index) => {
                          return (
                            <option
                              key={index}
                              value={district.districtName.ar}
                            >
                              {district.districtName.ar}
                            </option>
                          )
                        })}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="village">
                    <Form.Label className="customer-form-label">
                      {local.village}
                    </Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="businessArea"
                      data-qc="businessArea"
                      value={formikProps.values.businessArea}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={Boolean(
                        formikProps.errors.businessArea &&
                          formikProps.touched.businessArea
                      )}
                      disabled={!formikProps.values.businessCity}
                    >
                      <option value="" />
                      {this.state.governorates
                        .find(
                          (gov) =>
                            gov.governorateName.ar ===
                            formikProps.values.businessGovernate
                        )
                        ?.districts.find(
                          (district) =>
                            district.districtName.ar ===
                            formikProps.values.businessCity
                        )
                        ?.villages?.map((village, index) => {
                          return (
                            <option key={index} value={village.villageName.ar}>
                              {village.villageName.ar}
                            </option>
                          )
                        })}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="businessStreet">
                    <Form.Label className="customer-form-label" column>
                      {local.streetName}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="businessStreet"
                        data-qc="businessStreet"
                        value={formikProps.values.businessStreet}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isInvalid={Boolean(
                          formikProps.errors.businessStreet &&
                            formikProps.touched.businessStreet
                        )}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.businessStreet}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Form.Group controlId="businessAddressDescription">
                    <Form.Label className="customer-form-label" column>
                      {local.addressDescription}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="businessAddressDescription"
                        data-qc="businessAddressDescription"
                        value={formikProps.values.businessAddressDescription}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isInvalid={Boolean(
                          formikProps.errors.businessAddressDescription &&
                            formikProps.touched.businessAddressDescription
                        )}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.businessAddressDescription}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group as={Row} className="branch-data-group">
                <Col>
                  <Button
                    variant="danger"
                    style={{ width: '60%' }}
                    onClick={() => {
                      this.setState({
                        step: 1,
                        stepTwo: { ...formikProps.values },
                      })
                    }}
                  >
                    {local.previous}
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="btn-submit-next"
                    style={{ float: 'left', width: '60%' }}
                    type="submit"
                    data-qc="submit"
                  >
                    {local.submit}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          )
        }}
      </Formik>
    )
  }

  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne()
      case 2:
        return this.renderStepTwo()
      default:
        return null
    }
  }

  render() {
    return (
      <Card>
        <Loader type="fullscreen" open={this.state.loading} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Wizard
            currentStepNumber={this.state.step - 1}
            stepsDescription={[local.basicInfo, local.workInfo]}
          />
          <Card.Body style={{ padding: '20px 40px' }}>
            {this.renderSteps()}
          </Card.Body>
        </div>
      </Card>
    )
  }
}

export default withRouter(EditLead)

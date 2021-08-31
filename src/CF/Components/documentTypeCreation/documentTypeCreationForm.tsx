import React, { Component } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import * as local from '../../../Shared/Assets/ar.json'
import { DocumentType } from '../../../Shared/Services/interfaces'

interface Props {
  values: DocumentType
  edit: boolean
  cancel: any
  handleChange: any
  handleBlur: any
  setFieldValue: any
  handleSubmit: any
  errors: any
  touched: any
}
interface State {
  updatable: boolean
  key: string
  active: boolean
}
class DocumentTypeCreationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      updatable: true,
      active: true,
      key: '',
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.edit && props.values.name !== '' && state.key !== 'updated') {
      if (props.edit) props.setFieldValue('currPage', props.values.pages)
      return {
        updatable: !!props.values.updatable,
        active: !!props.values.active,
        key: 'updated',
      }
    }
    return null
  }

  render() {
    return (
      <Form
        style={{ padding: '10px 50px', textAlign: 'right' }}
        onSubmit={this.props.handleSubmit}
      >
        <Row>
          <Col>
            <Form.Group controlId="name">
              <Form.Label className="data-label">{`${local.documentName} *`}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={this.props.values.name}
                onChange={this.props.handleChange}
                onBlur={this.props.handleBlur}
                isInvalid={
                  (this.props.errors.name && this.props.touched.name) as boolean
                }
                disabled={this.props.edit}
              />
              <Form.Control.Feedback type="invalid">
                {this.props.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="type">
              <Form.Label className="data-label">{`${local.documentFor} *`}</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={this.props.values.type}
                onChange={this.props.handleChange}
                onBlur={this.props.handleBlur}
                isInvalid={
                  (this.props.errors.type && this.props.touched.type) as boolean
                }
                disabled={this.props.edit}
              >
                <option value="" disabled />
                <option value="customer">{local.customer}</option>
                <option value="loanApplication">
                  {local.loanApplicationId}
                </option>
                <option value="issuedLoan">{local.issuedLoan}</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {this.props.errors.type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="pages">
              <Form.Label className="data-label">{`${local.numOfDocuments} *`}</Form.Label>
              <Form.Control
                type="number"
                name="pages"
                value={this.props.values.pages}
                onChange={this.props.handleChange}
                onBlur={this.props.handleBlur}
                isInvalid={
                  (this.props.errors.pages &&
                    this.props.touched.pages) as boolean
                }
              />
              <Form.Control.Feedback type="invalid">
                {this.props.errors.pages}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="updatable">
              <Form.Label className="data-label">
                {local.allowUpdate}
              </Form.Label>
              <Row style={{ margin: 0 }}>
                <Form.Check
                  type="radio"
                  value={1}
                  checked={this.state.updatable}
                  label={local.yes}
                  onChange={() => {
                    this.setState({
                      updatable: true,
                    })
                    this.props.setFieldValue('updatable', true)
                  }}
                />
                <Form.Check
                  type="radio"
                  checked={!this.state.updatable}
                  value={0}
                  label={local.no}
                  onChange={() => {
                    this.setState({
                      updatable: false,
                    })
                    this.props.setFieldValue('updatable', false)
                  }}
                />
              </Row>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="status">
              <Form.Label className="data-label">{local.status}</Form.Label>
              <Row style={{ margin: 0 }}>
                <Form.Check
                  type="radio"
                  value={1}
                  checked={this.state.active}
                  label={local.activate}
                  onChange={() => {
                    this.setState({
                      active: true,
                    })
                    this.props.setFieldValue('active', true)
                  }}
                />
                <Form.Check
                  type="radio"
                  checked={!this.state.active}
                  value={0}
                  label={local.deactivate}
                  onChange={() => {
                    this.setState({
                      active: false,
                    })
                    this.props.setFieldValue('active', false)
                  }}
                />
              </Row>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-between py-4">
          <Button
            variant="secondary"
            style={{ width: '30%' }}
            onClick={() => {
              this.props.cancel()
            }}
          >
            {local.cancel}
          </Button>
          <Button
            variant="primary"
            style={{ width: '30%' }}
            type="submit"
            data-qc="submit"
          >
            {local.submit}
          </Button>
        </div>
      </Form>
    )
  }
}

export default DocumentTypeCreationForm

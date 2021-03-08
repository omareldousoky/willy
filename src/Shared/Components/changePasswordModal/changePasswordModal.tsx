import React, { ChangeEvent, PureComponent, SyntheticEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { changePassword } from '../../../Mohassel/Services/APIs/Auth/changePassword'
import { logout } from '../../../Mohassel/Services/APIs/Auth/logout'
import * as local from '../../Assets/ar.json'
import { clearAllCookies } from '../../Services/getCookie'
import { getErrorMessage } from '../../Services/utils'

interface ChangePasswordModalProps {
  show: boolean
  handleClose: Function
}

interface ChangePasswordModalState {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  newPasswordError?: string
  confirmNewPasswordError?: string
  error?: string
}

class ChangePasswordModal extends PureComponent<
  ChangePasswordModalProps,
  ChangePasswordModalState
> {
  constructor(props) {
    super(props)
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  }

  handleChange = (key: string, value: string) => {
    const {
      newPassword,
      currentPassword,
      confirmNewPassword,
      newPasswordError,
      confirmNewPasswordError,
      error,
    } = this.state
    const re = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
    if (error) this.setState({ error: undefined })
    if (key === 'currentPassword' && newPassword) {
      if (newPassword === value)
        this.setState({
          newPasswordError: local.newPasswordAsCurrentPasswordError,
        })
      else if (newPasswordError === local.newPasswordAsCurrentPasswordError)
        this.setState({ newPasswordError: undefined })
    }
    if (key === 'newPassword') {
      if (!re.test(value))
        this.setState({ newPasswordError: local.wrongNewPassword })
      else if (value === currentPassword)
        this.setState({
          newPasswordError: local.newPasswordAsCurrentPasswordError,
        })
      else if (confirmNewPassword)
        confirmNewPasswordError && confirmNewPassword === value
          ? this.setState({
              confirmNewPasswordError: undefined,
              newPasswordError: undefined,
            })
          : this.setState({
              confirmNewPasswordError: local.confirmPasswordCheck,
              newPasswordError: undefined,
            })
      else this.setState({ newPasswordError: undefined })
    }

    if (key === 'confirmNewPassword') {
      if (this.state.newPassword !== value)
        this.setState({ confirmNewPasswordError: local.confirmPasswordCheck })
      else this.setState({ confirmNewPasswordError: undefined })
    }
  }

  handleSubmit = async () => {
    const { currentPassword, newPassword } = this.state
    const res = await changePassword({
      oldPassword: currentPassword,
      newPassword,
    })
    if (res.status === 'success') {
      await logout()
      clearAllCookies()
      window.location.href = process.env.REACT_APP_LOGIN_URL || ''
    }
    if (res.status === 'error') {
      this.setState({ error: getErrorMessage(res.error.error) })
    }
  }

  handleCloseModal() {
    const { handleClose } = this.props
    this.setState(
      {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        newPasswordError: undefined,
        confirmNewPasswordError: undefined,
        error: undefined,
      },
      () => handleClose()
    )
  }

  render() {
    const { show } = this.props
    const {
      currentPassword,
      newPassword,
      confirmNewPassword,
      confirmNewPasswordError,
      newPasswordError,
      error,
    } = this.state
    const disableSubmit =
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword ||
      !!newPasswordError ||
      !!confirmNewPasswordError
    return (
      <Modal show={show} onHide={() => this.handleCloseModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{local.changePassword}</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e: SyntheticEvent) => {
            e.preventDefault()
            if (!disableSubmit) return this.handleSubmit()
          }}
        >
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <Form.Group controlId="currentPassword">
                  <Form.Label column sm={6} className="mr-0 pr-0">
                    {local.currentPassword}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      data-qc="currentPassword"
                      value={currentPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const trimmedValue = e.target.value.trim()
                        this.setState({ currentPassword: trimmedValue })
                        this.handleChange('currentPassword', trimmedValue)
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group controlId="newPassword">
                  <Form.Label column sm={6} className="mr-0 pr-0">
                    {local.newPassword}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      data-qc="newPassword"
                      className="rounded"
                      value={newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const trimmedValue = e.target.value.trim()
                        this.setState({ newPassword: trimmedValue })
                        this.handleChange('newPassword', trimmedValue)
                      }}
                      isInvalid={!!newPasswordError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {newPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group controlId="confirmNewPassword">
                  <Form.Label column sm={6} className="mr-0 pr-0">
                    {local.confirmNewPassword}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      name="confirmNewPassword"
                      data-qc="confirmNewPassword"
                      className="rounded"
                      value={confirmNewPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const trimmedValue = e.target.value.trim()
                        this.setState({ confirmNewPassword: trimmedValue })
                        this.handleChange('confirmNewPassword', trimmedValue)
                      }}
                      isInvalid={!!confirmNewPasswordError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {confirmNewPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                {error && <p className="text-danger text-right">{error}</p>}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleCloseModal()}>
              {local.cancel}
            </Button>
            <Button variant="primary" type="submit" disabled={disableSubmit}>
              {local.save}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

export default ChangePasswordModal

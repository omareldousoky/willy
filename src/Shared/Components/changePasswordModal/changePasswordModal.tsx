import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { changePassword } from '../../../Mohassel/Services/APIs/Auth/changePassword';
import { logout } from '../../../Mohassel/Services/APIs/Auth/logout';
import * as local from '../../Assets/ar.json';
import { arabicGender } from "../../Services/utils";

interface Props {
  show: boolean;
  handleClose: Function;
}

interface State {
  oldPassword: string;
  newPassword: string;
  errorInNewPassword: boolean;
}

export default class ChangePasswordModal extends Component<Props, State> {
  state = {
    oldPassword: "",
    newPassword: "",
    errorInNewPassword: false
  };
  handleClose = () => {
    const { handleClose } = this.props;
    this.setState({
        oldPassword: "",
        newPassword: "",
        errorInNewPassword: false

    }, () => handleClose());
  };
  handleChange = (key: string, value: string) =>{
    let errorInNewPassword = this.state.errorInNewPassword;
    const re = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if(key==='newPassword'){
      const trimmedValue = value.trim()
      if (trimmedValue === '' || re.test(trimmedValue)) errorInNewPassword = false
      else errorInNewPassword = true
    }
    const newState = { [key]: value, errorInNewPassword } as Pick<State, keyof State>;
    this.setState(newState)

  }
  handleSubmit = async ()=> {
    const { oldPassword, newPassword} = this.state;
    const res = await changePassword({ oldPassword, newPassword: newPassword.trim() });
    if(res.status==='success'){
      const res2 = await logout();
      document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "ltsbranch=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = process.env.REACT_APP_LOGIN_URL || '';
    }
  }
  render() {
    const { show } = this.props;
    const { oldPassword, newPassword, errorInNewPassword } = this.state;
    return (
      <Modal show={show} onHide={() => this.handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>{local.changePassword}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <Form.Group controlId="interest" style={{ textAlign: 'right' }}>
                <Form.Label column sm={6} style={{ marginRight: 0 }}>
                  {local.oldPassword}
                  {/* Old Password */}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="string"
                    name="oldPassword"
                    data-qc="oldPassword"
                    value={oldPassword}
                    onChange={(e) => {this.handleChange('oldPassword', e.target.value)}}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Form.Group controlId="interest" style={{ textAlign: 'right' }}>
                <Form.Label column sm={6} style={{ marginRight: 0 }}>
                  {local.newPassword}
                  {/* New Password */}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="string"
                    name="newPassword"
                    data-qc="newPassword"
                    value={newPassword}
                    onChange={(e) => {this.handleChange('newPassword', e.target.value)}}
                    isInvalid={errorInNewPassword}
                  />
                   <Form.Control.Feedback type="invalid">
                    {local.wrongNewPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => this.handleClose()}
          >
            {local.cancel}
          </Button>
          <Button variant="outline-primary" onClick={() => this.handleSubmit()} disabled={!oldPassword || !newPassword || errorInNewPassword || oldPassword === newPassword}>
            {local.save}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

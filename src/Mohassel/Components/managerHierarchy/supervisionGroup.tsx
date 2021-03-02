import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import * as local from '../../../Shared/Assets/ar.json'
import { LoanOfficer, OfficersGroup } from '../../../Shared/Services/interfaces'
import './managerHierarchy.scss'
import UsersSearch from './usersSearch'

interface Props {
  seqNo: number
  deleteGroup: any
  group: OfficersGroup
  branchId: string
  mode: string
  users: Array<LoanOfficer>
  loanOfficers: Array<LoanOfficer>
}
interface State {
  officers: { id: string; name: string }[]
}
export class SupervisionGroup extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      officers: this.props.group.officers,
    }
  }

  render() {
    return (
      <div className="supervision-group-container">
        <div className="group-supervisor-row">
          <Col sm={6}>
            <Form.Label
              className="supervision-label"
              as={Col}
            >{`${local.groupManager} ( ${this.props.seqNo} )`}</Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.props.users}
                objectKey="leader"
                item={this.props.group}
              />
            </Row>
          </Col>
          {this.props.mode === 'create' && (
            <div onClick={this.props.deleteGroup}>
              <img src={require('../../../Shared/Assets/deleteIcon.svg')} />
            </div>
          )}
        </div>
        <Row className="officers-container">
          {this.state.officers.map((officer, index) => {
            return (
              <Col key={index} sm={6}>
                <Form.Label className="supervision-label">
                  <img
                    onClick={() => {
                      const newOfficers = this.state.officers
                      newOfficers.splice(index, 1)
                      this.props.group.officers = newOfficers
                      this.setState({ officers: newOfficers })
                    }}
                    alt="removeIcon"
                    src={require('../../Assets/removeIcon.svg')}
                  />{' '}
                  {local.loanOfficerOrCoordinator}
                </Form.Label>
                <Row className="row-nowrap">
                  <UsersSearch
                    usersInitial={this.props.loanOfficers}
                    isLoanOfficer
                    objectKey={index}
                    item={this.props.group.officers}
                    branchId={this.props.branchId}
                  />
                </Row>
              </Col>
            )
          })}
        </Row>
        {(this.props.mode === 'create' || this.props.mode === 'edit') && (
          <Row className="add-member-container">
            <span
              className="add-member"
              onClick={() => {
                const newOfficers = this.props.group.officers
                newOfficers.push({ id: '', name: '' })
                this.props.group.officers = newOfficers
                this.setState({
                  officers: newOfficers,
                })
              }}
            >
              <img
                className="green-add-icon"
                src={require('../../Assets/greenAdd.svg')}
              />
              {local.addLoanOfficer}
            </span>
          </Row>
        )}
      </div>
    )
  }
}

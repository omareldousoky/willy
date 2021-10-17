import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getApplication } from '../../../Shared/Services/APIs/loanApplication/getApplication'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { removeMemberFromGroup } from '../../../Shared/Services/APIs/loanApplication/removeMemberFromGroup'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { Customer } from '../../../Shared/Models/Customer'
import { getSeperationReasons } from '../../../Shared/Services/APIs/config'

interface Member {
  type: string
  amount: number
  customer: Customer
}
interface State {
  loading: boolean
  application: any
  selectedMember: Member
  newGroupLeader: Member
  reason: string
  reasons: any
}

class GroupMemberSeperation extends Component<
  RouteComponentProps<{}, {}, { id: string }>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, { id: string }>) {
    super(props)
    this.state = {
      application: {},
      selectedMember: {
        type: '',
        amount: 0,
        customer: {
          _id: '',
        },
      },
      newGroupLeader: {
        type: '',
        amount: 0,
        customer: {
          _id: '',
        },
      },
      reason: '',
      reasons: [],
      loading: false,
    }
  }

  componentDidMount() {
    const appId = this.props.location.state.id
    this.getAppByID(appId)
    this.getReasons()
  }

  async getAppByID(id) {
    this.setState({ loading: true })
    const application = await getApplication(id)
    if (application.status === 'success') {
      this.setState({
        application: application.body,
        loading: false,
      })
    } else {
      Swal.fire('Error !', getErrorMessage(application.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getReasons() {
    this.setState({ loading: true })
    const application = await getSeperationReasons()
    if (application.status === 'success') {
      this.setState({
        reasons: application.body.data,
        loading: false,
      })
    } else {
      Swal.fire('Error !', getErrorMessage(application.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  submit = async () => {
    this.setState({ loading: true })
    const obj = {
      customerId: this.state.selectedMember.customer._id,
      newLeader: this.state.newGroupLeader.customer._id,
      separationReason: this.state.reason,
    }
    const res = await removeMemberFromGroup(obj, this.state.application._id)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        title: local.seperationSuccess,
        text: `${local.wasSeperated}  ${this.state.selectedMember.customer.customerName}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.goToSeperatedMemberApplication,
      }).then((result) => {
        if (result.value) {
          this.props.history.push('/track-loan-applications/loan-profile', {
            id: res.body.id,
          })
        } else if (result.dismiss) {
          this.props.history.push('/track-loan-applications/loan-profile', {
            id: this.state.application._id,
          })
        }
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  selectMemberToRemove(event) {
    const [member] = this.state.application.group.individualsInGroup.filter(
      (customer) => customer.customer._id === event.currentTarget.value
    )
    this.setState({ selectedMember: member }, () => {
      let leader = {
        type: '',
        amount: 0,
        customer: {
          _id: '',
        },
      }
      if (member.type !== 'leader')
        [leader] = this.state.application.group.individualsInGroup.filter(
          (customer) => customer.type === 'leader'
        )

      this.setState({
        newGroupLeader: leader,
      })
    })
  }

  selectNewLeader(event) {
    const [leader] = this.state.application.group.individualsInGroup.filter(
      (customer) => customer.customer._id === event.currentTarget.value
    )
    this.setState({ newGroupLeader: leader })
  }

  render() {
    return (
      <>
        <BackButton title={local.memberSeperation} />
        <Container style={{ textAlign: 'right' }}>
          <Loader type="fullscreen" open={this.state.loading} />
          {Object.keys(this.state.application).length > 0 && (
            <div>
              <Card style={{ padding: 20 }}>
                <Form.Group
                  controlId="memberToSeperate"
                  style={{ margin: '10px auto', width: '60%' }}
                >
                  <Form.Label>{local.customerName}</Form.Label>
                  <Form.Control
                    as="select"
                    name="memberToSeperate"
                    data-qc="memberToSeperate"
                    value={this.state.selectedMember.customer._id}
                    disabled={
                      this.state.application.group.individualsInGroup.length < 2
                    }
                    onChange={(event) => {
                      this.selectMemberToRemove(event)
                    }}
                  >
                    <option value="" disabled />
                    {this.state.application.group.individualsInGroup.map(
                      (member) => (
                        <option
                          key={member.customer._id}
                          value={member.customer._id}
                        >
                          {member.customer.customerName}
                        </option>
                      )
                    )}
                  </Form.Control>
                </Form.Group>
                {this.state.selectedMember.type === 'leader' && (
                  <Form.Group
                    controlId="newGroupLeader"
                    style={{ margin: '10px auto', width: '60%' }}
                  >
                    <Form.Label>{local.newGroupLeaderName}</Form.Label>
                    <Form.Control
                      as="select"
                      name="newGroupLeader"
                      data-qc="newGroupLeader"
                      value={this.state.newGroupLeader.customer._id}
                      disabled={
                        this.state.application.group.individualsInGroup.length <
                        2
                      }
                      onChange={(event) => {
                        this.selectNewLeader(event)
                      }}
                    >
                      <option value="" disabled />
                      {this.state.application.group.individualsInGroup
                        .filter(
                          (member) =>
                            member.customer._id !==
                            this.state.selectedMember.customer._id
                        )
                        .map((member) => (
                          <option
                            key={member.customer._id}
                            value={member.customer._id}
                          >
                            {member.customer.customerName}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                )}
                <Form.Group
                  controlId="reason"
                  style={{ margin: '10px auto', width: '60%' }}
                >
                  <Form.Label>{local.seperationReason}</Form.Label>
                  <Form.Control
                    as="select"
                    name="reason"
                    data-qc="reason"
                    value={this.state.reason}
                    onChange={(event) => {
                      this.setState({ reason: event.currentTarget.value })
                    }}
                  >
                    <option value="" disabled />
                    {this.state.reasons
                      .filter((reason) => reason.activated)
                      .map((reason) => (
                        <option key={reason.id} value={reason.id}>
                          {reason.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <div
                  className="d-flex"
                  style={{ justifyContent: 'space-evenly', margin: '50px 0px' }}
                >
                  <Button
                    className="btn-submit-next"
                    disabled={
                      this.state.newGroupLeader.customer._id?.length === 0 ||
                      this.state.reason.length === 0
                    }
                    style={{ float: 'left', width: '20%' }}
                    onClick={() => this.submit()}
                    data-qc="submit"
                  >
                    {local.submit}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Container>
      </>
    )
  }
}
export default withRouter(GroupMemberSeperation)

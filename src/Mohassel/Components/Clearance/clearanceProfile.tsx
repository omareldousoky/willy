import React, { Component, CSSProperties } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import { Button, Container, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import Can from '../../config/Can'
import { theme } from '../../../Shared/theme'
import { Clearance } from '../../../Shared/Services/interfaces'
import CustomerBasicsCard from './basicInfoCustomer'
import { getClearance } from '../../Services/APIs/clearance/getClearance'
import DocumentPhoto from '../../../Shared/Components/documentPhoto/documentPhoto'
import { getErrorMessage, timeToDate } from '../../../Shared/Services/utils'
import './clearance.scss'
import PenaltyStrike from './penaltyStrike'
import { reviewClearance } from '../../Services/APIs/clearance/reviewClearance'

interface State {
  loading: boolean
  tabsArray: Array<Tab>
  activeTab: string
  data: Clearance
}
const header: CSSProperties = {
  textAlign: 'right',
  fontSize: '14px',
  width: '15%',
  color: theme.colors.lightGrayText,
}
const cell: CSSProperties = {
  textAlign: 'right',
  padding: '10px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.colors.blackText,
}

interface Props {
  review?: boolean
}

class ClearanceProfile extends Component<
  RouteComponentProps<{}, {}, { clearanceId: string }> & Props,
  State
> {
  constructor(
    props: RouteComponentProps<{}, {}, { clearanceId: string }> & Props
  ) {
    super(props)
    this.state = {
      activeTab: 'clearanceDetails',
      tabsArray: [],
      loading: false,
      data: {
        _id: '',
        bankName: '',
        beneficiaryType: '',
        branchId: '',
        branchName: '',
        clearanceReason: '',
        customerId: '',
        customerKey: '',
        customerName: '',
        customerNationalId: 0,
        documentPhotoURL: '',
        issuedDate: 0,
        lastPaidInstDate: 0,
        loanId: '',
        loanKey: 0,
        notes: '',
        principal: 0,
        receiptDate: 0,
        receiptPhotoURL: '',
        registrationDate: 0,
        status: '',
      },
    }
  }

  componentDidMount() {
    this.setState({
      tabsArray: [
        {
          header: local.mainInfo,
          stringKey: 'mainInfo',
        },
        {
          header: local.documents,
          stringKey: 'documents',
        },
      ],
      activeTab: 'mainInfo',
    })
    this.getClearanceById()
  }

  async getClearanceById() {
    this.setState({ loading: true })
    const res = await getClearance(this.props.location.state.clearanceId)
    if (res.status === 'success') {
      this.setState({
        data: res.body.data,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  async reviewClearanceByStatus(status: string) {
    if (this.props.location.state?.clearanceId) {
      this.setState({ loading: true })
      const res = await reviewClearance(
        this.props.location.state?.clearanceId,
        { status }
      )
      if (res.status === 'success') {
        Swal.fire('Success', '', 'success').then(() =>
          this.props.history.goBack()
        )
      } else {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      }
    }
    this.setState({ loading: false })
  }

  renderMainInfo() {
    return (
      <Table striped bordered hover>
        <tbody className="px-0 py-2">
          <tr>
            <td style={header}>{local.registrationDate}</td>
            <td style={cell}>{timeToDate(this.state.data.registrationDate)}</td>
          </tr>
          <tr>
            <td style={header}>{local.receiptDate}</td>
            <td style={cell}>{timeToDate(this.state.data.receiptDate)}</td>
          </tr>
          {this.state.data.transactionKey && (
            <tr>
              <td style={header}>{local.transactionKey}</td>
              <td style={cell}>{this.state.data.transactionKey}</td>
            </tr>
          )}
          {this.state.data.manualReceipt && (
            <tr>
              <td style={header}>{local.manualReceipt}</td>
              <td style={cell}>{this.state.data.manualReceipt}</td>
            </tr>
          )}
          <tr>
            <td style={header}>{local.clearanceReason}</td>
            <td style={cell}>{this.state.data.clearanceReason}</td>
          </tr>
          <tr>
            <td style={header}>{local.bankName}</td>
            <td style={cell}>{this.state.data.bankName}</td>
          </tr>
          <tr>
            <td style={header}>{local.comments}</td>
            <td style={cell}>{this.state.data.notes}</td>
          </tr>
          <tr>
            <td style={header}>{local.status}</td>
            <td style={cell}>{this.state.data.status}</td>
          </tr>
        </tbody>
      </Table>
    )
  }

  renderPhotos() {
    return (
      <Container>
        <Row>
          <Row className="row-nowrap mr-1">
            <Form.Label className="clearance-label">
              {local.clearanceReceiptPhoto}
            </Form.Label>
          </Row>
          <DocumentPhoto
            data-qc="receiptPhoto"
            name="receiptPhoto"
            photoURL={this.state.data.receiptPhotoURL}
            view
          />
        </Row>
        <Row>
          <Row className="row-nowrap mr-1">
            <Form.Label className="clearance-label">
              {local.clearanceDocumentPhoto}
            </Form.Label>
          </Row>
          <DocumentPhoto
            data-qc="documentPhoto"
            name="documentPhoto"
            photoURL={this.state.data.documentPhotoURL}
            view
          />
        </Row>
      </Container>
    )
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'mainInfo':
        return this.renderMainInfo()
      case 'documents':
        return this.renderPhotos()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        {this.state.data.loanId && (
          <PenaltyStrike loanId={this.state.data.loanId} />
        )}
        <Loader open={this.state.loading} type="fullscreen" />
        <div className="d-flex">
          <div className="px-4 d-flex flex-column w-25">
            {this.state.data.status === 'underReview' && !this.props.review && (
              <div>
                <Can I="editClearance" a="application">
                  <span
                    className="btn p-0"
                    onClick={() =>
                      this.props.history.push('/clearances/edit-clearance', {
                        clearanceId: this.props.location.state.clearanceId,
                      })
                    }
                  >
                    <img
                      className="pr-2"
                      alt="edit"
                      src={require('../../Assets/editIcon.svg')}
                    />
                  </span>
                </Can>
                {local.editClearance}
              </div>
            )}
          </div>
          {this.props.review && this.state.data.status === 'rejected' && (
            <div className="px-4 d-flex w-75 justify-content-end">
              <Button
                className="bg-button w-25"
                variant="outline-info"
                onClick={async () => {
                  await this.reviewClearanceByStatus('underReview')
                }}
              >
                {local.undoReviewClearance}
              </Button>
            </div>
          )}
          {this.props.review && this.state.data.status === 'underReview' && (
            <>
              <div className="px-4 d-flex w-75 justify-content-end">
                <Button
                  className="bg-button w-25 mx-2"
                  variant="outline-danger"
                  onClick={async () => {
                    await this.reviewClearanceByStatus('rejected')
                  }}
                >
                  {local.rejected}
                </Button>
                <Button
                  className="bg-button w-25"
                  variant="outline-primary"
                  onClick={async () => {
                    await this.reviewClearanceByStatus('approved')
                  }}
                >
                  {local.approved}
                </Button>
              </div>
            </>
          )}
        </div>
        <Card>
          <CardNavBar
            header="here"
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(stringKey: string) => {
              this.setState({ activeTab: stringKey })
            }}
          />
          <Card.Title>
            <CustomerBasicsCard
              customerKey={this.state.data.customerKey}
              branchName={this.state.data.bankName}
              customerName={this.state.data.customerName}
            />
          </Card.Title>
          <Card.Body>{this.renderContent()}</Card.Body>
        </Card>
      </>
    )
  }
}

export default withRouter(ClearanceProfile)

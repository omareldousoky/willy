import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AsyncSelect from 'react-select/async'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Formik } from 'formik'
import * as Yup from 'yup'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from '../../../Shared/Components/Loader'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'
import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import { searchBranches } from '../../../Shared/Services/APIs/Branch/searchBranches'
import { search } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import local from '../../../Shared/Assets/ar.json'
import './leads.scss'
import {
  getErrorMessage,
  getDateAndTime,
  getBranchFromCookie,
} from '../../../Shared/Services/utils'
import { theme } from '../../../Shared/theme'
import { ActionsGroup } from '../../../Shared/Components/ActionsGroup'
import { LtsIcon } from '../../../Shared/Components'
import { Action } from '../../../Shared/Models/common'
import Can from '../../../Shared/config/Can'
import ability from '../../../Shared/config/ability'
import {
  changeLeadState,
  changeInReviewLeadState,
} from '../../../Shared/Services/APIs/Leads/changeLeadState'
import { assignLeadToLO } from '../../../Shared/Services/APIs/Leads/assignLeadToLO'
import { changeLeadBranch } from '../../../Shared/Services/APIs/Leads/changeLeadBranch'

interface Props extends RouteComponentProps {
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => Promise<void>
  setLoading: (data) => void
  setSearchFilters: (data) => void
}
interface State {
  tabs: Array<{
    icon: string
    header: string
    desc: string
    path: string
  }>
  size: number
  from: number
  openLOModal: boolean
  openBranchModal: boolean
  loanOfficers: Array<any>
  branches: Array<any>
  selectedLO: any
  selectedBranch: any
  selectedLead: any
  branchId: string
  rejectLeadModal: boolean
  selectedLeadNumber: string
  viewRejectionModal: boolean
}

const REJECTION_REASONS = [
  'العميل تحت السن المسموح به',
  'التمويل بمبلغ اكتر بالمسموح به',
  'العميل محتاج القرض بدون ضمانات',
  'العميل لا يمتلك مشروع',
  'اخري',
]

class Leads extends Component<Props, State> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      tabs: [
        {
          icon: 'user',
          header: local.applicantsLeads,
          desc: local.createAndEditApplicantLeads,
          path: '/halan-integration/leads',
        },
      ],
      size: 10,
      from: 0,
      openLOModal: false,
      openBranchModal: false,
      loanOfficers: [],
      branches: [],
      selectedLO: {},
      selectedBranch: {},
      selectedLead: {},
      branchId: '',
      rejectLeadModal: false,
      selectedLeadNumber: '',
      viewRejectionModal: false,
    }

    const statusClasses = {
      approved: 'paid',
      rejected: 'late',
      'in-review': 'under-review',
      submitted: 'rescheduled',
    }

    this.mappers = [
      {
        title: local.leadName,
        key: 'name',
        render: (data) => data.customerName,
      },
      {
        title: local.governorate,
        key: 'governorate',
        render: (data) => data.businessGovernate,
      },
      {
        title: local.branchName,
        key: 'branch',
        render: (data) => data.branchName,
      },
      {
        title: local.status,
        key: 'status',
        render: (data) => (
          <span className={`status-chip ${statusClasses[data.status]}`}>
            {this.getLeadStatus(data.status)}
          </span>
        ),
      },
      {
        title: local.creationDate,
        key: 'createdAt',
        render: (data) =>
          data.createdAt ? getDateAndTime(data.createdAt) : '',
      },
      {
        title: () => local.loanOfficer,
        key: 'loanOfficer',
        render: (data) => data.loanOfficerName,
      },
      {
        title: () => (
          <Can I="assignLead" a="halanuser">
            {local.chooseLoanOfficer}
          </Can>
        ),
        key: 'changeLoanOfficer',
        render: (data) =>
          data.status !== 'rejected' && (
            <Can I="assignLead" a="halanuser">
              <Button
                variant="default"
                onClick={() =>
                  this.setState({ selectedLead: data, openLOModal: true })
                }
                title="change-loan-officer"
              >
                <LtsIcon name="exchange" />
              </Button>
            </Can>
          ),
      },
      {
        title: () => (
          <Can I="assignLead" a="halanuser">
            {local.chooseBranch}
          </Can>
        ),
        key: 'changeLeadBranch',
        render: (data) =>
          data.status !== 'rejected' && (
            <Can I="assignLead" a="halanuser">
              <Button
                variant="default"
                onClick={() =>
                  this.setState({ selectedLead: data, openBranchModal: true })
                }
                title="change-branch"
              >
                <LtsIcon name="branches" />
              </Button>
            </Can>
          ),
      },
      {
        title: () => (
          <Can I="reviewLead" a="halanuser">
            {local.actions}
          </Can>
        ),
        key: 'actions',
        render: (data) => (
          <div className="position-relative">
            <ActionsGroup
              dropdownBtnTitle={local.actions}
              currentId={data.uuid}
              actions={this.getLeadActions(data)}
            />
          </div>
        ),
      },
    ]
  }

  componentDidMount() {
    let branchId = getBranchFromCookie('ltsbranch')

    branchId = branchId === 'hq' ? '' : branchId
    this.setState({ branchId })
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'lead',
        branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('error', getErrorMessage(this.props.error), 'error')
      })
  }

  getLeadsCustomers() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'lead',
        branchId: this.state.branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('error', getErrorMessage(this.props.error), 'error')
      })
  }

  getLeadStatus(status: string) {
    switch (status) {
      case 'submitted':
        return local.submitted
      case 'in-review':
        return local.underReview
      case 'approved':
        return local.approved
      case 'rejected':
        return local.rejected
      default:
        return ''
    }
  }

  getLoanOfficers = async (input: string) => {
    const res = await searchLoanOfficer({ from: 0, size: 1000, name: input })
    if (res.status === 'success') {
      this.setState({ loanOfficers: res.body.data })
      return res.body.data
        .filter((loanOfficer) =>
          loanOfficer.branches?.includes(this.state.selectedLead.branchId)
        )
        .filter((loanOfficer) => loanOfficer.status === 'active')
        .filter(
          (loanOfficer) =>
            loanOfficer._id !== this.state.selectedLead.loanOfficerId
        )
    }
    this.setState({ loanOfficers: [] })
    return []
  }

  getBranches = async (input: string) => {
    const res = await searchBranches({ from: 0, size: 1000, name: input })
    if (res.status === 'success') {
      this.setState({ branches: res.body.data })
      return res.body.data.filter(
        (branch) => branch._id !== this.state.selectedLead.branchId
      )
    }
    this.setState({ branches: [] })
    return []
  }

  getLeadActions(lead): Action[] {
    return [
      {
        actionTitle: local.rejectApplication,
        actionPermission:
          (lead.status === 'in-review' || lead.status === 'submitted') &&
          ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          this.changeLeadState(
            lead.phoneNumber,
            lead.status,
            lead.inReviewStatus,
            'rejected',
            ''
          )
        },
      },
      {
        actionTitle: local.acceptApplication,
        actionPermission:
          (lead.status === 'in-review' || lead.status === 'submitted') &&
          ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          this.changeLeadState(
            lead.phoneNumber,
            lead.status,
            lead.inReviewStatus,
            'approved',
            ''
          )
        },
      },
      {
        actionTitle: local.viewCustomerLead,
        actionPermission: ability.can('leadInReviewStatus', 'halanuser'),
        actionOnClick: () => {
          this.props.history.push('/halan-integration/leads/view-lead', {
            leadDetails: lead,
          })
        },
      },
      {
        actionTitle: local.viewRejectionReason,
        actionPermission:
          lead.status === 'rejected' && ability.can('reviewLead', 'halanuser'),
        actionOnClick: () => {
          this.setState({
            viewRejectionModal: true,
            selectedLead: lead,
          })
        },
      },
      {
        actionTitle: local.editLead,
        actionPermission:
          lead.status !== 'rejected' &&
          ability.can('leadInReviewStatus', 'halanuser'),
        actionOnClick: () =>
          this.props.history.push('/halan-integration/leads/edit-lead', {
            leadDetails: lead,
          }),
      },
      {
        actionTitle: local.convertToCustomer,
        actionPermission:
          lead.status === 'approved' && ability.can('getLead', 'halanuser'),
        actionOnClick: () =>
          this.props.history.push('/halan-integration/leads/lead-to-customer', {
            uuid: lead.uuid,
            phoneNumber: lead.phoneNumber,
          }),
      },
    ]
  }

  rejectLead = (values: {
    rejectionReason: string
    rejectionDetails: string
  }) => {
    this.changeMainState(
      this.state.selectedLeadNumber,
      'rejected',
      values.rejectionReason,
      values.rejectionDetails
    )
    this.setState({ selectedLeadNumber: '' })
  }

  async changeLeadState(
    phoneNumber: string,
    oldState: string,
    oldInReviewStatus: string,
    newState: string,
    inReviewStatus: string
  ) {
    if (newState === 'rejected')
      this.setState({ rejectLeadModal: true, selectedLeadNumber: phoneNumber })
    else {
      Swal.fire({
        text: local.areYouSure,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.yes,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          if (oldState === newState) {
            if (oldInReviewStatus === 'basic') {
              this.props.setLoading(true)
              const inReviewStatusRes = await changeInReviewLeadState(
                phoneNumber,
                inReviewStatus
              )
              if (inReviewStatusRes.status === 'success') {
                this.props.setLoading(false)
                Swal.fire('', local.changeState, 'success').then(() =>
                  this.getLeadsCustomers()
                )
              } else {
                this.props.setLoading(false)
                Swal.fire('', local.userRoleEditError, 'error')
              }
            }
          } else {
            this.changeMainState(phoneNumber, newState)
          }
        }
      })
    }
  }

  async changeMainState(
    phoneNumber: string,
    newState: string,
    rejectionReason?: string,
    rejectionDetails?: string
  ) {
    this.props.setLoading(true)

    const res = await changeLeadState(
      phoneNumber,
      newState,
      rejectionReason,
      rejectionDetails
    )
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ rejectLeadModal: false })

      Swal.fire('', local.changeState, 'success').then(() =>
        this.getLeadsCustomers()
      )
    } else {
      this.props.setLoading(false)
      Swal.fire('', local.userRoleEditError, 'error')
    }
  }

  async submitLOChange() {
    this.props.setLoading(true)
    const res = await assignLeadToLO(
      this.state.selectedLead.phoneNumber,
      this.state.selectedLO._id,
      this.state.selectedLead.uuid
    )
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ openLOModal: false })
      Swal.fire(
        '',
        `${local.doneMoving} ${local.customerSuccess}`,
        'success'
      ).then(() => {
        this.setState({ selectedLO: {}, selectedLead: {} })
        this.getLeadsCustomers()
      })
    } else {
      this.props.setLoading(false)
      Swal.fire('', local.errorOnMovingCustomers, 'error')
    }
  }

  async submitBranchChange() {
    this.props.setLoading(true)
    const res = await changeLeadBranch(
      this.state.selectedLead.phoneNumber,
      this.state.selectedBranch._id,
      this.state.selectedLead.uuid
    )
    if (res.status === 'success') {
      this.props.setLoading(false)
      this.setState({ openBranchModal: false })
      Swal.fire(
        '',
        `${local.doneMoving} ${local.customerSuccess}`,
        'success'
      ).then(() => {
        this.setState({ selectedBranch: {}, selectedLead: {} })
        this.getLeadsCustomers()
      })
    } else {
      this.props.setLoading(false)
      Swal.fire('', local.errorOnMovingCustomers, 'error')
    }
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.halan}
          array={this.state.tabs}
          active={this.state.tabs
            .map((item) => {
              return item.icon
            })
            .indexOf('users')}
        />
        <Card className="main-card">
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.applicantsLeads}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfApplicants + ` (${this.props.totalCount})`}
                </span>
              </div>
              <div />
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={[
                'keyword',
                'dateFromTo',
                'leads-status',
                'lastDates',
              ]}
              dropDownKeys={['name']}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              hqBranchIdRequest={this.state.branchId}
              url="lead"
              from={this.state.from}
              size={this.state.size}
            />
            {this.props.data && (
              <DynamicTable
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination
                data={this.props.data}
                url="lead"
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getLeadsCustomers()
                  )
                }}
              />
            )}
          </Card.Body>
        </Card>
        <Modal
          size="lg"
          show={this.state.openLOModal}
          onHide={() => this.setState({ openLOModal: false })}
        >
          <Modal.Header>
            <Modal.Title className="m-auto">
              {local.chooseRepresentative}
            </Modal.Title>
            <button
              type="button"
              className="mr-0 pr-0 close"
              onClick={() => this.setState({ openLOModal: false })}
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: '10px 40px' }}>
              <Form.Label className="data-label">
                {local.chooseLoanOfficer}
              </Form.Label>
              <Col sm={12} className="p-0">
                <AsyncSelect
                  name="employees"
                  data-qc="employees"
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  value={this.state.loanOfficers.find(
                    (loanOfficer) =>
                      loanOfficer._id === this.state.selectedLO?._id
                  )}
                  onChange={(loanOfficer) =>
                    this.setState({ selectedLO: loanOfficer })
                  }
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  loadOptions={(input) => this.getLoanOfficers(input)}
                  cacheOptions
                  defaultOptions
                />
              </Col>
            </Row>
            <Col>
              <Button
                className="mt-4 w-100"
                onClick={() => this.submitLOChange()}
                disabled={false}
                variant="primary"
              >
                {local.submit}
              </Button>
            </Col>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={this.state.openBranchModal}
          onHide={() => this.setState({ openBranchModal: false })}
        >
          <Modal.Header>
            <Modal.Title className="m-auto">{local.chooseBranch}</Modal.Title>
            <button
              type="button"
              className="mr-0 pr-0 close"
              onClick={() => this.setState({ openBranchModal: false })}
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: '10px 40px' }}>
              <Form.Label className="data-label">
                {local.chooseBranch}
              </Form.Label>
              <Col sm={12} className="p-0">
                <AsyncSelect
                  name="branches"
                  data-qc="branches"
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  value={this.state.branches.find(
                    (branch) => branch._id === this.state.selectedBranch?._id
                  )}
                  onChange={(branch) =>
                    this.setState({ selectedBranch: branch })
                  }
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  loadOptions={(input) => this.getBranches(input)}
                  cacheOptions
                  defaultOptions
                />
              </Col>
            </Row>
            <Col>
              <Button
                className="mt-4 w-100"
                onClick={() => this.submitBranchChange()}
                disabled={false}
                variant="primary"
              >
                {local.submit}
              </Button>
            </Col>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={this.state.rejectLeadModal}
          onHide={() => this.setState({ rejectLeadModal: false })}
        >
          <Modal.Header>
            <Modal.Title className="m-auto">
              {local.rejectApplication}
            </Modal.Title>
            <button
              type="button"
              className="mr-0 pr-0 close"
              onClick={() => this.setState({ rejectLeadModal: false })}
            >
              <span aria-hidden="true">x</span>
              <span className="sr-only">Close</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <Formik
              enableReinitialize
              initialValues={{ rejectionReason: '', rejectionDetails: '' }}
              onSubmit={this.rejectLead}
              validationSchema={Yup.object().shape({
                rejectionReason: Yup.string().required(local.required),
              })}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Col>
                    <Form.Group controlId="rejectionReason">
                      <Form.Label style={{ textAlign: 'right' }} column sm={4}>
                        {local.rejectionReason}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="rejectionReason"
                        data-qc="rejectionReason"
                        value={formikProps.values.rejectionReason}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isInvalid={
                          Boolean(formikProps.errors.rejectionReason) &&
                          Boolean(formikProps.touched.rejectionReason)
                        }
                      >
                        <option value="" disabled />
                        {REJECTION_REASONS.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.rejectionReason}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="rejectionDetails">
                      <Form.Label className="customer-form-label">
                        {local.rejectionDetails}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="rejectionDetails"
                        data-qc="rejectionDetails"
                        onChange={formikProps.handleChange}
                        maxLength={200}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button
                      type="submit"
                      className="mt-4 w-100"
                      disabled={false}
                      variant="primary"
                    >
                      {local.submit}
                    </Button>
                  </Col>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={this.state.viewRejectionModal}
          onHide={() => this.setState({ viewRejectionModal: false })}
        >
          <Modal.Header>
            <Modal.Title className="m-auto">
              {local.rejectionReason}
            </Modal.Title>
            <button
              type="button"
              className="mr-0 pr-0 close"
              onClick={() =>
                this.setState({ viewRejectionModal: false, selectedLead: {} })
              }
            >
              <span aria-hidden="true">x</span>
              <span className="sr-only">Close</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <Col>
              <Form.Group controlId="rejectionReason">
                <Form.Label className="font-weight-bold">
                  {this.state.selectedLead.rejectionReason}
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="rejectionDetails">
                <Form.Label>
                  {this.state.selectedLead.rejectionDetails}
                </Form.Label>
              </Form.Group>
            </Col>
            <Col>
              <Button
                type="submit"
                className="mt-4 w-100"
                variant="primary"
                onClick={() =>
                  this.setState({ viewRejectionModal: false, selectedLead: {} })
                }
              >
                {local.done}
              </Button>
            </Col>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(withRouter(Leads))

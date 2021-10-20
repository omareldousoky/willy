import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { Formik } from 'formik'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import HeaderWithCards, {
  Tab,
} from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageAccountsArray } from './manageAccountsInitials'
import {
  getErrorMessage,
  getDateAndTime,
  getBranchFromCookie,
} from '../../../Shared/Services/utils'
import { editLoanOfficerValidation } from './loanOfficersValidation'
import { checkUsernameDuplicates } from '../../../Shared/Services/APIs/User-Creation/checkUsernameDup'
import { updateLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/updateLoanOfficer'
import { LtsIcon } from '../../../Shared/Components'

interface Props extends RouteComponentProps {
  history: any
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  statusCode: string
  search: (data) => Promise<void>
  setLoading: (data) => void
  setSearchFilters: (data) => void
  withHeader: boolean
}
interface State {
  size: number
  from: number
  showModal: boolean
  manageAccountTabs: Tab[]
  loadingInline: boolean
  branchId: string
  loanOfficer: {
    id: string
    name: string
    username: string
    password?: string
    confirmPassword?: string
  }
}

class LoanOfficersList extends Component<Props, State> {
  mappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      manageAccountTabs: [],
      showModal: false,
      branchId: getBranchFromCookie('ltsbranch'),
      loanOfficer: {
        id: '',
        name: '',
        username: '',
      },
      loadingInline: false,
    }
    this.mappers = [
      {
        title: local.name,
        key: 'name',
        render: (data) => data.name,
      },
      {
        title: local.code,
        key: 'code',
        render: (data) => data.loanOfficerKey,
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) => data.nationalId,
      },
      {
        title: local.username,
        key: 'username',
        render: (data) => data.username,
      },
      {
        title: local.creationDate,
        key: 'createdAt',
        render: (data) =>
          data?.created?.at ? getDateAndTime(data.created.at) : '',
      },
      {
        title: '',
        key: 'iocns',
        render: (data) => this.renderIcon(data),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'loanOfficer',
        branchId: this.state.branchId !== 'hq' ? this.state.branchId : '',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
    this.setState({
      manageAccountTabs: manageAccountsArray(),
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  handleSubmit = async (values) => {
    this.props.setLoading(true)
    let obj = {
      id: values.id,
      username: values.username,
    }
    if (values.password) {
      obj = { ...obj, ...{ password: values.password } }
    }
    const res = await updateLoanOfficer(obj)
    if (res.status === 'success') {
      this.setState({ showModal: false })
      Swal.fire('Success', local.updateLoanOfficerSuccess, 'success').then(() =>
        window.location.reload()
      )
    } else {
      Swal.fire('Error!', res.error.error, 'error')
    }
    this.props.setLoading(false)
  }

  async getLoanOfficers() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loanOfficer',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
  }

  renderIcon(data) {
    return (
      <>
        <span
          className="mx-2"
          onClick={() => {
            this.props.history.push({
              pathname: '/manage-accounts/loan-officers/loanOfficer-details',
              state: { details: data._id },
            })
          }}
        >
          <LtsIcon name="view" />
        </span>
        <Can I="updateLoanOfficer" a="user">
          <span
            className="mx-2"
            onClick={() => {
              this.setState({
                showModal: true,
                loanOfficer: {
                  id: data._id,
                  name: data.name,
                  username: data.username,
                },
              })
            }}
          >
            <LtsIcon name="edit" />
          </span>
        </Can>
      </>
    )
  }

  render() {
    return (
      <>
        {this.props.withHeader && (
          <HeaderWithCards
            header={local.manageAccounts}
            array={this.state.manageAccountTabs}
            active={this.state.manageAccountTabs
              .map((item) => {
                return item.icon
              })
              .indexOf('customers')}
          />
        )}
        <Card className="m-4">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between m-3">
              <div className="d-flex align-items-center">
                <Card.Title className="mr-4 mb-0">
                  {local.loanOfficers}
                </Card.Title>
                <span>
                  {local.noOfLoanOfficers +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
            </div>
            <hr className="dashed-line" />
            {this.state.branchId === 'hq' ? (
              <Search
                searchKeys={['keyword', 'dateFromTo', 'branch']}
                dropDownKeys={['name', 'nationalId', 'key', 'userName']}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                setFrom={(from) => this.setState({ from })}
                url="loanOfficer"
                from={this.state.from}
                size={this.state.size}
              />
            ) : (
              <Search
                searchKeys={['keyword', 'dateFromTo']}
                dropDownKeys={['name', 'nationalId', 'key', 'userName']}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                setFrom={(from) => this.setState({ from })}
                url="loanOfficer"
                from={this.state.from}
                size={this.state.size}
                hqBranchIdRequest={this.state.branchId}
              />
            )}
            <DynamicTable
              url="loanOfficer"
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () =>
                  this.getLoanOfficers()
                )
              }}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <Formik
              initialValues={this.state.loanOfficer}
              onSubmit={this.handleSubmit}
              validationSchema={editLoanOfficerValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.updateLoanOfficer}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col>
                        <Form.Group controlId="name">
                          <Form.Label className="font-weight-bold">
                            {local.name}
                          </Form.Label>
                          <Form.Control
                            name="name"
                            value={formikProps.values.name}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="username">
                          <Form.Label className="font-weight-bold">
                            {local.username}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            data-qc="username"
                            value={formikProps.values.username}
                            disabled
                            onChange={async (
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              formikProps.setFieldValue(
                                'username',
                                event.currentTarget.value
                              )
                              this.setState({ loadingInline: true })
                              const res = await checkUsernameDuplicates(
                                event.currentTarget.value?.trim()
                              )

                              if (res.status === 'success') {
                                this.setState({ loadingInline: false })
                                formikProps.setFieldValue(
                                  'usernameChecker',
                                  res.body.data.exists
                                )
                              } else {
                                this.setState({ loadingInline: false })
                                Swal.fire(
                                  'Error !',
                                  getErrorMessage(res.error.error),
                                  'error'
                                )
                              }
                            }}
                            onBlur={formikProps.handleBlur}
                            isInvalid={
                              (formikProps.errors.username &&
                                formikProps.touched.username) as boolean
                            }
                          />

                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.username}
                          </Form.Control.Feedback>
                          <Col sm={1}>
                            <Col sm={1}>
                              <Loader
                                type="inline"
                                open={this.state.loadingInline}
                              />
                            </Col>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="password">
                          <Form.Label className="font-weight-bold">
                            {local.password}
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            data-qc="password"
                            value={formikProps.values.password}
                            placeholder={local.password}
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            isInvalid={
                              (formikProps.errors.password &&
                                formikProps.touched.password) as boolean
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="confirmPassword">
                          <Form.Label className="font-weight-bold">
                            {local.confirmPassword}
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            data-qc="confirmPassword"
                            value={formikProps.values.confirmPassword}
                            placeholder={local.confirmPassword}
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            isInvalid={
                              (formikProps.errors.confirmPassword &&
                                formikProps.touched.confirmPassword) as boolean
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      {local.cancel}
                    </Button>
                    <Button type="submit" variant="primary">
                      {local.submit}
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setLoading: (data) => dispatch(loading(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    statusCode: state.search.status,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(LoanOfficersList))

import React, { Component } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Select from 'react-select'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import { theme } from '../../../Shared/theme'
import {
  getRoles,
  getPermissions,
  createRole,
  editRole,
} from '../../../Shared/Services/APIs/Roles/roles'
import { Loader } from '../../../Shared/Components/Loader'
import { step1, roleCreationStep1Validation } from './roleStates'
import * as local from '../../../Shared/Assets/ar.json'

import {
  customFilterOption,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { Role } from '../userDetails/userDetailsInterfaces'
import { LtsIcon } from '../../../Shared/Components'
import RoleTable from './roleTable'
import Wizard from '../../../Shared/Components/wizard/Wizard'

export interface Section {
  _id: string
  key: string
  i18n: any
  actions: Array<any>
}
interface Props extends RouteComponentProps<{}, {}, Role> {
  edit: boolean
  application: any
  test: boolean
}
interface State {
  step: number
  step1: {
    roleName: string
    hQpermission: boolean
    managerRole?: string
  }

  sections: Array<Section>
  permissions: Array<any>
  managerRolesList: Array<any>
  loading: boolean
}
class RoleCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      step: 1,
      step1,
      sections: [],
      permissions: [],
      managerRolesList: [],
      loading: false,
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      const role = { ...this.props.location.state }
      const { roleName, hasBranch, managerRole } = role
      this.getEditPermissions(role.hasBranch)
      this.setState({
        step1: { roleName, hQpermission: !hasBranch, managerRole },
      })
    }
    this.getRolesForManager()
  }

  async getPermissions() {
    this.setState({ loading: true })
    const id = this.state.step1.hQpermission ? 'hq' : 'branch'
    const res = await getPermissions(id)
    if (res.status === 'success') {
      const sections = res.body.actions
      this.setState({
        loading: false,
        sections,
      })
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

  async getRolesForManager() {
    this.setState({ loading: true })
    const res = await getRoles()
    if (res.status === 'success') {
      this.setState({
        managerRolesList: this.prepareManagerRolesOptions(res.body.roles),
        loading: false,
      })
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

  async getEditPermissions(hasbranch) {
    this.setState({ loading: true })
    const id = !hasbranch ? 'hq' : 'branch'
    const res = await getPermissions(id)
    if (res.status === 'success') {
      const sections = res.body.actions
      const rolePermissionsArray = []
      const rolePermissions = this.props.location.state.permissions
        ? this.props.location.state.permissions
        : {}
      Object.keys(rolePermissions).forEach((roleSection) => {
        const sectionObject = sections.find(
          (section) => section.key === roleSection
        )
        sectionObject &&
          sectionObject.actions.map((action) => {
            const keyArray = Object.keys(action)
            const i18nI = keyArray.indexOf('i18n')
            keyArray.splice(i18nI, 1)
            keyArray.map((key) => {
              const value = action[key]
              if (
                (
                  BigInt(rolePermissions[roleSection]) & BigInt(value)
                ).toString() === BigInt(value).toString()
              ) {
                if (!Object.keys(rolePermissionsArray).includes(roleSection)) {
                  rolePermissionsArray[roleSection] = []
                }
                if (!rolePermissionsArray[roleSection].includes(value)) {
                  rolePermissionsArray[roleSection].push(value)
                }
              }
            })
          })
      })
      this.setState({
        loading: false,
        sections,
        permissions: rolePermissionsArray,
      })
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

  submitToStep2 = (values: object) => {
    this.setState(
      (prevState) =>
        ({
          [`step${prevState.step}`]: values,
          step: prevState.step + 1,
        } as any),
      () => {
        if (this.state.step === 2 && !this.props.edit) this.getPermissions()
      }
    )
  }

  async submit() {
    const perms: Array<any> = []
    if (
      this.state.permissions &&
      Object.keys(this.state.permissions).length > 0
    ) {
      if (!this.props.edit) {
        this.setState({ loading: true })
        Object.keys(this.state.permissions).forEach((key) =>
          perms.push({ key, value: this.state.permissions[key] })
        )
        const obj = {
          roleName: this.state.step1.roleName,
          hasBranch: !this.state.step1.hQpermission,
          managerRole: this.state.step1.managerRole,
          permissions: perms,
        }
        const res = await createRole(obj)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire({
            title: local.success,
            text: local.userRoleCreated,
            confirmButtonText: local.confirmationText,
            icon: 'success',
          }).then(() => {
            this.props.history.push('/manage-accounts')
          })
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
      } else {
        this.setState({ loading: true })
        Object.keys(this.state.permissions).forEach((key) =>
          perms.push({ key, value: this.state.permissions[key] })
        )
        const obj = {
          id: this.props.location.state._id,
          permissions: perms,
        }
        const res = await editRole(obj)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire({
            title: local.success,
            text: local.userRoleEdited,
            confirmButtonText: local.confirmationText,
          }).then(() => {
            this.props.history.push('/manage-accounts')
          })
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
    } else {
      Swal.fire({
        title: local.warningTitle,
        icon: 'warning',
        text: local.mustSelectPermissions,
        confirmButtonText: local.confirmationText,
      })
    }
  }

  prepareManagerRolesOptions(roles: Array<any>) {
    const managerRoles: any[] = []
    roles.forEach((role) => {
      managerRoles.push({
        label: role.roleName,
        value: role._id,
      })
    })
    return managerRoles
  }

  previousStep(step: number): void {
    this.setState({
      step: step - 1,
    } as State)
  }

  cancel(): void {
    this.setState({
      step: 1,
      step1,
    })
    this.props.history.push('/manage-accounts')
  }

  renderStepOne(): any {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step1}
        onSubmit={this.submitToStep2}
        validationSchema={roleCreationStep1Validation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          // <UserDataForm {...formikProps} cancle={() => this.cancel()} />
          <Form onSubmit={formikProps.handleSubmit} className="data-form">
            <Col>
              <Form.Group controlId="roleName">
                <Form.Label className="data-label">{local.roleName}</Form.Label>
                <Form.Control
                  type="text"
                  name="roleName"
                  data-qc="roleName"
                  value={formikProps.values.roleName.toString()}
                  onBlur={formikProps.handleBlur}
                  onChange={formikProps.handleChange}
                  isInvalid={
                    Boolean(formikProps.errors.roleName) &&
                    Boolean(formikProps.touched.roleName)
                  }
                  disabled={this.props.edit}
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.roleName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="hQpermission"
                className="row-nowrap"
              >
                <Form.Check
                  type="checkbox"
                  name="hQpermission"
                  data-qc="hQpermission"
                  style={{ marginRight: '20px' }}
                  value={formikProps.values.hQpermission.toString()}
                  checked={formikProps.values.hQpermission}
                  onBlur={formikProps.handleBlur}
                  onChange={formikProps.handleChange}
                  isInvalid={
                    Boolean(formikProps.errors.hQpermission) &&
                    Boolean(formikProps.touched.hQpermission)
                  }
                  disabled={this.props.edit}
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.hQpermission}
                </Form.Control.Feedback>
                <Form.Label style={{ textAlign: 'right' }}>
                  {local.hQpermission}
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="managerRole" className="mb-4">
                <Form.Label className="data-label">
                  {local.selectManagerRole}
                </Form.Label>
                <Select
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  isSearchable
                  filterOption={customFilterOption}
                  isDisabled={this.props.edit}
                  placeholder={
                    <span
                      style={{ width: '100%', padding: '5px', margin: '5px' }}
                    >
                      <LtsIcon name="search" />
                      {local.searchByUserRole}
                    </span>
                  }
                  value={this.state.managerRolesList.find(
                    (item) => item.value === formikProps.values.managerRole
                  )}
                  name="mangerRole"
                  data-qc="managerRole"
                  options={this.state.managerRolesList}
                />
              </Form.Group>
              <div className="d-flex justify-content-between py-4">
                <Button
                  variant="secondary"
                  className="w-25"
                  onClick={() => {
                    this.cancel()
                  }}
                >
                  {local.cancel}
                </Button>
                <Button
                  variant="primary"
                  className="w-25"
                  type="submit"
                  data-qc="next"
                >
                  {local.next}
                </Button>
              </div>
            </Col>
          </Form>
        )}
      </Formik>
    )
  }

  renderStepTwo(): any {
    return (
      <div style={{ backgroundColor: '#fafafa' }}>
        <>
          <RoleTable
            sections={this.state.sections}
            permissions={this.state.permissions}
            updatePerms={(perms) => {
              this.setState({ permissions: perms })
            }}
          />
          <Row className="justify-content-around">
            <Button
              style={{ width: '20%' }}
              onClick={() => {
                this.previousStep(2)
              }}
            >
              {local.previous}
            </Button>
            <Button
              style={{ float: 'left', width: '20%' }}
              type="button"
              onClick={() => this.submit()}
              data-qc="next"
            >
              {local.submit}
            </Button>
          </Row>
        </>
      </div>
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
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <Container style={{ height: 'fit-content' }}>
          <Card>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'right',
              }}
            >
              <Wizard
                currentStepNumber={this.state.step - 1}
                stepsDescription={[local.userBasicStep1, local.rolesStep2]}
              />
              <Card.Body>{this.renderSteps()}</Card.Body>
            </div>
          </Card>
        </Container>
      </>
    )
  }
}
export default withRouter(RoleCreation)

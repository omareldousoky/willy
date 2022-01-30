import React from 'react'
import axios from 'axios'
import { Formik } from 'formik'
import swal from 'sweetalert2'
import { LoginForm } from './loginForm'
import { loginCred, loginCredValidation } from './loginState'
import * as local from '../../Shared/Assets/ar.json'
import { setToken } from '../../Shared/token'
import { API_BASE_URL } from '../../Shared/envConfig'

interface User {
  username: string
  password: string
}
interface Props {
  title: string
  isCF: boolean
}
interface State {
  credentials: User
}
class Login extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      credentials: loginCred,
    }
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    this.setState({ [name]: value } as any)
  }

  submit = (values: User): void => {
    const data = {
      username: values.username.trim(),
      password: values.password,
    }
    axios({
      url: `${API_BASE_URL}/auth/login`,
      method: 'post',
      data,
    }).then(
      (succ) => {
        document.cookie = 'token=; expires = Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'ltsbranch=; expires = Thu, 01 Jan 1970 00:00:00 GMT'
        setToken(succ.data.Token)
        window.location.href = process.env.REACT_APP_URL || ''
      },
      () => {
        swal.fire({
          confirmButtonText: local.confirmationText,
          text: local.loginError,
          icon: 'error',
        })
      }
    )
  }

  render() {
    return (
      <div className="login-parent">
        <div className="right-hero">
          <div className="texts">
            <h1>{local.welcomeTo}</h1>
            {this.props.isCF ? (
              <>
                <h1>{local.commerceTrackingSystem}</h1>
                <h3>
                  {local.from} {local.halan}
                </h3>
              </>
            ) : (
              <>
                <h1>{local.systemForLoanTracking}</h1>
                <h3>{local.lowRateLoan}</h3>
              </>
            )}
          </div>
          <img alt="login" src={require('../Assets/loginPhotos.png')} />
        </div>
        <div className="left-hero">
          <img
            alt="logo"
            className="login-logo"
            src={
              this.props.isCF
                ? require('../../Shared/Assets/HalanLogo.svg')
                : require('../../Shared/Assets/Logo.svg')
            }
          />
          <div className="login-form">
            <h2>{local.login}</h2>
            <Formik
              enableReinitialize
              initialValues={this.state.credentials}
              onSubmit={this.submit}
              validationSchema={loginCredValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => <LoginForm {...formikProps} />}
            </Formik>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="vertical-line-login" />
            <div style={{ margin: '100px 15px 0px 0px' }}>
              <p>{local.loginInfo01}</p>
              <p>{local.loginInfo02}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login

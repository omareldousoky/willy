import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import { getAuthData } from '../Shared/redux/auth/actions'
import NavBar from '../Shared/Components/NavBar'
import { getCookie } from '../Shared/Services/getCookie'
import './index.scss'
import { routes } from './Services/routes'
import WithBreadcrumbs from '../Shared/Components/navigation/withBreadcrumbs'

const App = (props) => {
  useEffect(() => {
    props.getAuthData()
  }, [props])

  const authData = useSelector((state: any) => {
    return state.auth
  })

  if (getCookie('token') === '') {
    window.location.href = process.env.REACT_APP_LOGIN_URL || ''
    return <></>
  }
  return (
    <BrowserRouter>
      <div className="bg-white app-container">
        <NavBar isLTS={false} auth={authData} />
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} exact path={route.path}>
              <WithBreadcrumbs route={route} />
            </Route>
          ))}
        </Switch>
      </div>
    </BrowserRouter>
  )
}

const mapMethodsToProps = (dispatch) => {
  return {
    getAuthData: () => dispatch(getAuthData()),
  }
}
export default connect(null, mapMethodsToProps)(App)

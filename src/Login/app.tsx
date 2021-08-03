import React from 'react'
import Login from './Components/login'
import { isCF } from '../Shared/Services/utils'

const App = () => {
  return <Login title="" isCF={isCF} />
}

export default App

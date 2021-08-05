import React from 'react'
import * as local from '../../Assets/ar.json'
import { LandingProps } from './types'

export const Landing = ({ appName }: LandingProps) => {
  return (
    <h1 className="m-4">
      {local.welcomeTo} {appName}
    </h1>
  )
}

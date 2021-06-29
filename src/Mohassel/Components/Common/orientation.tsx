import React from 'react'
import { OrientationProps } from './types'

const Orientation = ({ size, keepCardStyle }: OrientationProps) => (
  <style type="text/css">
    {size === 'landscape'
      ? '@media print{@page {size: landscape}}'
      : '@media print{@page {size: portrait}}'}
    {keepCardStyle ? '' : '@media print{.card{margin: 0; border: none;}}'}
  </style>
)

export default Orientation

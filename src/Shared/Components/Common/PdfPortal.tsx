import React from 'react'
import { createPortal } from 'react-dom'
import { PdfPortalProps } from './types'

export const PdfPortal = ({ component }: PdfPortalProps) =>
  createPortal(
    <>
      <style type="text/css">
        {'@media print{.app-container, .tooltip {display: none !important;}}'}
      </style>
      {component}
    </>,
    document.querySelector('#print') as Element
  )

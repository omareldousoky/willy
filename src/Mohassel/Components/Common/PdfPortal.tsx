import React from 'react'
import { createPortal } from 'react-dom'

interface PdfPortalProps {
  component: JSX.Element
}

export const PdfPortal = (props: PdfPortalProps) =>
  createPortal(
    <>
      <style type="text/css">
        {'@media print{.app-container{display: none !important;}}'}
      </style>
      {props.component}
    </>,
    document.querySelector('#print') as Element
  )

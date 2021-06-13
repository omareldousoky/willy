import React from 'react'
import { createPortal } from 'react-dom'

interface PdfPortalProps {
  component: JSX.Element
}

export const PdfPortal = React.memo((props: PdfPortalProps) =>
  createPortal(props.component, document.querySelector('#print') as Element)
)

import React from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { LtsIconProps } from './types'

export const LtsIcon = ({
  name,
  tooltipText,
  tooltipPlacement,
}: LtsIconProps) => {
  return tooltipText ? (
    <OverlayTrigger
      key={tooltipPlacement}
      placement={tooltipPlacement}
      overlay={
        <Tooltip id={`tooltip-${tooltipPlacement}`}>{tooltipText}</Tooltip>
      }
    >
      <span className={`lts lts-${name}`} />
    </OverlayTrigger>
  ) : (
    <span className={`lts lts-${name}`} />
  )
}

LtsIcon.defaultProps = {
  tooltipText: '',
  tooltipPlacement: 'bottom',
}

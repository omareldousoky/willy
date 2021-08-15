import React from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { LtsIconProps } from './types'

export const LtsIcon = ({
  name,
  size,
  color,
  tooltipText,
  tooltipPlacement,
  style,
}: LtsIconProps) => {
  return tooltipText ? (
    <OverlayTrigger
      key={tooltipPlacement}
      placement={tooltipPlacement}
      overlay={
        <Tooltip id={`tooltip-${tooltipPlacement}`}>{tooltipText}</Tooltip>
      }
    >
      <span
        className={`lts lts-${name}`}
        style={{ fontSize: size, color, ...style }}
      />
    </OverlayTrigger>
  ) : (
    <span
      className={`lts lts-${name}`}
      style={{ fontSize: size, color, ...style }}
    />
  )
}

LtsIcon.defaultProps = {
  tooltipText: '',
  tooltipPlacement: 'bottom',
  size: '20px',
  color: 'unset',
}

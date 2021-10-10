import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../Shared/Components'

export const PenaltyStrike = (props: { penalty: number }) => (
  <>
    <div className="error-container mx-2 my-3">
      <LtsIcon name="warning" color="#d51b1b" />
      <h4>
        <span style={{ margin: '0 10px' }}> {local.penaltyMessage}</span>
        <span style={{ color: '#d51b1b' }}>{props.penalty}</span>
      </h4>
    </div>
  </>
)

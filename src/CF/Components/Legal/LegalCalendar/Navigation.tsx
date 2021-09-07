import React from 'react'
import { LtsIcon } from '../../../../Shared/Components'

export const Navigation = ({ title, handlePrev, handleNext }) => {
  return (
    <div className="mx-3 text-secondary">
      <span className="arrow mx-2" onClick={handleNext}>
        <LtsIcon name="arrow-left" />
      </span>
      <span className="week-number ">{title}</span>
      <span className="arrow mx-2" onClick={handlePrev}>
        <LtsIcon name="arrow-right" />
      </span>
    </div>
  )
}

import React from 'react'

export const Navigation = ({ title, handlePrev, handleNext }) => {
  return (
    <div className="mx-3 text-secondary">
      <span className="arrow mx-2" onClick={handlePrev}>
        {`<`}
      </span>
      <span className="week-number ">{title}</span>
      <span className="arrow mx-2" onClick={handleNext}>
        {`>`}
      </span>
    </div>
  )
}

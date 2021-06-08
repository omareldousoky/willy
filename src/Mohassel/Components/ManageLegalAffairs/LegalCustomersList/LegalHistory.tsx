import React from 'react'
import local from '../../../../Shared/Assets/ar.json'
import Orientation from '../../Common/orientation'
import './legalHistory.scss'

const LegalHistory = () => {
  return (
    <div className="legal-history">
      <Orientation size="landscape" />
      <div className="w-100 text-dark bg-dark">{local.downloadHistory}</div>
    </div>
  )
}

export default LegalHistory

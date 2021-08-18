import React from 'react'

export const Header = () => {
  return (
    <thead style={{ display: 'table-header-group' }}>
      <div className="d-flex justify-content-between m-2">
        <div className="cf-logo-print-tb" />
        <div className="m-0 ml-3 text-left text-sm">
          <p>حالا للتمويل الاستهلاكي ش. م. م.</p>
          <p>ترخيص رقم 23 بتاريخ 31/05/2021</p>
        </div>
      </div>
      <br />
    </thead>
  )
}

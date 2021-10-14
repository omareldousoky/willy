import React from 'react'
import VendorSettlement from '.'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'

export const vendorSettlementRoutes = {
  path: '/vendor-settlements',
  label: local.vendorSettlement,
  render: (props) => (
    <Can I="getMerchantOutstandingSettlement" a="cfApplication">
      <VendorSettlement {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/reports',
      label: local.vendorSettlementReports,
      render: (props) => (
        <Can I="getMerchantOutstandingSettlement" a="cfApplication">
          <VendorSettlement {...props} />
        </Can>
      ),
    },
  ],
}

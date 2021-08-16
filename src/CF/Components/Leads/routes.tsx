import React from 'react'
import { AssignLoanOfficer, EditLead, LeadProfile, Leads } from '.'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'

export const leadsRoutes = {
  path: '/halan-integration',
  label: local.halan,
  render: (props) => (
    <Can I="getLead" a="halanuser">
      <Leads {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/leads',
      label: local.applicantsLeads,
      render: (props) => (
        <Can I="getLead" a="halanuser">
          <Leads {...props} />
        </Can>
      ),
      routes: [
        {
          path: '/view-lead',
          label: local.customersDetails,
          render: (props) => (
            <Can I="getLead" a="halanuser">
              <LeadProfile {...props} />
            </Can>
          ),
        },
        {
          path: '/edit-lead',
          label: local.editCustomer,
          render: (props) => (
            <Can I="getLead" a="halanuser">
              <EditLead {...props} />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/exchange',
      label: local.assignOrChangeLoanOfficer,
      render: (props) => (
        <Can I="getLead" a="halanuser">
          <AssignLoanOfficer {...props} />
        </Can>
      ),
    },
  ],
}

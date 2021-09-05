import React from 'react'
import {
  DefaultingCustomersList,
  LegalActionsForm,
  LegalCalendar,
  LegalCustomersList,
  LegalWarnings,
} from '.'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'

export const legalRoutes = {
  path: '/legal-affairs',
  label: local.legalAffairs,
  render: (props) => (
    <Can I="getDefaultingCustomer" a="legal">
      <DefaultingCustomersList {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/late-list',
      label: local.lateList,
      render: (props) => (
        <Can I="getDefaultingCustomer" a="legal">
          <DefaultingCustomersList {...props} />
        </Can>
      ),
    },
    {
      path: '/legal-actions',
      label: local.legalAffairs,
      render: (props) => (
        <Can I="getDefaultingCustomer" a="legal">
          <LegalCustomersList {...props} />
        </Can>
      ),
    },
    {
      path: '/customer-actions',
      label: local.legalAffairs,
      render: (props) => (
        <Can I="updateDefaultingCustomer" a="legal">
          <LegalActionsForm {...props} />
        </Can>
      ),
    },
    {
      path: '/legal-calendar',
      label: local.legalCalendar,
      render: (props) => (
        <Can I="updateDefaultingCustomer" a="legal">
          <LegalCalendar {...props} />
        </Can>
      ),
    },
    {
      path: '/legal-warnings',
      label: local.legalAffairs,
      render: (props) => (
        <Can I="getLegalWarning" a="legal">
          <LegalWarnings {...props} />
        </Can>
      ),
    },
  ],
}

import * as React from 'react'
import Can from '../../../Shared/config/Can'
import CustomerCreation from '.'
import { CustomerProfile } from './CustomerProfile'
import CustomersList from './CustomersList'
import ClearanceCreation from '../Clearance/clearanceCreation'
import local from '../../../Shared/Assets/ar.json'
import MoveCustomers from '../MoveCustomers/moveCustomers'

export const customerCreationRoutes = {
  path: '/customers',
  label: local.customers,
  render: (props) => (
    <Can I="getCustomer" a="customer">
      <CustomersList {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/new-customer',
      label: local.newCustomer,
      render: (props) => (
        <Can I="createCustomer" a="customer">
          <CustomerCreation {...props} edit={false} />
        </Can>
      ),
    },
    {
      path: '/edit-customer',
      label: local.editCustomer,
      render: (props) => <CustomerCreation {...props} edit />,
    },
    {
      path: '/view-customer',
      label: local.viewCustomer,
      render: (props) => <CustomerProfile {...props} />,
    },
    {
      path: '/create-clearance',
      label: local.createClearance,
      render: (props) => (
        <Can I="newClearance" a="application">
          <ClearanceCreation {...props} />
        </Can>
      ),
    },
    {
      path: '/move-customers',
      label: local.moveCustomers,
      render: (props) => (
        <Can I="changeOfficer" a="customer">
          <MoveCustomers {...props} />
        </Can>
      ),
    },
  ],
}

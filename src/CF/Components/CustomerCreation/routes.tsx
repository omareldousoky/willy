import * as React from 'react'
import Can from '../../../Shared/config/Can'
import CustomerCreation from './CustomerCreation'
import { CustomerProfile } from './CustomerProfile'
import CustomersList from './CustomersList'
import local from '../../../Shared/Assets/ar.json'

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
  ],
}

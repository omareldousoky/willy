import React from 'react'
import { RolesList, UsersList } from '.'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import { RoleCreation, RoleProfile } from '../roles'
import { UserCreation } from '../userCreation'
import { UserDetails } from '../userDetails'

export const manageAccountsRoute = {
  path: '/manage-accounts',
  label: local.manageAccounts,
  render: (props) => (
    <Can I="getRoles" a="user">
      <RolesList {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/roles',
      label: local.roles,
      render: (props) => (
        <Can I="getRoles" a="user">
          <RolesList {...props} withHeader />
        </Can>
      ),
      routes: [
        {
          path: '/new-role',
          label: local.createNewRole,
          render: (props) => (
            <Can I="createRoles" a="user">
              <RoleCreation {...props} edit={false} />
            </Can>
          ),
        },
        {
          path: '/edit-role',
          label: local.editRole,
          render: (props) => (
            <Can I="createRoles" a="user">
              <RoleCreation {...props} edit />
            </Can>
          ),
        },
        {
          path: '/role-profile',
          label: local.roleDetails,
          render: (props) => (
            <Can I="getRoles" a="user">
              <RoleProfile {...props} />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/users',
      label: local.users,
      render: (props) => (
        <Can I="getUser" a="user">
          <UsersList {...props} withHeader />
        </Can>
      ),
      routes: [
        {
          path: '/new-user',
          label: local.newUser,
          render: (props) => (
            <Can I="createUser" a="user">
              <UserCreation {...props} edit={false} />
            </Can>
          ),
        },
        {
          path: '/edit-user',
          label: local.editUser,
          render: (props) => (
            <Can I="updateUser" a="user">
              <UserCreation {...props} edit />
            </Can>
          ),
        },
        {
          path: '/user-details',
          label: local.userDetails,
          render: (props) => (
            <Can I="getUser" a="user">
              <UserDetails {...props} />
            </Can>
          ),
        },
      ],
    },
  ],
}

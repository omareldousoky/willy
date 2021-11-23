import React from 'react'
import { LoanOfficersTransfers } from 'Shared/Components/ManageAccounts'
import { BranchesList, LoanOfficersList, RolesList, UsersList } from '.'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import { CreateBranch } from '../BranchCreation'
import { BranchDetails } from '../BranchDetails'
import { RoleCreation, RoleProfile } from '../Roles'
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
    {
      path: '/branches',
      label: local.branches,
      render: (props) => (
        <Can I="getBranch" a="branch">
          <BranchesList {...props} withHeader />
        </Can>
      ),
      routes: [
        {
          path: '/new-branch',
          label: local.newBranch,
          render: (props) => (
            <Can I="createBranch" a="branch">
              <CreateBranch {...props} edit={false} />
            </Can>
          ),
        },
        {
          path: '/edit-branch',
          label: local.editBranch,
          render: (props) => (
            <Can I="createBranch" a="branch">
              <CreateBranch {...props} edit />
            </Can>
          ),
        },
        {
          path: '/branch-details',
          label: local.branchDetails,
          render: (props) => (
            <Can I="getBranch" a="branch">
              <BranchDetails {...props} />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/loan-officers',
      label: local.loanOfficers,
      render: (props) => (
        <Can I="updateLoanOfficer" a="user">
          <LoanOfficersList {...props} withHeader />
        </Can>
      ),
      routes: [
        {
          path: '/loanOfficer-details',
          label: local.loanOfficer,
          render: (props) => <UserDetails {...props} />,
        },
        {
          path: '/transfer-logs',
          label: local.loanOfficersTransfers,
          render: () => <LoanOfficersTransfers />,
        },
      ],
    },
  ],
}

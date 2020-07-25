/* eslint-disable react/display-name */

import * as React from 'react';
import CustomerCreation from '../Components/CustomerCreation/customer-creation';
import UserCreation from '../Components/UserCreation/user-creation';
import FormulaCreation from '../Components/LoanFormulaCreation/loanFormulaCreation';
import FormulaTest from '../Components/LoanFormulaCreation/loanFormulaTest';
import LoanProductCreation from '../Components/LoanProductCreation/loanProductCreation';
import LoanApplicationCreation from '../Components/LoanApplication/loanApplicationCreation';
import AssignProductToBranch from '../Components/Branch/assignProductToBranch';
import TrackLoanApplications from '../Components/TrackLoanApplications/trackLoanApplications';
import LoanCreation from '../Components/LoanCreation/loanCreation';
import LoanUses from '../Components/LoanUses/loanUses';
import BulkApplicationApproval from '../Components/BulkApplicationApproval/bulkApplicationApproval';
import LoanProfile from '../Components/LoanProfile/loanProfile';
import LoanStatusChange from '../Components/LoanApplication/loanApplicationStatusChange';
import LoanList from '../Components/LoanList/loanList';
import RoleCreation from '../Components/Roles/roleCreation';
import RoleProfile from '../Components/Roles/roleProfile';
import UsersList from '../Components/ManageAccounts/usersList';
import BranchesList from '../Components/ManageAccounts/branchesList';
import RolesList from '../Components/ManageAccounts/rolesList';
import { Landing } from '../Components/Landing/landing';
import Can from '../config/Can';
import UserDetails from '../Components/userDetails/user-details';
import CreateBranch from '../Components/BranchCreation/create-branch';
import CustomersList from '../Components/CustomerCreation/customersList';
import LoanProducts from '../Components/ManageLoans/productsList';
import FormulaList from '../Components/ManageLoans/calculationFormulaList';
import * as local from '../../Shared/Assets/ar.json';
import { generateAppRoutes } from './utils';
import BranchDetails from '../Components/BranchDetails/branch-details';
import GroupMemberSeperation from '../Components/LoanProfile/groupMemberSeperation';
import ViewFormula from '../Components/LoanFormulaCreation/calculationFormulaView';
import ViewProduct from '../Components/LoanProductCreation/loanProductView';
import LoanRollBack from '../Components/LoanProfile/loanRollBack';
import EncodingFiles from '../Components/Tools/encodingFiles';
import DocumentTypeCreation from '../Components/documentTypeCreation/documentTypeCreation';
import CustomerProfile from '../Components/CustomerCreation/customerProfile';
import ActionLogs from '../Components/ActionLogs/action-logs';

const appRoutes = [
  {
    path: "/",
    label: local.mohassel,
    component: Landing,
    routes: [
      {
        path: "/customers",
        label: local.customers,
        render: (props) => <Can I='getCustomer' a='customer'><CustomersList {...props} /></Can>,
        routes: [
          {
            path: "/new-customer",
            label: local.newCustomer,
            render: (props) => <Can I='createCustomer' a='customer'><CustomerCreation {...props} edit={false} /></Can>,
          },
          {
            path: "/edit-customer",
            label: local.editCustomer,
            render: (props) => <CustomerCreation {...props} edit={true} />,
          }
          ,
          {
            path: "/view-customer",
            label: local.viewCustomer,
            render: (props) => <CustomerProfile {...props} />,
          }
        ]
      },
      {
        path: "/tools",
        label: local.tools,
        render: (props) => <Can I ='documentTypes' a='config'><EncodingFiles {...props}/> </Can>,
        routes: [{
          path: "/encoding-files",
          label: local.encodingFiles,
          render: (props) => <Can I ='documentTypes' a='config'><EncodingFiles {...props}/> </Can>,
          routes:[
            {
              path: "/create-encoding-files",
              label: local.createEncodingFiles,
              render: (props) =>  <Can I='documentTypes' a='config'><DocumentTypeCreation {...props} edit={false} /> </Can>
            },
            {
              path: "/edit-encoding-files",
              label: local.createEncodingFiles,
              render: (props) =>  <Can I='documentTypes' a='config'><DocumentTypeCreation {...props} edit={true} /> </Can>
            }
          ]
        }
        ]

      },
      {
        path: "/track-loan-applications",
        label: local.loanApplications,
        render: (props) => <Can I='getLoanApplication' a='application'><TrackLoanApplications /></Can>,
        routes: [
          {
            path: "/new-loan-application",
            label: local.createLoanApplication,
            render: (props) => <LoanApplicationCreation {...props} edit={false} />

          },
          {
            path: "/edit-loan-application",
            label: local.editLoan,
            render: (props) => <LoanApplicationCreation {...props} edit={true} />,
          },
          {
            path: "/create-loan",
            label: local.createLoan,
            render: (props) => <LoanCreation {...props} edit={false} />,
          },
          {
            path: "/loan-profile",
            label: local.loanDetails,
            render: (props) => <LoanProfile {...props} />,
          },
          {
            path: "/remove-member",
            label: local.memberSeperation,
            render: (props) => <Can I='splitFromGroup' a='application'><GroupMemberSeperation {...props} /></Can>,
          },
          {
            path: "/loan-status-change",
            label: local.loanStatusChange,
            render: (props) => <LoanStatusChange {...props} />,
          },
          {
            path: "/loan-roll-back",
            label: local.previousActions,
            render: (props) => <LoanRollBack {...props} />,
          }
        ]
      },
      {
        path: "/loan-uses",
        label: local.loanUses,
        render: (props) => <Can I='loanUsage' a='config'><LoanUses /></Can>
      },
      {
        path: "/bulk-approvals",
        label: local.bulkLoanApplicationsApproval,
        render: (props) => <Can I='approveLoanApplication' a='application'> <BulkApplicationApproval /></Can>
      },
      {
        path: "/manage-loans",
        label: local.loans,
        render: (props) => <Can I='getLoanProduct' a='product'><LoanProducts {...props} /></Can>,
        routes: [
          {
            path: '/loan-products',
            label: local.loanProducts,
            render: (props) => <Can I='getLoanProduct' a='product'><LoanProducts {...props} /></Can>,
            routes: [
              {
                path: "/new-loan-product",
                label: local.createLoanProduct,
                render: (props) => <Can I='createLoanProduct' a='product'><LoanProductCreation {...props} /></Can>,
              },
              {
                path: "/view-product",
                label: local.productName,
                render: (props) => <Can I='getLoanProduct' a='product'><ViewProduct {...props} /></Can>,
              }
            ]
          },
          {
            path: '/calculation-formulas',
            label: local.calculationFormulas,
            render: (props) => <Can I='getCalculationFormula' a='product'><FormulaList {...props} /></Can>,
            routes: [
              {
                path: "/new-formula",
                label: local.createCalculationMethod,
                render: (props) => <Can I='createCalculationFormula' a='product'><FormulaCreation {...props} /></Can>,
              },
              {
                path: "/view-formula",
                label: local.calculationFormulaId,
                render: (props) => <Can I='getCalculationFormula' a='product'><ViewFormula {...props} /></Can>,
              }
            ]
          },
          {
            path: "/test-formula",
            label: local.testCalculationMethod,
            render: (props) => <Can I='testCalculate' a='product'><FormulaTest {...props} /></Can>,
          },
        ]
      },
      {
        path: "/manage-accounts",
        label: local.manageAccounts,
        render: (props) => <Can I='getRoles' a='user'><RolesList {...props} /></Can>,
        routes: [
          {
            path: "/roles",
            label: local.roles,
            render: (props) => <Can I='getRoles' a='user'><RolesList {...props} withHeader={true} /> </Can>,
            routes: [
              {
                path: "/new-role",
                label: local.createNewRole,
                render: (props) => <Can I='createRoles' a='user'><RoleCreation {...props} edit={false} /></Can>,
              },
              {
                path: "/edit-role",
                label: local.editRole,
                render: (props) => <Can I='createRoles' a='user'><RoleCreation {...props} edit={true} /></Can>,
              },
              {
                path: "/role-profile",
                label: local.roleDetails,
                render: (props) => <Can I='getRoles' a='user'><RoleProfile {...props} /></Can>,
              }
            ]
          },
          {
            path: "/users",
            label: local.users,
            render: (props) => <Can I='getUser' a='user'> <UsersList  {...props} withHeader={true}  /></Can>,
            routes: [
              {
                path: "/new-user",
                label: local.newUser,
                render: (props) => <Can I='createUser' a='user'><UserCreation  {...props} edit={false} /></Can>

              },
              {
                path: "/edit-user",
                label: local.editUser,
                render: (props) => <Can I='getUser' a='user'><UserCreation  {...props} edit={true} /></Can>,
              },
              {
                path: "/user-details",
                label: local.userDetails,
                render: (props) => <Can I='getUser' a='user'><UserDetails {...props} /></Can>,
              }
            ]
          },
          {
            path: "/branches",
            label: local.branches,
            render: (props) => <Can I='getBranch' a='branch'> <BranchesList {...props} withHeader={true}  /> </Can>,
            routes: [
              {
                path: "/new-branch",
                label: local.newBranch,
                render: (props) => <Can I='createBranch' a='branch'><CreateBranch {...props} edit={false} /></Can>

              },
              {
                path: "/edit-branch",
                label: local.editBranch,
                render: (props) => <Can I='createBranch' a='branch'><CreateBranch {...props} edit={true} /></Can>

              }, {
                path: "/branch-details",
                label: local.branchDetails,
                render: (props) => <Can I='getBranch' a='branch'><BranchDetails {...props} /> </Can>
              }
            ]
          }

        ]

      }, {
        path: "/loans",
        label: local.issuedLoans,
        render: (props) => <Can I='getIssuedLoan' a='application'> <LoanList {...props} /></Can>,
        routes: [
          {
            path: "/loan-profile",
            label: local.loanDetails,
            render: (props) => <LoanProfile {...props} />,
          },
        ]

      }
      , {
        path: "/assign-branch-products",
        label: local.assignProductToBranch,
        render: (props) => <Can I='assignProductToBranch' a='product'> <AssignProductToBranch {...props} /> </Can>,
      },
      {
        path: "/logs",
        label: local.logs,
        render: (props) => <Can I = "viewActionLogs" a = 'user' ><ActionLogs {...props} /></Can>,
      }
    ]
  },
];

export const routes = generateAppRoutes(appRoutes);
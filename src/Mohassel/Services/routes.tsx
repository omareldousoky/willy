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
import NavBar from '../Components/NavBar/navBar';
import LoanUses from '../Components/LoanUses/loanUses';
import BulkApplicationApproval from '../Components/BulkApplicationApproval/bulkApplicationApproval';
import ManageAccounts from '../Components/ManageAccounts/manageAccounts';
import LoanProfile from '../Components/LoanProfile/loanProfile';
import LoanList from '../Components/LoanList/loanList';
import RoleCreation from '../Components/Roles/roleCreation';
import RoleProfile from '../Components/Roles/roleProfile';
import { Landing } from '../Components/Landing/landing';
import Can from '../config/Can';
import UserDetails from '../Components/userDetails/user-details';
import CreateBranch from '../Components/BranchCreation/create-branch';
import CustomersList from '../Components/CustomerCreation/customersList';
import ability from '../config/ability';
import * as local from '../../Shared/Assets/ar.json';
import { generateAppRoutes } from './utils';

 const appRoutes = [
{
  path: "/",
  label: local.mohassel,
  component: Landing,
routes: [ 
{
    path: "/customers",
    label: local.customers,
    render: (props)=> <Can I='getCustomer' a='customer'><CustomersList {...props} /></Can>,
    routes: [
    {
      path: "/new-customer",
      label: local.newCustomer,
      render: (props) => <Can I='createCustomer' a='customer'><CustomerCreation {...props} edit={false} /></Can> , 
    },
    {
      path: "/edit-customer",
      label: local.editCustomer,
      render: (props) => <Can I='updateCustomer' a='customer'><CustomerCreation {...props} edit={true} /> </Can>,
    }
  ]
},
{
  path: "/new-formula",
  label: local.createCalculationMethod,
  render: (props) => <Can I='createCalculationFormula' a='product'><FormulaCreation /></Can>,
},
{
  path: "/test-formula",
  render : (props) => <Can I='testCalculate' a='product'><FormulaTest {...props} /></Can>,
}, 
{
  path: "/new-loan-product",
  label: local.createLoanProduct,
  render : (props) => <Can I='createLoanProduct' a='product'><LoanProductCreation /></Can>,
},
 {
  path: "/track-loan-applications",
  label: local.loanApplications,
  render: (props) => <Can I='getLoanApplication' a='application'><TrackLoanApplications /></Can>,
  routes: [
    {
      path: "/edit-loan-application",
      label: local.editLoan ,
      render: (props) => (props) => <LoanApplicationCreation {...props} edit={true} />,
    } ,
    {
      path: "/create-loan",
      label: local.createLoan, 
      render: (props) => <LoanCreation {...props} />,
    } , 
    {
      path: "/loan-profile",
      label: local.loanDetails,
      render: (props) => <LoanProfile {...props} />,


    }
]
} , 
{
  path: "/loan-uses" ,
  label: local.loanUses,
  render: (props) => <Can I='loanUsage' a='config'><LoanUses /></Can>
},
{
  path: "/bulk-approvals",
  label: local.bulkLoanApplicationsApproval,
  render: (props) => <Can I='approveLoanApplication' a='application'> <BulkApplicationApproval /></Can>
}, 
{
   path: "/manage-accounts",
   label: local.manageAccounts,
   render: (props) => <ManageAccounts />,

}, {
  path: "/loans",
  label: local.issuedLoans,
  render: (props) => <Can I='getIssuedLoan' a='application'> <LoanList {...props} /></Can>

}
]
}
];

export const  routes = generateAppRoutes(appRoutes);
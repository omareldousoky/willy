/* eslint-disable react/display-name */

import * as React from 'react'
import CustomerCreation from '../Components/CustomerCreation/customerCreation'
import UserCreation from '../Components/UserCreation/userCreation'
import FormulaCreation from '../Components/LoanFormulaCreation/loanFormulaCreation'
import FormulaTest from '../Components/LoanFormulaCreation/loanFormulaTest'
import LoanProductCreation from '../Components/LoanProductCreation/loanProductCreation'
import LoanApplicationCreation from '../Components/LoanApplication/loanApplicationCreation'
import TrackLoanApplications from '../Components/TrackLoanApplications/trackLoanApplications'
import LoanCreation from '../Components/LoanCreation/loanCreation'
import LoanUses from '../Components/LoanUses/loanUses'
import BulkApplicationApproval from '../Components/BulkApplicationApproval/bulkApplicationApproval'
import LoanProfile from '../Components/LoanProfile/loanProfile'
import LoanStatusChange from '../Components/LoanApplication/loanApplicationStatusChange'
import LoanList from '../Components/LoanList/loanList'
import RoleCreation from '../Components/Roles/roleCreation'
import RoleProfile from '../Components/Roles/roleProfile'
import UsersList from '../Components/ManageAccounts/usersList'
import BranchesList from '../Components/ManageAccounts/branchesList'
import RolesList from '../Components/ManageAccounts/rolesList'
import { Landing } from '../Components/Landing/landing'
import Can from '../config/Can'
import UserDetails from '../Components/userDetails/user-details'
import CreateBranch from '../Components/BranchCreation/createBranch'
import CustomersList from '../Components/CustomerCreation/customersList'
import LoanProducts from '../Components/ManageLoans/productsList'
import FormulaList from '../Components/ManageLoans/calculationFormulaList'
import * as local from '../../Shared/Assets/ar.json'
import { generateAppRoutes } from '../../Shared/Services/utils'
import BranchDetails from '../Components/BranchDetails/branchDetails'
import GroupMemberSeperation from '../Components/LoanProfile/groupMemberSeperation'
import ViewFormula from '../Components/LoanFormulaCreation/calculationFormulaView'
import ViewProduct from '../Components/LoanProductCreation/loanProductView'
import LoanRollBack from '../Components/LoanProfile/loanRollBack'
import EncodingFiles from '../Components/Tools/encodingFiles'
import DocumentTypeCreation from '../Components/documentTypeCreation/documentTypeCreation'
import CustomerProfile from '../Components/CustomerCreation/customerProfile'
import ActionLogs from '../Components/ActionLogs/action-logs'
import SourceOfFund from '../Components/SourceOfFund/sourceOfFund'
import CIB from '../Components/CIB/cib'
import ReportsHome from '../Components/Reports/reportsHome'
import MoveCustomers from '../Components/MoveCustomers/moveCustomers'
import BulkApplicationCreation from '../Components/BulkApplicationCreation/bulkApplicationCreation'
import AssignProductsToBranches from '../Components/Branch/assignProductsToBranches'
import Leads from '../Components/HalanIntegration/leads'
import AssignLoanOfficer from '../Components/HalanIntegration/assignLoanOfficer'
import PrincipleThreshold from '../Components/ManageFinance/principleThreshold'
import LeadProfile from '../Components/HalanIntegration/leadProfile'
import EditLead from '../Components/HalanIntegration/editLead'
import GeoAreas from '../Components/GeoAreas/geoAreas'
import BulkApplicationReview from '../Components/BulkApplicarionReview/bulkApplicationReview'
import CreateClearance from '../Components/Clearance/create-clearance'
import ClearancesList from '../Components/Clearance/clearancesList'
import ClearanceProfile from '../Components/Clearance/clearanceProfile'
import SupervisionGroupsList from '../Components/managerHierarchy/supervisionGroupsList'
import BusinessActivities from '../Components/ManageLoanDetails/businessActivities'
import BusinessSpecialities from '../Components/ManageLoanDetails/businessSpecialities'
import FinancialClosing from '../Components/FinancialClosing/financialClosing'
import LoanOfficersList from '../Components/ManageAccounts/loanOfficersList'
import FinancialBlocking from '../Components/FinancialClosing/financialBlocking'
import DefaultingCustomersList from '../Components/ManageLegalAffairs/defaultingCustomersList'
import FinancialReviewing from '../Components/FinancialClosing/FinancialReviewing'

const appRoutes = [
  {
    path: '/',
    label: local.mohassel,
    component: Landing,
    routes: [
      {
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
            path: '/move-customers',
            label: local.moveCustomers,
            render: (props) => (
              <Can I="changeOfficer" a="customer">
                <MoveCustomers {...props} />
              </Can>
            ),
          },
          {
            path: '/create-clearance',
            label: local.createClearance,
            render: (props) => (
              <Can I="newClearance" a="application">
                <CreateClearance {...props} />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/tools',
        label: local.tools,
        render: (props) => (
          <Can I="documentTypes" a="config">
            <EncodingFiles {...props} />{' '}
          </Can>
        ),
        routes: [
          {
            path: '/encoding-files',
            label: local.encodingFiles,
            render: (props) => (
              <Can I="documentTypes" a="config">
                <EncodingFiles {...props} />{' '}
              </Can>
            ),
            routes: [
              {
                path: '/create-encoding-files',
                label: local.createEncodingFiles,
                render: (props) => (
                  <Can I="documentTypes" a="config">
                    <DocumentTypeCreation {...props} edit={false} />{' '}
                  </Can>
                ),
              },
              {
                path: '/edit-encoding-files',
                label: local.createEncodingFiles,
                render: (props) => (
                  <Can I="documentTypes" a="config">
                    <DocumentTypeCreation {...props} edit />{' '}
                  </Can>
                ),
              },
            ],
          },
          {
            path: '/geo-areas',
            label: local.branchAreas,
            render: () => (
              <Can I="geoArea" a="config">
                <GeoAreas />
              </Can>
            ),
          },
          {
            path: '/principalRange',
            label: local.principalRange,
            render: (props) => (
              <Can I="createMaxPrincipal" a="config">
                <PrincipleThreshold {...props} />{' '}
              </Can>
            ),
          },
        ],
      },
      {
        path: '/track-loan-applications',
        label: local.loanApplications,
        render: () => (
          <Can I="getLoanApplication" a="application">
            <TrackLoanApplications />
          </Can>
        ),
        routes: [
          {
            path: '/new-loan-application',
            label: local.createLoanApplication,
            render: (props) => (
              <LoanApplicationCreation {...props} edit={false} />
            ),
          },
          {
            path: '/edit-loan-application',
            label: local.editLoan,
            render: (props) => <LoanApplicationCreation {...props} edit />,
          },
          {
            path: '/create-loan',
            label: local.createLoan,
            render: (props) => <LoanCreation {...props} edit={false} />,
          },
          {
            path: '/loan-profile',
            label: local.loanDetails,
            render: (props) => <LoanProfile {...props} />,
          },
          {
            path: '/remove-member',
            label: local.memberSeperation,
            render: (props) => (
              <Can I="splitFromGroup" a="application">
                <GroupMemberSeperation {...props} />
              </Can>
            ),
          },
          {
            path: '/loan-status-change',
            label: local.loanStatusChange,
            render: (props) => <LoanStatusChange {...props} />,
          },
          {
            path: '/loan-roll-back',
            label: local.previousActions,
            render: (props) => <LoanRollBack {...props} />,
          },
          {
            path: '/bulk-creation',
            label: local.bulkApplicationCreation,
            render: (props) => (
              <Can I="createLoan" a="application">
                <BulkApplicationCreation {...props} />
              </Can>
            ),
          },
          {
            path: '/bulk-approvals',
            label: local.bulkLoanApplicationsApproval,
            render: () => (
              <Can I="approveLoanApplication" a="application">
                {' '}
                <BulkApplicationApproval />
              </Can>
            ),
          },
          {
            path: '/bulk-reviews',
            label: local.bulkLoanApplicationReviews,
            render: () => <BulkApplicationReview />,
          },
        ],
      },
      {
        path: '/manage-loan-details',
        label: local.manageLoanDetails,
        render: () => (
          <Can I="loanUsage" a="config">
            <LoanUses />
          </Can>
        ),
        routes: [
          {
            path: '/loan-uses',
            label: local.loanUses,
            render: () => (
              <Can I="loanUsage" a="config">
                <LoanUses />
              </Can>
            ),
          },
          {
            path: '/business-activities',
            label: local.businessActivities,
            render: () => (
              <Can I="viewBusinessSectorConfig" a="config">
                <BusinessActivities />
              </Can>
            ),
          },
          {
            path: '/business-specialities',
            label: local.businessSpecialities,
            render: () => (
              <Can I="viewBusinessSectorConfig" a="config">
                <BusinessSpecialities />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/manage-loans',
        label: local.loans,
        render: (props) => (
          <Can I="getLoanProduct" a="product">
            <LoanProducts {...props} />
          </Can>
        ),
        routes: [
          {
            path: '/loan-products',
            label: local.loanProducts,
            render: (props) => (
              <Can I="getLoanProduct" a="product">
                <LoanProducts {...props} />
              </Can>
            ),
            routes: [
              {
                path: '/new-loan-product',
                label: local.createLoanProduct,
                render: (props) => (
                  <Can I="createLoanProduct" a="product">
                    <LoanProductCreation {...props} />
                  </Can>
                ),
              },
              {
                path: '/edit-loan-product',
                label: local.editLoanProduct,
                render: (props) => (
                  <Can I="updateLoanProduct" a="product">
                    <LoanProductCreation {...props} edit />
                  </Can>
                ),
              },
              {
                path: '/view-product',
                label: local.productName,
                render: (props) => (
                  <Can I="getLoanProduct" a="product">
                    <ViewProduct {...props} />
                  </Can>
                ),
              },
            ],
          },
          {
            path: '/calculation-formulas',
            label: local.calculationFormulas,
            render: (props) => (
              <Can I="getCalculationFormula" a="product">
                <FormulaList {...props} />
              </Can>
            ),
            routes: [
              {
                path: '/new-formula',
                label: local.createCalculationMethod,
                render: (props) => (
                  <Can I="createCalculationFormula" a="product">
                    <FormulaCreation {...props} />
                  </Can>
                ),
              },
              {
                path: '/view-formula',
                label: local.calculationFormulaId,
                render: (props) => (
                  <Can I="getCalculationFormula" a="product">
                    <ViewFormula {...props} />
                  </Can>
                ),
              },
            ],
          },
          {
            path: '/test-formula',
            label: local.testCalculationMethod,
            render: (props) => (
              <Can I="testCalculate" a="product">
                <FormulaTest {...props} />
              </Can>
            ),
          },
          {
            path: '/assign-products-branches',
            label: local.assignProductToBranch,
            render: (props) => (
              <Can I="assignProductToBranch" a="product">
                {' '}
                <AssignProductsToBranches {...props} />{' '}
              </Can>
            ),
          },
        ],
      },
      {
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
                <RolesList {...props} withHeader />{' '}
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
                {' '}
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
                {' '}
                <BranchesList {...props} withHeader />{' '}
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
                    <BranchDetails {...props} />{' '}
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
            ],
          },
        ],
      },
      // {
      //   path: "/manage-finances",
      //   label: local.manageFinances,
      //   render: (props) => <Can I='createMaxPrincipal' a='config'><PrincipleThreshold {...props} /></Can>,
      //   routes: [

      //   ]
      // }
      // ,
      {
        path: '/loans',
        label: local.issuedLoans,
        render: (props) => <LoanList {...props} />,
        routes: [
          {
            path: '/loan-profile',
            label: local.loanDetails,
            render: (props) => <LoanProfile {...props} />,
          },
          {
            path: '/source-of-fund',
            label: local.changeSourceOfFund,
            render: (props) => (
              <Can I="cibScreen" a="report">
                <SourceOfFund {...props} />
              </Can>
            ),
          },
          {
            path: '/cib',
            label: local.cib,
            render: () => (
              <Can I="cibScreen" a="report">
                <CIB />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/logs',
        label: local.logs,
        render: (props) => (
          <Can I="viewActionLogs" a="user">
            <ActionLogs {...props} />
          </Can>
        ),
      },
      {
        path: '/reports',
        label: local.reports,
        render: () => <ReportsHome />,
      },
      {
        path: '/halan-integration',
        label: local.halan,
        render: (props) => <Leads {...props} />,
        routes: [
          {
            path: '/leads',
            label: local.applicantsLeads,
            render: (props) => <Leads {...props} />,
            routes: [
              {
                path: '/view-lead',
                label: local.customersDetails,
                render: (props) => <LeadProfile {...props} />,
              },
              {
                path: '/edit-lead',
                label: local.editCustomer,
                render: (props) => <EditLead {...props} />,
              },
            ],
          },
          {
            path: '/exchange',
            label: local.assignOrChangeLoanOfficer,
            render: (props) => <AssignLoanOfficer {...props} />,
          },
        ],
      },
      {
        path: '/clearances',
        label: local.clearances,
        render: (props) => (
          <Can I="getClearance" a="application">
            {' '}
            <ClearancesList {...props} />
          </Can>
        ),
        routes: [
          {
            path: '/edit-clearance',
            label: local.editClearance,
            render: (props) => (
              <Can I="editClearance" a="application">
                <CreateClearance {...props} edit />
              </Can>
            ),
          },
          {
            path: '/review-clearance',
            label: local.reviewClearance,
            render: (props) => (
              <Can I="reviewClearance" a="application">
                <CreateClearance {...props} review />
              </Can>
            ),
          },
          {
            path: '/clearance-profile',
            label: local.clearanceDetails,
            render: (props) => (
              <Can I="getClearance" a="application">
                <ClearanceProfile {...props} />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/supervisions-levels',
        label: local.levelsOfSupervision,
        render: (props) => (
          <Can I="getOfficersGroups" a="branch">
            <SupervisionGroupsList {...props} />{' '}
          </Can>
        ),
      },
      {
        path: '/financial-closing',
        label: local.manageFinancialTransaction,
        render: (props) => (
          <Can I="getFinancialBlocking" a="application">
            <FinancialBlocking {...props} withHeader />{' '}
          </Can>
        ),
        routes: [
          {
            path: '/lts-closing',
            label: local.ltsClosing,
            render: (props) => (
              <Can I="financialClosing" a="application">
                <FinancialClosing {...props} withHeader />
              </Can>
            ),
          },
          {
            path: '/lts-blocking',
            label: local.financialBlocking,
            render: (props) => (
              <Can I="getFinancialBlocking" a="application">
                <FinancialBlocking {...props} withHeader />{' '}
              </Can>
            ),
          },
          {
            path: '/lts-review-oracle',
            label: local.oracleReports,
            render: (props) => (
              <Can I="summarizeTransactions" a="oracleIntegration">
                <FinancialReviewing {...props} withHeader />{' '}
              </Can>
            ),
          },
        ],
      },
      {
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
        ],
      },
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)

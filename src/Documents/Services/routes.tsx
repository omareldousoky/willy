/* eslint-disable react/display-name */
import React from 'react'
import CustomersList from '../Components/Customers/customersList'
import DocumentsUpload from '../Components/Customers/documentsUpload'
import TrackLoanApplications from '../Components/TrackLoanApplications/trackLoanApplications'
import LoanList from '../Components/LoanList/loanList'
import UploadDocuments from '../Components/LoanList/uploadDocuments'
import EncodingFiles from '../Components/Tools/encodingFiles'
import local from '../../Shared/Assets/ar.json'
import { generateAppRoutes } from '../../Shared/Services/utils'
import { Landing } from '../../Shared/Components/Landing'

const appRoutes = [
  {
    path: '/',
    label: local.tasaheel,
    render: () => <Landing appName="LTS Documents" />,
    routes: [
      {
        path: '/customers',
        label: local.customers,
        render: (props) => <CustomersList {...props} />,
      },
      {
        path: '/edit-customer-document',
        label: local.customers,
        render: (props) => <DocumentsUpload {...props} />,
      },
      {
        path: '/encoding-files',
        label: local.encodingFiles,
        render: () => <EncodingFiles />,
      },
      {
        path: '/track-loan-applications',
        label: local.loanApplications,
        render: () => <TrackLoanApplications />,
      },

      {
        path: '/loans',
        label: local.issuedLoans,
        render: (props) => <LoanList {...props} />,
      },
      {
        path: '/edit-loan-profile',
        label: local.editLoan,
        render: (props) => <UploadDocuments {...props} />,
      },
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)

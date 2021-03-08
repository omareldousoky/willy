/* eslint-disable react/display-name */
import React from 'react'
import NavBar from '../../Shared/Components/NavBar/navBar'
import CustomersList from '../Components/Cusomters/customersList'
import DocumentsUpload from '../Components/Cusomters/documentsUpload'
import TrackLoanApplications from '../Components/TrackLoanApplications/trackLoanApplications'
import LoanList from '../Components/LoanList/loanList'
import UploadDocuments from '../Components/LoanList/uploadDocuments'
import EncodingFiles from '../Components/Tools/encodingFiles'
import Landing from '../Components/Landing/landing'
import local from '../../Shared/Assets/ar.json'
import { generateAppRoutes } from '../../Shared/Services/utils'

const appRoutes = [
  {
    path: '/',
    label: local.mohassel,
    component: Landing,
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
        render: (props) => <TrackLoanApplications />,
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

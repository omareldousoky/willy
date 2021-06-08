import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { MyDocument } from './document'
import { ReviewedApplicationsDocument } from './reviewedExport'

export const DownloadPdf = (props: any) => {
  return (
    <PDFDownloadLink
      document={<MyDocument pass={props.data} />}
      fileName={`${props.data.formulaName}-TestExport.pdf`}
      style={{
        textDecoration: 'none',
        padding: '10px',
        color: '#4a4a4a',
        backgroundColor: '#f2f2f2',
        border: '1px solid #4a4a4a',
      }}
    >
      {({ loading }) => (loading ? 'Loading document...' : 'Download Pdf')}
    </PDFDownloadLink>
  )
}
export const DownloadReviewedPdf = (props: any) => {
  return (
    <PDFDownloadLink
      document={<ReviewedApplicationsDocument pass={props.data} />}
      fileName="ReviewedApplicationExport.pdf"
      style={{
        textDecoration: 'none',
        padding: '10px',
        color: '#4a4a4a',
        backgroundColor: '#f2f2f2',
        border: '1px solid #4a4a4a',
      }}
    >
      {({ loading }) =>
        loading ? 'Loading document...' : 'Download Reviewed Applications Pdf'
      }
    </PDFDownloadLink>
  )
}

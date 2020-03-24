import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { MyDocument } from './document'
import { PDFDownloadLink } from "@react-pdf/renderer";

export const DownloadPdf = (props: any) => {
    return (
        <PDFDownloadLink
          document={<MyDocument pass={props.data}/>}
          fileName={`${props.data.formulaName}-TestExport.pdf`}
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a"
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
    )
} 
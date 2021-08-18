import React, { FunctionComponent, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'
import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../Shared/Components'
import { Loader } from '../../../Shared/Components/Loader'
import { errorResponseHandler } from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { missingKey } from '../../../Shared/localUtils'
import { remainingLoan } from '../../Services/APIs/Loan/remainingLoan'
import { getCustomerDetails, guaranteed } from '../../Services/APIs/Reports'
import { getLoanDetails } from '../../Services/APIs/Reports/loanDetails'
import { PdfPortal } from '../../../Shared/Components/Common/PdfPortal'
import ClientGuaranteedLoans from '../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans'
import { CustomerStatusDetails } from '../pdfTemplates/customerStatusDetails'
import { LoanApplicationDetails } from '../pdfTemplates/loanApplicationDetails'

const PDF_LIST = [
  {
    key: 'guaranteed',
    local: local.ClientGuaranteedLoans,
  },
  {
    key: 'customerDetails',
    local: 'حالة العميل التفصيلية',
  },
  {
    key: 'loanDetails',
    local: 'تفاصيل طلب القرض',
  },
]

interface CustomerReportsTabProps {
  customerKey?: string
}

type PdfKey = 'customerDetails' | 'guaranteed' | 'loanDetails'

export const CustomerReportsTab: FunctionComponent<CustomerReportsTabProps> = ({
  customerKey,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [printPdfKey, setPrintPdfKey] = useState<PdfKey>()
  const [pdfData, setPdfData] = useState()

  // TODO: Redesign with generics
  const apiHandler = (res: any, successHandler?: () => void) => {
    if (res.status === 'success') {
      if (!res.body) {
        setIsLoading(false)
        Swal.fire('error', local.noResults)
        setPrintPdfKey(undefined)
      } else {
        if (successHandler) successHandler()
        else setPdfData(res.body)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
      errorResponseHandler(res.error.error)
      setPrintPdfKey(undefined)
    }
  }

  const getCustomerDetailsReport = async (customerKeyValue: string) => {
    const customerDetailsResponse = await getCustomerDetails(customerKeyValue)
    const successHandler = async () => {
      const remainingTotalResponse = await remainingLoan(
        customerDetailsResponse.body.customerID
      )
      if (remainingTotalResponse.status === 'success') {
        setPdfData({
          ...customerDetailsResponse.body,
          ...remainingTotalResponse.body,
        })
      } else errorResponseHandler(remainingTotalResponse.error.error)
    }
    apiHandler(customerDetailsResponse, successHandler)
  }

  const getGuaranteedLoansReport = async (customerKeyValue: string) => {
    const res = await guaranteed(customerKeyValue)
    apiHandler(res)
  }

  const getLoanDetailsReport = async (customerKeyValue: string) => {
    const res = await getLoanDetails(customerKeyValue)
    apiHandler(res)
  }

  useEffect(() => {
    if (!printPdfKey) return

    if (!customerKey) {
      Swal.fire('error', missingKey('customerCode'))
      return
    }
    setIsLoading(true)

    switch (printPdfKey) {
      case 'customerDetails':
        getCustomerDetailsReport(customerKey)
        break
      case 'guaranteed':
        getGuaranteedLoansReport(customerKey)
        break
      case 'loanDetails':
        getLoanDetailsReport(customerKey)
        break
      default:
        break
    }
  }, [printPdfKey, customerKey])

  useEffect(() => {
    if (pdfData && printPdfKey) {
      window.print()
      setPrintPdfKey(undefined)
    }
  }, [pdfData])

  const downloadClickHandler = (key: PdfKey) => {
    setPrintPdfKey(key)
  }

  return (
    <>
      <Card>
        <Loader type="fullscreen" open={isLoading} />
        <Card.Body className="p-0">
          <div className="custom-card-header">
            <div className="d-flex align-items-center">
              <Card.Title className="mb-0">{local.reportsProgram}</Card.Title>
            </div>
          </div>
          {PDF_LIST.map((pdf, index) => {
            return (
              <Can I={pdf.key} a="report" key={pdf.key}>
                <Card key={pdf.key}>
                  <Card.Body>
                    <div className="d-flex justify-content-between font-weight-bold align-items-center">
                      <div className="d-flex">
                        <span className="mr-5 text-secondary">
                          #{index + 1}
                        </span>
                        <span>{pdf.local}</span>
                      </div>
                      <Button
                        variant="default"
                        onClick={() => downloadClickHandler(pdf.key as PdfKey)}
                      >
                        <LtsIcon name="download" size="35px" color="#7dc356" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Can>
            )
          })}
        </Card.Body>
      </Card>
      {printPdfKey === 'guaranteed' && pdfData && (
        <PdfPortal component={<ClientGuaranteedLoans data={pdfData} />} />
      )}
      {printPdfKey === 'customerDetails' && pdfData && (
        <PdfPortal
          component={
            <CustomerStatusDetails data={pdfData} customerKey={customerKey} />
          }
        />
      )}
      {printPdfKey === 'loanDetails' && pdfData && (
        <PdfPortal component={<LoanApplicationDetails data={pdfData} />} />
      )}
    </>
  )
}

import React, { FunctionComponent, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'
import Swal from 'sweetalert2'
import * as local from '../../Assets/ar.json'
import { LtsIcon } from '../LtsIcon'
import { Loader } from '../Loader'
import { downloadFile, errorResponseHandler } from '../../Services/utils'
import Can from '../../config/Can'
import { missingKey } from '../../localUtils'
import { remainingLoan } from '../../Services/APIs/Loan/remainingLoan'
import {
  getCustomerDetails,
  guaranteed,
  getLoanDetails,
  postCustomerGuaranteedExcel,
  getCustomerGuaranteedExcel,
} from '../../Services/APIs/Reports/Financial'

import { PdfPortal } from '../Common/PdfPortal'
import ClientGuaranteedLoans from '../pdfTemplates/Financial/ClientGuaranteedLoans/ClientGuaranteedLoans'
import { CustomerStatusDetails } from '../pdfTemplates/Financial/customerStatusDetails'
import { LoanApplicationDetails } from '../pdfTemplates/Financial/loanApplicationDetails'

interface CustomerReportsTabProps {
  customerKey?: string
  customerId?: string
  isCF?: boolean
}

type PdfKey = 'customerDetails' | 'guaranteed' | 'loanDetails'
type ExcelKey = 'getGuarantors'

export const CustomerReportsTab: FunctionComponent<CustomerReportsTabProps> = ({
  customerKey,
  customerId,
  isCF,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [printPdfKey, setPrintPdfKey] = useState<PdfKey>()
  const [pdfData, setPdfData] = useState()
  const PDF_LIST = [
    {
      key: 'guaranteed',
      local: local.ClientGuaranteedLoans,
      hide: isCF,
    },
    {
      key: 'customerDetails',
      local: 'حالة العميل التفصيلية',
      hide: isCF,
    },
    {
      key: 'loanDetails',
      local: 'تفاصيل طلب القرض',
      hide: isCF,
    },
    {
      key: 'getGuarantors',
      serviceKey: 'report-2',
      local: local.customerGuaranteed,
      hide: false,
    },
  ]
  // TODO: Redesign with generics
  const apiHandler = (res: any, successHandler?: () => void) => {
    if (res.status === 'success') {
      if (!res.body) {
        setIsLoading(false)
        Swal.fire({
          title: local.errorTitle,
          text: local.noResults,
          confirmButtonText: local.confirmationText,
          icon: 'error',
        })
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
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: missingKey('customerCode'),
        icon: 'error',
      })
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

  const getExcelPoll = async (func, id, pollStart) => {
    const pollInstant = new Date().valueOf()
    if (pollInstant - pollStart < 300000) {
      const file = await func(id)
      if (file.status === 'success') {
        if (['created', 'failed'].includes(file.body.status)) {
          if (file.body.status === 'created')
            downloadFile(file.body.presignedUrl)
          if (file.body.status === 'failed')
            Swal.fire({
              title: local.errorTitle,
              text: local.failed,
              icon: 'error',
              confirmButtonText: local.confirmationText,
            })
          setIsLoading(false)
        } else {
          setTimeout(() => getExcelPoll(func, id, pollStart), 5000)
        }
      } else {
        setIsLoading(false)
        console.log(file)
      }
    } else {
      setIsLoading(false)
      Swal.fire({
        title: local.errorTitle,
        text: local.timeOut,
        confirmButtonText: local.confirmationText,
        icon: 'error',
      })
    }
  }
  const getExcelFile = async (func, pollFunc) => {
    setIsLoading(true)
    const obj = {
      guarantorId: customerId,
    }
    const res = await func(obj)
    if (res.status === 'success') {
      if (!res.body) {
        setIsLoading(false)
        Swal.fire({
          title: local.errorTitle,
          text: local.noResults,
          confirmButtonText: local.confirmationText,
          icon: 'error',
        })
      } else {
        setIsLoading(true)
        const pollStart = new Date().valueOf()
        getExcelPoll(pollFunc, res.body.fileId, pollStart)
      }
    } else {
      setIsLoading(false)
      console.log(res)
    }
  }
  const downloadClickHandler = (key: PdfKey | ExcelKey) => {
    if (key === 'getGuarantors') {
      getExcelFile(postCustomerGuaranteedExcel, getCustomerGuaranteedExcel)
    } else {
      setPrintPdfKey(key as PdfKey)
    }
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
              !pdf.hide && (
                <Can I={pdf.key} a={pdf.serviceKey ?? 'report'} key={pdf.key}>
                  <Card key={pdf.key}>
                    <Card.Body>
                      <div className="d-flex justify-content-between font-weight-bold align-items-center">
                        <div className="d-flex">
                          <span className="mr-5 text-secondary">
                            {isCF ? `#1` : `#${index + 1}`}
                          </span>
                          <span>{pdf.local}</span>
                        </div>
                        <Button
                          variant="default"
                          onClick={() =>
                            downloadClickHandler(pdf.key as PdfKey | ExcelKey)
                          }
                        >
                          <LtsIcon
                            name="download"
                            size="35px"
                            color="#7dc356"
                          />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Can>
              )
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

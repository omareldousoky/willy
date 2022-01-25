import React, { useCallback, useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import Can from '../../../config/Can'
import ability from '../../../config/ability'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  downloadFile,
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'

import HeaderWithCards from '../../../../Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from '../../../../Shared/Components/Loader'
import { RisksReport } from './RisksReport'
import { DebtsAgingReport } from './DebtsAgingReport'
import MonthlyReport from '../../pdfTemplates/monthlyReport/monthlyReport'
import QuarterlyReport from '../../pdfTemplates/quarterlyReport/quarterlyReport'

import {
  getAllLoanAge,
  getAllTasaheelRisks,
  getAllMonthlyReport,
  getAllQuarterlyReport,
  generateTasaheelRisksReport,
  generateLoanAgeReport,
  generateMonthlyReport,
  generateQuarterlyReport,
  getTasaheelRisksReport,
  getLoanAgeReport,
  getMonthlyReport,
  getQuarterlyReport,
  generateMonthlyAnalysisReport,
} from '../../../Services/APIs/Reports/tasaheelRisksReports'

import { Report, ReportDetails } from './types'
import { Tab } from '../../../../Shared/Components/HeaderWithCards/cardNavbar'
import { LtsIcon } from '../../../../Shared/Components'
import {
  MonthReport,
  QuarterReport,
} from '../../../../Shared/Services/interfaces'
import MonthlyAnalysisReport from '../../pdfTemplates/MonthlyAnalysisReport'
import { PdfPortal } from '../../../../Shared/Components/Common/PdfPortal'
import ReportsModal from '../../../../Shared/Components/ReportsModal/reportsModal'

export const TasaheelReports = () => {
  const reportsRequests = {
    tasaheelRisks: {
      getAll: getAllTasaheelRisks,
      requestReport: generateTasaheelRisksReport,
      getReportDetails: getTasaheelRisksReport,
      printComponent: RisksReport,
    },
    loanAge: {
      getAll: getAllLoanAge,
      requestReport: generateLoanAgeReport,
      getReportDetails: getLoanAgeReport,
      printComponent: DebtsAgingReport,
    },
    monthlyReport: {
      getAll: getAllMonthlyReport,
      requestReport: generateMonthlyReport,
      getReportDetails: getMonthlyReport,
      printComponent: MonthlyReport,
    },
    quarterlyReport: {
      getAll: getAllQuarterlyReport,
      requestReport: generateQuarterlyReport,
      getReportDetails: getQuarterlyReport,
      printComponent: QuarterlyReport,
    },
    monthlyAnalysis: {
      requestReport: generateMonthlyAnalysisReport,
      printComponent: MonthlyAnalysisReport,
    },
  }
  const [tabs, setTabs] = useState<any[]>([])
  const [activeTabKey, setActiveTabKey] = useState<string>(
    tabs.length > 0 ? tabs[0].stringKey : ''
  )
  useEffect(() => {
    const allowedTabs: Tab[] = []
    ability.can('tasaheelRisks', 'report') &&
      allowedTabs.push({
        header: local.tasaheelRisks,
        stringKey: 'tasaheelRisks',
        permission: 'tasaheelRisks',
        permissionKey: 'report',
      })

    ability.can('debtsAging', 'report') &&
      allowedTabs.push({
        header: local.loanAge,
        stringKey: 'loanAge',
        permission: 'debtsAging',
        permissionKey: 'report',
      })

    ability.can('monthlyReport', 'report') &&
      allowedTabs.push({
        header: local.monthlyReport,
        stringKey: 'monthlyReport',
        permission: 'monthlyReport',
        permissionKey: 'report',
      })

    ability.can('quarterlyReport', 'report') &&
      allowedTabs.push({
        header: local.quarterReport,
        stringKey: 'quarterlyReport',
        permission: 'quarterlyReport',
        permissionKey: 'report',
      })

    ability.can('monthlyAnalysisReport', 'report') &&
      allowedTabs.push({
        header: local.monthlyAnalysisReport,
        stringKey: 'monthlyAnalysis',
        permission: 'monthlyAnalysisReport',
        permissionKey: 'report',
      })

    setTabs(allowedTabs)
    setActiveTabKey(allowedTabs[0]?.stringKey || '')
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [print, setPrint] = useState<boolean>(false)

  const [reports, setReports] = useState<Report[]>([])
  const [reportDetails, setReportDetails] = useState<
    ReportDetails | MonthReport | QuarterReport
  >()

  const activeTabIndex = useCallback(() => {
    const calculatedActiveTabIndex = tabs.findIndex(
      ({ stringKey }) => stringKey === activeTabKey
    )
    return calculatedActiveTabIndex > -1 ? calculatedActiveTabIndex : 0
  }, [activeTabKey, tabs])

  const getAllReports = async () => {
    setIsLoading(true)
    const res = await reportsRequests[activeTabKey].getAll()

    if (res.status === 'success') {
      setIsLoading(false)
      setReports(
        res.body.files ||
          res.body.reportFiles ||
          res.body.monthlyReportFiles ||
          res.body.quarterlyReportFiles
      )
    } else {
      setIsLoading(false)
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.searchError,
        icon: 'error',
      })
    }
  }
  const formatValues = (values) => {
    if (!values) return ''
    const currentActiveTabKey = tabs[activeTabIndex()].stringKey

    if (currentActiveTabKey === 'quarterlyReport') {
      return {
        quarter: `${values.year}-${values.quarterNumber}`,
      }
    }
    return {
      date: `${values.date}${
        currentActiveTabKey === 'monthlyAnalysis' ? '' : '-01'
      }`,
    }
  }

  useEffect(() => {
    tabs.length > 0 &&
      activeTabKey &&
      reportsRequests[activeTabKey].getAll &&
      getAllReports()
    setReports([])
    setPrint(false)
  }, [tabs, activeTabKey])

  const requestReport = async (values) => {
    setIsLoading(true)
    const formattedValues = formatValues(values)
    const res = await reportsRequests[activeTabKey].requestReport(
      formattedValues
    )

    if (res.status === 'success') {
      setModalIsOpen(false)
      setIsLoading(false)

      if (tabs[activeTabIndex()].stringKey === 'monthlyAnalysis') {
        setReportDetails(res.body)
        setPrint(true)
        window.print()

        return
      }

      Swal.fire({
        title: local.success,
        text: local.fileQueuedSuccess,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
      getAllReports()
    } else {
      setIsLoading(false)
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.fileQueuedError,
        icon: 'error',
      })
    }
  }
  const downloadGeneratedReport = async (id: string) => {
    setIsLoading(true)
    const res = await reportsRequests[activeTabKey].getReportDetails(id)

    if (res.status === 'success') {
      if (
        tabs[activeTabIndex()].stringKey === 'monthlyReport' ||
        tabs[activeTabIndex()].stringKey === 'quarterlyReport'
      ) {
        downloadFile(res.body.url)
      } else {
        setReportDetails(res.body)
        setPrint(true)
        window.print()
      }

      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.searchError,
        icon: 'error',
      })
    }
  }

  return (
    <>
      <div className="my-4 mx-5 print-none">
        <HeaderWithCards
          header=""
          array={tabs}
          active={activeTabIndex()}
          selectTab={(activeTabStringKey: string) => {
            setPrint(false)
            setActiveTabKey(activeTabStringKey)
          }}
        />
        {modalIsOpen && (
          <ReportsModal
            pdf={{
              key: activeTabKey,
              local: tabs[activeTabIndex()].header,
              inputs:
                tabs[activeTabIndex()].stringKey === 'quarterlyReport'
                  ? ['year', 'quarterNumber']
                  : ['month'],
              permission: tabs[activeTabIndex()].permission || '',
            }}
            show={modalIsOpen}
            hideModal={() => setModalIsOpen(false)}
            submit={(values) => requestReport(values)}
            submitButtonText={local.requestNewreport}
          />
        )}

        <Card>
          <Loader type="fullscreen" open={isLoading} />
          <Card.Body className="mx-4 mb-2">
            {tabs.length > 0 && (
              <div className="d-flex justify-content-between">
                <Card.Title>{tabs[activeTabIndex()].header}</Card.Title>
                <Can
                  I={tabs[activeTabIndex()].permission || ''}
                  a={tabs[activeTabIndex()].permissionKey}
                >
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      switch (tabs[activeTabIndex()].stringKey) {
                        case 'tasaheelRisks':
                          setModalIsOpen(true)
                          break
                        case 'loanAge':
                          setModalIsOpen(true)
                          break
                        case 'monthlyReport':
                          requestReport('')
                          break
                        case 'quarterlyReport':
                          setModalIsOpen(true)
                          break
                        case 'monthlyAnalysis':
                          setModalIsOpen(true)
                          break
                        default:
                          break
                      }
                    }}
                  >
                    {local.requestNewreport}
                  </Button>
                </Can>
              </div>
            )}
            {reports?.length > 0 ? (
              reports.map((report, index) => (
                <Card key={index} className="mx-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between font-weight-bold">
                      <div className="d-flex">
                        <span className="mr-5 text-secondary">
                          #{index + 1}
                        </span>
                        <span className="mr-5 d-flex flex-start flex-column">
                          <span>{local.loanAppCreationDate}</span>
                          {timeToArabicDate(report.created?.at, true)}
                        </span>
                        <span
                          className={`mr-5  text-${
                            report.status === 'created'
                              ? 'success'
                              : report.status === 'queued'
                              ? 'warning'
                              : 'danger'
                          } `}
                        >
                          {getIscoreReportStatus(report.status)}
                        </span>

                        {report.status === 'created' && (
                          <span className="mr-5 d-flex flex-start flex-column">
                            <span>{local.creationDate}</span>
                            {timeToArabicDate(
                              report.generatedAt || report.fileGeneratedAt,
                              true
                            )}
                          </span>
                        )}
                      </div>
                      {report.status === 'created' && (
                        <>
                          {report.response &&
                          (tabs[activeTabIndex()].stringKey.includes(
                            'monthlyReport'
                          ) ||
                            tabs[activeTabIndex()].stringKey.includes(
                              'quarterlyReport'
                            )) ? (
                            <div className="d-flex ">
                              <Button
                                type="button"
                                variant="default"
                                onClick={async () => {
                                  setIsLoading(true)

                                  await setReportDetails(report.response)
                                  setIsLoading(false)

                                  setPrint(true)
                                  window.print()
                                }}
                                title="download"
                              >
                                <LtsIcon
                                  name="printer"
                                  size="30px"
                                  color="#7dc356"
                                />
                              </Button>
                              <Button
                                type="button"
                                variant="default"
                                onClick={() =>
                                  downloadGeneratedReport(report.key)
                                }
                                title="download-excel"
                              >
                                <LtsIcon
                                  name="download-big-file"
                                  size="30px"
                                  color="#7dc356"
                                />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="default"
                              onClick={() =>
                                downloadGeneratedReport(report._id)
                              }
                              title="download"
                            >
                              <LtsIcon
                                name="download"
                                size="40px"
                                color="#7dc356"
                              />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : reportsRequests[activeTabKey]?.getAll ? (
              <div className="d-flex align-items-center justify-content-center">
                {local.noResults}
              </div>
            ) : (
              <></>
            )}
          </Card.Body>
        </Card>
      </div>
      {activeTabKey &&
        print &&
        reportsRequests[activeTabKey].printComponent && (
          <PdfPortal
            component={reportsRequests[activeTabKey].printComponent(
              reportDetails
            )}
          />
        )}
    </>
  )
}

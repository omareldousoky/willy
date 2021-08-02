import React, { useCallback, useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import {
  getIscoreReportStatus,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import Can from '../../../config/Can'
import ability from '../../../config/ability'
import * as local from '../../../../Shared/Assets/ar.json'

import HeaderWithCards from '../../../../Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from '../../../../Shared/Components/Loader'
import ReportsModal from '../reportsModal'
import { RisksReport } from './RisksReport'
import { DebtsAgingReport } from './DebtsAgingReport'

import {
  getAllLoanAge,
  getAllTasaheelRisks,
  generateTasaheelRisksReport,
  generateLoanAgeReport,
  getTasaheelRisksReport,
  getLoanAgeReport,
} from '../../../Services/APIs/Reports/tasaheelRisksReports'

import { Report, ReportDetails } from './types'
import { Tab } from '../../../../Shared/Components/HeaderWithCards/cardNavbar'
import { LtsIcon } from '../../../../Shared/Components'

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
    setTabs(allowedTabs)
    setActiveTabKey(allowedTabs[0]?.stringKey || '')
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [print, setPrint] = useState<boolean>(false)

  const [reports, setReports] = useState<Report[]>([])
  const [reportDetails, setReportDetails] = useState<ReportDetails>()

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
      setReports(res.body.files)
    } else {
      setIsLoading(false)
      Swal.fire('error', local.searchError, 'error')
    }
  }

  useEffect(() => {
    tabs.length > 0 && activeTabKey && getAllReports()
  }, [tabs, activeTabKey])

  const requestReport = async (values) => {
    setIsLoading(true)
    const res = await reportsRequests[activeTabKey].requestReport({
      date: values.date + '-01',
    })

    if (res.status === 'success') {
      Swal.fire('success', local.fileQueuedSuccess, 'success')
      setModalIsOpen(false)
      setIsLoading(false)
      getAllReports()
    } else {
      setIsLoading(false)
      Swal.fire('error', local.fileQueuedError, 'error')
    }
  }
  const downloadGeneratedReport = async (id: string) => {
    setIsLoading(true)
    const res = await reportsRequests[activeTabKey].getReportDetails(id)

    if (res.status === 'success') {
      setReportDetails(res.body)
      setPrint(true)
      window.print()
      setIsLoading(false)
    } else {
      setIsLoading(false)
      Swal.fire('error', local.searchError, 'error')
    }
  }

  return (
    <>
      <div className="my-4 mx-5 print-none">
        <HeaderWithCards
          header=""
          array={tabs}
          active={activeTabIndex()}
          selectTab={(activeTabStringKey: string) =>
            setActiveTabKey(activeTabStringKey)
          }
        />
        {modalIsOpen && (
          <ReportsModal
            pdf={{
              key: activeTabKey,
              local: tabs[activeTabIndex()].header,
              inputs: ['month'],
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
                    onClick={() => setModalIsOpen(true)}
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
                            {timeToArabicDate(report.generatedAt, true)}
                          </span>
                        )}
                      </div>
                      {report.status === 'created' && (
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => downloadGeneratedReport(report._id)}
                          title="download"
                        >
                          <LtsIcon
                            name="download"
                            size="40px"
                            color="#7dc356"
                          />
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                {local.noResults}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
      {activeTabKey &&
        print &&
        reportsRequests[activeTabKey].printComponent(reportDetails)}
    </>
  )
}

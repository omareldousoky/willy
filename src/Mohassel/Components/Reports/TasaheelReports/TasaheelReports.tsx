import React, { useCallback, useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import Can from '../../../config/Can'
import ability from '../../../config/ability'
import * as local from '../../../../Shared/Assets/ar.json'
import { downloadFile } from '../../../../Shared/Services/utils'

import HeaderWithCards from '../../HeaderWithCards/headerWithCards'
import { Loader } from '../../../../Shared/Components/Loader'
import ReportsModal from '../reportsModal'
import { RisksReport } from './RisksReport'
import { DebtsAgingReport } from './DebtsAgingReport'
import { Tab } from '../../HeaderWithCards/cardNavbar'
import { ReportsList } from '../../../../Shared/Components/ReportsList'

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
} from '../../../Services/APIs/Reports/tasaheelRisksReports'

import { Report, ReportDetails } from './types'

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
    },
    quarterlyReport: {
      getAll: getAllQuarterlyReport,
      requestReport: generateQuarterlyReport,
      getReportDetails: getQuarterlyReport,
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
      setReports(
        res.body.files ||
          res.body.reportFiles ||
          res.body.monthlyReportFiles ||
          res.body.quarterlyReportFiles
      )
    } else {
      setIsLoading(false)
      Swal.fire('error', local.searchError, 'error')
    }
  }
  const formatValues = (values) => {
    if (!values) return ''
    if (tabs[activeTabIndex()].stringKey === 'quarterlyReport') {
      return {
        quarter: `${new Date(values.quarterYear).getFullYear()}-${
          values.quarterNumber
        }`,
      }
    }
    return { date: values.date }
  }

  useEffect(() => {
    tabs.length > 0 && activeTabKey && getAllReports()
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
              inputs:
                tabs[activeTabIndex()].stringKey === 'quarterlyReport'
                  ? ['quarterYear', 'quarterNumber']
                  : ['date'],
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
            <ReportsList
              list={reports}
              onClickDownload={(itemId) => downloadGeneratedReport(itemId)}
            />
          </Card.Body>
        </Card>
      </div>
      {activeTabKey &&
        print &&
        reportsRequests[activeTabKey].printComponent &&
        reportsRequests[activeTabKey].printComponent(reportDetails)}
    </>
  )
}

import React from 'react'
import './activeWalletIndividual.scss'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

interface ActiveWalletIndividualResponse {
  response: {
    branchName: string
    totalLoanCount: number
    totalPrincipal: number
    customersCount: number
    totalCreditInstallmentCount: number
    totalCreditInstallmentAmount: number
    totalLateInstallmentCount: number
    totalLateInstallmentAmount: number
    officers: {
      officerName: string
      customersCount: number
      totalCreditInstallmentAmount: number
      totalCreditInstallmentCount: number
      totalLateInstallmentAmount: number
      totalLateInstallmentCount: number
      totalLoanCount: number
      totalPrincipal: number
      areas: {
        areaName: string
        customersCount: string
        totalCreditInstallmentAmount: number
        totalCreditInstallmentCount: number
        totalLateInstallmentAmount: number
        totalLateInstallmentCount: number
        totalLoanCount: number
        totalPrincipal: number
        data: {
          phoneNumber: string
          homePhoneNumber: string
          workArea: string
          address: string
          activity: string
          creditAmount: number
          creditCount: number
          firstLateDate: string
          latestPaymentDate: string
          lateAmount: number
          lateCount: number
          principal: number
          loanDate: string
          customerName: string
          customerCode: number
          sector: string
        }[]
      }[]
    }[]
  }[]
}
interface Props {
  date: string
  data: ActiveWalletIndividualResponse
  isCF?: boolean
}
const ActiveWalletIndividual = (props: Props) => {
  const { data, isCF } = props
  return (
    <>
      <Orientation size="landscape" />
      <div className="activeWalletIndividual">
        <Header
          title="المحفظة النشطه للمندوبين - فردى"
          showCurrentUser
          showCurrentDate
          cf={isCF}
        />
        {
          data?.response?.map((branch, branchIndex) => {
            return (
              <React.Fragment key={branchIndex}>
                <div className="row-nowrap mt-1 mb-1">
                  <p>الفرع:</p>
                  <p className="box">{branch.branchName || '--'}</p>
                </div>

                {
                  branch?.officers?.map((officer, officerIndex) => {
                    return (
                      <React.Fragment key={officerIndex}>
                        <div className="row-nowrap  mt-1 mb-1">
                          <p>المندوب:</p>
                          <p className="box">{officer.officerName || '--'}</p>
                        </div>
                        {
                          officer?.areas?.map((area, areaIndex) => {
                            return (
                              <React.Fragment key={areaIndex}>
                                <div className="row-nowrap  mt-1 mb-1">
                                  <p>منطقة العمل:</p>
                                  <p className="box">{area.areaName || '--'}</p>
                                </div>
                                <table
                                  className="report-container"
                                  cellPadding="1"
                                  cellSpacing="1"
                                >
                                  <thead>
                                    <tr>
                                      <th colSpan={9} />
                                      <th colSpan={3}>الرصيد</th>
                                      <th colSpan={2} />
                                      <th colSpan={5}>متأخرات</th>
                                      <th colSpan={7}>بيانات العميل</th>
                                    </tr>
                                    <tr>
                                      <th colSpan={5}>العميل</th>
                                      <th colSpan={2}> ت التمويل</th>
                                      <th colSpan={2}>قيمة التمويل</th>
                                      <th>عدد</th>
                                      <th colSpan={2}>مبلغ</th>
                                      <th colSpan={2}> ت أخر سداد</th>
                                      <th>عدد</th>
                                      <th colSpan={2}>مبلغ</th>
                                      <th colSpan={2}>بداية تاخير</th>
                                      <th>نشاط العميل</th>
                                      <th colSpan={3}>عنوان عميل</th>
                                      <th>منطقة العمل</th>
                                      <th colSpan={2}>التليفون</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      area?.data?.map((row, rowIndex) => {
                                        return (
                                          <React.Fragment key={rowIndex}>
                                            <tr>
                                              <td
                                                colSpan={5}
                                              >{`${row.customerCode} - ${row.customerName}`}</td>
                                              <td colSpan={2}>
                                                {row.loanDate || '--'}
                                              </td>
                                              <td colSpan={2}>
                                                {row.principal || 0}
                                              </td>
                                              <td>{row.creditCount || 0}</td>
                                              <td colSpan={2}>
                                                {row.creditAmount || 0}
                                              </td>
                                              <td colSpan={2}>
                                                {row.latestPaymentDate || '--'}
                                              </td>
                                              <td>{row.lateCount || 0}</td>
                                              <td colSpan={2}>
                                                {row.lateAmount || 0}
                                              </td>
                                              <td colSpan={2}>
                                                {row.firstLateDate || '--'}
                                              </td>
                                              <td>{row.activity || '--'}</td>
                                              <td colSpan={3}>
                                                {row.address || '--'}
                                              </td>
                                              <td>{row.workArea || '--'}</td>
                                              <td colSpan={2}>{`${
                                                row.phoneNumber || ''
                                              } - ${
                                                row.homePhoneNumber || ''
                                              }`}</td>
                                            </tr>
                                            <tr>
                                              <th>تعديل:</th>
                                            </tr>
                                          </React.Fragment>
                                        ) // row return
                                      }) // end of data map
                                    }
                                    <tr style={{ margin: '0 10px' }}>
                                      <th
                                        colSpan={100}
                                        className="horizontal-line"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="row-nowrap mt-1 mb-1">
                                  <p>إجمالي المنطقة :</p>
                                  <p className="box">{area.areaName || '--'}</p>
                                </div>
                                <table
                                  className="report-container"
                                  cellPadding="1"
                                  cellSpacing="1"
                                >
                                  <thead>
                                    <tr>
                                      <th colSpan={6}>التمويل القائم</th>
                                      <th colSpan={4}>الرصيد</th>
                                      <th colSpan={4}>المتأخرات</th>
                                    </tr>
                                    <tr>
                                      <th colSpan={2}>عدد التمويلات</th>
                                      <th colSpan={2}>التمويل</th>
                                      <th colSpan={2}>عدد الاعضاء</th>
                                      <th colSpan={2}>عدد الاقساط</th>
                                      <th colSpan={2}>المبلغ</th>
                                      <th colSpan={2}>عدد الاقساط</th>
                                      <th colSpan={2}>المبلغ</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <td colSpan={2}>{area.totalLoanCount}</td>
                                    <td colSpan={2}>{area.totalPrincipal}</td>
                                    <td colSpan={2}>{area.customersCount}</td>
                                    <td colSpan={2}>
                                      {area.totalLateInstallmentCount}
                                    </td>
                                    <td colSpan={2}>
                                      {area.totalLateInstallmentAmount}
                                    </td>
                                    <td colSpan={2}>
                                      {area.totalCreditInstallmentCount}
                                    </td>
                                    <td colSpan={2}>
                                      {area.totalCreditInstallmentAmount}
                                    </td>
                                    <tr style={{ margin: '0 10px' }}>
                                      <th
                                        colSpan={100}
                                        className="horizontal-line"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </React.Fragment>
                            ) // area return
                          }) // end of areas map
                        }
                        <tr style={{ margin: '0 10px' }}>
                          <th colSpan={100} className="horizontal-line" />
                        </tr>
                        <div className="row-nowrap">
                          <p>إجمالي المندوب :</p>
                          <p className="box">{officer.officerName || '--'}</p>
                        </div>
                        <table
                          className="report-container"
                          cellPadding="1"
                          cellSpacing="1"
                        >
                          <thead>
                            <tr>
                              <th colSpan={6}>التمويل القائم</th>
                              <th colSpan={4}>الرصيد</th>
                              <th colSpan={4}>المتأخرات</th>
                            </tr>
                            <tr>
                              <th colSpan={2}>عدد التمويلات</th>
                              <th colSpan={2}>التمويل</th>
                              <th colSpan={2}>عدد الاعضاء</th>
                              <th colSpan={2}>عدد الاقساط</th>
                              <th colSpan={2}>المبلغ</th>
                              <th colSpan={2}>عدد الاقساط</th>
                              <th colSpan={2}>المبلغ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <td colSpan={2}>{officer.totalLoanCount}</td>
                            <td colSpan={2}>{officer.totalPrincipal}</td>
                            <td colSpan={2}>{officer.customersCount}</td>
                            <td colSpan={2}>
                              {officer.totalLateInstallmentCount}
                            </td>
                            <td colSpan={2}>
                              {officer.totalLateInstallmentAmount}
                            </td>
                            <td colSpan={2}>
                              {officer.totalCreditInstallmentCount}
                            </td>
                            <td colSpan={2}>
                              {officer.totalCreditInstallmentAmount}
                            </td>
                            <tr style={{ margin: '0 10px' }}>
                              <th colSpan={100} className="horizontal-line" />
                            </tr>
                          </tbody>
                        </table>
                      </React.Fragment>
                    ) // officer return
                  }) // end of officers map
                }
                <div className="row-nowrap mt-1 mb-1">
                  <p>إجمالي المندوبين</p>
                </div>
                <table
                  className="report-container"
                  cellPadding="1"
                  cellSpacing="1"
                >
                  <thead>
                    <tr>
                      <th colSpan={6}>التمويل القائم</th>
                      <th colSpan={4}>الرصيد</th>
                      <th colSpan={4}>المتأخرات</th>
                    </tr>
                    <tr>
                      <th colSpan={2}>عدد التمويلات</th>
                      <th colSpan={2}>التمويل</th>
                      <th colSpan={2}>عدد الاعضاء</th>
                      <th colSpan={2}>عدد الاقساط</th>
                      <th colSpan={2}>المبلغ</th>
                      <th colSpan={2}>عدد الاقساط</th>
                      <th colSpan={2}>المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td colSpan={2}>{branch.totalLoanCount}</td>
                    <td colSpan={2}>{branch.totalPrincipal}</td>
                    <td colSpan={2}>{branch.customersCount}</td>
                    <td colSpan={2}>{branch.totalLateInstallmentCount}</td>
                    <td colSpan={2}>{branch.totalLateInstallmentAmount}</td>
                    <td colSpan={2}>{branch.totalCreditInstallmentCount}</td>
                    <td colSpan={2}>{branch.totalCreditInstallmentAmount}</td>
                    <tr style={{ margin: '0 10px' }}>
                      <th colSpan={100} className="horizontal-line" />
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ) // branch return
          }) // end of response map
        }
      </div>
    </>
  )
}

export default ActiveWalletIndividual

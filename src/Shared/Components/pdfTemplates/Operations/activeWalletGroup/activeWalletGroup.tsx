import React from 'react'
import './activeWalletGroup.scss'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

interface ActiveWalletGroupResponse {
  response: {
    totalGroups: number
    totalPrincipal: number
    membersCount: number
    creditLoanCount: number
    creditLoanPrincipal: number
    latePaymentsCount: number
    latePaymentsAmount: number
    branchName: string
    officers: {
      loanOfficerName: string
      totalGroups: number
      totalPrincipal: number
      membersCount: number
      creditLoanCount: number
      creditLoanPrincipal: number
      latePaymentsCount: number
      latePaymentsAmount: number
      areas: {
        areaName: string
        totalGroups: number
        totalPrincipal: number
        membersCount: number
        creditLoanCount: number
        creditLoanPrincipal: number
        latePaymentsCount: number
        latePaymentsAmount: number
        groups: {
          leaderName: string
          issueDate: string
          installmentsCount: number
          principal: number
          creditCount: number
          creditAmount: number
          lateCount: number
          lateAmount: number
          lateDate: string
          latestPaymentDate: string
          members: {
            customerCode: string
            customerName: string
            businessActivity: string
            principal: number
            address: string
            type: string
            phoneNumber: string
            homePhoneNumber: string
            businessSector: string
          }[]
        }[]
      }[]
    }[]
  }[]
}

interface Props {
  date: string
  data: ActiveWalletGroupResponse
  isCF?: boolean
}
const ActiveWalletGroup = (props: Props) => {
  const { data, isCF } = props
  return (
    <>
      <Orientation size="landscape" />
      <div className="activeWalletGroup">
        <Header
          title="المحفظة النشطه للمندوبين - جماعى"
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

                <table
                  className="report-container"
                  cellPadding="2"
                  cellSpacing="2"
                >
                  {
                    branch.officers.map((officer, officerIndex) => {
                      return (
                        <React.Fragment key={officerIndex}>
                          {
                            officer.areas.map((area, areaIndex) => {
                              return (
                                <React.Fragment key={areaIndex}>
                                  <div className="row-nowrap mt-1 mb-1">
                                    <p>إجمالي المنطقة</p>
                                  </div>
                                  {
                                    area.groups.map((group, groupIndex) => {
                                      return (
                                        <React.Fragment key={groupIndex}>
                                          <table
                                            className="report-container"
                                            cellPadding="2"
                                            cellSpacing="2"
                                          >
                                            <thead>
                                              <tr style={{ margin: '0 10px' }}>
                                                <th colSpan={3}>المجموعة</th>
                                                <th colSpan={2}>ت التمويل</th>
                                                <th colSpan={3}>
                                                  قيمة التمويل
                                                </th>
                                                <th colSpan={3}>الرصيد</th>
                                                <th colSpan={2}>ت أخر سداد</th>
                                                <th colSpan={5}>متأخرات</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr style={{ margin: '0 10px' }}>
                                                <td
                                                  className="group-data"
                                                  colSpan={3}
                                                >
                                                  {group.leaderName || '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.issueDate || '--'}
                                                </td>
                                                <td className="group-data">
                                                  {group.installmentsCount ||
                                                    '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.principal || '--'}
                                                </td>
                                                <td className="group-data">
                                                  {group.creditCount || '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.creditAmount || '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.latestPaymentDate ||
                                                    '--'}
                                                </td>
                                                <td className="group-data">
                                                  {group.lateCount || '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.lateAmount || '--'}
                                                </td>
                                                <td
                                                  className="group-data"
                                                  colSpan={2}
                                                >
                                                  {group.lateDate || '--'}
                                                </td>
                                              </tr>
                                            </tbody>
                                            <tr style={{ margin: '0 10px' }}>
                                              <th
                                                colSpan={100}
                                                className="horizontal-line"
                                              />
                                            </tr>
                                          </table>
                                          <table
                                            className="report-container"
                                            cellPadding="2"
                                            cellSpacing="2"
                                          >
                                            <tbody>
                                              {
                                                group.members.map(
                                                  (member, memberIndex) => {
                                                    return (
                                                      <React.Fragment
                                                        key={memberIndex}
                                                      >
                                                        <tr
                                                          style={{
                                                            margin: '0 10px',
                                                          }}
                                                        >
                                                          <td>
                                                            <input
                                                              type="checkbox"
                                                              checked={
                                                                (member.type ===
                                                                  'الرئيس') as boolean
                                                              }
                                                            />
                                                          </td>
                                                          <td colSpan={1}>
                                                            {member?.customerCode ||
                                                              '--'}
                                                          </td>
                                                          <td colSpan={2}>
                                                            {member?.customerName ||
                                                              '--'}
                                                          </td>
                                                          <td colSpan={2}>
                                                            {member?.businessActivity ||
                                                              '--'}
                                                          </td>
                                                          <td colSpan={2}>
                                                            {member?.principal ||
                                                              '--'}
                                                          </td>
                                                          <td colSpan={3}>
                                                            {member?.address ||
                                                              '--'}
                                                          </td>
                                                          <td>
                                                            {member.businessSector ||
                                                              '--'}
                                                          </td>
                                                          <td colSpan={3}>{`${
                                                            member.phoneNumber ||
                                                            ''
                                                          } - ${
                                                            member.homePhoneNumber ||
                                                            ''
                                                          }`}</td>
                                                        </tr>
                                                        <tr
                                                          style={{
                                                            margin: '0 10px',
                                                          }}
                                                        >
                                                          <th>تعديل:</th>
                                                        </tr>
                                                      </React.Fragment>
                                                    )
                                                  }
                                                ) // end of memberMap
                                              }
                                            </tbody>
                                            <tr style={{ margin: '0 10px' }}>
                                              <th
                                                colSpan={100}
                                                className="horizontal-line"
                                              />
                                            </tr>
                                          </table>
                                        </React.Fragment>
                                      ) // group return
                                    }) // end of groups map
                                  }
                                  <table
                                    className="report-container"
                                    cellPadding="2"
                                    cellSpacing="2"
                                  >
                                    <thead>
                                      <tr style={{ margin: '0 10px' }}>
                                        <th colSpan={6}>التمويل القائم</th>
                                        <th colSpan={4}>الرصيد</th>
                                        <th colSpan={4}>المتأخرات</th>
                                      </tr>
                                      <tr style={{ margin: '0 10px' }}>
                                        <th colSpan={2}>عدد المجموعات</th>
                                        <th colSpan={2}>التمويل</th>
                                        <th colSpan={2}>عدد الاعضاء</th>
                                        <th colSpan={2}>عدد الاقساط</th>
                                        <th colSpan={2}>المبلغ</th>
                                        <th colSpan={2}>عدد الاقساط</th>
                                        <th colSpan={2}>المبلغ</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <td colSpan={2}>
                                        {area.totalGroups || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.totalPrincipal || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.membersCount || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.creditLoanCount || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.creditLoanPrincipal || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.latePaymentsCount || '--'}
                                      </td>
                                      <td colSpan={2}>
                                        {area.latePaymentsAmount || '--'}
                                      </td>
                                    </tbody>
                                    <tr style={{ margin: '0 10px' }}>
                                      <th
                                        colSpan={100}
                                        className="horizontal-line"
                                      />
                                    </tr>
                                  </table>
                                </React.Fragment>
                              )
                            }) //  end of areas map
                          }
                          <div className="row-nowrap mt-1 mb-1">
                            <p>إجمالي المندوب</p>
                          </div>
                          <table
                            className="report-container"
                            cellPadding="2"
                            cellSpacing="2"
                          >
                            <thead>
                              <tr style={{ margin: '0 10px' }}>
                                <th colSpan={6}>التمويل القائم</th>
                                <th colSpan={4}>الرصيد</th>
                                <th colSpan={4}>المتأخرات</th>
                              </tr>
                              <tr style={{ margin: '0 10px' }}>
                                <th colSpan={2}>عدد المجموعات</th>
                                <th colSpan={2}>التمويل</th>
                                <th colSpan={2}>عدد الاعضاء</th>
                                <th colSpan={2}>عدد الاقساط</th>
                                <th colSpan={2}>المبلغ</th>
                                <th colSpan={2}>عدد الاقساط</th>
                                <th colSpan={2}>المبلغ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <td colSpan={2}>{officer.totalGroups || '--'}</td>
                              <td colSpan={2}>
                                {officer.totalPrincipal || '--'}
                              </td>
                              <td colSpan={2}>
                                {officer.membersCount || '--'}
                              </td>
                              <td colSpan={2}>
                                {officer.creditLoanCount || '--'}
                              </td>
                              <td colSpan={2}>
                                {officer.creditLoanPrincipal || '--'}
                              </td>
                              <td colSpan={2}>
                                {officer.latePaymentsCount || '--'}
                              </td>
                              <td colSpan={2}>
                                {officer.latePaymentsAmount || '--'}
                              </td>
                            </tbody>
                            <tr style={{ margin: '0 10px' }}>
                              <th colSpan={100} className="horizontal-line" />
                            </tr>
                          </table>
                        </React.Fragment>
                      ) // end of officer return
                    }) // end of officers map
                  }
                </table>
                <div className="row-nowrap mt-1 mb-1">
                  <p>إجمالي المندوبين</p>
                </div>
                <table
                  className="report-container"
                  cellPadding="2"
                  cellSpacing="2"
                >
                  <thead>
                    <tr style={{ margin: '0 10px' }}>
                      <th colSpan={6}>التمويل القائم</th>
                      <th colSpan={4}>الرصيد</th>
                      <th colSpan={4}>المتأخرات</th>
                    </tr>
                    <tr style={{ margin: '0 10px' }}>
                      <th colSpan={2}>عدد المجموعات</th>
                      <th colSpan={2}>التمويل</th>
                      <th colSpan={2}>عدد الاعضاء</th>
                      <th colSpan={2}>عدد الاقساط</th>
                      <th colSpan={2}>المبلغ</th>
                      <th colSpan={2}>عدد الاقساط</th>
                      <th colSpan={2}>المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td colSpan={2}>{branch.totalGroups || '--'}</td>
                    <td colSpan={2}>{branch.totalPrincipal || '--'}</td>
                    <td colSpan={2}>{branch.membersCount || '--'}</td>
                    <td colSpan={2}>{branch.creditLoanCount || '--'}</td>
                    <td colSpan={2}>{branch.creditLoanPrincipal || '--'}</td>
                    <td colSpan={2}>{branch.latePaymentsCount || '--'}</td>
                    <td colSpan={2}>{branch.latePaymentsAmount || '--'}</td>
                  </tbody>
                  <tr style={{ margin: '0 10px' }}>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </table>
              </React.Fragment>
            ) // end of branch return
          }) // end of response map
        }
      </div>
    </>
  )
}
export default ActiveWalletGroup

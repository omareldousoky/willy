import React, { Fragment } from 'react'
import { OfficersProductivityResponse } from '../../../../Models/OfficersProductivityReport'
import Orientation from '../../../../../Shared/Components/Common/orientation'
import { formatPercent } from '../officersPercentPayment'
import '../officersPercentPayment.scss'
import OfficersPercentPaymentFooter from '../officersPercentPaymentFooter'
import ManagerTotalRow from './managerTotalRow'
import { Header } from '../../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'

interface OfficersProductivityProps {
  data: OfficersProductivityResponse
}

const OfficersProductivity = (props: OfficersProductivityProps) => {
  const { data } = props
  const { response, endDate, startDate } = data
  return (
    <>
      <Orientation size="portrait" />
      <div className="officers-payment officers-productivity" lang="ar">
        <Header
          toDate={endDate}
          fromDate={startDate}
          title="تقرير نسب السداد و الانتاجيه للمندوبين"
        />
        <table className="body">
          <thead>
            <tr>
              <th colSpan={2} />
              <th />
              <th />
              <th colSpan={2}>الاصدار</th>
              <th colSpan={2} rowSpan={2}>
                سدادات متوقعه
                <br /> فى هذه الفتره
              </th>
              <th colSpan={2} rowSpan={2}>
                مسدد حتى نهاية
                <br /> الفتره
              </th>
              <th />
              <th colSpan={4}>المحفظه الان</th>
              <th colSpan={2} rowSpan={2}>
                متحصلات
                <br /> الفتره
              </th>
            </tr>
            <tr>
              <th colSpan={2}>المشرف</th>
              <th />
              <th>عدد الفروع</th>
              <th>عدد</th>
              <th>مبلغ</th>
              <th>نسبة السداد</th>
              <th>عدد</th>
              <th />
              <th>مبلغ</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {response?.map((operationsManager, operationsManagerIndex) => (
              <Fragment key={operationsManagerIndex}>
                <tr>
                  <td colSpan={2}>
                    <p className="mb-0 operations">
                      {operationsManager.operationsManager || 'لا يوجد'}
                    </p>
                  </td>
                </tr>
                {operationsManager.areaManagers?.map(
                  (areaManager, areaManagerIndex) => (
                    <Fragment key={areaManagerIndex}>
                      <tr>
                        <td colSpan={2}>
                          <p className="mb-0 area-manager">
                            {areaManager.areaManager || 'لا يوجد'}
                          </p>
                        </td>
                      </tr>
                      {areaManager.areaSupervisors?.map(
                        (supervisor, supervisorIndex) => (
                          <Fragment key={supervisorIndex}>
                            <tr>
                              <td colSpan={2}>
                                <p className="mb-0 area-supervisor">
                                  {supervisor.areaSupervisor || 'لا يوجد'}
                                </p>
                              </td>
                            </tr>
                            {supervisor.centerManagers?.map(
                              (manager, managerIndex) => (
                                <tr key={managerIndex}>
                                  <td colSpan={2}>
                                    <p className="mb-0 manager">
                                      {manager.centerManager || 'لا يوجد'}
                                    </p>
                                  </td>
                                  <td />
                                  <td>{manager.totalBranches || '0'}</td>
                                  <td>{manager.totalIssuedCount || '0'}</td>
                                  <td>{manager.totalIssuedAmount || '0.00'}</td>
                                  <td colSpan={2}>
                                    {manager.expectedPaymentsThisDuration ||
                                      '0.00'}
                                  </td>
                                  <td colSpan={2}>
                                    {manager.paidByEndOfDuration || '0.00'}
                                  </td>
                                  <td>
                                    {formatPercent(manager.paymentPercentage) ||
                                      '%00.00'}
                                  </td>
                                  <td>{manager.totalCount}</td>
                                  <td />
                                  <td>{manager.currentWalletAmount}</td>
                                  <td />
                                  <td colSpan={2}>
                                    {manager.reciepts || '0.00'}
                                  </td>
                                </tr>
                              )
                            ) || (
                              <tr>
                                <td>لا يوجد مدير مركز</td>
                              </tr>
                            )}
                            <ManagerTotalRow
                              {...supervisor}
                              managerClassName="area-supervisor"
                              managerName={supervisor.areaSupervisor}
                            />
                          </Fragment>
                        )
                      ) || (
                        <tr>
                          <td>لا يوجد مشرف منطقة</td>
                        </tr>
                      )}
                      <ManagerTotalRow
                        {...areaManager}
                        managerClassName="area-manager"
                        managerName={areaManager.areaManager}
                      />
                    </Fragment>
                  )
                ) || (
                  <tr>
                    <td>لا يوجد مدير عمليات</td>
                  </tr>
                )}
                <ManagerTotalRow
                  {...operationsManager}
                  managerClassName="operations"
                  managerName={operationsManager.operationsManager}
                />
              </Fragment>
            ))}
            <tr className="total">
              <td colSpan={2} />
              <td>عدد الفروع</td>
              <td>{data.totalBranches || '0'}</td>
              <td>{data.totalIssuedCount || '0'}</td>
              <td>{data.totalIssuedAmount || '0.00'}</td>
              <td colSpan={2}>{data.expectedPaymentsThisDuration || '0.00'}</td>
              <td colSpan={2}>{data.paidByEndOfDuration || '0.00'}</td>
              <td>{formatPercent(data.paymentPercentage) || '%00.00'}</td>
              <td>{data.totalCount}</td>
              <td />
              <td>{data.currentWalletAmount}</td>
              <td />
              <td colSpan={2}>{data.reciepts || '0.00'}</td>
            </tr>
          </tbody>
        </table>
        <OfficersPercentPaymentFooter />
      </div>
    </>
  )
}

export default OfficersProductivity

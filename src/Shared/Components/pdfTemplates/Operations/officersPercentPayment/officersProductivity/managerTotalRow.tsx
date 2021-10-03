import React from 'react'
import { CommonOfficersProductivity } from '../../../../../../Mohassel/Models/OfficersProductivityReport'
import { formatPercent } from '../officersPercentPayment'
import '../officersPercentPayment.scss'

interface ManagerTotalRowProps extends CommonOfficersProductivity {
  managerClassName:
    | 'manager'
    | 'operations'
    | 'area-manager'
    | 'area-supervisor'
  managerName?: string
}

const ManagerTotalRow = (props: ManagerTotalRowProps) => {
  const isOperations = props.managerClassName === 'operations'

  return (
    <tr className="total">
      <td colSpan={2}>
        <p className={`mb-0 ${props.managerClassName}`}>
          {props.managerName || 'لا يوجد'}
        </p>
      </td>
      <td>إجمالى</td>
      <td>{props.totalBranches || '0'}</td>
      <td>{props.totalIssuedCount || '0'}</td>
      <td>{props.totalIssuedAmount || '0.00'}</td>
      <td colSpan={2}>{props.expectedPaymentsThisDuration || '0.00'}</td>
      <td colSpan={2}>{props.paidByEndOfDuration || '0.00'}</td>
      <td>{formatPercent(props.paymentPercentage) || '%00.00'}</td>
      <td>{props.totalCount}</td>
      <td>{isOperations ? '20.89%' : ''}</td>
      <td>{props.currentWalletAmount}</td>
      <td>{isOperations ? '20.89%' : ''}</td>
      <td colSpan={2}>{props.reciepts || '0.00'}</td>
    </tr>
  )
}

export default ManagerTotalRow

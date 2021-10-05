import React, { FunctionComponent, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
// import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import {
  beneficiaryType,
  // getErrorMessage,
  loanChipStatusClass,
  getFormattedLocalDate,
} from '../../../Shared/Services/utils'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { ActionsIconGroup } from '../../../Shared/Components'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import { manageVendorSettlementsArray } from './manageVendorSettlements'
import VendorSettlementSearch from './vendorSettlementSearch'

const VendorSettlement: FunctionComponent<{}> = (props: {}) => {
  // const { loans, error, totalCount, loading } = useSelector((state: any) => ({
  //   loans: state.search.applications,
  //   error: state.search.error,
  //   totalCount: state.search.totalCount,
  //   loading: state.loading,
  // }))
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [transactions, setTransactions] = useState([])

  const renderActions = (data) => {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',
        actionPermission: true,
        actionOnClick: () => console.log(data.application._id, props),
      },
    ]
  }

  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) =>
        beneficiaryType(data.application.product.beneficiaryType),
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (data) => data.application.loanApplicationKey,
    },
    {
      title: local.customerName,
      key: 'name',
      sortable: true,
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>
          {data.application.customer.customerName}
        </div>
      ),
    },
    {
      title: local.nationalId,
      key: 'nationalId',
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>
          {data.application.customer.nationalId}
        </div>
      ),
    },
    {
      title: local.productName,
      key: 'productName',
      render: (data) => data.application.product.productName,
    },
    {
      title: local.loanIssuanceDate,
      key: 'issueDate',
      sortable: true,
      render: (data) =>
        data.application.issueDate
          ? getFormattedLocalDate(data.application.issueDate)
          : '',
    },
    {
      title: local.status,
      key: 'status',
      sortable: true,
      render: (data) => {
        const status = loanChipStatusClass[data.application.status || 'default']
        const isCancelled = status === 'canceled'
        return (
          <div className={`status-chip ${status}`}>
            {isCancelled ? local.cancelled : local[status]}
          </div>
        )
      },
    },
    {
      title: '',
      key: 'action',
      render: (data) => (
        <ActionsIconGroup currentId={data._id} actions={renderActions(data)} />
      ),
    },
  ]

  return (
    <>
      <HeaderWithCards
        header={local.issuedLoans}
        array={manageVendorSettlementsArray()}
        active={manageVendorSettlementsArray()
          .map((item) => {
            return item.icon
          })
          .indexOf('issued-loans')}
      />
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.vendorSettlement}
              </Card.Title>
            </div>
          </div>
          <hr className="dashed-line" />
          <VendorSettlementSearch
            datePlaceholder={local.issuanceDate}
            submit={(data) => console.log(data)}
          />
          <DynamicTable
            pagination={false}
            totalCount={totalCount}
            mappers={tableMappers}
            data={transactions}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default VendorSettlement

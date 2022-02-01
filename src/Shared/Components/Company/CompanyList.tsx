import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, connect } from 'react-redux'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import { search, searchFilters } from '../../redux/search/actions'
import {
  getErrorMessage,
  getFullCustomerKey,
  getDateAndTime,
} from '../../Services/utils'
import DynamicTable from '../DynamicTable/dynamicTable'
import Can from '../../../Mohassel/config/Can'
import Search from '../Search/search'
import { Loader } from '../Loader'
import { ActionsIconGroup } from '..'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'

import { CompanyListProps } from './types'
import { manageCompaniesArray } from '../../../Mohassel/Components/CustomerCreation/manageCustomersInitial'
import { TableMapperItem } from '../DynamicTable/types'
import { ActionWithIcon } from '../../Models/common'

const List = ({
  branchId,
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
  type = 'LTS',
}: CompanyListProps) => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation<{ sme: boolean; id: number }>()

  const getCompanies = async () => {
    const { customerShortenedCode, key } = currentSearchFilters
    dispatch(
      search({
        ...currentSearchFilters,
        key: customerShortenedCode
          ? getFullCustomerKey(customerShortenedCode)
          : key || undefined,
        size,
        from,
        url: 'customer',
        branchId,
        customerType: 'company',
      })
    )
    if (error)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(error),
        confirmButtonText: local.confirmationText,
        icon: 'error',
      })
  }

  useEffect(() => {
    getCompanies()
  }, [branchId, from, size])

  useEffect(() => {
    dispatch(searchFilters({}))
    dispatch(
      search({
        size,
        from,
        url: 'customer',
        branchId,
        customerType: 'company',
      })
    )
    if (error)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(error),
        confirmButtonText: local.confirmationText,
        icon: 'error',
      })
  }, [])
  const companyActions: ActionWithIcon[] = [
    ...(type === 'LTS'
      ? [
          {
            actionTitle: local.editCompany,
            actionIcon: 'edit',
            actionPermission:
              ability.can('updateCustomer', 'customer') ||
              ability.can('updateNationalId', 'customer'),
            actionOnClick: (id) =>
              history.push('/company/edit-company', { id }),
          },
          {
            actionTitle: local.viewCompany,
            actionIcon: 'view',

            actionPermission: ability.can('getCustomer', 'customer'),
            actionOnClick: (id) =>
              history.push('/company/view-company', { id }),
          },
        ]
      : [
          {
            actionTitle: local.uploadDocuments,
            actionIcon: 'download',
            actionPermission: ability.can('updateCustomer', 'customer'),
            actionOnClick: (id) =>
              history.push('/edit-customer-document', {
                id,
                sme: !!location.state?.sme,
              }),
            style: {
              transform: `rotate(180deg)`,
            },
          },
        ]),
  ]
  const tableMapper: TableMapperItem[] = [
    {
      title: local.companyCode,
      key: 'customerCode',
      render: (row) => row.key,
    },
    {
      title: local.companyName,
      sortable: true,
      key: 'name',
      render: (row) => row.businessName,
    },
    {
      title: local.taxCardNumber,
      key: 'taxCardNumber',
      render: (row) => row.taxCardNumber,
    },
    {
      title: local.commercialRegisterNumber,
      key: 'commercialRegisterNumber',
      render: (row) => row.commercialRegisterNumber,
    },
    {
      title: local.creationDate,
      sortable: true,
      key: 'createdAt',
      render: (row) => (row.created?.at ? getDateAndTime(row.created?.at) : ''),
    },
    {
      title: local.actions,
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (row) => (
        <ActionsIconGroup currentId={row._id} actions={companyActions} />
      ),
    },
  ]

  return (
    <>
      {type === 'LTS' && (
        <HeaderWithCards
          header={local.companies}
          array={manageCompaniesArray()}
          active={0}
        />
      )}
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.companies}
              </Card.Title>
              <span className="text-muted">
                {local.noOfCompanies + ` (${totalCount || 0})`}
              </span>
            </div>
            <div>
              {type === 'LTS' && (
                <Can I="createCustomer" a="customer">
                  <Button
                    onClick={() => {
                      history.push('/company/new-company')
                    }}
                    className="big-button"
                  >
                    {local.newCompany}
                  </Button>
                </Can>
              )}
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'dateFromTo', 'consumerFinanceLimitStatus']}
            dropDownKeys={[
              'name',
              'taxCardNumber',
              'commercialRegisterNumber',
              'key',
              'code',
              'customerShortenedCode',
              'phoneNumber',
            ]}
            searchPlaceholder={local.searchCompanyList}
            url="customer"
            from={from}
            size={size}
            setFrom={(newFrom) => setFrom(newFrom)}
            hqBranchIdRequest={branchId}
          />
          <DynamicTable
            from={from}
            size={size}
            totalCount={totalCount}
            mappers={tableMapper}
            pagination
            data={data}
            url="customer"
            changeNumber={(key: string, number: number) => {
              if (key === 'size') setSize(number)
              if (key === 'from') setFrom(number)
            }}
          />
        </Card.Body>
      </Card>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    currentSearchFilters: state.searchFilters,
  }
}

export const CompanyList = connect(mapStateToProps)(List)

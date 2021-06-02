import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, connect } from 'react-redux'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import * as local from '../../Assets/ar.json'
import ability from '../../../Mohassel/config/ability'
import { search, searchFilters } from '../../redux/search/actions'
import { getErrorMessage, getFullCustomerKey } from '../../Services/utils'
import { getDateAndTime } from '../../../Mohassel/Services/getRenderDate'
import DynamicTable from '../DynamicTable/dynamicTable'
import Can from '../../../Mohassel/config/Can'
import Search from '../Search/search'
import { Loader } from '../Loader'

import { CompanyListProps, TableMapperItem } from './types'
import { Actions } from '../ActionsIconGroup/types'
import { ActionsIconGroup } from '..'

const List = ({
  branchId,
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
}: CompanyListProps) => {
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const {
    actions,
    companies,
    companyCode,
    companyName,
    commercialRegisterNumber,
    creationDate,
    editCompany,
    newCompany,
    noOfCompanies,
    searchCompanyList,
    taxCardNumber,
    viewCompany,
  } = local

  const history = useHistory()
  const dispatch = useDispatch()

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
    if (error) Swal.fire('error', getErrorMessage(error), 'error')
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
    if (error) Swal.fire('error', getErrorMessage(error), 'error')
  }, [])
  const companyActions: Actions[] = [
    {
      actionTitle: editCompany,
      actionIcon: 'editIcon',

      actionPermission:
        ability.can('updateCustomer', 'customer') ||
        ability.can('updateNationalId', 'customer'),
      actionOnClick: (id) => history.push('/company/edit-company', { id }),
    },
    {
      actionTitle: viewCompany,
      actionIcon: 'view',

      actionPermission: ability.can('getCustomer', 'customer'),
      actionOnClick: (id) => history.push('/company/view-company', { id }),
    },
  ]
  const tableMapper: TableMapperItem[] = [
    {
      title: companyCode,
      key: 'customerCode',
      render: (row) => row.key,
    },
    {
      title: companyName,
      sortable: true,
      key: 'name',
      render: (row) => row.businessName,
    },
    {
      title: taxCardNumber,
      key: 'taxCardNumber',
      render: (row) => row.taxCardNumber,
    },
    {
      title: commercialRegisterNumber,
      key: 'commercialRegisterNumber',
      render: (row) => row.commercialRegisterNumber,
    },
    {
      title: creationDate,
      sortable: true,
      key: 'createdAt',
      render: (row) => (row.created?.at ? getDateAndTime(row.created?.at) : ''),
    },
    {
      title: actions,
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (row) => (
        <ActionsIconGroup
          currentCustomerId={row._id}
          actions={companyActions}
        />
      ),
    },
  ]

  return (
    <>
      {/* <HeaderWithCards
        header={companies}
        array={manageCompaniesTab}
        active={1}
      /> */}
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {companies}
              </Card.Title>
              <span className="text-muted">
                {noOfCompanies + ` (${totalCount || 0})`}
              </span>
            </div>
            <div>
              <Can I="createCustomer" a="customer">
                <Button
                  onClick={() => {
                    history.push('/company/new-company')
                  }}
                  className="big-button"
                >
                  {newCompany}
                </Button>
              </Can>
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'dateFromTo']}
            dropDownKeys={[
              'name',
              'taxCardNumber',
              'commercialRegisterNumber',
              'key',
              'code',
              'customerShortenedCode',
            ]}
            searchPlaceholder={searchCompanyList}
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

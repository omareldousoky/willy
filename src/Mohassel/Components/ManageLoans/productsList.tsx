import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import produce from 'immer'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
import HeaderWithCards, { Tab } from '../HeaderWithCards/headerWithCards'
import { manageLoansArray } from './manageLoansInitials'
import { getDetailedProducts } from '../../Services/APIs/loanProduct/getProduct'
import { downloadFile, getErrorMessage } from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import { ActionsIconGroup } from '../../../Shared/Components'
import { ActionWithIcon, Product } from '../../Models/common'
import { getProductApplications } from '../../Services/APIs/loanProduct/productCreation'
import { Pagination } from '../Common/Pagination'

interface Props extends RouteComponentProps {
  data: any
  totalCount: number
  searchFilters: any
  search: (data) => void
  setLoading: (data) => void
  setSearchFilters: (data) => void
  branchId?: string
  withHeader: boolean
}
interface State {
  loading: boolean
  products: Array<Product>
  filterProducts: string
  manageLoansTabs: Tab[]
  paginatedProducts: Array<Product>
  totalCount: number
  size: number
  from: number
}

class LoanProducts extends Component<RouteComponentProps<{}> & Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]

  productActions: ActionWithIcon[]

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      products: [],
      filterProducts: '',
      manageLoansTabs: [],
      paginatedProducts: [],
      size: 10,
      from: 0,
      totalCount: 0,
    }
    this.mappers = [
      {
        title: local.name,
        key: 'name',
        render: (data) => data.name,
      },
      {
        title: local.branches,
        key: 'branches',
        render: (data) => (data.branches ? data.branches : 0),
      },
      {
        title: local.actions,
        key: 'actions',
        render: (data) => (
          <ActionsIconGroup currentId={data.id} actions={this.productActions} />
        ),
      },
    ]
    this.productActions = [
      {
        actionTitle: local.editLoanProduct,
        actionIcon: 'editIcon',
        actionPermission: ability.can('updateLoanProduct', 'product'),
        actionOnClick: (id) =>
          this.props.history.push(
            '/manage-loans/loan-products/edit-loan-product',
            {
              id,
            }
          ),
      },
      {
        actionTitle: local.viewLoanProduct,
        actionIcon: 'view',
        actionPermission: ability.can('updateLoanProduct', 'product'),
        actionOnClick: (id) =>
          this.props.history.push('/manage-loans/loan-products/view-product', {
            id,
          }),
      },
      {
        actionTitle: local.productApplicationsReport,
        actionIcon: 'download-big-file',
        actionPermission: ability.can('getApplicationsOfProduct', 'report'),
        actionOnClick: (id) => this.getProductApplicationsReport(id as string),
      },
    ]
  }

  componentDidMount() {
    this.getProducts()
    this.setState({ manageLoansTabs: manageLoansArray() })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filterProducts !== this.state.filterProducts) {
      this.paginateProducts()
    }
  }

  async getProductApplicationsReport(productId: string) {
    this.setState({ loading: true })
    const res = await getProductApplications(productId)
    if (res.status === 'success' && res.body) {
      downloadFile(res.body.presignedUr)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    this.setState({ loading: false })
  }

  async getProducts() {
    this.setState({ loading: true })
    const products = await getDetailedProducts()
    if (products.status === 'success') {
      this.setState(
        {
          products: products.body.data,
          loading: false,
        },
        () => this.paginateProducts()
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(products.error.error), 'error')
      )
    }
  }

  paginateProducts() {
    const filteredProduct = this.state.products.filter((product) => {
      return product.name
        ?.toLocaleLowerCase()
        .includes(this.state.filterProducts.toLocaleLowerCase())
    })
    this.setState(
      produce<State>((draftState) => {
        draftState.paginatedProducts = filteredProduct.slice(
          draftState.from,
          draftState.from + draftState.size
        )
        draftState.totalCount = filteredProduct.length
      })
    )
  }

  render() {
    return (
      <div>
        <HeaderWithCards
          header={local.loanProducts}
          array={this.state.manageLoansTabs}
          active={this.state.manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('loanProducts')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div className="d-flex align-items-center">
                <Card.Title className="ml-2 mb-0">
                  {local.loanProducts}
                </Card.Title>
                <span className="text-muted ml-2">
                  {local.noOfLoanProducts + ` (${this.state.totalCount})`}
                </span>
              </div>
              <div>
                <Can I="createLoanProduct" a="product">
                  <Button
                    className="big-button mx-2"
                    onClick={() =>
                      this.props.history.push(
                        '/manage-loans/loan-products/new-loan-product'
                      )
                    }
                  >
                    {local.createLoanProduct}
                  </Button>
                </Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            {this.state.products.length > 0 && (
              <div className="d-flex flex-row justify-content-center">
                <Form.Control
                  type="text"
                  data-qc="filterProducts"
                  placeholder={local.search}
                  className="mb-2 w-75"
                  maxLength={100}
                  value={this.state.filterProducts}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ filterProducts: e.currentTarget.value })
                  }
                />
              </div>
            )}
            {this.state.products && (
              <>
                {' '}
                <DynamicTable
                  totalCount={0}
                  mappers={this.mappers}
                  pagination={false}
                  data={this.state.paginatedProducts}
                  size={this.state.size}
                  from={this.state.from}
                />
                <Pagination
                  totalCount={this.state.totalCount}
                  size={this.state.paginatedProducts.length}
                  paginationArr={[10, 100, 500]}
                  from={this.state.from}
                  updatePagination={(key: string, number: number) => {
                    this.setState(
                      ({ [key]: number } as unknown) as Pick<
                        State,
                        keyof State
                      >,
                      () => this.paginateProducts()
                    )
                  }}
                />
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default withRouter(LoanProducts)

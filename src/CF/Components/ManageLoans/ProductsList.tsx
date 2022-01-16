import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import HeaderWithCards, {
  Tab,
} from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLoansArray } from './ManageLoansInitials'
import { downloadFile, getErrorMessage } from '../../../Shared/Services/utils'
import ability from '../../../Shared/config/ability'
import { ActionsIconGroup } from '../../../Shared/Components'
import { getProductApplications } from '../../../Shared/Services/APIs/loanProduct/productCreation'
import { ActionWithIcon, Product } from '../../../Shared/Models/common'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'

interface Props extends RouteComponentProps {
  data: Array<Product>
  error: string
  totalCount: number
  searchFilters: any
  search: (data) => Promise<void>
  loading: boolean
  setSearchFilters: (data) => void
  branchId?: string
  withHeader: boolean
}
interface State {
  loading: boolean
  manageLoansTabs: Tab[]
  size: number
  from: number
}

class LoanProducts extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]

  productActions: ActionWithIcon[]

  searchKeys: string[]

  dropDownKeys: string[]

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      manageLoansTabs: [],
      size: 10,
      from: 0,
    }
    this.mappers = [
      {
        title: local.productName,
        key: 'name',
        render: (data) => data.name,
      },
      {
        title: local.code,
        key: 'code',
        render: (data) => data.code,
      },
      {
        title: local.branches,
        key: 'branches',
        render: (data) => (data.branchCount ? data.branchCount : 0),
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
        actionIcon: 'edit',
        actionPermission: ability.can('updateLoanProduct', 'product'),
        actionOnClick: (id) => {
          this.props.setSearchFilters({})
          this.props.history.push(
            '/manage-loans/loan-products/edit-loan-product',
            {
              id,
            }
          )
        },
      },
      {
        actionTitle: local.viewLoanProduct,
        actionIcon: 'view',
        actionPermission: ability.can('updateLoanProduct', 'product'),
        actionOnClick: (id) => {
          this.props.setSearchFilters({})
          this.props.history.push('/manage-loans/loan-products/view-product', {
            id,
          })
        },
      },
    ]
    this.searchKeys = ['keyword']
    this.dropDownKeys = ['name', 'code']
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'product',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('', getErrorMessage(this.props.error), 'error')
      })
    this.setState({ manageLoansTabs: manageLoansArray() })
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
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'product',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('', getErrorMessage(this.props.error), 'error')
      })
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
            .indexOf('loan-products')}
        />
        <Card className="main-card">
          <Loader
            type="fullsection"
            open={this.state.loading || this.props.loading}
          />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div className="d-flex align-items-center">
                <Card.Title className="ml-2 mb-0">
                  {local.loanProducts}
                </Card.Title>
                <span className="text-muted ml-2">
                  {local.noOfLoanProducts + ` (${this.props.totalCount})`}
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
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={this.searchKeys}
              dropDownKeys={this.dropDownKeys}
              url="product"
              from={this.state.from}
              size={this.state.size}
              setFrom={(from) => this.setState({ from })}
              hqBranchIdRequest={this.props.branchId}
            />
            {this.props.data && (
              <DynamicTable
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination
                data={this.props.data}
                size={this.state.size}
                from={this.state.from}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getProducts()
                  )
                }}
              />
            )}
          </Card.Body>
        </Card>
      </div>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(LoanProducts))

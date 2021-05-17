import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { getProducts } from '../../Services/APIs/loanProduct/getProduct'
import {
  assignProductsToBranches,
  unassignProductsToBranches,
} from '../../Services/APIs/Branch/assignProductsToBranches'
import {
  customFilterOption,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import DualBox from '../DualListBox/dualListBox'
import { theme } from '../../../Shared/theme'
import { getBranchesByProducts } from '../../Services/APIs/Branch/getBranches'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLoansArray } from '../ManageLoans/manageLoansInitials'

interface Props {
  title: string
}
interface Product {
  _id: string
  productName: string
}
interface Branch {
  _id: string
  name: string
}
interface State {
  branchesNotHaveProducts: Branch[]
  branches: Branch[]
  branchesHaveProductsIds: string[]
  products: Product[]
  selectedProducts: Product[]
  loading: boolean
  selectedBranches: Array<Branch>
  isDisabled: boolean
  newSelectedIds: string[]
  deletedIds: string[]
  noErrors: boolean
  manageLoansTabs: any[]
}
class AssignProductsToBranches extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      branchesHaveProductsIds: [],
      branchesNotHaveProducts: [],
      products: [],
      selectedProducts: [],
      branches: [],
      loading: false,
      isDisabled: true,
      selectedBranches: [],
      newSelectedIds: [],
      deletedIds: [],
      noErrors: true,
      manageLoansTabs: [],
    }
  }

  componentDidMount() {
    this.getProducts()
    this.setState({ manageLoansTabs: manageLoansArray() })
  }

  handleChange(list) {
    const selectedIds = list.map((branch) => branch._id)
    const deletedIds = this.state.branchesHaveProductsIds.filter(
      (id) => !selectedIds.includes(id)
    )
    const newSelectedIds = selectedIds.filter(
      (id) => !this.state.branchesHaveProductsIds.includes(id)
    )
    this.setState((prevState) => ({
      selectedBranches: list,
      newSelectedIds,
      deletedIds: prevState.branchesHaveProductsIds.filter(
        (id) => !selectedIds.includes(id)
      ),
      isDisabled: deletedIds.length < 1 && newSelectedIds.length < 1,
    }))
  }

  async getProducts() {
    this.setState({ loading: true })
    const res = await getProducts()
    if (res.status === 'success') {
      this.setState({
        products: res.body.data.data,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () => {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      })
    }
  }

  getBranchesForProducts = async () => {
    this.setState({ loading: true })
    if (this.state.selectedProducts.length > 0) {
      const productIds = this.state.selectedProducts.map(
        (product) => product._id
      )
      const res = await getBranchesByProducts({ ids: productIds })
      const notHaveBranches = res.body.dontHaveProducts
        ? res.body.dontHaveProducts
        : []
      const haveBranches = res.body.haveProducts ? res.body.haveProducts : []
      if (res.status === 'success') {
        this.setState({
          branchesNotHaveProducts: notHaveBranches,
          branchesHaveProductsIds: haveBranches.map((branch) => branch._id),
          branches: [...notHaveBranches, ...haveBranches],
          selectedBranches: haveBranches,
        })
      } else {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      }
    }
    this.setState({ loading: false })
  }

  submit = async () => {
    if (this.state.newSelectedIds.length > 0) {
      await this.assignProductsToBranches(this.state.newSelectedIds)
    }
    if (this.state.deletedIds.length > 0) {
      await this.unassignProductsToBranches(this.state.deletedIds)
    }
    if (this.state.noErrors) {
      this.setState({
        branchesHaveProductsIds: [],
        branchesNotHaveProducts: [],
        products: [],
        selectedProducts: [],
        branches: [],
        loading: false,
        isDisabled: true,
        selectedBranches: [],
        newSelectedIds: [],
        deletedIds: [],
        noErrors: true,
      })
      this.getProducts()
    }
  }

  async assignProductsToBranches(_ids: string[]) {
    this.setState({ loading: true })
    const res = await assignProductsToBranches({
      branches: _ids,
      productIds: this.state.selectedProducts.map((product) => product._id),
    })
    if (res.status === 'success') {
      this.setState({
        loading: false,
      })
      Swal.fire('success', local.assignProductsToBranchesSuccess)
    } else {
      this.setState({
        loading: false,
        noErrors: false,
      })
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async unassignProductsToBranches(_ids: string[]) {
    this.setState({ loading: true })
    const res = await unassignProductsToBranches({
      branches: _ids,
      productIds: this.state.selectedProducts.map((product) => product._id),
    })
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire('success', local.unassignProductsToBranchesSuccess)
    } else {
      this.setState({
        loading: false,
        noErrors: false,
      })

      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.loanProducts}
          array={this.state.manageLoansTabs}
          active={this.state.manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('assignProductToBranch')}
        />
        <Card className="main-card">
          <Loader open={this.state.loading} type="fullscreen" />
          <Card.Body className="w-100">
            <Form className="data-form">
              <Form.Group controlId="products" className="data-group w-100">
                <Form.Label className="data-label">
                  {local.productName}
                </Form.Label>
                <Row>
                  <Col sm={10}>
                    <Select
                      name="products"
                      data-qc="products"
                      styles={theme.selectStyleWithBorder}
                      theme={theme.selectTheme}
                      value={this.state.selectedProducts}
                      isMulti
                      isSearchable
                      filterOption={customFilterOption}
                      placeholder={
                        <span
                          style={{
                            width: '100%',
                            padding: '5px',
                            margin: '5px',
                          }}
                        >
                          <img
                            style={{ float: 'right' }}
                            alt="search-icon"
                            src={require('../../Assets/searchIcon.svg')}
                          />{' '}
                          {local.searchByProductName}
                        </span>
                      }
                      onChange={(event: any) => {
                        this.setState({
                          selectedProducts: event,
                          branchesNotHaveProducts: [],
                          branchesHaveProductsIds: [],
                          branches: [],
                          selectedBranches: [],
                        })
                      }}
                      getOptionLabel={(option) => option.productName}
                      getOptionValue={(option) => option._id}
                      options={this.state.products}
                    />
                  </Col>
                  <Col sm={2}>
                    <Button
                      disabled={
                        !this.state.selectedProducts ||
                        this.state.selectedProducts.length < 1
                      }
                      onClick={this.getBranchesForProducts}
                    >
                      {local.showBranches}
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              {(this.state.selectedBranches.length > 0 ||
                this.state.branchesNotHaveProducts.length > 0) && (
                <DualBox
                  labelKey="name"
                  options={this.state.branches}
                  selected={this.state.selectedBranches}
                  onChange={(list) => this.handleChange(list)}
                  rightHeader={local.availableBranches}
                  leftHeader={local.selectedBranches}
                />
              )}
              <Row style={{ justifyContent: 'center' }}>
                <Button
                  type="button"
                  style={{ margin: 10, width: '10%' }}
                  disabled={this.state.isDisabled}
                  onClick={this.submit}
                >
                  {local.submit}
                </Button>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </>
    )
  }
}
export default AssignProductsToBranches

import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { getProducts } from '../../../Shared/Services/APIs/loanProduct/getProduct'
import {
  assignProductsToBranches,
  unassignProductsToBranches,
} from '../../../Shared/Services/APIs/Branch/assignProductsToBranches'
import {
  customFilterOption,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import DualBox from '../../../Shared/Components/DualListBox/dualListBox'
import { theme } from '../../../Shared/theme'
import { getBranchesByProducts } from '../../../Shared/Services/APIs/Branch/getBranches'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLoansArray } from '../ManageLoans/manageLoansInitials'
import { LtsIcon } from '../../../Shared/Components'

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
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
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
      Swal.fire({
        title: local.success,
        text: local.assignProductsToBranchesSuccess,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
    } else {
      this.setState({
        loading: false,
        noErrors: false,
      })
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
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
      Swal.fire({
        title: local.success,
        text: local.unassignProductsToBranchesSuccess,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
    } else {
      this.setState({
        loading: false,
        noErrors: false,
      })

      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
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
            .indexOf('assign-product-to-branch')}
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
                          <LtsIcon name="search" />
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

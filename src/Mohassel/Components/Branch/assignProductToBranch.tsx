import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { AssignProductToBranchForm } from './assignProductToBranchForm';
import { assignProductToBranch, assignProductToBranchValidation } from './assignProductToBranchStates';
import { getBranches, getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
import { assignProductToBranchAPI } from '../../Services/APIs/Branch/assignProductToBranch';
import { getProducts } from '../../Services/APIs/loanProduct/getProduct';
interface Props {
    title: string;
    history: Array<string>;
};
interface State {
    application: object;
    loading: boolean;
    branchesLabels: Array<object>;
    products: Array<object>;
    selectedBranchProducts: Array<string>;
}
class AssignProductToBranch extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: assignProductToBranch,
            loading: false,
            branchesLabels: [],
            products: [],
            selectedBranchProducts: []
        }
    }
    async UNSAFE_componentWillMount() {
        this.setState({ loading: true });
        const branches = await getBranches();
        if (branches.status === 'success') {
            const branchLabels: Array<object> = [];
            branches.body.data.data.forEach(branch => {
                branchLabels.push({ value: branch._id, label: branch.name })
            })
            this.setState({
                branchesLabels: branchLabels,
                loading: false
            })
        } else {
            console.log('err')
            this.setState({ loading: false });
        }
    }
    async getProducts() {
        this.setState({ loading: true, products: [] })
        const products = await getProducts();
        if (products.status === 'success') {
            const ProductLabels: Array<object> = [];
            products.body.data.data.forEach(product => {
                ProductLabels.push({ value: product._id, label: product.productName })
            })
            this.setState({
                products: ProductLabels,
                loading: false
            })
        } else {
            console.log('err')
            this.setState({ loading: false });
        }
    }
    submit = async (values: any) => {
        this.setState({ loading: true });
        const obj = {
            branchId: values.branch.value, productIds: this.state.selectedBranchProducts
        }
        const res = await assignProductToBranchAPI(obj);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.productAssigned).then(() => { this.props.history.push("/") })
        } else {
            Swal.fire("error", local.productAssignError, 'error')
            this.setState({ loading: false });
        }
    }
    async getProductsForBranch(id) {
        this.setState({ selectedBranchProducts: [] })
        const branchsProducts = await getProductsByBranch(id);
        if (branchsProducts.status === 'success') {
            const branchsProductsLabels: Array<string> = [];
            branchsProducts.body.data.productIds.forEach(product => {
                branchsProductsLabels.push(product._id)
            })
            this.setState({
                selectedBranchProducts: branchsProductsLabels
            })
        } else {
            console.log('err')
        }
    }
    handleProdChange(e) {
        this.setState({ selectedBranchProducts: e });
    }
    render() {
        return (
            <Container>
                <Loader open={this.state.loading} type="fullscreen" />
                <Formik
                    enableReinitialize
                    initialValues={this.state.application}
                    onSubmit={this.submit}
                    validationSchema={assignProductToBranchValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <AssignProductToBranchForm {...formikProps} getProducts={(id) => { this.getProducts(), this.getProductsForBranch(id) }} branchesLabels={this.state.branchesLabels} products={this.state.products} selectedBranchProducts={this.state.selectedBranchProducts} onChangeProducts={(prod) => this.handleProdChange(prod)} />
                    }
                </Formik>
            </Container>
        )
    }
}
export default AssignProductToBranch;
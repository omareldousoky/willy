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
import DualBox from '../DualListBox/dualListBox';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

interface Props {
    title: string;
    history: Array<string>;
};
interface State {
    application: {
        branch: {
            name: string;
            label: string;
        };
    };
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
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');

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
            this.setState({ loading: false });
            Swal.fire('', local.searchError, 'error');
        }
    }
    submit = async (values: any) => {
        this.setState({ loading: true });
        const obj = {
            branchId: values.branch.value, productIds: this.state.selectedBranchProducts
        }
        // const res = await assignProductToBranchAPI(obj);
        // if (res.status === 'success') {
        //     this.setState({ loading: false });
        //     Swal.fire("success", local.productAssigned).then(() => { this.props.history.push("/") })
        // } else {
        //     Swal.fire("error", local.productAssignError, 'error')
        //     this.setState({ loading: false });
        // }
    }
    async getProductsForBranch(id) {
        this.getProducts();
        this.setState({ selectedBranchProducts: [], loading: true })
        const branchsProducts = await getProductsByBranch(id);
        if (branchsProducts.status === 'success') {
            const branchsProductsLabels: Array<string> = [];
            branchsProducts.body.data.productIds.forEach(product => {
                branchsProductsLabels.push(product._id)
            })
            this.setState({
                selectedBranchProducts: branchsProductsLabels,
                loading: false
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false
            })
        }
    }
    handleProdChange(e) {
        this.setState({ selectedBranchProducts: e });
    }
    render() {
        console.log(this.state.selectedBranchProducts)
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
                        // <AssignProductToBranchForm {...formikProps} getProducts={(id) => { this.getProducts(), this.getProductsForBranch(id) }} branchesLabels={this.state.branchesLabels} products={this.state.products} selectedBranchProducts={this.state.selectedBranchProducts} onChangeProducts={(prod) => this.handleProdChange(prod)} />
                        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                            <Form.Group as={Row} controlId="branch" style={{ width: '100%' }}>
                                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.branch}</Form.Label>
                                <Col sm={6}>
                                    <Select
                                        name="branch"
                                        data-qc="branch"
                                        value={formikProps.values.branch}
                                        enableReinitialize={false}
                                        onChange={(event: any) => { formikProps.values.branch = event; this.getProductsForBranch(event.value) }}
                                        type='text'
                                        options={this.state.branchesLabels}
                                        onBlur={formikProps.handleBlur}
                                        isInvalid={formikProps.errors.branch && formikProps.touched.branch}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ display: (formikProps.errors.branch && formikProps.touched.branch) ? 'block' : 'none' }}>
                                        {(formikProps.errors.branch && formikProps.touched.branch) ? formikProps.errors.branch.label : ''}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            {this.state.products.length > 0 &&
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', textAlign: 'right' }}>
                                        <p style={{ width: '50%' }}>
                                            {local.loanProducts}
                                        </p>
                                        <p style={{ width: '46%', marginRight: '4%' }}>
                                            {local.loanProductsForBranch}
                                        </p>
                                    </div>
                                    <DualBox
                                        options={this.state.products}
                                        selected={this.state.selectedBranchProducts}
                                        onChange={(e) => this.handleProdChange(e)}
                                    />
                                </div>
                            }
                            {/* <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button> */}
                        </Form >
                    }
                </Formik>
            </Container>
        )
    }
}
export default AssignProductToBranch;
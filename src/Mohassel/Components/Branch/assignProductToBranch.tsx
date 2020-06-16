import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
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
interface Branch {
    _id: string;
    name: string;
}
interface State {
    branch: Branch;
    loading: boolean;
    branches: Array<Branch>;
    products: Array<object>;
    selectedBranchProducts: Array<Branch>;
}
class AssignProductToBranch extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            branch: {
                _id: '',
                name: '',
            },
            loading: false,
            branches: [],
            products: [],
            selectedBranchProducts: []
        }
    }
    async UNSAFE_componentWillMount() {
        this.setState({ loading: true });
        const branches = await getBranches();
        if (branches.status === 'success') {
            this.setState({
                branches: branches.body.data.data,
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
            return (products.body.data.data)
        } else {
            return ([])
        }
    }
    submit = async () => {
        this.setState({ loading: true });
        const obj = {
            branchId: this.state.branch._id,
            productIds: this.state.selectedBranchProducts.map(item => item._id)
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
    async getProductsForBranch(branch) {
        const products = await this.getProducts();
        this.setState({ loading: true, branch: branch })
        const branchsProducts = await getProductsByBranch(branch._id);
        if (branchsProducts.status === 'success') {
            this.setState({
                selectedBranchProducts: (branchsProducts.body.data.productIds) ? branchsProducts.body.data.productIds : [],
                loading: false,
                products
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false,
                products
            })
        }
    }
    handleChange(list) {
        this.setState({ selectedBranchProducts: list });
    }
    render() {
        return (
            <Container>
                <Loader open={this.state.loading} type="fullscreen" />
                <Form style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Form.Group as={Row} controlId="branch" style={{ width: '100%' }}>
                        <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.branch}</Form.Label>
                        <Col sm={6}>
                            <Select
                                name="branch"
                                data-qc="branch"
                                value={this.state.branch}
                                enableReinitialize={false}
                                onChange={(event: any) => { this.getProductsForBranch(event) }}
                                type='text'
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option._id}
                                options={this.state.branches}
                            />
                        </Col>
                    </Form.Group>
                    {this.state.products.length > 0 &&
                        <DualBox
                            labelKey = {"productName"}
                            options={this.state.products}
                            selected={this.state.selectedBranchProducts}
                            onChange={(list) => this.handleChange(list)}
                            filterKey={this.state.branch._id}
                            rightHeader={local.loanProducts}
                            leftHeader={local.loanProductsForBranch}
                        />
                    }
                    {this.state.branch._id ? <Button type="button" style={{ margin: 10, width: '10%', alignSelf: 'flex-end' }} onClick={this.submit}>{local.submit}</Button> : null}
                </Form >
            </Container>
        )
    }
}
export default AssignProductToBranch;
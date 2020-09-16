import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { getProducts } from '../../Services/APIs/loanProduct/getProduct';
import { assignProductsToBranches, unassignProductsToBranches } from '../../Services/APIs/Branch/assignProductsToBranches';
import { customFilterOption } from "../../Services/utils";
import DualBox from '../DualListBox/dualListBox';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import { theme } from '../../../theme';
import { CardBody } from 'react-bootstrap/Card';
import Card from 'react-bootstrap/Card';
import { getBranchesByProducts } from '../../Services/APIs/Branch/getBranches';

interface Props {
    title: string;
    history: Array<string>;
};
interface Product {
    _id: string;
    productName: string;
}
interface Branch {
    _id: string;
    name: string;
}
interface State {
    branchesNotHaveProducts: Branch[];
    branches: Branch[];
    branchesHaveProductsIds: string[];
    products: Product[];
    selectedProducts: Product[];
    loading: boolean;
    selectedBranches: Array<Branch>;
    isDisabled: boolean;
    newSelectedIds: string[];
    deletedIds: string[];
    noErrors: boolean;

}
class AssignProductsToBranches extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
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
        }
    }

    componentDidMount() {
        this.getProducts();
    }
    handleChange(list) {
        const selectedIds = list.map(branch => branch._id);
        const deletedIds = this.state.branchesHaveProductsIds.filter(id => !selectedIds.includes(id));
        const newSelectedIds = selectedIds.filter(id => !this.state.branchesHaveProductsIds.includes(id));
        this.setState({
            selectedBranches: list,
            newSelectedIds: newSelectedIds,
            deletedIds: deletedIds,
            isDisabled: (deletedIds.length < 1 && newSelectedIds.length < 1),
        })
    }
    async getProducts() {
        this.setState({ loading: true })
        const res = await getProducts();
        if (res.status === 'success') {
            this.setState({
                products: res.body.data.data,
                loading: false,
            })
        } else {
            this.setState({ loading: false }, () => {
                Swal.fire("error", local.searchError)
            })
        }
    }
    getBranchesForProducts = async () => {
        this.setState({ loading: true });
        if (this.state.selectedProducts.length > 0) {
            const productIds = this.state.selectedProducts.map(product => product._id);
            const res = await getBranchesByProducts({ ids: productIds })
            const notHaveBranches = res.body.dontHaveProducts ? res.body.dontHaveProducts : [];
            const haveBranches = res.body.haveProducts ? res.body.haveProducts : [];
            if (res.status === 'success') {
                this.setState({
                    branchesNotHaveProducts:  notHaveBranches,
                    branchesHaveProductsIds: haveBranches.map(branch=> branch._id),
                    branches: [...notHaveBranches ,...haveBranches],
                    selectedBranches: haveBranches,
                })
            } else {
                Swal.fire("error", res.error);
            }
        }
        this.setState({ loading: false });
    }

    submit = async () => {
         if (this.state.newSelectedIds.length > 0) {
            await this.assignProductsToBranches(this.state.newSelectedIds);
            

        }
        if (this.state.deletedIds.length > 0) {
            await this.unassignProductsToBranches(this.state.deletedIds);
        }
       if(this.state.noErrors) {
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
           this.getProducts();
       }  
    }
    async assignProductsToBranches(_ids: string[]) {
        this.setState({loading: true})
        const res = await assignProductsToBranches({
            branches: _ids,
            productIds: this.state.products.map(product => product._id),

        })
        if (res.status == "success") {
            this.setState({
                loading: false,
            })
                Swal.fire("success", local.assignProductsToBranchesSuccess);
        


        } else {
            this.setState({
                loading: false,
                noErrors: false,
            })
            Swal.fire("error", local.assignProductsToBranchesError)
        }
    }
    async unassignProductsToBranches(_ids: string[]) {
        this.setState({loading : true})
        const res = await unassignProductsToBranches({
            branches: _ids,
            productIds: this.state.products.map(product => product._id),

        })
        if (res.status == "success") {
            this.setState({loading: false})
            Swal.fire("success", local.unassignProductsToBranchesSuccess);
        } else {
            this.setState({
                loading: false,
                noErrors: false,
            })

             Swal.fire("error", local.unassignProductsToBranchesError)
        }
    }
    render() {
        return (
            <Container>
                <Card>
                    <Loader open={this.state.loading} type="fullscreen" />
                    <Card.Body style={{ width: '100%'}}>
                        <Form  className= "data-form"> 
                            <Form.Group controlId="products" className="data-group" style={{ width: '100%' }}>
                                <Form.Label className="data-label">{local.productName}</Form.Label>
                                <Row>
                                    <Col sm={10}>
                                        <Select
                                            name="products"
                                            data-qc="products"
                                            styles={theme.selectStyle}
                                            value={this.state.selectedProducts}
                                            isMulti
                                            isSearchable={true}
                                            filterOption={customFilterOption}
                                            placeholder={
                                                <span style={{ width: "100%", padding: "5px", margin: "5px" }}>
                                                    <img
                                                        style={{ float: "right" }}
                                                        alt="search-icon"
                                                        src={require("../../Assets/searchIcon.svg")}
                                                    />{" "}
                                                    {local.searchByProductName}
                                                </span>
                                            }
                                            onChange={(event: any) => {
                                                this.setState({
                                                    selectedProducts: event,
                                                    branchesNotHaveProducts: [],
                                                    branchesHaveProductsIds:[],
                                                    branches: [],
                                                    selectedBranches: [],
                                                })

                                            }}
                                            getOptionLabel={(option) => option.productName}
                                            getOptionValue={(option) => option._id}
                                            options={this.state.products}
                                        />
                                    </Col>
                                    <Col sm={2}><Button disabled={this.state.selectedProducts.length < 1} onClick={this.getBranchesForProducts}>{local.showBranches}</Button> </Col>
                                </Row>
                            </Form.Group>
                            {(this.state.selectedBranches.length > 0 || this.state.branchesNotHaveProducts.length > 0) &&
                                <DualBox
                                    labelKey={"name"}
                                    options={this.state.branches}
                                    selected={this.state.selectedBranches}
                                    onChange={(list) => this.handleChange(list)}
                                    filterKey={'noKey'}
                                    rightHeader={local.availableBranches}
                                    leftHeader={local.selectedBranches}
                                />
                            }
                            <Row style= {{justifyContent:'center'}}>
                            <Button type="button" style={{ margin: 10, width: '10%', }} disabled={this.state.isDisabled} onClick = {this.submit} >{local.submit}</Button> </Row>
                            </Form>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}
export default withRouter(AssignProductsToBranches);
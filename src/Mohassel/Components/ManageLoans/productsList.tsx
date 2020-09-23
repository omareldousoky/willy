import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageLoansArray } from './manageLoansInitials';
import { Formula } from '../LoanApplication/loanApplicationCreation';
import Form from 'react-bootstrap/Form';
import { getDetailedProducts } from '../../Services/APIs/loanProduct/getProduct';

interface Props {
    history: any;
    data: any;
    totalCount: number;
    searchFilters: any;
    search: (data) => void;
    setLoading: (data) => void;
    setSearchFilters: (data) => void;
    branchId?: string;
    withHeader: boolean;

};
interface State {
    loading: boolean;
    products: Array<Formula>;
    filterProducts: string;
    manageLoansTabs: any[];
}

class LoanProducts extends Component<Props, State> {
    mappers: { title: string; key: string; render: (data: any) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            products: [],
            filterProducts: '',
            manageLoansTabs: []
        }
        this.mappers = [
            {
                title: local.name,
                key: "name",
                render: data => data.name
            },
            {
                title: local.branches,
                key: "branches",
                render: data => (data.branches) ? data.branches : 0
            },
            {
                title: '',
                key: "actions",
                render: (data) => this.renderIcons(data)
            },
        ]
    }
    componentDidMount() {
        this.getProducts()
        this.setState({manageLoansTabs: manageLoansArray()})
    }
    renderIcons(data: any) {
        return (
            <>
                <img style={{cursor: 'pointer', marginLeft:"30px"}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => { this.props.history.push({ pathname: "/manage-loans/loan-products/view-product", state: { id: data.id } }) }}></img>
                <Can I='updateLoanProduct' a='product'><img style={{cursor: 'pointer', marginLeft:"30px"}}  alt={"edit"} src={require('../../Assets/editIcon.svg')}  onClick={() => { this.props.history.push({ pathname: "/manage-loans/loan-products/edit-loan-product", state: { id: data.id } }) }}></img></Can>
            </>
        );
    }
    async getProducts() {
        this.setState({ loading: true });
        const products = await getDetailedProducts();
        if (products.status === 'success') {
            this.setState({
                products: products.body.data,
                loading: false
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.loanProducts}
                    array={this.state.manageLoansTabs}
                    active={this.state.manageLoansTabs.map(item => {return item.icon}).indexOf('loanProducts')}
                />
                <Card style={{ margin: '20px 50px' }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.loanProducts}</Card.Title>
                                <span className="text-muted">{local.noOfLoanProducts + ` (${this.state.products.length})`}</span>
                            </div>
                            <div>
                                <Can I='createLoanProduct' a='product'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/manage-loans/loan-products/new-loan-product')}>{local.createLoanProduct}</Button></Can>
                                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
                            </div>
                        </div>
                        <hr className="dashed-line" />
                        {this.state.products.length > 0 && <div className="d-flex flex-row justify-content-center">
                            <Form.Control
                                type="text"
                                data-qc="filterProducts"
                                placeholder={local.search}
                                style={{ marginBottom: 20, width: '60%' }}
                                maxLength={100}
                                value={this.state.filterProducts}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterProducts: e.currentTarget.value })}
                            />
                        </div>}
                        <DynamicTable
                            totalCount={0}
                            mappers={this.mappers}
                            pagination={false}
                            data={this.state.products.filter(product => product.name.toLocaleLowerCase().includes(this.state.filterProducts.toLocaleLowerCase()))}
                        />
                    </Card.Body>
                </Card>
            </div>
        )
    }
}



export default withRouter(LoanProducts);
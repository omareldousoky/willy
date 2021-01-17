import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageLoansArray } from './manageLoansInitials';
import { getErrorMessage, interestType } from "../../../Shared/Services/utils";
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { Formula } from '../LoanApplication/loanApplicationCreation';
import Form from 'react-bootstrap/Form';

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
    size: number;
    from: number;
    loading: boolean;
    formulas: Array<Formula>;
    filterFormulas: string;
    manageLoansTabs: any[];
}

class FormulaList extends Component<Props, State> {
    mappers: { title: string; key: string; render: (data: any) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            size: 5,
            from: 0,
            loading: false,
            formulas: [],
            filterFormulas: '',
            manageLoansTabs: []
        }
        this.mappers = [
            {
                title: local.name,
                key: "name",
                render: data => data.name
            },
            {
                title: local.interestType,
                key: "interest_type",
                render: data => interestType(data.interest_type)
            },
            {
                title: '',
                key: "actions",
                render: (data) => this.renderIcons(data)
            },
        ]
    }
    componentDidMount() {
        this.getFormulas()
        this.setState({manageLoansTabs: manageLoansArray()})
    }
    renderIcons(data: any) {
        return (
            <>
                <img style={{cursor: 'pointer'}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => { this.props.history.push({ pathname: "/manage-loans/calculation-formulas/view-formula", state: { id: data._id } }) }}></img>
            </>
        );
    }
    async getFormulas() {
        this.setState({ loading: true });
        const formulas = await getFormulas();
        if (formulas.status === 'success') {
            this.setState({
                formulas: formulas.body.data,
                loading: false
            })
        } else {
            this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(formulas.error.error), 'error'));
        }
    }
    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.loanProducts}
                    array={this.state.manageLoansTabs}
                    active={this.state.manageLoansTabs.map(item =>  {return item.icon}).indexOf('calculationForumlas')}
                />
                <Card style={{ margin: '20px 50px' }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.calculationForumlas}</Card.Title>
                                <span className="text-muted">{local.noOfCalculationFormulas + ` (${this.state.formulas.length})`}</span>
                            </div>
                            <div>
                                <Can I='createCalculationFormula' a='product'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/manage-loans/calculation-formulas/new-formula')}>{local.createCalculationMethod}</Button></Can>
                                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
                            </div>
                        </div>
                        <hr className="dashed-line" />
                        {this.state.formulas.length > 0 && <div className="d-flex flex-row justify-content-center">
                            <Form.Control
                                type="text"
                                data-qc="filterFormulas"
                                placeholder={local.search}
                                style={{ marginBottom: 20, width: '60%' }}
                                maxLength={100}
                                value={this.state.filterFormulas}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterFormulas: e.currentTarget.value })}
                            />
                        </div>}
                        <DynamicTable
                            totalCount={0}
                            mappers={this.mappers}
                            pagination={false}
                            data={this.state.formulas.filter(formula => formula.name.toLocaleLowerCase().includes(this.state.filterFormulas.toLocaleLowerCase()))}
                        />
                    </Card.Body>
                </Card>
            </div>
        )
    }
}



export default withRouter(FormulaList);
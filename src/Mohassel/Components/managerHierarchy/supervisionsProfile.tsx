import React, { Component, CSSProperties } from 'react'
import { 
    withRouter } from 'react-router-dom';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { theme } from '../../../theme'
import Table from 'react-bootstrap/Table';
import './managerHierarchy.scss'
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    history: any;
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;
}
interface State {
    data: {
        id: string;
        branchId: string;
        startDate: number;
        groups: OfficersGroup[];
    };
    loanOfficers: Map<string, string>;
    loading: boolean;
}
const header: CSSProperties = {
    textAlign: "right",
    fontSize: "14px",
    fontWeight:"bold",
    width: "15%",
    color: theme.colors.lightGrayText
}
const cell: CSSProperties = {
    textAlign: "right",
    padding: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: theme.colors.blackText,

}
 class SupervisionsProfile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            loanOfficers: new Map(),
            data: {
                id: "",
                branchId: "",
                startDate: 0,
                groups: [{
                    id:'',
                leader:'5f3d3f03418a3a8fe4376399',
                officers: ['5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db', '5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db', '5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db','5ec28990d1aabc09c46c45db'],
                status:'pending',

            }]
            },
        }
    }


    componentDidMount() {
        this.getLoanOfficers();
    }

    async getLoanOfficers() {
        this.setState({ loading: true })
        const obj = {
            branchId: this.props.branchId,
            from: 0,
            size: 1000,
        };
        const res = await searchLoanOfficer(obj);
        if (res.status === "success") {
            const data: any[] = res.body.data;
            const officers = new Map()
            data.map((officer, index) => {
                return (officers.set(officer._id, officer.name));

            })
            this.setState({
                loanOfficers: officers,
            })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <div>
                <div style={{paddingLeft: 30 }}>
                    <div style={{ cursor: 'pointer', margin: 20,display:'flex'}}><img style={{marginLeft:'10px'}} alt={'edit'} src={require('../../Assets/editIcon.svg')}  onClick={()=>this.props.history.push('/manage-accounts/branches/edit-groups',{
                              branchId: this.props.branchId,
                              branchCode: this.props.branchCode,
                              createdAt: this.props.createdAt,
                              status:this.props.status,
                    })} />{local.editSuperVisionGroups}</div>
                </div>
                <Table striped bordered hover>
                    {this.state.data.groups.map((group, index) => {
                        return (
                            <tbody style={{ padding: "2rem 0" , textAlign:"right", fontWeight:'bold'}} key={index}>
                                <tr style={{ height: '50px' }}><td style={header}>{local.groupManager}</td><td>{this.state.loanOfficers.get(group.leader)}</td></tr>
                                <tr style={{ height: '50px' }}><td style={header}>{local.loanOfficerOrCoordinator}</td><td style={cell}>
                                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', flexFlow:'row wrap '}}>
                                    {group.officers.map((officer, i) => {
                                        return (
                                                <div
                                                    key={i}
                                                    className={'labelBtn'}>
                                                    {this.state.loanOfficers.get(officer)}
                                                </div>
                                        )}
                                    )}
                                    </div>
                                    </td></tr>
                            </tbody>
                        )}
                    )}
                </Table>
            </div>
        )
    }
}

export default withRouter(SupervisionsProfile);

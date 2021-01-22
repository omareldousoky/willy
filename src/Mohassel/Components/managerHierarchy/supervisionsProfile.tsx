import React, { Component, CSSProperties } from 'react'
import { 
    withRouter } from 'react-router-dom';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { theme } from '../../../theme'
import Table from 'react-bootstrap/Table';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import './managerHierarchy.scss'
import  local from '../../../Shared/Assets/ar.json';
import { Button, Card } from 'react-bootstrap';
import SupervisionLevelsCreation from './supervisionLevelsCreation';
import BranchBasicsCard from './branchBasicsCard';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';

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
    tabsArray: Array<Tab>;
    activeTab: string;
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
            activeTab: 'supervisionDetails',
            tabsArray: [],
            data: {
                id: "",
                branchId: "",
                startDate: 0,
                groups: [{
                    id:'',
                leader:'',
                officers: [],
                status:'',

            }]
            },
        }
    }


    componentDidMount() {
        this.setState({
            tabsArray:[{
                header: local.levelsOfSupervision,
                stringKey: 'supervisionDetails'
            },
            {
              header: local.createSuperVisionGroups,
              stringKey: 'createSuperVisionGroups',
            },
            {
                header: local.editSuperVisionGroups,
                stringKey: 'editSuperVisionGroups'
            },
            {
             header: local.deleteSuperVisionGroups,
             stringKey: 'deleteSuperVisionGroups'   
            },
            {
                header: local.approveSuperVisionGroups,
                stringKey: 'approveSuperVisionGroups'
            },{
                header: local.unApproveSuperVisionGroups,
                stringKey: 'unApproveSuperVisionGroups'
            }
            ]
        })
        this.getLoanOfficers();
        this.getGroups();
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
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            if (res.body.data)
                this.setState({
                  data: res.body.data,
                })
        }
        this.setState({ loading: false })
    }
  renderMainInfo(){
      return (
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
                        <tr style={{ height: '50px' }}><td style={header}>{local.status}</td><td style={cell}>{group.status ? local[group.status]:null}</td></tr>
                </tbody>
            )}
        )}
    </Table>
      )
  }
  renderContent(){
      switch (this.state.activeTab) {
          case 'supervisionDetails':
            return  this.renderMainInfo();
         case 'createSuperVisionGroups': 
            return <SupervisionLevelsCreation  
            branchId={this.props.branchId} 
            mode={'create'}
            />
         case 'editSuperVisionGroups':
             return <SupervisionLevelsCreation 
             branchId={this.props.branchId}
             mode={'edit'}
             />   
          default:
              return null;
      }
  }
    render() {
        return (
            <>
                <Card>
                    <CardNavBar
                        header={'here'}
                        array={this.state.tabsArray}
                        active={this.state.activeTab}
                        selectTab={(stringKey: string) => { this.setState({ activeTab: stringKey }) }}
                    />
                    <Card.Title>
                    <BranchBasicsCard
                    name={this.props.name}
                    branchCode={this.props.branchCode}
                    createdAt={this.props.createdAt}
                    status={this.props.status}
                />
                    </Card.Title>
                <Card.Body>
                    {this.renderContent()}
                </Card.Body>
            </Card>
            </>
        )
    }
}

export default withRouter(SupervisionsProfile);

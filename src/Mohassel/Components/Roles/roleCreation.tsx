import React, { Component } from 'react';
import { getRoles } from '../../Services/APIs/Roles/roles';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

interface Props {
    application: any;
    test: boolean;
}
interface State {
    roles: any;
    loading: boolean;
    noOfInstallments: number;
    withInterest: boolean;
    postponementInterest: number;
    payWhere: string;
}
class RoleCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            roles: [],
            loading: false,
            noOfInstallments: 0,
            withInterest: false,
            postponementInterest: 0,
            payWhere: ''
        };
    }
    componentDidMount() {
        this.getRoles();
    }
    async getRoles() {
        this.setState({ loading: true })
        const res = await getRoles();
        if (res.status === "success") {
            this.setState({
                loading: false,
                roles: res.body.actions
            })
        } else {
            this.setState({ loading: false })
        }
    }
    check(e,parent,val){
        console.log(e, parent, val)
    }
    render() {
        console.log(this.state.roles)
        return (
            <div style={{ textAlign: 'right' }}>
                <Loader type="fullsection" open={this.state.loading} />
                <p>
                    Roles
                </p>
                <div>
                    <>
                        {this.state.roles.map((obj, i) =>
                            <Table key={i}>
                                <thead>
                                    <tr>
                                        <th style={{width:'30%'}}>{obj.i18n.ar}</th>
                                        <th style={{width:'15%'}}>C</th>
                                        <th style={{width:'15%'}}>R</th>
                                        <th style={{width:'15%'}}>U</th>
                                        <th style={{width:'15%'}}>D</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obj.actions.map((action, i) =>
                                        <tr key={i}>
                                            <td style={{width:'30%'}}>{action.i18n.ar}</td>
                                            <td style={{width:'15%'}}>{(action.create)? <Form.Check type='checkbox' onClick={(e)=>this.check(e.currentTarget,obj.key,action.create)}></Form.Check>:''}</td>
                                            <td style={{width:'15%'}}>{(action.get)? <Form.Check type='checkbox'></Form.Check>:''}</td>
                                            <td style={{width:'15%'}}>{(action.update)? <Form.Check type='checkbox'></Form.Check>:''}</td>
                                            <td style={{width:'15%'}}>{(action.delete)? <Form.Check type='checkbox'></Form.Check>:''}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </>
                </div>
            </div>
        )
    }
}
export default RoleCreation;
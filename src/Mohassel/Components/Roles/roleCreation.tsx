import React, { Component } from 'react';
import { getRoles } from '../../Services/APIs/Roles/roles';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
interface Section {
    _id: string;
    key: string;
    i18n: any;
    actions: Array<any>;
}
interface Props {
    application: any;
    test: boolean;
}
interface State {
    sections: Array<Section>;
    loading: boolean;
    permissions: any;
}
class RoleCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            sections: [],
            loading: false,
            permissions: {},
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
                sections: res.body.actions
            })
        } else {
            this.setState({ loading: false })
        }
    }
    check(e, parent, val) {
        console.log(e, parent, val)
        const perms = { ...this.state.permissions }
        if (e) {
            if (!Object.keys(perms).includes(parent)) {
                perms[parent] = [];
            }
            if (!perms[parent].includes(val)) {
                perms[parent].push(val)
            }
        } else {
            const index = perms[parent].indexOf(val);
            if (index > -1) {
                perms[parent].splice(index, 1);
                if(perms[parent].length === 0){
                    delete perms[parent]
                }
            }
        }
        this.setState({
            permissions: perms
        }, () => {
            console.log(perms, this.state.permissions)
        })
    }
    checkAll(e, parent, action) {
        const sections = this.state.sections 
        console.log(e, parent, action, sections)
        const section = sections.filter((section)=> section.key === parent)
        console.log(section, section.actions)
    }
    render() {
        return (
            <div style={{ textAlign: 'right' }}>
                <Loader type="fullsection" open={this.state.loading} />
                <p>
                    Roles
                </p>
                <div>
                    <>
                        {this.state.sections.map((obj, i) =>
                            <Table key={i}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '30%' }}>{obj.i18n.ar}</th>
                                        <th style={{ width: '15%' }}><Form.Check type='checkbox' onClick={(e) => this.checkAll(e.currentTarget.checked, obj.key, 'create')}></Form.Check></th>
                                        <th style={{ width: '15%' }}>R</th>
                                        <th style={{ width: '15%' }}>U</th>
                                        <th style={{ width: '15%' }}>D</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obj.actions.map((action, i) =>
                                        <tr key={i}>
                                            <td style={{ width: '30%' }}>{action.i18n.ar}</td>
                                            <td style={{ width: '15%' }}>{(action.create) ? <Form.Check type='checkbox' onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.create)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.get) ? <Form.Check type='checkbox' onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.get)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.update) ? <Form.Check type='checkbox' onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.update)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.delete) ? <Form.Check type='checkbox' onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.delete)}></Form.Check> : ''}</td>
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
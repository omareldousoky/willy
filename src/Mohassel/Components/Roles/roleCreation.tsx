import React, { Component } from 'react';
import { getRoles } from '../../Services/APIs/Roles/roles';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
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
    objectHandler(perms, e, parent, action){
        if (e) {
            console.log('here')
            if (!Object.keys(perms).includes(parent)) {
                console.log('here1')

                perms[parent] = [];
            }
            if (!perms[parent].includes(action)) {
                console.log('here2')

                perms[parent].push(action)
            }
        } else {
            const index = perms[parent].indexOf(action);
            if (index > -1) {
                perms[parent].splice(index, 1);
                if(perms[parent].length === 0){
                    delete perms[parent]
                }
            }
        }
        return perms
    }
    check(e, parent, val) {
        console.log(e, parent, val)
        const perms = { ...this.state.permissions }
        const newPerms = this.objectHandler(perms, e, parent,val)
        this.setState({
            permissions: newPerms
        })
    }
    checkAll(e, parent, action) {
        const sections = this.state.sections 
        const section = sections.find((section)=> section.key === parent)
        const actionsInRelation = section?.actions.filter((obj)=>  Object.keys(obj).includes(action))
        let perms = { ...this.state.permissions }
        actionsInRelation?.forEach(elem => {
            console.log(e,parent,elem , elem[action])
            const newPerms = this.objectHandler(perms,e,parent,elem[action])
            perms = newPerms
        })
        this.setState({
            permissions: perms
        })
    }
    render() {
        return (
            <div style={{ textAlign: 'right' }}>
                <Loader type="fullsection" open={this.state.loading} />
                <p>
                    Roles
                </p>
                <div style={{ width:'50%' , backgroundColor: '#fafafa'}}>
                    <>
                        {this.state.sections.map((obj, i) =>
                            <Table key={i}>
                                <thead>
                                    <tr style={{ backgroundColor: 'grey', color: 'white'}}>
                                        <th style={{ width: '30%' }}>{obj.i18n.ar}</th>
                                        <th style={{ width: '15%' }}><Form.Check type='checkbox' onClick={(e) => this.checkAll(e.currentTarget.checked, obj.key, 'create')}></Form.Check></th>
                                        <th style={{ width: '15%' }}><Form.Check type='checkbox' onClick={(e) => this.checkAll(e.currentTarget.checked, obj.key, 'get')}></Form.Check></th>
                                        <th style={{ width: '15%' }}><Form.Check type='checkbox' onClick={(e) => this.checkAll(e.currentTarget.checked, obj.key, 'update')}></Form.Check></th>
                                        <th style={{ width: '15%' }}><Form.Check type='checkbox' onClick={(e) => this.checkAll(e.currentTarget.checked, obj.key, 'delete')}></Form.Check></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obj.actions.map((action, i) =>
                                        <tr key={i}>
                                            <td style={{ width: '30%' }}>{action.i18n.ar}</td>
                                            <td style={{ width: '15%' }}>{(action.create) ? <Form.Check type='checkbox' checked={this.state.permissions[obj.key] && this.state.permissions[obj.key].includes(action.create)} onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.create)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.get) ? <Form.Check type='checkbox' checked={this.state.permissions[obj.key] && this.state.permissions[obj.key].includes(action.get)} onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.get)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.update) ? <Form.Check type='checkbox' checked={this.state.permissions[obj.key] && this.state.permissions[obj.key].includes(action.update)} onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.update)}></Form.Check> : ''}</td>
                                            <td style={{ width: '15%' }}>{(action.delete) ? <Form.Check type='checkbox' checked={this.state.permissions[obj.key] && this.state.permissions[obj.key].includes(action.delete)} onClick={(e) => this.check(e.currentTarget.checked, obj.key, action.delete)}></Form.Check> : ''}</td>
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
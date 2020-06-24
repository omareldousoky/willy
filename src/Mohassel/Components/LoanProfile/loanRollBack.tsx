import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { getRollableActionsById, rollbackActionByID } from '../../Services/APIs/loanApplication/rollBack';
import Card from 'react-bootstrap/Card';
import * as local from '../../../Shared/Assets/ar.json';
import { getDateAndTime } from '../../Services/getRenderDate';
import BackButton from '../BackButton/back-button';

interface State {
    loading: boolean;
    actions: any;
    applicationId: string;
}
interface Props {
    history: any;
    location: any;
}
class LoanRollBack extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            actions: [],
            applicationId: ''
        }
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppRollableActionsByID(appId)
    }
    async getAppRollableActionsByID(id) {
        this.setState({ loading: true });
        const application = await getRollableActionsById(id);
        if (application.status === 'success') {
            this.setState({
                actions: application.body.RollbackObjects,
                applicationId: id,
                loading: false
            })
        } else {
            Swal.fire('', 'fetch error', 'error');
            this.setState({ loading: false });
        }
    }
    async rollbackAction(id) {
        this.setState({ loading: true });
        const application = await rollbackActionByID({ actionId: id }, this.state.applicationId);
        if (application.status === 'success') {
            this.setState({ loading: false })
            Swal.fire('', local.rollbackSuccess, 'success').then(() => this.props.history.goBack())
        } else {
            Swal.fire('', local.rollbackError, 'error');
            this.setState({ loading: false });
        }
    }
    rollbackConfirmation(id) {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.willBeRolledBAck}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.rollBackAction
        }).then((result) => {
            if (result.value) {
                this.rollbackAction(id)
            }
        })
    }
    sortByKey(array, key) {
        return array.sort((a, b) => {
            const x = a[key];
            const y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    render() {
        return (
            <>
                <BackButton title={local.previousActions} />
                <Loader type="fullscreen" open={this.state.loading} />
                <Card style={{ textAlign: 'right', padding: 20 }} className="d-flex align-items-center">
                    {this.state.actions ? <div style={{ width: '70%' }}>
                        <div className="d-flex" style={{ margin: '20px 0px', padding: 10, borderBottom: '1px solid' }}>
                            <p style={{ width: '40%', margin: 0 }}>{local.actionType}</p>
                            <p style={{ width: '40%', margin: 0 }}>{local.actionDate}</p>
                            <p style={{ width: '20%', margin: 0 }}></p>
                        </div>
                        {this.sortByKey(this.state.actions, 'insertedAt').map((action, i) => <div key={action._id} className="d-flex" style={{ margin: '10px 0px' }}>
                            <p style={{ width: '40%', margin: 0 }}>{action.action}</p>
                            <p style={{ width: '40%', margin: 0 }}>{getDateAndTime(action.insertedAt)}</p>
                            <div className="d-flex align-items-center" style={{ width: '20%' }}>{i === 0 && <span className="fa fa-undo" style={{ cursor: 'pointer' }} onClick={() => this.rollbackConfirmation(action._id)}></span>}</div>
                        </div>)}
                    </div> : <p>{local.noRollableActions}</p>}
                </Card>
            </>
        )
    }
}
export default withRouter(LoanRollBack);

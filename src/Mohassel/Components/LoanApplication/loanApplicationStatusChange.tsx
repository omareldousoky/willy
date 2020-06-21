import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import StatusHelper from './statusHelper';
import { rejectApplication, undoreviewApplication, reviewApplication } from '../../Services/APIs/loanApplication/stateHandler';
import * as local from '../../../Shared/Assets/ar.json';
interface State {
    prevId: string;
    loading: boolean;
    application: any;

}
interface Props {
    history: any;
    location: any;
}
class LoanStatusChange extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            prevId: '',
            application: {},
            loading: false,
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getAppByID(id) {
        this.setState({ loading: true });
        const application = await getApplication(id);
        if (application.status === 'success') {
            this.setState({
                application: application.body,
                loading: false
            })
        } else {
            Swal.fire('', 'fetch error', 'error');
            this.setState({ loading: false });
        }
    }
    async handleStatusChange(values, status) {
        this.setState({ loading: true });
        if (status === 'review') {
            const res = await reviewApplication({ id: this.state.application._id, date: new Date(values.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.reviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'unreview') {
            const res = await undoreviewApplication({ id: this.state.application._id, date: new Date(values.unreviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.unreviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'reject') {
            const res = await rejectApplication({ applicationIds: [this.state.application._id], rejectionDate: new Date(values.rejectionDate).valueOf(), rejectionReason: values.rejectionReason });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.rejectSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        }
    }
    render() {
        return (
            <Container style={{ textAlign: 'right' }}>
                <Loader type="fullscreen" open={this.state.loading} />
                {Object.keys(this.state.application).length > 0 && <div>
                    <StatusHelper status={this.props.history.location.state.action} id={this.state.application._id} handleStatusChange={(values, status) => { this.handleStatusChange(values, status) }} application={this.state.application} />
                </div>}
            </Container>
        )
    }
}
export default withRouter(LoanStatusChange);

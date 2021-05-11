import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import StatusHelper from './statusHelper';
import { rejectApplication, undoreviewApplication, reviewApplication } from '../../Services/APIs/loanApplication/stateHandler';
import * as local from '../../../Shared/Assets/ar.json';
import { getGeoAreasByBranch } from '../../Services/APIs/GeoAreas/getGeoAreas';
import { getErrorMessage } from '../../../Shared/Services/utils';
import {
  BranchDetails,
  BranchDetailsResponse,
  getBranch,
} from '../../Services/APIs/Branch/getBranch';
interface State {
    prevId: string;
    loading: boolean;
    application: any;
    geoAreas: Array<any>;
    branchDetails?: BranchDetails;
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
            geoAreas: []
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getBranchData(branchId: string) {
        const res = await getBranch(branchId)
        if (res.status === 'success') {
          this.setState({
            branchDetails: (res.body as BranchDetailsResponse)?.data,
          })
        } else {
          const err = res.error as Record<string, string>
          Swal.fire('Error !', getErrorMessage(err.error), 'error')
        }
    }
    async getAppByID(id) {
        this.setState({ loading: true });
        const application = await getApplication(id);
        if (application.status === 'success') {
            if(application.body.guarantors.length > 0) this.getGeoAreas(application.body.branchId)
            this.getBranchData(application.body.branchId)
            this.setState({
                application: application.body,
                loading: false
            })
        } else {
            Swal.fire('', 'fetch error', 'error');
            this.setState({ loading: false });
        }
    }
    async getGeoAreas(branch) {
        this.setState({ loading: true })
        const resGeo = await getGeoAreasByBranch(branch);
        if (resGeo.status === "success") {
            this.setState({ loading: false, geoAreas: resGeo.body.data })
        } else this.setState({ loading: false })
    }
    getCustomerGeoArea(geoArea) {
        const geoAreaObject = this.state.geoAreas.filter(area => area._id === geoArea);
        if (geoAreaObject.length === 1) {
            return geoAreaObject[0]
        } else return { name: '-', active: false }
    }
    async handleStatusChange(values, status) {
        this.setState({ loading: true });
        if (status === 'review') {
            const res = await reviewApplication({ id: this.state.application._id, date: new Date(values.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.reviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", getErrorMessage(res.error.error), 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'unreview') {
            const res = await undoreviewApplication({ id: this.state.application._id, date: new Date(values.unreviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.unreviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", getErrorMessage(res.error.error), 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'reject') {
            const res = await rejectApplication({ applicationIds: [this.state.application._id], rejectionDate: new Date(values.rejectionDate).valueOf(), rejectionReason: values.rejectionReason });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.rejectSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", getErrorMessage(res.error.error), 'error')
                this.setState({ loading: false });
            }
        }
    }
    render() {
        return (
            <Container style={{ textAlign: 'right' }}>
                <Loader type="fullscreen" open={this.state.loading} />
                {Object.keys(this.state.application).length > 0 && <div>
                    <StatusHelper status={this.props.history.location.state.action} id={this.state.application._id} handleStatusChange={(values, status) => { this.handleStatusChange(values, status) }} application={this.state.application} getGeoArea={(area) => this.getCustomerGeoArea(area)} branchName={this.state.branchDetails?.name} />
                </div>}
            </Container>
        )
    }
}
export default withRouter(LoanStatusChange);

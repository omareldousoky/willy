import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import { getApplicationLogs } from '../../Services/APIs/loanApplication/applicationLogs';

interface Props {
    id: string;
}

interface State {
    loading: boolean;
    data: any;
}

class Logs extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        }
    }
    componentDidMount() {
        this.getLogs(this.props.id)
    }
    async getLogs(id) {
        this.setState({ loading: true })
        const res = await getApplicationLogs(id);
        if (res.status === "success") {
          this.setState({
            data: res.body.applications,
            loading: false
          })
        } else {
          console.log("error")
          this.setState({ loading: false })
        }
    }
    render() {
        return (
            <>
                <Loader type="fullsection" open={this.state.loading} />

            </>
        )
    }
}
export default Logs;
import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import { getApplicationLogs } from '../../Services/APIs/loanApplication/applicationLogs';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
interface Props {
    id: string;
}

interface State {
    loading: boolean;
    data: any;
}
const mappers = [
    {
      title: local.action,
      key: "action",
      render: data => data.action
    },
    {
      title: local.author,
      key: "authorName",
      render: data => data.authorName
    },
    {
      title: local.authorId,
      key: "authorId",
      render: data => data.authorId
    },
    {
      title: local.createdAt,
      key: "createdAt",
      render: data => getRenderDate(data.createdAt)
    },
    // {
    //   title: local.customerId,
    //   key: "customerId",
    //   render: data => data.customerId
    // },
    // {
    //     title: local.customerBranchId,
    //     key: "customerBranchId",
    //     render: data => data.customerBranchId
    //   },
  ]
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
                data: res.body.data,
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
                {this.state.data.length > 0 &&
                    <DynamicTable totalCount={0} pagination={false} data={this.state.data} mappers={mappers} />

                // this.state.data.map((log, i) =>
                // <div key={i} className='d-flex justify-content-between'>
                //     <p>{log.action}</p>
                //     <p>{log.authorId}</p>
                //     <p>{log.authorName}</p>
                //     <p>{log.createdAt}</p>
                //     <p>{log.customerId}</p>
                // </div>)
                }
            </>
        )
    }
}
export default Logs;
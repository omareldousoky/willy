import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import { getApplicationLogs } from '../../Services/APIs/loanApplication/applicationLogs';
import DynamicTable from '../DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getDateAndTime } from '../../Services/getRenderDate';
interface Props {
    id: string;
}

interface State {
    loading: boolean;
    data: any;
    from: number;
    size: number;
    totalCount: number;
}
const mappers = [
    {
      title: local.action,
      key: "action",
      render: data => data.action ?  data.action : ''
    },
    {
      title: local.author,
      key: "authorName",
      render: data => data.trace?.userName ? data.trace.userName : ''
    },
    {
      title: local.authorId,
      key: "authorId",
      render: data => data.trace?.by ? data.trace.by : ''
    },
    {
      title: local.createdAt,
      key: "createdAt",
      render: data => data.trace?.at ?  getDateAndTime(data.trace.at) : ''
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
            data: [],
            size: 5,
            from: 0,
            totalCount: 0
        }
    }
    componentDidMount() {
        this.getLogs(this.props.id)
    }
    async getLogs(id) {
        this.setState({ loading: true })
        const res = await getApplicationLogs(id,this.state.size ,this.state.from);
        if (res.status === "success") {
            this.setState({
                data: res.body.data?res.body.data:[],
                totalCount: res.body.totalCount,
                loading: false,
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
                                  {this.state.data.length > 0 ?
                                        <DynamicTable 
                                        totalCount={this.state.totalCount} 
                                        pagination={true}
                                        data={this.state.data} 
                                        mappers={mappers}
                                        changeNumber={(key: string, number: number) => {
                                            this.setState({ [key]: number } as any, () => this.getLogs(this.props.id));
                                        }}
                                         />
                    :
                <p style={{textAlign: 'center'}}>{local.noLogsFound}</p>
                }
            </>
        )
    }
}
export default Logs;
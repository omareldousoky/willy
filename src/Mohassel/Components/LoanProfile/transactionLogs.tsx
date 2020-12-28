import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import { getApplicationTransactionLogs } from '../../Services/APIs/loanApplication/applicationLogs';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import * as local from '../../../Shared/Assets/ar.json';
import { getDateAndTime } from '../../Services/getRenderDate';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
interface Props {
    id: string;
}

interface State {
    loading: boolean;
    data: any;
    from: number;
    size: number;
    totalCount: number;
    pageToken: string;
}
const mappers = [
    {
      title: local.action,
      key: "action",
      render: data => data.action ?  data.action : ''
    },
    {
      title: local.manualPayment,
      key: "manualPayment",
      render: data => data.manualPayment ?  local.yes : local.no
    },
    {
      title: local.author,
      key: "authorName",
      render: data => data?.created.userName ? data.created.userName : ''
    },
    {
      title: local.amount,
      key: "authorId",
      render: data => data?.transactionAmount ? data.transactionAmount : 0
    },
    {
      title: local.createdAt,
      key: "createdAt",
      render: data => data?.truthDate ?  getDateAndTime(data.truthDate) : ''
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
class TransactionLogs extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            size: 10,
            from: 0,
            totalCount: 0,
            pageToken: ''
        }
    }
    componentDidMount() {
        this.getLogs(this.props.id)
    }
    async getLogs(id) {
        this.setState({ loading: true })
        const res = await getApplicationTransactionLogs(id,this.state.size , this.state.pageToken);
        if (res.status === "success") {
            this.setState({
                data: res.body.data?res.body.data:[],
                totalCount: res.body.totalCount,
                pageToken: res.body.pageToken,
                loading: false,
            })
        } else {
            this.setState({ loading: false }, () => Swal.fire("Error !",getErrorMessage(res.error.error),'error'))
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
export default TransactionLogs;
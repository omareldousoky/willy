import React, { Component } from 'react'
import { connect } from 'react-redux'
import Card from 'react-bootstrap/Card'
import * as local from '../../../../Shared/Assets/ar.json'
import Button from 'react-bootstrap/Button'
import { Loader } from '../../../../Shared/Components/Loader'
import Swal from 'sweetalert2'
import { getErrorMessage, timeToDateyyymmdd } from '../../../../Shared/Services/utils'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import ability from '../../../config/ability'
import SearchBlocking from './searchBlocking'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import { search, searchFilters } from '../../../../Shared/redux/search/actions'
import { loading } from '../../../../Shared/redux/loading/actions'
import { FormCheck } from 'react-bootstrap'
interface Props extends RouteComponentProps {
    history: any;
    data: Branch[];
    totalCount: number;
    searchFilters: object;
    search: (data) => Promise<void>;
    error: string;
    loading: boolean;
    setLoading: (data) => void;
}
interface Branch {
    id: string;
    branchCode: number;
    name: number;
    status: string;
    blockDate: string;
    created?: {
        at?: number;
        by?: string;
    };
    updated?: {
        at?: number;
        by?: string;
        userName?: string;
    };

}
interface State {
    loading: boolean;
    chosenStatus: string;
    size: number;
    from: number;
    selectedBranches: Branch[];
    checkAll: boolean;
    blockDateFilter: string;
}

const today: Date = new Date();

class LtsBlocking extends Component<Props, State> {
    mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            chosenStatus: 'block',
            size: 10,
            from: 0,
            selectedBranches: [],
            checkAll: false,
            blockDateFilter: 'exact'
        }
        this.mappers = [
            {
                title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
                key: 'selected',
                render: data => <FormCheck
                  type="checkbox"
                  checked={Boolean(this.state.selectedBranches.find(branch => branch.id === data.id))}
                  onChange={() => this.addRemoveItemFromChecked(data)}
                ></FormCheck>
              },
              {
                title: local.oneBranch,
                key: 'branch',
                render: data => data.branchName,
        
              },
              {
                 title: local.branchCode,
                 key:'branchCode',
                 render: data => data.branchCode,
              },
              {
                  title: local.blockDate,
                  key: 'blockDate',
                  render: data => data?.blockDate > 0  ? timeToDateyyymmdd(data.blockDate): null
              },
              {
                  title: local.status,
                  key:'status',
                  render: data => this.getStatus(data.status),
              },
        ]
    }
    // async Block(blockDate: number) {
    //     this.setState({ loading: true })
    //     const res = await financialBlocking({ blockDate })
    //     if (res.status === "success") {
    //         this.setState({ loading: false })
    //         Swal.fire('Success', '', 'success').then(()=> this.props.history.push('/'));
    //     } else {
    //         this.setState({ loading: false })
    //         Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
    //     }
    // }
    addRemoveItemFromChecked(branch) {
        if (this.state.selectedBranches.findIndex(branchItem => branchItem.id == branch.id) > -1) {
          this.setState({
            selectedBranches: this.state.selectedBranches.filter(el => el.id !== branch.id),
          })
        } else {
          this.setState({
            selectedBranches: [...this.state.selectedBranches, branch],
          })
        }
      }
      checkAll(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
          this.setState({ checkAll: true, selectedBranches: this.props.data.filter((branch)=> branch.status ===this.state.chosenStatus) })
        } else this.setState({ checkAll: false, selectedBranches: [] })
      }
    handleSubmit = async (values) => {
        const blockDate = values.blockDate;
        const endOfBlockDate = new Date(blockDate).setHours(23, 59, 59,999).valueOf();
        Swal.fire({
            title: local.areYouSure,
            text: `${local.ltsBlocking}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.ltsBlocking,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
               // await this.Block(endOfBlockDate);
            }
        });
    }
    getBranchBlockingState(){
        this.props.search({...this.props.searchFilters,url:'block',size: this.state.size, from: this.state.from})
    }
    getStatus(status: string) {
        switch (status) {
          case 'blocked':
            return <div className="status-chip outline rejected w-25">{local.blocked}</div>
          case 'unblocked':
            return <div className="status-chip  outline approved w-25">{local.unblocked}</div>
          default: return null;
        }
      }
    render() {
        console.log(this.props.data)
        return (
            <Card className="main-card">
                <Loader type="fullscreen" open={this.state.loading} />
                <Card.Header className="d-flex justify-content-between px-4 py-4 bg-white border-0">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Card.Title className="mx-2 my-0">{local.ltsBlocking}</Card.Title>
                    </div>
                    <div>
                    <Button>{local.blocking}</Button>
                    {(ability.can('financialBlocking','application') || ability.can('financialUnBlocking','application'))&& <Button className="btn-cancel-prev mx-4" >{local.oracleReports}</Button>}
                    <Button className="btn-cancel-prev" onClick={() => this.props.history.push('/reports')}>{local.reviewFinancialState}</Button>
                    </div>
                </Card.Header>
                <Card.Body className="mx-2 my-0 p-0">
                    <div  className="mx-2 my-0">
                    <SearchBlocking
                    from={0}
                    size={10}
                     /> </div>
                     {this.props.data &&
                     <DynamicTable
                     mappers={this.mappers}
                     from={this.state.from}
                     size={this.state.size}
                     totalCount={this.props.totalCount}
                     data={this.props.data}
                     pagination
                     url="block"
                     changeNumber={(key: string, number: number) => {
                        this.setState({ [key]: number } as unknown as Pick<State, keyof State>,()=> this.getBranchBlockingState())
                      }}
                     />
                    }
                </Card.Body>
            </Card>
        )
    }
}
const addSearchToProps = dispatch => {
    return {
      search: data => dispatch(search(data)),
      setSearchFilters: data => dispatch(searchFilters(data)),
      setLoading: data => dispatch(loading(data))
    };
  };
  const mapStateToProps = state => {
    return {
      data: state.search.data,
      error: state.search.error,
      totalCount: state.search.totalCount,
      loading: state.loading,
    };
  };
  
  export default connect(mapStateToProps,addSearchToProps)(withRouter(LtsBlocking));
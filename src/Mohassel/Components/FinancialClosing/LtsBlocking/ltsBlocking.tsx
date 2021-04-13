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
import SearchBlocking, { BlockingObj } from './searchBlocking'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import { search, searchFilters } from '../../../../Shared/redux/search/actions'
import { loading } from '../../../../Shared/redux/loading/actions'
import { FormCheck } from 'react-bootstrap'
import LtsBlockingModal from './ltsBlockingModal'
import { financialUnlBlocking } from '../../../Services/APIs/loanApplication/financialClosing'
import Pagination from '../../pagination/pagination'

interface Props extends RouteComponentProps {
    history: any;
    data: Branch[];
    totalCount: number;
    searchFilters: BlockingObj;
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
    showModal: boolean;
    size: number;
    from: number;
    selectedBranches: Branch[];
    blockDate?: number;
    checkAll: boolean;
    blockDateFilter: string;
}

const today: Date = new Date();

class LtsBlocking extends Component<Props, State> {
  mappers: {
    title: (() => void) | string;
    key: string;
    sortable?: boolean;
    render: (data: any) => void;
  }[]
  constructor(props: Props) {
    super(props)
    this.state = {
      showModal: false,
      size: 10,
      from: 0,
      selectedBranches: [],
      checkAll: false,
      blockDateFilter: 'exact',
    }
    this.mappers = [
      {
        title: () => (
          <FormCheck
            type="checkbox"
            onChange={(e) => this.checkAll(e)}
            checked={Boolean(this.state.checkAll)}
          />
        ),
        key: 'selected',
        render: (data) => (
          <FormCheck
            type="checkbox"
            checked={Boolean(
              this.state.selectedBranches.find(
                (branch) => branch.id === data.id
              )
            )}
            onChange={() => this.addRemoveItemFromChecked(data)}
          />
        ),
      },
      {
        title: local.oneBranch,
        key: 'branch',
        render: (data) => data.branchName,
      },
      {
        title: local.branchCode,
        key: 'branchCode',
        render: (data) => data.branchCode,
      },
      {
        title: local.blockDate,
        key: 'blockDate',
        render: (data) =>
          data?.blockDate > 0 ? timeToDateyyymmdd(data.blockDate) : null,
      },
      {
        title: local.status,
        key: 'status',
        render: (data) => this.getStatus(data.status),
      },
    ]
  }

  addRemoveItemFromChecked(branch) {
    if (
      this.state.selectedBranches.findIndex(
        (branchItem) => branchItem.id == branch.id
      ) > -1
    ) {
      this.setState({
        selectedBranches: this.state.selectedBranches.filter(
          (el) => el.id !== branch.id
        ),
        checkAll: false,
      })
    } else {
      this.setState({
        selectedBranches: [...this.state.selectedBranches, branch],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedBranches: this.props.data })
    } else this.setState({ checkAll: false, selectedBranches: [] })
  }

  getBranchBlockingState() {
    const {
        status,
        blockDate,
        blockDateFilter,
        branchCode,
        branchName
    } = this.props.searchFilters;
    this.props.search({
      status: (!blockDateFilter && !blockDate) ? status : '',
      blockDate:  blockDateFilter ? blockDate  : 0,
      blockDateFilter: blockDateFilter,
      branchCode: branchCode,
      branchName: branchName,
      url: 'block',
      size: this.state.size,
      from: this.state.from,
    })
  }
  getStatus(status: string) {
    switch (status) {
      case 'blocked':
        return (
          <div className="status-chip outline rejected w-25">
            {local.blocked}
          </div>
        )
      case 'unblocked':
        return (
          <div className="status-chip  outline approved w-25">
            {local.unblocked}
          </div>
        )
      default:
        return null
    }
  }
  handleModal = (modalState: boolean) => {
    this.setState({ showModal: modalState })
  }
  handleBlockClick = async () => {
    const { status, blockDateFilter } = this.props.searchFilters
    if (status === 'blocked' ||  blockDateFilter==="after") {
      Swal.fire({
        title: local.areYouSure,
        text: `${local.ltsUnblocking}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.ltsUnblocking,
        cancelButtonText: local.cancel,
      }).then(async (isConfirm) => {
        if (isConfirm.value) {
            await this.unblock();
        }
     })
    } else {
      this.setState({ showModal: true })
    }
  }
  async unblock(){
    this.props.setLoading(true)
    const res = await financialUnlBlocking({branchesIds: this.state.selectedBranches.map(branch => branch.id)})
    if(res.status==='success'){
      Swal.fire('Success','','success').then(()=> window.location.reload())
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error),'error')
    }
    this.props.setLoading(false)
  }
  render() {
    return (
      <Card className="main-card">
        <Loader type="fullscreen" open={this.props.loading} />
        <Card.Header className="d-flex justify-content-between bg-white border-0">
          <div className="d-flex align-items-center">
            <Card.Title className="mx-2 my-0">{local.ltsBlocking}</Card.Title>
          </div>
          <div>
            {(this.props.searchFilters.status ||
             this.props.searchFilters.blockDateFilter) 
             &&(ability.can('financialBlocking', 'application') ||
             ability.can('financialUnBlocking', 'application')) && <Button
              className="mx-2"
              disabled={!this.state.selectedBranches.length}
              onClick={this.handleBlockClick}
            >
              {this.props.searchFilters.status === 'blocked' || this.props.searchFilters.blockDateFilter ==='after'
                ? local.ltsUnblocking
                : local.ltsBlocking}
            </Button>}
            <Button
              className="btn-cancel-prev"
              onClick={() => this.props.history.push('/reports')}
            >
              {local.reviewFinancialState}
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="mx-2 my-0">
          <div className="my-5">
            <SearchBlocking from={0} size={this.state.size} onSubmit={()=>{this.setState({checkAll: false , selectedBranches:[]})}} />
          </div>
          {this.props.data && (
            <>
            <DynamicTable
              mappers={this.mappers}
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              data={this.props.data}
              pagination={false}
              url="block"
              changeNumber={(key: string, number: number) => {
                this.setState(
                  ({ [key]: number } as unknown) as Pick<State, keyof State>,
                  () => this.getBranchBlockingState()
                )
              }}
            />
            <Pagination
            totalCount={this.props.totalCount}
            pagination={true}
            dataLength={this.props.data.length}
            paginationArr={[10, 100, 500, 1000]}
            changeNumber={(key: string, number: number) => {
              this.setState(
                ({ [key]: number } as unknown) as Pick<State, keyof State>,
                () => this.getBranchBlockingState()
              )
            }}
          />
          </>
          )}
          <LtsBlockingModal
            showModal={this.state.showModal}
            setShoModal={this.handleModal}
            selectedBranches={this.state.selectedBranches.map(
              (branch) => branch.id
            )}
          />
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
      searchFilters: state.searchFilters,
      loading: state.loading,
    };
  };
  
  export default connect(mapStateToProps,addSearchToProps)(withRouter(LtsBlocking));
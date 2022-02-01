import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { ReportsList } from '../../../Shared/Components/ReportsList'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import Can from '../../../Shared/config/Can'
import { manageToolsArray } from './manageToolsInitials'
import {
  getCbeCodesFiles,
  postCbeCodesFile,
} from '../../Services/APIs/CbeCodes/CbeCodes'
import { List } from '../../../Shared/Components/ReportsList/types'

interface State {
  data: List[]
  loading: boolean
}
class CBEFiles extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
    }
  }

  componentDidMount() {
    this.getiScoreReports()
  }

  async getiScoreReports() {
    this.setState({ loading: true })
    const res = await getCbeCodesFiles()
    if (res.status === 'success') {
      this.setState({
        data: res.body?.cbeFiles ?? [],
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.searchError,
        icon: 'error',
      })
      // TODO:lint: (3 in file) remove??
      console.log(res)
    }
  }

  async generateReport() {
    this.setState({ loading: true })
    const res = await postCbeCodesFile()
    if (res.status === 'success') {
      Swal.fire({
        title: local.success,
        text: local.fileQueuedSuccess,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
      this.setState(
        {
          loading: false,
        },
        () => {
          this.getiScoreReports()
        }
      )
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: local.fileQueuedError,
        icon: 'error',
      })
      console.log(res)
    }
  }

  render() {
    const manageToolsTabs = manageToolsArray()
    return (
      <>
        <HeaderWithCards
          header=""
          array={manageToolsTabs}
          active={manageToolsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('business-specialities')}
        />
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />

          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.cbeCodes}
              </Card.Title>
              <Can I="uploadCBEFile" a="customer">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => this.generateReport()}
                >
                  {local.fileUpload}
                </Button>
              </Can>
            </div>
            <ReportsList list={this.state.data} />
          </Card.Body>
        </Card>
      </>
    )
  }
}
export default CBEFiles

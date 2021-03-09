import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import Select from 'react-select'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { getBranches } from '../../Services/APIs/Branch/getBranches'
import { getGeoAreasByBranch } from '../../Services/APIs/GeoAreas/getGeoAreas'
import { addGeoArea } from '../../Services/APIs/GeoAreas/addGeoArea'
import { updateGeoArea } from '../../Services/APIs/GeoAreas/updateGeoArea'
import { Branch } from '../../../Shared/redux/auth/types'
import { manageToolsArray } from '../Tools/manageToolsInitials'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { CRUDList } from '../CRUDList/crudList'
import { theme } from '../../../theme'

interface GeoArea {
  name: string
  disabledUi: boolean
  id: string
  activated: boolean
}
interface State {
  loading: boolean
  branches: Array<any>
  branchAreas: Array<GeoArea>
  branch: Branch
  manageToolsTabs: any[]
}
class GeoAreas extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      branches: [],
      branchAreas: [],
      branch: {
        name: '',
        _id: '',
      },
      manageToolsTabs: [],
    }
  }

  async componentDidMount() {
    await this.getBranches()
    this.setState({ manageToolsTabs: manageToolsArray() })
  }

  async getBranches() {
    this.setState({ loading: true })
    const branches = await getBranches()
    if (branches.status === 'success') {
      this.setState({
        branches: branches.body.data.data,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(branches.error.error), 'error')
      )
    }
  }

  async getBranchAreas() {
    this.setState({ loading: true, branchAreas: [] })
    const branchAreas = await getGeoAreasByBranch(this.state.branch._id)
    if (branchAreas.status === 'success') {
      const areas = branchAreas.body.data
        ? branchAreas.body.data.map((area) => ({
            name: area.name,
            id: area._id,
            activated: area.active,
            disabledUi: true,
          }))
        : []
      this.setState({
        branchAreas: areas.reverse(),
        loading: false,
      })
    } else {
      this.setState(
        {
          loading: false,
        },
        () =>
          Swal.fire(
            'Error !',
            getErrorMessage(branchAreas.error.error),
            'error'
          )
      )
    }
  }

  async editGeoArea(id, name, active) {
    this.setState({ loading: true })
    const res = await updateGeoArea(id, {
      name,
      active,
      branchId: this.state.branch._id,
    })
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => this.getBranchAreas()
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  async newGeoArea(name, active) {
    this.setState({ loading: true })
    const res = await addGeoArea({
      name,
      branchId: this.state.branch._id,
      active,
    })
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => this.getBranchAreas()
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <HeaderWithCards
          header={local.branchAreas}
          array={this.state.manageToolsTabs}
          active={this.state.manageToolsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('branchAreas')}
        />
        <Card className="main-card">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'column',
            }}
          >
            <Form.Group
              as={Row}
              controlId="branch"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <Form.Label column sm={4}>
                {local.branch}
              </Form.Label>
              <Col sm={6}>
                <Select
                  name="branch"
                  data-qc="branch"
                  value={this.state.branch}
                  enableReinitialize={false}
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  onChange={(event: any) => {
                    this.setState({ branch: event }, () =>
                      this.getBranchAreas()
                    )
                  }}
                  type="text"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  options={this.state.branches}
                />
              </Col>
            </Form.Group>
            {this.state.branch._id.length > 0 && (
              <CRUDList
                source="geoAreas"
                options={this.state.branchAreas}
                newOption={(name, active) => {
                  this.newGeoArea(name, active)
                }}
                updateOption={(id, name, active) => {
                  this.editGeoArea(id, name, active)
                }}
                canCreate
                canEdit
              />
            )}
          </div>
        </Card>
      </>
    )
  }
}

export default GeoAreas

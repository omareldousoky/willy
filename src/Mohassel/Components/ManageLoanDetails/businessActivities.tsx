import React, { Component } from 'react'
import Swal from 'sweetalert2'

import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import Select from 'react-select'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLoanDetailsArray } from './manageLoanDetailsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import {
  CRUDList,
  CrudOption,
} from '../../../Shared/Components/CRUDList/crudList'
import ability from '../../config/ability'
import {
  createBusinessActivity,
  editBusinessActivity,
  getBusinessSectors,
} from '../../../Shared/Services/APIs/config'
import { BusinessSector } from '../../../Shared/Models/common'

interface State {
  sector: BusinessSector
  businessSectors: Array<BusinessSector>
  businessActivities: Array<CrudOption>
  loading: boolean
}
class BusinessActivities extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      sector: {
        i18n: { ar: '' },
        id: '',
        activities: [],
      },
      businessSectors: [],
      businessActivities: [],
      loading: false,
    }
  }

  async componentDidMount() {
    await this.getBusinessSectors()
  }

  async getBusinessSectors() {
    this.setState({ loading: true })
    const res = await getBusinessSectors()
    if (res.status === 'success') {
      this.setState({
        loading: false,
        businessSectors: res.body.sectors,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  prepareActivites(id) {
    const sector = this.state.businessSectors.filter(
      (sctr) => sctr.id === id
    )[0]
    const activities = sector.activities.map((activity) => {
      return {
        name: activity.i18n.ar,
        id: activity.id ? activity.id.toString() : '0',
        activated: !!activity.active,
        disabledUi: true,
      }
    })
    this.setState({ businessActivities: activities.reverse() })
  }

  async editBusinessActivity(id, active) {
    this.setState({ loading: true })
    const res = await editBusinessActivity({
      BusinessActivityId: Number(id),
      BusinessSectorId: this.state.sector.id,
      active,
    })
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        async () => {
          await this.getBusinessSectors()
          await this.prepareActivites(this.state.sector.id)
        }
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
  }

  async newBusinessActivity(name) {
    this.setState({ loading: true })
    const res = await createBusinessActivity({
      BusinessActivityName: name,
      BusinessSectorId: this.state.sector.id,
    })
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        async () => {
          await this.getBusinessSectors()
          await this.prepareActivites(this.state.sector.id)
        }
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
  }

  render() {
    const array = manageLoanDetailsArray()
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <HeaderWithCards
          header={local.businessActivities}
          array={array}
          active={array
            .map((item) => {
              return item.icon
            })
            .indexOf('business-activities')}
        />
        <div className="d-flex flex-column align-items-center">
          <Form.Group
            as={Row}
            controlId="businessSector"
            style={{ width: '60%', marginTop: '1rem' }}
          >
            <Form.Label style={{ textAlign: 'right' }} column sm={4}>
              {local.businessSector}
            </Form.Label>
            <Col sm={6}>
              <Select
                name="businessSector"
                data-qc="businessSector"
                value={this.state.sector}
                enableReinitialize={false}
                onChange={(event: any) => {
                  this.setState({ sector: event }, () =>
                    this.prepareActivites(event.id)
                  )
                }}
                type="text"
                getOptionLabel={(option) => option.i18n.ar}
                getOptionValue={(option) => option.id}
                options={this.state.businessSectors}
              />
            </Col>
          </Form.Group>
        </div>
        {this.state.sector.id.length > 0 && (
          <CRUDList
            source="businessActivities"
            options={this.state.businessActivities}
            newOption={(name) => {
              this.newBusinessActivity(name)
            }}
            updateOption={(id, name, active) => {
              this.editBusinessActivity(id, active)
            }}
            disableNameEdit
            canCreate={ability.can('createBusinessActivity', 'config')}
            canEdit={ability.can('updateBusinessActivity', 'config')}
          />
        )}
      </>
    )
  }
}

export default BusinessActivities

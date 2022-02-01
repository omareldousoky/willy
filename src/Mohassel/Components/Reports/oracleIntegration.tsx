import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
import { oracleIntegration } from '../../Services/APIs/Oracle/integrate'

interface State {
  loading: boolean
}
class OracleIntegration extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  async migrate() {
    this.setState({ loading: true })
    const res = await oracleIntegration()
    if (res.status === 'success') {
      this.setState(
        {
          loading: false,
        },
        () => {
          Swal.fire({
            text: local.oracleIntegrationSuccess,
            icon: 'success',
            confirmButtonText: local.confirmationText,
          })
        }
      )
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        text: local.oracleIntegrationFail,
        confirmButtonText: local.confirmationText,
        icon: 'error',
      })
      // TODO:lint: remove ??
      console.log(res)
    }
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body
            style={{ padding: 15, display: 'flex', justifyContent: 'center' }}
          >
            <Can I="summarizeTransactions" a="oracleIntegration">
              <Button
                type="button"
                variant="primary"
                onClick={() => this.migrate()}
              >
                {local.oracleIntegration}
              </Button>
            </Can>
          </Card.Body>
        </Card>
      </>
    )
  }
}
export default OracleIntegration

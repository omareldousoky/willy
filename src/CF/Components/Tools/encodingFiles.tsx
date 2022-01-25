import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'
import { DocumentType } from '../../../Shared/Services/interfaces'
import {
  documentTypeLocalization,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { manageToolsArray } from './manageToolsInitials'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { LtsIcon } from '../../../Shared/Components'
import { getDocumentsTypes } from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface State {
  documentTypes: DocumentType[]
  loading: boolean
  manageToolsTabs: any[]
}
class EncodingFiles extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      documentTypes: [],
      loading: false,
      manageToolsTabs: [],
    }
  }

  componentDidMount() {
    this.getDocumentsTypes()
    this.setState({ manageToolsTabs: manageToolsArray() })
  }

  async getDocumentsTypes() {
    this.setState({ loading: true })
    const res = await getDocumentsTypes()
    if (res.status === 'success') {
      this.setState({
        documentTypes: res.body.documentTypes,
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  render() {
    return (
      <div>
        <HeaderWithCards
          header={local.encodingFiles}
          array={this.state.manageToolsTabs}
          active={this.state.manageToolsTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('encoding-files')}
        />
        <Loader type="fullscreen" open={this.state.loading} />
        <Card className="main-card">
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <h4 style={{ marginRight: '20px' }}>{local.encodingFilesHQ}</h4>
              <small
                style={{ color: '#6e6e6e', margin: '12px' }}
              >{`${local.numOfFiles} (${this.state.documentTypes.length})`}</small>
              <Can I="documentTypes" a="config">
                <Button
                  onClick={() => {
                    this.props.history.push(
                      '/tools/encoding-files/create-encoding-files'
                    )
                  }}
                  className="big-button"
                  style={{
                    marginLeft: 20,
                    marginRight: 'auto',
                    width: '100px',
                  }}
                >
                  {local.create}
                </Button>
              </Can>
            </div>
            {this.state.documentTypes.length > 0 ? (
              this.state.documentTypes.map((documentType, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      border: 'solid 1px #e5e5e5',
                      textAlign: 'right',
                      margin: '20px',
                      padding: '20px',
                    }}
                  >
                    <Row className="row-nowrap">
                      <Col style={{ minWidth: '20%' }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#2f2f2f',
                          }}
                        >
                          {documentType.name}
                        </div>
                      </Col>
                      <Col>
                        <div style={{ fontSize: '12px', color: '#6e6e6e' }}>
                          {local.numOfPages}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2f2f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {documentType.pages}
                        </div>
                      </Col>
                      <Col>
                        <div style={{ fontSize: '12px', color: '#6e6e6e' }}>
                          {local.allowUpdate}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2f2f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {documentType.updatable ? local.yes : local.no}
                        </div>
                      </Col>
                      <Col>
                        <div style={{ fontSize: '12px', color: '#6e6e6e' }}>
                          {local.status}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2f2f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {documentType.active
                            ? local.activated
                            : local.deactivated}
                        </div>
                      </Col>
                      <Col style={{ minWidth: '20%' }}>
                        <div style={{ fontSize: '12px', color: '#6e6e6e' }}>
                          {local.documentFor}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2f2f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {documentTypeLocalization(documentType.type)}
                        </div>
                      </Col>
                      <Col style={{ minWidth: '20%' }}>
                        <div style={{ fontSize: '12px', color: '#6e6e6e' }}>
                          {local.documentForCustomerOfType}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2f2f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {local[documentType.customerType]}
                        </div>
                      </Col>
                      <Can I="documentTypes" a="config">
                        <Col>
                          <span
                            onClick={() => {
                              this.props.history.push({
                                pathname:
                                  '/tools/encoding-files/edit-encoding-files',
                                state: { documentType },
                              })
                            }}
                            className="icon"
                          >
                            <LtsIcon name="edit" />
                          </span>
                        </Col>
                      </Can>
                    </Row>
                  </div>
                )
              })
            ) : (
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <img
                  alt="no-data-found"
                  src={require('../../../Shared/Assets/no-results-found.svg')}
                />
                <h4>{local.noResultsFound}</h4>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    )
  }
}
export default withRouter(EncodingFiles)

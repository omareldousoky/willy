import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { hideDocument } from '../../Services/APIs/hideDocument'
import { DocumentType } from '../../../Shared/Services/interfaces'
import { documentTypeLocalization } from '../../../Shared/Services/utils'
import { getDocumentsTypes } from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface State {
  documentTypes: DocumentType[]
  loading: boolean
}

class EncodingFiles extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      documentTypes: [
        {
          id: '',
          pages: 0,
          type: '',
          paperType: '',
          customerType: 'individual',
          name: '',
        },
      ],
      loading: false,
    }
  }

  componentDidMount() {
    this.getDocumentsTypes()
  }

  async getDocumentsTypes() {
    this.setState({ loading: true })
    const res = await getDocumentsTypes('', true)
    if (res.status === 'success') {
      this.setState({
        documentTypes: res.body.documentTypes,
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Swal.fire('error', local.getDocumentsTypesError)
    }
  }

  async hideShowDocument(hidden: boolean, id: string | undefined) {
    if (id) {
      this.setState({ loading: true })
      const res = await hideDocument({ isHidden: hidden }, id)
      if (res.status === 'success') {
        this.setState({ loading: false })
        this.getDocumentsTypes()
      } else {
        this.setState({ loading: false })
      }
    }
  }

  render() {
    return (
      <div>
        <Container>
          <Loader type="fullscreen" open={this.state.loading} />
          <Card>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h4 style={{ textAlign: 'right' }}>{local.encodingFilesHQ}</h4>
                <small
                  style={{ color: '#6e6e6e', margin: '12px' }}
                >{`${local.numOfFiles} (${this.state.documentTypes.length})`}</small>
              </div>
              {this.state.documentTypes.map((documentType, index) => {
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
                          {local.hiddenInLTS}
                        </div>
                        <Form.Check
                          type="switch"
                          data-qc="is-hidden"
                          checked={documentType.isHidden}
                          label=""
                          id={index.toString()}
                          onChange={(e) =>
                            this.hideShowDocument(
                              e.currentTarget.checked,
                              documentType.id
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </Card.Body>
          </Card>
        </Container>
      </div>
    )
  }
}
export default EncodingFiles

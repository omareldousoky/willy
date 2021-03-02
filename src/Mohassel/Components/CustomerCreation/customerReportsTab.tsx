import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
import { PDF } from '../Reports/reports'

interface State {
  PDFsArray: Array<PDF>
  selectedPdf: any
}
interface Props {
  PDFsArray: Array<any>
  changePrint: (data) => void
}
export class CustomerReportsTab extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      PDFsArray: this.props.PDFsArray,
      selectedPdf: { permission: '' },
    }
  }

  handlePrint = (pdf) => {
    this.props.changePrint(pdf)
  }

  render() {
    return (
      <Card style={{ margin: '20px 50px' }} className="print-none">
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.reportsProgram}
              </Card.Title>
            </div>
          </div>
          {this.state.PDFsArray?.map((pdf, index) => {
            return (
              <Can I={pdf.permission} a="report" key={index}>
                <Card key={index}>
                  <Card.Body>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0px 20px',
                        fontWeight: 'bold',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                        <span>{pdf.local}</span>
                      </div>
                      <img
                        style={{ cursor: 'pointer' }}
                        alt="download"
                        data-qc="download"
                        src={require(`../../Assets/green-download.svg`)}
                        onClick={() => this.handlePrint(pdf)}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Can>
            )
          })}
        </Card.Body>
      </Card>
    )
  }
}

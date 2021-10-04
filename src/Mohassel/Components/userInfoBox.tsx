import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as local from '../../Shared/Assets/ar.json'
import {
  arabicGender,
  timeToArabicDate,
  downloadFile,
  iscoreStatusColor,
  iscoreBank,
} from '../../Shared/Services/utils'
import Can from '../config/Can'
import { Score } from '../../Shared/Models/Customer'

interface Props {
  values: any
  noHeader?: boolean
  getIscore?: Function
  leader?: boolean
  iScores?: any
  status?: string
}

class InfoBox extends Component<Props> {
  getIscore(data) {
    if (this.props.getIscore) {
      this.props.getIscore(data)
    }
  }

  render() {
    const { values, iScores } = this.props
    let iscore: Score = {
      iscore: '',
      nationalId: '',
    }
    if (iScores)
      [iscore] = iScores.filter(
        (score) => score.nationalId === values.nationalId
      )

    return (
      <div
        style={{
          backgroundColor: '#f7fff2',
          padding: 15,
          border: '1px solid #e5e5e5',
          width: '100%',
        }}
      >
        {!this.props.noHeader && <h5>{local.mainInfo}</h5>}
        <Form.Row>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {this.props.leader ? local.groupLeaderName : local.name}
            </Form.Label>
            <Form.Label>{values.customerName} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.customerCode}
            </Form.Label>
            <Form.Label>{values.key ? values.key : 'N/A'} </Form.Label>
          </Form.Group>
          {this.props.iScores &&
            this.props.iScores.length > 0 &&
            iscore.nationalId &&
            iscore.nationalId.length > 0 && (
              <Form.Group as={Col} md="4">
                <Row>
                  <Form.Label style={{ color: '#6e6e6e' }}>iScore</Form.Label>
                </Row>
                <Row>
                  <Form.Label
                    style={{ color: iscoreStatusColor(iscore.iscore).color }}
                  >
                    {iscore.iscore}
                  </Form.Label>
                  <Form.Label>
                    {iscoreStatusColor(iscore.iscore).status}
                  </Form.Label>
                  {iscore.bankCodes &&
                    iscore.bankCodes.map((code) => (
                      <Form.Label key={code}>{iscoreBank(code)}</Form.Label>
                    ))}
                  {iscore.url && (
                    <Col>
                      <span
                        style={{ cursor: 'pointer', padding: 10 }}
                        onClick={() => downloadFile(iscore.url)}
                      >
                        <span
                          className="fa fa-file-pdf-o"
                          style={{ margin: '0px 0px 0px 5px' }}
                        />
                        iScore
                      </span>
                    </Col>
                  )}
                  {this.props.getIscore &&
                    this.props.status &&
                    ![
                      'approved',
                      'created',
                      'issued',
                      'rejected',
                      'paid',
                      'pending',
                      'canceled',
                    ].includes(this.props.status) && (
                      <Col>
                        <Can I="getIscore" a="customer">
                          <span
                            style={{ cursor: 'pointer', padding: 10 }}
                            onClick={() => this.getIscore(this.props.values)}
                          >
                            <span
                              className="fa fa-refresh"
                              style={{ margin: '0px 0px 0px 5px' }}
                            />
                            iscore
                          </span>
                        </Can>
                      </Col>
                    )}
                </Row>
              </Form.Group>
            )}
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.nationalId}
            </Form.Label>
            <Form.Label>{values.nationalId} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.birthDate}
            </Form.Label>
            <Form.Label>{timeToArabicDate(values.birthDate, false)}</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>{local.gender}</Form.Label>
            <Form.Label>{arabicGender(values.gender)} </Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.nationalIdIssueDate}
            </Form.Label>
            <Form.Label>
              {timeToArabicDate(values.nationalIdIssueDate, false)}
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.businessSector}
            </Form.Label>
            <Form.Label>{values.businessSector} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.businessActivity}
            </Form.Label>
            <Form.Label>{values.businessActivity} </Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.businessSpeciality}
            </Form.Label>
            <Form.Label>{values.businessSpeciality} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.permanentEmployeeCount}
            </Form.Label>
            <Form.Label>
              {values.permanentEmployeeCount
                ? values.permanentEmployeeCount
                : 0}
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="4" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.partTimeEmployeeCount}
            </Form.Label>
            <Form.Label>
              {values.partTimeEmployeeCount ? values.partTimeEmployeeCount : 0}
            </Form.Label>
          </Form.Group>
        </Form.Row>
      </div>
    )
  }
}
export default InfoBox

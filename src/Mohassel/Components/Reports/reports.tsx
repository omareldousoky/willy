import React, { Component } from 'react';
import { Loader } from '../../../Shared/Components/Loader';
import Card from 'react-bootstrap/Card';
import * as local from '../../../Shared/Assets/ar.json';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }}>
                    {/* <Loader type="fullsection" open={this.props.loading} /> */}
                    <Card.Body style={{ padding: 0 }}>
                        <div className="custom-card-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.reportsProgram}</Card.Title>
                                <span className="text-muted">{local.noOfReports + ` (100)`}</span>
                            </div>
                        </div>
                        <Card>
                            <Card.Body>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px',fontWeight: 'bold', alignItems: 'center' }}>
                                    <div>
                                        <span style={{marginLeft: 40}}>#1</span>
                                        <span>مصاريف قضائيه</span>
                                    </div>
                                    <img alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)}/>
                                </div>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default Reports;
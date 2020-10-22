import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import Can from '../../config/Can';
import { oracleIntegration } from '../../Services/APIs/Oracle/integrate';

interface State {
    loading: boolean;
}
class OracleIntegration extends Component<{}, State>{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async migrate() {
        this.setState({ loading: true })
        const res = await oracleIntegration();
        if (res.status === 'success') {
            this.setState({
                loading: false,
            }, () => {
                Swal.fire("", local.oracleIntegrationSuccess, 'success')
            })
        } else {
            this.setState({ loading: false });
            Swal.fire("error", local.oracleIntegrationFail, 'error')
            console.log(res)
        }
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }} className="print-none">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body style={{ padding: 15, display: 'flex', justifyContent: 'center' }}>
                        <Can I="createIscoreFile" a="report"><Button type='button' variant='primary' onClick={() => this.migrate()}>{local.oracleIntegration}</Button></Can>
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default OracleIntegration
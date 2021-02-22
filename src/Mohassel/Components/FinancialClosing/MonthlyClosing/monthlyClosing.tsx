import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import * as local from '../../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../../Shared/Components/Loader';

interface State {
    loading: boolean;
}
class MonthlyClosing extends Component<{}, State>{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async Close() {
        console.log("close")
    }
    render() {
        return (
            <>
                <Card style={{ margin: '20px 50px' }} className="print-none">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body style={{ padding: 15, display: 'flex', justifyContent: 'center' }}>
                   <Button type='button' variant='primary' onClick={() => this.Close()}>{local.monthlyClosing}</Button>
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default MonthlyClosing
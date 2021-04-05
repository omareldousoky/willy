import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import * as local from '../../../../Shared/Assets/ar.json'
import Button from 'react-bootstrap/Button'
import { Loader } from '../../../../Shared/Components/Loader'
import { financialBlocking } from '../../../Services/APIs/loanApplication/financialClosing'
import Swal from 'sweetalert2'
import { Col, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Can from '../../../config/Can'


interface Props extends RouteComponentProps {
    history: any;
}
interface State {
    loading: boolean;
}

const today: Date = new Date();

const ltsBlockingValidation = Yup.object().shape({
    blockDate: Yup.string().test('block date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    })
})
class LtsBlocking extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async Block(blockDate: number) {
        this.setState({ loading: true })
        const res = await financialBlocking({ blockDate })
        if (res.status === "success") {
            this.setState({ loading: false })
            Swal.fire('Success', '', 'success').then(()=> this.props.history.push('/'));
        } else {
            this.setState({ loading: false })
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
    }
    handleSubmit = async (values) => {
        const blockDate = values.blockDate;
        const endOfBlockDate = new Date(blockDate).setHours(23, 59, 59,999).valueOf();
        Swal.fire({
            title: local.areYouSure,
            text: `${local.ltsBlocking}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.ltsBlocking,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
                await this.Block(endOfBlockDate);
            }
        });
    }
    render() {
        return (
            <Card className="main-card">
                <Loader type="fullscreen" open={this.state.loading} />
                <Card.Header className="custom-card-header" style={{background:'white', border:'none'}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.ltsBlocking}</Card.Title>
                    </div>
                </Card.Header>
                <Card.Body className="w-100 d-flex justify-content-center">
                </Card.Body>
            </Card>
        )
    }
}
export default withRouter(LtsBlocking);
import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import * as local from '../../../../Shared/Assets/ar.json'
import Button from 'react-bootstrap/Button'
import { Loader } from '../../../../Shared/Components/Loader'
import { financialUnlBlocking } from '../../../Services/APIs/loanApplication/financialClosing'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Can from '../../../config/Can'


interface Props extends RouteComponentProps {
    history: any;
}
function LtsUnblocking(props: Props){
   const [loading, setLoading] =  useState(false);
   const unBlock =  async() => {
       setLoading(true)
        const res = await financialUnlBlocking();
        if(res.status === 'success'){
            Swal.fire('Success',' ', 'success').then(()=> props.history.push('/'))
        }else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error')
        }
        setLoading(false)
    }
   const handleSubmit = async () => {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.ltsUnblocking}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.ltsUnblocking,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
                await unBlock();
            }
        });
    }
        return (
            <Card className="main-card">
                <Loader open={loading}  type="fullscreen"/>
                <div className="custom-card-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.ltsUnblocking}</Card.Title>
                    </div>
                </div>
                <Card.Body className="w-100 d-flex justify-content-center">
                    <Can I='financialUnBlocking' a='application'><Button type='button' variant='primary' onClick={() => handleSubmit()}>{local.ltsUnblocking}</Button></Can>
                </Card.Body>
            </Card>
        )

}
export default withRouter(LtsUnblocking)
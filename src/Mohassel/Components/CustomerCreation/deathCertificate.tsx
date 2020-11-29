import React, { Component } from 'react'
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader';
interface Props {
   edit: boolean;
   view: boolean; 
   customerId: string;
}
export default class DeathCertificate extends Component <Props , {}>  {
    constructor(props: Props){
            super(props);
    }
    render() {

        return (
            <div>
                <DocumentUploader
                              documentType={{
                                  pages : 1,
                                  type: 'customer',
                                  paperType: 'A4',
                                  name: 'DeathCertificate',
                                  updatable: false,
                                  active: true,
                              }}
                              edit={this.props.edit}
                              keyName="customerId"
                              keyId={this.props.customerId}
                              view={this.props.view}
                 />
            </div>
        )
    }
}

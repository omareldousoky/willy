import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import BackButton from '../BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
interface Props {
  history: Array<object>;
}
 class UserDetails extends Component <Props> {
   
    constructor(props: Props){
        super(props);
        super(props);
     
    }

    render() {
        return (
            <div>
                <BackButton title={local.userDetails} />
                
            </div>
        )
    }
}

export default  withRouter(UserDetails);

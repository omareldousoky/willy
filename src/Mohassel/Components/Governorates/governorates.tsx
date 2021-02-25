
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { getGovernorates } from '../../Services/APIs/configApis/config'
import Select from 'react-select';
import {theme} from '../../../theme';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import { getErrorMessage } from '../../../Shared/Services/utils';
interface Village {
    villageName: { ar: string };
    villageLegacyCode: number;
}

interface District {
    districtName: { ar: string };
    districtLegacyCode: number;
    villages: Array<Village>;
}

interface Governorate {
    governorateName: { ar: string };
    governorateLegacyCode: number;
    districts: Array<District>;
}

interface State {
    governoratesOptions: any[];
    governorate: {label: string ; value: number};
    loading: boolean;
}
interface Props {
   values: { governorate: string};
}

export default class Governorates extends  React.Component<Props,State>  {

    
    constructor(props: Props) {
        super(props);
        this.state = {
          governorate : {label:'', value: -1},
          governoratesOptions : [],
          loading: false,
        }
    }

    componentDidMount(){
        this.getGovernoratesService();
    }
    async  getGovernoratesService() {
        this.setState({loading:true});
        const resGov = await getGovernorates();

        if (resGov.status === "success") {
           const governorates: Array<Governorate> = resGov.body.governorates;
          const options: any[] =[] ;
          governorates.map((gov,index)=>{
                if(gov.governorateName.ar === this.props.values.governorate){
                    this.setState({governorate:{label: gov.governorateName.ar, value: gov.governorateLegacyCode} })
                }
                options.push({
                    label: gov.governorateName.ar,
                    value: gov.governorateLegacyCode
                })

          })
          this.setState({governoratesOptions:options});
        }  else {
            this.setState({
                governorate: {label: this.props.values.governorate , value: 0}
            }, () => Swal.fire("Error !",getErrorMessage(resGov.error.error),'error'))
        }
      this.setState({loading:false});

    }
  

render(){
   return (
       <>
     <Loader type="fullsection" open={this.state.loading} />
     <Select 
     styles = {theme.selectStyleWithBorder}
		 theme = {theme.selectTheme}
     options = {this.state.governoratesOptions}
     value = {this.state.governorate}
     onChange = {(event)=> {
       this.setState({governorate: event})
       this.props.values.governorate = event.label ;
     } }
     />
     </>
   )
}
}

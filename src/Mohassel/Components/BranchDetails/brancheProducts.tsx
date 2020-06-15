import React, { Component } from 'react'
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
interface Props {
    branchId: string;

}
interface State {
    branchProducts: any[];
    loading: boolean;
}
 class BrancheProducts extends Component <Props ,State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            branchProducts: [],
            loading: false,
        }
    }
    async getProductsByBranch() {
        const branchsProducts = await getProductsByBranch(this.props.branchId);
         if (branchsProducts.status === 'success') {
            this.setState({
                branchProducts: (branchsProducts.body.data.productIds) ? branchsProducts.body.data.productIds : [],
                loading: false,
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false,
                 branchProducts: [],
            })
        }
    }
    componentDidMount() {
       this.getProductsByBranch();
    }
    render() {
        return (
            <div>
                
                
            </div>
        )
    }
}

export default BrancheProducts

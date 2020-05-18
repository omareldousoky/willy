import React from 'react';
import AsyncSelect from 'react-select/async';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { searchBranches } from '../../Services/APIs/Branch/searchBranches';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanOfficersDropDown = (props) => {
    // const [loanOfficers, setLoanOfficers] = useState();
    // const [searchKeyWord, changeSearchKeyWord] = useState("");
    const getLoanOfficers = async(searchKeyWord) =>{
        const res = await searchLoanOfficer({from: 0, size: 100, name: searchKeyWord});
        if(res.status === "success"){
            return res.body.data;
        } else {
            return [];
        }
    }
    return (
        <div className="dropdown-container" style={{ flex: 2 }}>
            <p className="dropdown-label">{local.representative}</p>
            <AsyncSelect
                className="full-width"
                name="representative"
                data-qc="representative"
                placeholder={local.chooseRepresentative}
                // value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative)}
                // onChange={(id) => {console.log(id);changeSearchKeyWord(id+"")}}
                onChange={(loanOfficer)=> props.onSelectLoanOfficer(loanOfficer)}
                getOptionLabel={(option) => option.username}
                getOptionValue={(option) => option._id}
                loadOptions={getLoanOfficers}
                cacheOptions defaultOptions
            />
        </div>
    );
}

export const BranchesDropDown = (props) => {
    const getBranches = async(searchKeyWord) =>{
        const res = await searchBranches({from: 0, size: 100, name: searchKeyWord});
        if(res.status === "success"){
            return res.body.data;
        } else {
            return [];
        }
    }
    return (
        <div className="dropdown-container" style={{ flex: 2 }}>
            <p className="dropdown-label">{local.oneBranch}</p>
            <AsyncSelect
                className="full-width"
                name="branches"
                data-qc="branches"
                placeholder={local.chooseBranch}
                // value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative)}
                // onChange={(id) => {console.log(id);changeSearchKeyWord(id+"")}}
                onChange={(branch)=> props.onSelectBranch(branch)}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                loadOptions={getBranches}
                cacheOptions defaultOptions
            />
        </div>
    );
}
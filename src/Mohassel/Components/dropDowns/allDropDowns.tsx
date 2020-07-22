import React from "react";
import AsyncSelect from "react-select/async";
import { searchLoanOfficer } from "../../Services/APIs/LoanOfficers/searchLoanOfficer";
import { searchBranches } from "../../Services/APIs/Branch/searchBranches";
import * as local from "../../../Shared/Assets/ar.json";

export const LoanOfficersDropDown = props => {
  // const [loanOfficers, setLoanOfficers] = useState();
  // const [searchKeyWord, changeSearchKeyWord] = useState("");
  const customStyles = {
    control: provided => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none"
      }
    })
  };
  const getLoanOfficers = async searchKeyWord => {
    let res;
    if (props.branchId) {
      if (!props.sameBranch)
        res = await searchLoanOfficer({
          from: 0,
          size: 100,
          name: searchKeyWord,
          status: "active",
          excludedIds: [props.excludeId],
          branchId: props.branchId
        });
      else
        res = await searchLoanOfficer({
          from: 0,
          size: 100,
          name: searchKeyWord,
          excludedIds: [props.excludeId]
        });
      if (res.status === "success") {
        return res.body.data;
      } else {
        return [];
      }
    }
  };
  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      {/* <p className="dropdown-label">{local.representative}</p> */}
      <AsyncSelect
        styles={customStyles}
        className="full-width"
        name="representative"
        data-qc="representative"
        placeholder={local.chooseRepresentative}
        // value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative)}
        // onChange={(id) => {console.log(id);changeSearchKeyWord(id+"")}}
        onChange={loanOfficer => props.onSelectLoanOfficer(loanOfficer)}
        getOptionLabel={option => option.name}
        getOptionValue={option => option._id}
        loadOptions={getLoanOfficers}
        cacheOptions
        defaultOptions
        isClearable={true}
      />
    </div>
  );
};

export const BranchesDropDown = props => {
  const customStyles = {
    control: provided => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none"
      }
    })
  };
  const getBranches = async searchKeyWord => {
    const res = await searchBranches({
      from: 0,
      size: 100,
      name: searchKeyWord
    });
    if (res.status === "success") {
      return [{ name: local.allBranches, _id: "" }, ...res.body.data];
    } else {
      return [];
    }
  };
  return (
    <div className="dropdown-container" style={{ flex: 2, paddingLeft: 0 }}>
      <p className="dropdown-label">{local.oneBranch}</p>
      <AsyncSelect
        styles={customStyles}
        className="full-width"
        name="branches"
        data-qc="branches"
        placeholder={local.chooseBranch}
        // value={loanOfficers?.find(loanOfficer => loanOfficer._id === values.representative)}
        // onChange={(id) => {console.log(id);changeSearchKeyWord(id+"")}}
        onChange={branch => props.onSelectBranch(branch)}
        getOptionLabel={option => option.name}
        getOptionValue={option => option._id}
        loadOptions={getBranches}
        cacheOptions
        defaultOptions
      />
    </div>
  );
};

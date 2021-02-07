import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useStore } from "react-redux";
import Select from "react-select";
import { Auth, Branch } from "../../../Shared/redux/auth/types";
import { searchBranches } from "../../Services/APIs/Branch/searchBranches";
import * as local from "../../../Shared/Assets/ar.json";

export const LoanOfficersDropDown = props => {
  // const [loanOfficers, setLoanOfficers] = useState();
  // const [searchKeyWord, changeSearchKeyWord] = useState("");
  let selectValue: any = props.value;
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
  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <Select
        styles={customStyles}
        className="full-width"
        name="representative"
        data-qc="representative"
        placeholder={local.chooseRepresentative}
        isLoading={props.LoanOfficerSelectLoader}
        isClearable={true}
        isSearchable={true}
        options={props.LoanOfficerSelectOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option._id}
        onChange={loanOfficer => {
          selectValue = loanOfficer;
          props.onSelectLoanOfficer(loanOfficer);
        }}
        value={selectValue}
      />
    </div>
  );
};

type BranchDropDownProps = {
  onlyValidBranches?: boolean;
  multiselect?: boolean;
  value?: string;
  onSelectBranch: (branch: Branch) => void;
}
export const BranchesDropDown = (props: BranchDropDownProps) => {
  const [options, setOptions] = useState<any>([]);
  const [value, setValue] = useState(options.find(o => o._id === props.value));
  const store = useStore();
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
  const getBranches = async (searchKeyWord: string) => {
    if (props.onlyValidBranches) {
      const auth: Auth = store.getState().auth
      let branches: Array<Branch> = auth.validBranches;
      if (!auth.requireBranch) branches = [{ name: local.allBranches, _id: "" }, ...branches]
      return branches.filter(branch => branch.name.includes(searchKeyWord))
    } else {
      const res = await searchBranches({
        from: 0,
        size: 1000,
        name: searchKeyWord
      });
      if (res.status === "success") {
        setOptions([{ name: local.allBranches, _id: "" }, ...res.body.data]);
        return [{ name: local.allBranches, _id: "" }, ...res.body.data];
      } else {
        return [];
      }
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
        value={value || options.find(option => option._id === props.value)}
        isMulti={props.multiselect}
        onChange={branch => { props.onSelectBranch(branch); setValue(branch); }}
        getOptionLabel={option => option.name}
        getOptionValue={option => option._id}
        loadOptions={getBranches}
        cacheOptions
        defaultOptions
      />
    </div>
  );
};

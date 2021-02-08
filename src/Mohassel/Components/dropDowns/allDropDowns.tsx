import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import Select, { ValueType } from "react-select";
import { searchBranches } from "../../Services/APIs/Branch/searchBranches";
import * as local from "../../../Shared/Assets/ar.json";
import { Props } from "react-select/src/Select";
import { searchLoanOfficer } from "../../Services/APIs/LoanOfficers/searchLoanOfficer";

export interface DropDownOption {
  name: string;
  _id: string;
}
interface LoanOfficersDropDownProps extends Props<DropDownOption> {
  loanOfficerSelectLoader?: boolean;
  loanOfficerSelectOptions?: DropDownOption[];
  onSelectLoanOfficer?: (loanOfficer: ValueType<DropDownOption>) => void;
}

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
};

export const LoanOfficersDropDown = (props: LoanOfficersDropDownProps) => {
  const {
    isAsync,
    loanOfficerSelectLoader,
    loanOfficerSelectOptions,
    onSelectLoanOfficer,
    disabled,
    value,
    ...restProps
  } = props;
  let selectValue: ValueType<DropDownOption> | null = value || null;
  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <Select<DropDownOption>
        isClearable
        isSearchable
        styles={customStyles}
        className="full-width"
        name="representative"
        data-qc="representative"
        placeholder={local.chooseRepresentative}
        isLoading={loanOfficerSelectLoader}
        options={loanOfficerSelectOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option._id}
        onChange={(loanOfficer) => {
          if (onSelectLoanOfficer) {
            selectValue = loanOfficer;
            onSelectLoanOfficer && onSelectLoanOfficer(loanOfficer);
          }
        }}
        value={selectValue}
        {...restProps}
      />
    </div>
  );
};

interface AsyncLoanOfficersDropDownProps extends Props<DropDownOption> {
  branchId?: string;
  onSelectLoanOfficer: (officersOptions: ValueType<DropDownOption>[]) => void;
}

export const AsyncLoanOfficersDropDown = ({
  branchId,
  onSelectLoanOfficer,
  ...restProps
}: AsyncLoanOfficersDropDownProps) => {
  const [value, setValue] = useState<ValueType<DropDownOption> | null>();

  const getLoanOfficers = (branchId?: string) => async (
    searchKeyWord: string
  ) => {
    if (!searchKeyWord) return [];
    const res = await searchLoanOfficer({
      name: searchKeyWord,
      from: 0,
      size: 20,
      branchId,
    });
    if (res.status === "success") {
      return res.body.data.filter((v) => !!v);
    } else {
      return [];
    }
  };

  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <AsyncSelect<DropDownOption>
        styles={customStyles}
        className="full-width"
        name="loanOfficers"
        data-qc="loanOfficers"
        placeholder={local.typeRepresentativeName}
        value={value}
        onChange={(options) => {
          onSelectLoanOfficer(options as ValueType<DropDownOption>[]);
          setValue(options);
        }}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option._id}
        loadOptions={getLoanOfficers(branchId)}
        cacheOptions
        defaultOptions
        {...restProps}
      />
    </div>
  );
};

export const BranchesDropDown = (props) => {
  const [options, setOptions] = useState<any>([]);
  const [value, setValue] = useState(
    options.find((o) => o._id === props.value)
  );
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none",
      },
    }),
  };
  const getBranches = async (searchKeyWord) => {
    const res = await searchBranches({
      from: 0,
      size: 1000,
      name: searchKeyWord,
    });
    if (res.status === "success") {
      setOptions([{ name: local.allBranches, _id: "" }, ...res.body.data]);
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
        value={value || options.find((option) => option._id === props.value)}
        isMulti={props.multiselect}
        onChange={(branch) => {
          props.onSelectBranch(branch);
          setValue(branch);
        }}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option._id}
        loadOptions={getBranches}
        cacheOptions
        defaultOptions
      />
    </div>
  );
};

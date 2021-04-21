import React, { useCallback, useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { useStore } from "react-redux";
import Select, { ValueType, Props } from "react-select";
import { Auth, Branch } from "../../../Shared/redux/auth/types";
import { searchBranches } from "../../Services/APIs/Branch/searchBranches";
import * as local from "../../../Shared/Assets/ar.json";
import { searchLoanOfficer } from "../../Services/APIs/LoanOfficers/searchLoanOfficer";
import { getGeoAreasByBranch } from "../../Services/APIs/GeoAreas/getGeoAreas";
import { theme } from "../../../theme";
import { CurrentHierarchiesSingleResponse } from "../../Models/OfficersProductivityReport";
import { fetchCurrentHierarchies } from "../../Services/APIs/Reports/officersProductivity";

export interface DropDownOption {
  name: string;
  _id: string;
}
interface LoanOfficersDropDownProps extends Props<DropDownOption> {
  loanOfficerSelectLoader?: boolean;
  loanOfficerSelectOptions?: DropDownOption[];
  onSelectLoanOfficer?: (loanOfficer: ValueType<DropDownOption>) => void;
}

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
        styles={theme.selectStyleWithoutBorder}
        theme={theme.selectTheme}
        className="full-width"
        name="representative"
        data-qc="representative"
        placeholder={local.typeRepresentativeName}
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

interface DropDownPropsWithBranch extends Props<DropDownOption> {
  branchId?: string;
  onSelectOption: (option: ValueType<DropDownOption>[]) => void;
}

export const AsyncLoanOfficersDropDown = ({
  branchId,
  onSelectOption,
  isDisabled,
  ...restProps
}: DropDownPropsWithBranch) => {
  const initialState: {
    optionsLoaded: boolean;
    options: DropDownOption[];
    isLoading: boolean;
  } = {
    optionsLoaded: false,
    options: [],
    isLoading: false,
  };
  const [options, setOptions] = useState(initialState);
  const [value, setValue] = useState<ValueType<DropDownOption> | null>();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleLoadOptions = async () => {
    const newOptions: DropDownOption[] = [];
    const res = await searchLoanOfficer({
      name: searchKeyword,
      from: 0,
      size: 10,
      branchId,
    });

    if (res.status === "success") {
      const data = res.body.data;
      Array.isArray(data) && data.length
        ? res.body.data.map((loanOfficer: DropDownOption) => {
            newOptions.push({
              _id: loanOfficer._id,
              name: loanOfficer.name,
            });
          })
        : [];
				setOptions({
        options: newOptions,
        isLoading: false,
        optionsLoaded: true,
      });
    } else {
      setOptions({ options: [], isLoading: false, optionsLoaded: true });
    }
  };
  const maybeLoadOptions = () => {
    if (!options.optionsLoaded) {
      setOptions({ ...options, isLoading: true });
      handleLoadOptions();
    }
  };

  useEffect(() => {
    setOptions(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  useEffect(() => {
    if (isDisabled) setValue(null);
  }, [isDisabled]);

  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <Select<DropDownOption>
        cacheOptions
        defaultOptions
        styles={theme.selectStyleWithoutBorder}
        theme={theme.selectTheme}
        className="full-width"
        name="loanOfficers"
        data-qc="loanOfficers"
        placeholder={local.chooseRepresentative}
        value={value}
        onChange={(options) => {
          onSelectOption(options as ValueType<DropDownOption>[]);
          setValue(options);
        }}
        isLoading={options.isLoading}
        options={options.options}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option._id}
        isDisabled={isDisabled}
        onFocus={maybeLoadOptions}
        onInputChange={(keyword) => {
          setSearchKeyword(keyword);
          setOptions({ ...options, isLoading: true, optionsLoaded: false });
          maybeLoadOptions();
        }}
        {...restProps}
      />
    </div>
  );
};

interface BranchDropDownProps extends Props<any> {
  onlyValidBranches?: boolean;
  onSelectBranch: (branch: Branch) => void;
}

export const BranchesDropDown = (props: BranchDropDownProps) => {
  const [options, setOptions] = useState<any>([]);
  const [value, setValue] = useState(
    options.find((o) => o._id === props.value)
  );
  const store = useStore();
  const getBranches = async (searchKeyWord: string) => {
    const auth: Auth = store.getState().auth;
    let branches: Array<Branch> = auth.validBranches;
    if (props.onlyValidBranches && branches !== null) {
      if (!auth.requireBranch)
        branches = [{ name: local.allBranches, _id: "" }, ...branches];
      return branches.filter((branch) => branch.name.includes(searchKeyWord));
    } else {
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
    }
  };
  return (
    <div className="dropdown-container">
      <p className="dropdown-label">{local.oneBranch}</p>
      <AsyncSelect
        styles={theme.selectStyleWithoutBorder}
        theme={theme.selectTheme}
        className="full-width"
        name="branches"
        data-qc="branches"
        placeholder={local.chooseBranch}
        value={value || options.find((option) => option._id === props.value)}
        isMulti={props.isMulti}
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

// TODO: Make generic async dropdown component
export const AsyncBranchGeoAreasDropDown = ({
  branchId,
  onSelectOption,
  isDisabled,
  ...restProps
}: DropDownPropsWithBranch) => {
  const initialState: {
    optionsLoaded: boolean;
    options: DropDownOption[];
    isLoading: boolean;
  } = {
    optionsLoaded: false,
    options: [],
    isLoading: false,
  };
  const [options, setOptions] = useState(initialState);
  const [value, setValue] = useState<ValueType<DropDownOption> | null>();

  const handleLoadOptions = async () => {
    if (!branchId) return;
    const res = await getGeoAreasByBranch(branchId);
    const newOptions: DropDownOption[] = [];
    if (res.status === "success") {
      const data = res.body.data;
      Array.isArray(data) && data.length
        ? res.body.data.map((area: DropDownOption) => {
            newOptions.push({
              _id: area._id,
              name: area.name,
            });
          })
        : [];
      setOptions({
        options: newOptions,
        isLoading: false,
        optionsLoaded: true,
      });
    } else {
      setOptions({ options: [], isLoading: false, optionsLoaded: true });
    }
  };
  const maybeLoadOptions = () => {
    if (!options.optionsLoaded) {
      setOptions({ ...options, isLoading: true });
      handleLoadOptions();
    }
  };

  useEffect(() => {
    setOptions(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);
  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <Select<DropDownOption>
        cacheOptions
        defaultOptions
        styles={theme.selectStyleWithoutBorder}
        theme={theme.selectTheme}
        className="full-width"
        name="geoAreas"
        data-qc="geoAreas"
        placeholder={local.chooseBranchGeoArea}
        value={value}
        onChange={(options) => {
          onSelectOption(options as ValueType<DropDownOption>[]);
          setValue(options);
        }}
        isLoading={options.isLoading}
        options={options.options}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option._id}
        isDisabled={isDisabled}
        onFocus={maybeLoadOptions}
        {...restProps}
      />
    </div>
  );
};

export const AsyncManagersDropDown = ({
  onSelectOption,
  ...restProps
}: Props<CurrentHierarchiesSingleResponse>) => {
  const initialState: {
    optionsLoaded: boolean;
    options: CurrentHierarchiesSingleResponse[];
    isLoading: boolean;
  } = {
    optionsLoaded: false,
    options: [],
    isLoading: false,
  };
  const [options, setOptions] = useState(initialState);
  const [value, setValue] = useState<ValueType<CurrentHierarchiesSingleResponse> | null>();


	const handleLoadOptions = async () => {
    const res = await fetchCurrentHierarchies();
    const newOptions: CurrentHierarchiesSingleResponse[] = [];
    if (res.status === "success") {
      const data = res.body?.response;
      if (Array.isArray(data) && data.length)
        res.body?.response.map(({id, name, branches}) => 
            newOptions.push({ id, name, branches })
          )
			setOptions({
				options: newOptions,
				isLoading: false,
				optionsLoaded: true,
			});
    } else {
      setOptions({ options: [], isLoading: false, optionsLoaded: true });
    }
  };

  const maybeLoadOptions = useCallback(() => {
    if (!options.optionsLoaded) {
      setOptions({ ...options, isLoading: true });
      handleLoadOptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	useEffect(() => {
		maybeLoadOptions()
	},[maybeLoadOptions])

  return (
    <div className="dropdown-container" style={{ flex: 2 }}>
      <Select<CurrentHierarchiesSingleResponse>
        cacheOptions
        defaultOptions
        styles={theme.selectStyleWithoutBorder}
        theme={theme.selectTheme}
        className="full-width"
        name="managers"
        data-qc="managers"
        placeholder={local.chooseManager}
        value={value}
        onChange={(options) => {
          onSelectOption(options as ValueType<CurrentHierarchiesSingleResponse>[]);
          setValue(options);
        }}
        isLoading={options.isLoading}
        options={options.options}
        getOptionLabel={(option) => option.name || ""}
        getOptionValue={(option) => option.id}
        onFocus={maybeLoadOptions}
        {...restProps}
      />
    </div>
  );
};

export const  CREATE_BRANCH = "CREATE_BRANCH";

export interface BranchesState {
    branches: [];
}
export interface BranchState {
    branch: {};
}
interface CreateBranchAction{
    type: typeof CREATE_BRANCH;
    payload: any ;

}

export  type BranchesActionTypes = CreateBranchAction ;
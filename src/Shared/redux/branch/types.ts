import { Branch } from "../../Services/interfaces";


export const  CREATE_BRANCH = "CREATE_BRANCH";
export const  EDIT_BRANCH = "EDIT_BRANCH";
export const  GET_BRANCH = "GET_BRANCH";

export interface BranchState {
    branch: {};
}
interface CreateBranchAction{
    type: typeof CREATE_BRANCH;
    payload: Branch ;

}
interface GetBranchAction {
    type: typeof GET_BRANCH;
    _id: string;
    payload: Branch;
    
}
interface EditBranchAction{
    type:  typeof EDIT_BRANCH;
    _id: Branch;
    payload: Branch;
}


export  type BranchesActionTypes = CreateBranchAction| GetBranchAction | EditBranchAction ;
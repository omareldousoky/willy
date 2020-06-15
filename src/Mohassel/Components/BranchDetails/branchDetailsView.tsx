
import React, { CSSProperties } from 'react'
import Table from 'react-bootstrap/Table'
import * as local from '../../../Shared/Assets/ar.json';
import { theme } from '../../../theme'
import { timeToDate } from '../../Services/utils';
import Labels from '../Labels/labels';
import { BranchBasicsView } from './branchDetailsInterfaces';

interface Props {
    data: BranchBasicsView;
}
const header: CSSProperties = {
    textAlign: "right",
    fontSize: "14px",
    width: "15%",
    color: theme.colors.lightGrayText
}
const cell: CSSProperties = {
    textAlign: "right",
    padding: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: theme.colors.blackText,

}
const BranchDetailsView = (props: Props) => {
    const { data } = props;
    return (
        <>
            <div style={{ margin: "0 1rem 2rem 0", float: 'right' }}>
                <img alt="backButton" src={require('../../Assets/branchesIcon.svg')} />
                <span style={{ marginRight: "1rem" }}> {local.basicInfo} </span>
            </div>
            <Table striped bordered hover >
                <tbody>
                    <tr><td style={header}>{local.creationDate}</td><td style={cell}>{data.created? timeToDate(data.created.at) : null}</td></tr>
                    <tr><td style={header}>{local.branchCode}</td><td style={cell}>{data.branchCode}</td></tr>
                    <tr><td style={header}>{local.oneBranch}</td><td style={cell}>{data.name}</td></tr>
                    <tr><td style={header}>{local.governorate}</td><td style={cell}> {data.governorate}</td></tr>
                    <tr><td style={header}>{local.branchAddress}</td><td style={cell}>{data.address}</td></tr>
                    <tr><td style={header}>{local.mobilePhoneNumber}</td><td style={cell}>{data.phoneNumber}</td></tr>
                    <tr><td style={header}>{local.faxNumber}</td><td style={cell}>{data.faxNumber}</td></tr>
                    <tr><td style={header}>{local.status}</td><td style={cell}>{data.status}</td></tr>
                    <tr><td style={header}>{local.lonasTypes}</td><td style={cell}><Labels  labelsTextArr={data.products} /></td></tr>
                </tbody>

            </Table>
        </>
    )
}
export default BranchDetailsView;
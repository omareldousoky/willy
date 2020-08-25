import React from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import Table from 'react-bootstrap/Table';
import { downloadFile } from '../../Services/utils';
import Can from '../../config/Can';

interface Props {
    guarantors: any;
    iScores?: any;
    getIscore?: Function;
    status?: string;
}

export const GuarantorView = (props: Props) => {
    return (
        <div className="d-flex flex-wrap">
            {(props.guarantors.length > 0) ? props.guarantors.map((guar, i) =>
                <div key={i} style={{ margin: 'auto' }}>
                    <div className="d-flex flex-row">
                        <p>{local.name}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.customerName}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.guarantorCode}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.key}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalId}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.nationalId}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.birthDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(guar.birthDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.nationalIdIssueDate}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{getRenderDate(guar.nationalIdIssueDate)}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.customerHomeAddress}</p>
                        <p style={{ width: '50%', margin: '0 10px 0 0', wordBreak: 'break-all' }}>{guar.customerHomeAddress}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.homePhoneNumber}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.homePhoneNumber}</p>
                    </div>
                    <div className="d-flex flex-row">
                        <p>{local.mobilePhoneNumber}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.mobilePhoneNumber}</p>
                    </div>
                </div>
            )
                : <p>{local.noGuarantors}</p>}
        </div>
    )
}
export const GuarantorTableView = (props: Props) => {
    function getIscore(data) {
        if (props.getIscore) {
            props.getIscore(data)
        }
    }
    return (
        <div className="d-flex justify-content-center">
            {(props.guarantors.length > 0) ? <Table style={{ textAlign: 'right' }}>
                <thead>
                    <tr>
                        <th>{local.guarantorCode}</th>
                        <th>{local.name}</th>
                        <th>{local.area}</th>
                        <th>{local.customerHomeAddress}</th>
                        <th>{local.telephone}</th>
                        {props.iScores && props.iScores.length > 0 && <th>iScore</th>}
                        {props.iScores && props.iScores.length > 0 && <th></th>}
                        {props.iScores && props.iScores.length > 0 && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {props.guarantors.length > 0 && props.guarantors.map((guar, i) =>{
                        const iScore = props.iScores && props.iScores.length > 0 ? props.iScores.filter(score => score.nationalId === guar.nationalId)[0] : {};
                        return (<tr key={i}>
                            <td>{guar.key}</td>
                            <td>{guar.customerName}</td>
                            <td>{guar.geographicalDistribution}</td>
                            <td>{guar.customerHomeAddress}</td>
                            <td>{guar.mobilePhoneNumber}</td>
                            {props.iScores && props.iScores.length > 0 && iScore.nationalId.length > 0 && <td>{iScore.iscore}</td>}
                            {props.iScores && props.iScores.length > 0 && iScore.url && <td><span style={{ cursor: 'pointer', padding: 10 }} onClick={() => downloadFile(iScore.url)}> <span className="fa fa-file-pdf-o" style={{ margin: "0px 0px 0px 5px" }}></span>iScore</span></td>}
                            {props.iScores && props.iScores.length > 0 && props.getIscore && props.status &&  !["approved", "created", "issued", "rejected", "paid", "pending", "canceled"].includes(props.status) && <Can I='getIscore' a='customer'>
                                    <td><span style={{ cursor: 'pointer', padding: 10 }} onClick={() => getIscore(guar)}> <span className="fa fa-refresh" style={{ margin: "0px 0px 0px 5px" }}></span>iscore</span></td>
                                </Can>}
                        </tr>)}
                    )}
                </tbody>
            </Table>
                : <p>{local.noGuarantors}</p>}
        </div>
    )
}
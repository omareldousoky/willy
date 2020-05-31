import React from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import Table from 'react-bootstrap/Table';

interface Props {
    guarantors: any;
}

export const GuarantorView = (props: Props) => {
    return (
        <div className="d-flex justify-content-around">
            {(props.guarantors.length > 0) ? props.guarantors.map((guar, i) =>
                <div key={i}>
                    <div className="d-flex flex-row">
                        <p>{local.name}</p>
                        <p style={{ margin: '0 10px 0 0' }}>{guar.customerName}</p>
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
                        <p style={{ width: '60%', margin: '0 10px 0 0', wordBreak: 'break-all' }}>{guar.customerHomeAddress}</p>
                    </div>

                </div>
            )
                : <p>No Guarantors</p>}
        </div>
    )
}
export const GuarantorTableView = (props: Props) => {
    return (
        <div className="d-flex justify-content-center">
            <Table>
                <thead>
                    <tr>
                        <th>{local.guarantorCode}</th>
                        <th>{local.name}</th>
                        <th>{local.area}</th>
                        <th>{local.customerHomeAddress}</th>
                        <th>{local.telephone}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.guarantors.length > 0 && props.guarantors.map((guar, i) =>
                        <tr key={i}>
                            <td></td>
                            <td>{guar.customerName}</td>
                            <td>{guar.geographicalDistribution}</td>
                            <td>{guar.customerHomeAddress}</td>
                            <td>{guar.homePhoneNumber}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}
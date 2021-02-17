import React from 'react'
import './activeWalletIndividual.scss';
import Orientation from '../../Common/orientation';
import store from "../../../../Shared/redux/store";
import {
    numbersToArabic,
    timeToArabicDate,
    timeToDate,
} from "../../../../Shared/Services/utils";
interface ActiveWalletIndividualResponse {
    response: {
        branchName: string;
        totalLoanCount: number;
        totalPrincipal: number;
        customersCount: number;
        totalCreditInstallmentCount: number;
        totalCreditInstallmentAmount: number;
        totalLateInstallmentCount: number;
        totalLateInstallmentAmount: number;
        officers: {
            officerName: string;
            customersCount: number;
            totalCreditInstallmentAmount: number;
            totalCreditInstallmentCount: number;
            totalLateInstallmentAmount: number;
            totalLateInstallmentCount: number;
            totalLoanCount: number;
            totalPrincipal: number;
            areas: {
                areaName: string;
                customersCount: string;
                totalCreditInstallmentAmount: number;
                totalCreditInstallmentCount: number;
                totalLateInstallmentAmount: number;
                totalLateInstallmentCount: number;
                totalLoanCount: number;
                totalPrincipal: number;
                data: {
                    phoneNumber: string;
                    workArea: string;
                    address: string;
                    activity: string;
                    creditAmount: number;
                    creditCount: number;
                    firstLateDate: string;
                    latestPaymentDate: string;
                    lateAmount: number;
                    lateCount: number;
                    principal: number;
                    loanDate: string;
                    customerName: string;
                    customerCode: number;
                    sector: string;
                }[];
            }[];
        }[];
    }[];
}
interface Props {
    date: string;
    data: ActiveWalletIndividualResponse;
}
const ActiveWalletIndividual = (props: Props) => {
    const { data } = props;
    return (
        <>
            <Orientation size="landscape" />
            <div className={"activeWalletIndividual"}>
                <div className="header-wrapper">
                    <span className="logo-print" role="img" />
                    <p className="m-0">
                        ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </p>
                </div>
                <div className="header-wrapper mb-0">
                    <p style={{ marginRight: "10px" }}>
                        شركة تساهيل للتمويل متناهي الصغر
          </p>
                    <h3>المحفظة النشطه للمندوبين - فردى</h3>
                    <div className="col-nowrap">
                        <p>{store.getState().auth.name}</p>
                        <p>{new Date().toLocaleString('en-GB', { hour12: false })}</p>
                    </div>
                </div>
                {
                    data?.response?.map((branch, branchIndex) => {
                        return (

                            <React.Fragment key={branchIndex}>
                                <div className="row-nowrap mt-1"><p>الفرع:</p><p className="box">{branch.branchName || '--'}</p></div>

                                { branch?.officers?.map((officer, officerIndex) => {
                                    return (
                                        <React.Fragment key={officerIndex} >
                                            <div className="row-nowrap"><p>المندوب:</p><p className="box">{officer.officerName || '--'}</p></div>
                                            {
                                                officer?.areas?.map((area, areaIndex) => {

                                                    return (
                                                        <React.Fragment key={areaIndex}>
                                                            <div className="row-nowrap"><p>منطقة العمل:</p><p className="box">{area.areaName || '--'}</p></div>
                                                            <table
                                                                className="report-container"
                                                                cellPadding="2"
                                                                cellSpacing="2"
                                                            >
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan={9}></th>
                                                                        <th colSpan={3}>الرصيد</th>
                                                                        <th colSpan={2}></th>
                                                                        <th colSpan={5}>متأخرات</th>
                                                                        <th colSpan={7}>بيانات رئيسة المجموعه</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th colSpan={5}>المجموعه</th>
                                                                        <th colSpan={2}> ت التمويل</th>
                                                                        <th colSpan={2}>قيمة التمويل</th>
                                                                        <th>عدد</th>
                                                                        <th colSpan={2}>مبلغ</th>
                                                                        <th colSpan={2}> ت أخر سداد</th>
                                                                        <th>عدد</th>
                                                                        <th colSpan={2}>مبلغ</th>
                                                                        <th colSpan={2}>بداية تاخير</th>
                                                                        <th>نشاط ر. مجموعه</th>
                                                                        <th colSpan={3}>عنوان ر. مجموعه</th>
                                                                        <th>منطقة العمل</th>
                                                                        <th colSpan={2}>التليفون</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {

                                                                        area?.data?.map((row, rowIndex) => {
                                                                            return (
                                                                                <React.Fragment key={rowIndex}>
                                                                                    <tr>
                                                                                        <td colSpan={5}>{`${row.customerCode} - ${row.customerName}`}</td>
                                                                                        <td colSpan={2}>{row.loanDate || '--'}</td>
                                                                                        <td colSpan={2}>{row.principal || 0}</td>
                                                                                        <td>{row.creditCount || 0}</td>
                                                                                        <td colSpan={2}>{row.creditAmount || 0}</td>
                                                                                        <td colSpan={2}>{row.latestPaymentDate || '--'}</td>
                                                                                        <td>{row.lateCount || 0}</td>
                                                                                        <td colSpan={2}>{row.lateAmount || 0}</td>
                                                                                        <td colSpan={2}>{row.firstLateDate || '--'}</td>
                                                                                        <td>{row.activity || '--'}</td>
                                                                                        <td colSpan={3}>{row.address || '--'}</td>
                                                                                        <td>{row.workArea || '--'}</td>
                                                                                        <td colSpan={2}>{row.phoneNumber || '--'}</td>
                                                                                    </tr>
                                                                                    <tr><th>تعديل:</th></tr>
                                                                                </React.Fragment>

                                                                            ) // row return
                                                                        }) // end of data map
                                                                    }
                                                                    <hr className="horizontal-line"></hr>
                                                                    <div className = "row-nowrap">
                                                                    <div className="row-nowrap"><p>إجمالي المنطقة :</p><p className="box">{area.areaName || '--'}</p></div>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>عدد التمويلات</th>
                                                                        <th>التمويل</th>
                                                                        <th>عدد الاعضاء</th>
                                                                   </tr>
                                                                   <tr>
                                                                       <td></td>
                                                                       <td></td>
                                                                       <td></td>
                                                                       <td></td>
                                                                   </tr>
                                                                    </div>
                                
                                                                </tbody>
                                                            </table>
                                                        </React.Fragment>
                                                    ) // area return
                                                }) // end of areas map

                                            }
                                        </React.Fragment>

                                    ) // officer return 
                                }) // end of officers map
                                }
                            </React.Fragment>
                        ) // branch return
                    }) // end of response map

                }
            </div>
        </>
    )
}

export default ActiveWalletIndividual

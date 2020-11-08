import React from 'react';
import './doubtfulPayments.scss';
import { timeToArabicDate, getTimestamp, getLoanStatus } from "../../../../Shared/Services/utils";
import * as local from '../../../../Shared/Assets/ar.json';
const DoubtfulPayments = (props) => {
    const tempData = props.data.data;
    const reportDate = (props.data.req.startDate === props.data.req.endDate) ? timeToArabicDate(props.data.req.startDate, false) : `من ${timeToArabicDate(props.data.req.startDate, false)} الي ${timeToArabicDate(props.data.req.endDate, false)}`;
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="doubtful-payments" lang="ar">
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>قائمة حركة القروض المشكوك في سدادها</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>المركز الرئيسي</th>
                            <th colSpan={6}>{`تاريخ الحركه ${reportDate}`}</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>{timeToArabicDate(0, true)}</th>
                            <th colSpan={6}>جنيه مصري</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                        <tr>
                            <th>رقم مسلسل</th>
                            <th>كود الحركه</th>
                            <th>كود العميل</th>
                            <th>أسم العميل</th>
                            <th>مسلسل القرض</th>
                            <th>رقم الشيك</th>
                            <th>قيمة</th>
                            <th>تاريخ القرض</th>
                            <th>الحالة الان</th>
                            <th>أصل</th>
                            <th colSpan={2}>قيمة الحركة فائدة</th>
                            <th>إجمالي</th>
                            <th>حالة الحركة</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                    </thead>

                    {tempData.days.map((day, x) =>
                        <React.Fragment key={x}>
                            <tbody>
                                <tr>
                                    <th className="gray frame" colSpan={2}>تاريخ الحركه</th>
                                    <th className="gray frame" colSpan={2}>{timeToArabicDate(new Date(day.truthDate).valueOf(), false)}</th>
                                </tr>
                            </tbody>
                            {day.branches.map((branch, i) =>
                                <React.Fragment key={i}>
                                    <tbody>
                                        <tr>
                                            <th className="gray frame" colSpan={2}>بنك / خرينه </th>
                                            <th className="gray frame" colSpan={2}>{branch.branchName}</th>
                                        </tr>
                                        {branch.rows.map((transaction, z) => <tr key={z}>
                                            <td>{transaction.serialNo}</td>
                                            <td></td>
                                            <td>{transaction.customerKey}</td>
                                            <td>{transaction.customerName}</td>
                                            <td>{transaction.loanSerial}</td>
                                            <td></td>
                                            <td>{transaction.loanPrincipal}</td>
                                            <td>{timeToArabicDate(getTimestamp(transaction.issueDate), false)}</td>
                                            <td>{getLoanStatus(transaction.stateFlags)}</td>
                                            <td>{transaction.transactionPrincipal}</td>
                                            <td>{transaction.transactionInterest}</td>
                                            <td>{transaction.transactionAmount}</td>
                                            <td>{transaction.canceled ===1 ? local.cancelledTransaction : null}</td>
                                        </tr>)}
                                        <tr>
                                            <th colSpan={100} className="horizontal-line"></th>
                                        </tr>
                                        <tr>
                                            <td className="frame" colSpan={2}>إجمالي فرع</td>
                                            <td className="frame" colSpan={2}>{branch.branchName}</td>
                                            <td className="frame" colSpan={1}>{timeToArabicDate(getTimestamp(branch.truthDate), false)}</td>
                                            <td className="frame">{branch.numTrx}</td>
                                            <td></td>
                                            <td></td>
                                            <td className="frame">إجمالي المبلغ</td>
                                            <td className="frame">{branch.transactionPrincipal}</td>
                                            <td className="frame">{branch.transactionInterest}</td>
                                            <td className="frame">{branch.transactionAmount}</td>
                                        </tr>

                                        <tr>
                                            <td colSpan={8}></td>
                                            <td className="frame">القيمة الملغاه</td>
                                            <td className="frame">{branch.rbPrincipal}</td>
                                            <td className="frame">{branch.rbInt}</td>
                                            <td className="frame">{branch.rbAmount}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={8}></td>
                                            <td className="frame">صافي المبلغ</td>
                                            <td className="frame">{branch.netPrincipal}</td>
                                            <td className="frame">{branch.netInt}</td>
                                            <td className="frame">{branch.netAmount}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={100} className="horizontal-line"></th>
                                        </tr>
                                    </tbody>
                                </React.Fragment>
                            )}
                            <tr style={{ height: "1em" }}></tr>

                            <tbody className="tbodyborder">
                                <tr>
                                    <td className="gray frame" colSpan={2}>إجمالي تاريخ الحركه</td>
                                    <td className="gray frame">{timeToArabicDate(new Date(day.truthDate).valueOf(), false)}</td>
                                    <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                                    <td className="frame">{day.numTrx}</td>
                                    <td></td>
                                    <td></td>
                                    <td className="frame">إجمالي المبلغ</td>
                                    <td className="frame">{day.transactionPrincipal}</td>
                                    <td className="frame">{day.transactionInterest}</td>
                                    <td className="frame">{day.transactionAmount}</td>
                                </tr>

                                <tr>
                                    <td colSpan={8}></td>
                                    <td className="frame">القيمة الملغاه</td>
                                    <td className="frame">{day.rbPrincipal}</td>
                                    <td className="frame">{day.rbInt}</td>
                                    <td className="frame">{day.rbAmount}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8}></td>
                                    <td className="frame">صافي المبلغ</td>
                                    <td className="frame">{day.netPrincipal}</td>
                                    <td className="frame">{day.netInt}</td>
                                    <td className="frame">{day.netAmount}</td>
                                </tr>
                            </tbody>
                        </React.Fragment>
                    )}

                    {/* <tr style={{ height: "1em" }}></tr> */}

                    <tbody className="tbodyborder">
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                            <td className="gray frame">جنيه مصري</td>
                            <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                            <td className="frame">{tempData.trx}</td>
                            <td></td>
                            <td></td>
                            <td className="frame">إجمالي المبلغ</td>
                            <td className="frame">{tempData.transactionPrincipal}</td>
                            <td className="frame">{tempData.transactionInterest}</td>
                            <td className="frame">{tempData.transactionAmount}</td>
                        </tr>

                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">القيمة الملغاه</td>
                            <td className="frame">{tempData.rbPrincipal}</td>
                            <td className="frame">{tempData.rbInt}</td>
                            <td className="frame">{tempData.rbAmount}</td>
                        </tr>
                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">صافي المبلغ</td>
                            <td className="frame">{tempData.netPrincipal}</td>
                            <td className="frame">{tempData.netInt}</td>
                            <td className="frame">{tempData.netAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default DoubtfulPayments;
import React from 'react';
import './loanCreationList.scss';
import { englishToArabic } from '../../../Services/statusLanguage';
import { timeToArabicDate, getTimestamp } from "../../../../Shared/Services/utils";

const LoanCreationList = (props) => {
    const tempData = props.data.data;
    const reportDate = (props.data.from === props.data.to) ? timeToArabicDate(props.data.from, false) : `من ${timeToArabicDate(props.data.from, false)} الي ${timeToArabicDate(props.data.to, false)}`;

    return (
            <div className="loan-creation-list" lang="ar">
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr style={{width:'100%',display:'flex',flexDirection:'row' , justifyContent:'space-between'}}><th colSpan={6}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>قائمة حركة انشاء القروض المنفذه</th>
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
                            <th>كود العميل</th>
                            <th>أسم العميل</th>
                            <th>مسلسل القرض</th>
                            <th>قيمة</th>
                            <th colSpan={2}>تاريخ القرض</th>
                            <th>الحالة الان</th>
                            <th>أصل</th>
                            <th colSpan={2}>قيمة الحركة فائدة</th>
                            <th colSpan={2}>إجمالي</th>
                            <th>حالة الحركة</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                    </thead>
                    {tempData.result.map((day, x) =>
                        <React.Fragment key={x}>
                            <tbody>
                                <tr>
                                    <th className="gray frame" colSpan={2}>تاريخ الحركه</th>
                                    <th className="gray frame" colSpan={2}>{timeToArabicDate(new Date(day.day).valueOf(), false)}</th>
                                </tr>
                            </tbody>
                            {day.branches.map((branch, i) =>
                                <React.Fragment key={i}>
                                    <tbody>
                                        <tr>
                                            <th className="gray frame" colSpan={2}>بنك / خرينه </th>
                                            <th className="gray frame" colSpan={2}>{branch.branchName}</th>
                                        </tr>
                                        {branch.df.map((transaction, z) => <tr key={z}>
                                            <td>{transaction.serialNo}</td>
                                            <td>{transaction.customerKey}</td>
                                            <td>{transaction.customerName}</td>
                                            <td>{transaction.loanSerial}</td>
                                            <td>{transaction.principalAmount}</td>
                                            <td colSpan={2}>{timeToArabicDate(getTimestamp(transaction.truthDate), false)}</td>
                                            <td>{englishToArabic(transaction.status).text}</td>
                                            <td>{transaction.principalAmount}</td>
                                            <td colSpan={2}>{transaction.transactionInterest}</td>
                                            <td colSpan={2}>{transaction.transactionAmount}</td>
                                            <td>{transaction.canceled === 1 ? 'الحركة ملغاه' : ''}</td>
                                        </tr>)}
                                        <tr>
                                            <th colSpan={100} className="horizontal-line"></th>
                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <tr>
                                            <td className="frame" colSpan={2}>إجمالي فرع</td>
                                            <td className="frame" colSpan={2}>{branch.branchName}</td>
                                            <td className="frame" colSpan={1}>{timeToArabicDate(new Date(day.day).valueOf(), false)}</td>
                                            <td className="frame">{branch.df.length}</td>
                                            <td></td>
                                            <td></td>
                                            <td className="frame">إجمالي المبلغ</td>
                                            <td className="frame">{branch.total[0]}</td>
                                            <td className="frame">{branch.total[1]}</td>
                                            <td className="frame">{branch.total[2]}</td>
                                        </tr>

                                        <tr>
                                            <td colSpan={8}></td>
                                            <td className="frame">القيمة الملغاه</td>
                                            <td className="frame">{branch.canceled[0]}</td>
                                            <td className="frame">{branch.canceled[1]}</td>
                                            <td className="frame">{branch.canceled[2]}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={8}></td>
                                            <td className="frame">صافي المبلغ</td>
                                            <td className="frame">{branch.net[0]}</td>
                                            <td className="frame">{branch.net[1]}</td>
                                            <td className="frame">{branch.net[2]}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={100} className="horizontal-line"></th>
                                        </tr>
                                    </tbody>
                                </React.Fragment>
                            )}

                            {/* <tr style={{ height: "0.5em" }}></tr> */}

                            <tbody className="tbodyborder">
                                <tr style={{ height: "0.5em" }}></tr>
                                <tr>
                                    <td className="gray frame" colSpan={2}>إجمالي تاريخ الحركه</td>
                                    <td className="gray frame">{timeToArabicDate(new Date(day.day).valueOf(), false)}</td>
                                    <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                                    <td className="frame">{day.trx}</td>
                                    <td></td>
                                    <td></td>
                                    <td className="frame">إجمالي المبلغ</td>
                                    <td className="frame">{day.total[0]}</td>
                                    <td className="frame">{day.total[1]}</td>
                                    <td className="frame">{day.total[2]}</td>
                                </tr>

                                <tr>
                                    <td colSpan={8}></td>
                                    <td className="frame">القيمة الملغاه</td>
                                    <td className="frame">{day.canceled[0]}</td>
                                    <td className="frame">{day.canceled[1]}</td>
                                    <td className="frame">{day.canceled[2]}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8}></td>
                                    <td className="frame">صافي المبلغ</td>
                                    <td className="frame">{day.net[0]}</td>
                                    <td className="frame">{day.net[1]}</td>
                                    <td className="frame">{day.net[2]}</td>
                                </tr>
                                <tr style={{ height: "0.5em" }}></tr>
                            </tbody>
                        </React.Fragment>
                    )}

                    {/* <tr style={{ height: "0.5em" }}></tr> */}

                    <tbody className="tbodyborder">
                        <tr style={{ height: "0.5em" }}></tr>
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                            <td className="gray frame">جنيه مصري</td>
                            <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                            <td className="frame">{tempData.trx}</td>
                            <td></td>
                            <td></td>
                            <td className="frame">إجمالي المبلغ</td>
                            <td className="frame">{tempData.total[0]}</td>
                            <td className="frame">{tempData.total[1]}</td>
                            <td className="frame">{tempData.total[2]}</td>
                        </tr>

                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">القيمة الملغاه</td>
                            <td className="frame">{tempData.canceled[0]}</td>
                            <td className="frame">{tempData.canceled[1]}</td>
                            <td className="frame">{tempData.canceled[2]}</td>
                        </tr>
                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">صافي المبلغ</td>
                            <td className="frame">{tempData.net[0]}</td>
                            <td className="frame">{tempData.net[1]}</td>
                            <td className="frame">{tempData.net[2]}</td>
                        </tr>
                        <tr style={{ height: "0.5em" }}></tr>
                    </tbody>
                </table>
            </div>
    );
}
export default LoanCreationList;
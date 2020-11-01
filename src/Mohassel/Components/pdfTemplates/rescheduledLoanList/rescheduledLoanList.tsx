import React from 'react';
import './rescheduledLoanList.scss';
import { timeToArabicDate, getTimestamp } from '../../../Services/utils';
import { englishToArabic } from '../../../Services/statusLanguage';

const RescheduledLoanList = (props) => {
    const tempData = props.data.data;
    const reportDate = (props.data.from === props.data.to) ? timeToArabicDate(props.data.from, false) : `من ${timeToArabicDate(props.data.from, false)} الي ${timeToArabicDate(props.data.to, false)}`;
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="rescheduled-loan-list" lang="ar">
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>قائمة حركات جدولة القروض المنفذه</th>
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
                            <th colSpan={2}>كود الحركه</th>
                            <th>كود العميل</th>
                            <th>أسم العميل</th>
                            <th>مسلسل القرض</th>
                            <th colSpan={2}>رقم الشيك</th>
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
                                    <th colSpan={2}>تاريخ الحركه</th>
                                    <th colSpan={2}>{timeToArabicDate(new Date(day.day).valueOf(), false)}</th>
                                </tr>
                            </tbody>
                            {day.branches.map((branch, i) =>
                                <React.Fragment key={i}>
                                    <tbody>
                                        <tr>
                                            <th colSpan={2}>بنك / خرينه </th>
                                            <th colSpan={2}>{branch.branchName}</th>
                                        </tr>
                                        {branch.df.map((transaction, z) => <tr key={z}>
                                            <td>{transaction.serialNo}</td>
                                            <td></td>
                                            <td>{transaction.customerKey}</td>
                                            <td>{transaction.customerName}</td>
                                            <td>{transaction.loanSerial}</td>
                                            <td></td>
                                            <td>{transaction.principal}</td>
                                            <td>{timeToArabicDate(getTimestamp(transaction.truthDate), false)}</td>
                                            <td>{englishToArabic(transaction.status).text}</td>
                                            <td>{transaction.principalAmount}</td>
                                            <td>{transaction.transactionInterest}</td>
                                            <td>{transaction.transactionAmount}</td>
                                            <td>{transaction.canceled === 1 ? 'الحركة ملغاه' : ''}</td>
                                        </tr>)}
                                        <tr>
                                            <td colSpan={100} className="horizontal-line"></td>
                                        </tr>
                                    </tbody>
                                    <tbody className="framecell">
                                        <tr>
                                            <td colSpan={2}>إجمالي فرع</td>
                                            <td colSpan={2}>{branch.branchName}</td>
                                            <td colSpan={1}>{timeToArabicDate(new Date(day.day).valueOf(), false)}</td>
                                            <td>{branch.df.length}</td>
                                            <td colSpan={2} style={{ border: "0px" }}></td>
                                            <td>إجمالي المبلغ</td>
                                            <td>{branch.total[0]}</td>
                                            <td>{branch.total[1]}</td>
                                            <td>{branch.total[2]}</td>
                                        </tr>

                                        <tr>
                                            <td colSpan={8} style={{ border: "0px" }}></td>
                                            <td>القيمة الملغاه</td>
                                            <td>{branch.canceled[0]}</td>
                                            <td>{branch.canceled[1]}</td>
                                            <td>{branch.canceled[2]}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={8} style={{ border: "0px" }}></td>
                                            <td>صافي المبلغ</td>
                                            <td>{branch.net[0]}</td>
                                            <td>{branch.net[1]}</td>
                                            <td>{branch.net[2]}</td>
                                        </tr>
                                    </tbody>
                                </React.Fragment>
                            )}
                            <tbody>
                                <tr>
                                    <td className="horizontal-line" colSpan={100}></td>
                                </tr>
                                <tr style={{ height: "0.5em" }}></tr>
                            </tbody>

                            <tbody className="tbodyborder framecell">
                                <tr style={{ height: "0.5em" }}></tr>
                                <tr>
                                    <th colSpan={2}>إجمالي تاريخ الحركه</th>
                                    <th>{timeToArabicDate(new Date(day.day).valueOf(), false)}</th>
                                    <td colSpan={2}>إجمالي عدد الحركات</td>
                                    <td>{day.trx}</td>
                                    <td colSpan={2} style={{ border: "0px" }}></td>
                                    <td>إجمالي المبلغ</td>
                                    <td>{day.total[0]}</td>
                                    <td>{day.total[1]}</td>
                                    <td>{day.total[2]}</td>
                                </tr>

                                <tr>
                                    <td colSpan={8} style={{ border: "0px" }}></td>
                                    <td>القيمة الملغاه</td>
                                    <td>{day.canceled[0]}</td>
                                    <td>{day.canceled[1]}</td>
                                    <td>{day.canceled[2]}</td>
                                </tr>
                                <tr>
                                    <td colSpan={8} style={{ border: "0px" }}></td>
                                    <td>صافي المبلغ</td>
                                    <td>{day.net[0]}</td>
                                    <td>{day.net[1]}</td>
                                    <td>{day.net[2]}</td>
                                </tr>
                                <tr style={{ height: "0.5em" }}></tr>
                            </tbody>
                        </React.Fragment>
                    )}

                    {/* <tr style={{ height: "0.5em" }}></tr> */}

                    <tbody className="tbodyborder framecell">
                        <tr style={{ height: "0.5em" }}></tr>
                        <tr>
                            <th colSpan={2}>إجمالي بالعمله</th>
                            <th>جنيه مصري</th>
                            <td colSpan={2}>إجمالي عدد الحركات</td>
                            <td>{tempData.trx}</td>
                            <td colSpan={2} style={{ border: "0px" }}></td>
                            <td>إجمالي المبلغ</td>
                            <td>{tempData.total[0]}</td>
                            <td>{tempData.total[1]}</td>
                            <td>{tempData.total[2]}</td>
                        </tr>

                        <tr>
                            <td colSpan={8} style={{ border: "0px" }}></td>
                            <td>القيمة الملغاه</td>
                            <td>{tempData.canceled[0]}</td>
                            <td>{tempData.canceled[1]}</td>
                            <td>{tempData.canceled[2]}</td>
                        </tr>
                        <tr>
                            <td colSpan={8} style={{ border: "0px" }}></td>
                            <td>صافي المبلغ</td>
                            <td>{tempData.net[0]}</td>
                            <td>{tempData.net[1]}</td>
                            <td>{tempData.net[2]}</td>
                        </tr>
                        <tr style={{ height: "0.5em" }}></tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default RescheduledLoanList;
import React from 'react'
import './manualPayments.scss'
import Row from 'react-bootstrap/Row'
import { timeToArabicDate } from '../../../../Shared/Services/utils';
interface Props {
    result: {
        days: {
            branches: {
                rows: [
                    {
                        branchName: string;
                        truthDate: string;
                        customerKey: string;
                        customerName: string;
                        loanSerial: string;
                        dateOfPayment: string;
                        installmentStatus: string;
                        loanApplicationKey: string;
                        installmentValue: string;
                        issueDate: string;
                        loanStatus: string;
                        transactionPrincipal: string;
                        transactionInterest: string;
                        transactionAmount: string;
                    }
                ];
                branchName: string;
                truthDate: string;
                numTrx: string;
                transactionPrincipal: string;
                transactionInterest: string;
                transactionAmount: string;
            }[];
            truthDate: string;
            numTrx: number;
            transactionPrincipal: string;
            transactionInterest: string;
            transactionAmount: string;

        }[];
        numTrx: number;
        transactionAmount: string;
        transactionPrincipal: string;
        transactionInterest: string;
    };
    fromDate: any;
    toDate: any;
}
const statusLocalization = (status: string) => {
    switch (status) {
        case 'paid':
            return ('مدفوع');
        case 'partiallyPaid':
            return ('مدفوع جزئيا');
        case 'unpaid':
            return ('لم يستحق');
        case 'pending':
            return ('قيد التحقيق');
        case 'issued':
            return ('مصدر');
        default:
            return status;
    }
}

const ManualPayments = (props: Props) => {
    return (
            <div className="manual-payments" dir="rtl" lang="ar">
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>مراجعه حركات السداد اليدوي</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr className="headtitle">
                            <th colSpan={6}>تاريخ الحركه من {timeToArabicDate(props.fromDate, false)} الي {timeToArabicDate(props.toDate, false)}</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>{timeToArabicDate(0, true)}</th>
                            <th colSpan={6}>جنيه مصري</th>
                        </tr>
                    </thead>
                    {
                        props.result.days.map((day) => {
                            return (
                                <>
                                    <tr>
                                        <th colSpan={12} className="border"></th>
                                    </tr>
                                    <thead>
                                        <tr>
                                            <th>رقم مسلسل</th>
                                            <th>كود الحركه</th>
                                            <th>مسلسل القسط</th>
                                            <th className="name">أسم العميل</th>
                                            <th>مستند الضمان</th>
                                            <th>قيمة القسط</th>
                                            <th>تاريخ استحقاق القسط</th>
                                            <th>حالة القسط</th>
                                            <th>مستند الحركه</th>
                                            <th>أصل</th>
                                            <th>القيمه المسدده مصاريف</th>
                                            <th>إجمالي</th>
                                        </tr>
                                        <tr>
                                            <th colSpan={12} className="border"></th>
                                        </tr>
                                    </thead>
                                    {day.branches.map((branch) => {
                                        return (
                                            <>

                                                {branch.rows.map((row) => {
                                                    return (
                                                        <>
                                                            <tr style={{ height: "1em" }}></tr>
                                                            <tbody>
                                                                <tr>
                                                                    <th className="gray frame" colSpan={2}>تاريخ الحركه</th>
                                                                    <th className="gray frame" colSpan={2}>{row.truthDate}</th>
                                                                </tr>
                                                                <tr>
                                                                    <td>{row.loanSerial}</td>
                                                                    <td></td>
                                                                    <td>{row.loanApplicationKey}</td>
                                                                    <td>{row.customerName}</td>
                                                                    <td></td>
                                                                    <td>{row.installmentValue}</td>
                                                                    <td>{row.dateOfPayment}</td>
                                                                    <td>{statusLocalization(row.installmentStatus)}</td>
                                                                    <td></td>
                                                                    <td>{row.transactionPrincipal}</td>
                                                                    <td>{row.transactionInterest}</td>
                                                                    <td>{row.transactionAmount}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th colSpan={12} className="border"></th>
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                    )
                                                })}
                                                <tbody>
                                                    <tr>
                                                        <td className="frame" colSpan={2}>إسم الفرع</td>
                                                        <td className="frame" colSpan={2}>{branch.branchName}</td>
                                                        <td className="frame" colSpan={1}>{branch.truthDate}</td>
                                                        <td className="frame">{branch.numTrx}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>{branch.transactionPrincipal}</td>
                                                        <td>{branch.transactionInterest}</td>
                                                        <td>{branch.transactionAmount}</td>
                                                    </tr>

                                                    <tr>
                                                        <th colSpan={12} className="border"></th>
                                                    </tr>
                                                </tbody>
                                            </>
                                        )
                                    })}

                                    <tr style={{ height: "1em" }}></tr>

                                    <tbody className="tbodyborder">
                                        <tr>
                                            <td className="gray frame" colSpan={2}>إجمالي تاريخ الحركه</td>
                                            <td className="gray frame">{day.truthDate}</td>
                                            <td></td>
                                            <td className="frame">إجمالي عدد الحركات</td>
                                            <td className="frame">{day.numTrx}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className="frame">{day.transactionPrincipal}</td>
                                            <td className="frame">{day.transactionInterest}</td>
                                            <td className="frame">{day.transactionAmount}</td>
                                        </tr>

                                    </tbody>

                                    <tr style={{ height: "1em" }}></tr>
                                </>
                            )
                        })}
                    <tr style={{ height: "1em" }} ></tr>
                    <tbody className="tbodyborder">
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                            <td className="gray frame">جنيه مصري</td>
                            <td></td>
                            <td className="frame">إجمالي عدد الحركات</td>
                            <td className="frame">{props.result.numTrx}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="frame">{props.result.transactionPrincipal}</td>
                            <td className="frame">{props.result.transactionInterest}</td>
                            <td className="frame">{props.result.transactionAmount}</td>
                        </tr>

                    </tbody>

                </table>
            </div>
    )
}



export default ManualPayments;

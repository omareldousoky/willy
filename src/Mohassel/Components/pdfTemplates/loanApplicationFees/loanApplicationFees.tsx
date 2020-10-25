import React from 'react';
import './loanApplicationFees.scss';
import { timeToArabicDate } from '../../../Services/utils';

interface Props {
    result: {
        branches: {
            df: {
                truthDate: string;
                branchName: string;
                serialNo: number;
                customerKey: string;
                customerName: string;
                loanSerial: number;
                principal: number;
                status: string;
                principalAmount: number;
                transactionInterest: number;
                transactionAmount: number;
                canceled: number;

            }[];
            total: number[];
            canceled: number[];
            net: number[];
            branchName: string;

        }[];
        trx: number;
        day: string;
        total: number[];
        canceled: number[];
        net: number[];
    }[];
    total: number[];
    canceled: number[];
    net: number[];
    trx: number;
    startDate: any;
    endDate: any;
}

const statusLocalization = (status: string) => {
    switch (status) {
        case 'paid':
            return ('مدفوع');
        case 'issued':
            return ('مصدر');
        case 'canceled':
            return ('ملغي');
        case 'pending':
            return ('قيد التحقيق');
        default:
            return status;
    }
}
const LoanApplicationFees = (props: Props) => {
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="loan-application-fees" lang="ar">
                <table className="report-container">
                    <thead className="report-header">
                        <tr className="headtitle">
                            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
                            <th colSpan={6}>قائمة حركات رسوم طلب القرض المنفذه</th>
                            <th rowSpan={3} colSpan={3}>
                                <img width="100px"
                                    src="data:image/jpeg;base64,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fTt1B3G5IIv12XdJsZG9hhfUVr4S0NyOnfaw4dY0CkWbNwClbRZXcixuVozHMLag5t9weKt1amhGT0+I00WZlVTTCNt8ssLo3Oa0XsZA86245V7rtoJXRUnINYJa0sDTKCWx80vcSBbNYA2Gl1sfsgx4LH1Na+NwALHzuLSOg9IXfieAxVETInNLWxFrozGSxzC3RpY4atIGijcFU26hrG0Upmq6dzOZzRTFhOosA4yHVd3lBaDT0oOo+m0niumo2JhmblqJqudt7hss7iAeBy9I6VMYng8dS1jJQ60ckcjcriOcz0STxU3LwNO1bfsVUOimm/8AUqu7SuthtK64GWSjJL2GUNs4auZxCuNbRtmjfE8HLIxzXWNjY6Gx4LU/C43Q/R3NzRZMhDtbi1telRjloQtZhVdLG6N1bTZHsLT9jO4ixt53Teora+ilhpKGNkwtDVUrZJHtuLBwDXFt92bLxUs3Y2LLyZnrHRAAcm6oeW2G4dJGm5TNVhkcsRgewOjc3KW9XAJLoQOJYNW1EUkMldTcnIwtNqUjQ9fKrl2ypTFR0kRdm5Opom5t18rmi5Fyu8bHRWDHT1j4m5bRvneWabgRxHUpfEMJjnhMD2nk7NsGmxGUggg8CLDVN9xIIuTDaHkWBnKSvsSbzPMjteGYrrVAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//Z" />
                            </th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>المركز الرئيسي</th>
                            <th colSpan={6}>تاريخ الحركه من {timeToArabicDate(props.startDate, false)} الي {timeToArabicDate(props.endDate, false)}</th>
                        </tr>
                        <tr className="headtitle">
                            <th colSpan={4}>{timeToArabicDate(0, true)}</th>
                            <th colSpan={6}>جنيه مصري</th>
                        </tr>
                        <tr>
                            <th colSpan={100} className="horizontal-line"></th>
                        </tr>
                    </thead>
                </table>
                <table>
                    {props.result.map((res) => {
                        return (
                            <>
                                {res.branches.map((branch) => {
                                    return (
                                        <>
                                            <thead>
                                                <tr>
                                                    <th>رقم مسلسل</th>
                                                    <th>كود الحركه</th>
                                                    <th>كود العميل</th>
                                                    <th>أسم العميل</th>
                                                    <th>مسلسل القرض</th>
                                                    <th>رقم الشيك</th>
                                                    <th>قيمة</th>
                                                    <th>تاريخ القرض</th>
                                                    <th style={{ width: "10%" }}>الحالة الان</th>
                                                    <th>أصل</th>
                                                    <th>قيمة الحركة فائدة</th>
                                                    <th>إجمالي</th>
                                                    <th>حالة الحركة</th>
                                                </tr>
                                                <tr>
                                                    <th colSpan={100} className="horizontal-line"></th>
                                                </tr>
                                                <tr>
                                                    <th className="gray frame" colSpan={2}>تاريخ الحركه</th>
                                                    <th className="gray frame" colSpan={2}>{res.day}</th>
                                                </tr>
                                                <tr>
                                                    <th className="gray frame" colSpan={2}>إسم الفرع</th>
                                                    <th className="gray frame" colSpan={2}>{branch.branchName}</th>
                                                </tr>
                                            </thead>
                                            {branch.df.map((row) => {
                                                return (
                                                    <>

                                                        <tbody>
                                                            <tr>
                                                                <td>{row.serialNo}</td>
                                                                <td></td>
                                                                <td>{row.customerKey}</td>
                                                                <td>{row.customerName}</td>
                                                                <td>{row.loanSerial}</td>
                                                                <td></td>
                                                                <td>{row.principal}</td>
                                                                <td>{row.truthDate}</td>
                                                                <td>{statusLocalization(row.status)}</td>
                                                                <td>{row.principalAmount}</td>
                                                                <td>{row.transactionInterest}</td>
                                                                <td>{row.transactionAmount}</td>
                                                                <td>{row.canceled === 1 ? 'الحركة ملغاه' : ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <th colSpan={100} className="horizontal-line"></th>
                                                            </tr>
                                                        </tbody>
                                                    </>
                                                )
                                            })}
                                            <tbody style={{ marginTop: '1rem' }}>
                                                <tr>
                                                    <td className="frame" colSpan={2}>إجمالي الفرع</td>
                                                    <td className="frame" colSpan={2}>{branch.branchName}</td>
                                                    <td className="frame" colSpan={1}>{res.day}</td>
                                                    <td className="frame">{""}</td>
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
                                        </>
                                    )
                                })}
                                <tr style={{ height: "1em" }} ></tr>

                                <tbody className="tbodyborder">
                                    <tr>
                                        <td className="gray frame" colSpan={2}>إجمالي تاريخ الحركه</td>
                                        <td className="gray frame">{res.day}</td>
                                        <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                                        <td className="frame">{res.trx}</td>
                                        <td></td>
                                        <td></td>
                                        <td className="frame">إجمالي المبلغ</td>
                                        <td className="frame">{res.total[0]}</td>
                                        <td className="frame">{res.total[1]}</td>
                                        <td className="frame">{res.total[2]}</td>
                                    </tr>

                                    <tr>
                                        <td colSpan={8}></td>
                                        <td className="frame">القيمة الملغاه</td>
                                        <td className="frame">{res.canceled[0]}</td>
                                        <td className="frame">{res.canceled[1]}</td>
                                        <td className="frame">{res.canceled[2]}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8}></td>
                                        <td className="frame">صافي المبلغ</td>
                                        <td className="frame">{res.net[0]}</td>
                                        <td className="frame">{res.net[1]}</td>
                                        <td className="frame">{res.net[2]}</td>
                                    </tr>
                                </tbody>
                            </>
                        )
                    })}

                    <tr style={{ height: "1em" }} ></tr>

                    <tbody className="tbodyborder">
                        <tr>
                            <td className="gray frame" colSpan={2}>إجمالي بالعمله</td>
                            <td className="gray frame">جنيه مصري</td>
                            <td className="frame" colSpan={2}>إجمالي عدد الحركات</td>
                            <td className="frame">{props.trx}</td>
                            <td></td>
                            <td></td>
                            <td className="frame">إجمالي المبلغ</td>
                            <td className="frame">{props.total[0]}</td>
                            <td className="frame">{props.total[1]}</td>
                            <td className="frame">{props.total[2]}</td>
                        </tr>

                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">القيمة الملغاه</td>
                            <td className="frame">{props.canceled[0]}</td>
                            <td className="frame">{props.canceled[1]}</td>
                            <td className="frame">{props.canceled[2]}</td>
                        </tr>
                        <tr>
                            <td colSpan={8}></td>
                            <td className="frame">صافي المبلغ</td>
                            <td className="frame">{props.net[0]}</td>
                            <td className="frame">{props.net[1]}</td>
                            <td className="frame">{props.net[2]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default LoanApplicationFees;
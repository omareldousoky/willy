import React from 'react';
import './reviewedApplications.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { ageCalculate, timeToArabicDate, beneficiaryType } from './../../../Services/utils';
import store from '../../../redux/store';
const ReviewedApplicationsPDF = (props) => {
    function getTotal() {
        let sum = 0;
        props.data.forEach(application => sum += (application.principal ? application.principal : 0))
        return sum
    }
    return (
        <div className="reviewed-applications-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <thead style={{ fontSize: "12px" }}>
                    <tr style={{ height: "10px" }}></tr>
                    <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                    <tr style={{ height: "10px" }}></tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="title titleborder titlebackground">
                            شركة تساهيل للتمويل متناهي الصغر</td>
                        <td style={{ width: "30%" }}></td>
                        {/* <td className="title">الجيزه - امبابه ثان</td> */}
                        <td className="title">{props.branchDetails.name}</td>
                    </tr>
                    <tr>
                        <td>{timeToArabicDate(0, true)}</td>
                        <td></td>
                        <td style={{ fontSize: '8px' }}>{store.getState().auth.name}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div className="title titleborder titlebackground titlestyle">
                قرارات الموافقه على صرف التمويلات
                {/* - فردى - لدفعة ( &emsp; / &emsp; / &emsp; ) */}
            </div>
            <table className="tablestyle" style={{ border: "1px black solid" }}>
                <tbody>
                    <tr>
                        <th>مسلسل</th>
                        <th>نوع العميل</th>
                        <th>الكود</th>
                        <th>اسم العميل</th>
                        <th>السن</th>
                        <th>النشاط</th>
                        <th>اسم الاخصائى</th>
                        <th>الرقم القومى</th>
                        <th>المبلغ الحالى</th>
                        <th>المده</th>
                        {/* <th>المبلغ بالحروف</th> */}
                    </tr>
                    {props.data.map((application, i) => <tr key={application.id}>
                        <td>{application.serialNumber}</td>
                        <td>{beneficiaryType(application.beneficiaryType)}</td>
                        <td>{application.customerKey}</td>
                        <td>{application.customerName}</td>
                        <td>{application.customerAge}</td>
                        <td>{application.businessSector}</td>
                        <td>{application.representativeName}</td>
                        <td>{application.nationalId}</td>
                        <td>{application.principal}</td>
                        <td>{application.noOfInstallments}</td>
                        {/* <td>فقط عشرة آلاف جنيه لاغير</td> */}
                    </tr>)}
                </tbody>
            </table>
            <table className="overall">
                <tbody>
                    <tr>
                        <td className="titleborder">اجمالى عام</td>
                        {/* <td className="titleborder">١</td> */}
                        <td className="titleborder">{getTotal()}</td>
                        {/* <td className="titleborder">فقط عشرة آلاف جنيه لاغير</td> */}
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>المراجعه:</td>
                        <td>مدير الفرع:</td>
                        <td>مدير المنطقه:</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default ReviewedApplicationsPDF;
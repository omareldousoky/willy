import React from 'react';
import './reviewedApplications.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { ageCalculate } from './../../../Services/utils';
import store from '../../../redux/store';
const ReviewedApplicationsPDF = (props) => {
    return (
        <div className="reviewed-applications-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <td className="title titleborder titlebackground">
                            شركة تساهيل للتمويل متناهي الصغر</td>
                        <td style={{ width: "30%" }}></td>
                        <td className="title">الجيزه - امبابه ثان</td>
                    </tr>
                    <tr>
                        <td>١٦:٢٦:٠١ &emsp; ٢٠٢٠/٠٥/٠٥</td>
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
                قرارات الموافقه على صرف التمويلات - فردى - لدفعة ( &emsp; / &emsp; / &emsp; )
	</div>
            <table className="tablestyle" style={{ border: "1px black solid" }}>
                <tbody>
                    <tr>
                        <th>مسلسل</th>
                        <th>الكود</th>
                        <th>اسم العميل</th>
                        <th>السن</th>
                        <th>النشاط</th>
                        <th>اسم الاخصائى</th>
                        <th>الرقم القومى</th>
                        <th>المبلغ الحالى</th>
                        <th>المده</th>
                        <th>المبلغ بالحروف</th>
                    </tr>
                    {props.data.map((application, i) => <tr key={application.id}>
                        <td>{i + 1}</td>
                        <td>{application.application.customer._id}</td>
                        <td>{application.application.customer.customerName}</td>
                        <td>{ageCalculate(application.application.customer.birthDate)}</td>
                        <td>{application.application.customer.businessSector}</td>
                        <td>{application.application.customer.representative}</td>
                        <td>{application.application.customer.nationalId}</td>
                        <td>{application.application.principal}</td>
                        <td>{application.application.product.noOfInstallments}</td>
                        <td>فقط عشرة آلاف جنيه لاغير</td>
                    </tr>)}
                </tbody>
            </table>
            <table className="overall">
                <tbody>
                    <tr>
                        <td className="titleborder">اجمالى عام</td>
                        <td className="titleborder">١</td>
                        <td className="titleborder">١٠٠٠٠</td>
                        <td className="titleborder">فقط عشرة آلاف جنيه لاغير</td>
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
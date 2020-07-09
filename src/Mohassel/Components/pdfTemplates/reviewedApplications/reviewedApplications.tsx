import React from 'react';
import './reviewedApplications.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { ageCalculate } from './../../../Services/utils';
import store from '../../../redux/store';
const ReviewedApplicationsPDF = (props) => {
    function getTotal(){
        let sum = 0;
        props.data.forEach(application => sum += (application.application.principal ? application.application.principal : 0))
        return sum
    }
    return (
        <div className="reviewed-applications-print" style={{ direction: "rtl" }} lang="ar">
            <table>
                <tbody>
                    <tr>
                        <td className="title titleborder titlebackground">
                            شركة تساهيل للتمويل متناهي الصغر</td>
                        <td style={{ width: "30%" }}></td>
                        {/* <td className="title">الجيزه - امبابه ثان</td> */}
                        <td className="title">{props.branchDetails.name}</td>
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
                        {/* <th>المبلغ بالحروف</th> */}
                    </tr>
                    {props.data.map((application, i) => <tr key={application.id}>
                        <td>{i + 1}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? application.application.group.individualsInGroup.find(member => member.type === 'leader').customer._id : application.application.customer._id}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? application.application.group.individualsInGroup.find(member => member.type === 'leader').customer.customerName : application.application.customer.customerName}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? ageCalculate(application.application.group.individualsInGroup.find(member => member.type === 'leader').customer.birthDate) : ageCalculate(application.application.customer.birthDate)}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? application.application.group.individualsInGroup.find(member => member.type === 'leader').customer.businessSector : application.application.customer.businessSector}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? application.application.group.individualsInGroup.find(member => member.type === 'leader').customer.representative : application.application.customer.representative}</td>
                        <td>{(application.application.product.beneficiaryType === 'group') ? application.application.group.individualsInGroup.find(member => member.type === 'leader').customer.nationalId : application.application.customer.nationalId}</td>
                        <td>{(application.application.principal) ? application.application.principal : 0}</td>
                        <td>{application.application.product.noOfInstallments}</td>
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
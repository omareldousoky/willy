import React from 'react';
import './totalWrittenChecks.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { numbersToArabic } from '../../../Services/utils';
import Tafgeet from 'tafgeetjs';

const TotalWrittenChecks = (props) => {
    return (
        <div className="total-written-checks-print">
            {props.data.product.beneficiaryType === "individual" ?
                <>
                    <div className="check">
                        <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                        <div className="title">ايصال استلام مبلغ نقدى علي سبيل الامانه</div>
                        <div>استلمت انا الموقع ادناه / {props.data.customer.customerName}</div>
                        <div>بطاقه رقم قومي: {numbersToArabic(props.data.customer.nationalId)}</div>
                        <div>والمقيم في: {props.data.customer.customerHomeAddress}</div>
                        <div>من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;</div>
                        <div>مبلغاً وقدره {`${numbersToArabic(props.data.installmentsObject.totalInstallments.installmentSum)} = (${new Tafgeet(props.data.installmentsObject.totalInstallments.installmentSum, 'EGP').parse()})`} </div>
                        <div>وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك العربي الأفريقي الدولي فرع مدينه نصر</div>
                        <div>وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائننا للأمانه واتحمل المسئوليتين المدنيه والجنائيه عن هذا
			الفعل ولا تبرأ ذمتي الا بإستلام هذا الايصال</div>
                        <table>
                            <tbody>
                                <tr>
                                    <td colSpan={2}>
                                        <div>المستلم</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>الاسم:</div>
                                    </td>
                                    <td style={{ width: "250px" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {props.data.guarantors.map((guarantor, index) => {
                        return (
                            <div className="check" key={index}>
                                <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                                <div className="title">ايصال استلام مبلغ نقدى علي سبيل الامانه</div>
                                <div>استلمت انا الموقع ادناه / {guarantor.customerName}</div>
                                <div>بطاقه رقم قومي: {numbersToArabic(guarantor.nationalId)}</div>
                                <div>والمقيم في: {guarantor.customerHomeAddress}</div>
                                <div>من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;</div>
                                <div>مبلغاً وقدره {`${numbersToArabic(props.data.installmentsObject.totalInstallments.installmentSum)} = (${new Tafgeet(props.data.installmentsObject.totalInstallments.installmentSum, 'EGP').parse()})`} </div>
                                <div>وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك العربي الأفريقي الدولي فرع مدينه نصر</div>
                                <div>وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائننا للأمانه واتحمل المسئوليتين المدنيه والجنائيه عن هذا
			الفعل ولا تبرأ ذمتي الا بإستلام هذا الايصال</div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <div>المستلم</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>الاسم:</div>
                                            </td>
                                            <td style={{ width: "250px" }}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                </>
                :
                props.data.group.individualsInGroup.map((individualInGroup, index) => {
                    return (
                        <div className="check" key={index}>
                            <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                            <div className="title">ايصال استلام مبلغ نقدى علي سبيل الامانه</div>
                            <div>استلمت انا الموقع ادناه / {individualInGroup.customer.customerName}</div>
                            <div>بطاقه رقم قومي: {numbersToArabic(individualInGroup.customer.nationalId)}</div>
                            <div>والمقيم في: {individualInGroup.customer.customerHomeAddress}</div>
                            <div>من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;</div>
                            <div>مبلغاً وقدره {`${numbersToArabic(individualInGroup.amount)} = (${new Tafgeet(individualInGroup.amount, 'EGP').parse()})`} </div>
                            <div>وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك العربي الأفريقي الدولي فرع مدينه نصر</div>
                            <div>وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائننا للأمانه واتحمل المسئوليتين المدنيه والجنائيه عن هذا
			الفعل ولا تبرأ ذمتي الا بإستلام هذا الايصال</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            <div>المستلم</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div>الاسم:</div>
                                        </td>
                                        <td style={{ width: "250px" }}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default TotalWrittenChecks;
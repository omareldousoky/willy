import React from 'react';
import './cashReceipt.scss';
import { numbersToArabic, timeToArabicDate } from '../../../Services/utils';
import Tafgeet from 'tafgeetjs';

const CashReceipt = (props) => {
    return (
        <>
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
            <div className="cash-receipt" lang="ar">
                <div>
                    <table className="textcenter bottomborder">
                        <tbody>
                            <tr>
                                <td>
                                    <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                                    <div>Tasaheel Microfinance S.A.E</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {props.data.product.beneficiaryType === "individual" ?
                    <>
                        <div className="bottomborder">

                            <div className="headtitle textcenter">ايصال استلام مبلغ نقدى</div>
                            <div>  تحريرا في
			<span>{' ' + timeToArabicDate(0, false) + ' '}</span>
                            </div>
                            <div>استلمت انا / {props.data.customer.customerName}، مبلغ {`${numbersToArabic(props.data.principal)} جنيه = (${new Tafgeet(props.data.principal, 'EGP').parse()})`} من شركة
			تساهيل للتمويل متناهي الصغر قيمة مبلغ التمويل (القرض)</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>توقيع المستلم</div>
                                            <div>الاسم/ {props.data.customer.customerName}</div>

                                        </td>
                                        <td>
                                            <div>التوقيع :
							<div style={{ display: "inline-block" }}>---------------------</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="divFooter">
                            <div className="headtitle textcenter"> <u>إقرار</u></div>
                            <div>تم توقيع العملاء امامنا وتم اخذ البصمه بمعرفتنا بعد التأكد من شخصية العملاء والاطلاع علي اصل تحقيق الشخصيه
			وتسليم كل عميل مبلغ التمويل الخاص به.</div>

                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>توقيع اعضاء لجنة التسليم</div>
                                        </td>
                                        <td>
                                            <div>---------------------</div>
                                        </td>
                                        <td>
                                            <div>---------------------</div>
                                        </td>
                                        <td>
                                            <div>توقيع مدير الفرع :
							<div style={{ display: "inline-block" }}>---------------------</div>
                                            </div>
                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
                    props.data.group.individualsInGroup.map((individualInGroup, index) => {
                        return (
                            <div key={index}>
                                <div className="bottomborder">

                                    <div className="headtitle textcenter">ايصال استلام مبلغ نقدى</div>
                                    <div>  تحريرا في
                                    <span>{' ' + timeToArabicDate(0, false) + ' '}</span>
                                    </div>
                                    <div>استلمت انا / {individualInGroup.customer.customerName}، مبلغ {`${numbersToArabic(individualInGroup.amount)} جنيه = (${new Tafgeet(individualInGroup.amount, 'EGP').parse()})`} من شركة
                                 تساهيل للتمويل متناهي الصغر قيمة مبلغ التمويل (القرض)
                                </div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>توقيع المستلم</div>
                                                    <div>الاسم/ {individualInGroup.customer.customerName}</div>

                                                </td>
                                                <td>
                                                    <div>التوقيع :
                                                    <div style={{ display: "inline-block" }}>---------------------</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="divFooter">
                                    <div className="headtitle textcenter"> <u>إقرار</u></div>
                                    <div>تم توقيع العملاء امامنا وتم اخذ البصمه بمعرفتنا بعد التأكد من شخصية العملاء والاطلاع علي اصل تحقيق الشخصيه
                                وتسليم كل عميل مبلغ التمويل الخاص به.</div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>توقيع اعضاء لجنة التسليم</div>
                                                </td>
                                                <td>
                                                    <div>---------------------</div>
                                                </td>
                                                <td>
                                                    <div>---------------------</div>
                                                </td>
                                                <td>
                                                    <div>توقيع مدير الفرع :
                                                    <div style={{ display: "inline-block" }}>---------------------</div>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default CashReceipt;
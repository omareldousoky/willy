import React from 'react';
import './cashReceipt.scss';
import { numbersToArabic, timeToArabicDate } from '../../../Services/utils';

const CashReceipt = (props) => {
    return (
        <div className="cash-receipt" lang="ar">
            <div>
                <table className="textcenter bottomborder">
                    <tbody>
                        <tr>
                            <td>
                                <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                                <div>Tasaheel Microfinance S.A.E</div>
                            </td>
                            <td>
                                <img width="150px"
                                    src="data:image/jpeg;base64,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fTt1B3G5IIv12XdJsZG9hhfUVr4S0NyOnfaw4dY0CkWbNwClbRZXcixuVozHMLag5t9weKt1amhGT0+I00WZlVTTCNt8ssLo3Oa0XsZA86245V7rtoJXRUnINYJa0sDTKCWx80vcSBbNYA2Gl1sfsgx4LH1Na+NwALHzuLSOg9IXfieAxVETInNLWxFrozGSxzC3RpY4atIGijcFU26hrG0Upmq6dzOZzRTFhOosA4yHVd3lBaDT0oOo+m0niumo2JhmblqJqudt7hss7iAeBy9I6VMYng8dS1jJQ60ckcjcriOcz0STxU3LwNO1bfsVUOimm/8AUqu7SuthtK64GWSjJL2GUNs4auZxCuNbRtmjfE8HLIxzXWNjY6Gx4LU/C43Q/R3NzRZMhDtbi1telRjloQtZhVdLG6N1bTZHsLT9jO4ixt53Teora+ilhpKGNkwtDVUrZJHtuLBwDXFt92bLxUs3Y2LLyZnrHRAAcm6oeW2G4dJGm5TNVhkcsRgewOjc3KW9XAJLoQOJYNW1EUkMldTcnIwtNqUjQ9fKrl2ypTFR0kRdm5Opom5t18rmi5Fyu8bHRWDHT1j4m5bRvneWabgRxHUpfEMJjnhMD2nk7NsGmxGUggg8CLDVN9xIIuTDaHkWBnKSvsSbzPMjteGYrrVAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//Z" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div className="bottomborder">

                <div className="headtitle textcenter">ايصال استلام مبلغ نقدى</div>
                <div>  تحريرا في
			<span>{' ' + timeToArabicDate(0, false) + ' ' }</span>
                </div>
                <div>استلمت انا / {props.data.customer.customerName}، مبلغ {numbersToArabic(props.data.principal)} جنيه’ من شركة
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

        </div>
    )
}

export default CashReceipt;
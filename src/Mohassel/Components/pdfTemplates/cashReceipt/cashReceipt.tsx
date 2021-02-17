import React from 'react';
import './cashReceipt.scss';
import { numbersToArabic, timeToArabicDate } from "../../../../Shared/Services/utils";
import Tafgeet from 'tafgeetjs';

const CashReceipt = (props) => {
  return (
    <div className="cash-receipt-pdf" lang="ar">
      <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
        <thead>
          <tr style={{ height: "10px" }}></tr>
          <tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><th colSpan={6}><div className={"logo-print"}></div></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
          <tr style={{ height: "10px" }}></tr>
          <tr>
            <td>
              <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
              <div>Tasaheel Microfinance S.A.E</div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="bottomborder"></div>
            </td>
          </tr>
        </thead>
        <tbody>
          {props.data.product.beneficiaryType === "individual" ?
            <tr>
              <td>
                <div className="bottomborder">
                  <div className="headtitle textcenter">ايصال استلام مبلغ نقدى</div>
                  <div>  تحريرا في<span>{' ' + timeToArabicDate(props.data.creationDate, false) + ' '}</span></div>
                  <div style={{ textAlign: "right" }}>استلمت انا / {props.data.customer.customerName}، مبلغ {`${numbersToArabic(props.data.principal)} جنيه = (${new Tafgeet(props.data.principal, 'EGP').parse()})`} من شركة
			تساهيل للتمويل متناهي الصغر قيمة مبلغ التمويل (القرض)</div>
                  <table style={{ margin: '50px 0px' }}>
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
              </td>
            </tr>
            :
            props.data.group.individualsInGroup.map((individualInGroup, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="bottomborder"style={index === 4 ? { pageBreakAfter: "always" } : {}}>
                      <div className="headtitle textcenter">ايصال استلام مبلغ نقدى</div>
                      <div>  تحريرا في<span>{' ' + timeToArabicDate(props.data.creationDate, false) + ' '}</span></div>
                      <div style={{ margin: '20px 0px', textAlign: "right" }}>استلمت انا / {individualInGroup.customer.customerName}، مبلغ {`${numbersToArabic(individualInGroup.amount)} جنيه' (${new Tafgeet(individualInGroup.amount, 'EGP').parse()})`} من شركة
                                 تساهيل للتمويل متناهي الصغر قيمة مبلغ التمويل (القرض)
                  </div>
                      <table style={{ margin: '60px 0px' }}>
                        <tbody>
                          <tr>
                            <td className="sign">
                              <div>توقيع المستلم</div>
                              <div>الاسم/ {individualInGroup.customer.customerName}</div>

                            </td>
                            <td className="sign">
                              <div>التوقيع :
                            <div style={{ display: "inline-block" }}>---------------------</div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="divFooter">
                <div className="headtitle textcenter"> <u>إقرار</u></div>
                <div>تم توقيع العملاء امامنا وتم اخذ البصمه بمعرفتنا بعد التأكد من شخصية العملاء والاطلاع علي اصل تحقيق الشخصيه
			وتسليم كل عميل مبلغ التمويل الخاص به.</div>

                <table style={{ marginTop: 50 }}>
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
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default CashReceipt;


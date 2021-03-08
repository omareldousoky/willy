import React from 'react'
import './totalWrittenChecks.scss'
import Tafgeet from 'tafgeetjs'
import local from '../../../../Shared/Assets/ar.json'
import { numbersToArabic } from '../../../../Shared/Services/utils'

const TotalWrittenChecks = (props) => {
  return (
    <div className="total-written-checks-print">
      <table style={{ margin: '10px 0px', textAlign: 'center', width: '100%' }}>
        <tr style={{ height: '10px' }} />
        <tr
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <th colSpan={6}>
            <div className="logo-print" />
          </th>
          <th colSpan={6}>
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </table>
      {props.data.product.beneficiaryType === 'individual' ? (
        <>
          <div className="check">
            <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
            <div className="title">إيصال استلام مبلغ نقدى علي سبيل الامانه</div>
            <div>
              استلمت انا الموقع ادناه / {props.data.customer.customerName}
            </div>
            <div>
              بطاقه رقم قومي: {numbersToArabic(props.data.customer.nationalId)}
            </div>
            <div>والمقيم في: {props.data.customer.customerHomeAddress}</div>
            <div>من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;</div>
            <div>
              مبلغاً وقدره{' '}
              {`${numbersToArabic(
                props.data.installmentsObject.totalInstallments.installmentSum
              )} جنيه = (${new Tafgeet(
                props.data.installmentsObject.totalInstallments.installmentSum,
                'EGP'
              ).parse()})`}{' '}
            </div>
            <div>
              وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك
              العربي الافريقي الدولي فرع مدينه نصر
            </div>
            <div>
              وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائنا للأمانه واتحمل
              المسئوليتين المدنيه والجنائيه عن هذا الفعل ولا تبرأ ذمتي الا
              باستلام هذا الإيصال
            </div>
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
                  <td style={{ width: 400, height: 250 }} />
                </tr>
              </tbody>
            </table>
          </div>
          {props.data.guarantors.map((guarantor, index) => {
            return (
              <div className="check" key={index}>
                <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
                <div className="title">
                  إيصال استلام مبلغ نقدى علي سبيل الامانه
                </div>
                <div>استلمت انا الموقع ادناه / {guarantor.customerName}</div>
                <div>
                  بطاقه رقم قومي: {numbersToArabic(guarantor.nationalId)}
                </div>
                <div>والمقيم في: {guarantor.customerHomeAddress}</div>
                <div>
                  من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;
                </div>
                <div>
                  مبلغاً وقدره{' '}
                  {`${numbersToArabic(
                    props.data.installmentsObject.totalInstallments
                      .installmentSum
                  )} جنيه = (${new Tafgeet(
                    props.data.installmentsObject.totalInstallments.installmentSum,
                    'EGP'
                  ).parse()})`}{' '}
                </div>
                <div>
                  وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك
                  العربي الافريقي الدولي فرع مدينه نصر
                </div>
                <div>
                  وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائنا للأمانه
                  واتحمل المسئوليتين المدنيه والجنائيه عن هذا الفعل ولا تبرأ
                  ذمتي الا باستلام هذا الإيصال
                </div>
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
                      <td style={{ width: 400, height: 250 }} />
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })}
        </>
      ) : (
        props.data.group.individualsInGroup.map((individualInGroup, index) => {
          return (
            <div className="check" key={index}>
              <div>شركة تساهيل للتمويل متناهي الصغر ش. م. م.</div>
              <div className="title">
                إيصال استلام مبلغ نقدى علي سبيل الامانه
              </div>
              <div>
                استلمت انا الموقع ادناه /{' '}
                {individualInGroup.customer.customerName}
              </div>
              <div>
                بطاقه رقم قومي:{' '}
                {numbersToArabic(individualInGroup.customer.nationalId)}
              </div>
              <div>
                والمقيم في: {individualInGroup.customer.customerHomeAddress}
              </div>
              <div>من شركة تساهيل للتمويل متناهي الصغر &quot;تساهيل&quot;</div>
              <div>
                مبلغاً وقدره{' '}
                {`${numbersToArabic(
                  props.data.installmentsObject.totalInstallments.installmentSum
                )} جنيه = (${new Tafgeet(
                  props.data.installmentsObject.totalInstallments.installmentSum,
                  'EGP'
                ).parse()})`}{' '}
              </div>
              <div>
                وذلك علي سبيل الأمانه لأقوم بسداده الي حساب رقم: ٥٢٢٩٩٤ ببنك
                العربي الافريقي الدولي فرع مدينه نصر
              </div>
              <div>
                وإذا لم اقم بسداد المبلغ المذكور أكون مبددا وخائنا للأمانه
                واتحمل المسئوليتين المدنيه والجنائيه عن هذا الفعل ولا تبرأ ذمتي
                الا باستلام هذا الإيصال
              </div>
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
                    <td style={{ width: 400, height: 250 }} />
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })
      )}
    </div>
  )
}

export default TotalWrittenChecks

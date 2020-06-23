import React from 'react';
import './customerCardAttachments.scss';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';
import * as local from '../../../../Shared/Assets/ar.json';
const CustomerCardAttachments = (props) => {
  function arabicGender(gender: string) {
    switch (gender) {
      case 'male': return local.male;
      case 'female': return local.female;
      default: return ''
    }
  }
  function getArabicNumberFromIndex(index: number) {
    switch (index) {
      case 1: return local.first;
      case 2: return local.second;
      case 3: return local.third;
      case 4: return local.fourth;
      default: return '';
    }
  }
  return (
    <div className="customer-card-attachments-print" style={{ direction: "rtl" }} lang="ar">
      <div className="head">
        <table>
          <tbody>
            <tr>
              <td>شركة تساهيل للتمويل متناهي الصغر</td>
              <td className="headtitle"><u>أعـــــــرف عـمـــيــــــــــــلك</u></td>
              <td>ترخيص رقم (٢)</td>
            </tr>
            <tr>
              <td>رقم السجل التجارى : ٨٤٢٠٩</td>
              <td rowSpan={2} >العنوان : شارع الموافى من شارع الجمهورية أمام مدرسة النهضة</td>
              <td rowSpan={2} >تاريخ القيد بالسجل التجاري: ٢٢-٦-٢٠١٥</td>
            </tr>
            <tr>
              <td>فرع : الغربية - زفتى</td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className="client">

        <div className="double">
          <div className="title">اسم العميل :
				<div className="value">{props.data.customer.customerName}</div>
          </div>

          <div className="title">الرقم القومى :
				<div className="value">{numbersToArabic(props.data.customer.nationalId)}</div>
          </div>
        </div>


        <div className="quadruple">
          <div>الجنسيه :
				<div className="value">مصرى</div>
          </div>

          <div>النوع :
				<div className="value">{arabicGender(props.data.customer.gender)}</div>
          </div>

          <div>
            <div>محل الميلاد :
					<div className="value">---------------------</div>
            </div>
            {/* <!-- <div style="position: relative; display: inline-block; border-bottom: 1px black dashed; width: inherit;">
                        </div> --> */}
          </div>
          <div>تاريخ الميلاد :
				<div className="value">{timeToArabicDate(props.data.customer.birthDate, false)}</div>
          </div>
        </div>

        <div className="triple" style={{ gridTemplateColumns: '50% 25% 25%' }}>
          <div>عنوان السكن :
				<div className="value">{props.data.customer.customerHomeAddress}
            </div>
          </div>

          <div className="property">ايجار (&emsp;) تمليك (&emsp;)</div>

          <div>عنوان آخر :
				<div className="value">---------------------</div>
          </div>
        </div>

        <div className="double">
          <div>عنوان سكن العميل فى الخارج ( ان وجد ) :
				<div className="value">-----------------------------</div>
          </div>

          <div className="property">ايجار (&emsp;) تمليك (&emsp;)</div>
        </div>
        <div className="double">
          <div>عنوان النشاط :
				<div className="value">{props.data.customer.businessAddress}</div>
          </div>

          <div className="property">ايجار (&emsp;) تمليك (&emsp;)</div>
        </div>
        <div className="triple">
          <div>أرقام التليفون :
				<div className="value">{props.data.customer.mobilePhoneNumber}</div>
          </div>
          <div>رقم آخر :
				<div className="value">---------------------</div>
          </div>

          <div>البريد الالكترونى :
				<div className="value">---------------------</div>
          </div>
        </div>



        <div className="double">
          <div>مهنه العميل / وظيفته :
				<div className="value">-----------------------------</div>
          </div>
          <div>طبيعه النشاط :
				<div className="value">{props.data.businessSector + "-" + props.data.businessActivity + "-" + props.data.businessSpeciality}
            </div>
          </div>
        </div>

        <div className="single">
          <div>الشكل القانونى للنشاط ( فردى ام شركة )
				<div className="value">-----------------------------</div>
          </div>
        </div>

        <div className="triple">
          <div>رقم السجل التجارى :
				<div className="value">{props.data.businessLicenseNumber}</div>
          </div>
          <div>تاريخ القيد
				<div className="value">---------------------</div>
          </div>
          <div>مكتب سجل تجارى :
				<div className="value">---------------------</div>
          </div>
        </div>

        <div className="double">
          <div>حجم الدخل السنوى :
				<div className="value">-----------------------------</div>
          </div>
          <div>مصادر الدخل الاخرى :
				<div className="value">-----------------------------</div>
          </div>
        </div>
        <div className="double">
          <div>مبلغ التمويل :
				<div className="value">{props.data.principal}</div>
          </div>
          <div>الغرض من التمويل :
				<div className="value">-----------------------------</div>
          </div>
        </div>

        <div className="single">
          <div>المستفيد الحقيقى من التمويل : ( يذكر اسم الشخص الذى سيحصل على لمال او جزء من المال
          فى حاله كونه شخصا اخر بخلاف العميل )
				<div className="value">---------------------------</div>
          </div>
        </div>
      </div>


      {props.data.guarantors.map((guarantor, index) => {
        return (
          <div className="first_guarantor" key={index}>

            <div className="title double">
              <div>اسم الضامن {getArabicNumberFromIndex(index + 1)} :
                   <div className="value">{guarantor.customerName}</div>
              </div>

              <div>الرقم القومى :
                   <div className="value">{numbersToArabic(guarantor.nationalId)}</div>
              </div>
            </div>


            <div className="quadruple">
              <div>الجنسيه :
                   <div className="value">--------------------</div>
              </div>

              <div>النوع :
                   <div className="value">{arabicGender(guarantor.gender)}</div>
              </div>

              <div>محل الميلاد :
                   <div className="value">---------------------</div>
              </div>

              <div>تاريخ الميلاد :
                    <div className="value">{timeToArabicDate(guarantor.birthDate, false)}</div>
              </div>
            </div>

            <div className="double">
              <div>عنوان سكن العميل فى الخارج ( ان وجد ) :
                   <div className="value">-----------------------------</div>
              </div>

              <div className="property">ايجار (&emsp;) تمليك (&emsp;)</div>
            </div>
            <div className="double">
              <div>عنوان سكن الضامن {getArabicNumberFromIndex(index + 1)} :
                   <div className="value">{guarantor.customerHomeAddress}
                </div>
              </div>
              <div className="property">ايجار (&emsp;) تمليك (&emsp;)</div>
            </div>
            <div className="single">
              <div>عنوان آخر :
                   <div className="value">-----------------------------------------------</div>
              </div>
            </div>
            <div className="triple">
              <div>رقم تليفون الضامن {getArabicNumberFromIndex(index + 1)} :
                   <div className="value">{guarantor.mobilePhoneNumber}</div>
              </div>
              <div>رقم آخر :
                   <div className="value">---------------------</div>
              </div>
              <div>البريد الالكترونى :
                   <div className="value">---------------------</div>
              </div>
            </div>
            <div className="double">
              <div>مهنه الضامن / وظيفته :
                   <div className="value">-----------------------------</div>
              </div>
              <div>علاقه الضامن {getArabicNumberFromIndex(index + 1)} بالعميل :
                   <div className="value">-----------------------------</div>
              </div>
            </div>
          </div>
        )
      })}
      <div className="endorsement">
        <div>أقـــــــــــــرار بصحة البيانات :-</div>
        <div className="value">اقر انا الموقع أدناه بتحمل المسئولية القانونية عن صحة البيانات فى النموذج عاليه والمستندات ( وصورها )
        المقدمة للشركة و أقر بحق الشركة فى الاتصال بالسلطات المختصة للتحقق منها فى أى وقت ، كما اتعهد بأننى المستفيد
        الحقيقى من التعامل مع ذكر اسم المستفيد
        الحقيقى ( ان وجد ) ، كما اتعهد بتحديث البيانات فور حدوث اى تغييرات بها أو عند طلب الشركة لذلك
		</div>
        <div className="triple">
          <div>اسم العميل :
				<div className="value">{props.data.customer.customerName}</div>
          </div>
          <div>توقيع العميل
				<div className="value">---------------------</div>
          </div>

          <div>التاريخ :
                         <div className="value">{timeToArabicDate(0, false)}</div>
          </div>
        </div>
      </div>
      <div className="sign">
        <div className="single">
          <div>العميل وقع أمامى وتحققت من شخصيته وتم التاكد من عدم ادارجه فى القوائم السلبيه الدولية</div>
        </div>
        <div className="double">
          <div>اسم عضو الرقابه :
				<div className="value">---------------------</div>
          </div>
          <div>التاريخ :
                    <div className="value">{timeToArabicDate(0, false)}</div>
          </div>
        </div>
        <div className="double">
          <div>توقيع عضو الرقابه :
				<div className="value">---------------------</div>
          </div>
          <div>توقيع مدير الفرع :
				<div className="value">---------------------</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CustomerCardAttachments;
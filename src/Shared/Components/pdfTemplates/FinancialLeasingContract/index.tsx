import React, { FC } from 'react'
import './styles.scss'
import add from 'date-fns/add'
import * as local from 'Shared/Assets/ar.json'
import {
  numbersToArabic,
  timeToArabicDate,
  dayToArabic,
  FLindexLocal,
  periodLengthLocal,
  alphaIndex,
} from 'Shared/Services/utils'
import { FLContractProps, SubjectStyle } from './types'
import { subjects } from './subjects'

const FinancialLeasingContract: FC<FLContractProps> = ({ data }) => {
  const {
    creationDate,
    customerType,
    customerName,
    guarantors,
    vendorName,
    principal,
    categoryName,
    itemDescription,
    businessSector,
    downPayment,
    installmentResponse,
    periodLength,
    firstInstallmentDate,
    lastInstallmentDate,
    feesSum,
    customerHomeAddress,
    nationalId,
    commercialRegisterNumber,
    businessAddress,
    taxCardNumber,
    entitledToSign,
  } = data

  const purchaseDate = add(creationDate, {
    days: 7,
  }).valueOf()

  const getRowStyle = (style: SubjectStyle, index: number): string => {
    switch (style) {
      case 'alphaIndex': {
        return `${alphaIndex[index]}- `
      }
      case 'dashed': {
        return '-'
      }
      case 'dotted': {
        return '•'
      }
      case 'index': {
        return `${index + 1}- `
      }
      default:
        return ''
    }
  }

  const getSubRow = (row) => {
    return (
      <div className="article-container">
        {row.title && <div className="element-title">{row.title}</div>}
        {row.data.map((subRow, sri) => {
          return (
            <React.Fragment key={sri}>
              <div>{`${
                row.style ? getRowStyle(row.style, sri) : ''
              } ${subRow}`}</div>
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div className="financial-leasing-container">
      <div className="head-title">{local.financialLeasingContract}</div>
      <div className="element-title">
        {' '}
        طبقا لاحكام قانون 176 لسنه 2018 بشأن تنظيم نشاط التأجير التمويلي و
        التخصيم
      </div>
      <p>
        أنه في يوم {dayToArabic(new Date(creationDate).getDay())} الموافق{' '}
        {timeToArabicDate(creationDate, false)} حرر هذا العقد بين كل من :
      </p>
      <div className="d-flex">
        <p>1- شركــــه تساهيل للتمويل متناهى الصغر</p>
        <p className="ml-5"> ( الطرف الأول المؤجر )</p>
      </div>
      <div>مقيده بسجل تجاري رقم 84209 ومقرها : 3 شارع الزهور – المهندسين</div>
      <div>
        ومقيده بسجل المؤجرين التمويلين بالهيئة العامة للرقابة المالية برقم : (
        301 )
      </div>
      <div>
        ويمثلها في التوقيع علي هذا العقد السيد/
        ....................................... بصفته/ رئيس مجلس الأدارة للشركة
      </div>
      <div className="d-flex">
        <p>
          2- {customerType === 'company' ? 'شركة' : 'السيد'} {customerName}
        </p>
        <p className="ml-5"> ( الطرف الثاني المستأجر )</p>
      </div>
      {customerType === 'company' ? (
        <>
          <div>
            مقيده بسجل تجاري : {commercialRegisterNumber} ومقرها :
            {businessAddress}
          </div>
          <div>
            الشكل القانوني للطرف الثاني المستأجر( نوع الشركه) :
            ...................................
          </div>
          <div>و النشاط : {businessSector}</div>
          <div>بطاقة ضريبيه رقم : {taxCardNumber}</div>
          <div>
            ويمثلها في التوقيع علي هذا العقد السيد/ {entitledToSign.name} بصفته
            / {entitledToSign.position}
          </div>
        </>
      ) : (
        <>
          <div>
            السيد/ {customerName} المقيم/
            {customerHomeAddress} بطاقه رقم قومي/
            {nationalId}{' '}
          </div>
        </>
      )}
      {guarantors &&
        guarantors.map((g, index) => (
          <div className="d-flex" key={`${g.name}-${index}`}>
            <p>
              {index + 3}- السيد/ {g.name} المقيم/
              {g.address} بطاقه رقم قومي/
              {numbersToArabic(g.nationalId)}
            </p>
            <p className="ml-5">
              (طرف {FLindexLocal[index + 2]} - ضامن متضامن)
            </p>
          </div>
        ))}
      <div className="element-title">
        بيـــــــــــــــــــان بوصف الأصــــــــــــــــول المؤجرة
      </div>
      <div>
        وافق المؤجر على تأجير الأصول التى يمتلكها أو التى قام بشرائها أو التى له
        الحق فى تأجيرها طبقا للمرفق رقم (1) وللشروط والاحكام الواردة في هذا
        العقد وقانون التأجير التمويلي رقم 176 لسنة 2018.
      </div>
      <div>وبيانها كالأتي:</div>
      <div>اسم المورد / البائع / المقاول : {vendorName || local.na}</div>
      <div>سند ملكيه المؤجر : ( مبايعه من الشركه المورده ) </div>
      <div>الثمن المذكور بسند الملكيه : {numbersToArabic(principal)}</div>
      <div>نوع الاصل المؤجر : {categoryName || local.na}</div>
      <div>وصف الأصل المؤجر : {itemDescription || local.na}</div>
      <div>
        الغرض المخصص لاستخدام الأصل المؤجر : {businessSector || local.na}
      </div>
      <div className="element-title">
        القـــــــــــــــــــيمة الأيــــــــجاريـه
      </div>
      <div>اتفق الأطراف علي أن تكون القيم الأيجارية علي النحو الأتي :</div>
      <div>
        الدفعة المقدمة : {downPayment} جم (فقط
        ........................................ لاغير) اذا تم الاتفاق علي سداد
        مقدمه
      </div>
      <div>
        اجمالي القيمة الايجارية : {numbersToArabic(installmentResponse)} جم (فقط
        ........................................ لاغير) المقدمه + اجمالي الاقساط
      </div>
      <div>تسداد الأجرة بشكل {periodLengthLocal[periodLength] || local.na}</div>
      <div>
        ويبدأ سداد الأجرة من تاريخ{' '}
        {timeToArabicDate(firstInstallmentDate, false)} وتنتهي في{' '}
        {timeToArabicDate(lastInstallmentDate, false)}
      </div>
      <div>
        كما اتفق الأطراف على أن تكون قيمة العوائد و العمولات والمصاريف (أن وجدت)
        علي النحو الأتي :
      </div>
      <div>الفائده : {feesSum}</div>
      <div>.المصاريف الاداريه : ................................</div>

      <div className="element-title">مــدة العقـــــد وثمن الشراء وتاريخة</div>
      <div>
        يبدأ سريان العقد في : {timeToArabicDate(firstInstallmentDate, false)}{' '}
        وينتهي في : {timeToArabicDate(lastInstallmentDate, false)}
      </div>
      <div>وأتفق الأطراف علي أن يكون ثمن شراء الأصل المؤجر: ا. جم </div>
      <div>
        كما اتفق الأطراف على أن يكون تاريخ شراء الأصل المؤجر في موعد أقصاه :{' '}
        {timeToArabicDate(purchaseDate, false)}
      </div>
      <div className="head-title">تــمهيــــد</div>
      <div>
        حيث أن الطرف الأول ( المؤجر ) يمارس نشاط التأجير التمويلي متناهى الصغر
        وفقا لأحكام قانون التأجير التمويلي والتخصيم رقم 176 لسنة 2018، وقيد بسجل
        قيد المؤجريين التمويليين بالهيئة الهامة للرقابة المالية برقم /301
      </div>
      <div className="pagebreak" />
      <div>
        ولما كان المستأجر ( الطرف الثانى ) يمارس نشاط {businessSector} مما يجعله
        يحتاج الى اموال لمزاولة انشطة اقتصادية ( انتاجية – خدمية – تجارية -
        زراعية ) ويرغب أن يقوم بشراء الأصل المؤجر الموضح تفصيلا في صدر هذا العقد
        وملاحقه، وأن يقوم بتأجيرهذا الاصل موضوع العقد إلى الطرف الثاني المستأجر
        وفقا لأحكام هذا العقد واحكام القانون رقم 176 لسنة 2018 والقرارات
        والضوابط الصادرة تنفيذاً لأحكامه. وبعد أن اقر الطرفان بصفتهما وأهليتهما
        لإبرام هذا العقد فقد اتفقا على مايلي{' '}
      </div>
      {subjects.map((s, si) => (
        <div key={si} className="article-container">
          {s.id > 0 && <div className="law-title">المادة رقم ({s.id})</div>}
          {s.title && <div className="element-title">{s.title}</div>}
          {s.data.map((r, ri) => (
            <div key={ri}>
              {`${
                typeof r !== 'object' && s.style ? getRowStyle(s.style, ri) : ''
              }`}{' '}
              {typeof r === 'object' ? getSubRow(r) : r}
            </div>
          ))}
          {s.id === 9 && <div className="pagebreak" />}
        </div>
      ))}
      <div className="law-title mb-5 mt-5">التوقيع </div>

      <div className="d-flex justify-content-between w-50">
        <div>
          <div>الطرف الاول </div>
          <div>الشركه المؤجره</div>
          <div>شركه تساهيل للتمويل متناهي الصغر</div>
          <div>الاسم / </div>
          <div>التوقيع /</div>
        </div>
        <div>
          <div>الطرف الثاني</div>
          <div>المستاجر</div>
          <div>
            {customerType === 'company' ? 'شركه / ' : ''} {customerName}
          </div>
          <div>الاسم / </div>
          <div>التوقيع /</div>
        </div>
      </div>
      <footer className="border-top">
        <div className="d-flex justify-content-around mb-5">
          <p>الطرف أول مؤجر</p>
          <p>الطرف الثاني المستأجر</p>
        </div>
      </footer>
    </div>
  )
}

export default FinancialLeasingContract

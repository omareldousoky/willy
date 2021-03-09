import React from 'react'
import './officersPercentPayment.scss'

const OfficersPercentPaymentFooter = () => {
  return (
    <div className="footer">
      <div>
        <p>السدادات المتوقعه فى هذه الفترة = كل استحقاقات الفتره</p>
        <p>
          مسدد حتى نهاية الفتره = مدفوعات تمت خلال هذه الفترة و ما قبلها عن
          استحقاقات الفتره
        </p>
        <p>
          القروض المشطوبه مستبعدة من هذا التقرير&nbsp;&nbsp;&nbsp;
          <span className="border border-gray underline px-2">
            (تم استبعاد القسط رقم ٠) الفائدة المقدمة
          </span>
        </p>
      </div>
      <div>
        <p>
          التقرير يحسب بأثر رجعى فقط لحركة السداد التى تمت بعد تاريخ النهاية
        </p>
        <p>السداد الجزئى لا يأخذ فى الاعتبار</p>
      </div>
    </div>
  )
}

export default OfficersPercentPaymentFooter

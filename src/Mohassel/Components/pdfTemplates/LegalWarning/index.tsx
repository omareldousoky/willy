import React from 'react'
import './styles.scss'
import { LegalWarningProps } from './types'

const PRE_JUDGE_WARNING = `
  بمقتضي عقد من عقود الامانة استلم المنذر اليه من الشركة سالفة الذكر
  مبلغ مالي علي سبيل الامانة وحيث ان الشركة طالبته ودياً اكثر من مرة برد
  المبلغ الا انه امتنع عن السداد مختلسا ومبددا المبلغ لنفسه واستنادا الي نص
  المادة 341 من قانون العقوبات سوف تقوم الشركة باتخاذ كافة الاجراءات
  الجنائية تجاه هذا الفعل المؤثم وتقديم بلاغ لوكيل النائب العام
	ليقوم سيادته باتخاذ الاجراءات القانونية جراء هذا الفعل المؤثم وفقا لما ورد بقانون العقوبات.
`

const SPACE =
  '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'

const legalActionTakenDetails = (court?: string, caseNumber?: string) => (
  <>
    نفيدكم علما بان الشركة المنذرة قد قامت باتخاذ الاجراءت القانونية ضدكم
    بالجنحة رقم {caseNumber || SPACE}&nbsp;جنح {court || SPACE}&nbsp;بسبب
    تبديدكم للمبالغ المالية التي في ذمتكم موضوع الجنحة سالفة الذكر.
  </>
)

const legalWarningTemplates = {
  quickRefundWarning: {
    showDateAndTime: false,
    courtAgent: false,
    details: PRE_JUDGE_WARNING,
    action: `
      سلمتة صورة من هذا الانذار للعلم بما جاء به ونفاذه في مواجهتة لقيامة برد المبالغ المستلمة علي سبيل
      الامانة خلال خمسة ايام والا سوف تقوم الشركة باتخاذ الاجراءات القانونية ضد المنذر اليه .
    `,
  },
  legalActionWarning: {
    showDateAndTime: true,
    courtAgent: true,
    details: PRE_JUDGE_WARNING,
    action: `
    انا المحضر سالف الذكر قد انتقلت الي حيث اقامة المنذر اليه
     وسلمتة صورة من هذا الانذار للعلم بما جاء به ونفاذه في مواجهتة لقيامه برد
     المبالغ المستلمة علي سبيل الامانة خلال خمسة ايام والا سوف تقوم الشركة باتخاذ الاجراءات القانونية ضد المنذر اليه .
    `,
  },
  misdemeanorNumberWarning: {
    showDateAndTime: true,
    courtAgent: true,
    details: (court?: string, caseNumber?: string) => (
      <>
        {legalActionTakenDetails(court, caseNumber)}
        <br />
      </>
    ),
    action: `
      انا المحضر سالف الذكر قد انتقلت الي
      حيث اقامة المنذر اليه وسلمتة صورة من هذا الانذار للعلم بما جاء به ونفاذه في
      مواجهتة لقيامة برد المبالغ المستلمة علي سبيل الامانة خلال خمسة ايام والا سوف تقوم
      الشركة المنذرة باخطار الجهات المعنية لتفعيل كافة الاجراءات الاخري.
    `,
  },

  verdictNoticeWarning: {
    showDateAndTime: true,
    courtAgent: true,
    details: (court?: string, caseNumber?: string) => (
      <>
        {legalActionTakenDetails(court, caseNumber)}
        <br />
        <span>
          وبجلسة &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; حكمت المحكمة بالحبس
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; وكفالة
        </span>
      </>
    ),
    action: `
      انا المحضر سالف الذكر قد انتقلت الي
      حيث اقامة المنذر اليه وسلمتة صورة من هذا الانذار للعلم بما جاء به ونفاذه في
      مواجهتة لقيامة برد المبالغ المستلمة علي سبيل الامانة خلال خمسة ايام والا سوف تقوم
      .الشركة المنذرة باتخاذ اجراءات التنفيذ ضد المنذر اليه
    `,
  },
}

export const LegalWarning = ({ type, warnings }: LegalWarningProps) => {
  const warningTemplate = legalWarningTemplates[type]
  const { showDateAndTime, courtAgent, details, action } = warningTemplate

  return (
    <>
      {warnings.map((warning, index) => {
        const { court, caseNumber, customerName, currentHomeAddress } = warning
        return (
          <main className="p-4 font-weight-bold legal-warning" key={index}>
            <article className="d-flex justify-content-between">
              <div>
                <section>
                  <p>
                    {showDateAndTime && (
                      <span>
                        انه في يوم
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        الموافق &nbsp;&nbsp; / &nbsp;&nbsp; / &nbsp;&nbsp;
                        الساعة
                      </span>
                    )}
                    <br />
                    <span>بناء علي طلب / شركة تساهيل للتمويل متناهي الصغر</span>
                    <br />
                    <span>
                      ويمثلها قانونا السيد الاستاذ / رئيس مجلس الادارة.
                    </span>
                    <br />
                    <span>
                      ومركزها الرئيسي ومحلها المختار : ادارة الشئون القانونية.
                    </span>
                    <br />
                    <span>الكائنة في : 2 شارع لبنان – الجيزة. </span>
                    <br />
                    {courtAgent ? (
                      <>
                        <span>
                          انا
                          {SPACE + SPACE} محضر محكمة&nbsp;
                          {court || SPACE} الجزئية قد انتقلت واعلنت :
                        </span>
                        <br />
                        <span>السيد /</span>
                        {customerName}
                        <br />
                        <span>المقيم /</span>
                        {currentHomeAddress}
                        <br />
                        <span>مخاطبا مع /</span>
                      </>
                    ) : (
                      <>
                        <span>مخاطبا مع السيد/ {customerName}</span>
                        <br />
                        <span>المقيم في/ {currentHomeAddress}</span>
                        <br />
                      </>
                    )}
                  </p>
                </section>

                <section>
                  <h4 className="text-center font-weight-bold text-underline">
                    وانذرتة بالاتي
                  </h4>

                  <p>
                    {typeof details === 'string'
                      ? details
                      : details(court, caseNumber)}
                  </p>
                </section>

                <section>
                  <h4 className="text-center font-weight-bold text-underline">
                    بناء عليه
                  </h4>
                  <p>{action}</p>
                  <span>مع حفظ كافة الحقوق الاخري للشركة المنذرة.</span> <br />
                  {courtAgent && <span>لاجل العلم /</span>}
                </section>
              </div>

              <aside className="text-center border border-success p-4">
                <h4 className="text-underline">الموضوع</h4>
                <h4>
                  {courtAgent ? 'انذار علي يد محضر' : 'انذار بسرعة رد المبالغ'}
                </h4>

                {courtAgent && (
                  <div className="mt-5">
                    <h4 className="mb-5">كطلب الطالب وتحت مسئوليته</h4>
                    <h4 className="mb-5">وكيل الطالب</h4>
                    <h4 className="mb-0">المحامي</h4>
                    <p className="text-left mb-0 lawyer-info">
                      <span>توكيل رقم :</span> <br />
                      <span>حرف (&nbsp;&nbsp;) لسنة</span> <br />
                      <span>مكتب توثيق :</span>
                    </p>
                  </div>
                )}
              </aside>
            </article>
          </main>
        )
      })}
    </>
  )
}

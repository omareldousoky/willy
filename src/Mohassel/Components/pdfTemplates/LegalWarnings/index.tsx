import React from 'react'
import { Header } from '../pdfTemplateCommon/header'
import './styles.scss'
import { LegalWarningProps } from './types'

const PRE_JUDGE_WARNING = `
  بمقتضي عقد من عقود الامانة استلم المنذر الية من الشركة سالفة الذكر
  مبلغ مالي علي سبيل الامانة وحيث ان الشركة طالبته وديآ اكثر من مرة برد
  المبلغ الا انه امتنع عن السداد مختلسا ومبددا المبلغ لنفسة واستنادا الي نص
  المادة 341 من قانون العقوبات سوف تقوم الشركة باتخاذ كافة الاجراءات
  الجنائية اتجاه هذا الفعل المؤثم وتقديم بلاغ لوكيل النائب العام ليقوم سيادتة باتخاذ الاجراءات القانونية جراء هذا الفعل المؤثم وفقا لما ورد بقانون العقوبات.
`

const LEGAL_WARNINGS_TEMPLATES = {
  quickRefundWarning: {
    showDateAndTime: true,
    courtAgent: true,
    details: (
      <>
        نفيدكم علما بان الشركة المنذرة قد قامت باتخاذ الاجراءت القانونية ضدكم
        بالجنحة رقم &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; لسنة
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; جنح
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; بسبب تبديدكم للمبالغ المالية
        التي في ذمتكم موضوع الجنحة سالفة الذكر. <br />
        <span>
          وبجلسة &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;
          &nbsp; &nbsp; &nbsp; حكمت المحكمة بالحبس &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp; وكفالة
        </span>
      </>
    ),
    action: `
      انا المحضر سالف الذكر قد انتقلت الي حيث اقامة
      المنذر اليه وسلمتة صورة من هذا الانذار للعلم
      بما جاء به ونفاذه في مواجهتة لقيامة برد المبالغ المستلمة
      علي سبيل الامانة خلال خمسة ايام والا سوف تقوم الشركة باتخاذ اجراءات التنفيذ ضد المنذر الية .
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
    details: (
      <>
        نفيدكم علما بان الشركة المنذرة قد قامت باتخاذ الاجراءت القانونية ضدكم
        بالجنحة رقم &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; لسنة
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; جنح
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; بسبب تبديدكم للمبالغ المالية
        موضوع الجنحة سالفة الذكر. <br />
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
    showDateAndTime: false,
    courtAgent: false,
    details: PRE_JUDGE_WARNING,
    action: `
      سلمتة صورة من هذا الانذار للعلم بما جاء به ونفاذه في مواجهتة لقيامة برد المبالغ المستلمة علي سبيل
      الامانة خلال خمسة ايام والا سوف تقوم الشركة باتخاذ الاجراءات القانونية ضد المنذر الية .
    `,
  },
}

export const LegalWarning = ({ type }: LegalWarningProps) => {
  const warning = LEGAL_WARNINGS_TEMPLATES[type]
  const { showDateAndTime, courtAgent, details, action } = warning

  return (
    <main className="p-4 font-weight-bold">
      <header>
        <Header showCurrentTime={false} showCurrentUser={false} />
      </header>

      <article className="d-flex justify-content-between">
        <div>
          <section>
            <p>
              {showDateAndTime && (
                <span>
                  انه في يوم
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  الموافق &nbsp;&nbsp; / &nbsp;&nbsp; / &nbsp;&nbsp; الساعة
                </span>
              )}
              <br />
              <span>بناء علي طلب / شركة تساهيل للتمويل متناهي الصغر</span>
              <br />
              <span>ويمثلها قانونا السيد الاستاذ / رئيس مجلس الادارة. </span>
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
                    انا &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp; &nbsp; &nbsp; محضر محكمة
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp; الجزئية قد انتقلت واعلنت :
                  </span>
                  <br />
                  <span>السيد /</span> <br />
                  <span>المقيم /</span> <br />
                  <span>مخاطبا مع /</span>
                </>
              ) : (
                <>
                  <span>مخاطبا مع السيد/ </span>
                  <br />
                  <span>المقيم في/ </span>
                  <br />
                </>
              )}
            </p>
          </section>

          <section>
            <h4 className="text-center font-weight-bold text-underline">
              وانذرتة بالاتي
            </h4>

            <p>{details}</p>
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
          <h4>{courtAgent ? 'انذار علي يد محضر' : 'انذار بسرعة رد المبالغ'}</h4>

          {courtAgent && (
            <div className="mt-5">
              <h4 className="mb-5">كطلب الطالب وتحت مسئوليتة</h4>

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
}

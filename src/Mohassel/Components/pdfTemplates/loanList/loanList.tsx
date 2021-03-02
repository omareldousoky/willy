import React from 'react'
import './loanList.scss'

const LoanList = () => {
  return (
    <div className="issued-loan-list" lang="ar">
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
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
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={6}>قائمة حركات اصدار القروض المنفذة</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>المركز الرئيسي</th>
            <th colSpan={6}>تاريخ الحركه من 2020/07/02 الي 2020/07/02</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>12:17:26 &emsp; 2020/07/05</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
          <tr>
            <th>رقم مسلسل</th>
            <th>كود الحركه</th>
            <th>كود العميل</th>
            <th className="name">أسم العميل</th>
            <th>مسلسل القرض</th>
            <th>رقم الشيك</th>
            <th>قيمة</th>
            <th>تاريخ القرض</th>
            <th style={{ width: '10%' }}>الحالة الان</th>
            <th>أصل</th>
            <th>قيمة تكلفه التمويل</th>
            <th>إجمالي</th>
            <th>حالة الحركة</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
          <tr>
            <th className="gray frame" colSpan={2}>
              تاريخ الحركه
            </th>
            <th className="gray frame" colSpan={2}>
              2020/06/09
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              بنك / خرينه{' '}
            </th>
            <th className="gray frame" colSpan={2}>
              بنك 1 - الجيزه - الصف
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>فريده كمال احمد رضوان</td>
            <td>001</td>
            <td>0006751</td>
            <td>12000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>12000.00</td>
            <td>2720.00</td>
            <td>14720.00</td>
          </tr>
          <tr>
            <td>2</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>هدى زكي احمد محمد رزق</td>
            <td>003</td>
            <td>0006753</td>
            <td>12000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>12000.00</td>
            <td>2760.00</td>
            <td>14760.00</td>
          </tr>
          <tr>
            <td>3</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>رشا اسماعيل فضل حسين</td>
            <td>003</td>
            <td>0006748</td>
            <td>16000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>16000.00</td>
            <td>4400.00</td>
            <td>20400.00</td>
          </tr>
          <tr>
            <td>4</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>مني سلامه جمعه عيد</td>
            <td>001</td>
            <td>00067251</td>
            <td>12000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>12000.00</td>
            <td>2720.00</td>
            <td>14720.00</td>
          </tr>
          <tr>
            <td>5</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>عز محمود عبدالعليم حسن</td>
            <td>004</td>
            <td>0006750</td>
            <td>15000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>15000.00</td>
            <td>4176.00</td>
            <td>19176.00</td>
          </tr>
          <tr>
            <td>6</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>شرين ياسر سيد احمد الخشن</td>
            <td>002</td>
            <td>0006749</td>
            <td>16000.00</td>
            <td>2020/07/02</td>
            <td>مصدر _ </td>
            <td>16000.00</td>
            <td>3640.00</td>
            <td>19640.00</td>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
          <tr>
            <td className="frame" colSpan={2}>
              إجمالي بنك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              بنك 1 - الجيزه - الصف
            </td>
            <td className="frame" colSpan={1}>
              2020/07/02
            </td>
            <td className="frame">6</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">83000.00</td>
            <td className="frame">20416.00</td>
            <td className="frame">103416.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">83000.00</td>
            <td className="frame">20416.00</td>
            <td className="frame">103416.00</td>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbodyborder">
          <tr>
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">2020/06/09</td>
            <td className="frame" colSpan={2}>
              إجمالي عدد الحركات
            </td>
            <td className="frame">162</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">829250.00</td>
            <td className="frame">148308.00</td>
            <td className="frame">977558.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">829250.00</td>
            <td className="frame">148308.00</td>
            <td className="frame">977558.00</td>
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbodyborder">
          <tr>
            <td className="gray frame" colSpan={2}>
              إجمالي بالعمله
            </td>
            <td className="gray frame">جنيه مصري</td>
            <td className="frame" colSpan={2}>
              إجمالي عدد الحركات
            </td>
            <td className="frame">162</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">829250.00</td>
            <td className="frame">148308.00</td>
            <td className="frame">977558.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">829250.00</td>
            <td className="frame">148308.00</td>
            <td className="frame">977558.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default LoanList

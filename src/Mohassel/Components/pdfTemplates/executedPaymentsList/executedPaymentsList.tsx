import React from 'react'
import './executedPaymentsList.scss'

const ExecutedPaymentsList = (props) => {
  return (
    <div
      className="executed-payments-list"
      style={{ direction: 'rtl' }}
      lang="ar"
    >
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
          <th colSpan={6} style={{ backgroundColor: 'white' }}>
            <div className="logo-print" />
          </th>
          <th colSpan={6} style={{ backgroundColor: 'white' }}>
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </table>
      <table className="title">
        <tbody>
          <tr>
            <th>شركة تساهيل للتمويل متناهي الصغر</th>
            <td>قائمة مراجعات حركات السداد</td>
          </tr>
          <tr>
            <td>اسيوط - أبوتيج</td>
            <td>تاريخ الحركه من 1900/01/01 الي 2020/07/02</td>
          </tr>
          <tr>
            <td>15:17:26 &emsp; 2020/06/14</td>
            <td>جنيه مصري</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th className="frame">رقم مسلسل</th>
            <th className="frame">كود الحركه</th>
            <th className="frame">مسلسل القسط</th>
            <th className="frame">أسم العميل</th>
            <th className="frame">مستند الضمان</th>
            <th className="frame">قيمة القسط</th>
            <th className="frame">تاريخ إستحقاق القسط</th>
            <th className="frame">حالة القسط</th>
            <th className="frame">مستند الحركه</th>
            <th className="frame">أصل</th>
            <th className="frame">تكلفه التمويل المسدده</th>
            <th className="frame">إجمالي</th>
          </tr>
          <tr>
            <th className="frame" colSpan={2}>
              تاريخ الحركه
            </th>
            <th className="frame" colSpan={2}>
              2020/6/14
            </th>
          </tr>
          <tr>
            <th className="frame" colSpan={2}>
              بنك / خرينه{' '}
            </th>
            <th className="frame" colSpan={2}>
              خرينه 5 فرع أبوتيج - اسيوط - أبوتيج
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>010/00125012</td>
            <td>010/0016708/002/012</td>
            <td>إبتسام احمد صديق سليمان</td>
            <td />
            <td>2465.00</td>
            <td>2020/07/24</td>
            <td>في الخزينه</td>
            <td>4221</td>
            <td>2340.00</td>
            <td>125.00</td>
            <td>2465.00</td>
          </tr>
          <tr>
            <td className="frame" colSpan={2}>
              إجمالي بتك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              خرينه 5 فرع أبوتيج - اسيوط - أبوتيج
            </td>
            <td className="frame">2020/07/02</td>
            <td className="frame">1</td>
            <td colSpan={3} />
            <td className="frame">2340.00</td>
            <td className="frame">125.00</td>
            <td className="frame">2465.00</td>
          </tr>
          <tr>
            <th className="frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </th>
            <th className="frame" colSpan={2}>
              2020/07/02
            </th>
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td colSpan={3} />
            <td className="frame">2340.00</td>
            <td className="frame">125.00</td>
            <td className="frame">2465.00</td>
          </tr>
          <tr>
            <th className="frame" colSpan={2}>
              إجمالي بالعمله
            </th>
            <th className="frame" colSpan={2}>
              جنيه مصري
            </th>
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td colSpan={3} />
            <td className="frame">2340.00</td>
            <td className="frame">125.00</td>
            <td className="frame">2465.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ExecutedPaymentsList

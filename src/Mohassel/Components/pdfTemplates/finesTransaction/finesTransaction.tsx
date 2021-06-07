import React from 'react'
import './finesTransaction.scss'

const FinesTransaction = () => {
  return (
    <div className="fines-transaction" lang="ar">
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
          <th style={{ backgroundColor: 'white' }} colSpan={6}>
            <div className="logo-print-tb" />
          </th>
          <th style={{ backgroundColor: 'white' }} colSpan={6}>
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </table>
      <table className="report-container">
        <thead className="report-header">
          <tr className="head-title">
            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={6}>قائمة حركة غرامات القروض المنفذة</th>
          </tr>
          <tr className="head-title">
            <th colSpan={4}>المركز الرئيسي</th>
            <th colSpan={6}>تاريخ الحركه من 2020/05/02 الي 2020/07/02</th>
          </tr>
          <tr className="head-title">
            <th colSpan={4}>12:17:26 &emsp; 2020/07/05</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
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
            <th>حالة القرض</th>
            <th>مستند الحركة</th>
            <th>قيمة الغرامة</th>
            <th>نوع الغرامة</th>
            <th>حالة الحركة</th>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
        </thead>

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              تاريخ الحركه
            </th>
            <th className="gray frame" colSpan={2}>
              2020/05/02
            </th>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              بنك / خرينه
            </th>
            <th className="gray frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>امال محمود محمد عثمان</td>
            <td>001</td>
            <td>0004519</td>
            <td>14000.00</td>
            <td>2018/03/07</td>
            <td>مسدد بالكامل</td>
            <td>ترحيل</td>
            <td>1.00</td>
            <td>غرامة تأخير</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
          <tr>
            <td />
            <td className="frame" colSpan={2}>
              إجمالي بنك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </td>
            <td className="frame" colSpan={1}>
              2020/07/02
            </td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbody-border">
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">2020/06/09</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              بنك / خرينه
            </th>
            <th className="gray frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>امال محمود محمد عثمان</td>
            <td>001</td>
            <td>0004519</td>
            <td>14000.00</td>
            <td>2018/03/07</td>
            <td>مسدد بالكامل</td>
            <td>ترحيل</td>
            <td>1.00</td>
            <td>غرامة تأخير</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
          <tr>
            <td />
            <td className="frame" colSpan={2}>
              إجمالي بنك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </td>
            <td className="frame" colSpan={1}>
              2020/07/02
            </td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbody-border">
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">2020/06/09</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              بنك / خرينه
            </th>
            <th className="gray frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>امال محمود محمد عثمان</td>
            <td>001</td>
            <td>0004519</td>
            <td>14000.00</td>
            <td>2018/03/07</td>
            <td>مسدد بالكامل</td>
            <td>ترحيل</td>
            <td>1.00</td>
            <td>غرامة تأخير</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
          <tr>
            <td />
            <td className="frame" colSpan={2}>
              إجمالي بنك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </td>
            <td className="frame" colSpan={1}>
              2020/07/02
            </td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
        </tbody>
        <tr style={{ height: '1em;' }} />

        <tbody className="tbody-border">
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">2020/06/09</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody>
          <tr>
            <th className="gray frame" colSpan={2}>
              بنك / خرينه
            </th>
            <th className="gray frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>001/00171760</td>
            <td>001/00113930</td>
            <td>امال محمود محمد عثمان</td>
            <td>001</td>
            <td>0004519</td>
            <td>14000.00</td>
            <td>2018/03/07</td>
            <td>مسدد بالكامل</td>
            <td>ترحيل</td>
            <td>1.00</td>
            <td>غرامة تأخير</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
          <tr>
            <td />
            <td className="frame" colSpan={2}>
              إجمالي بنك / خزينه
            </td>
            <td className="frame" colSpan={2}>
              بنك 1 - القاهره - شبرا مصر
            </td>
            <td className="frame" colSpan={1}>
              2020/07/02
            </td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
          <tr>
            <th colSpan={13} className="border" />
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbody-border">
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame">2020/06/09</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">1</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
        </tbody>

        <tr style={{ height: '1em' }} />

        <tbody className="tbody-border">
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي بالعمله
            </td>
            <td className="gray frame">جنيه مصري</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">162</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">1.00</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">0.00</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة المسدده</td>
            <td className="frame">1.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default FinesTransaction

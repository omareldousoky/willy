import React from 'react'

import './style.scss'
import { Branch, Customer } from '../../../../Shared/Services/interfaces'

interface IDefaultingCustomersPdfProps {
  branch: Branch
  customers: Customer[]
}

const DefaultingCustomers = ({
  branch = {
    name: '',
    bankAccount: '',
    costCenter: '',
    licenseNumber: '',
    governorate: '',
    licenseDate: '',
  },
  customers,
}: IDefaultingCustomersPdfProps) => {
  return (
    <div className="defaulting-customers__container">
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={3}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={4}></th>
            <th colSpan={3}>12:17:26 &emsp; 2020/07/05</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>{branch.name}</th>
            <th colSpan={4}></th>
            <th colSpan={3}>تمت المراجعه</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={3}>تحريرا في: 2020/09/01</th>
            <th colSpan={4}></th>
            <th colSpan={3}>مريم يحيي شوقي</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={100}>
              برجاء التكرم من سيادتكم بالموافقه علي اتخاذ مايلزم من اجراءات
              قانونيه (دعوى قضائيه) ضد كل من:
            </th>
          </tr>
          <tr className="header">
            <th>رقم مسلسل</th>
            <th>كود العميل</th>
            <th colSpan={2}>أسم العميل</th>
            <th>كود التمويل</th>
            <th>تاريخ الدفعه</th>
            <th>مبلغ الإيصال</th>
            <th>أقساط متأخره</th>
            <th colSpan={2}>أقساط غير مسدده</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>061/0001154</td>
            <td>وليد جاد عبد الغني الدسوقي</td>
            <td>عميل</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>061/0001155</td>
            <td>جاد عبد الغني الدسوقي عبد الغني</td>
            <td>ضامن أول</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>061/0001156</td>
            <td>شعبان رضا عبد المطلب عثمان</td>
            <td>ضامن ثان</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td>061/0001154</td>
            <td>وليد جاد عبد الغني الدسوقي</td>
            <td>عميل</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>061/0001155</td>
            <td>جاد عبد الغني الدسوقي عبد الغني</td>
            <td>ضامن أول</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>061/0001156</td>
            <td>شعبان رضا عبد المطلب عثمان</td>
            <td>ضامن ثان</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td>061/0001154</td>
            <td>وليد جاد عبد الغني الدسوقي</td>
            <td>عميل</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>061/0001155</td>
            <td>جاد عبد الغني الدسوقي عبد الغني</td>
            <td>ضامن أول</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>061/0001156</td>
            <td>شعبان رضا عبد المطلب عثمان</td>
            <td>ضامن ثان</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td>061/0001154</td>
            <td>وليد جاد عبد الغني الدسوقي</td>
            <td>عميل</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>061/0001155</td>
            <td>جاد عبد الغني الدسوقي عبد الغني</td>
            <td>ضامن أول</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>061/0001156</td>
            <td>شعبان رضا عبد المطلب عثمان</td>
            <td>ضامن ثان</td>
            <td>061/0001154/003</td>
            <td>2019/06/27</td>
            <td>47771</td>
            <td>1</td>
            <td>8</td>
            <td>21232</td>
          </tr>
          <tr>
            <td>العنوان</td>
            <td colSpan={3}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
            <td colSpan={6}>
              ش الشيخ يوسف ج فرن محمد سلمان مركز زفتي - الغربية
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr className="headtitle">
            <td colSpan={100}>المحامي المسئول الاستاذ: خالد راشد</td>
          </tr>
          <tr className="headtitle">
            <th>مدير الفرع</th>
            <th>مشرف المنطقه</th>
            <th>مدير المنطقه</th>
            <th>المدير المالي</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}

export default DefaultingCustomers

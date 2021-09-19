import React, { Component } from 'react'
import './clearancePaper.scss'
import Tafgeet from 'tafgeetjs'
import { timeToArabicDate } from '../../../Shared/Services/utils'
import { Header } from '../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'

interface Clearance {
  issuedDate: number
  principal: number
  customerName: string
  branchName: string
  bankName: string
  beneficiaryType: string
  lastPaidInstDate: number
  customerNationalId: string
}
interface Props {
  approvedClearancesList: Array<Clearance>
}
export default class ClearancePaper extends Component<Props, {}> {
  render() {
    return this.props.approvedClearancesList.map(
      (clearance: Clearance, index) => (
        <div className="clearance-paper-print" dir="rtl" lang="ar" key={index}>
          <table>
            <Header
              title=""
              showCurrentUser={false}
              showCurrentTime={false}
              cf
            />
            <div className="rightText">
              {`${clearance.branchName} فى ${timeToArabicDate(
                new Date().valueOf(),
                false
              )}`}
            </div>
            <div className="centerText">
              <u>شهـادة مخالصة</u>
            </div>
            <br />
            <br />
            <br />
            <div className="rightText">موجه الى: من يهمة الأمر</div>
            <div className="rightText">
              أسم العميل: {clearance.customerName}
            </div>
            <div className="rightText">
              رقم البطاقة: {clearance.customerNationalId}
            </div>
            <div className="rightText">
              مبلغ المديونية: {clearance.principal} (
              {new Tafgeet(clearance.principal, 'EGP').parse()})
            </div>
            <div className="rightText">
              الكود المدرج لشركة حالا فى شركة أى سكور
            </div>
            <br />
            <br />
            <div className="rightText">تحيه طيبه وبعد ،،،،،</div>
            <div className="rightText">
              بالإشارة الى الموضوع عاليه، نحيط سيادتكم علماً بأنه تم سداد إجمالى
              رصيد مديونية العميل أعلاه طرفنا و لا توجد أى مديونية أو متأخرات
              أخرى على العميل و قد تم أغلاق المديونية و ذلك فى تاريخة.
            </div>
            <div className="rightText">
              و قد أصدرت هذه الشهادة بناء على طلب العميل دون أدنى مسئولية على
              الشركة حالا أو مستقبلا.
            </div>
            <br />
            <br />
            <br />
            <div className="d-flex justify-content-end">
              <div className="centerText">
                <span>......................</span> <br />
                <span>توقيع</span>
              </div>
            </div>
          </table>
        </div>
      )
    )
  }
}

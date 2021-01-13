import React, { Component } from 'react'
import './clearancePaper.scss'
import Tafgeet from 'tafgeetjs';
import { timeToArabicDate } from '../../../Shared/Services/utils';
interface Clearance {
    issuedDate: number;
    principal: number;
    customerName: string;
    branchName: string;
    bankName: string;
    beneficiaryType: string;
    lastPaidInstDate: number;

}
interface Props {
    approvedClearancesList: Array<Clearance>;
}
export default class ClearancePaper extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    renderGroup(clearance: Clearance, index) {
        return (
            <div className='clearance-paper-print' dir="rtl" lang="ar" key={index}>
                <table>
                    <div className="centerText">مخـــــالصـــة</div>
                    <tr className="headtitle">
                        <th>{timeToArabicDate(new Date().valueOf(), true)}</th>
                    </tr>
                    <div className="rightText">الساده / {clearance.bankName}</div>
                    <div className="rightText">تحيه طيبه وبعد ،،،،،</div>
                    <div className="rightText"> الموضوع : التمويل السابق منحه للعميل / {clearance.customerName} .</div>
                    <div className="rightText">بالاشاره الي الموضوع بعاليه والي طلب العميل / {clearance.customerName} ، بشأن طلب موافاتكم بما يفيد موقف العميل طرفنا في تاريخه .</div>
                    <div className="rightText">نتشرف بالافاده ان العميل / {clearance.customerName} ، قد قام بسداد كافه المديونيات المستحقه عليه والناتجه من التمويل السابق منحه بتاريخ {clearance.issuedDate? timeToArabicDate(clearance.issuedDate, false): ''} .</div>
                    <div className="rightText">وكذا انهاء كافه الضمانات الشخصيه السابق صدورها منه لصالح شركتنا لعملاء اخرين وذلك باجمالي مبلغ وقدره {clearance.principal} جنيه</div>
                    <div className="rightText">{clearance.principal ? new Tafgeet(clearance.principal, 'EGP').parse():''}</div>
                    <div className="rightText">ولا يستحق لشركتنا قبل العميل / {clearance.customerName} ، ايه مديونيات او مستحقات حتي تاريخ هذا الخطاب .</div>
                    <tr></tr>
                    <div className="rightText">تحريرا في {timeToArabicDate(new Date().valueOf(), false)}</div>
                    <div className="smallCenter">وتفضلوا بقبول فائق الاحترام ،،،،،،،</div>
                    <div className="leftText">شركه تساهيل للتمويل متناهي الصغر</div>
                    <tr></tr>
                    <div className="signatureRow"><span  className="signature1">توقيع أول</span><span  className="signature2">توقيع ثاني</span></div>
                </table>
            </div>
        )
    }
    renderIndividual(clearance: Clearance, index: number) {
        return (
            <div className='clearance-paper-print' dir="rtl" lang="ar" key={index}>
                <table>
                    <div className="centerText" >مخـــــالصـــة</div>
                    <tr className="headtitle">
                        <th>{timeToArabicDate(new Date().valueOf(), true)}</th>
                    </tr>
                    <div className="rightText" >الساده / {clearance.bankName}</div>
                    <div className="rightText" >تحيه طيبه وبعد ،،،،،</div>
                    <div className="rightText" >تشهد شركه تساهيل للتمويل متناهي الصغر فرع {clearance.branchName}</div>
                    <div className="rightText" >بان السيد / {clearance.customerName} قد قام بتاريخ {clearance.lastPaidInstDate? timeToArabicDate(clearance.lastPaidInstDate, false):''} بسداد كامل قيمه التمويل الممنوح له.</div>
                    <div className="rightText" >بتاريخ {clearance.issuedDate? timeToArabicDate(clearance.issuedDate, false): ''} وملحقاته والبالغ قدره {clearance.principal} جنيه {clearance.principal? `(${new Tafgeet(clearance.principal, 'EGP').parse()}))`:''}.</div>
                    <div className="rightText" >وتعتبر هذه المخالصه ابراء لذمه المذكور من ايه مبالغ مستحقه عليه للشركه عن هذا التمويل الممنوح له.</div>
                    <div className="rightText" >بتاريخ {clearance.issuedDate? timeToArabicDate(clearance.issuedDate, false):''}حتي تاريخه </div>
                    <div className="rightText" >تحريرا في {timeToArabicDate(new Date().valueOf(), false)} </div>
                    <div className="smallCenter" >وتفضلوا بقبول فائق الاحترام ،،،،،،،</div>
                    <div className="leftText" >شركه تساهيل للتمويل متناهي الصغر</div>
                    <tr></tr>
                    <div className="signatureRow"><span  className="signature1">توقيع أول</span><span  className="signature2">توقيع ثاني</span></div>
                </table>
            </div>
        )
    }
    render() {
        return (
            <>
                {this.props.approvedClearancesList.map((clearance: Clearance, index) => {
                    if (clearance.beneficiaryType === 'group')
                        return (this.renderGroup(clearance, index));
                    else return (this.renderIndividual(clearance, index))
                })
                }

            </>
        )
    }
}

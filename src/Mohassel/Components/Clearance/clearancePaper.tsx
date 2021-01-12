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
                <table style={{ fontSize: 18, margin: "10px 0px", textAlign: "center", width: '100%' }}>
                    <tr style={{ height: "10px" }}></tr>
                    <tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><th colSpan={6}>
                        <div className={"logo-print"} ></div></th>
                        <th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                    <tr style={{ height: "10px" }}></tr>
                </table>
                <table>
                    <div className="centerText">مخـــــالصـــة</div>
                    <tr className="headtitle">
                        <th>{timeToArabicDate(0, true)}</th>
                    </tr>
                    <div className="rightText">الساده / {clearance.bankName}</div>
                    <div className="rightText">تحيه طيبه وبعد ،،،،،</div>
                    <div className="rightText"> الموضوع : التمويل السابق منحه للعميل / {clearance.customerName} .</div>
                    <div className="rightText">بالاشاره الي الموضوع بعاليه والي طلب العميل / {clearance.customerName} ، بشأن طلب موافاتكم بما يفيد موقف العميل طرفنا في تاريخه .</div>
                    <div className="rightText">نتشرف بالافاده ان العميل / {clearance.customerName} ، قد قام بسداد كافه المديونيات المستحقه عليه والناتجه من التمويل السابق منحه بتاريخ {clearance.issuedDate? timeToArabicDate(clearance.issuedDate, true): ''} .</div>
                    <div className="rightText">وكذا انهاء كافه الضمانات الشخصيه السابق صدورها منه لصالح شركتنا لعملاء اخرين وذلك باجمالي مبلغ وقدره {clearance.principal} جنيه</div>
                    <div className="rightText">{clearance.principal ? new Tafgeet(clearance.principal, 'EGP').parse():''}</div>
                    <div className="rightText">ولا يستحق لشركتنا قبل العميل / {clearance.customerName} ، ايه مديونيات او مستحقات حتي تاريخ هذا الخطاب .</div>
                    <tr></tr>
                    <div className="rightText">تحريرا في {timeToArabicDate(0, false)}</div>
                    <div className="smallCenter">وتفضلوا بقبول فائق الاحترام ،،،،،،،</div>
                    <div className="leftText">شركه تساهيل للتمويل متناهي الصغر</div>
                    <tr></tr>
                    <tr><th colSpan={3} className="signature1">توقيع أول</th><th colSpan={3} className="signature2">توقيع ثاني</th></tr>
                </table>
            </div>
        )
    }
    renderIndividual(clearance: Clearance, index: number) {
        return (
            <div className='clearance-paper-print' dir="rtl" lang="ar" key={index}>
                <table style={{ fontSize: 18, margin: "10px 0px", textAlign: "center", width: '100%' }}>
                    <tr style={{ height: "10px" }}></tr>
                    <tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><th colSpan={6}>
                        <div className={"logo-print"} ></div></th>
                        <th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                    <tr style={{ height: "10px" }}></tr>
                </table>
                <table>
                    <div className="centerText" >مخـــــالصـــة</div>
                    <tr className="headtitle">
                        <th>{timeToArabicDate(0, true)}</th>
                    </tr>
                    <div className="rightText" >الساده / {clearance.bankName}</div>
                    <div className="rightText" >تحيه طيبه وبعد ،،،،،</div>
                    <div className="rightText" >تشهد شركه تساهيل للتمويل متناهي الصغر فرع قنا  نجع حمادي</div>
                    <div className="rightText" >بان السيد / احمد احمد احمد احمد قد قام بتاريخ 12/01/2020 بسداد كامل قيمه التمويل الممنوح له.</div>
                    <div className="rightText" >ب وملحقاته والبالغ قدره {clearance.principal} جنيه {clearance.principal? `(${new Tafgeet(clearance.principal, 'EGP').parse()}))`:''}.</div>
                    <div className="rightText" >وتعتبر هذه المخالصه ابراء لذمه المذكور من ايه مبالغ مستحقه عليه للشركه عن هذا التمويل الممنوح له.</div>
                    <div className="rightText" >بتاريخ {clearance.issuedDate? timeToArabicDate(clearance.issuedDate, false):''}حتي تاريخه </div>
                    <div className="rightText" >تحريرا في {timeToArabicDate(0, false)} </div>
                    <div className="leftText" >وتفضلوا بقبول فائق الاحترام ،،،،،،،</div>
                    <div className="leftText" >شركه تساهيل للتمويل متناهي الصغر</div>
                    <tr></tr>
                    <tr><th colSpan={3} className="signature1">توقيع أول</th><th colSpan={3} className="signature2">توقيع ثاني</th></tr>
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

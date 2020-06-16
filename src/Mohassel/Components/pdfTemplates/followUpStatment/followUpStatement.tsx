import React from 'react';
import './followUpStatment.scss';
import * as local from '../../../../Shared/Assets/ar.json';

const FollowUpStatment = (props) => {
    console.log('props', props)
    return (
        <div className="follow-up-statment" dir="rtl" lang="ar">
            <table className="margin" >
                <tbody>
                    <tr>
                        <td>الغربية - زفتى</td>
                        <td></td>
                        <td>١/١ &emsp; جرجس فوزي عطيه - اخصائي نظم معلومات</td>
                    </tr>
                    <tr>
                        <td>١٦:٢٦:٠١ &emsp; ٢٠٢٠/٠٥/٠٥</td>
                        <td></td>
                        <td>الاربعاء</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className="title2 bold"><u>بيان متابعه</u></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <table className="titleborder">
                <tbody>
                    <tr>
                        <td style={{ textAlign: "right" }}> العميل
					<div className="frame">٠٠٦/٠٠١١٩٩٤</div>
                            <div className="frame">مني نور الدين عباس مبروك</div>
                        </td>

                    </tr>
                </tbody>
            </table>


            <table className="table-content" style={{ width: "50%" }}>
                <tbody>
                    <tr>
                        <th>القسط</th>
                        <th>تاريخ الآستحقاق</th>
                        <th>القيمه</th>
                        <th style={{ width: "40%" }}>ملاحظات</th>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>٠٠٦/٠٠١١٩٩٤/٠٠٧/١</td>
                        <td>٢٠٢٠/٠٥/٢١</td>
                        <td>٢٧٦١</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default FollowUpStatment;
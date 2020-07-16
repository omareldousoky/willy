import React from 'react';
import './branchesLoanList.scss';

const BranchesLoanList = (props) => {
    return (
        <div className="branches-loan-list" lang="ar">
            <table>
                <thead className="report-header">
                    <tr>
                        <th>
                            <div>
                                <table>
                                    <tbody>
                                        <tr className="headtitle">
                                            <th>شركة تساهيل للتمويل متناهي الصغر</th>
                                            <th>القروض والحالات للفتره من : 2020/06/01 الي : 2020/07/06</th>
                                            <th>1/1</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </th>
                    </tr>
                </thead>
            </table>

            <table className="body">
                <thead>
                    <tr>
                        <th colSpan={2}>مجموعه</th>
                    </tr>
                    <tr>
                        <th rowSpan={3}>م</th>
                        <th rowSpan={3}>اسم الفرع</th>
                        <th colSpan={6}>الفروع</th>
                        <th colSpan={6}>**الحالات</th>
                        <th colSpan={2} rowSpan={2}>إجمالي عام</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>غير مصدر</th>
                        <th colSpan={2}>مصدر</th>
                        <th colSpan={2}>إجمالي</th>
                        <th colSpan={2}>منتظر قرار</th>
                        <th colSpan={2}>موافق عليه</th>
                        <th colSpan={2}>إجمالي</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>68</td>
                        <td>المنيا - ابو قرقاص</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>0</th>
                        <th>0.0</th>
                        <td>0</td>
                        <td>0.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>0</th>
                        <th>0.0</th>
                        <th>0</th>
                        <th>0.0</th>
                    </tr>
                    <tr>
                        <td>129</td>
                        <td>المنيا - ابو قرقاص ثان</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>46</td>
                        <td>908.5</td>
                        <th>46</th>
                        <th>908.5</th>
                        <td>0</td>
                        <td>0.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>0</th>
                        <th>0.0</th>
                        <th>46</th>
                        <th>908.5</th>
                    </tr>
                    <tr>
                        <td colSpan={2}>إجمالي المجموعه</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>46</td>
                        <td>908.5</td>
                        <th>46</th>
                        <th>908.5</th>
                        <td>0</td>
                        <td>0.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>0</th>
                        <th>0.0</th>
                        <th>46</th>
                        <th>908.5</th>
                    </tr>
                </tbody>

                <thead>
                    <tr>
                        <th colSpan={2}>فردي</th>
                    </tr>
                    <tr>
                        <th rowSpan={3}>م</th>
                        <th rowSpan={3}>اسم الفرع</th>
                        <th colSpan={6}>الفروع</th>
                        <th colSpan={6}>**الحالات</th>
                        <th colSpan={2} rowSpan={2}>إجمالي عام</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>غير مصدر</th>
                        <th colSpan={2}>مصدر</th>
                        <th colSpan={2}>إجمالي</th>
                        <th colSpan={2}>منتظر قرار</th>
                        <th colSpan={2}>موافق عليه</th>
                        <th colSpan={2}>إجمالي</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                        <th colSpan={2}>عدد / مبلغ بالالف</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>68</td>
                        <td>المنيا - ابو قرقاص</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>134</td>
                        <td>2983.0</td>
                        <th>134</th>
                        <th>2893.0</th>
                        <td>5</td>
                        <td>165.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>5</th>
                        <th>165.0</th>
                        <th>139</th>
                        <th>3058.0</th>
                    </tr>
                    <tr>
                        <td>129</td>
                        <td>المنيا - ابو قرقاص ثان</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>15</td>
                        <td>131.5</td>
                        <th>15</th>
                        <th>131.5</th>
                        <td>0</td>
                        <td>0.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>0</th>
                        <th>0.0</th>
                        <th>15</th>
                        <th>131.5</th>
                    </tr>
                    <tr>
                        <td colSpan={2}>إجمالي فردي</td>
                        <td>0</td>
                        <td>0.0</td>
                        <td>149</td>
                        <td>3024.5</td>
                        <th>149</th>
                        <th>3024.5</th>
                        <td>5</td>
                        <td>165.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>5</th>
                        <th>165.0</th>
                        <th>154</th>
                        <th>3189.0</th>
                    </tr>
                </tbody>

                <tbody>
                    <tr>
                        <th colSpan={2}>إﺟﻣﺎﻟﻰ ﺷرﻛﺔ ﺗﺳﺎھﯾل ﻟﻠﺗﻣوﯾل ﻣﺗﻧﺎھﻰ اﻟﺻﻐر</th>
                        <td>0</td>
                        <td>0.0</td>
                        <td>195</td>
                        <td>3932.5</td>
                        <th>195</th>
                        <th>3932.5</th>
                        <td>5</td>
                        <td>165.0</td>
                        <td>0</td>
                        <td>0.0</td>
                        <th>5</th>
                        <th>165.0</th>
                        <th>200</th>
                        <th>4097.5</th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default BranchesLoanList;
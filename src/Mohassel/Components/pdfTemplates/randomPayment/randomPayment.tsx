import React from 'react'
import './randomPayment.scss';
const RandomPayment = () => {
    return (

<div dir="rtl" lang="ar" className = "random-payment-print">
	<table className="report-container">
		<thead className="report-header">
			<tr>
				<th>
					<div>
						<table>
							<tbody>
								<tr className="head-title">
									<th>12:17:26 &emsp; 2020/07/06</th>
									<th>هاني رمزى امين - محاسب</th>
									<th>1/2</th>
								</tr>
								<tr className="head-title">
									<th></th>
									<th>الحركات الماليه من الفتره 2020/06/01 الي 2020/07/05</th>
								</tr>
								<tr className="head-title">
									<th></th>
									<th>حركات سداد المنفذ</th>
								</tr>
							</tbody>
						</table>
					</div>
				</th>
			</tr>
		</thead>
	</table>

	<table style={{padding:"10px"}}>
		<thead>
			<tr>
				<th colSpan={3}><div className="frame" > المنيا - ابو قرقاص </div></th>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
			<tr>
				<th></th>
				<th>كود العميل</th>
				<th>اسم العميل</th>
				<th>كود الحركه</th>
				<th>تاريخ الحركه</th>
				<th>قيمة الحركه</th>
				<th>رقم الايصال</th>
				<th>نوع الحركه الماليه</th>
				<th>الخزينه</th>
				<th></th>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>110680001713</td>
				<td>روماني بطرس باسيلي بطرس</td>
				<td>598</td>
				<td>2020-06-24</td>
				<td>100.00</td>
				<td></td>
				<td>رسوم تحرير مخالصه</td>
				<td>خزينه 4 فرع ابو قرقاص</td>
				<td>منفذ</td>
			</tr>
			<tr>
				<td colSpan={4}></td>
				<td>1</td>
				<td>100.00</td>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
		</tbody>
		<tbody>
			<tr>
				<td>1</td>
				<td>110680001713</td>
				<td>روماني بطرس باسيلي بطرس</td>
				<td>598</td>
				<td>2020-06-24</td>
				<td>100.00</td>
				<td></td>
				<td>رسوم تحرير مخالصه</td>
				<td>خزينه 4 فرع ابو قرقاص</td>
				<td>منفذ</td>
			</tr>
			<tr>
				<td colSpan={4}></td>
				<td>1</td>
				<td>100.00</td>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
		</tbody>
		<tbody>
			<tr>
				<td>1</td>
				<td>110680001713</td>
				<td>روماني بطرس باسيلي بطرس</td>
				<td>598</td>
				<td>2020-06-24</td>
				<td>100.00</td>
				<td></td>
				<td>رسوم تحرير مخالصه</td>
				<td>خزينه 4 فرع ابو قرقاص</td>
				<td>منفذ</td>
			</tr>
			<tr>
				<td colSpan={4}></td>
				<td>1</td>
				<td>100.00</td>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
		</tbody>
		<tbody>
			<tr>
				<td>1</td>
				<td>110680001713</td>
				<td>روماني بطرس باسيلي بطرس</td>
				<td>598</td>
				<td>2020-06-24</td>
				<td>100.00</td>
				<td></td>
				<td>رسوم تحرير مخالصه</td>
				<td>خزينه 4 فرع ابو قرقاص</td>
				<td>منفذ</td>
			</tr>
			<tr>
				<td colSpan={4}></td>
				<td>1</td>
				<td>100.00</td>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
			<tr>
				<td colSpan={10} ></td>
			</tr>
		</tbody>
		<tbody className="tbody-border">
			<tr>
				<td colSpan={3}>إجمالي الحركه المنيا - ابو قرقاص</td>
				<td></td>
				<td>عدد 4</td>
				<td>المبلغ 400.00</td>
			</tr>
		</tbody>
	</table>

</div>
    )
}

export default RandomPayment

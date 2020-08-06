import React from 'react'
import './randomPayment.scss';
interface Props{
 branches: {rows: {
	customerKey: string;
	customerName: string;
	trxCode: string;
	trxDate: string;
	trxAmount: string;
	trxAction: string;
 }[];}[];
 trxCount: string;
 trxSum: string;
 branchName: string;
 
 };
 
const RandomPayment = (props: Props) => {
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
{ props.branches.map( (branch, index) =>{
	return (
	<table key = {index}  style={{padding:"10px"}}>
		<thead>
			<tr>
				<th colSpan={3}><div className="frame" >{props.branchName} </div></th>
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
		{branch.rows.map((row,index) =>{
			return(
		<tbody key={index}>
			<tr>
				<td>1</td>
				<td>{row.customerKey}</td>
				<td>{row.customerName}</td>
				<td>{row.trxCode}</td>
				<td>{row.trxDate}</td>
				<td>{row.trxAmount}</td>
				<td></td>
				<td>{row.trxAction}</td>
				<td>خزينه 4 فرع ابو قرقاص</td>
				<td>منفذ</td>
			</tr>
			<tr>
				<td colSpan={4}></td>
				<td>1</td>
				<td>{row.trxAmount}</td>
			</tr>
			<tr>
				<td colSpan={10} className="border"></td>
			</tr>
		</tbody>
		)})
}  
<tbody className="tbody-border">
			<tr>
<td colSpan={3}>إجمالي الحركه {props.branchName}</td>
				<td></td>
				<td>عدد {props.trxCount}</td>
				<td>المبلغ {props.trxSum}</td>
			</tr>
		</tbody>
	</table>
	
)})
}
</div>
	)}


export default RandomPayment

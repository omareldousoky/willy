import React from 'react'
import { connect } from "react-redux";
import './randomPayment.scss';
import { timeToArabicDate } from '../../../Services/utils';
interface Props {
	branches: {
		rows: {
			customerKey: string;
			customerName: string;
			trxCode: string;
			trxDate: string;
			trxAmount: string;
			trxAction: string;
		}[];
		trxCount: string;
		trxSum: string;
		branchName: string;
	}[];
	startDate: any;
	endDate: any;
	name: string;
};

const actionsLocalization = (action: string) => {
	switch (action) {
		case 'reissuingFees':
			return ('رسوم إعادة إصدار');
		case 'clearanceFees':
			return ('رسوم تحرير مخالصة');
		case 'applicationFees':
			return ('رسوم طلب قرض');
		case 'collectionCommission':
			return ('عموله تحصيل قرض');
		case 'penalty':
			return ('غرامات');
		case 'toktokStamp':
			return ('دفعه مقدم توكتَوك');
		case 'tricycleStamp':
			return ('دفعه مقدم تروسكل');
	  case 'legalFees':
	  return('مصاريف قضائية');		

		default:
			return null;
	}
}

const RandomPayment = (props: Props) => {
	return (

		<div dir="rtl" lang="ar" className="random-payment-print">

			<table className="report-container">
				<thead className="report-header">
					<tr>
						<th>
							<div>
								<table>
									<tbody>
										<tr className="head-title">
											<th>{timeToArabicDate(0, true)}</th>
											<th>{props.name}</th>
										</tr>
										<tr className="head-title">
											<th></th>
											<th>الحركات الماليه من الفتره {timeToArabicDate(props.startDate,false)} الي {timeToArabicDate(props.endDate,false)}</th>
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
			{props.branches?.map((branch, index) => {
				return (
					<table key={index} style={{ padding: "10px" }}>
						<thead>
							<tr>
								<th colSpan={3}><div className="frame" >{branch.branchName} </div></th>
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
								<th></th>
							</tr>
							<tr>
								<td colSpan={10} className="border"></td>
							</tr>
						</thead>
						{branch.rows.map((row, index) => {
							return (
								<tbody key={index}>
									<tr>
										<td></td>
										<td>{row.customerKey}</td>
										<td>{row.customerName}</td>
										<td>{row.trxCode}</td>
										<td>{row.trxDate}</td>
										<td>{row.trxAmount}</td>
										<td></td>
										<td>{actionsLocalization(row.trxAction)}</td>
										<td>منفذ</td>
									</tr>
									<tr>
										<td colSpan={4}></td>
										<td></td>
										<td>{row.trxAmount}</td>
									</tr>
									<tr>
										<td colSpan={10} className="border"></td>
									</tr>
								</tbody>
							)
						})
						}
						<tbody className="tbody-border">
							<tr>
								<td colSpan={3}>إجمالي الحركه {branch.branchName}</td>
								<td></td>
								<td>عدد {branch.trxCount}</td>
								<td>المبلغ {branch.trxSum}</td>
							</tr>
						</tbody>
					</table>

				)
			})
			}
		</div>
	)
}

const mapStateToProps = state => {
	return {
		name: state.auth.name
	}
}

export default connect(mapStateToProps)(RandomPayment);

import React from 'react'
import { connect } from "react-redux";
import './randomPayment.scss';
import { timeToArabicDate } from "../../../../Shared/Services/utils"
interface Props {
	branches: {
		rows: {
			customerKey: string;
			customerName: string;
			trxCode: string;
			trxDate: string;
			trxAmount: string;
			trxAction: string;
			canceled: string;
		}[];
		trxCount: string;
		trxSum: string;
		branchName: string;
		trxRb: string;
		trxNet: string;
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
			return ('تكلفه تمويل قضائية');

		default:
			return null;
	}
}

const RandomPayment = (props: Props) => {
	return (
			<div dir="rtl" lang="ar" className="random-payment-print">
			<table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
				<tr style={{ height: "10px" }}></tr>
				<tr style={{width:'100%',display:'flex',flexDirection:'row' , justifyContent:'space-between'}}><th colSpan={6}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
				<tr style={{ height: "10px" }}></tr>
			</table>
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
												<th>الحركات الماليه من الفتره {timeToArabicDate(props.startDate, false)} الي {timeToArabicDate(props.endDate, false)}</th>
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
									<th>نوع الحركه الماليه</th>
									<th>حالة الحركة</th>
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
											<td>{actionsLocalization(row.trxAction)}</td>
											<td>{row.canceled === '1' ? 'الحركة ملغاه' : ''}</td>
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
									<td>
										<tr>
											<td>عدد </td>
											<td>{branch.trxCount}</td>
										</tr>
									</td>
									<td>
										<tr>
											<td>إجمالي المبلغ </td>
											<td>{branch.trxSum}</td>
										</tr>
										<tr>
											<td>القيمة الملغاه </td>
											<td>{branch.trxRb}</td>
										</tr>
										<tr>
											<td>صافي المبلغ </td>
											<td>{branch.trxNet}</td>
										</tr>
									</td>
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

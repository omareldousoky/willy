import React from 'react'
import { connect } from "react-redux";
import './customerTransactionReport.scss';
import { timeToArabicDate, timeToArabicDateNow } from "../../../../Shared/Services/utils"
interface Props {
	result: {
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
	fromDate: any;
	toDate: any;
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

const CustomerTransactionReport = (props: Props) => {
	return (
		<div dir="rtl" lang="ar" className="random-payment-print">
			<table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
				<tr style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<th style={{ backgroundColor: 'grey' }} colSpan={6}>شركة تساهيل للتمويل متناهى الصغر</th>
				</tr>
				<tr style={{ height: "10px" }}></tr>
			</table>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		name: state.auth.name
	}
}

export default connect(mapStateToProps)(CustomerTransactionReport);

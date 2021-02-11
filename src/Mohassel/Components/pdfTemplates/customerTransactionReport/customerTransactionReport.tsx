import React, { Component, Fragment } from "react";
import { getDateString, timeToArabicDate, timeToArabicDateNow } from "../../../../Shared/Services/utils";
import Orientation from "../../Common/orientation";
import "./customerTransactionReport.scss";

const numbersToArabic = (input) => {
	if (input || input === 0) {
		const id = ["۰", "۱", "۲", "۳", "٤", "۵", "٦", "۷", "۸", "۹"];
		const inputStr = input.toString();
		return inputStr.replace(/[0-9]/g, (number) => {
			return id[number];
		});
	} else return "";
};
const installmentStatuses = {
	unpaid: "غير مسدد",
	partiallyPaid: "مدفوع جزئيا",
	pending: "قيد التحقيق",
};
interface InstallmentsDuePerOfficerCustomerCardProps {
	data: any;
}

function setPageSize() {
	const style = document.createElement('style');
	style.innerHTML = `@page {size: landscape}`;
	style.id = 'page-orientation';
	document.head.appendChild(style);
}

const CustomerTransactionReport = (
	props: InstallmentsDuePerOfficerCustomerCardProps
) => {
	setPageSize();
	const renderHeader = () => {
		return (
			<div style={{ display: "flex" }}>
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							backgroundColor: "lightgrey",
							border: "1px solid black",
							width: "70%",
							textAlign: "center",
							marginBottom: 5,
						}}
					>
						{"شركة تساهيل للتمويل متناهى الصغر"}
					</div>
					<p style={{ margin: 0 }}>{timeToArabicDateNow(true)}</p>
				</div>
				<div style={{ flex: 1 }}>
					<p style={{ margin: 0 }}>{"الحركة تبعا للعميل"}</p>
					<p style={{ marginTop: 10 }}>
						<span style={{ border: "1px solid black", padding: 10 }}>206/8182</span>
						<span style={{ border: "1px solid black", padding: 10 }}>نعناعه ناجي محمد عبدالقادر</span>
					</p>
				</div>
				<div style={{ flex: 1 }}>
					<p style={{ margin: 0 }}>{"1/1"}</p>
				</div>
			</div>
		);
	};
	const renderTableBody = (array) => {
		return (
			<tbody>
				{array.map((el, idx) => {
					return (
						<tr key={idx}>
							<td className="long">{el.transactionCode}</td>
							<td className="nowrap">{numbersToArabic(el.installmentNumber) || "٠"}</td>
							<td className="nowrap">
								{el.date
									? timeToArabicDate(
										new Date(el.date).valueOf(),
										false
									)
									: ""}
							</td>
							<td className="nowrap">{installmentStatuses[el.installmentStatus]}</td>
							<td>{numbersToArabic(el.transactionAmount)}</td>
							<td className="nowrap">جم</td>
							<td className="nowrap">{el.branchName}</td>
							<td className="nowrap">{el.status}</td>
							<td className="nowrap">{el.manualPaymentReceipt || ''}</td>
							<td className="nowrap">{el.username}</td>
							<td className="nowrap">{getDateString(el.createdAt)}</td>
							
						</tr>
					);
				})}
			</tbody>
		);
	};
	const renderTable = (_data) => {
		return (
			<table className="table">
				<thead>
					<tr>
						<th>{"كود الحركة"}</th>
						<th>{"رقم القسط"}</th>
						<th>{"التاريخ"}</th>
						<th>{"نوع الحركه"}</th>
						<th>{"قيمة الحركة"}</th>
						<th>{"عمله"}</th>
						<th>{"خزينه/بنك"}</th>
						<th>{"الحاله"}</th>
						<th>{"مستند حركة"}</th>
						<th>{"المستخدم"}</th>
						<th>{"الوقت"}</th>
					</tr>
				</thead>
				{renderTableBody(_data)}
			</table>
		);
	};
	const renderData = ({ data }) => {
		return (
			<>
				<Orientation size="landscape" />
				<div
					className="installmentsDuePerOfficerCustomerCard"
					dir="rtl"
					lang="ar"
				>
					{renderHeader()}
					{/* {data && data.branches
            ? data.branches.map((branch) => renderBranchData(branch))
            : null} */}
				</div>
			</>
		);
	};
	return renderData(props);
};

export default CustomerTransactionReport;
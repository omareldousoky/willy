export interface LaundryReportRequest {
	startDate: number;
	endDate: number;
	branches: string[];
}

export interface FalteringPaymentsSingleResponse {
	branch?: string;
	groupCode?: string;
	groupName?: string;
	customerCode?: string;
	customerName?: string;
	amount?: number;
	duration?: number;
	loanDate?: string;
	customerActivity?: string;
	stoppingDate?: string;
	paymentDate?: string;
	paidInstallments?: number;
	payingCustomerName?: string;
	index?: number;
}

export interface FalteringPaymentsResponse {
	response: FalteringPaymentsSingleResponse[];
}

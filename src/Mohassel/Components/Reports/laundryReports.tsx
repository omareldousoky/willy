import React, { FunctionComponent, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2';
import { ApiResponse } from '../../Services/interfaces';
import { PDF } from './reports';
import * as local from "../../../Shared/Assets/ar.json";
import { getErrorMessage } from '../../../Shared/Services/utils';
import { LaundryReportRequest } from '../../Models/LaundryReports';
import { fetchFalteringPaymentsReport } from '../../Services/APIs/Reports/falteringPayments';
import { Loader } from '../../../Shared/Components/Loader';
import ReportsModal from './reportsModal';
import Can from "../../config/Can";
import { FalteringPayments } from '../pdfTemplates/falteringPayments/falteringPayments';
import { Button } from 'react-bootstrap';

enum ReportEnum {
  FalteringPayments = "falteringPayments",
}

const laundryPdfs = [
	{
		key: ReportEnum.FalteringPayments,
		local: "تقرير سداد المتعثرين",
		inputs: ["dateFromTo", "branches"],
		permission: ReportEnum.FalteringPayments,
	}]
				
const LaundryReports: FunctionComponent = () => {
	const [showModal, setShowModal] = useState(false)
	const [printReport, setPrintReport] = useState<ReportEnum>()
	const [selectedPdf, setSelectedPdf] = useState<PDF>()
	const [loading, setLoading] = useState(false)
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')
	const [data, setData] = useState<any>()

  const handlePrint = (selectedPdf: PDF) => {
		setShowModal(true)
		setSelectedPdf(selectedPdf)
		setData(undefined)
		setFromDate("")
		setToDate("")
  }

	const reportRequest = (values): LaundryReportRequest => {
    const { fromDate, toDate, branches } = values;
		const startDate = new Date(fromDate).setHours(0, 0, 0, 0).valueOf();
    const endDate = new Date(toDate).setHours(23, 59, 59, 999).valueOf();

    return {
      startDate,
      endDate,
      branches,
    };
  }

  const handleFetchReport = (res: ApiResponse<any>, report: ReportEnum) => {
    if (res.status === "success") {
      if (!res.body || !Object.keys(res.body).length) {
				setLoading(true)
        Swal.fire("error", local.noResults);
      } else {
				setData(res.body)
				setShowModal(false)
				setPrintReport(report)
				setLoading(false)

				// print pdf
				window.print()
      }
    } else {
			setLoading(false)
      Swal.fire(
        "Error !",
        getErrorMessage((res.error as Record<string, string>).error),
        "error"
      );
    }
  }

  const handleSubmit = async (values) => {
    const branches = values.branches.map((branch) => branch._id);
    values.branches = branches.includes("") ? [] : branches;
    const { fromDate, toDate } = values;
		setShowModal(false)
		setLoading(true)
		setFromDate(fromDate)
		setToDate(toDate)
    switch (selectedPdf?.key) {
      case ReportEnum.FalteringPayments:
				const res = await fetchFalteringPaymentsReport(reportRequest(values));
    		return handleFetchReport(res, ReportEnum.FalteringPayments);
      default:
        return null;
    }
  }

	return (
		<>
			<Card style={{ margin: '20px 50px' }} className="print-none">
				<Loader type="fullscreen" open={loading} />
				<Card.Body style={{ padding: 15 }}>
					<div className="custom-card-header">
						<div
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
								{local.laundryReports}
							</Card.Title>
						</div>
					</div>
						{laundryPdfs.map((pdf, index) => {
              return (
                <Can I={pdf.permission} a="report" key={index}>
                  <Card key={index}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center px-2">
                        <div className="font-weight-bold">
                          <span className="mr-4">
                            #{index + 1}
                          </span>
                          <span>{pdf.local}</span>
                        </div>
												<Button
													type="button"
													variant="default"
                          onClick={() => handlePrint(pdf)}
													title="download"
												>
													<span className="download-icon" aria-hidden="true" />
												</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Can>
              );
            })}
				</Card.Body>
			</Card>
			{showModal && selectedPdf && (
				<ReportsModal
					pdf={selectedPdf}
					show={showModal}
					hideModal={() => setShowModal(false)}
					submit={(values) => handleSubmit(values)}
				/>
			)}
			{printReport === ReportEnum.FalteringPayments && data && (
				<FalteringPayments data={data} fromDate={fromDate} toDate={toDate} />
			)}
		</>
	)
}

export default LaundryReports

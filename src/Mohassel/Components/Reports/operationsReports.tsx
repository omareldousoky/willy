import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { Loader } from "../../../Shared/Components/Loader";
import ReportsModal from "./reportsModal";
import * as local from "../../../Shared/Assets/ar.json";
import Can from "../../config/Can";
import {
    fetchLoansBriefingReport,
    LoansBriefingReportRequest,
} from "../../Services/APIs/Reports/loansBriefingReport";
import Swal from "sweetalert2";
import LoansBriefing2 from "../pdfTemplates/loansBriefing/loansBriefing2";
import { getDate } from "../../../Shared/Services/utils";

export interface PDF {
    key?: string;
    local?: string;
    inputs?: Array<string>;
    permission: string;
}

interface OperationsReportsState {
    showModal?: boolean;
    print?: string;
    pdfsArray?: Array<PDF>;
    selectedPdf: PDF;
    data: any; // TODO: Handle type
    loading: boolean;
    fromDate: string;
    toDate: string;
}

enum Reports {
    LoansBriefing2 = "loansBriefing2",
    LoanOfficersRepaymentRate1 = "loanOfficersRepaymentRate1",
    LoanOfficersRepaymentRate3 = "loanOfficersRepaymentRate3",
}

class OperationsReports extends Component<{}, OperationsReportsState> {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            print: "",
            pdfsArray: [
                {
                    key: Reports.LoansBriefing2,
                    local: "ملخص الحالات والقروض 2",
                    inputs: ["dateFromTo"],
                    permission: "briefingReport",
                },
            ],
            selectedPdf: { permission: "" },
            data: {},
            loading: false,
            fromDate: "",
            toDate: "",
        };
    }
    handlePrint(selectedPdf: PDF) {
        this.setState({ showModal: true, selectedPdf: selectedPdf });
    }
    handleSubmit(values) {
        switch (this.state.selectedPdf.key) {
            case Reports.LoansBriefing2:
                return this.fetchLoansBriefing(values);
            default:
                return null;
        }
    }
    async fetchLoansBriefing(values) {
        this.setState({ loading: true, showModal: false });
        const { fromDate, toDate } = values;
        const request: LoansBriefingReportRequest = {
            startDate: getDate(fromDate),
            endDate: getDate(toDate),
        };

        const res = await fetchLoansBriefingReport(request);
        if (res.status === "success") {
            if (!res.body) {
                this.setState({ loading: false });
                Swal.fire("error", local.noResults);
            } else {
                this.setState(
                    {
                        data: res.body,
                        showModal: false,
                        print: Reports.LoansBriefing2,
                        loading: false,
                    },
                    () => window.print()
                );
            }
        } else {
            this.setState({ loading: false });
            console.log(res);
        }
    }

    render() {
        return (
            <>
                <Card style={{ margin: "20px 50px" }} className="print-none">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body style={{ padding: 15 }}>
                        <div className="custom-card-header">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Card.Title
                                    style={{ marginLeft: 20, marginBottom: 0 }}
                                >
                                    {local.operationsReports}
                                </Card.Title>
                            </div>
                        </div>
                        {this.state.pdfsArray?.map((pdf, index) => {
                            return (
                                <Can I={pdf.permission} a="report" key={index}>
                                    <Card key={index}>
                                        <Card.Body>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    padding: "0 20px",
                                                    fontWeight: "bold",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>
                                                    <span
                                                        style={{
                                                            marginLeft: 40,
                                                        }}
                                                    >
                                                        #{index + 1}
                                                    </span>
                                                    <span>{pdf.local}</span>
                                                </div>
                                                <img
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    alt="download"
                                                    data-qc="download"
                                                    src={require(`../../Assets/green-download.svg`)}
                                                    onClick={() =>
                                                        this.handlePrint(pdf)
                                                    }
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Can>
                            );
                        })}
                    </Card.Body>
                </Card>
                {this.state.showModal && (
                    <ReportsModal
                        pdf={this.state.selectedPdf}
                        show={this.state.showModal}
                        hideModal={() => this.setState({ showModal: false })}
                        submit={(values) => this.handleSubmit(values)}
                    />
                )}
                {this.state.print === Reports.LoansBriefing2 && (
                    <LoansBriefing2
                        data={this.state.data}
                        fromDate={this.state.fromDate}
                        toDate={this.state.toDate}
                    />
                )}
            </>
        );
    }
}

export default OperationsReports;

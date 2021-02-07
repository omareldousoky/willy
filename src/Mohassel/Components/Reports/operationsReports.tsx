import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { Loader } from "../../../Shared/Components/Loader";
import ReportsModal from "./reportsModal";
import * as local from "../../../Shared/Assets/ar.json";
import Can from "../../config/Can";
import { fetchLoansBriefingReport } from "../../Services/APIs/Reports/loansBriefingReport";
import { installmentsDuePerOfficerCustomerCard } from "../../Services/APIs/Reports/installmentsDuePerOfficerCustomerCard";
import { unpaidInstallmentsByOfficer } from "../../Services/APIs/Reports/unpaidInstallmentsByOfficer";
import { fetchUnpaidInstallmentsPerAreaReport } from "../../Services/APIs/Reports/unpaidInstallmentsPerArea";
import Swal from "sweetalert2";
import LoansBriefing2 from "../pdfTemplates/loansBriefing/loansBriefing2";
import UnpaidInst from "../pdfTemplates/unpaidInst/unpaidInst";
import UnpaidInstallmentsByOfficer from "../pdfTemplates/unpaidInstallmentsByOfficer/unpaidInstallmentsByOfficer";
import InstallmentsDuePerOfficerCustomerCard from "../pdfTemplates/installmentsDuePerOfficerCustomerCard/installmentsDuePerOfficerCustomerCard";
import {
  ApiResponse,
  CustomersArrearsRequest,
  OperationsReportRequest,
} from "../../Services/interfaces";
import {
  fetchOfficersBranchPercentPaymentReport,
  fetchOfficersPercentPaymentReport,
} from "../../Services/APIs/Reports/officersPercentPayment";
import OfficersPercentPayment from "../pdfTemplates/officersPercentPayment/officersPercentPayment";
import OfficerBranchPercentPayment from "../pdfTemplates/officersPercentPayment/officersBranchPercentPayment";
import { fetchDueInstallmentsReport } from "../../Services/APIs/Reports/dueInstallments";
import DueInstallments from "../pdfTemplates/dueInstallments/dueInstallments";
import { convertToTimestamp } from "../../../Shared/Services/utils";
import { CustomersArrears } from "../pdfTemplates/customersArrears/customersArrears";
import { fetchCustomersArrearsReport } from "../../Services/APIs/Reports/customersArrears";

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
  OfficersPercentPayment = "officersPercentPayment",
  OfficersBranchPercentPayment = "officersBranchPercentPayment",
  UnpaidInstallmentsByOfficer = "unpaidInstallmentsByOfficer",
  InstallmentsDuePerOfficerCustomerCard = "installmentsDuePerOfficerCustomerCard",
  UnpaidInstallmentsPerArea = "unpaidInstallmentsPerArea",
  DueInstallments = "dueInstallments",
  CustomersArrears = "customersArrears",
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
          inputs: ["dateFromTo", "branches"],
          permission: "briefingReport",
        },
        {
          key: Reports.UnpaidInstallmentsByOfficer,
          local: "الاقساط المستحقة بالمندوب",
          inputs: ["dateFromTo", "branches"],
          permission: "unpaidInstallmentsByOfficer",
        },
        {
          key: Reports.InstallmentsDuePerOfficerCustomerCard,
          local: "الاقساط المستحقة للمندوب كارت العميل",
          inputs: ["dateFromTo", "branches"],
          permission: "installmentsDuePerOfficerCustomerCard",
        },
        {
          key: Reports.UnpaidInstallmentsPerArea,
          local: "قائمة الاقساط الغير مسددة بمناطق العمل",
          inputs: ["dateFromTo", "branches"],
          permission: "unpaidInstallmentsPerArea",
        },
        {
          key: Reports.OfficersPercentPayment,
          local: "نسبة سداد المندوبين 1",
          inputs: ["dateFromTo", "branches"],
          permission: "officerPercentPayment",
        },
        {
          key: Reports.OfficersBranchPercentPayment,
          local: "نسبة سداد المندوبين 3",
          inputs: ["dateFromTo", "branches"],
          permission: "officerBranchPercentPayment",
        },
        {
          key: Reports.DueInstallments,
          local: "ملخص الأقساط المستحقة (تقرير السداد الجزئي)",
          inputs: ["dateFromTo", "branches"],
          permission: "dueInstallments",
        },
        {
          key: Reports.CustomersArrears,
          local: "متأخرات المندوب لم يستحق أو مسدد جزئي",
          inputs: ["date", "branches", "loanOfficers"],
          permission: "customersArrears",
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
    // reset data
    this.setState({
      showModal: true,
      selectedPdf: selectedPdf,
      data: {},
      fromDate: "",
      toDate: "",
    });
  }
  handleSubmit(values) {
    const branches = values.branches.map((branch) => branch._id);
    values.branches = branches.includes("") ? [] : branches;
    const { fromDate, toDate } = values;
    this.setState({ loading: true, showModal: false, fromDate, toDate });
    switch (this.state.selectedPdf.key) {
      case Reports.LoansBriefing2:
        return this.fetchLoansBriefing(values);
      case Reports.UnpaidInstallmentsByOfficer:
        return this.fetchUnpaidInstallmentsByOfficer(values);
      case Reports.InstallmentsDuePerOfficerCustomerCard:
        return this.fetchInstallmentsDuePerOfficerCustomerCard(values);
      case Reports.UnpaidInstallmentsPerArea:
        return this.fetchUnpaidInstallments(values);
      case Reports.OfficersPercentPayment:
        return this.fetchOfficersPercentPayment(values);
      case Reports.OfficersBranchPercentPayment:
        return this.fetchOfficersBranchPercentPayment(values);
      case Reports.DueInstallments:
        return this.fetchDueInstallments(values);
      case Reports.CustomersArrears:
        return this.fetchCustomersArrears(values);
      default:
        return null;
    }
  }

  handleFetchReport(res: ApiResponse<any>, report: Reports) {
    if (res.status === "success") {
      if (!res.body || !Object.keys(res.body).length) {
        this.setState({ loading: false });
        Swal.fire("error", local.noResults);
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: report,
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

  reportRequest(values): OperationsReportRequest {
    const { fromDate, toDate, branches } = values;
    return {
      startDate: fromDate,
      endDate: toDate,
      branches,
    };
  }
  async fetchLoansBriefing(values) {
    const res = await fetchLoansBriefingReport(this.reportRequest(values));
    this.handleFetchReport(res, Reports.LoansBriefing2);
  }
  async fetchInstallmentsDuePerOfficerCustomerCard(values) {
    const res = await installmentsDuePerOfficerCustomerCard(
      this.reportRequest(values)
    );
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.InstallmentsDuePerOfficerCustomerCard
    );
  }

  async fetchUnpaidInstallmentsByOfficer(values) {
    const res = await unpaidInstallmentsByOfficer(this.reportRequest(values));
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsByOfficer
    );
  }

  async fetchUnpaidInstallments(values) {
    const res = await fetchUnpaidInstallmentsPerAreaReport(
      this.reportRequest(values)
    );
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsPerArea
    );
  }

  async fetchOfficersPercentPayment(values) {
    const res = await fetchOfficersPercentPaymentReport(
      this.reportRequest(values)
    );
    this.handleFetchReport(res, Reports.OfficersPercentPayment);
  }

  async fetchOfficersBranchPercentPayment(values) {
    const res = await fetchOfficersBranchPercentPaymentReport(
      this.reportRequest(values)
    );
    this.handleFetchReport(res, Reports.OfficersBranchPercentPayment);
  }

  async fetchDueInstallments(values) {
    const { fromDate, toDate } = values;
    const res = await fetchDueInstallmentsReport(
      this.reportRequest({
        ...values,
        fromDate: convertToTimestamp(fromDate),
        toDate: convertToTimestamp(toDate),
      })
    );
    this.handleFetchReport(res, Reports.DueInstallments);
  }

  async fetchCustomersArrears(values) {
    const { date, branches, loanOfficers } = values;
    const res = await fetchCustomersArrearsReport({
      date,
      branches,
      loanOfficers,
    } as CustomersArrearsRequest);
    this.handleFetchReport(res, Reports.CustomersArrears);
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
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
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
                          justifyContent: "space-between",
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
                          onClick={() => this.handlePrint(pdf)}
                          // TODO: Remove
                          // onClick={() => window.print()}
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
        {this.state.print === Reports.InstallmentsDuePerOfficerCustomerCard ? (
          <InstallmentsDuePerOfficerCustomerCard
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        ) : null}
        {this.state.print === Reports.UnpaidInstallmentsByOfficer ? (
          <UnpaidInstallmentsByOfficer
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        ) : null}
        {this.state.print === Reports.UnpaidInstallmentsPerArea && (
          <UnpaidInst
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.OfficersPercentPayment && (
          <OfficersPercentPayment
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.OfficersBranchPercentPayment && (
          <OfficerBranchPercentPayment
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.DueInstallments && (
          <DueInstallments
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.CustomersArrears && (
          <CustomersArrears data={this.state.data} date={this.state.toDate} />
        )}
      </>
    );
  }
}

export default OperationsReports;
